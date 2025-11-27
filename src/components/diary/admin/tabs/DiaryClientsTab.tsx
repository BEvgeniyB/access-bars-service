import { useMemo } from 'react';
import { useDiaryData } from '@/contexts/DiaryDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function DiaryClientsTab() {
  const { bookings, services } = useDiaryData();

  const clients = useMemo(() => {
    const clientMap = new Map();

    bookings.forEach((booking) => {
      const key = booking.clientPhone;
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          name: booking.clientName,
          phone: booking.clientPhone,
          bookings: [],
        });
      }
      clientMap.get(key).bookings.push(booking);
    });

    return Array.from(clientMap.values()).sort(
      (a, b) => b.bookings.length - a.bookings.length
    );
  }, [bookings]);

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name || 'Неизвестная услуга';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">База клиентов</h1>
        <p className="text-muted-foreground mt-2">
          Всего клиентов: {clients.length}
        </p>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon name="Users" className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Клиентов пока нет</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.phone}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{client.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{client.phone}</p>
                  </div>
                  <Badge variant="secondary">
                    {client.bookings.length} {client.bookings.length === 1 ? 'запись' : 'записей'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">История записей:</p>
                  <div className="space-y-2">
                    {client.bookings.slice(0, 3).map((booking: any) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(booking.date).toLocaleDateString('ru-RU')} в {booking.time}
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          {getServiceName(booking.serviceId)}
                        </span>
                      </div>
                    ))}
                    {client.bookings.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        и ещё {client.bookings.length - 3} записей...
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
