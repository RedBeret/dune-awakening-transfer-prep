import React from 'react';
import { checklistItems } from '../data/checklistItems';
import { useApp } from '../state/AppContext';

export default function ChecklistPanel() {
  const { state, actions } = useApp();
  const doneCount = Object.values(state.checklist).filter(Boolean).length;
  const total = checklistItems.length;
  const allDone = actions.areChecklistComplete();

  return (
    <section className="panel">
      <h2>Transfer preparation checklist</h2>
      <p className="small">
        Mark each item as complete. This is local only. It is safe to refresh the page.
      </p>

      <div className="stat-row">
        <div className="stat">
          <span className="label">Progress</span>
          <span className="value">{doneCount} / {total}</span>
        </div>
        <div className="stat">
          <span className="label">Server chooser</span>
          <span className="value">{allDone ? 'Ready' : 'Pending prep'}</span>
        </div>
      </div>

      <ul className="checklist">
        {checklistItems.map((item) => (
          <li key={item.id} className="checklist-item">
            <div className="check-row">
              <input
                id={`check-${item.id}`}
                type="checkbox"
                checked={Boolean(state.checklist[item.id])}
                onChange={() => actions.toggleChecklist(item.id)}
              />
              <div style={{ flex: 1 }}>
                <label htmlFor={`check-${item.id}`} style={{ color: 'var(--text)', display: 'block' }}>
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
          Finish the required prep steps before you transfer. This app does not perform the transfer, it only helps you avoid mistakes.
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
