import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NOTIFICATIONS_API_URL } from '@/components/booking/BookingFormTypes';

interface EmailStatus {
  smtp_configured: boolean;
  admin_email_set: boolean;
  last_test: string | null;
  error_message: string | null;
}

export default function EmailSettingsPanel() {
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkEmailStatus = async () => {
    setLoading(true);
    // Симуляция проверки статуса
    setTimeout(() => {
      setEmailStatus({
        smtp_configured: false,
        admin_email_set: false,
        last_test: null,
        error_message: 'Настройте секреты проекта для работы email уведомлений'
      });
      setLoading(false);
    }, 1000);
  };

  const testEmailSending = async () => {
    setTesting(true);
    setTimeout(() => {
      alert('📧 Функция тестирования email будет доступна после настройки всех секретов');
      setTesting(false);
    }, 1000);
  };

  React.useEffect(() => {
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

              {emailStatus.last_test && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Последний тест:</span>
                  <span className="text-sm text-gray-600">{emailStatus.last_test}</span>
                </div>
              )}

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

      {/* Инструкции по настройке */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Info" size={20} />
            Как настроить Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 mb-4">
              Для работы email уведомлений нужно настроить 5 параметров в секретах проекта:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Icon name="Server" size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">SMTP_HOST</p>
                  <p className="text-sm text-blue-700">smtp.yandex.ru (для Яндекс) или smtp.gmail.com (для Gmail)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Icon name="Hash" size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">SMTP_PORT</p>
                  <p className="text-sm text-blue-700">587 (рекомендуется) или 465</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Icon name="Mail" size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">EMAIL_USER</p>
                  <p className="text-sm text-blue-700">Ваш email адрес (от имени которого отправляются письма)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Icon name="Key" size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">EMAIL_PASSWORD</p>
                  <p className="text-sm text-blue-700">Пароль приложения (НЕ обычный пароль от почты!)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Icon name="UserCheck" size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">ADMIN_EMAIL</p>
                  <p className="text-sm text-blue-700">Email администратора (куда приходят уведомления о записях)</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <Icon name="AlertTriangle" size={16} />
                <span className="font-medium">Важно!</span>
              </div>
              <p className="text-sm text-yellow-700">
                Для EMAIL_PASSWORD используйте <strong>пароль приложения</strong>, а не обычный пароль от почты. 
                Создайте его в настройках безопасности вашего почтового сервиса.
              </p>
            </div>
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
              disabled={testing || !emailStatus?.smtp_configured || !emailStatus?.admin_email_set}
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