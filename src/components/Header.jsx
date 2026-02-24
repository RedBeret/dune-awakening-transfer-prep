import React from 'react';

export default function Header({ activeTab, onTabChange, checklistComplete }) {
  return (
    <header className="header">
      <div className="header-row">
        <div className="brand">
          Dune Awakening Transfer Prep
          <small>frontend only, local-first</small>
        </div>
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => onTabChange('checklist')}
          >
            Checklist
          </button>
          <button
            className={`tab-btn ${activeTab === 'servers' ? 'active' : ''}`}
            onClick={() => onTabChange('servers')}
          >
            Server Chooser
            <span className="badge">{checklistComplete ? 'ready' : 'prep first'}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'snapshots' ? 'active' : ''}`}
            onClick={() => onTabChange('snapshots')}
          >
            Snapshots
          </button>
        </div>
      </div>
      <div className="banner">
        Use this as a preflight tool. It stores your checklist and server snapshots locally in your browser only.
      </div>
    </header>
  );
}
