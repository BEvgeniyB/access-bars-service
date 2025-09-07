import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  service?: string;
  date?: string;
  time?: string;
}

const SERVICES = [
  // Access Bars
  { id: 'access-bars-first', name: 'Первая сессия', duration: '90 мин', price: '8 000 ₽', category: 'Access Bars' },
  { id: 'access-bars-standard', name: 'Стандартная сессия', duration: '60 мин', price: '8 000 ₽', category: 'Access Bars' },
  { id: 'access-bars-intensive', name: 'Интенсивный курс', duration: '3 сессии', price: '21 000 ₽', category: 'Access Bars' },
  
  // Massage
  { id: 'classic-massage', name: 'Классический', duration: '60 мин', price: '6 000 ₽', category: 'Массаж' },
  { id: 'aromatherapy', name: 'Ароматерапия', duration: '60 мин', price: '5 000 ₽', category: 'Массаж' },
  { id: 'complex-massage', name: 'Комплексная программа', duration: '90 мин', price: '8 000 ₽', category: 'Массаж' },
  
  // Healing
  { id: 'energy-healing', name: 'Энергетическое', duration: '60 мин', price: '7 000 ₽', category: 'Целительство' },
  { id: 'remote-healing', name: 'Дистанционное', duration: '60 мин', price: '6 000 ₽', category: 'Целительство' },
  
  // Training
  { id: 'training-basic', name: 'Базовый курс', duration: '8ч', price: '29 000 ₽', category: 'Обучение' },
  { id: 'training-repeat', name: 'Повторное обучение', duration: '8ч', price: '14 500 ₽', category: 'Обучение' },
  { id: 'training-teen', name: 'Для подростков', duration: '8ч', price: '14 500 ₽', category: 'Обучение' },
];

const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Имитация отправки формы
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setFormData({ name: '', phone: '', service: '', date: '', time: '' });
      setErrors({});
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const selectedService = SERVICES.find(s => s.id === formData.service);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <Card className="relative w-full max-w-lg sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-emerald-950/95 border-2 border-gold-400/50">
        <CardHeader className="relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gold-400 hover:text-gold-300 transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
          
          <CardTitle className="text-xl sm:text-2xl font-montserrat text-gold-400 pr-12">
            📅 Записаться на сеанс
          </CardTitle>
          <CardDescription className="text-emerald-200">
            Заполните форму для записи на консультацию
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="mb-4 text-4xl">✅</div>
              <h3 className="text-xl font-semibold text-gold-400 mb-2">Заявка отправлена!</h3>
              <p className="text-emerald-200">Мы свяжемся с вами в ближайшее время для подтверждения записи</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Имя */}
              <div>
                <label className="block text-gold-300 font-medium mb-2">
                  <Icon name="User" size={16} className="inline mr-2" />
                  Ваше имя *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 bg-emerald-900/50 border rounded-lg text-gold-100 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                    errors.name ? 'border-red-400' : 'border-gold-400/30'
                  }`}
                  placeholder="Введите ваше имя"
                />
                {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
              </div>

              {/* Телефон */}
              <div>
                <label className="block text-gold-300 font-medium mb-2">
                  <Icon name="Phone" size={16} className="inline mr-2" />
                  Номер телефона *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 bg-emerald-900/50 border rounded-lg text-gold-100 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                    errors.phone ? 'border-red-400' : 'border-gold-400/30'
                  }`}
                  placeholder="+7 (___) ___-__-__"
                />
                {errors.phone && <p className="mt-1 text-red-400 text-sm">{errors.phone}</p>}
              </div>

              {/* Услуга */}
              <div>
                <label className="block text-gold-300 font-medium mb-2">
                  <Icon name="Sparkles" size={16} className="inline mr-2" />
                  Выберите услугу *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  className={`w-full px-3 py-3 bg-emerald-900/50 border rounded-lg text-gold-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                    errors.service ? 'border-red-400' : 'border-gold-400/30'
                  }`}
                  style={{ 
                    fontSize: '16px',
                    maxHeight: '50vh',
                    overflowY: 'auto'
                  }}
                >
                  <option value="">Выберите услугу</option>
                  {['Access Bars', 'Массаж', 'Целительство', 'Обучение'].map(category => (
                    <optgroup key={category} label={category}>
                      {SERVICES.filter(s => s.category === category).map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} {service.duration} {service.price}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {errors.service && <p className="mt-1 text-red-400 text-sm">{errors.service}</p>}
              </div>

              {/* Информация о выбранной услуге */}
              {selectedService && (
                <div className="p-4 bg-gold-400/10 border border-gold-400/30 rounded-lg">
                  <h4 className="font-semibold text-gold-400 mb-2">{selectedService.name}</h4>
                  <div className="flex gap-4 text-sm text-emerald-200">
                    <span>⏱️ {selectedService.duration}</span>
                    <span>💰 {selectedService.price}</span>
                    <span>🏷️ {selectedService.category}</span>
                  </div>
                </div>
              )}

              {/* Дата и время */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold-300 font-medium mb-2">
                    <Icon name="Calendar" size={16} className="inline mr-2" />
                    Дата *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    min={getMinDate()}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full px-4 py-3 bg-emerald-900/50 border rounded-lg text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                      errors.date ? 'border-red-400' : 'border-gold-400/30'
                    }`}
                  />
                  {errors.date && <p className="mt-1 text-red-400 text-sm">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-gold-300 font-medium mb-2">
                    <Icon name="Clock" size={16} className="inline mr-2" />
                    Время *
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`w-full px-4 py-3 bg-emerald-900/50 border rounded-lg text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                      errors.time ? 'border-red-400' : 'border-gold-400/30'
                    }`}
                  >
                    <option value="">Выберите время</option>
                    {TIME_SLOTS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.time && <p className="mt-1 text-red-400 text-sm">{errors.time}</p>}
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold py-3"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={16} className="mr-2" />
                      Записаться
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="border-gold-400/50 text-gold-400 hover:bg-gold-400/10"
                >
                  Отмена
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;