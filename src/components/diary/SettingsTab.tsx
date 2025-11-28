import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/diary/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/diary/DataContext';
import { api } from '@/services/diary/api';

const SettingsTab = () => {
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const { settings: contextSettings, refreshSettings } = useData();
  const [loading, setLoading] = useState(false);
  
  const [systemSettings, setSystemSettings] = useState({
    prep_time: 0,
    buffer_time: 0,
    work_hours_start: '09:00',
    work_hours_end: '18:00',
    work_priority: true,
    reminder_hours: 0,
  });

  const [profile, setProfile] = useState({
    name: user?.telegram_id || '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    console.log('📥 [SETTINGS] Загрузка настроек из контекста:', contextSettings);
    const loadedSettings = {
      prep_time: Number(contextSettings.prep_time) || 0,
      buffer_time: Number(contextSettings.buffer_time) || 0,
      work_hours_start: contextSettings.work_hours_start || '09:00',
      work_hours_end: contextSettings.work_hours_end || '18:00',
      work_priority: contextSettings.work_priority === 'True' || contextSettings.work_priority === 'true',
      reminder_hours: Number(contextSettings.reminder_hours) || 0,
    };
    console.log('✅ [SETTINGS] Установленные настройки:', loadedSettings);
    setSystemSettings(loadedSettings);
  }, [contextSettings]);

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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    Рабочее время
                  </CardTitle>
                  <CardDescription>
                    Общие часы работы для всех владельцев
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Начало работы</Label>
                      <Input
                        type="time"
                        value={systemSettings.work_hours_start}
                        onChange={(e) => setSystemSettings({ ...systemSettings, work_hours_start: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Конец работы</Label>
                      <Input
                        type="time"
                        value={systemSettings.work_hours_end}
                        onChange={(e) => setSystemSettings({ ...systemSettings, work_hours_end: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={systemSettings.work_priority}
                        onChange={(e) => setSystemSettings({ ...systemSettings, work_priority: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span>Приоритет рабочего времени</span>
                    </Label>
                    <p className="text-xs text-muted-foreground ml-6">
                      {systemSettings.work_priority 
                        ? '✓ Клиенты видят слоты только в рабочее время (учёба игнорируется)'
                        : '✗ Клиенты видят слоты: рабочее время минус учёба'}
                    </p>
                  </div>
                  <Button onClick={handleSaveSystemSettings} disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
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