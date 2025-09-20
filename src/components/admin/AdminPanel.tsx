import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SERVICES, SCHEDULE_API_URL } from '@/components/booking/BookingFormTypes';

interface Booking {
  id: number;
  client_name: string;
  client_phone: string;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

interface Schedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
  is_working: boolean;
}

const DAYS_OF_WEEK = [
  'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800', 
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800'
};

const STATUS_LABELS = {
  pending: 'Ожидает',
  confirmed: 'Подтверждена',
  completed: 'Завершена',
  cancelled: 'Отменена'
};

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadBookings();
    loadSchedule();
  }, [selectedDate]);

  const loadBookings = async () => {
    try {
      const response = await fetch(`${SCHEDULE_API_URL}?action=get_bookings&date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async () => {
    try {
      const response = await fetch(`${SCHEDULE_API_URL}?action=get_schedule`);
      if (response.ok) {
        const data = await response.json();
        setSchedule(data.schedule || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
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
        loadBookings();
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const getServiceName = (serviceId: number) => {
    const service = SERVICES.find(s => s.apiId === serviceId);
    return service ? service.name : 'Неизвестная услуга';
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Админ-панель</h1>
          <p className="text-gray-600">Управление записями и расписанием</p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              Записи
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              Расписание
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Icon name="CalendarDays" size={20} />
                <label htmlFor="date" className="font-medium">Дата:</label>
              </div>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={loadBookings} variant="outline" size="sm">
                <Icon name="RefreshCw" size={16} />
                Обновить
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" size={32} className="animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="grid gap-4">
                {bookings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Icon name="Calendar" size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Нет записей</h3>
                      <p className="text-gray-600">На выбранную дату записей не найдено</p>
                    </CardContent>
                  </Card>
                ) : (
                  bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon name="User" size={20} className="text-gray-600" />
                            <div>
                              <CardTitle className="text-lg">{booking.client_name}</CardTitle>
                              <CardDescription>{booking.client_phone}</CardDescription>
                            </div>
                          </div>
                          <Badge className={STATUS_COLORS[booking.status]}>
                            {STATUS_LABELS[booking.status]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Icon name="Scissors" size={16} className="text-gray-600" />
                            <span className="font-medium">{getServiceName(booking.service_id)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Calendar" size={16} className="text-gray-600" />
                            <span>{formatDate(booking.appointment_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Clock" size={16} className="text-gray-600" />
                            <span>{formatTime(booking.appointment_time)}</span>
                          </div>
                        </div>
                        
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Icon name="Check" size={16} />
                              Подтвердить
                            </Button>
                            <Button 
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Icon name="X" size={16} />
                              Отменить
                            </Button>
                          </div>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <Button 
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Icon name="CheckCircle" size={16} />
                            Завершить
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Рабочее расписание</CardTitle>
                <CardDescription>
                  Настройка рабочих дней и времени
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DAYS_OF_WEEK.map((dayName, index) => {
                    const daySchedule = schedule.find(s => s.day_of_week === index + 1);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium w-24">{dayName}</span>
                          {daySchedule?.is_working ? (
                            <Badge className="bg-green-100 text-green-800">Рабочий</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Выходной</Badge>
                          )}
                        </div>
                        
                        {daySchedule?.is_working && (
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Icon name="Clock" size={14} />
                              <span>{formatTime(daySchedule.start_time)} - {formatTime(daySchedule.end_time)}</span>
                            </div>
                            {daySchedule.break_start && daySchedule.break_end && (
                              <div className="flex items-center gap-1">
                                <Icon name="Coffee" size={14} />
                                <span>Перерыв: {formatTime(daySchedule.break_start)} - {formatTime(daySchedule.break_end)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}