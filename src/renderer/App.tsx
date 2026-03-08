// This file is the first visible screen of the template.
// Add new pages or layout shells here as the app grows.

import { useEffect, useState } from 'react';

import type { HelloMessage } from '../api';

type Status = 'loading' | 'ready' | 'error';

export const App = (): JSX.Element => {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState<HelloMessage | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadMessage = async (): Promise<void> => {
      try {
        const response = await window.api.getHelloMessage();

        if (!isMounted) {
          return;
        }

        setMessage(response);
        setStatus('ready');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unknown startup error.');
        setStatus('error');
      }
    };

    void loadMessage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="app-shell">
      <div className="backdrop backdrop-left" />
      <div className="backdrop backdrop-right" />

      <section className="hero-card">
        <p className="eyebrow">Desktop starter template</p>
        <h1>hello from *YOUR* new app!</h1>
        <p className="lede">
          A template starter built using Electron + React + SQLite, ready for future features.
        </p>

        <div className="status-panel">
          <span className={`status-pill status-${status}`}>{status}</span>

          {status === 'loading' && (
            <p className="status-copy" data-testid="loading-message">
              Loading the first message from SQLite...
            </p>
          )}

          {status === 'ready' && message && (
            <div className="message-card">
              <p className="message-label">Database response</p>
              <p className="message-text" data-testid="hello-message">
                {message.text}
              </p>
              <p className="message-meta">Served from {message.source} through the preload bridge.</p>
            </div>
          )}

          {status === 'error' && (
            <p className="status-copy error-copy" data-testid="error-message">
              {errorMessage}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};