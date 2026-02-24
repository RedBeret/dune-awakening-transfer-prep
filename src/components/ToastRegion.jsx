import React, { useEffect } from 'react';

export default function ToastRegion({ toasts = [], onDismiss }) {
  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => onDismiss(t.id), t.kind === 'error' ? 7000 : 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, onDismiss]);

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind || 'info'}`}>
          <div className="title">
            <span>{t.title}</span>
            <button onClick={() => onDismiss(t.id)} aria-label="Dismiss notification">
              ×
            </button>
          </div>
          <div className="small">{t.detail}</div>
        </div>
      ))}
    </div>
  );
}
