import { Button } from '@/components/ui/button';
import { useDiaryAuth } from '@/contexts/DiaryAuthContext';
import { useDiaryApp } from '@/contexts/DiaryAppContext';
import Icon from '@/components/ui/icon';

interface MenuItemProps {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

function MenuItem({ label, icon, isActive, onClick }: MenuItemProps) {
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className="w-full justify-start"
      onClick={onClick}
    >
      <Icon name={icon as any} className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

export default function DiarySidebar() {
  const { admin, logout } = useDiaryAuth();
  const { activeTab, setActiveTab, isSidebarOpen } = useDiaryApp();

  const menuItems = [
    { id: 'bookings', label: 'Записи', icon: 'Calendar' },
    { id: 'schedule', label: 'Расписание', icon: 'Clock' },
    { id: 'services', label: 'Услуги', icon: 'Briefcase' },
    { id: 'clients', label: 'Клиенты', icon: 'Users' },
    { id: 'analytics', label: 'Аналитика', icon: 'BarChart3' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Онлайн-запись</h2>
        {admin && (
          <p className="text-sm text-muted-foreground mt-1">
            {admin.name}
          </p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={logout}
        >
          <Icon name="LogOut" className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </aside>
  );
}
