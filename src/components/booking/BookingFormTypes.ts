export interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  date?: string;
  time?: string;
}

// Импортируем из центрального источника
import { SERVICES, Service } from '@/data/services';

// Экспортируем для обратной совместимости
export { SERVICES, type Service };

export const SCHEDULE_API_URL = 'https://functions.poehali.dev/162a7498-295a-4897-a0d8-695fadc8f40b';
export const NOTIFICATIONS_API_URL = 'https://functions.poehali.dev/271b12ed-66af-4af4-bd63-b0794c0dbf1f';

export const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];