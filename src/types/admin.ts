export interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  adminEmail: string;
  enabled: boolean;
}

export interface EmailStatus {
  smtp_configured: boolean;
  admin_email_set: boolean;
  password_configured: boolean;
  last_test?: string;
  error_message?: string;
}