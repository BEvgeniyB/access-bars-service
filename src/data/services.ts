export interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  category: string;
  description?: string;
  benefits?: string[];
  icon?: string;
  apiId?: number;
}

export interface DetailedService extends Service {
  description: string;
  benefits: string[];
  icon: string;
}

// Единый источник всех услуг
export const ALL_SERVICES: Service[] = [
  // Access Bars
  { 
    id: 'access-bars-first', 
    name: 'Первая сессия Access Bars', 
    duration: '90 мин', 
    price: '7 000 ₽', 
    category: 'Access Bars', 
    description: 'Знакомство с методикой, полная диагностика и первый сеанс',
    apiId: 1 
  },
  { 
    id: 'access-bars-standard', 
    name: 'Стандартная сессия', 
    duration: '60 мин', 
    price: '7 000 ₽', 
    category: 'Access Bars', 
    description: 'Классический сеанс Access Bars для регулярной практики',
    apiId: 1 
  },
  { 
    id: 'access-bars-intensive', 
    name: 'Интенсивная программа', 
    duration: '3 сессии', 
    price: '18 000 ₽', 
    category: 'Access Bars', 
    description: 'Курс из 3 сессий со скидкой для максимального эффекта',
    apiId: 4 
  },
  
  // Massage
  { 
    id: 'classic-massage', 
    name: 'Классический массаж', 
    duration: '60 мин', 
    price: '6 000 ₽', 
    category: 'Массаж', 
    description: 'Глубокая проработка мышц и суставов для снятия напряжения и восстановления',
    apiId: 2 
  },
  { 
    id: 'complex-massage', 
    name: 'Комплексная программа', 
    duration: '60 мин', 
    price: '7 000 ₽', 
    category: 'Массаж', 
    description: 'Сочетание классических техник с ароматерапией',
    apiId: 3 
  },
  
  // Healing
  { 
    id: 'body-healing', 
    name: 'Телесное исцеление', 
    duration: '60 мин', 
    price: '8 000 ₽', 
    category: 'Целительство', 
    description: 'Работа происходит с опорно-двигательным аппаратом, мышцами, связками тела. С обязательным присутствием',
    apiId: 5 
  },
  { 
    id: 'body-healing-package', 
    name: 'Телесное исцеление пакет 3 сеанса', 
    duration: '3 сеанса', 
    price: '21 000 ₽', 
    category: 'Целительство', 
    description: 'Комплексная программа исцеления из 3 сеансов со скидкой',
    apiId: 5 
  },
  { 
    id: 'remote-healing', 
    name: 'Дистанционное исцеление', 
    duration: '60 мин', 
    price: '7 000 ₽', 
    category: 'Целительство', 
    description: 'Энергетическая работа на расстоянии по видеосвязи из любой точки мира',
    apiId: 5 
  },
  
  // Training
  { 
    id: 'training-basic', 
    name: 'Базовый курс', 
    duration: '8ч', 
    price: '29 000 ₽', 
    category: 'Обучение', 
    description: 'Обучение технике Access Bars. Доступно всем',
    apiId: 4 
  },
  { 
    id: 'training-repeat', 
    name: 'Повторное обучение', 
    duration: '8ч', 
    price: '14 500 ₽', 
    category: 'Обучение', 
    description: 'Курс для тех, кто уже проходил обучение ранее',
    apiId: 4 
  },
  { 
    id: 'training-teen', 
    name: 'Для подростков', 
    duration: '8ч', 
    price: '14 500 ₽', 
    category: 'Обучение', 
    description: 'Специальный курс Access Bars для подростков',
    apiId: 4 
  },
];

// Детальные услуги с benefits для страниц
export const DETAILED_SERVICES: DetailedService[] = [
  // Access Bars - берем из AccessBarsSessions.tsx
  {
    id: 'access-bars-first',
    name: 'Первая сессия Access Bars',
    duration: '90 мин',
    price: '7 000 ₽',
    category: 'Access Bars',
    description: 'Знакомство с методикой, полная диагностика и первый сеанс',
    benefits: [
      'Полная диагностика текущего состояния',
      'Знакомство с техникой Access Bars',
      'Первые результаты уже после сеанса',
      'Рекомендации для дальнейшей работы'
    ],
    icon: 'Sparkles'
  },
  {
    id: 'access-bars-standard',
    name: 'Стандартная сессия',
    duration: '60 мин',
    price: '7 000 ₽',
    category: 'Access Bars',
    description: 'Классический сеанс Access Bars для регулярной практики',
    benefits: [
      'Углубление расслабления',
      'Освобождение от ментальных блоков',
      'Улучшение качества сна',
      'Повышение осознанности'
    ],
    icon: 'Brain'
  },
  {
    id: 'access-bars-intensive',
    name: 'Интенсивная программа',
    duration: '3 сессии',
    price: '18 000 ₽',
    category: 'Access Bars',
    description: 'Курс из 3 сессий со скидкой для максимального эффекта',
    benefits: [
      'Максимальный эффект от методики',
      'Глубокие трансформации сознания',
      'Экономия 3000 рублей',
      'Поддержка на всем пути'
    ],
    icon: 'Zap'
  },

  // Massage - берем из Massage.tsx
  {
    id: 'classic-massage',
    name: 'Классический массаж',
    duration: '60 мин',
    price: '6 000 ₽',
    category: 'Массаж',
    description: 'Глубокая проработка мышц и суставов для снятия напряжения и восстановления',
    benefits: [
      'Снятие мышечного напряжения',
      'Улучшение кровообращения',
      'Восстановление подвижности суставов',
      'Общее расслабление и восстановление'
    ],
    icon: 'Heart'
  },
  {
    id: 'complex-massage',
    name: 'Комплексная программа',
    duration: '60 мин',
    price: '7 000 ₽',
    category: 'Массаж',
    description: 'Сочетание классических техник с ароматерапией',
    benefits: [
      'Комплексное воздействие на организм',
      'Ароматерапевтический эффект',
      'Глубокое расслабление',
      'Гармонизация всех систем организма'
    ],
    icon: 'Sparkles'
  },

  // Healing - берем из Healing.tsx
  {
    id: 'body-healing',
    name: 'Телесное исцеление',
    duration: '60 мин',
    price: '8 000 ₽',
    category: 'Целительство',
    description: 'Работа происходит с опорно-двигательным аппаратом, мышцами, связками тела. С обязательным присутствием',
    benefits: [
      'Исцеление опорно-двигательного аппарата',
      'Восстановление энергетического баланса',
      'Снятие болевых синдромов',
      'Общее оздоровление организма'
    ],
    icon: 'Sparkles'
  },
  {
    id: 'body-healing-package',
    name: 'Телесное исцеление пакет 3 сеанса',
    duration: '3 сеанса',
    price: '21 000 ₽',
    category: 'Целительство',
    description: 'Комплексная программа исцеления из 3 сеансов со скидкой',
    benefits: [
      'Глубокое системное исцеление',
      'Экономия на курсе лечения',
      'Комплексный подход к здоровью',
      'Долгосрочные результаты'
    ],
    icon: 'Heart'
  },
  {
    id: 'remote-healing',
    name: 'Дистанционное исцеление',
    duration: '60 мин',
    price: '7 000 ₽',
    category: 'Целительство',
    description: 'Энергетическая работа на расстоянии по видеосвязи из любой точки мира',
    benefits: [
      'Доступность из любой точки мира',
      'Эффективность не уступает очной работе',
      'Удобство проведения дома',
      'Экономия времени на дорогу'
    ],
    icon: 'Wifi'
  }
];

// Утилиты для получения услуг по категориям
export const getServicesByCategory = (category: string): Service[] => {
  return ALL_SERVICES.filter(service => service.category === category);
};

export const getDetailedServicesByCategory = (category: string): DetailedService[] => {
  return DETAILED_SERVICES.filter(service => service.category === category);
};

export const getServiceById = (id: string): Service | undefined => {
  return ALL_SERVICES.find(service => service.id === id);
};

export const getDetailedServiceById = (id: string): DetailedService | undefined => {
  return DETAILED_SERVICES.find(service => service.id === id);
};

// Для обратной совместимости с BookingFormTypes.ts
export const SERVICES = ALL_SERVICES;