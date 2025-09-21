import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface TrainingBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
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

// Используем данные из центрального источника
import { getServicesByCategory } from '@/data/services';
const TRAINING_SERVICES = getServicesByCategory('Обучение');

const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const TrainingBookingForm: React.FC<TrainingBookingFormProps> = ({ isOpen, onClose, preselectedService }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '+7(',
    service: preselectedService || '',
    date: '',
    time: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

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
      newErrors.service = 'Пожалуйста, выберите курс';
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
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setFormData({
          name: '',
          phone: '+7(',
          service: preselectedService || '',
          date: '',
          time: ''
        });
        setErrors({});
      }, 3000);
    }, 1000);
  };

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    
    let formatted = digitsOnly;
    if (digitsOnly.length === 0) {
      formatted = '7';
    } else if (digitsOnly[0] !== '7') {
      formatted = '7' + digitsOnly;
    }
    
    formatted = formatted.slice(0, 11);
    
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

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.service-dropdown')) {
        setIsServiceDropdownOpen(false);
      }
    };
    
    if (isServiceDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isServiceDropdownOpen]);

  React.useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const selectedService = TRAINING_SERVICES.find(s => s.id === formData.service);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-emerald-900/95 border-gold-400/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="GraduationCap" size={24} className="text-gold-400" />
              <CardTitle className="text-xl font-bold text-gold-100">Записаться на обучение</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gold-400 hover:text-gold-300 hover:bg-gold-400/10"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
          <CardDescription className="text-emerald-200">
            Заполните форму для записи на курс обучения Access Bars
          </CardDescription>
        </CardHeader>

        <CardContent>
          {showSuccess ? (
            <div className="text-center py-8">
              <Icon name="CheckCircle" size={64} className="text-gold-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gold-100 mb-2">Заявка отправлена!</h3>
              <p className="text-emerald-200">
                Мы свяжемся с вами в ближайшее время для подтверждения записи
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  <Icon name="User" size={16} className="inline mr-2" />
                  Ваше имя *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-emerald-800/50 border border-gold-400/30 rounded-lg text-gold-100 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-transparent"
                  placeholder="Введите ваше имя"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  <Icon name="Phone" size={16} className="inline mr-2" />
                  Телефон *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full px-4 py-3 bg-emerald-800/50 border border-gold-400/30 rounded-lg text-gold-100 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-transparent"
                  placeholder="+7 (___) ___-__-__"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  <Icon name="GraduationCap" size={16} className="inline mr-2" />
                  Выберите курс *
                </label>
                <div className="relative service-dropdown">
                  <button
                    type="button"
                    onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                    className="w-full px-4 py-3 bg-emerald-800/50 border border-gold-400/30 rounded-lg text-left text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-transparent flex items-center justify-between"
                  >
                    <span className="text-xs sm:text-sm">
                      {selectedService ? `${selectedService.name} - ${selectedService.price}` : 'Выберите курс обучения'}
                    </span>
                    <Icon name={isServiceDropdownOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-gold-400" />
                  </button>
                  
                  {isServiceDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-emerald-800/95 border border-gold-400/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {TRAINING_SERVICES.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, service: service.id }));
                            setIsServiceDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-xs sm:text-sm text-emerald-200 hover:bg-gold-400/10 hover:text-gold-400 transition-colors flex items-center justify-between"
                        >
                          <span>{service.name}</span>
                          <span className="text-gold-400 font-semibold">{service.price}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.service && (
                  <p className="mt-1 text-sm text-red-400">{errors.service}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  <Icon name="Calendar" size={16} className="inline mr-2" />
                  Дата *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={getMinDate()}
                  className="w-full px-4 py-3 bg-emerald-800/50 border border-gold-400/30 rounded-lg text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-transparent"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-400">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  <Icon name="Clock" size={16} className="inline mr-2" />
                  Время *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-3 bg-emerald-800/50 border border-gold-400/30 rounded-lg text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-transparent"
                >
                  <option value="">Выберите время</option>
                  {TIME_SLOTS.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-400">{errors.time}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} className="mr-2" />
                    Записаться на курс
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingBookingForm;