import React from 'react';
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
          <select
            value={formData.time}
            onChange={(e) => onInputChange('time', e.target.value)}
            className={`w-full px-4 py-3 bg-emerald-900/50 border rounded-lg text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
              errors.time ? 'border-red-400' : 'border-gold-400/30'
            }`}
            disabled={!formData.date || !formData.service}
          >
            <option value="">
              {!formData.date || !formData.service 
                ? 'Сначала выберите дату и услугу' 
                : availableSlots.length > 0 
                  ? 'Выберите время' 
                  : 'Нет доступного времени'
              }
            </option>
            {availableSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
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