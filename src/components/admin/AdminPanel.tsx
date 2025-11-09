import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SCHEDULE_API_URL } from '@/components/booking/BookingFormTypes';
import EmailSettingsPanel from './EmailSettingsPanel';
import ServicesPanel from './ServicesPanel';
import ScheduleSettingsPanel from './ScheduleSettingsPanel';
import YandexMetrikaWidget from './YandexMetrikaWidget';
import DatabaseAnalytics from './DatabaseAnalytics';
import ReviewModerationPanel from './ReviewModerationPanel';
import BookingsTab from './BookingsTab';
import { logout } from '@/utils/auth';
import API_ENDPOINTS from '@/config/api';

const REVIEWS_API_URL = API_ENDPOINTS.reviews;

interface Booking {
  id: number;
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  end_time?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [weekBookings, setWeekBookings] = useState<{[key: string]: Booking[]}>({});
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);

  useEffect(() => {
    generateWeekDates();
    loadWeekBookings();
    loadPendingReviewsCount();
    
    const interval = setInterval(loadPendingReviewsCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    setWeekDates(dates);
  };

  const loadWeekBookings = async () => {
    setLoading(true);
    const bookingsData: {[key: string]: Booking[]} = {};
    
    try {
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const response = await fetch(`${SCHEDULE_API_URL}?action=get_bookings&date=${dateStr}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`Booking data for ${dateStr}:`, data.bookings);
            bookingsData[dateStr] = data.bookings || [];
          } else {
            console.error(`Failed to load bookings for ${dateStr}:`, response.status);
            bookingsData[dateStr] = [];
          }
        } catch (error) {
          console.error(`Ошибка загрузки записей для ${dateStr}:`, error);
          bookingsData[dateStr] = [];
        }
      }
      
      setWeekBookings(bookingsData);
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(SCHEDULE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_booking_status',
          booking_id: bookingId,
          status: newStatus
        })
      });

      if (response.ok) {
        loadWeekBookings();
      } else {
        console.error('Ошибка обновления статуса');
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const updateBookingService = async (bookingId: number, newServiceId: number) => {
    try {
      const response = await fetch(SCHEDULE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_booking_service',
          booking_id: bookingId,
          service_id: newServiceId
        })
      });

      if (response.ok) {
        loadWeekBookings();
      } else {
        console.error('Ошибка обновления услуги');
      }
    } catch (error) {
      console.error('Ошибка обновления услуги:', error);
    }
  };

  const loadPendingReviewsCount = async () => {
    try {
      const response = await fetch(`${REVIEWS_API_URL}?status=pending`);
      const data = await response.json();
      if (data.success) {
        setPendingReviewsCount(data.reviews?.length || 0);
      }
    } catch (error) {
      console.error('Ошибка загрузки счётчика отзывов:', error);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => {
                  logout();
                  navigate('/admin/login');
                }}
                variant="outline"
                className="flex items-center gap-2"
                title="Выйти из админки"
              >
                <Icon name="LogOut" size={16} />
                Выйти
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                На главную
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                Записи
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Icon name="BarChart3" size={16} />
                Яндекс
              </TabsTrigger>
              <TabsTrigger value="db-analytics" className="flex items-center gap-2">
                <Icon name="Database" size={16} />
                База данных
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Icon name="Package" size={16} />
                Услуги
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Icon name="Clock" size={16} />
                Расписание
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Icon name="Settings" size={16} />
                Email
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2 relative">
                <Icon name="MessageSquare" size={16} />
                Отзывы
                {pendingReviewsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {pendingReviewsCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="mt-6">
              <YandexMetrikaWidget />
            </TabsContent>
            
            <TabsContent value="db-analytics" className="mt-6">
              <DatabaseAnalytics />
            </TabsContent>
            
            <TabsContent value="bookings" className="mt-6">
              <BookingsTab
                weekDates={weekDates}
                weekBookings={weekBookings}
                onRefresh={loadWeekBookings}
                onUpdateStatus={updateBookingStatus}
                onUpdateService={updateBookingService}
              />
            </TabsContent>
            
            <TabsContent value="services" className="mt-6">
              <ServicesPanel />
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-6">
              <ScheduleSettingsPanel />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <EmailSettingsPanel />
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ReviewModerationPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}