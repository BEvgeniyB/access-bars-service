// Analytics utility for tracking page visits
export const trackPageVisit = async (pageUrl: string) => {
  try {
    // Generate session ID if not exists
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session', sessionId);
    }

    // Get referrer
    const referrer = document.referrer || '';

    // Send analytics data
    const response = await fetch('https://functions.poehali.dev/6a462c80-d75e-469f-833c-9e8502c34560', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: pageUrl,
        referrer: referrer,
        session_id: sessionId
      })
    });

    if (!response.ok) {
      console.warn('Analytics tracking failed:', response.status);
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

// Hook for automatic page tracking
export const usePageTracking = () => {
  const trackCurrentPage = () => {
    trackPageVisit(window.location.pathname);
  };

  return { trackCurrentPage };
};