import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import ServiceSelectionStep from '@/components/booking/ServiceSelectionStep';
import DateTimeSelectionSteps from '@/components/booking/DateTimeSelectionSteps';
import ClientDataStep from '@/components/booking/ClientDataStep';
import TelegramNotificationDialog from '@/components/booking/TelegramNotificationDialog';

const DIARY_API_URL = 'https://functions.poehali.dev/da71a3e9-e449-4dcc-b672-1ca9c9d9575e';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface BookingSettings {
  telegram_bot_username: string;
  work_hours_start: string;
  work_hours_end: string;
}

export default function PublicBooking() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientTelegram, setClientTelegram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTelegramDialog, setShowTelegramDialog] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const steps = ['Услуга', 'Дата', 'Время', 'Контакты'];

  useEffect(() => {
    loadBookingData();
  }, []);

  useEffect(() => {
    if (selectedServiceId && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedServiceId, selectedDate]);

  const loadBookingData = async () => {
    try {
      const response = await fetch(`${DIARY_API_URL}?resource=booking_data`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to load booking data');

      const data = await response.json();
      setServices(data.services || []);
      setSettings(data.settings || null);
      
      // Загружаем заблокированные даты
      const blockedResponse = await fetch(`${DIARY_API_URL}?resource=blocked_dates`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (blockedResponse.ok) {
        const blockedData = await blockedResponse.json();
        const dates = (blockedData.blockedDates || []).map((item: any) => item.date);
        console.log('🚫 [BOOKING] Заблокированные даты загружены:', dates);
        setBlockedDates(dates);
      } else {
        console.error('❌ [BOOKING] Ошибка загрузки заблокированных дат:', blockedResponse.status);
      }
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные для записи',
        variant: 'destructive'
      });
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedServiceId || !selectedDate) return;

    setIsLoadingSlots(true);
    try {
      // Используем локальное форматирование вместо toISOString() чтобы избежать UTC timezone shift
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      console.log('📅 [BOOKING] Запрос слотов для даты:', dateStr, 'service_id:', selectedServiceId, 'current_time:', currentTime);
      console.log('🚫 [BOOKING] Текущий список заблокированных дат:', blockedDates);
      console.log('🔍 [BOOKING] Дата заблокирована?', blockedDates.includes(dateStr));
      
      const response = await fetch(
        `${DIARY_API_URL}?resource=available_slots&service_id=${selectedServiceId}&date=${dateStr}&current_time=${currentTime}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        console.error('❌ [BOOKING] Ошибка ответа backend:', response.status);
        throw new Error('Failed to load slots');
      }

      const data = await response.json();
      console.log('✅ [BOOKING] Ответ от backend:', data);
      console.log('🕐 [BOOKING] Количество слотов:', data.slots?.length || 0, 'слотов:', data.slots);
      setAvailableSlots(data.slots || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить доступные слоты',
        variant: 'destructive'
      });
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmitBooking = async () => {
    if (!selectedServiceId || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      // Используем локальное форматирование вместо toISOString() чтобы избежать UTC timezone shift
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const response = await fetch(`${DIARY_API_URL}?resource=appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: selectedServiceId,
          appointment_date: dateStr,
          appointment_time: selectedTime,
          client_name: clientName,
          client_phone: clientPhone,
          client_telegram: clientTelegram || null,
          status: 'pending'
        })
      });

      if (!response.ok) throw new Error('Failed to create booking');

      toast({
        title: 'Запись создана!',
        description: 'Мы свяжемся с вами для подтверждения',
      });

      if (clientTelegram && settings?.telegram_bot_username) {
        setShowTelegramDialog(true);
      }

      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      toast({
        title: 'Ошибка записи',
        description: 'Не удалось создать запись. Попробуйте позже.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Онлайн запись</h1>
          <p className="text-muted-foreground">Выберите услугу и удобное время</p>
        </div>

        <Card className="p-6">
          <BookingStepIndicator currentStep={currentStep} steps={steps} />

          <div className="mt-8">
            {currentStep === 1 && (
              <ServiceSelectionStep
                services={services}
                selectedServiceId={selectedServiceId}
                onSelectService={setSelectedServiceId}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <DateTimeSelectionSteps
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                availableSlots={availableSlots}
                blockedDates={blockedDates}
                onSelectDate={setSelectedDate}
                onSelectTime={setSelectedTime}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
                isLoadingSlots={isLoadingSlots}
              />
            )}

            {currentStep === 3 && (
              <ClientDataStep
                clientName={clientName}
                clientPhone={clientPhone}
                clientTelegram={clientTelegram}
                onClientNameChange={setClientName}
                onClientPhoneChange={setClientPhone}
                onClientTelegramChange={setClientTelegram}
                onBack={() => setCurrentStep(2)}
                onSubmit={handleSubmitBooking}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </Card>
      </div>

      {settings && (
        <TelegramNotificationDialog
          isOpen={showTelegramDialog}
          onClose={() => setShowTelegramDialog(false)}
          botUsername={settings.telegram_bot_username}
        />
      )}
    </div>
  );
}