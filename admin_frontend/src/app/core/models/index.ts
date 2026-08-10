import {
  Role,
  BookingStatus,
  RoomStatus,
  PaymentStatus,
  PaymentMethod,
  RefundStatus,
  ServiceRequestStatus,
  CleaningTaskStatus,
  MaintenanceStatus,
  ChatThreadStatus,
  ChatMode,
  Priority,
  PricingAdjustmentType
} from '../enums';

export * from '../enums';

// Generic API Envelope Schemas
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageData<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  path?: string;
  timestamp: string;
  traceId?: string;
}

// Auth Models
export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  staffCode: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
  expiresInSeconds: number;
}

export interface LoginRequest {
  email: string;
  password?: string;
  staffCode: string;
}

// Booking Models
export interface BookingSummary {
  id: number;
  bookingReference: string;
  guestId: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface BookingDetails extends BookingSummary {
  specialRequests?: string;
  actualCheckInAt?: string;
  actualCheckOutAt?: string;
  passcode?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  refundedAmount?: number;
  cancellationReason?: string;
  cancellationNotes?: string;
  cancelledAt?: string;
  timeline: BookingActivity[];
}

export interface BookingActivity {
  id: number;
  bookingId: number;
  action: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface BookingFilter {
  reference?: string;
  guestQuery?: string;
  roomNumber?: string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  checkInFrom?: string;
  checkInTo?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CheckInRequest {
  expectedArrivalTime?: string;
  identityVerified: boolean;
  roomReadyConfirmed: boolean;
  notes?: string;
}

export interface CheckOutRequest {
  hasOutstandingPayment: boolean;
  cleaningNotes?: string;
  maintenanceRequired: boolean;
  maintenanceNotes?: string;
}

export interface CancellationRequest {
  reason: string;
  notifyGuest: boolean;
  confirmDestructive: boolean;
}

// Guest Models
export interface GuestSummary {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  totalBookings: number;
  currentStayRoom?: string;
  lastStayDate?: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface GuestDetails extends GuestSummary {
  maskedIdType?: string;
  maskedIdNumber?: string;
  emergencyContact?: string;
  notes?: string;
  stayHistory: BookingSummary[];
}

export interface GuestFilter {
  query?: string;
  stayFilter?: 'ALL' | 'CURRENT' | 'UPCOMING' | 'PAST';
  accountStatus?: 'ALL' | 'ACTIVE' | 'SUSPENDED';
  page?: number;
  size?: number;
}

// Service Request Models
export interface ServiceRequest {
  id: number;
  referenceNumber: string;
  bookingId?: number;
  guestId: number;
  guestName: string;
  roomNumber: string;
  category: string;
  title: string;
  description: string;
  priority: Priority;
  status: ServiceRequestStatus;
  assignedStaffId?: number;
  assignedStaffName?: string;
  requestedAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  completionNotes?: string;
}

export interface ServiceRequestFilter {
  query?: string;
  category?: string;
  priority?: Priority;
  status?: ServiceRequestStatus;
  roomNumber?: string;
  unassignedOnly?: boolean;
  page?: number;
  size?: number;
}

export interface AssignStaffRequest {
  staffId: number;
  staffName: string;
}

export interface UpdateStatusRequest {
  status: ServiceRequestStatus;
  notes?: string;
}

// Chat Models
export interface ChatMessage {
  id: number;
  threadId: number;
  senderType: 'CUSTOMER' | 'BOT' | 'ADMIN';
  senderId?: number;
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface ChatThread {
  id: number;
  bookingId?: number;
  guestId: number;
  guestName: string;
  guestEmail: string;
  roomNumber?: string;
  status: ChatThreadStatus;
  mode: ChatMode;
  assignedAdminId?: number;
  assignedAdminName?: string;
  unreadCount: number;
  lastMessageText: string;
  lastMessageAt: string;
  createdAt: string;
  resolvedAt?: string;
  messages?: ChatMessage[];
}

export interface ChatFilter {
  query?: string;
  status?: ChatThreadStatus;
  assignedToMe?: boolean;
  unreadOnly?: boolean;
  page?: number;
  size?: number;
}

export interface SendReplyRequest {
  content: string;
}

// Room & Room Type Models
export interface Amenity {
  id: number;
  name: string;
  iconName?: string;
  isActive: boolean;
  usageCount: number;
}

export interface RoomImage {
  id: number;
  url: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
  isActive: boolean;
}

export interface RoomType {
  id: number;
  name: string;
  code: string;
  description: string;
  basePrice: number;
  minimumPrice: number;
  maximumPrice: number;
  adultCapacity: number;
  childCapacity: number;
  bedType: string;
  roomSizeSqFt: number;
  amenities: Amenity[];
  images: RoomImage[];
  isActive: boolean;
  totalRoomsCount: number;
}

export interface RoomSummary {
  id: number;
  roomNumber: string;
  roomTypeId: number;
  roomTypeName: string;
  floor: number;
  capacity: number;
  basePrice: number;
  currentPrice: number;
  status: RoomStatus;
  isActive: boolean;
  rating: number;
}

export interface RoomDetails extends RoomSummary {
  description?: string;
  amenities: Amenity[];
  images: RoomImage[];
  currentBookingId?: number;
  pendingCleaningTaskId?: number;
  openMaintenanceRecordId?: number;
  updatedAt: string;
}

export interface RoomFilter {
  query?: string;
  roomTypeId?: number;
  floor?: number;
  status?: RoomStatus;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export interface RoomFormValue {
  roomNumber: string;
  roomTypeId: number;
  floor: number;
  description?: string;
  isActive: boolean;
  status: RoomStatus;
  imageUrls?: string[];
}

export interface RoomTypeFormValue {
  name: string;
  code: string;
  description: string;
  basePrice: number;
  minimumPrice: number;
  maximumPrice: number;
  adultCapacity: number;
  childCapacity: number;
  bedType: string;
  roomSizeSqFt: number;
  amenityIds: number[];
  isActive: boolean;
}

// Housekeeping Models
export interface CleaningTask {
  id: number;
  taskNumber: string;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  status: CleaningTaskStatus;
  assignedStaffId?: number;
  assignedStaffName?: string;
  createdFromBookingId?: number;
  createdAt: string;
  assignedAt?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  maintenanceIssueFound?: boolean;
}

export interface CleaningFilter {
  roomNumber?: string;
  status?: CleaningTaskStatus;
  assignedStaffId?: number;
  page?: number;
  size?: number;
}

export interface CompleteCleaningRequest {
  notes?: string;
  roomInspected: boolean;
  roomReady: boolean;
  maintenanceIssueFound: boolean;
  maintenanceDescription?: string;
  priority?: Priority;
}

// Maintenance Models
export interface MaintenanceRecord {
  id: number;
  recordNumber: string;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  title: string;
  description: string;
  priority: Priority;
  status: MaintenanceStatus;
  reportedBy: string;
  assignedTechnicianId?: number;
  assignedTechnicianName?: string;
  createdAt: string;
  assignedAt?: string;
  startedAt?: string;
  onHoldAt?: string;
  completedAt?: string;
  resolutionNotes?: string;
  cleaningRequiredOnCompletion?: boolean;
}

export interface MaintenanceFilter {
  query?: string;
  roomNumber?: string;
  priority?: Priority;
  status?: MaintenanceStatus;
  page?: number;
  size?: number;
}

export interface CreateMaintenanceRequest {
  roomId: number;
  title: string;
  description: string;
  priority: Priority;
  assignedTechnicianId?: number;
}

export interface CompleteMaintenanceRequest {
  resolutionNotes: string;
  cleaningRequired: boolean;
  roomReady: boolean;
}

// Payment & Refund Models
export interface PaymentSummary {
  id: number;
  paymentReference: string;
  bookingId: number;
  bookingReference: string;
  guestName: string;
  amount: number;
  refundedAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  paidAt: string;
}

export interface PaymentDetails extends PaymentSummary {
  gatewayName: string;
  failureReason?: string;
  refunds: RefundRecord[];
}

export interface RefundRecord {
  id: number;
  refundReference: string;
  paymentId: number;
  amount: number;
  reason: string;
  status: RefundStatus;
  processedBy: string;
  createdAt: string;
}

export interface RefundRequest {
  amount: number;
  reason: string;
}

export interface PaymentFilter {
  query?: string;
  method?: PaymentMethod;
  status?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

// Dynamic Pricing Models
export interface PricingRule {
  id: number;
  name: string;
  roomTypeId: number;
  roomTypeName: string;
  minOccupancyPercentage: number;
  maxOccupancyPercentage: number;
  adjustmentType: PricingAdjustmentType;
  adjustmentValue: number;
  allowedMinPrice: number;
  allowedMaxPrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface PricingPreviewRequest {
  roomTypeId: number;
  targetDate: string;
}

export interface PricingPreviewResult {
  roomTypeId: number;
  roomTypeName: string;
  targetDate: string;
  basePrice: number;
  totalRooms: number;
  occupiedRooms: number;
  occupancyPercentage: number;
  appliedRuleName?: string;
  adjustmentType: PricingAdjustmentType;
  adjustmentValue: number;
  calculatedPrice: number;
  clampedFinalPrice: number;
  currency: string;
}

export interface RecalculatePricingResult {
  totalRoomsEvaluated: number;
  pricesUpdated: number;
  recalculatedAt: string;
}

// Analytics & Report Models
export interface RevenueReport {
  period: string;
  grossRevenue: number;
  totalRefunds: number;
  netRevenue: number;
  roomRevenue?: number;
  serviceRevenue?: number;
  averageBookingValue: number;
  revenueByPaymentMethod: Record<string, number>;
  revenueByRoomType: Record<string, number>;
  dailyBreakdown: Array<{ date: string; gross: number; net: number; refunds: number }>;
}

export interface BookingReport {
  period: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  cancellationRatePercentage: number;
  averageStayDays: number;
  bookingsByStatus: Record<string, number>;
  bookingsByRoomType: Record<string, number>;
  dailyBreakdown: Array<{ date: string; total: number; cancelled: number }>;
}

export interface OccupancyReport {
  period: string;
  averageOccupancyPercentage: number;
  peakOccupancyPercentage: number;
  lowestOccupancyPercentage: number;
  maintenanceImpactDays: number;
  averageDailyRate?: number;
  revPar?: number;
  occupancyByRoomType: Record<string, number>;
  dailyBreakdown: Array<{ date: string; occupancyPercentage: number; occupiedCount: number }>;
}

export interface ServiceReport {
  period: string;
  totalRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  averageResponseTimeMinutes: number;
  averageCompletionTimeMinutes: number;
  requestsByCategory: Record<string, number>;
  requestsByPriority: Record<string, number>;
}

export interface ReportFilter {
  fromDate: string;
  toDate: string;
  roomTypeId?: number;
}

// Hotel Settings Models
export interface HotelSettings {
  id: number;
  hotelName: string;
  address: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  maxStayDays: number;
  pendingPaymentTimeoutMinutes: number;
  cancellationCutoffHours: number;
  currency: string;
  taxPercentage: number;
  serviceFeePercentage: number;
  isDynamicPricingEnabled: boolean;
  dynamicPricingPolicyNotes?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface UpdateHotelSettingsRequest {
  hotelName: string;
  address: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  maxStayDays: number;
  pendingPaymentTimeoutMinutes: number;
  cancellationCutoffHours: number;
  currency: string;
  taxPercentage: number;
  serviceFeePercentage: number;
  isDynamicPricingEnabled: boolean;
  dynamicPricingPolicyNotes?: string;
}
