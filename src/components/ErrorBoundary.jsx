import React from 'react';
import { logger } from '../lib/logger';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('ui_error_boundary', { error: String(error), errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="layout">
          <section className="panel">
            <h2>App error</h2>
            <div className="callout error">
              <div className="small">
                Something failed in the UI. Refresh the page. If it keeps failing, clear local state in DevTools and reload.
              </div>
              <pre className="mono">{String(this.state.error)}</pre>
            </div>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}
