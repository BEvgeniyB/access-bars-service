import API_ENDPOINTS from '@/config/api';

// Analytics utility for tracking page visits
export const trackPageVisit = async (pageUrl: string) => {
  try {
    // Check if tracking is enabled
    const trackingEnabled = localStorage.getItem('analytics_tracking_enabled') !== 'false';
    if (!trackingEnabled) {
      return;
    }

    // Skip tracking for preview and development domains
    const hostname = window.location.hostname;
    const isPreview = hostname.includes('preview--') || hostname.includes('.poehali.dev');
    const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
    
    if (isPreview || isDevelopment) {
      return;
    }

    // Generate session ID if not exists
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session', sessionId);
    }

    // Get referrer
    const referrer = document.referrer || '';

    // Send analytics data
    const response = await fetch(API_ENDPOINTS.analytics, {
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
      // Silent fail for analytics
    }
  } catch (error) {
    // Silent fail for analytics
  }
};

// Hook for automatic page tracking
export const usePageTracking = () => {
  const trackCurrentPage = () => {
    trackPageVisit(window.location.pathname);
  };

  return { trackCurrentPage };
};