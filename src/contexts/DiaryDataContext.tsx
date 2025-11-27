import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { diaryApi, Service, Booking, ScheduleSettings } from '@/services/diaryApi';
import { diaryCache } from '@/services/diaryCache';
import { useToast } from '@/hooks/use-toast';

interface DiaryDataContextType {
  services: Service[];
  bookings: Booking[];
  scheduleSettings: ScheduleSettings | null;
  isLoading: boolean;
  refreshServices: () => Promise<void>;
  refreshBookings: (filters?: any) => Promise<void>;
  refreshSchedule: () => Promise<void>;
  createService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  updateBookingStatus: (id: string, status: 'confirmed' | 'cancelled') => Promise<void>;
}

const DiaryDataContext = createContext<DiaryDataContextType | undefined>(undefined);

export function DiaryDataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const refreshServices = async () => {
    const cached = diaryCache.get<Service[]>('services');
    if (cached) {
      setServices(cached);
      return;
    }

    setIsLoading(true);
    try {
      const data = await diaryApi.getServices();
      setServices(data);
      diaryCache.set('services', data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить услуги',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBookings = async (filters?: any) => {
    const cacheKey = `bookings_${JSON.stringify(filters || {})}`;
    const cached = diaryCache.get<Booking[]>(cacheKey);
    if (cached) {
      setBookings(cached);
      return;
    }

    setIsLoading(true);
    try {
      const data = await diaryApi.getBookings(filters);
      setBookings(data);
      diaryCache.set(cacheKey, data, 2 * 60 * 1000);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить записи',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSchedule = async () => {
    const cached = diaryCache.get<ScheduleSettings>('schedule');
    if (cached) {
      setScheduleSettings(cached);
      return;
    }

    setIsLoading(true);
    try {
      const data = await diaryApi.getScheduleSettings();
      setScheduleSettings(data);
      diaryCache.set('schedule', data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить расписание',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createService = async (service: Omit<Service, 'id'>) => {
    try {
      const newService = await diaryApi.createService(service);
      setServices((prev) => [...prev, newService]);
      diaryCache.invalidate('services');
      toast({
        title: 'Успешно',
        description: 'Услуга создана',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать услугу',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateService = async (id: string, service: Partial<Service>) => {
    try {
      const updated = await diaryApi.updateService(id, service);
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
      diaryCache.invalidate('services');
      toast({
        title: 'Успешно',
        description: 'Услуга обновлена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить услугу',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await diaryApi.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      diaryCache.invalidate('services');
      toast({
        title: 'Успешно',
        description: 'Услуга удалена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить услугу',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const updated = await diaryApi.updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      diaryCache.invalidatePattern('bookings_');
      toast({
        title: 'Успешно',
        description: 'Статус записи обновлен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    refreshServices();
  }, []);

  return (
    <DiaryDataContext.Provider
      value={{
        services,
        bookings,
        scheduleSettings,
        isLoading,
        refreshServices,
        refreshBookings,
        refreshSchedule,
        createService,
        updateService,
        deleteService,
        updateBookingStatus,
      }}
    >
      {children}
    </DiaryDataContext.Provider>
  );
}

export function useDiaryData() {
  const context = useContext(DiaryDataContext);
  if (context === undefined) {
    throw new Error('useDiaryData must be used within DiaryDataProvider');
  }
  return context;
}
