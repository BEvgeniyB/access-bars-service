import { FormData, FormErrors, SERVICES, SCHEDULE_API_URL, TIME_SLOTS } from './BookingFormTypes';

export const formatPhoneNumber = (value: string): string => {
  // Удаляем все символы кроме цифр
  const digitsOnly = value.replace(/\D/g, '');
  
  // Если первая цифра не 7, добавляем 7
  let formatted = digitsOnly;
  if (digitsOnly.length === 0) {
    formatted = '7';
  } else if (digitsOnly[0] !== '7') {
    formatted = '7' + digitsOnly;
  }
  
  // Ограничиваем до 11 цифр (7 + 10)
  formatted = formatted.slice(0, 11);
  
  // Применяем маску +7(___) ___-__-__
  let result = '+7';
  if (formatted.length > 1) {
    result += '(' + formatted.slice(1, 4);
    if (formatted.length > 4) {
      result += ') ' + formatted.slice(4, 7);
      if (formatted.length > 7) {
        result += '-' + formatted.slice(7, 9);
        if (formatted.length > 9) {
          result += '-' + formatted.slice(9, 11);
        }
      }
    }
  }
  
  return result;
};

export const validateForm = (formData: FormData): FormErrors => {
  const newErrors: FormErrors = {};
  
  if (!formData.name.trim()) {
    newErrors.name = 'Пожалуйста, введите ваше имя';
  }
  
  if (!formData.phone.trim()) {
    newErrors.phone = 'Пожалуйста, введите номер телефона';
  } else if (!/^[+]?[\d\s\-()]+$/.test(formData.phone)) {
    newErrors.phone = 'Введите корректный номер телефона';
  }
  
  if (!formData.service) {
    newErrors.service = 'Пожалуйста, выберите услугу';
  }
  
  if (!formData.date) {
    newErrors.date = 'Пожалуйста, выберите дату';
  }
  
  if (!formData.time) {
    newErrors.time = 'Пожалуйста, выберите время';
  }
  
  return newErrors;
};

export const getMinDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const loadAvailableSlots = async (date: string, serviceId: number): Promise<string[]> => {
  try {
    const response = await fetch(`${SCHEDULE_API_URL}?date=${date}&service_id=${serviceId}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0].available_slots || [];
      } else {
        return [];
      }
    } else {
      // Fallback к статическим слотам
      return TIME_SLOTS;
    }
  } catch (error) {
    console.warn('Не удалось загрузить слоты из API, используем статические:', error);
    return TIME_SLOTS;
  }
};

export const createEmailFallback = (formData: FormData): void => {
  const selectedServiceInfo = SERVICES.find(s => s.id === formData.service);
  if (selectedServiceInfo) {
    const serviceName = selectedServiceInfo.name;
    const servicePrice = selectedServiceInfo.price;
    const serviceDuration = selectedServiceInfo.duration;
    
    const emailSubject = `Заявка на запись - ${serviceName}`;
    const emailBody = `Заявка на запись на сеанс

Имя: ${formData.name}
Телефон: ${formData.phone}
Услуга: ${serviceName} ${servicePrice}
Продолжительность: ${serviceDuration}
Дата: ${formData.date}
Время: ${formData.time}

Пожалуйста, подтвердите запись.

С уважением,
${formData.name}`;

    const mailtoLink = `mailto:record@velikaya-nataliya.ru?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  }
};