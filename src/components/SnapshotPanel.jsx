import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../state/AppContext';
import { latestSnapshot, diffSnapshots } from '../lib/snapshots';
import { snapshotsToCsv, csvToSnapshot } from '../lib/csv';

function downloadText(filename, text, mime = 'text/plain') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SnapshotPanel() {
  const { state, actions } = useApp();
  const [rawText, setRawText] = useState('');
  const [format, setFormat] = useState('json');
  const fileInputRef = useRef(null);

  const latest = latestSnapshot(state.snapshots);
  const previous = state.snapshots.length > 1 ? state.snapshots[state.snapshots.length - 2] : null;

  const diffs = useMemo(() => diffSnapshots(previous, latest).slice(0, 20), [previous, latest]);

  const onImportText = () => {
    if (!rawText.trim()) return;
    try {
      const snapshot = format === 'json' ? JSON.parse(rawText) : csvToSnapshot(rawText);
      actions.importSnapshot(snapshot, format === 'json' ? 'json-paste' : 'csv-paste');
      setRawText('');
    } catch (error) {
      actions.notify('error', 'Import failed', String(error));
    }
  };

  const onFilePick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRawText(text);
    if (file.name.toLowerCase().endsWith('.csv')) {
      setFormat('csv');
    } else {
      setFormat('json');
    }
  };

  const exportJson = () => {
    downloadText('dune-transfer-snapshots.json', JSON.stringify(state.snapshots, null, 2), 'application/json');
  };

  const exportCsv = () => {
    downloadText('dune-transfer-snapshots.csv', snapshotsToCsv(state.snapshots), 'text/csv');
  };

  return (
    <section className="panel">
      <h2>Snapshots import and export</h2>
      <p className="small">
        Paste or import a server snapshot. Expected JSON shape is
        <span className="inline-code">{" { capturedAt, source, worlds: [] } "}</span>
        or CSV with columns
        <span className="inline-code">capturedAt,name,players,capacity</span>.
      </p>

      <div className="grid two">
        <div className="panel" style={{ margin: 0 }}>
          <h2 style={{ marginTop: 0 }}>Import</h2>
          <div className="controls" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 8 }}>
            <div className="control">
              <label htmlFor="import-format">Format</label>
              <select id="import-format" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div className="control">
              <label htmlFor="file-pick">File</label>
              <input
                id="file-pick"
                ref={fileInputRef}
                type="file"
                accept=".json,.csv,text/csv,application/json"
                onChange={onFilePick}
              />
            </div>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={format === 'json'
              ? '{ "capturedAt":"2026-02-23T19:00:00Z", "source":"manual", "worlds":[...] }'
              : 'capturedAt,source,name,region,datacenter,players,capacity,status,type'}
          />
          <div className="btn-row">
            <button className="primary" onClick={onImportText}>Import snapshot</button>
            <button onClick={() => setRawText('')}>Clear</button>
          </div>
        </div>

        <div className="panel" style={{ margin: 0 }}>
          <h2 style={{ marginTop: 0 }}>Export and history</h2>
          <div className="small">Snapshots stored locally: {state.snapshots.length}</div>
          <div className="small">
            Latest: {latest ? new Date(latest.capturedAt).toLocaleString() : 'None'}
          </div>

          <div className="btn-row">
            <button onClick={exportJson} disabled={!state.snapshots.length}>Export JSON</button>
            <button onClick={exportCsv} disabled={!state.snapshots.length}>Export CSV</button>
            <button className="warn" onClick={actions.resetAll}>Reset local data</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <h2 style={{ marginBottom: 6 }}>Latest deltas</h2>
            {!latest || !previous ? (
              <div className="small">Import at least 2 snapshots to see deltas.</div>
            ) : (
              <ul className="diffs">
                {diffs.map((d) => {
                  const className = d.delta > 0 ? 'diff-up' : d.delta < 0 ? 'diff-down' : 'diff-flat';
                  const arrow = d.delta > 0 ? '▲' : d.delta < 0 ? '▼' : '•';
                  return (
                    <li key={d.name} className={className}>
                      {arrow} {d.name}: {d.delta >= 0 ? '+' : ''}{d.delta} (now {d.currPlayers}/{d.currCapacity})
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
