import React, { useState, useEffect } from 'react';
import Icon from "@/components/ui/icon";
import { FormData, FormErrors } from './BookingFormTypes';
import { getMinDate } from './BookingFormUtils';

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
            
            {isTimeDropdownOpen && availableSlots.length > 0 && (
              <div className="absolute z-10 w-full bottom-full mb-1 bg-emerald-900 border border-gold-400/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {availableSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      onInputChange('time', time);
                      setIsTimeDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gold-100 hover:bg-emerald-700/50 focus:bg-emerald-700/50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
                  >
                    {time}
                  </button>
                ))}
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
      </div>
    </div>
  );
};

export default BookingDateTimeFields;