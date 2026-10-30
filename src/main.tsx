import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { installTheme } from './foundations/theme/theme';
import { App } from './app/App';
import './app/global.css';

installTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
