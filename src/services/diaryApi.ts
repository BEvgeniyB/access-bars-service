const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-api.com';

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  notes?: string;
  telegramChatId?: string;
}

export interface Admin {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'manager';
}

export interface ScheduleSettings {
  workingHours: {
    start: string;
    end: string;
  };
  breakTime?: {
    start: string;
    end: string;
  };
  slotDuration: number;
  daysOff: string[];
}

export interface ScheduleCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  schedule: {
    [date: string]: {
      start: string;
      end: string;
      breaks?: { start: string; end: string }[];
    };
  };
  isActive: boolean;
  createdAt: string;
}

class DiaryAPI {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('diary_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async login(username: string, password: string): Promise<{ token: string; admin: Admin }> {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Неверные учетные данные');
    }

    return response.json();
  }

  async getAvailableSlots(date: string, serviceId: string): Promise<TimeSlot[]> {
    const response = await fetch(
      `${API_BASE_URL}/slots?date=${date}&serviceId=${serviceId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) {
      throw new Error('Не удалось загрузить слоты');
    }

    return response.json();
  }

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      throw new Error('Не удалось создать запись');
    }

    return response.json();
  }

  async getBookings(filters?: {
    date?: string;
    status?: string;
    serviceId?: string;
  }): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.serviceId) params.append('serviceId', filters.serviceId);

    const response = await fetch(
      `${API_BASE_URL}/admin/bookings?${params.toString()}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) {
      throw new Error('Не удалось загрузить записи');
    }

    return response.json();
  }

  async updateBookingStatus(
    bookingId: string,
    status: 'confirmed' | 'cancelled'
  ): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Не удалось обновить статус');
    }

    return response.json();
  }

  async getServices(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/services`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить услуги');
    }

    return response.json();
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/admin/services`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error('Не удалось создать услугу');
    }

    return response.json();
  }

  async updateService(serviceId: string, service: Partial<Service>): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error('Не удалось обновить услугу');
    }

    return response.json();
  }

  async deleteService(serviceId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Не удалось удалить услугу');
    }
  }

  async getScheduleSettings(): Promise<ScheduleSettings> {
    const response = await fetch(`${API_BASE_URL}/admin/schedule`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить настройки расписания');
    }

    return response.json();
  }

  async updateScheduleSettings(settings: ScheduleSettings): Promise<ScheduleSettings> {
    const response = await fetch(`${API_BASE_URL}/admin/schedule`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Не удалось обновить настройки');
    }

    return response.json();
  }

  async getScheduleCycles(): Promise<ScheduleCycle[]> {
    const response = await fetch(`${API_BASE_URL}/admin/schedule-cycles`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить циклы расписания');
    }

    return response.json();
  }

  async createScheduleCycle(cycle: Omit<ScheduleCycle, 'id' | 'createdAt'>): Promise<ScheduleCycle> {
    const response = await fetch(`${API_BASE_URL}/admin/schedule-cycles`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cycle),
    });

    if (!response.ok) {
      throw new Error('Не удалось создать цикл');
    }

    return response.json();
  }

  async updateScheduleCycle(cycleId: string, cycle: Partial<ScheduleCycle>): Promise<ScheduleCycle> {
    const response = await fetch(`${API_BASE_URL}/admin/schedule-cycles/${cycleId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cycle),
    });

    if (!response.ok) {
      throw new Error('Не удалось обновить цикл');
    }

    return response.json();
  }

  async deleteScheduleCycle(cycleId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/schedule-cycles/${cycleId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Не удалось удалить цикл');
    }
  }
}

export const diaryApi = new DiaryAPI();
