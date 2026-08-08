import { Observable } from 'rxjs';
import {
  ApiResponse,
  PageData,
  AdminUser,
  AuthResponse,
  LoginRequest,
  BookingSummary,
  BookingDetails,
  BookingFilter,
  CheckInRequest,
  CheckOutRequest,
  CancellationRequest,
  GuestSummary,
  GuestDetails,
  GuestFilter,
  ServiceRequest,
  ServiceRequestFilter,
  AssignStaffRequest,
  UpdateStatusRequest,
  ChatThread,
  ChatMessage,
  ChatFilter,
  SendReplyRequest,
  RoomSummary,
  RoomDetails,
  RoomType,
  Amenity,
  RoomFilter,
  RoomFormValue,
  RoomTypeFormValue,
  CleaningTask,
  CleaningFilter,
  CompleteCleaningRequest,
  MaintenanceRecord,
  MaintenanceFilter,
  CreateMaintenanceRequest,
  CompleteMaintenanceRequest,
  PaymentSummary,
  PaymentDetails,
  RefundRecord,
  RefundRequest,
  PaymentFilter,
  PricingRule,
  PricingPreviewRequest,
  PricingPreviewResult,
  RecalculatePricingResult,
  RevenueReport,
  BookingReport,
  OccupancyReport,
  ServiceReport,
  ReportFilter,
  HotelSettings,
  UpdateHotelSettingsRequest,
  RoomStatus
} from '../../models';

export abstract class AuthRepository {
  abstract login(request: LoginRequest): Observable<ApiResponse<AuthResponse>>;
  abstract getMe(): Observable<ApiResponse<AdminUser>>;
  abstract logout(): Observable<ApiResponse<void>>;
}

export abstract class DashboardRepository {
  abstract getSummary(): Observable<ApiResponse<{
    roomCounters: Record<string, number>;
    arrivals: BookingSummary[];
    departures: BookingSummary[];
    urgentServiceRequests: ServiceRequest[];
    waitingChats: ChatThread[];
    occupancyPercentage: number;
    todayRevenue: number;
    monthlyRevenue: number;
  }>>;
}

export abstract class BookingRepository {
  abstract getBookings(filter?: BookingFilter): Observable<ApiResponse<PageData<BookingSummary>>>;
  abstract getBookingById(id: number): Observable<ApiResponse<BookingDetails>>;
  abstract checkIn(id: number, request: CheckInRequest): Observable<ApiResponse<BookingDetails>>;
  abstract checkOut(id: number, request: CheckOutRequest): Observable<ApiResponse<BookingDetails>>;
  abstract cancel(id: number, request: CancellationRequest): Observable<ApiResponse<BookingDetails>>;
}

export abstract class GuestRepository {
  abstract getGuests(filter?: GuestFilter): Observable<ApiResponse<PageData<GuestSummary>>>;
  abstract getGuestById(id: number): Observable<ApiResponse<GuestDetails>>;
  abstract getGuestBookings(id: number): Observable<ApiResponse<BookingSummary[]>>;
}

export abstract class ServiceRequestRepository {
  abstract getRequests(filter?: ServiceRequestFilter): Observable<ApiResponse<PageData<ServiceRequest>>>;
  abstract getRequestById(id: number): Observable<ApiResponse<ServiceRequest>>;
  abstract assignStaff(id: number, request: AssignStaffRequest): Observable<ApiResponse<ServiceRequest>>;
  abstract updateStatus(id: number, request: UpdateStatusRequest): Observable<ApiResponse<ServiceRequest>>;
}

export abstract class ChatRepository {
  abstract getThreads(filter?: ChatFilter): Observable<ApiResponse<PageData<ChatThread>>>;
  abstract getThreadById(id: number): Observable<ApiResponse<ChatThread>>;
  abstract assignAdmin(id: number, adminId: number, adminName: string): Observable<ApiResponse<ChatThread>>;
  abstract sendMessage(id: number, request: SendReplyRequest): Observable<ApiResponse<ChatMessage>>;
  abstract resolveThread(id: number): Observable<ApiResponse<ChatThread>>;
  abstract markAsRead(id: number): Observable<ApiResponse<void>>;
}

export abstract class RoomRepository {
  abstract getRooms(filter?: RoomFilter): Observable<ApiResponse<PageData<RoomSummary>>>;
  abstract getRoomById(id: number): Observable<ApiResponse<RoomDetails>>;
  abstract createRoom(value: RoomFormValue): Observable<ApiResponse<RoomDetails>>;
  abstract updateRoom(id: number, value: RoomFormValue): Observable<ApiResponse<RoomDetails>>;
  abstract updateRoomStatus(id: number, status: RoomStatus, reason?: string): Observable<ApiResponse<RoomDetails>>;
  abstract getRoomTypes(): Observable<ApiResponse<RoomType[]>>;
  abstract getRoomTypeById(id: number): Observable<ApiResponse<RoomType>>;
  abstract createRoomType(value: RoomTypeFormValue): Observable<ApiResponse<RoomType>>;
  abstract updateRoomType(id: number, value: RoomTypeFormValue): Observable<ApiResponse<RoomType>>;
  abstract getAmenities(): Observable<ApiResponse<Amenity[]>>;
  abstract createAmenity(name: string, iconName?: string): Observable<ApiResponse<Amenity>>;
  abstract updateAmenity(id: number, name: string, iconName?: string): Observable<ApiResponse<Amenity>>;
}

export abstract class CleaningRepository {
  abstract getCleaningTasks(filter?: CleaningFilter): Observable<ApiResponse<PageData<CleaningTask>>>;
  abstract getCleaningTaskById(id: number): Observable<ApiResponse<CleaningTask>>;
  abstract assignStaff(id: number, staffId: number, staffName: string): Observable<ApiResponse<CleaningTask>>;
  abstract startTask(id: number): Observable<ApiResponse<CleaningTask>>;
  abstract completeTask(id: number, request: CompleteCleaningRequest): Observable<ApiResponse<CleaningTask>>;
}

export abstract class MaintenanceRepository {
  abstract getMaintenanceRecords(filter?: MaintenanceFilter): Observable<ApiResponse<PageData<MaintenanceRecord>>>;
  abstract getMaintenanceById(id: number): Observable<ApiResponse<MaintenanceRecord>>;
  abstract createRecord(request: CreateMaintenanceRequest): Observable<ApiResponse<MaintenanceRecord>>;
  abstract assignTechnician(id: number, techId: number, techName: string): Observable<ApiResponse<MaintenanceRecord>>;
  abstract startRecord(id: number): Observable<ApiResponse<MaintenanceRecord>>;
  abstract holdRecord(id: number, reason?: string): Observable<ApiResponse<MaintenanceRecord>>;
  abstract completeRecord(id: number, request: CompleteMaintenanceRequest): Observable<ApiResponse<MaintenanceRecord>>;
}

export abstract class PaymentRepository {
  abstract getPayments(filter?: PaymentFilter): Observable<ApiResponse<PageData<PaymentSummary>>>;
  abstract getPaymentById(id: number): Observable<ApiResponse<PaymentDetails>>;
  abstract processRefund(paymentId: number, request: RefundRequest): Observable<ApiResponse<RefundRecord>>;
  abstract getRefundsByPayment(paymentId: number): Observable<ApiResponse<RefundRecord[]>>;
}

export abstract class PricingRepository {
  abstract getPricingRules(): Observable<ApiResponse<PricingRule[]>>;
  abstract getPricingRuleById(id: number): Observable<ApiResponse<PricingRule>>;
  abstract createPricingRule(rule: Partial<PricingRule>): Observable<ApiResponse<PricingRule>>;
  abstract updatePricingRule(id: number, rule: Partial<PricingRule>): Observable<ApiResponse<PricingRule>>;
  abstract toggleDynamicPricing(enabled: boolean): Observable<ApiResponse<boolean>>;
  abstract recalculatePricing(): Observable<ApiResponse<RecalculatePricingResult>>;
  abstract previewPricing(request: PricingPreviewRequest): Observable<ApiResponse<PricingPreviewResult>>;
}

export abstract class ReportRepository {
  abstract getRevenueReport(filter: ReportFilter): Observable<ApiResponse<RevenueReport>>;
  abstract getBookingReport(filter: ReportFilter): Observable<ApiResponse<BookingReport>>;
  abstract getOccupancyReport(filter: ReportFilter): Observable<ApiResponse<OccupancyReport>>;
  abstract getServiceReport(filter: ReportFilter): Observable<ApiResponse<ServiceReport>>;
}

export abstract class SettingsRepository {
  abstract getSettings(): Observable<ApiResponse<HotelSettings>>;
  abstract updateSettings(request: UpdateHotelSettingsRequest): Observable<ApiResponse<HotelSettings>>;
}
