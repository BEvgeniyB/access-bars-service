import React from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SERVICES } from '@/components/booking/BookingFormTypes';

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

interface BookingsTabProps {
  weekDates: string[];
  weekBookings: {[key: string]: Booking[]};
  onRefresh: () => void;
  onUpdateStatus: (bookingId: number, newStatus: string) => void;
  onUpdateService: (bookingId: number, newServiceId: number) => void;
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

export default function BookingsTab({ 
  weekDates, 
  weekBookings, 
  onRefresh, 
  onUpdateStatus, 
  onUpdateService 
}: BookingsTabProps) {
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
    const durationMinutes = service.duration === '1.5ч' ? 90 : 60;
    
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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Записи на неделю</h2>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <Icon name="RefreshCw" size={16} />
          Обновить
        </Button>
      </div>

      <div className="space-y-6">
        {weekDates.map((date) => {
          const dayBookings = weekBookings[date] || [];
          const isToday = date === new Date().toISOString().split('T')[0];
          
          if (dayBookings.length === 0) return null;
          
          return (
            <div key={date}>
              <div className={`flex items-center gap-4 mb-4 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                <div className={`flex items-center gap-2 font-semibold text-lg ${isToday ? 'bg-blue-50 px-3 py-1 rounded-lg' : ''}`}>
                  <Icon name="Calendar" size={20} />
                  {formatDate(date)}
                  {isToday && <span className="text-blue-500">● Сегодня</span>}
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">{dayBookings.length} записей</span>
              </div>

              <div className="space-y-3">
                {dayBookings
                  .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
                  .map((booking) => (
                    <Card key={booking.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 font-medium text-lg">
                              <Icon name="Clock" size={16} className="text-blue-600" />
                              <span>{formatTime(booking.appointment_time)} - {calculateEndTime(booking.appointment_time, booking.service_id)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Icon name="User" size={16} className="text-gray-600" />
                              <span className="font-medium">{booking.client_name}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600">
                              <Icon name="Scissors" size={16} />
                              <Select
                                value={booking.service_id.toString()}
                                onValueChange={(newServiceId) => onUpdateService(booking.id, parseInt(newServiceId))}
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
                        
                        <div className="flex items-center gap-3">
                          <Select
                            value={booking.status}
                            onValueChange={(newStatus) => onUpdateStatus(booking.id, newStatus)}
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
        
        {weekDates.every(date => (weekBookings[date] || []).length === 0) && (
          <Card className="p-12 text-center">
            <Icon name="Calendar" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет записей на эту неделю</h3>
            <p className="text-gray-600">Записи появятся здесь, когда клиенты забронируют время</p>
          </Card>
        )}
      </div>
    </>
  );
}
