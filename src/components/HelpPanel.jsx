import React from 'react';
import { references } from '../lib/citations';

export default function HelpPanel() {
  return (
    <section className="panel">
      <h2>Reference links</h2>
      <ul>
        <li><a href={references.patchNotes} target="_blank" rel="noreferrer">Official patch notes</a></li>
        <li><a href={references.helpCenterTransfers} target="_blank" rel="noreferrer">Funcom transfer help</a></li>
        <li><a href={references.gamingToolsServerStatus} target="_blank" rel="noreferrer">gaming.tools server status</a></li>
        <li><a href={references.nitradoGuide} target="_blank" rel="noreferrer">Nitrado guide</a></li>
      </ul>
    </section>
  );
}
