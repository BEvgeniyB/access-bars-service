import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { SCHEDULE_API_URL } from '@/components/booking/BookingFormTypes';

interface ScheduleSettings {
  time_slot_interval_minutes: number;
  break_duration_minutes: number;
  working_hours_start: string;
  working_hours_end: string;
}

const ScheduleSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<ScheduleSettings>({
    time_slot_interval_minutes: 30,
    break_duration_minutes: 30,
    working_hours_start: '12:00',
    working_hours_end: '21:00'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SCHEDULE_API_URL}?action=get_settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings({
            time_slot_interval_minutes: data.settings.time_slot_interval_minutes || 30,
            break_duration_minutes: data.settings.break_duration_minutes || 30,
            working_hours_start: data.settings.working_hours_start?.slice(0, 5) || '12:00',
            working_hours_end: data.settings.working_hours_end?.slice(0, 5) || '21:00'
          });
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save_settings',
          settings: {
            ...settings,
            working_hours_start: `${settings.working_hours_start}:00`,
            working_hours_end: `${settings.working_hours_end}:00`
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage({ type: 'success', text: 'Настройки успешно сохранены!' });
          // Обновляем страницу через 2 секунды для применения новых настроек
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setMessage({ type: 'error', text: data.error || 'Ошибка сохранения настроек' });
        }
      } else {
        setMessage({ type: 'error', text: 'Ошибка сохранения настроек' });
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setMessage({ type: 'error', text: 'Ошибка подключения к серверу' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ScheduleSettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Clock" size={20} />
            Настройки расписания
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <div className={`p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                <Icon 
                  name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                  size={16} 
                />
                {message.text}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Интервал слотов времени */}
            <div className="space-y-2">
              <Label htmlFor="interval">Интервал между слотами времени (минуты)</Label>
              <Input
                id="interval"
                type="number"
                min="15"
                max="120"
                step="15"
                value={settings.time_slot_interval_minutes}
                onChange={(e) => handleInputChange('time_slot_interval_minutes', parseInt(e.target.value) || 30)}
                className="w-full"
              />
              <p className="text-sm text-gray-600">
                Рекомендуется: 15, 30 или 60 минут
              </p>
            </div>

            {/* Длительность перерыва */}
            <div className="space-y-2">
              <Label htmlFor="break">Технический перерыв после сеанса (минуты)</Label>
              <Input
                id="break"
                type="number"
                min="0"
                max="60"
                step="15"
                value={settings.break_duration_minutes}
                onChange={(e) => handleInputChange('break_duration_minutes', parseInt(e.target.value) || 0)}
                className="w-full"
              />
              <p className="text-sm text-gray-600">
                Время для уборки и подготовки к следующему клиенту
              </p>
            </div>

            {/* Начало рабочего дня */}
            <div className="space-y-2">
              <Label htmlFor="start">Начало рабочего дня</Label>
              <Input
                id="start"
                type="time"
                value={settings.working_hours_start}
                onChange={(e) => handleInputChange('working_hours_start', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Конец рабочего дня */}
            <div className="space-y-2">
              <Label htmlFor="end">Конец рабочего дня</Label>
              <Input
                id="end"
                type="time"
                value={settings.working_hours_end}
                onChange={(e) => handleInputChange('working_hours_end', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Предварительный просмотр */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Icon name="Eye" size={16} />
              Предварительный просмотр слотов времени
            </h3>
            <div className="flex flex-wrap gap-2">
              {generateTimeSlots(
                settings.working_hours_start,
                settings.working_hours_end,
                settings.time_slot_interval_minutes
              ).slice(0, 8).map((slot, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-white border rounded text-sm"
                >
                  {slot}
                </span>
              ))}
              {generateTimeSlots(
                settings.working_hours_start,
                settings.working_hours_end,
                settings.time_slot_interval_minutes
              ).length > 8 && (
                <span className="px-3 py-1 text-gray-500 text-sm">
                  ...еще {generateTimeSlots(
                    settings.working_hours_start,
                    settings.working_hours_end,
                    settings.time_slot_interval_minutes
                  ).length - 8} слотов
                </span>
              )}
            </div>
          </div>

          <Button 
            onClick={saveSettings}
            disabled={saving}
            className="w-full md:w-auto"
          >
            {saving ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить настройки
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Функция генерации слотов времени для предварительного просмотра
const generateTimeSlots = (startTime: string, endTime: string, interval: number): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  for (let minutes = startMinutes; minutes < endMinutes; minutes += interval) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push(timeString);
  }
  
  return slots;
};

export default ScheduleSettingsPanel;