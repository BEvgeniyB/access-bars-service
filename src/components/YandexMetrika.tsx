import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent, YMEvents } from '@/utils/yandexMetrika';

const YandexMetrika = () => {
  const location = useLocation();

  useEffect(() => {
    // Отслеживаем переходы между страницами в SPA
    const url = window.location.origin + location.pathname + location.search + location.hash;
    trackPageView(url);
    
    // Дополнительные цели для важных страниц
    switch (location.pathname) {
      case '/access-bars':
        trackEvent(YMEvents.ACCESS_BARS_PAGE);
        break;
      case '/massage':
        trackEvent(YMEvents.MASSAGE_PAGE);
        break;
      case '/healing':
        trackEvent(YMEvents.HEALING_PAGE);
        break;
      case '/training':
        trackEvent(YMEvents.TRAINING_PAGE);
        break;
    }
  }, [location]);

  return null;
};

export default YandexMetrika;