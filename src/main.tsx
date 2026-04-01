import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force redirect to home on page reload
const navEntries = performance.getEntriesByType('navigation');
if (navEntries.length > 0) {
  const navEntry = navEntries[0] as PerformanceNavigationTiming;
  if (navEntry.type === 'reload') {
    window.history.replaceState(null, '', '/');
  }
} else if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
  window.history.replaceState(null, '', '/');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
