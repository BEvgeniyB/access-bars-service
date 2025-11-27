import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { diaryApi, Admin } from '@/services/diaryApi';

interface DiaryAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (telegramId: string) => Promise<void>;
  logout: () => void;
}

const DiaryAuthContext = createContext<DiaryAuthContextType | undefined>(undefined);

export function DiaryAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('diary_token');
    const savedAdmin = localStorage.getItem('diary_admin');

    if (token && savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Failed to parse saved admin:', error);
        localStorage.removeItem('diary_token');
        localStorage.removeItem('diary_admin');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (telegramId: string) => {
    const { token, user } = await diaryApi.loginWithTelegram(telegramId);
    localStorage.setItem('diary_token', token);
    localStorage.setItem('diary_admin', JSON.stringify(user));
    setAdmin(user);
  };

  const logout = () => {
    localStorage.removeItem('diary_token');
    localStorage.removeItem('diary_admin');
    setAdmin(null);
  };

  return (
    <DiaryAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </DiaryAuthContext.Provider>
  );
}

export function useDiaryAuth() {
  const context = useContext(DiaryAuthContext);
  if (context === undefined) {
    throw new Error('useDiaryAuth must be used within DiaryAuthProvider');
  }
  return context;
}