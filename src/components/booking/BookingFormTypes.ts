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
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
  '20:00', '20:30', '21:00'
];