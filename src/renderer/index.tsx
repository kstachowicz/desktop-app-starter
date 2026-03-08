// This file boots the React application.
// Most UI work starts in App.tsx and then grows from there.

import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);