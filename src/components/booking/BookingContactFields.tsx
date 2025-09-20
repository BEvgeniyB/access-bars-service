import React from 'react';
import Icon from "@/components/ui/icon";
import { FormData, FormErrors } from './BookingFormTypes';
import { formatPhoneNumber } from './BookingFormUtils';

interface BookingContactFieldsProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const BookingContactFields: React.FC<BookingContactFieldsProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <>
      {/* Имя */}
      <div>
        <label className="block text-gold-300 font-medium mb-2">
          <Icon name="User" size={16} className="inline mr-2" />
          Ваше имя *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
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
          onChange={(e) => onInputChange('phone', e.target.value)}
          className={`w-full px-4 py-3 bg-emerald-900/50 border rounded-lg text-gold-100 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
            errors.phone ? 'border-red-400' : 'border-gold-400/30'
          }`}
          placeholder="+7 (___) ___-__-__"
        />
        {errors.phone && <p className="mt-1 text-red-400 text-sm">{errors.phone}</p>}
      </div>
    </>
  );
};

export default BookingContactFields;