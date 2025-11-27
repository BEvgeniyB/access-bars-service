import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { diaryApi, TimeSlot } from '@/services/diaryApi';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface DiaryTimeSlotPickerProps {
  serviceId: string;
  date: string;
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onBack: () => void;
}

export default function DiaryTimeSlotPicker({
  serviceId,
  date,
  selectedTime,
  onSelect,
  onBack,
}: DiaryTimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSlots();
  }, [date, serviceId]);

  const loadSlots = async () => {
    setIsLoading(true);
    try {
      const data = await diaryApi.getAvailableSlots(date, serviceId);
      setSlots(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить доступное время',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    });
  };

  const availableSlots = slots.filter((slot) => slot.available);
  const morningSlots = availableSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour < 12;
  });
  const afternoonSlots = availableSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12 && hour < 18;
  });
  const eveningSlots = availableSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 18;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
        Назад
      </Button>

      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите время</h2>
        <p className="text-muted-foreground">{formatDate(date)}</p>
      </div>

      {availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="CalendarX" className="mx-auto h-12 w-12 mb-2 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">На эту дату нет свободных слотов</p>
          <Button variant="outline" onClick={onBack} className="mt-4">
            Выбрать другую дату
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {morningSlots.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                Утро (до 12:00)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {morningSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => onSelect(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {afternoonSlots.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                День (12:00 - 18:00)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {afternoonSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => onSelect(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {eveningSlots.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                Вечер (после 18:00)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {eveningSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => onSelect(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
