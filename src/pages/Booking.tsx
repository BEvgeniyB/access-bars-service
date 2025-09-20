import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar as CalendarIcon, Clock, User, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const SCHEDULE_API_URL = 'https://functions.poehali.dev/162a7498-295a-4897-a0d8-695fadc8f40b';

interface Service {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
}

interface ScheduleSlot {
  date: string;
  available_slots: string[];
}

export default function Booking() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Симуляция загрузки услуг (в реальности будет отдельный API)
    setServices([
      { id: 1, name: 'Access Bars', description: 'Телесная техника для освобождения от ментальных блоков', duration_minutes: 90, price: 7000 },
      { id: 2, name: 'Массаж спины', description: 'Классический массаж спины для снятия напряжения', duration_minutes: 60, price: 4000 },
      { id: 3, name: 'Массаж всего тела', description: 'Полный расслабляющий массаж', duration_minutes: 90, price: 6000 },
      { id: 4, name: 'Обучение Access Bars', description: 'Индивидуальное обучение технике Access Bars', duration_minutes: 120, price: 15000 },
      { id: 5, name: 'Целительский сеанс', description: 'Энергетическая работа с телом и сознанием', duration_minutes: 75, price: 5500 }
    ]);
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  const loadAvailableSlots = async () => {
    if (!selectedDate || !selectedService) return;
    
    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`${SCHEDULE_API_URL}?date=${dateStr}&service_id=${selectedService}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.length > 0) {
        setAvailableSlots(data[0].available_slots || []);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки слотов:', error);
      setAvailableSlots([]);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить доступное время',
        variant: 'destructive'
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(SCHEDULE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: selectedService,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: selectedTime,
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
          notes: notes
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Успешно!',
          description: 'Ваша запись создана. Мы свяжемся с вами для подтверждения.',
        });
        
        // Очищаем форму
        setSelectedService(null);
        setSelectedDate(undefined);
        setSelectedTime('');
        setClientName('');
        setClientPhone('');
        setClientEmail('');
        setNotes('');
        setAvailableSlots([]);
      } else {
        throw new Error(result.error || 'Неизвестная ошибка');
      }
    } catch (error) {
      console.error('Ошибка создания записи:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать запись. Попробуйте позже.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Запись на сеансы
          </h1>
          <p className="text-lg text-gray-600">
            Выберите услугу, дату и время для записи
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Форма записи */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Информация о записи
              </CardTitle>
              <CardDescription>
                Заполните данные для записи на сеанс
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Выбор услуги */}
                <div>
                  <Label htmlFor="service">Услуга *</Label>
                  <Select value={selectedService?.toString() || ''} onValueChange={(value) => setSelectedService(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name} - {service.price}₽ ({service.duration_minutes} мин)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Информация об услуге */}
                {selectedServiceData && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">{selectedServiceData.description}</p>
                    <p className="text-sm font-medium mt-1">
                      Длительность: {selectedServiceData.duration_minutes} минут | Цена: {selectedServiceData.price}₽
                    </p>
                  </div>
                )}

                {/* Выбор времени */}
                {selectedService && selectedDate && (
                  <div>
                    <Label htmlFor="time">Время *</Label>
                    {loadingSlots ? (
                      <div className="flex items-center gap-2 p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Загрузка доступного времени...</span>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-500 p-2">На выбранную дату нет свободного времени</p>
                    )}
                  </div>
                )}

                {/* Контактные данные */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ваше имя"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+7 900 123-45-67"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Комментарии</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Дополнительная информация..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading || !selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Создание записи...
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Записаться
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Календарь */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Выберите дату
              </CardTitle>
              <CardDescription>
                Доступные даты для записи
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                locale={ru}
                className="w-full"
              />
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Рабочие дни: Понедельник - Пятница
                </p>
                <p className="text-sm text-blue-800">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Время работы: 10:00 - 18:00 (обед 13:00-14:00)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}