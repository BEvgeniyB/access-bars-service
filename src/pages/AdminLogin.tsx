import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Отправка пароля на сервер...');
      const response = await fetch('https://functions.poehali.dev/27489cd4-1a5a-4783-be35-74077b1739ee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      console.log('Статус ответа:', response.status);
      const data = await response.json();
      console.log('Данные ответа:', data);

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_token_expires', data.expires_at);
        toast.success('Вход выполнен успешно');
        navigate('/admin');
      } else {
        console.error('Ошибка авторизации:', data);
        toast.error(data.error || 'Неверный пароль');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      toast.error('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Icon name="Lock" size={48} className="text-purple-600" />
          </div>
          <CardTitle className="text-2xl text-center">Админ-панель</CardTitle>
          <CardDescription className="text-center">
            Введите пароль для доступа к панели управления
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Войти
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;