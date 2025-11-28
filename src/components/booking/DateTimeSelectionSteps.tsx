import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DateTimeSelectionStepsProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  availableSlots: string[];
  blockedDates?: string[];
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
  isLoadingSlots: boolean;
}

export default function DateTimeSelectionSteps({
  selectedDate,
  selectedTime,
  availableSlots,
  blockedDates = [],
  onSelectDate,
  onSelectTime,
  onBack,
  onNext,
  isLoadingSlots
}: DateTimeSelectionStepsProps) {
  const [step, setStep] = useState<'date' | 'time'>('date');
  
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date <= today) return true;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const isBlocked = blockedDates.includes(dateStr);
    
    if (isBlocked) {
      console.log('🚫 [CALENDAR] Дата заблокирована:', dateStr);
    }
    
    return isBlocked;
  };

  useEffect(() => {
    if (selectedDate && !selectedTime) {
      setStep('time');
    }
  }, [selectedDate, selectedTime]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      console.log('📅 [CALENDAR] Выбрана дата:', dateStr);
      console.log('🔍 [CALENDAR] Заблокирована?', blockedDates.includes(dateStr));
      onSelectDate(date);
      setStep('time');
    }
  };

  const handleBackToDate = () => {
    setStep('date');
    onSelectTime('');
  };

  if (step === 'date') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Выберите дату</h2>
          <p className="text-muted-foreground">Когда вам удобно прийти?</p>
        </div>

        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            locale={ru}
            className="rounded-md border"
            modifiers={{
              blocked: (day) => {
                const year = day.getFullYear();
                const month = String(day.getMonth() + 1).padStart(2, '0');
                const dayNum = String(day.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${dayNum}`;
                return blockedDates.includes(dateStr);
              }
            }}
            modifiersStyles={{
              blocked: {
                backgroundColor: '#fecaca',
                color: '#7f1d1d',
                fontWeight: 'bold',
                textDecoration: 'line-through',
                cursor: 'not-allowed'
              }
            }}
          />
        </div>

        <div className="flex justify-between">
          <Button onClick={onBack} variant="outline" size="lg">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <Button onClick={() => setStep('time')} disabled={!selectedDate} size="lg">
            Далее
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Выберите время</h2>
        {selectedDate && (
          <p className="text-muted-foreground">
            {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
            <Button
              variant="link"
              size="sm"
              onClick={handleBackToDate}
              className="ml-2"
            >
              Изменить дату
            </Button>
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Доступное время</CardTitle>
          <CardDescription>Выберите удобный временной слот</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSlots ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-2" />
              Загружаю доступные слоты...
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="CalendarX" size={32} className="mx-auto mb-2" />
              На выбранную дату нет свободных слотов
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? 'default' : 'outline'}
                  onClick={() => onSelectTime(slot)}
                  className="w-full"
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={handleBackToDate} variant="outline" size="lg">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        <Button onClick={onNext} disabled={!selectedTime} size="lg">
          Далее
          <Icon name="ArrowRight" size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}