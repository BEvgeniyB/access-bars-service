import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SERVICES, SCHEDULE_API_URL } from '@/components/booking/BookingFormTypes';
import EmailSettingsPanel from './EmailSettingsPanel';
import ServicesPanel from './ServicesPanel';
import ScheduleSettingsPanel from './ScheduleSettingsPanel';

interface Booking {
  id: number;
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  end_time?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}



const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300', 
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300'
};

const STATUS_LABELS = {
  pending: 'Ожидает',
  confirmed: 'Подтверждена',
  completed: 'Завершена',
  cancelled: 'Отменена'
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [weekBookings, setWeekBookings] = useState<{[key: string]: Booking[]}>({});
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Тот же пароль что и в AdminButton
  const ADMIN_PASSWORD = 'K9mX#7bN2w';

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      setAuthError('');
    } else {
      setAuthError('Неверный пароль');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      generateWeekDates();
      loadWeekBookings();
    }
  }, [isAuthenticated]);

  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    setWeekDates(dates);
  };

  const loadWeekBookings = async () => {
    setLoading(true);
    const bookingsData: {[key: string]: Booking[]} = {};
    
    try {
      // Загружаем записи для каждого дня недели
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const response = await fetch(`${SCHEDULE_API_URL}?action=get_bookings&date=${dateStr}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`Booking data for ${dateStr}:`, data.bookings);
            bookingsData[dateStr] = data.bookings || [];
          } else {
            console.error(`Failed to load bookings for ${dateStr}:`, response.status);
            bookingsData[dateStr] = [];
          }
        } catch (error) {
          console.error(`Ошибка загрузки записей для ${dateStr}:`, error);
          bookingsData[dateStr] = [];
        }
      }
      
      setWeekBookings(bookingsData);
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(SCHEDULE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_booking_status',
          booking_id: bookingId,
          status: newStatus
        })
      });

      if (response.ok) {
        loadWeekBookings(); // Перезагружаем данные
      } else {
        console.error('Ошибка обновления статуса');
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const updateBookingService = async (bookingId: number, newServiceId: number) => {
    try {
      const response = await fetch(SCHEDULE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_booking_service',
          booking_id: bookingId,
          service_id: newServiceId
        })
      });

      if (response.ok) {
        loadWeekBookings(); // Перезагружаем данные
      } else {
        console.error('Ошибка обновления услуги');
      }
    } catch (error) {
      console.error('Ошибка обновления услуги:', error);
    }
  };

  const getServiceName = (serviceId: number) => {
    const service = SERVICES.find(s => s.apiId === serviceId);
    return service ? service.name : 'Неизвестная услуга';
  };

  const getServiceDuration = (serviceId: number) => {
    const service = SERVICES.find(s => s.apiId === serviceId);
    return service ? service.duration : '1ч';
  };

  const calculateEndTime = (startTime: string, serviceId: number) => {
    const service = SERVICES.find(s => s.apiId === serviceId);
    if (!service) return startTime;
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const durationMinutes = service.duration === '1.5ч' ? 90 : 60; // примерный расчет
    
    const endDate = new Date();
    endDate.setHours(hours, minutes + durationMinutes);
    
    return endDate.toTimeString().slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Сегодня';
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Завтра';
    } else {
      return date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  // Показать форму входа если не аутентифицирован
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Icon name="Lock" size={24} />
              Вход в админ-панель
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              {authError && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <Icon name="AlertCircle" size={16} />
                  {authError}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={handlePasswordSubmit} className="flex-1">
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline" className="flex-1">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                На главную
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsAuthenticated(false)}
                variant="outline"
                className="flex items-center gap-2"
                title="Выйти из админки"
              >
                <Icon name="LogOut" size={16} />
                Выйти
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                На главную
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                Записи
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Icon name="Package" size={16} />
                Услуги
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Icon name="Clock" size={16} />
                Расписание
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Icon name="Settings" size={16} />
                Email
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Записи на неделю</h2>
                <Button onClick={loadWeekBookings} variant="outline" size="sm">
                  <Icon name="RefreshCw" size={16} />
                  Обновить
                </Button>
              </div>

              <div className="space-y-6">
                {weekDates.map((date) => {
                  const dayBookings = weekBookings[date] || [];
                  const isToday = date === new Date().toISOString().split('T')[0];
                  
                  // Пропускаем дни без записей
                  if (dayBookings.length === 0) return null;
                  
                  return (
                    <div key={date}>
                      {/* Разделитель дня */}
                      <div className={`flex items-center gap-4 mb-4 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                        <div className={`flex items-center gap-2 font-semibold text-lg ${isToday ? 'bg-blue-50 px-3 py-1 rounded-lg' : ''}`}>
                          <Icon name="Calendar" size={20} />
                          {formatDate(date)}
                          {isToday && <span className="text-blue-500">● Сегодня</span>}
                        </div>
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm text-gray-500">{dayBookings.length} записей</span>
                      </div>

                      {/* Записи дня */}
                      <div className="space-y-3">
                        {dayBookings
                          .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
                          .map((booking) => (
                            <Card key={booking.id} className="p-4">
                              <div className="flex items-center justify-between">
                                {/* Левая часть - основная информация */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-6">
                                    {/* Время */}
                                    <div className="flex items-center gap-2 font-medium text-lg">
                                      <Icon name="Clock" size={16} className="text-blue-600" />
                                      <span>{formatTime(booking.appointment_time)} - {calculateEndTime(booking.appointment_time, booking.service_id)}</span>
                                    </div>
                                    
                                    {/* Клиент */}
                                    <div className="flex items-center gap-2">
                                      <Icon name="User" size={16} className="text-gray-600" />
                                      <span className="font-medium">{booking.client_name}</span>
                                    </div>
                                    
                                    {/* Услуга */}
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Icon name="Scissors" size={16} />
                                      <Select
                                        value={booking.service_id.toString()}
                                        onValueChange={(newServiceId) => updateBookingService(booking.id, parseInt(newServiceId))}
                                      >
                                        <SelectTrigger className="w-auto h-8 border-0 bg-transparent p-1 hover:bg-gray-100">
                                          <div className="flex items-center gap-1">
                                            <span>{getServiceName(booking.service_id)}</span>
                                            <span className="text-sm">({getServiceDuration(booking.service_id)})</span>
                                            <Icon name="ChevronDown" size={12} />
                                          </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                          {SERVICES.map((service) => (
                                            <SelectItem key={service.apiId} value={service.apiId.toString()}>
                                              {service.name} ({service.duration})
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  {/* Контакты */}
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <a href={`tel:${booking.client_phone}`} className="flex items-center gap-1 hover:text-blue-600">
                                      <Icon name="Phone" size={14} />
                                      {booking.client_phone}
                                    </a>
                                    
                                    {booking.client_email && (
                                      <a href={`mailto:${booking.client_email}`} className="flex items-center gap-1 hover:text-blue-600">
                                        <Icon name="Mail" size={14} />
                                        {booking.client_email}
                                      </a>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Правая часть - статус */}
                                <div className="flex items-center gap-3">
                                  <Select
                                    value={booking.status}
                                    onValueChange={(newStatus) => updateBookingStatus(booking.id, newStatus)}
                                  >
                                    <SelectTrigger className="w-32 h-8">
                                      <Badge className={`text-xs ${STATUS_COLORS[booking.status]}`}>
                                        {STATUS_LABELS[booking.status]}
                                      </Badge>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem key="pending" value="pending">Ожидает</SelectItem>
                                      <SelectItem key="confirmed" value="confirmed">Подтверждена</SelectItem>
                                      <SelectItem key="completed" value="completed">Завершена</SelectItem>
                                      <SelectItem key="cancelled" value="cancelled">Отменена</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </div>
                  );
                })}
                
                {/* Если нет записей вообще */}
                {weekDates.every(date => (weekBookings[date] || []).length === 0) && (
                  <Card className="p-12 text-center">
                    <Icon name="Calendar" size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет записей на эту неделю</h3>
                    <p className="text-gray-600">Записи появятся здесь, когда клиенты забронируют время</p>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="mt-6">
              <ServicesPanel />
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-6">
              <ScheduleSettingsPanel />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <EmailSettingsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}