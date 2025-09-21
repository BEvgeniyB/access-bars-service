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

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  category: string;
  apiId: number;
}

export const SERVICES: Service[] = [
  // Access Bars
  { id: 'access-bars-first', name: 'Первая сессия', duration: '90 мин', price: '7 000 ₽', category: 'Access Bars', apiId: 1 },
  { id: 'access-bars-standard', name: 'Стандартная сессия', duration: '60 мин', price: '7 000 ₽', category: 'Access Bars', apiId: 1 },
  { id: 'access-bars-intensive', name: 'Интенсивная программа', duration: '3 сессии', price: '18 000 ₽', category: 'Access Bars', apiId: 4 },
  
  // Massage
  { id: 'classic-massage', name: 'Классический массаж', duration: '60 мин', price: '6 000 ₽', category: 'Массаж', apiId: 2 },
  { id: 'complex-massage', name: 'Комплексная программа', duration: '90 мин', price: '7 000 ₽', category: 'Массаж', apiId: 3 },
  
  // Healing
  { id: 'body-healing', name: 'Телесное исцеление', duration: '60 мин', price: '8 000 ₽', category: 'Целительство', apiId: 5 },
  { id: 'body-healing-package', name: 'Телесное исцеление пакет 3 сеанса', duration: '3 сеанса', price: '21 000 ₽', category: 'Целительство', apiId: 5 },
  { id: 'remote-healing', name: 'Дистанционное исцеление', duration: '60 мин', price: '7 000 ₽', category: 'Целительство', apiId: 5 },
  
  // Training
  { id: 'training-basic', name: 'Базовый курс', duration: '8ч', price: '29 000 ₽', category: 'Обучение', apiId: 4 },
  { id: 'training-repeat', name: 'Повторное обучение', duration: '8ч', price: '14 500 ₽', category: 'Обучение', apiId: 4 },
  { id: 'training-teen', name: 'Для подростков', duration: '8ч', price: '14 500 ₽', category: 'Обучение', apiId: 4 },
];

export const SCHEDULE_API_URL = 'https://functions.poehali.dev/162a7498-295a-4897-a0d8-695fadc8f40b';
export const NOTIFICATIONS_API_URL = 'https://functions.poehali.dev/271b12ed-66af-4af4-bd63-b0794c0dbf1f';

export const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];