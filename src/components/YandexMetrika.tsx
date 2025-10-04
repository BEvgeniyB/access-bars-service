import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent, YMEvents } from '@/utils/yandexMetrika';
import { trackPageVisit } from '@/utils/analytics';

const YandexMetrika = () => {
  const location = useLocation();

  useEffect(() => {
    const url = window.location.origin + location.pathname + location.search + location.hash;
    
    trackPageView(url);
    trackPageVisit(location.pathname);
    
    const pageEvents: Record<string, string> = {
      '/access-bars': YMEvents.ACCESS_BARS_PAGE,
      '/massage': YMEvents.MASSAGE_PAGE,
      '/healing': YMEvents.HEALING_PAGE,
      '/training': YMEvents.TRAINING_PAGE
    };
    
    const event = pageEvents[location.pathname];
    if (event) {
      trackEvent(event);
    }
  }, [location]);

  return null;
};

export default YandexMetrika;