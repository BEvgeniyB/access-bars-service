import { createContext, useContext, useState, ReactNode } from 'react';

interface DiaryAppContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DiaryAppContext = createContext<DiaryAppContextType | undefined>(undefined);

export function DiaryAppProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const setSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
  };

  return (
    <DiaryAppContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </DiaryAppContext.Provider>
  );
}

export function useDiaryApp() {
  const context = useContext(DiaryAppContext);
  if (context === undefined) {
    throw new Error('useDiaryApp must be used within DiaryAppProvider');
  }
  return context;
}
