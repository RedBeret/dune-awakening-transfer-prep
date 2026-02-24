import { checklistItems } from '../data/checklistItems';
import { logger } from './logger';
import { validateChecklistMap } from './validators';

export const STORAGE_KEY = 'duneTransferPrep:state';
export const STORAGE_VERSION = 1;

const checklistIds = checklistItems.map((i) => i.id);

export const defaultState = {
  version: STORAGE_VERSION,
  checklist: Object.fromEntries(checklistIds.map((id) => [id, false])),
  preferences: {
    preferredRegion: 'ANY',
    onlyOnline: true,
    hideFull: false,
    strictRegion: false,
    minCapacity: 0,
    search: '',
    weights: {
      freeCapacity: 45,
      activePopulation: 20,
      regionMatch: 15,
      statusPenalty: 40,
      occupancyTarget: 20
    }
  },
  snapshots: [],
  ui: {
    activeTab: 'checklist'
  }
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid persisted state');
    if (parsed.version !== STORAGE_VERSION) {
      logger.warn('state_version_mismatch_reset', { found: parsed.version, expected: STORAGE_VERSION });
      return structuredClone(defaultState);
    }

    const safe = structuredClone(defaultState);
    safe.checklist = validateChecklistMap(parsed.checklist, checklistIds);
    safe.preferences = {
      ...safe.preferences,
      ...(parsed.preferences || {}),
      weights: {
        ...safe.preferences.weights,
        ...((parsed.preferences && parsed.preferences.weights) || {})
      }
    };
    safe.snapshots = Array.isArray(parsed.snapshots) ? parsed.snapshots : [];
    safe.ui = {
      ...safe.ui,
      ...(parsed.ui || {})
    };
    return safe;
  } catch (error) {
    logger.error('load_state_failed', { error: String(error) });
    return structuredClone(defaultState);
  }
}

export function saveState(state) {
  const payload = {
    version: STORAGE_VERSION,
    checklist: state.checklist,
    preferences: state.preferences,
    snapshots: state.snapshots,
    ui: { activeTab: state.ui.activeTab }
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    logger.error('save_state_failed', { error: String(error) });
  }
}
