import { useState } from 'react';

const TELEGRAM_AUTH_URL = 'https://functions.poehali.dev/81142751-b500-40dc-91f2-9318b9f48791';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
  telegram_id: string;
  telegram_username?: string;
  chakra_id?: number;
}

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [telegramId, setTelegramId] = useState('');
  const [telegramGroupId, setTelegramGroupId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!telegramId.trim() || !telegramGroupId.trim()) {
      setError('Введите Telegram ID и Group ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(TELEGRAM_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: telegramId.trim(),
          telegram_group_id: telegramGroupId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка авторизации');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setToken(null);
    setCurrentUser(null);
  };

  return {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken,
    currentUser,
    setCurrentUser,
    telegramId,
    setTelegramId,
    telegramGroupId,
    setTelegramGroupId,
    error,
    setError,
    loading,
    handleLogin,
    handleLogout,
  };
};
