import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { installTheme } from './foundations/theme/theme';
import { App } from './app/App';
import './app/global.css';

installTheme();

// Loaded only on request, so players never carry the meter's code or its per-frame work.
if (new URLSearchParams(location.search).has('fps')) {
  void import('./foundations/perf/fpsMeter').then((meter) => meter.installFpsMeter());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
