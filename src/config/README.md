# API Configuration

Централизованный конфиг для всех backend URLs проекта.

## Структура

### Backend функции (3 функции вместо 5):

1. **api** - Авторизация + Аналитика
   - `?endpoint=auth` - Вход в админ-панель
   - `?endpoint=analytics` - Статистика посещений

2. **content** - Отзывы + Уведомления
   - `?endpoint=reviews` - Управление отзывами
   - `?endpoint=notifications` - Email уведомления

3. **schedule** - Расписание и записи
   - Управление расписанием
   - Бронирование услуг

## Использование

⚠️ **ВАЖНО**: Каждый endpoint требует параметр `?endpoint=ИМЯ` для роутинга внутри функции!

```typescript
import API_ENDPOINTS from '@/config/api';

// Авторизация
fetch(`${API_ENDPOINTS.auth}?endpoint=auth`, {
  method: 'POST',
  body: JSON.stringify({ password: '...' })
});

// Получение отзывов
fetch(`${API_ENDPOINTS.reviews}?endpoint=reviews&status=approved`);

// Запись на услугу
fetch(`${API_ENDPOINTS.schedule}?date=2025-01-01&service_id=1`, {
  method: 'GET'
});

// Аналитика
fetch(`${API_ENDPOINTS.analytics}?endpoint=analytics&days=7`);

// Email уведомления
fetch(`${API_ENDPOINTS.notifications}?endpoint=notifications`, {
  method: 'POST',
  body: JSON.stringify({ action: 'test_smtp' })
});
```

## Обновление URLs

Чтобы обновить URL функции, измените только `API_BASE_URLS` в `api.ts`:

```typescript
const API_BASE_URLS = {
  api: 'https://functions.poehali.dev/NEW-UUID-HERE',
  content: 'https://functions.poehali.dev/NEW-UUID-HERE',
  schedule: 'https://functions.poehali.dev/NEW-UUID-HERE'
};
```

Все компоненты автоматически получат новые URLs.

## Файлы, использующие конфиг

- `src/pages/AdminLogin.tsx` → auth
- `src/pages/Analytics.tsx` → analytics
- `src/pages/Reviews.tsx` → reviews
- `src/components/admin/AdminPanel.tsx` → reviews, schedule
- `src/components/admin/EmailSettingsPanel.tsx` → notifications
- `src/components/admin/DatabaseAnalytics.tsx` → analytics
- `src/components/admin/ReviewModerationPanel.tsx` → reviews
- `src/components/reviews/ReviewsCarousel.tsx` → reviews
- `src/components/booking/BookingFormTypes.ts` → schedule, notifications
- `src/utils/analytics.ts` → analytics