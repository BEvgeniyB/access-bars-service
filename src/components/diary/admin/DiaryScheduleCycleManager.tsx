import { useState, useEffect } from 'react';
import { diaryApi, ScheduleCycle } from '@/services/diaryApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DiaryScheduleCycleManager() {
  const [cycles, setCycles] = useState<ScheduleCycle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = async () => {
    setIsLoading(true);
    try {
      const data = await diaryApi.getScheduleCycles();
      setCycles(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить циклы расписания',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (cycleId: string, currentStatus: boolean) => {
    try {
      await diaryApi.updateScheduleCycle(cycleId, { isActive: !currentStatus });
      await loadCycles();
      toast({
        title: 'Успешно',
        description: `Цикл ${!currentStatus ? 'активирован' : 'деактивирован'}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить цикл',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (cycleId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот цикл?')) return;

    try {
      await diaryApi.deleteScheduleCycle(cycleId);
      await loadCycles();
      toast({
        title: 'Успешно',
        description: 'Цикл удалён',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить цикл',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Циклы расписания</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Добавить цикл
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать цикл расписания</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Название цикла</Label>
                <Input placeholder="Например: Зимнее расписание" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Дата начала</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Дата окончания</Label>
                  <Input type="date" />
                </div>
              </div>
              <Button className="w-full">Создать</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {cycles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon name="Calendar" className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Нет созданных циклов расписания
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cycles.map((cycle) => (
            <Card key={cycle.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {cycle.name}
                      {cycle.isActive && (
                        <Badge variant="default">Активен</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(cycle.startDate).toLocaleDateString('ru-RU')} -{' '}
                      {new Date(cycle.endDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(cycle.id, cycle.isActive)}
                    >
                      {cycle.isActive ? 'Деактивировать' : 'Активировать'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cycle.id)}
                    >
                      <Icon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Дней в цикле: {Object.keys(cycle.schedule).length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
