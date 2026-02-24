import React from 'react';
import { AppProvider, useApp } from './state/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import ChecklistPanel from './components/ChecklistPanel';
import ServerChooserPanel from './components/ServerChooserPanel';
import SnapshotPanel from './components/SnapshotPanel';
import Footer from './components/Footer';
import ToastRegion from './components/ToastRegion';

function Shell() {
  const { state, actions } = useApp();
  const allDone = actions.areChecklistComplete();

  return (
    <div className="app-shell">
      <Header
        activeTab={state.ui.activeTab}
        onTabChange={actions.setActiveTab}
        checklistComplete={allDone}
      />
      <main className="layout">
        {state.ui.activeTab === 'checklist' && <ChecklistPanel />}
        {state.ui.activeTab === 'servers' && <ServerChooserPanel />}
        {state.ui.activeTab === 'snapshots' && <SnapshotPanel />}
      </main>
      <Footer />
      <ToastRegion toasts={state.ui.toasts} onDismiss={actions.dismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Shell />
      </AppProvider>
    </ErrorBoundary>
  );
}
