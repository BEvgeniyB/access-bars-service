import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormProps {
  telegramId: string;
  setTelegramId: (value: string) => void;
  telegramGroupId: string;
  setTelegramGroupId: (value: string) => void;
  error: string;
  loading: boolean;
  onLogin: () => void;
}

const LoginForm = ({
  telegramId,
  setTelegramId,
  telegramGroupId,
  setTelegramGroupId,
  error,
  loading,
  onLogin,
}: LoginFormProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Админ-панель ChakraCraft</CardTitle>
          <CardDescription className="text-center text-sm">
            Войдите через Telegram ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="telegram_id" className="text-sm">Telegram ID</Label>
            <Input
              id="telegram_id"
              placeholder="123456789"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telegram_group_id" className="text-sm">Telegram Group ID</Label>
            <Input
              id="telegram_group_id"
              placeholder="-1001234567890"
              value={telegramGroupId}
              onChange={(e) => setTelegramGroupId(e.target.value)}
              className="text-base"
            />
          </div>
          <Button onClick={onLogin} disabled={loading} className="w-full">
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
