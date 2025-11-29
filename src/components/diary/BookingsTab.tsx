import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/contexts/diary/DataContext';
import { useAppContext } from '@/contexts/diary/AppContext';
import { api } from '@/services/diary/api';
import { useToast } from '@/hooks/use-toast';
import CreateBookingDialog from './bookings/CreateBookingDialog';
import EditBookingDialog from './bookings/EditBookingDialog';
import BookingsTable from './bookings/BookingsTable';

const BookingsTab = () => {
  const { getStatusColor, getStatusText } = useAppContext();
  const { bookings, clients, services, loading, refreshBookings } = useData();
  const { toast } = useToast();

  useEffect(() => {
    refreshBookings();
  }, []);
  
  const [showDialog, setShowDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [newBooking, setNewBooking] = useState({
    client_id: '',
    service_id: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
  });

  const handleCreate = async () => {
    if (!newBooking.client_id) {
      toast({
        title: 'Ошибка',
        description: 'Выберите клиента',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newBooking.service_id) {
      toast({
        title: 'Ошибка',
        description: 'Выберите услугу',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newBooking.start_time || !newBooking.end_time) {
      toast({
        title: 'Ошибка',
        description: 'Укажите время начала и окончания',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await api.bookings.create({
        client_id: Number(newBooking.client_id),
        service_id: Number(newBooking.service_id),
        booking_date: newBooking.date,
        start_time: newBooking.start_time,
        end_time: newBooking.end_time,
        status: 'pending',
      });
      
      toast({
        title: 'Запись создана',
        description: 'Новая запись успешно добавлена',
      });
      
      setShowDialog(false);
      refreshBookings();
      setNewBooking({
        client_id: '',
        service_id: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '',
        end_time: '',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать запись',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.bookings.update(id, { status });
      toast({
        title: 'Статус обновлен',
        description: 'Статус записи успешно изменен',
      });
      refreshBookings();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (booking: any) => {
    console.log('📝 Редактирование записи:', booking);
    setEditingBooking({
      id: booking.id,
      service_id: booking.service_id?.toString() || '',
      date: booking.date,
      start_time: booking.time,
      status: booking.status,
      client_name: booking.client,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;
    
    try {
      await api.bookings.update(editingBooking.id, {
        service_id: editingBooking.service_id,
        booking_date: editingBooking.date,
        start_time: editingBooking.start_time,
        status: editingBooking.status,
      });
      toast({
        title: 'Запись обновлена',
        description: 'Изменения успешно сохранены',
      });
      setShowEditDialog(false);
      refreshBookings();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить запись',
        variant: 'destructive',
      });
    }
  };

  const filteredBookings = bookings.filter(b => {
    const dateMatch = selectedDate ? b.date === selectedDate : true;
    const statusMatch = selectedStatus === 'all' ? true : b.status === selectedStatus;
    return dateMatch && statusMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Записи</h2>
          <p className="text-gray-500 mt-1">Управление записями клиентов</p>
        </div>
        <CreateBookingDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          clients={clients}
          services={services}
          newBooking={newBooking}
          setNewBooking={setNewBooking}
          onSubmit={handleCreate}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle>Все записи</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Label className="whitespace-nowrap">Дата:</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-36 flex-1 sm:flex-none"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate('')}
                >
                  Все
                </Button>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Label className="whitespace-nowrap">Статус:</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-36 flex-1 sm:flex-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="pending">Ожидают</SelectItem>
                    <SelectItem value="confirmed">Подтверждены</SelectItem>
                    <SelectItem value="completed">Завершены</SelectItem>
                    <SelectItem value="cancelled">Отменены</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BookingsTable
            bookings={filteredBookings}
            loading={loading}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            onEditClick={handleEditClick}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      <EditBookingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        services={services}
        editingBooking={editingBooking}
        setEditingBooking={setEditingBooking}
        onSubmit={handleSaveEdit}
      />
    </div>
  );
};

export default BookingsTab;