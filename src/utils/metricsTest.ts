// Утилиты для тестирования работы Яндекс Метрики

export const testYandexMetrika = () => {
  console.log('=== Тест Яндекс Метрики ===');
  
  // Проверяем, загружен ли объект ym
  if (typeof window.ym === 'function') {
    console.log('✅ Яндекс Метрика загружена');
    
    // Проверяем наличие счетчика
    const counterId = 101026698;
    console.log(`🔍 Проверяем счетчик: ${counterId}`);
    
    // Пытаемся отправить тестовое событие
    try {
      window.ym(counterId, 'hit');
      console.log('✅ Тестовый hit отправлен');
      
      window.ym(counterId, 'reachGoal', 'test_event');
      console.log('✅ Тестовая цель отправлена');
      
    } catch (error) {
      console.error('❌ Ошибка при отправке событий:', error);
    }
    
  } else {
    console.error('❌ Яндекс Метрика не загружена');
    console.log('Возможные причины:');
    console.log('- Блокировщик рекламы');
    console.log('- Ошибка загрузки скрипта');
    console.log('- Неверный ID счетчика');
  }
  
  // Проверяем элементы в DOM
  const metrikaScripts = document.querySelectorAll('script[src*="mc.yandex.ru"]');
  console.log(`📄 Найдено скриптов Метрики: ${metrikaScripts.length}`);
  
  const noscriptImg = document.querySelector('img[src*="mc.yandex.ru"]');
  console.log(`🖼️ Noscript изображение: ${noscriptImg ? 'найдено' : 'не найдено'}`);
};

// Автоматически запускаем тест при загрузке страницы
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(testYandexMetrika, 2000); // Ждем 2 секунды после загрузки
  });
}