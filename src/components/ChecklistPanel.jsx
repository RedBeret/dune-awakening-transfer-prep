import React from 'react';
import { checklistItems } from '../data/checklistItems';
import { useApp } from '../state/AppContext';

export default function ChecklistPanel() {
  const { state, actions } = useApp();
  const doneCount = Object.values(state.checklist).filter(Boolean).length;
  const total = checklistItems.length;
  const allDone = actions.areChecklistComplete();
  const progressPct = Math.round((doneCount / total) * 100);

  return (
    <section className="panel dune-panel">
      <div className="dune-heading">
        <p className="dune-kicker">Landsraad Transfer Protocol</p>
        <h2>Arrakis Readiness Checklist</h2>
      </div>
      <p className="small">
        Complete each rite before crossing worlds. Data is local only, and safe to keep between refreshes.
      </p>

      <div className="spice-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct}>
        <div className="spice-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="small">Spice alignment: {progressPct}%</div>

      <div className="stat-row">
        <div className="stat dune-stat">
          <span className="label">Rites completed</span>
          <span className="value">{doneCount} / {total}</span>
        </div>
        <div className="stat dune-stat">
          <span className="label">Navigator status</span>
          <span className="value">{allDone ? 'Path is clear' : 'Awaiting rites'}</span>
        </div>
      </div>

      <ul className="checklist">
        {checklistItems.map((item) => (
          <li key={item.id} className={`checklist-item dune-checklist-item ${state.checklist[item.id] ? 'complete' : ''}`}>
            <div className="check-row">
              <input
                id={`check-${item.id}`}
                type="checkbox"
                checked={Boolean(state.checklist[item.id])}
                onChange={() => actions.toggleChecklist(item.id)}
              />
              <div style={{ flex: 1 }}>
                <label htmlFor={`check-${item.id}`} className="dune-item-label">
                  <strong>{item.title}</strong>
                </label>
                <div className="small">{item.detail}</div>
              </div>
              <span className={`kind-pill ${item.kind}`}>{item.kind}</span>
            </div>
          </li>
        ))}
      </ul>

      {!allDone && (
        <div className="callout warning" style={{ marginTop: 10 }}>
          Complete the required rites before transfer. This tool does not execute transfers; it helps you avoid costly mistakes.
        </div>
      )}

      {allDone && (
        <div className="btn-row">
          <button className="primary" onClick={() => actions.setActiveTab('servers')}>
            Open Server Chooser
          </button>
        </div>
      )}
    </section>
  );
}
