import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiaryAuthProvider, useDiaryAuth } from '@/contexts/DiaryAuthContext';
import { DiaryAppProvider } from '@/contexts/DiaryAppContext';
import { DiaryDataProvider } from '@/contexts/DiaryDataContext';
import DiarySidebar from '@/components/diary/admin/DiarySidebar';
import DiaryTabsContent from '@/components/diary/admin/DiaryTabsContent';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useDiaryApp } from '@/contexts/DiaryAppContext';

function DiaryAdminContent() {
  const { isAuthenticated, isLoading } = useDiaryAuth();
  const { isSidebarOpen, toggleSidebar } = useDiaryApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/diary/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DiarySidebar />
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-card">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Icon name={isSidebarOpen ? 'X' : 'Menu'} className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Система онлайн-записи</h1>
            </div>
            <div className="w-10" />
          </div>
        </header>
        <DiaryTabsContent />
      </div>
    </div>
  );
}

export default function Diary() {
  return (
    <DiaryAuthProvider>
      <DiaryAppProvider>
        <DiaryDataProvider>
          <DiaryAdminContent />
        </DiaryDataProvider>
      </DiaryAppProvider>
    </DiaryAuthProvider>
  );
}
