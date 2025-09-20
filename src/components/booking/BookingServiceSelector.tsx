import React, { useState, useEffect } from 'react';
import Icon from "@/components/ui/icon";
import { FormData, FormErrors, SERVICES, Service } from './BookingFormTypes';

interface BookingServiceSelectorProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const BookingServiceSelector: React.FC<BookingServiceSelectorProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  useEffect(() => {
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

  const selectedService = SERVICES.find(s => s.id === formData.service);

  return (
    <>
      {/* Услуга */}
      <div>
        <label className="block text-gold-300 font-medium mb-2">
          <Icon name="Sparkles" size={16} className="inline mr-2" />
          Выберите услугу *
        </label>
        <div className="relative service-dropdown">
          <button
            type="button"
            onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
            className={`w-full px-3 py-3 bg-emerald-900/50 border rounded-lg text-gold-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 flex justify-between items-center ${
              errors.service ? 'border-red-400' : 'border-gold-400/30'
            }`}
          >
            <span className="truncate">
              {formData.service 
                ? `${SERVICES.find(s => s.id === formData.service)?.name} ${SERVICES.find(s => s.id === formData.service)?.price}`
                : 'Выберите услугу'
              }
            </span>
            <Icon name={isServiceDropdownOpen ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>
          
          {isServiceDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-emerald-900 border border-gold-400/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {['Access Bars', 'Массаж', 'Целительство', 'Обучение'].map(category => (
                <div key={category}>
                  <div className="px-3 py-2 text-xs font-bold text-gold-200 bg-emerald-800/50">
                    {category}
                  </div>
                  {SERVICES.filter(s => s.category === category).map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        onInputChange('service', service.id);
                        setIsServiceDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs sm:text-sm text-gold-100 hover:bg-emerald-700/50 focus:bg-emerald-700/50 focus:outline-none"
                    >
                      {service.name} {service.price}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
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
    </>
  );
};

export default BookingServiceSelector;