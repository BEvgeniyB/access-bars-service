import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Icon from '@/components/ui/icon';

interface BookingsTableProps {
  bookings: any[];
  loading: boolean;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onEditClick: (booking: any) => void;
  onStatusChange: (id: number, status: string) => void;
}

const BookingsTable = ({
  bookings,
  loading,
  getStatusColor,
  getStatusText,
  onEditClick,
  onStatusChange,
}: BookingsTableProps) => {
  if (loading) {
    return <p className="text-center text-gray-500 py-8">Загрузка...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center text-gray-500 py-8">Нет записей</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Дата</TableHead>
          <TableHead>Время</TableHead>
          <TableHead>Клиент</TableHead>
          <TableHead>Услуга</TableHead>
          <TableHead>Длительность</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.date}</TableCell>
            <TableCell>{booking.time}</TableCell>
            <TableCell className="font-medium">{booking.client}</TableCell>
            <TableCell>{booking.service}</TableCell>
            <TableCell>{booking.duration} мин</TableCell>
            <TableCell>
              <Badge className={getStatusColor(booking.status)}>
                {getStatusText(booking.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditClick(booking)}
                  className="gap-1"
                >
                  <Icon name="Edit" size={14} />
                  Изменить
                </Button>
                {booking.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStatusChange(booking.id, 'confirmed')}
                    >
                      Подтвердить
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onStatusChange(booking.id, 'cancelled')}
                    >
                      Отменить
                    </Button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStatusChange(booking.id, 'completed')}
                    >
                      Завершить
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onStatusChange(booking.id, 'cancelled')}
                    >
                      Отменить
                    </Button>
                  </>
                )}
                {booking.status === 'completed' && (
                  <span className="text-sm text-gray-500">Завершена</span>
                )}
                {booking.status === 'cancelled' && (
                  <span className="text-sm text-gray-500">Отменена</span>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingsTable;
