import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const AdminButton = () => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Сложный пароль из 10 символов
  const ADMIN_PASSWORD = 'K9mX#7bN2w';

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setShowPasswordDialog(false);
      setPassword('');
      setError('');
      navigate('/admin');
    } else {
      setError('Неверный пароль');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  const handleCancel = () => {
    setShowPasswordDialog(false);
    setPassword('');
    setError('');
  };

  return (
    <>
      {/* Кнопка админки в самом низу страницы */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setShowPasswordDialog(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          title="Админ-панель"
        >
          <Icon name="Settings" size={20} />
        </Button>
      </div>

      {/* Диалог ввода пароля */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Icon name="Lock" size={24} />
                Вход в админ-панель
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <Icon name="AlertCircle" size={16} />
                    {error}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button onClick={handlePasswordSubmit} className="flex-1">
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Войти
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  <Icon name="X" size={16} className="mr-2" />
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AdminButton;