// Утилиты для работы с Яндекс Метрикой

declare global {
  interface Window {
    ym: (counterId: number, action: string, target?: string, params?: object) => void;
  }
}

const COUNTER_ID = 101026698;

export const trackEvent = (target: string, params?: object) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(COUNTER_ID, 'reachGoal', target, params);
    console.log('Yandex Metrika: goal tracked', target, params);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(COUNTER_ID, 'hit', url);
    console.log('Yandex Metrika: page view tracked', url);
  }
};

// Готовые события для отслеживания
export const YMEvents = {
  // Контакты и заявки
  PHONE_CLICK: 'phone_click',
  WHATSAPP_CLICK: 'whatsapp_click',
  TELEGRAM_CLICK: 'telegram_click',
  SCHEDULE_FORM_OPEN: 'schedule_form_open',
  SCHEDULE_FORM_SUBMIT: 'schedule_form_submit',
  
  // Навигация по услугам
  ACCESS_BARS_PAGE: 'access_bars_page',
  MASSAGE_PAGE: 'massage_page', 
  HEALING_PAGE: 'healing_page',
  TRAINING_PAGE: 'training_page',
  
  // Интерактивные элементы
  REVIEW_READ: 'review_read',
  FAQ_EXPAND: 'faq_expand',
  PHOTO_GALLERY_VIEW: 'photo_gallery_view'
};