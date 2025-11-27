import { useState } from 'react';
import { DiaryDataProvider, useDiaryData } from '@/contexts/DiaryDataContext';
import { Service } from '@/services/diaryApi';
import DiaryServiceSelector from '@/components/diary/booking/DiaryServiceSelector';
import DiaryDatePicker from '@/components/diary/booking/DiaryDatePicker';
import DiaryTimeSlotPicker from '@/components/diary/booking/DiaryTimeSlotPicker';
import DiaryBookingForm from '@/components/diary/booking/DiaryBookingForm';
import DiaryTelegramNotificationDialog from '@/components/diary/booking/DiaryTelegramNotificationDialog';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { diaryApi } from '@/services/diaryApi';
import Icon from '@/components/ui/icon';

type Step = 'service' | 'date' | 'time' | 'form' | 'success';

function DiaryBookingContent() {
  const { services } = useDiaryData();
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTelegramDialog, setShowTelegramDialog] = useState(false);
  const [telegramBotLink] = useState('https://t.me/your_bot');
  const { toast } = useToast();

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('date');
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('form');
  };

  const handleBookingSubmit = async (data: {
    clientName: string;
    clientPhone: string;
    notes?: string;
  }) => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    try {
      await diaryApi.createBooking({
        ...data,
        serviceId: selectedService.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        status: 'pending',
      });

      setStep('success');
      toast({
        title: 'Успешно!',
        description: 'Ваша запись создана',
      });

      setTimeout(() => {
        setShowTelegramDialog(true);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать запись',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setStep('service');
    setSelectedService(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'service', label: 'Услуга' },
      { id: 'date', label: 'Дата' },
      { id: 'time', label: 'Время' },
      { id: 'form', label: 'Контакты' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === step);

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                index <= currentStepIndex
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-muted-foreground text-muted-foreground'
              }`}
            >
              {index < currentStepIndex ? (
                <Icon name="Check" className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`ml-2 text-sm ${
                index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {s.label}
            </span>
            {index < steps.length - 1 && (
              <div className="w-8 h-0.5 mx-2 bg-border" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary rounded-full">
                <Icon name="Calendar" className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Онлайн-запись</h1>
            <p className="text-muted-foreground">
              Выберите удобное время для визита
            </p>
          </div>

          {step !== 'success' && renderStepIndicator()}

          <Card>
            <CardContent className="p-6">
              {step === 'service' && (
                <DiaryServiceSelector
                  services={services}
                  selectedService={selectedService}
                  onSelect={handleServiceSelect}
                />
              )}

              {step === 'date' && (
                <DiaryDatePicker
                  selectedDate={selectedDate}
                  onSelect={handleDateSelect}
                />
              )}

              {step === 'time' && selectedService && selectedDate && (
                <DiaryTimeSlotPicker
                  serviceId={selectedService.id}
                  date={selectedDate.toISOString().split('T')[0]}
                  selectedTime={selectedTime}
                  onSelect={handleTimeSelect}
                  onBack={() => setStep('date')}
                />
              )}

              {step === 'form' && selectedService && selectedDate && selectedTime && (
                <DiaryBookingForm
                  service={selectedService}
                  selectedDate={selectedDate.toISOString().split('T')[0]}
                  selectedTime={selectedTime}
                  onSubmit={handleBookingSubmit}
                  onBack={() => setStep('time')}
                />
              )}

              {step === 'success' && (
                <div className="text-center py-8 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-green-100 rounded-full">
                      <Icon name="Check" className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-green-600">
                    Запись создана!
                  </h2>
                  <p className="text-muted-foreground">
                    Мы свяжемся с вами для подтверждения
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      Детали вашей записи:
                    </p>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><strong>Услуга:</strong> {selectedService?.name}</p>
                      <p>
                        <strong>Дата:</strong>{' '}
                        {selectedDate?.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p><strong>Время:</strong> {selectedTime}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-primary hover:underline"
                  >
                    Создать ещё одну запись
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DiaryTelegramNotificationDialog
        open={showTelegramDialog}
        telegramLink={telegramBotLink}
        onOpenChange={setShowTelegramDialog}
      />
    </div>
  );
}

export default function DiaryBooking() {
  return (
    <DiaryDataProvider>
      <DiaryBookingContent />
    </DiaryDataProvider>
  );
}
