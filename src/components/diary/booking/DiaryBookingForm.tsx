import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Service } from '@/services/diaryApi';
import Icon from '@/components/ui/icon';

interface DiaryBookingFormProps {
  service: Service;
  selectedDate: string;
  selectedTime: string;
  onSubmit: (data: {
    clientName: string;
    clientPhone: string;
    notes?: string;
  }) => Promise<void>;
  onBack: () => void;
}

export default function DiaryBookingForm({
  service,
  selectedDate,
  selectedTime,
  onSubmit,
  onBack,
}: DiaryBookingFormProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        clientName,
        clientPhone,
        notes: notes || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
        Назад
      </Button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-blue-900">Детали записи</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Услуга:</strong> {service.name}</p>
          <p><strong>Дата:</strong> {formatDate(selectedDate)}</p>
          <p><strong>Время:</strong> {selectedTime}</p>
          <p><strong>Длительность:</strong> {service.duration} мин</p>
          <p><strong>Стоимость:</strong> {service.price} ₽</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Ваше имя *</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Введите ваше имя"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone">Телефон *</Label>
          <Input
            id="clientPhone"
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="+7 (999) 123-45-67"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Комментарий (необязательно)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Дополнительная информация"
            rows={3}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
              Отправка...
            </>
          ) : (
            'Записаться'
          )}
        </Button>
      </form>
    </div>
  );
}
