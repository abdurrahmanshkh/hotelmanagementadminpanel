export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    ME: '/auth/me'
  },
  CUSTOMER: {
    PROFILE: '/customer/profile',
    UPDATE_PROFILE: '/customer/profile'
  },
  ROOMS: {
    LIST: '/rooms',
    TYPES: '/rooms/types',
    DETAILS: (id: number | string) => `/rooms/${id}`,
    FEATURED: '/rooms/featured',
    AVAILABILITY: '/rooms/availability'
  },
  BOOKINGS: {
    QUOTE: '/bookings/quote',
    CREATE: '/bookings',
    LIST: '/customer/bookings',
    DETAILS: (id: number | string) => `/customer/bookings/${id}`,
    CANCEL: (id: number | string) => `/customer/bookings/${id}/cancel`
  },
  PAYMENTS: {
    PROCESS: '/payments/process',
    STATUS: (bookingId: number | string) => `/payments/booking/${bookingId}`
  },
  PASSCODES: {
    GET: (bookingId: number | string) => `/passcodes/booking/${bookingId}`,
    GENERATE: (bookingId: number | string) => `/passcodes/booking/${bookingId}/generate`
  },
  SERVICE_REQUESTS: {
    LIST: '/customer/service-requests',
    CREATE: '/customer/service-requests',
    CANCEL: (id: number | string) => `/customer/service-requests/${id}/cancel`
  },
  CHAT: {
    THREADS: '/customer/chat/threads',
    THREAD_DETAILS: (id: number | string) => `/customer/chat/threads/${id}`,
    SEND_MESSAGE: (id: number | string) => `/customer/chat/threads/${id}/messages`,
    ESCALATE: (id: number | string) => `/customer/chat/threads/${id}/escalate`
  },
  NOTIFICATIONS: {
    LIST: '/customer/notifications',
    MARK_READ: (id: number | string) => `/customer/notifications/${id}/read`
  },
  FEEDBACK: {
    SUBMIT: '/customer/feedback'
  }
} as const;
