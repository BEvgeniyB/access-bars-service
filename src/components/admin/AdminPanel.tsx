import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SERVICES, SCHEDULE_API_URL } from '@/components/booking/BookingFormTypes';

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
  const [weekBookings, setWeekBookings] = useState<{[key: string]: Booking[]}>({});
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState<string[]>([]);

  useEffect(() => {
    generateWeekDates();
    loadWeekBookings();
  }, []);

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
            bookingsData[dateStr] = data.bookings || [];
          } else {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Записи на неделю</h1>
            <Button onClick={loadWeekBookings} variant="outline" size="sm">
              <Icon name="RefreshCw" size={16} />
              Обновить
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDates.map((date) => {
            const dayBookings = weekBookings[date] || [];
            const isToday = date === new Date().toISOString().split('T')[0];
            
            return (
              <Card key={date} className={`${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-center">
                    {formatDate(date)}
                    {isToday && <span className="ml-2 text-blue-500">●</span>}
                  </CardTitle>
                  <div className="text-center text-sm text-gray-600">
                    {dayBookings.length} записей
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dayBookings.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <Icon name="Calendar" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Нет записей</p>
                    </div>
                  ) : (
                    dayBookings
                      .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
                      .map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-3 bg-white shadow-sm">
                          {/* Время и статус */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">
                              {formatTime(booking.appointment_time)} - {calculateEndTime(booking.appointment_time, booking.service_id)}
                            </div>
                            <Select
                              value={booking.status}
                              onValueChange={(newStatus) => updateBookingStatus(booking.id, newStatus)}
                            >
                              <SelectTrigger className="w-auto h-6 text-xs">
                                <Badge className={`text-xs ${STATUS_COLORS[booking.status]}`}>
                                  {STATUS_LABELS[booking.status]}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Ожидает</SelectItem>
                                <SelectItem value="confirmed">Подтверждена</SelectItem>
                                <SelectItem value="completed">Завершена</SelectItem>
                                <SelectItem value="cancelled">Отменена</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Клиент */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Icon name="User" size={12} />
                              <span className="font-medium">{booking.client_name}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Icon name="Phone" size={10} />
                              <a href={`tel:${booking.client_phone}`} className="hover:text-blue-600">
                                {booking.client_phone}
                              </a>
                            </div>
                            
                            {booking.client_email && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Icon name="Mail" size={10} />
                                <a href={`mailto:${booking.client_email}`} className="hover:text-blue-600 truncate">
                                  {booking.client_email}
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Услуга */}
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1 text-xs text-gray-700">
                              <Icon name="Scissors" size={10} />
                              <span className="truncate">{getServiceName(booking.service_id)}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {getServiceDuration(booking.service_id)}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}