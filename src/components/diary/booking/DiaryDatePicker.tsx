import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Icon from '@/components/ui/icon';

interface DiaryDatePickerProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

export default function DiaryDatePicker({
  selectedDate,
  onSelect,
  disabledDates = [],
  minDate = new Date(),
  maxDate,
}: DiaryDatePickerProps) {
  const [month, setMonth] = useState<Date>(selectedDate || new Date());

  const isDateDisabled = (date: Date) => {
    return disabledDates.some(
      (disabledDate) =>
        disabledDate.toDateString() === date.toDateString()
    );
  };

  const handlePreviousMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Выберите дату</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
          >
            <Icon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
          >
            <Icon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          month={month}
          onMonthChange={setMonth}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return isDateDisabled(date);
          }}
          className="rounded-md border"
        />
      </div>

      {selectedDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Выбранная дата:</strong>{' '}
            {selectedDate.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
