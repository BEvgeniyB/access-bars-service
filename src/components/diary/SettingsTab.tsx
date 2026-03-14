import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/diary/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/diary/DataContext';
import { api } from '@/services/diary/api';

const DAY_NAMES = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

interface WorkHourDay {
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_day_off: boolean;
}

const SettingsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings: contextSettings, refreshSettings } = useData();
  const [loading, setLoading] = useState(false);
  const [workHoursLoading, setWorkHoursLoading] = useState(false);
  
  const [systemSettings, setSystemSettings] = useState({
    prep_time: 0,
    buffer_time: 0,
    work_priority: true,
    reminder_hours: 0,
  });

  const [workHours, setWorkHours] = useState<WorkHourDay[]>(
    Array.from({ length: 7 }, (_, i) => ({
      day_of_week: i,
      start_time: '10:00',
      end_time: '20:00',
      is_day_off: i === 2,
    }))
  );

  const [profile, setProfile] = useState({
    name: user?.telegram_id || '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const loadedSettings = {
      prep_time: Number(contextSettings.prep_time) || 0,
      buffer_time: Number(contextSettings.buffer_time) || 0,
      work_priority: contextSettings.work_priority === 'True' || contextSettings.work_priority === 'true',
      reminder_hours: Number(contextSettings.reminder_hours) || 0,
    };
    setSystemSettings(loadedSettings);
  }, [contextSettings]);

  useEffect(() => {
    const loadWorkHours = async () => {
      try {
        const data = await api.workHours.get();
        if (data.work_hours && data.work_hours.length > 0) {
          setWorkHours(data.work_hours);
        }
      } catch (e) {
        // fallback to defaults
      }
    };
    loadWorkHours();
  }, []);

  const handleWorkHourChange = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setWorkHours(prev => prev.map(d => d.day_of_week === dayIndex ? { ...d, [field]: value } : d));
  };

  const handleDayOffToggle = (dayIndex: number, isDayOff: boolean) => {
    setWorkHours(prev => prev.map(d => d.day_of_week === dayIndex ? { ...d, is_day_off: isDayOff } : d));
  };

  const handleSaveWorkHours = async () => {
    setWorkHoursLoading(true);
    try {
      await api.workHours.update(workHours);
      toast({ title: 'Успешно', description: 'Расписание рабочих часов сохранено' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить расписание', variant: 'destructive' });
    } finally {
      setWorkHoursLoading(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    setLoading(true);
    try {
      const settingsToSave = {
        ...systemSettings,
        work_priority: systemSettings.work_priority ? 'True' : 'False',
      };
      console.log('💾 [SETTINGS] Сохраняем настройки:', settingsToSave);
      await api.settings.update(settingsToSave);
      await refreshSettings();
      toast({ title: 'Успешно', description: 'Системные настройки сохранены' });
    } catch (error) {
      console.error('❌ [SETTINGS] Ошибка сохранения:', error);
      toast({ title: 'Ошибка', description: 'Не удалось сохранить', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Настройки</h2>
        <p className="text-gray-500 mt-1">
          Системные настройки и профиль
        </p>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
          <TabsList>
            <TabsTrigger value="system">Системные</TabsTrigger>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    Время подготовки и буферы
                  </CardTitle>
                  <CardDescription>
                    Установите время на подготовку и отдых между сеансами
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Время подготовки (минут)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={systemSettings.prep_time}
                      onChange={(e) => setSystemSettings({ ...systemSettings, prep_time: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Буфер между сеансами (минут)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={systemSettings.buffer_time}
                      onChange={(e) => setSystemSettings({ ...systemSettings, buffer_time: Number(e.target.value) })}
                    />
                  </div>
                  <Button onClick={handleSaveSystemSettings} disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="CalendarDays" size={20} />
                    Расписание рабочих часов
                  </CardTitle>
                  <CardDescription>
                    Укажите часы работы для каждого дня недели
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workHours.map((day) => (
                    <div key={day.day_of_week} className="flex items-center gap-3">
                      <div className="w-28 text-sm font-medium text-gray-700 shrink-0">
                        {DAY_NAMES[day.day_of_week]}
                      </div>
                      <Switch
                        checked={!day.is_day_off}
                        onCheckedChange={(checked) => handleDayOffToggle(day.day_of_week, !checked)}
                      />
                      {day.is_day_off ? (
                        <span className="text-sm text-muted-foreground">Выходной</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={day.start_time || '10:00'}
                            onChange={(e) => handleWorkHourChange(day.day_of_week, 'start_time', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-muted-foreground text-sm">—</span>
                          <Input
                            type="time"
                            value={day.end_time || '20:00'}
                            onChange={(e) => handleWorkHourChange(day.day_of_week, 'end_time', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="pt-2 flex items-center gap-4">
                    <Button onClick={handleSaveWorkHours} disabled={workHoursLoading}>
                      {workHoursLoading ? 'Сохранение...' : 'Сохранить расписание'}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={systemSettings.work_priority}
                        onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, work_priority: checked })}
                      />
                      <span className="text-sm text-muted-foreground">
                        {systemSettings.work_priority
                          ? 'Учёба не влияет на слоты'
                          : 'Вычитать учёбу из рабочих часов'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Bell" size={20} />
                    Уведомления
                  </CardTitle>
                  <CardDescription>
                    Настройка напоминаний клиентам
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Отправлять напоминание за</Label>
                    <select
                      value={systemSettings.reminder_hours}
                      onChange={(e) => setSystemSettings({ ...systemSettings, reminder_hours: Number(e.target.value) })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value={0}>Не отправлять</option>
                      <option value={0.5}>30 минут</option>
                      <option value={1}>1 час</option>
                      <option value={1.5}>1.5 часа</option>
                      <option value={2}>2 часа</option>
                      <option value={2.5}>2.5 часа</option>
                      <option value={3}>3 часа</option>
                      <option value={3.5}>3.5 часа</option>
                      <option value={4}>4 часа</option>
                      <option value={4.5}>4.5 часа</option>
                      <option value={5}>5 часов</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      {systemSettings.reminder_hours === 0 
                        ? 'Напоминания отключены' 
                        : `Клиенты получат напоминание за ${systemSettings.reminder_hours >= 1 ? Math.floor(systemSettings.reminder_hours) + ' ч' : ''} ${systemSettings.reminder_hours % 1 !== 0 ? '30 мин' : ''} до визита`}
                    </p>
                  </div>
                  <Button onClick={handleSaveSystemSettings} disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="User" size={20} />
                    Профиль
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Имя</Label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <Button>Сохранить</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default SettingsTab;