import React from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AdminLoginFormProps {
  password: string;
  setPassword: (password: string) => void;
  authError: string;
  onSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function AdminLoginForm({ 
  password, 
  setPassword, 
  authError, 
  onSubmit, 
  onKeyPress 
}: AdminLoginFormProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
              onKeyPress={onKeyPress}
              autoFocus
            />
            {authError && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <Icon name="AlertCircle" size={16} />
                {authError}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={onSubmit} className="flex-1">
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline" className="flex-1">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
