import React from 'react';

function scoreClass(score) {
  if (score >= 55) return 'score-good';
  if (score >= 30) return 'score-warn';
  return 'score-bad';
}

export default function ServerTable({ rows }) {
  if (!rows.length) {
    return <div className="callout">No servers match the current filters.</div>;
  }

  return (
    <div className="table-wrap" role="region" aria-label="Ranked server table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>World</th>
            <th>Region</th>
            <th>Datacenter</th>
            <th>Status</th>
            <th>Players</th>
            <th>Cap</th>
            <th>% Full</th>
            <th>Score</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((w, idx) => {
            const pct = ((w.players / w.capacity) * 100).toFixed(1);
            const b = w.score.breakdown;
            return (
              <tr key={`${w.name}:${w.datacenter}`}>
                <td>{idx + 1}</td>
                <td>{w.name}</td>
                <td>{w.region}</td>
                <td>{w.datacenter}</td>
                <td>
                  <span className={`status-pill ${String(w.status).toLowerCase()}`}>{w.status}</span>
                </td>
                <td>{w.players}</td>
                <td>{w.capacity}</td>
                <td>{pct}%</td>
                <td className={scoreClass(w.score.total)}>{w.score.total}</td>
                <td className="small">
                  free {b.freeCapacityScore}, active {b.activePopulationScore}, region {b.regionMatchScore}
                  {b.statusPenalty ? `, penalty -${b.statusPenalty}` : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
