import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface ClientDataStepProps {
  clientName: string;
  clientPhone: string;
  clientTelegram: string;
  onClientNameChange: (name: string) => void;
  onClientPhoneChange: (phone: string) => void;
  onClientTelegramChange: (telegram: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ClientDataStep({
  clientName,
  clientPhone,
  clientTelegram,
  onClientNameChange,
  onClientPhoneChange,
  onClientTelegramChange,
  onBack,
  onSubmit,
  isSubmitting
}: ClientDataStepProps) {
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
  };

  const handleSubmit = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!clientName.trim()) {
      newErrors.name = 'Введите ваше имя';
    }

    if (!clientPhone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!validatePhone(clientPhone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ваши контакты</h2>
        <p className="text-muted-foreground">Как с вами связаться?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Контактная информация</CardTitle>
          <CardDescription>Заполните форму для завершения записи</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Имя <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ваше имя"
              value={clientName}
              onChange={(e) => {
                onClientNameChange(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Телефон <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={clientPhone}
              onChange={(e) => {
                onClientPhoneChange(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">
              Telegram ID <span className="text-muted-foreground">(необязательно)</span>
            </Label>
            <Input
              id="telegram"
              placeholder="@username или ID"
              value={clientTelegram}
              onChange={(e) => onClientTelegramChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Укажите для получения уведомлений в Telegram
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg" disabled={isSubmitting}>
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        <Button onClick={handleSubmit} size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
              Отправка...
            </>
          ) : (
            <>
              Записаться
              <Icon name="Check" size={20} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
