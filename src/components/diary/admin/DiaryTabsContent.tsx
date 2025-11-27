import { useDiaryApp } from '@/contexts/DiaryAppContext';
import DiaryBookingsTab from './tabs/DiaryBookingsTab';
import DiaryScheduleTab from './tabs/DiaryScheduleTab';
import DiaryServicesTab from './tabs/DiaryServicesTab';
import DiaryClientsTab from './tabs/DiaryClientsTab';
import DiaryAnalyticsTab from './tabs/DiaryAnalyticsTab';
import DiarySettingsTab from './tabs/DiarySettingsTab';

export default function DiaryTabsContent() {
  const { activeTab } = useDiaryApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <DiaryBookingsTab />;
      case 'schedule':
        return <DiaryScheduleTab />;
      case 'services':
        return <DiaryServicesTab />;
      case 'clients':
        return <DiaryClientsTab />;
      case 'analytics':
        return <DiaryAnalyticsTab />;
      case 'settings':
        return <DiarySettingsTab />;
      default:
        return <DiaryBookingsTab />;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
}
