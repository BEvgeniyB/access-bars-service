import { useMemo } from 'react';
import { useDiaryData } from '@/contexts/DiaryDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function DiaryAnalyticsTab() {
  const { bookings, services } = useDiaryData();

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;

    const totalRevenue = bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, booking) => {
        const service = services.find((s) => s.id === booking.serviceId);
        return sum + (service?.price || 0);
      }, 0);

    const serviceStats = services.map((service) => {
      const serviceBookings = bookings.filter((b) => b.serviceId === service.id);
      const confirmedCount = serviceBookings.filter((b) => b.status === 'confirmed').length;
      const revenue = confirmedCount * service.price;

      return {
        name: service.name,
        count: serviceBookings.length,
        confirmedCount,
        revenue,
      };
    }).sort((a, b) => b.count - a.count);

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      serviceStats,
    };
  }, [bookings, services]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Аналитика</h1>
        <p className="text-muted-foreground mt-2">
          Статистика и отчёты по записям
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего записей</CardTitle>
            <Icon name="Calendar" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Подтверждено</CardTitle>
            <Icon name="Check" className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидает</CardTitle>
            <Icon name="Clock" className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отменено</CardTitle>
            <Icon name="X" className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Доход</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalRevenue.toLocaleString('ru-RU')} ₽</div>
          <p className="text-sm text-muted-foreground mt-1">
            От подтверждённых записей
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Популярность услуг</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.serviceStats.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Статистика по услугам пока отсутствует
              </p>
            ) : (
              stats.serviceStats.map((service) => (
                <div key={service.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{service.name}</span>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>{service.count} записей</span>
                      <span className="font-semibold text-foreground">
                        {service.revenue.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${(service.count / stats.totalBookings) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
