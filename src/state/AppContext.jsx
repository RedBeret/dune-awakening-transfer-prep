import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { loadState, saveState, defaultState } from '../lib/storage';
import { fetchJsonWithRetry } from '../lib/http';
import { logger } from '../lib/logger';
import { incrementMetric } from '../lib/metrics';
import { mergeSnapshots, latestSnapshot } from '../lib/snapshots';
import { normalizeSnapshot } from '../lib/validators';
import { fallbackServerSnapshot } from '../data/fallbackServers';

const AppContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload, ui: { ...state.ui, ...(action.payload.ui || {}) } };
    case 'SET_TAB':
      return { ...state, ui: { ...state.ui, activeTab: action.tab } };
    case 'TOGGLE_CHECK':
      return {
        ...state,
        checklist: {
          ...state.checklist,
          [action.id]: !state.checklist[action.id]
        }
      };
    case 'SET_PREF':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.key]: action.value
        }
      };
    case 'SET_WEIGHT':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          weights: {
            ...state.preferences.weights,
            [action.key]: action.value
          }
        }
      };
    case 'UPSERT_SNAPSHOTS':
      return {
        ...state,
        snapshots: action.snapshots
      };
    case 'MERGE_SNAPSHOT':
      return {
        ...state,
        snapshots: mergeSnapshots(state.snapshots, action.snapshot)
      };
    case 'RESET_ALL':
      return structuredClone(defaultState);
    case 'ENQUEUE_TOAST':
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: [...(state.ui.toasts || []), action.toast]
        }
      };
    case 'DISMISS_TOAST':
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: (state.ui.toasts || []).filter((t) => t.id !== action.id)
        }
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    ...structuredClone(defaultState),
    ui: { ...structuredClone(defaultState).ui, toasts: [] }
  });

  useEffect(() => {
    const persisted = loadState();
    dispatch({ type: 'INIT', payload: { ...persisted, ui: { ...persisted.ui, toasts: [] } } });
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state.checklist, state.preferences, state.snapshots, state.ui.activeTab]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const payload = await fetchJsonWithRetry('./data/servers.sample.json', {
          timeoutMs: 3500,
          retries: 2,
          backoffMs: 350
        });
        const snap = normalizeSnapshot(payload);
        if (!active) return;
        dispatch({ type: 'MERGE_SNAPSHOT', snapshot: snap });
        logger.info('loaded_static_server_snapshot', { worlds: snap.worlds.length });
      } catch (error) {
        logger.warn('failed_loading_static_snapshot_fallback', { error: String(error) });
        if (!active) return;
        dispatch({ type: 'MERGE_SNAPSHOT', snapshot: fallbackServerSnapshot });
        enqueueToast(dispatch, 'info', 'Using embedded sample data', 'Static snapshot file could not be loaded.');
      }
    })();

    return () => {
      active = false;
    };
    // Intentionally run once on boot. Snapshot merge is idempotent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = useMemo(() => {
    return {
      setActiveTab(tab) {
        dispatch({ type: 'SET_TAB', tab });
      },
      toggleChecklist(id) {
        incrementMetric('checklist_toggles');
        dispatch({ type: 'TOGGLE_CHECK', id });
      },
      setPreference(key, value) {
        dispatch({ type: 'SET_PREF', key, value });
      },
      setWeight(key, value) {
        dispatch({ type: 'SET_WEIGHT', key, value });
      },
      areChecklistComplete() {
        return Object.values(state.checklist).every(Boolean);
      },
      importSnapshot(snapshotRaw, sourceHint = 'manual-import') {
        try {
          const normalized = normalizeSnapshot({ ...snapshotRaw, source: snapshotRaw.source || sourceHint });
          dispatch({ type: 'MERGE_SNAPSHOT', snapshot: normalized });
          incrementMetric('snapshot_import_success');
          enqueueToast(dispatch, 'success', 'Snapshot imported', `${normalized.worlds.length} worlds loaded.`);
          return { ok: true };
        } catch (error) {
          incrementMetric('snapshot_import_error');
          logger.error('snapshot_import_failed', { error: String(error) });
          enqueueToast(dispatch, 'error', 'Import failed', String(error));
          return { ok: false, error };
        }
      },
      notify(kind, title, detail) {
        enqueueToast(dispatch, kind, title, detail);
      },
      resetAll() {
        dispatch({ type: 'RESET_ALL' });
        enqueueToast(dispatch, 'info', 'Local state reset', 'Checklist, preferences and snapshots were cleared.');
      },
      dismissToast(id) {
        dispatch({ type: 'DISMISS_TOAST', id });
      },
      latestSnapshot() {
        return latestSnapshot(state.snapshots);
      }
    };
  }, [state.checklist, state.preferences, state.snapshots]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function enqueueToast(dispatch, kind, title, detail) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  dispatch({ type: 'ENQUEUE_TOAST', toast: { id, kind, title, detail } });
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
