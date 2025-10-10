import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент для правильной обработки 404 ошибок в SPA
 * Устанавливает мета-теги и отправляет сигналы поисковым роботам
 */
const SEO404Handler = () => {
  const location = useLocation();

  useEffect(() => {
    // Проверяем, является ли текущий маршрут 404
    const is404Page = location.pathname !== '/' && 
                     !location.pathname.match(/^\/(access-bars|training|healing|massage|reviews|analytics|admin)$/);

    if (is404Page) {
      // Устанавливаем статус 404 для поисковых роботов
      if (typeof window !== 'undefined') {
        // Создаем мета-тег для статуса 404
        const existingMeta = document.querySelector('meta[name="prerender-status-code"]');
        if (existingMeta) {
          existingMeta.remove();
        }
        
        const metaStatus = document.createElement('meta');
        metaStatus.name = 'prerender-status-code';
        metaStatus.content = '404';
        document.head.appendChild(metaStatus);

        // Устанавливаем заголовок для crawlers
        const existingTitle = document.querySelector('meta[property="og:title"]');
        if (existingTitle) {
          existingTitle.setAttribute('content', '404 - Страница не найдена | Наталия Великая');
        }

        // Логируем 404 для аналитики
        console.warn(`SEO: 404 page detected - ${location.pathname}`);
        
        // Отправляем событие в Yandex Metrika если доступно
        if (window.ym) {
          window.ym(104236315, 'reachGoal', '404_ERROR', {
            page: location.pathname,
            referrer: document.referrer
          });
        }
      }
    } else {
      // Убираем мета-тег 404 для обычных страниц
      const metaStatus = document.querySelector('meta[name="prerender-status-code"]');
      if (metaStatus) {
        metaStatus.remove();
      }
    }
  }, [location.pathname]);

  return null; // Этот компонент не рендерит ничего
};

export default SEO404Handler;