import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiaryAuth } from '@/contexts/DiaryAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function DiaryLoginPage() {
  const [telegramId, setTelegramId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useDiaryAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(telegramId);
      navigate('/diary');
    } catch (error) {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный Telegram ID или нет доступа',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Icon name="Calendar" className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Вход в админ-панель</CardTitle>
          <CardDescription className="text-center">
            Введите ваш Telegram ID для доступа к системе онлайн-записи
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telegramId">Telegram ID</Label>
              <Input
                id="telegramId"
                type="text"
                placeholder="123456789"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">
                Узнать свой ID: напишите @userinfobot в Telegram
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}