import React from 'react';
import { getMetricsSnapshot } from '../lib/metrics';

export default function Footer() {
  const metrics = getMetricsSnapshot();
  return (
    <footer className="footer">
      <div>
        Local metrics:
        <span className="inline-code" style={{ marginLeft: 8 }}>
          imports {metrics.snapshot_import_success || 0}
        </span>
        <span className="inline-code" style={{ marginLeft: 8 }}>
          checklist toggles {metrics.checklist_toggles || 0}
        </span>
      </div>
    </footer>
  );
}
