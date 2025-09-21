import { SMTPSettings } from '@/types/admin';

const STORAGE_KEY = 'smtp_settings';

export const getEmailSettings = (): SMTPSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading email settings:', error);
  }
  
  return {
    host: '',
    port: 587,
    username: '',
    adminEmail: '',
    enabled: false
  };
};

export const saveEmailSettings = (settings: SMTPSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving email settings:', error);
  }
};

export const validateEmailSettings = (settings: SMTPSettings): boolean => {
  return !!(settings.host && settings.port && settings.username && settings.adminEmail);
};