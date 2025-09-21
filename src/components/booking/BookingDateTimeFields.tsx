import React, { useState, useEffect } from 'react';
import Icon from "@/components/ui/icon";
import { FormData, FormErrors, TIME_SLOTS, SCHEDULE_API_URL, updateTimeSlotsFromSettings } from './BookingFormTypes';
import { getMinDate } from './BookingFormUtils';

interface SlotInfo {
  time: string;
  isAvailable: boolean;
  reason?: string;
  booking?: {
    client_name?: string;
    service_name?: string;
    status?: string;
  };
}

interface BookingDateTimeFieldsProps {
  formData: FormData;
  errors: FormErrors;
  availableSlots: string[];
  loadingSlots: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const BookingDateTimeFields: React.FC<BookingDateTimeFieldsProps> = ({
  formData,
  errors,
  availableSlots,
  loadingSlots,
  onInputChange
}) => {
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [allSlots, setAllSlots] = useState<SlotInfo[]>([]);
  const [loadingSlotDetails, setLoadingSlotDetails] = useState(false);

  // Загружаем настройки времени при инициализации
  useEffect(() => {
    updateTimeSlotsFromSettings();
  }, []);

  // Функция для получения детальной информации о всех слотах
  const loadSlotDetails = async (date: string, serviceId: number) => {
    if (!date || !serviceId) return;
    
    setLoadingSlotDetails(true);
    try {
      const response = await fetch(`${SCHEDULE_API_URL}?date=${date}&service_id=${serviceId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const dayData = data[0];
          const bookings = dayData.bookings || [];
          
          // Создаем информацию о всех возможных слотах
          const slotInfos: SlotInfo[] = TIME_SLOTS.map(time => {
            const isAvailable = availableSlots.includes(time);
            const booking = bookings.find((b: any) => {
              if (!b.start_time) return false;
              const bookingTime = b.start_time.slice(0, 5); // Берем только HH:MM
              return bookingTime === time;
            });
            
            let reason = '';
            if (!isAvailable) {
              if (booking) {
                const statusText = booking.status === 'confirmed' ? 'подтверждена' : 
                                 booking.status === 'pending' ? 'ожидает подтверждения' :
                                 booking.status === 'cancelled' ? 'отменена' : booking.status;
                reason = `Запись: ${booking.client_name} (${statusText})`;
              } else {
                // Если нет записи, но слот недоступен - значит блокирован по 30-минутному правилу
                reason = 'Технический перерыв после сеанса';
              }
            }
            
            return {
              time,
              isAvailable,
              reason,
              booking: booking ? {
                client_name: booking.client_name,
                service_name: booking.service_name,
                status: booking.status
              } : undefined
            };
          });
          
          setAllSlots(slotInfos);
        }
      }
    } catch (error) {
      console.warn('Не удалось загрузить детали слотов:', error);
      // Fallback - создаем простую информацию на основе доступных слотов
      const slotInfos: SlotInfo[] = TIME_SLOTS.map(time => ({
        time,
        isAvailable: availableSlots.includes(time),
        reason: availableSlots.includes(time) ? undefined : 'Недоступно'
      }));
      setAllSlots(slotInfos);
    } finally {
      setLoadingSlotDetails(false);
    }
  };

  // Загружаем детали слотов при изменении даты, услуги или доступных слотов
  useEffect(() => {
    if (formData.date && formData.service && !loadingSlots) {
      const serviceId = parseInt(formData.service);
      if (!isNaN(serviceId)) {
        loadSlotDetails(formData.date, serviceId);
      }
    }
  }, [formData.date, formData.service, availableSlots, loadingSlots]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.time-dropdown')) {
        setIsTimeDropdownOpen(false);
      }
    };
    
    if (isTimeDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isTimeDropdownOpen]);
  return (
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
          onChange={(e) => onInputChange('date', e.target.value)}
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
        {loadingSlots ? (
          <div className="w-full px-4 py-3 bg-emerald-900/50 border border-gold-400/30 rounded-lg text-emerald-400 flex items-center gap-2">
            <Icon name="Loader2" size={16} className="animate-spin" />
            Загрузка времени...
          </div>
        ) : (
          <div className="relative time-dropdown">
            <button
              type="button"
              onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
              disabled={!formData.date || !formData.service}
              className={`w-full px-4 py-3 bg-emerald-900/50 border rounded-lg text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-400 flex justify-between items-center ${
                errors.time ? 'border-red-400' : 'border-gold-400/30'
              } ${!formData.date || !formData.service ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span>
                {formData.time || (
                  !formData.date || !formData.service 
                    ? 'Сначала выберите дату и услугу' 
                    : availableSlots.length > 0 
                      ? 'Выберите время' 
                      : 'Нет доступного времени'
                )}
              </span>
              <Icon name={isTimeDropdownOpen ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>
            
            {isTimeDropdownOpen && (
              <div className="absolute z-10 w-full bottom-full mb-1 bg-emerald-900 border border-gold-400/30 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {(allSlots.length > 0 ? allSlots : TIME_SLOTS.map(time => ({
                  time,
                  isAvailable: availableSlots.includes(time),
                  reason: availableSlots.includes(time) ? undefined : 'Недоступно'
                }))).map((slot, index) => (
                  <div
                    key={slot.time}
                    className={`flex items-center justify-between px-4 py-3 ${
                      index === 0 ? 'rounded-t-lg' : ''
                    } ${
                      index === allSlots.length - 1 ? 'rounded-b-lg' : ''
                    } ${
                      slot.isAvailable 
                        ? 'hover:bg-emerald-700/50 cursor-pointer' 
                        : 'bg-emerald-950/50'
                    }`}
                    onClick={() => {
                      if (slot.isAvailable) {
                        onInputChange('time', slot.time);
                        setIsTimeDropdownOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        slot.isAvailable ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <span className={`font-medium ${
                        slot.isAvailable ? 'text-gold-100' : 'text-gray-400'
                      }`}>
                        {slot.time}
                      </span>
                    </div>
                    
                    {!slot.isAvailable && slot.reason && (
                      <div className="flex items-center gap-2">
                        <Icon 
                          name={slot.booking ? "User" : "Clock"} 
                          size={14} 
                          className="text-red-400" 
                        />
                        <span className="text-xs text-gray-400 truncate max-w-40">
                          {slot.reason}
                        </span>
                      </div>
                    )}
                    
                    {slot.isAvailable && (
                      <Icon name="Check" size={14} className="text-green-400" />
                    )}
                  </div>
                ))}
                
                {(loadingSlotDetails || loadingSlots) && (
                  <div className="px-4 py-3 text-center text-emerald-400 flex items-center justify-center gap-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span className="text-sm">Загрузка деталей...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {errors.time && <p className="mt-1 text-red-400 text-sm">{errors.time}</p>}
        {formData.date && formData.service && !loadingSlots && availableSlots.length === 0 && (
          <p className="mt-1 text-amber-400 text-sm">
            На выбранную дату нет свободного времени. Попробуйте другую дату.
          </p>
        )}
        
        {/* Легенда для индикаторов */}
        {formData.date && formData.service && !loadingSlots && (
          <div className="mt-2 p-2 bg-emerald-950/30 rounded-lg border border-gold-400/20">
            <p className="text-xs text-gold-300 mb-2 font-medium">Обозначения:</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-emerald-200">Свободно</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <Icon name="User" size={10} className="text-red-400" />
                <span className="text-emerald-200">Занято</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <Icon name="Clock" size={10} className="text-red-400" />
                <span className="text-emerald-200">Перерыв</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDateTimeFields;