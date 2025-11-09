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
import API_ENDPOINTS from '@/config/api';

// Экспортируем для обратной совместимости
export { SERVICES, type Service };

export const SCHEDULE_API_URL = API_ENDPOINTS.schedule;
export const NOTIFICATIONS_API_URL = API_ENDPOINTS.notifications;

// TIME_SLOTS теперь генерируются динамически из настроек API
export let TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
  '20:00', '20:30', '21:00'
];

// Функция для обновления TIME_SLOTS из настроек API
export const updateTimeSlotsFromSettings = async () => {
  try {
    const response = await fetch(`${SCHEDULE_API_URL}?action=get_settings`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.settings) {
        const { working_hours_start, working_hours_end, time_slot_interval_minutes } = data.settings;
        TIME_SLOTS = generateTimeSlots(
          working_hours_start.slice(0, 5),
          working_hours_end.slice(0, 5),
          time_slot_interval_minutes || 30
        );
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки настроек времени:', error);
  }
};

// Генерация слотов времени
const generateTimeSlots = (startTime: string, endTime: string, interval: number): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  for (let minutes = startMinutes; minutes < endMinutes; minutes += interval) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push(timeString);
  }
  
  return slots;
};