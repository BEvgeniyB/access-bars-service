import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import BookingContactFields from './booking/BookingContactFields';
import BookingServiceSelector from './booking/BookingServiceSelector';
import BookingDateTimeFields from './booking/BookingDateTimeFields';
import { 
  FormData, 
  FormErrors, 
  SERVICES, 
  SCHEDULE_API_URL 
} from './booking/BookingFormTypes';
import { 
  formatPhoneNumber, 
  validateForm, 
  loadAvailableSlots, 
  createEmailFallback 
} from './booking/BookingFormUtils';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose, preselectedService }) => {
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
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedServiceInfo = SERVICES.find(s => s.id === formData.service);
      
      if (!selectedServiceInfo) {
        throw new Error('Услуга не найдена');
      }

      // Отправляем запрос в backend API
      const response = await fetch(SCHEDULE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: selectedServiceInfo.apiId,
          booking_date: formData.date,
          start_time: formData.time,
          client_name: formData.name,
          client_phone: formData.phone,
          notes: `Заявка через сайт: ${selectedServiceInfo.name} ${selectedServiceInfo.price}`
        })
      });

      if (!response.ok) {
        // Логируем ошибку для отладки
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        console.warn('API недоступен, используем email fallback');
        createEmailFallback(formData);
      } else {
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Ошибка создания записи');
        }
      }
      
      setShowSuccess(true);
      setFormData({ name: '', phone: '+7(', service: '', date: '', time: '' });
      setErrors({});
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
      
      // Fallback на email в случае любой ошибки
      createEmailFallback(formData);
      
      setShowSuccess(true);
      setFormData({ name: '', phone: '+7(', service: '', date: '', time: '' });
      setErrors({});
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Загружаем доступные слоты при изменении даты или услуги
    if (field === 'date' || field === 'service') {
      const selectedService = SERVICES.find(s => s.id === (field === 'service' ? value : formData.service));
      const selectedDate = field === 'date' ? value : formData.date;
      
      if (selectedDate && selectedService) {
        setLoadingSlots(true);
        loadAvailableSlots(selectedDate, selectedService.apiId)
          .then(slots => setAvailableSlots(slots))
          .finally(() => setLoadingSlots(false));
      }
      
      // Сбрасываем время при изменении даты или услуги
      if (field === 'date' || field === 'service') {
        setFormData(prev => ({ ...prev, time: '' }));
      }
    }
  };

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

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
              <BookingContactFields
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <BookingServiceSelector
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <BookingDateTimeFields
                formData={formData}
                errors={errors}
                availableSlots={availableSlots}
                loadingSlots={loadingSlots}
                onInputChange={handleInputChange}
              />

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