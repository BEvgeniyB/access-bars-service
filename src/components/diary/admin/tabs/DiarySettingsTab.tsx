import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function DiarySettingsTab() {
  const [settings, setSettings] = useState({
    businessName: 'Моя компания',
    businessPhone: '+7 (999) 123-45-67',
    businessEmail: 'info@example.com',
    telegramBotToken: '',
    autoConfirm: false,
    sendNotifications: true,
    allowOnlinePayment: false,
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Настройки сохранены',
      description: 'Изменения успешно применены',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground mt-2">
          Управление параметрами системы онлайн-записи
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о компании</CardTitle>
          <CardDescription>
            Основные данные для отображения клиентам
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Название компании</Label>
            <Input
              id="businessName"
              value={settings.businessName}
              onChange={(e) =>
                setSettings({ ...settings, businessName: e.target.value })
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Телефон</Label>
              <Input
                id="businessPhone"
                value={settings.businessPhone}
                onChange={(e) =>
                  setSettings({ ...settings, businessPhone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Email</Label>
              <Input
                id="businessEmail"
                type="email"
                value={settings.businessEmail}
                onChange={(e) =>
                  setSettings({ ...settings, businessEmail: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Интеграция с Telegram</CardTitle>
          <CardDescription>
            Настройка уведомлений через Telegram бота
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telegramBotToken">Токен бота</Label>
            <Input
              id="telegramBotToken"
              type="password"
              placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              value={settings.telegramBotToken}
              onChange={(e) =>
                setSettings({ ...settings, telegramBotToken: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Получите токен у @BotFather в Telegram
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Отправлять уведомления</Label>
              <p className="text-xs text-muted-foreground">
                Уведомления о новых записях и изменениях
              </p>
            </div>
            <Switch
              checked={settings.sendNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, sendNotifications: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Поведение системы</CardTitle>
          <CardDescription>
            Настройки обработки записей
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автоподтверждение записей</Label>
              <p className="text-xs text-muted-foreground">
                Записи будут подтверждаться автоматически без вашего участия
              </p>
            </div>
            <Switch
              checked={settings.autoConfirm}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoConfirm: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Онлайн-оплата</Label>
              <p className="text-xs text-muted-foreground">
                Позволить клиентам оплачивать услуги при записи
              </p>
            </div>
            <Switch
              checked={settings.allowOnlinePayment}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowOnlinePayment: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Icon name="Save" className="mr-2 h-4 w-4" />
          Сохранить настройки
        </Button>
      </div>
    </div>
  );
}
