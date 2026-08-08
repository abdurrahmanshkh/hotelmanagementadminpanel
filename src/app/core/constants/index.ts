import {
  BookingStatus,
  RoomStatus,
  PaymentStatus,
  RefundStatus,
  ServiceRequestStatus,
  CleaningTaskStatus,
  MaintenanceStatus,
  ChatThreadStatus,
  Priority,
  PricingAdjustmentType
} from '../enums';

export const STORAGE_KEYS = {
  MOCK_DB: 'smartstay_admin_mock_database_v1',
  AUTH_TOKEN: 'smartstay_admin_auth_token',
  AUTH_USER: 'smartstay_admin_user',
  THEME_MODE: 'smartstay_admin_theme_mode'
};

export const APP_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
  BOOKINGS: '/admin/bookings',
  BOOKING_DETAILS: (id: number | string) => `/admin/bookings/${id}`,
  GUESTS: '/admin/guests',
  GUEST_DETAILS: (id: number | string) => `/admin/guests/${id}`,
  SERVICE_REQUESTS: '/admin/service-requests',
  SERVICE_REQUESTS_BOARD: '/admin/service-requests/board',
  SERVICE_REQUEST_DETAILS: (id: number | string) => `/admin/service-requests/${id}`,
  CHATS: '/admin/chats',
  CHAT_THREAD: (id: number | string) => `/admin/chats/${id}`,
  ROOMS: '/admin/rooms',
  ROOM_NEW: '/admin/rooms/new',
  ROOM_DETAILS: (id: number | string) => `/admin/rooms/${id}`,
  ROOM_EDIT: (id: number | string) => `/admin/rooms/${id}/edit`,
  ROOM_TYPES: '/admin/room-types',
  ROOM_TYPE_NEW: '/admin/room-types/new',
  ROOM_TYPE_EDIT: (id: number | string) => `/admin/room-types/${id}/edit`,
  AMENITIES: '/admin/amenities',
  CLEANING: '/admin/cleaning',
  CLEANING_BOARD: '/admin/cleaning/board',
  CLEANING_DETAILS: (id: number | string) => `/admin/cleaning/${id}`,
  MAINTENANCE: '/admin/maintenance',
  MAINTENANCE_NEW: '/admin/maintenance/new',
  MAINTENANCE_DETAILS: (id: number | string) => `/admin/maintenance/${id}`,
  PAYMENTS: '/admin/payments',
  PAYMENT_DETAILS: (id: number | string) => `/admin/payments/${id}`,
  PRICING: '/admin/pricing',
  PRICING_RULES: '/admin/pricing/rules',
  PRICING_RULE_NEW: '/admin/pricing/rules/new',
  PRICING_RULE_EDIT: (id: number | string) => `/admin/pricing/rules/${id}/edit`,
  PRICING_PREVIEW: '/admin/pricing/preview',
  REPORTS: '/admin/reports',
  REPORT_REVENUE: '/admin/reports/revenue',
  REPORT_BOOKINGS: '/admin/reports/bookings',
  REPORT_OCCUPANCY: '/admin/reports/occupancy',
  REPORT_SERVICES: '/admin/reports/services',
  SETTINGS: '/admin/settings',
  SETTINGS_HOTEL: '/admin/settings/hotel',
  SETTINGS_OPERATIONS: '/admin/settings/operations',
  SETTINGS_PRICING: '/admin/settings/pricing'
};

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  AUTH_LOGOUT: '/auth/logout',

  DASHBOARD_SUMMARY: '/admin/dashboard/summary',

  BOOKINGS_LIST: '/admin/bookings',
  BOOKING_DETAILS: (id: number | string) => `/admin/bookings/${id}`,
  BOOKING_CHECK_IN: (id: number | string) => `/admin/bookings/${id}/check-in`,
  BOOKING_CHECK_OUT: (id: number | string) => `/admin/bookings/${id}/check-out`,
  BOOKING_CANCEL: (id: number | string) => `/admin/bookings/${id}/cancel`,

  GUESTS_LIST: '/admin/guests',
  GUEST_DETAILS: (id: number | string) => `/admin/guests/${id}`,
  GUEST_BOOKINGS: (id: number | string) => `/admin/guests/${id}/bookings`,

  SERVICE_REQUESTS_LIST: '/admin/service-requests',
  SERVICE_REQUEST_DETAILS: (id: number | string) => `/admin/service-requests/${id}`,
  SERVICE_REQUEST_ASSIGN: (id: number | string) => `/admin/service-requests/${id}/assign`,
  SERVICE_REQUEST_STATUS: (id: number | string) => `/admin/service-requests/${id}/status`,

  CHATS_LIST: '/admin/chats',
  CHAT_DETAILS: (id: number | string) => `/admin/chats/${id}`,
  CHAT_ASSIGN: (id: number | string) => `/admin/chats/${id}/assign`,
  CHAT_MESSAGES: (id: number | string) => `/admin/chats/${id}/messages`,
  CHAT_RESOLVE: (id: number | string) => `/admin/chats/${id}/resolve`,
  CHAT_READ: (id: number | string) => `/admin/chats/${id}/read`,

  ROOMS_LIST: '/admin/rooms',
  ROOM_DETAILS: (id: number | string) => `/admin/rooms/${id}`,
  ROOM_CREATE: '/admin/rooms',
  ROOM_UPDATE: (id: number | string) => `/admin/rooms/${id}`,
  ROOM_STATUS: (id: number | string) => `/admin/rooms/${id}/status`,
  ROOM_ACTIVE: (id: number | string) => `/admin/rooms/${id}/active`,

  ROOM_TYPES_LIST: '/room-types',
  ROOM_TYPE_DETAILS: (id: number | string) => `/room-types/${id}`,
  ROOM_TYPE_CREATE: '/admin/room-types',
  ROOM_TYPE_UPDATE: (id: number | string) => `/admin/room-types/${id}`,

  AMENITIES_LIST: '/admin/amenities',
  AMENITY_CREATE: '/admin/amenities',
  AMENITY_UPDATE: (id: number | string) => `/admin/amenities/${id}`,
  AMENITY_ACTIVE: (id: number | string) => `/admin/amenities/${id}/active`,

  CLEANING_TASKS_LIST: '/admin/cleaning-tasks',
  CLEANING_TASK_DETAILS: (id: number | string) => `/admin/cleaning-tasks/${id}`,
  CLEANING_TASK_CREATE: '/admin/cleaning-tasks',
  CLEANING_TASK_ASSIGN: (id: number | string) => `/admin/cleaning-tasks/${id}/assign`,
  CLEANING_TASK_START: (id: number | string) => `/admin/cleaning-tasks/${id}/start`,
  CLEANING_TASK_COMPLETE: (id: number | string) => `/admin/cleaning-tasks/${id}/complete`,

  MAINTENANCE_LIST: '/admin/maintenance',
  MAINTENANCE_DETAILS: (id: number | string) => `/admin/maintenance/${id}`,
  MAINTENANCE_CREATE: '/admin/maintenance',
  MAINTENANCE_UPDATE: (id: number | string) => `/admin/maintenance/${id}`,
  MAINTENANCE_ASSIGN: (id: number | string) => `/admin/maintenance/${id}/assign`,
  MAINTENANCE_START: (id: number | string) => `/admin/maintenance/${id}/start`,
  MAINTENANCE_HOLD: (id: number | string) => `/admin/maintenance/${id}/hold`,
  MAINTENANCE_COMPLETE: (id: number | string) => `/admin/maintenance/${id}/complete`,

  PAYMENTS_LIST: '/admin/payments',
  PAYMENT_DETAILS: (id: number | string) => `/admin/payments/${id}`,
  PAYMENT_REFUND: (id: number | string) => `/admin/payments/${id}/refund`,
  PAYMENT_REFUNDS_LIST: (id: number | string) => `/admin/payments/${id}/refunds`,

  PRICING_RULES_LIST: '/admin/pricing/rules',
  PRICING_RULE_DETAILS: (id: number | string) => `/admin/pricing/rules/${id}`,
  PRICING_RULE_CREATE: '/admin/pricing/rules',
  PRICING_RULE_UPDATE: (id: number | string) => `/admin/pricing/rules/${id}`,
  PRICING_ENABLED: '/admin/pricing/enabled',
  PRICING_RECALCULATE: '/admin/pricing/recalculate',
  PRICING_PREVIEW: '/admin/pricing/preview',

  REPORTS_REVENUE: '/admin/reports/revenue',
  REPORTS_BOOKINGS: '/admin/reports/bookings',
  REPORTS_OCCUPANCY: '/admin/reports/occupancy',
  REPORTS_SERVICES: '/admin/reports/services',
  REPORTS_REVENUE_EXPORT: '/admin/reports/revenue/export',
  REPORTS_BOOKINGS_EXPORT: '/admin/reports/bookings/export',

  SETTINGS_GET: '/admin/settings',
  SETTINGS_UPDATE: '/admin/settings'
};

export const STATUS_LABELS: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  [BookingStatus.PENDING_PAYMENT]: { label: 'Pending Payment', variant: 'warning' },
  [BookingStatus.CONFIRMED]: { label: 'Confirmed', variant: 'info' },
  [BookingStatus.CHECKED_IN]: { label: 'Checked In', variant: 'success' },
  [BookingStatus.COMPLETED]: { label: 'Completed', variant: 'neutral' },
  [BookingStatus.CANCELLED]: { label: 'Cancelled', variant: 'danger' },

  [RoomStatus.AVAILABLE]: { label: 'Available', variant: 'success' },
  [RoomStatus.RESERVED]: { label: 'Reserved', variant: 'info' },
  [RoomStatus.OCCUPIED]: { label: 'Occupied', variant: 'neutral' },
  [RoomStatus.UNDER_CLEANING]: { label: 'Under Cleaning', variant: 'warning' },
  [RoomStatus.MAINTENANCE]: { label: 'Maintenance', variant: 'danger' },

  [PaymentStatus.INITIATED]: { label: 'Initiated', variant: 'neutral' },
  [PaymentStatus.PENDING]: { label: 'Pending', variant: 'warning' },
  [PaymentStatus.SUCCESS]: { label: 'Success', variant: 'success' },
  [PaymentStatus.FAILED]: { label: 'Failed', variant: 'danger' },
  [PaymentStatus.REFUNDED]: { label: 'Refunded', variant: 'danger' },
  [PaymentStatus.PARTIALLY_REFUNDED]: { label: 'Partially Refunded', variant: 'warning' },

  [RefundStatus.PENDING]: { label: 'Pending', variant: 'warning' },
  [RefundStatus.SUCCESS]: { label: 'Success', variant: 'success' },
  [RefundStatus.FAILED]: { label: 'Failed', variant: 'danger' },

  [ServiceRequestStatus.PENDING]: { label: 'Pending', variant: 'warning' },
  [ServiceRequestStatus.ACCEPTED]: { label: 'Accepted', variant: 'info' },
  [ServiceRequestStatus.IN_PROGRESS]: { label: 'In Progress', variant: 'info' },
  [ServiceRequestStatus.COMPLETED]: { label: 'Completed', variant: 'success' },
  [ServiceRequestStatus.CANCELLED]: { label: 'Cancelled', variant: 'neutral' },

  [CleaningTaskStatus.PENDING]: { label: 'Pending', variant: 'warning' },
  [CleaningTaskStatus.ASSIGNED]: { label: 'Assigned', variant: 'info' },
  [CleaningTaskStatus.IN_PROGRESS]: { label: 'In Progress', variant: 'info' },
  [CleaningTaskStatus.COMPLETED]: { label: 'Completed', variant: 'success' },
  [CleaningTaskStatus.CANCELLED]: { label: 'Cancelled', variant: 'neutral' },

  [MaintenanceStatus.OPEN]: { label: 'Open', variant: 'danger' },
  [MaintenanceStatus.ASSIGNED]: { label: 'Assigned', variant: 'warning' },
  [MaintenanceStatus.IN_PROGRESS]: { label: 'In Progress', variant: 'info' },
  [MaintenanceStatus.ON_HOLD]: { label: 'On Hold', variant: 'neutral' },
  [MaintenanceStatus.COMPLETED]: { label: 'Completed', variant: 'success' },
  [MaintenanceStatus.CANCELLED]: { label: 'Cancelled', variant: 'neutral' },

  [ChatThreadStatus.OPEN]: { label: 'Open', variant: 'info' },
  [ChatThreadStatus.WAITING_FOR_ADMIN]: { label: 'Waiting for Admin', variant: 'warning' },
  [ChatThreadStatus.ASSIGNED]: { label: 'Assigned', variant: 'info' },
  [ChatThreadStatus.RESOLVED]: { label: 'Resolved', variant: 'success' },
  [ChatThreadStatus.CLOSED]: { label: 'Closed', variant: 'neutral' },

  [Priority.LOW]: { label: 'Low', variant: 'neutral' },
  [Priority.MEDIUM]: { label: 'Medium', variant: 'info' },
  [Priority.HIGH]: { label: 'High', variant: 'warning' },
  [Priority.URGENT]: { label: 'Urgent', variant: 'danger' },

  [PricingAdjustmentType.PERCENTAGE_DISCOUNT]: { label: 'Percentage Discount', variant: 'success' },
  [PricingAdjustmentType.PERCENTAGE_MARKUP]: { label: 'Percentage Markup', variant: 'warning' },
  [PricingAdjustmentType.FIXED_DISCOUNT]: { label: 'Fixed Discount', variant: 'success' },
  [PricingAdjustmentType.FIXED_MARKUP]: { label: 'Fixed Markup', variant: 'warning' },
  [PricingAdjustmentType.NO_ADJUSTMENT]: { label: 'Standard Rate', variant: 'neutral' }
};
