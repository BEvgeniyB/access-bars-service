import { useEffect } from 'react';
import { useDiaryData } from '@/contexts/DiaryDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import DiaryScheduleCycleManager from '../DiaryScheduleCycleManager';
import { diaryApi } from '@/services/diaryApi';
import { useToast } from '@/hooks/use-toast';

export default function DiaryScheduleTab() {
  const { scheduleSettings, refreshSchedule } = useDiaryData();
  const { toast } = useToast();

  useEffect(() => {
    refreshSchedule();
  }, []);

  const handleSaveSettings = async () => {
    if (!scheduleSettings) return;

    try {
      await diaryApi.updateScheduleSettings(scheduleSettings);
      toast({
        title: 'Успешно',
        description: 'Настройки расписания сохранены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive',
      });
    }
  };

  if (!scheduleSettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Управление расписанием</h1>
        <p className="text-muted-foreground mt-2">
          Настройте рабочие часы и график приёма клиентов
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Базовые настройки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Начало рабочего дня</Label>
              <Input
                type="time"
                value={scheduleSettings.workingHours.start}
                onChange={(e) => {
                  scheduleSettings.workingHours.start = e.target.value;
                  refreshSchedule();
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Конец рабочего дня</Label>
              <Input
                type="time"
                value={scheduleSettings.workingHours.end}
                onChange={(e) => {
                  scheduleSettings.workingHours.end = e.target.value;
                  refreshSchedule();
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Длительность слота (минуты)</Label>
            <Input
              type="number"
              min="15"
              step="15"
              value={scheduleSettings.slotDuration}
              onChange={(e) => {
                scheduleSettings.slotDuration = parseInt(e.target.value);
                refreshSchedule();
              }}
            />
          </div>

          {scheduleSettings.breakTime && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Начало перерыва</Label>
                <Input
                  type="time"
                  value={scheduleSettings.breakTime.start}
                  onChange={(e) => {
                    if (scheduleSettings.breakTime) {
                      scheduleSettings.breakTime.start = e.target.value;
                      refreshSchedule();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Конец перерыва</Label>
                <Input
                  type="time"
                  value={scheduleSettings.breakTime.end}
                  onChange={(e) => {
                    if (scheduleSettings.breakTime) {
                      scheduleSettings.breakTime.end = e.target.value;
                      refreshSchedule();
                    }
                  }}
                />
              </div>
            </div>
          )}

          <Button onClick={handleSaveSettings}>
            <Icon name="Save" className="mr-2 h-4 w-4" />
            Сохранить настройки
          </Button>
        </CardContent>
      </Card>

      <DiaryScheduleCycleManager />
    </div>
  );
}
