export const APP_ROUTES = {
  HOME: '/',
  ROOMS: '/rooms',
  ROOM_DETAILS: (id: number | string) => `/rooms/${id}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  BOOKING_FORM: (roomId: number | string) => `/booking/${roomId}`,
  BOOKING_REVIEW: (roomId: number | string) => `/booking/${roomId}/review`,
  BOOKING_PAYMENT: (bookingId: number | string) => `/booking/${bookingId}/payment`,
  BOOKING_CONFIRMATION: (bookingId: number | string) => `/booking/${bookingId}/confirmation`,

  ACCOUNT: '/account',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_BOOKINGS: '/account/bookings',
  ACCOUNT_BOOKING_DETAILS: (id: number | string) => `/account/bookings/${id}`,
  ACCOUNT_PASSCODE: (id: number | string) => `/account/bookings/${id}/passcode`,
  ACCOUNT_SERVICE_REQUESTS: '/account/service-requests',
  ACCOUNT_CHATS: '/account/chats',
  ACCOUNT_NOTIFICATIONS: '/account/notifications',
  ACCOUNT_FEEDBACK: (bookingId: number | string) => `/account/feedback/${bookingId}`
} as const;
