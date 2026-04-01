import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForceRedirectOnReload() {
  const navigate = useNavigate();

  useEffect(() => {
    const navEntries = performance.getEntriesByType('navigation');
    let isReload = false;
    
    if (navEntries.length > 0) {
      const navEntry = navEntries[0] as PerformanceNavigationTiming;
      if (navEntry.type === 'reload') {
        isReload = true;
      }
    } else if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
      isReload = true;
    }

    if (isReload) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return null;
}
