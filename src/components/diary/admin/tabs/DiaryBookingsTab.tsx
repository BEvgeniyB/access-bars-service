import { useEffect, useState } from 'react';
import { useDiaryData } from '@/contexts/DiaryDataContext';
import { Booking } from '@/services/diaryApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export default function DiaryBookingsTab() {
  const { bookings, refreshBookings, updateBookingStatus, services } = useDiaryData();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filters: any = {};
    if (filterStatus !== 'all') filters.status = filterStatus;
    if (filterDate) filters.date = filterDate;
    refreshBookings(filters);
  }, [filterStatus, filterDate]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.clientPhone.includes(searchQuery);
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default">Подтверждена</Badge>;
      case 'pending':
        return <Badge variant="secondary">Ожидает</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Отменена</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name || 'Неизвестная услуга';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Записи клиентов</h1>
        <Button>
          <Icon name="Download" className="mr-2 h-4 w-4" />
          Экспорт
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Input
            placeholder="Поиск по имени или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="pending">Ожидает</SelectItem>
              <SelectItem value="confirmed">Подтверждена</SelectItem>
              <SelectItem value="cancelled">Отменена</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon name="Calendar" className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Записи не найдены</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {booking.clientName}
                      {getStatusBadge(booking.status)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {booking.clientPhone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        >
                          <Icon name="Check" className="mr-2 h-4 w-4" />
                          Подтвердить
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        >
                          <Icon name="X" className="mr-2 h-4 w-4" />
                          Отменить
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="Briefcase" className="h-4 w-4 text-muted-foreground" />
                    <span>{getServiceName(booking.serviceId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(booking.date).toLocaleDateString('ru-RU')} в {booking.time}
                    </span>
                  </div>
                  {booking.notes && (
                    <div className="flex items-start gap-2">
                      <Icon name="MessageSquare" className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{booking.notes}</span>
                    </div>
                  )}
                  {booking.telegramChatId && (
                    <div className="flex items-center gap-2">
                      <Icon name="Send" className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-600">Уведомления в Telegram</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
