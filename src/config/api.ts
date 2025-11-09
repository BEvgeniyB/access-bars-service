/**
 * Centralized API configuration
 * All backend function URLs and endpoints in one place
 * 
 * Backend Architecture:
 * - api: Combined auth + analytics (2-in-1)
 * - content: Combined reviews + notifications (2-in-1)
 * - schedule: Booking and appointment management
 * 
 * Usage:
 * import API_ENDPOINTS from '@/config/api';
 * fetch(API_ENDPOINTS.auth, { method: 'POST', ... });
 * 
 * To update URLs: change only API_BASE_URLS below
 */

const API_BASE_URLS = {
  /** Auth + Analytics combined function */
  api: 'https://functions.poehali.dev/7cba2a8f-846d-42ad-8f44-ae289488325a',
  /** Reviews + Notifications combined function */
  content: 'https://functions.poehali.dev/19b63815-9352-48d4-80bd-71fc889808df',
  /** Schedule and bookings function */
  schedule: 'https://functions.poehali.dev/162a7498-295a-4897-a0d8-695fadc8f40b'
} as const;

export const API_ENDPOINTS = {
  /** POST /auth - Admin authentication with rate limiting */
  auth: `${API_BASE_URLS.api}?endpoint=auth`,
  /** GET/POST /analytics - Visit tracking and analytics data */
  analytics: `${API_BASE_URLS.api}?endpoint=analytics`,
  /** GET/POST/PUT/PATCH/DELETE /reviews - Review management with moderation */
  reviews: `${API_BASE_URLS.content}?endpoint=reviews`,
  /** POST /notifications - Email notifications for bookings */
  notifications: `${API_BASE_URLS.content}?endpoint=notifications`,
  /** GET/POST /schedule - Appointment scheduling and management */
  schedule: API_BASE_URLS.schedule
} as const;

export default API_ENDPOINTS;