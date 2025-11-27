import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

interface User {
  telegram_id: string;
  role: 'admin' | 'owner';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (telegramId: number) => Promise<void>;
  loginByGroupId: (groupId: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isOwner: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Check for groupId in URL params
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get('groupId');
    if (groupId) {
      loginByGroupId(groupId);
    }
  }, []);

  const login = async (telegramId: number) => {
    setLoading(true);
    try {
      const response = await api.auth.login(telegramId);
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginByGroupId = async (groupId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/11f94891-555b-485d-ba38-a93639bb439c?action=getOwnerByGroupId&groupId=${groupId}`
      );
      const data = await response.json();
      
      if (data.telegram_id) {
        await login(Number(data.telegram_id));
      }
    } catch (error) {
      console.error('Login by group ID failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  const isClient = !user || (user.role !== 'admin' && user.role !== 'owner');

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginByGroupId, logout, isAdmin, isOwner, isClient }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
