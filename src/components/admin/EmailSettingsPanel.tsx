import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { SMTPSettings, EmailStatus } from '@/types/admin';
import { getEmailSettings, saveEmailSettings, validateEmailSettings } from '@/utils/emailSettings';

const SMTP_CONFIG_API_URL = 'https://functions.poehali.dev/9449ef82-dea6-46a7-b3e8-a26709cae9a5';

export default function EmailSettingsPanel() {
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [smtpSettings, setSmtpSettings] = useState<SMTPSettings>(getEmailSettings());
  const [saving, setSaving] = useState(false);

  const checkEmailStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(SMTP_CONFIG_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmailStatus({
          smtp_configured: true,
          admin_email_set: !!data.admin_email,
          password_configured: data.has_email_password,
          last_test: null,
          error_message: data.has_email_password ? null : 'Добавьте секрет EMAIL_PASSWORD для тестирования'
        });
      } else {
        throw new Error('Ошибка получения статуса');
      }
    } catch (error) {
      setEmailStatus({
        smtp_configured: false,
        admin_email_set: false,
        password_configured: false,
        last_test: null,
        error_message: 'Ошибка подключения к SMTP функции'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      saveEmailSettings(smtpSettings);
      await checkEmailStatus();
      alert('✅ Настройки сохранены!');
    } catch (error) {
      alert('❌ Ошибка сохранения настроек');
    } finally {
      setSaving(false);
    }
  };

  const testEmailSending = async () => {
    setTesting(true);
    try {
      const response = await fetch(SMTP_CONFIG_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'test_smtp'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('✅ Тестовое письмо отправлено! Проверьте почту natalya.velikaya@yandex.ru');
        // Обновляем статус после успешного теста
        await checkEmailStatus();
      } else {
        alert(`❌ Ошибка отправки: ${result.error}`);
      }
    } catch (error) {
      alert('❌ Ошибка соединения с SMTP функцией');
    } finally {
      setTesting(false);
    }
  };

  const handleSettingChange = (field: keyof SMTPSettings, value: string | number | boolean) => {
    setSmtpSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    checkEmailStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Настройки Email уведомлений</h2>
        <Button onClick={checkEmailStatus} variant="outline" size="sm" disabled={loading}>
          <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
          Проверить статус
        </Button>
      </div>

      {/* Статус настроек */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Settings" size={20} />
            Статус конфигурации
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailStatus ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SMTP настройки:</span>
                <Badge className={emailStatus.smtp_configured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {emailStatus.smtp_configured ? '✅ Настроено' : '❌ Не настроено'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email администратора:</span>
                <Badge className={emailStatus.admin_email_set ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {emailStatus.admin_email_set ? '✅ Указан' : '❌ Не указан'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Пароль email (секрет):</span>
                <Badge className={emailStatus.password_configured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {emailStatus.password_configured ? '✅ Настроено' : '⚠️ Добавьте секрет EMAIL_PASSWORD'}
                </Badge>
              </div>

              {emailStatus.error_message && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <Icon name="AlertCircle" size={16} />
                    <span className="text-sm font-medium">Ошибка:</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{emailStatus.error_message}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <Icon name="Loader2" size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Проверяем статус...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Форма настроек SMTP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Mail" size={20} />
            SMTP настройки
          </CardTitle>
          <CardDescription>
            Настройте параметры почтового сервера для отправки уведомлений
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP сервер</Label>
              <Input
                id="smtp-host"
                placeholder="smtp.yandex.ru"
                value={smtpSettings.host}
                onChange={(e) => handleSettingChange('host', e.target.value)}
              />
              <p className="text-xs text-gray-500">smtp.yandex.ru, smtp.gmail.com, smtp.mail.ru</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-port">Порт</Label>
              <Input
                id="smtp-port"
                type="number"
                placeholder="587"
                value={smtpSettings.port}
                onChange={(e) => handleSettingChange('port', parseInt(e.target.value) || 587)}
              />
              <p className="text-xs text-gray-500">587 (TLS) или 465 (SSL)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-user">Email отправителя</Label>
            <Input
              id="email-user"
              type="email"
              placeholder="your-email@yandex.ru"
              value={smtpSettings.username}
              onChange={(e) => handleSettingChange('username', e.target.value)}
            />
            <p className="text-xs text-gray-500">Адрес, от имени которого отправляются письма</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-email">Email администратора</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={smtpSettings.adminEmail}
              onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
            />
            <p className="text-xs text-gray-500">Куда приходят уведомления о новых записях</p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-enabled">Включить email уведомления</Label>
              <p className="text-xs text-gray-500">Автоматическая отправка писем при записях</p>
            </div>
            <Switch
              id="email-enabled"
              checked={smtpSettings.enabled}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSaveSettings} 
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Сохраняем...
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить настройки
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Инструкция по паролю */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Key" size={20} />
            Настройка пароля
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 mb-2">
              <Icon name="AlertTriangle" size={16} />
              <span className="font-medium">Важно!</span>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              Добавьте секрет <code className="bg-yellow-100 px-1 rounded">EMAIL_PASSWORD</code> в настройках проекта:
            </p>
            <ul className="text-sm text-yellow-700 space-y-1 ml-4 list-disc">
              <li>Для Яндекс: создайте пароль приложения в настройках безопасности</li>
              <li>Для Gmail: включите 2FA и создайте пароль приложения</li>
              <li>НЕ используйте обычный пароль от почты!</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Тест отправки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Send" size={20} />
            Тест отправки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 mb-1">
                Отправить тестовое письмо администратору
              </p>
              <p className="text-xs text-gray-500">
                Проверьте, что все настройки работают корректно
              </p>
            </div>
            <Button 
              onClick={testEmailSending} 
              disabled={testing || !validateEmailSettings(smtpSettings)}
              className="ml-4"
            >
              {testing ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Отправляем...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить тест
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}