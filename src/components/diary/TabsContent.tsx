import { useAppContext } from '@/contexts/diary/AppContext';
import BookingsTab from './BookingsTab';
import ClientsTab from './ClientsTab';
import ServicesTab from './ServicesTab';
import SettingsTab from './SettingsTab';

const TabsContentComponent = () => {
  const { activeTab } = useAppContext();
  return (
    <>
      {activeTab === 'bookings' && <BookingsTab />}
      {activeTab === 'clients' && <ClientsTab />}
      {activeTab === 'services' && <ServicesTab />}
      {activeTab === 'settings' && <SettingsTab />}
      {activeTab === 'my-schedule' && <div className="p-8 text-center text-gray-500">MyScheduleTab - скоро будет добавлен</div>}
    </>
  );
};

export default TabsContentComponent;