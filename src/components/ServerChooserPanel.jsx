import React, { useMemo } from 'react';
import { useApp } from '../state/AppContext';
import { sortAndScoreServers } from '../lib/scoring';
import { latestSnapshot } from '../lib/snapshots';
import { featureFlags } from '../config/featureFlags';
import ServerTable from './ServerTable';

function parseIntSafe(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export default function ServerChooserPanel() {
  const { state, actions } = useApp();
  const latest = latestSnapshot(state.snapshots);

  const rows = useMemo(() => {
    if (!latest?.worlds) return [];
    let worlds = [...latest.worlds];

    if (state.preferences.onlyOnline) {
      worlds = worlds.filter((w) => w.status === 'Online');
    }

    if (state.preferences.hideFull) {
      worlds = worlds.filter((w) => w.players < w.capacity);
    }

    if (state.preferences.preferredRegion && state.preferences.preferredRegion !== 'ANY') {
      // Still include all regions but sort uses region weighting. Optional hard filter below:
      if (state.preferences.strictRegion) {
        worlds = worlds.filter((w) => w.region === state.preferences.preferredRegion);
      }
    }

    if (state.preferences.minCapacity > 0) {
      worlds = worlds.filter((w) => w.capacity >= state.preferences.minCapacity);
    }

    const q = String(state.preferences.search || '').trim().toLowerCase();
    if (q) {
      worlds = worlds.filter((w) =>
        [w.name, w.region, w.datacenter, w.type].some((field) => String(field).toLowerCase().includes(q))
      );
    }

    return sortAndScoreServers(
      worlds,
      { preferredRegion: state.preferences.preferredRegion, minCapacity: state.preferences.minCapacity },
      state.preferences.weights
    );
  }, [latest, state.preferences]);

  const totals = useMemo(() => {
    if (!latest?.worlds) return { worlds: 0, players: 0, capacity: 0 };
    return latest.worlds.reduce(
      (acc, w) => {
        acc.worlds += 1;
        acc.players += w.players;
        acc.capacity += w.capacity;
        return acc;
      },
      { worlds: 0, players: 0, capacity: 0 }
    );
  }, [latest]);

  return (
    <section className="panel">
      <h2>Server chooser</h2>
      <p className="small">
        Ranks servers from your latest snapshot. Import new snapshots in the Snapshots tab.
      </p>

      <div className="stat-row">
        <div className="stat">
          <span className="label">Snapshot</span>
          <span className="value">{latest ? new Date(latest.capturedAt).toLocaleString() : 'None'}</span>
        </div>
        <div className="stat">
          <span className="label">Worlds</span>
          <span className="value">{totals.worlds}</span>
        </div>
        <div className="stat">
          <span className="label">Population</span>
          <span className="value">{totals.players} / {totals.capacity}</span>
        </div>
      </div>

      <div className="controls" style={{ marginTop: 10 }}>
        <div className="control">
          <label htmlFor="region">Preferred region</label>
          <select
            id="region"
            value={state.preferences.preferredRegion}
            onChange={(e) => actions.setPreference('preferredRegion', e.target.value)}
          >
            <option value="ANY">Any</option>
            <option value="NA">NA</option>
            <option value="EU">EU</option>
            <option value="OCE">OCE</option>
            <option value="SA">SA</option>
            <option value="ASIA">ASIA</option>
          </select>
        </div>

        <div className="control">
          <label htmlFor="min-cap">Min capacity</label>
          <input
            id="min-cap"
            type="number"
            min="0"
            step="50"
            value={state.preferences.minCapacity}
            onChange={(e) => actions.setPreference('minCapacity', Math.max(0, parseIntSafe(e.target.value)))}
          />
        </div>

        <div className="control wide">
          <label htmlFor="search">Search world or datacenter</label>
          <input
            id="search"
            type="text"
            placeholder="Harmony, NA, Amsterdam..."
            value={state.preferences.search}
            onChange={(e) => actions.setPreference('search', e.target.value)}
          />
        </div>

        <div className="control">
          <label htmlFor="only-online">Only online</label>
          <select
            id="only-online"
            value={String(state.preferences.onlyOnline)}
            onChange={(e) => actions.setPreference('onlyOnline', e.target.value === 'true')}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="control">
          <label htmlFor="hide-full">Hide full</label>
          <select
            id="hide-full"
            value={String(state.preferences.hideFull)}
            onChange={(e) => actions.setPreference('hideFull', e.target.value === 'true')}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>

      {featureFlags.enableAdvancedWeights && (
        <details style={{ marginTop: 10 }}>
          <summary className="small" style={{ cursor: 'pointer' }}>
            Advanced scoring weights
          </summary>
          <div className="grid two" style={{ marginTop: 8 }}>
            {Object.entries(state.preferences.weights).map(([key, value]) => (
              <div key={key} className="control">
                <label htmlFor={`w-${key}`}>{key}</label>
                <input
                  id={`w-${key}`}
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => actions.setWeight(key, parseIntSafe(e.target.value, value))}
                />
              </div>
            ))}
          </div>
        </details>
      )}

      {!actions.areChecklistComplete() && (
        <div className="callout warning" style={{ marginTop: 10 }}>
          Checklist is not complete. You can still compare servers now, but do the prep steps before you transfer.
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <ServerTable rows={rows} />
      </div>
    </section>
  );
}
