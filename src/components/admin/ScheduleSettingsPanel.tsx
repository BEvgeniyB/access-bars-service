import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { SCHEDULE_API_URL } from '@/components/booking/BookingFormTypes';

const DAY_NAMES = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

interface ScheduleSettings {
  time_slot_interval_minutes: number;
  break_duration_minutes: number;
}

interface WorkHourDay {
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_day_off: boolean;
}

const ScheduleSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<ScheduleSettings>({
    time_slot_interval_minutes: 30,
    break_duration_minutes: 0,
  });

  const [workHours, setWorkHours] = useState<WorkHourDay[]>(
    Array.from({ length: 7 }, (_, i) => ({
      day_of_week: i,
      start_time: '12:00',
      end_time: '20:00',
      is_day_off: i === 2,
    }))
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [settingsRes, hoursRes] = await Promise.all([
        fetch(`${SCHEDULE_API_URL}?action=get_settings`),
        fetch(`${SCHEDULE_API_URL}?action=get_work_hours`),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.settings) {
          setSettings({
            time_slot_interval_minutes: data.settings.time_slot_interval_minutes || 30,
            break_duration_minutes: data.settings.break_duration_minutes || 0,
          });
        }
      }

      if (hoursRes.ok) {
        const data = await hoursRes.json();
        if (data.work_hours && data.work_hours.length > 0) {
          setWorkHours(data.work_hours);
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка загрузки настроек' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(SCHEDULE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_settings', settings }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Настройки сохранены' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Ошибка сохранения' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка подключения к серверу' });
    } finally {
      setSaving(false);
    }
  };

  const saveWorkHours = async () => {
    setSavingHours(true);
    setMessage(null);
    try {
      const response = await fetch(SCHEDULE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_work_hours', work_hours: workHours }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Расписание сохранено' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Ошибка сохранения' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ошибка подключения к серверу' });
    } finally {
      setSavingHours(false);
    }
  };

  const handleWorkHourChange = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setWorkHours(prev => prev.map(d => d.day_of_week === dayIndex ? { ...d, [field]: value } : d));
  };

  const handleDayOffToggle = (dayIndex: number, isDayOff: boolean) => {
    setWorkHours(prev => prev.map(d => d.day_of_week === dayIndex ? { ...d, is_day_off: isDayOff } : d));
  };

  const getPreviewSlots = () => {
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    const day = workHours[dayIndex];
    if (!day || day.is_day_off || !day.start_time || !day.end_time) return [];
    return generateTimeSlots(day.start_time, day.end_time, settings.time_slot_interval_minutes);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={32} className="animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  const previewSlots = getPreviewSlots();

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg border flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <Icon name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'} size={16} />
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="CalendarDays" size={20} />
            Расписание рабочих часов
          </CardTitle>
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
          <div className="pt-2">
            <Button onClick={saveWorkHours} disabled={savingHours}>
              {savingHours ? (
                <><Icon name="Loader2" size={16} className="mr-2 animate-spin" />Сохранение...</>
              ) : (
                <><Icon name="Save" size={16} className="mr-2" />Сохранить расписание</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Clock" size={20} />
            Параметры слотов
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="interval">Интервал между слотами (минуты)</Label>
              <Input
                id="interval"
                type="number"
                min="15"
                max="120"
                step="15"
                value={settings.time_slot_interval_minutes}
                onChange={(e) => setSettings(prev => ({ ...prev, time_slot_interval_minutes: parseInt(e.target.value) || 30 }))}
              />
              <p className="text-sm text-gray-500">Рекомендуется: 15, 30 или 60 минут</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="break">Технический перерыв после сеанса (минуты)</Label>
              <Input
                id="break"
                type="number"
                min="0"
                max="60"
                step="15"
                value={settings.break_duration_minutes}
                onChange={(e) => setSettings(prev => ({ ...prev, break_duration_minutes: parseInt(e.target.value) || 0 }))}
              />
              <p className="text-sm text-gray-500">Время для подготовки к следующему клиенту</p>
            </div>
          </div>

          {previewSlots.length > 0 && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Icon name="Eye" size={16} />
                Предварительный просмотр (сегодня)
              </h3>
              <div className="flex flex-wrap gap-2">
                {previewSlots.slice(0, 8).map((slot, index) => (
                  <span key={index} className="px-3 py-1 bg-white border rounded text-sm">{slot}</span>
                ))}
                {previewSlots.length > 8 && (
                  <span className="px-3 py-1 text-gray-500 text-sm">...ещё {previewSlots.length - 8} слотов</span>
                )}
              </div>
            </div>
          )}

          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <><Icon name="Loader2" size={16} className="mr-2 animate-spin" />Сохранение...</>
            ) : (
              <><Icon name="Save" size={16} className="mr-2" />Сохранить параметры</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const generateTimeSlots = (startTime: string, endTime: string, interval: number): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  for (let minutes = startMinutes; minutes < endMinutes; minutes += interval) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
  }
  return slots;
};

export default ScheduleSettingsPanel;
