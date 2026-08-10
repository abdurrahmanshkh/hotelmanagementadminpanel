import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../constants';
import {
  AuthRepository,
  DashboardRepository,
  BookingRepository,
  GuestRepository,
  ServiceRequestRepository,
  ChatRepository,
  RoomRepository,
  CleaningRepository,
  MaintenanceRepository,
  PaymentRepository,
  PricingRepository,
  ReportRepository,
  SettingsRepository
} from '../contracts';
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

function getUrl(path: string): string {
  return `${environment.apiBaseUrl}${path}`;
}

@Injectable()
export class ApiAuthRepository extends AuthRepository {
  private http = inject(HttpClient);

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(getUrl(API_ENDPOINTS.AUTH_LOGIN), request);
  }

  getMe(): Observable<ApiResponse<AdminUser>> {
    return this.http.get<ApiResponse<AdminUser>>(getUrl(API_ENDPOINTS.AUTH_ME));
  }

  logout(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(getUrl(API_ENDPOINTS.AUTH_LOGOUT), {});
  }
}

@Injectable()
export class ApiDashboardRepository extends DashboardRepository {
  private http = inject(HttpClient);

  getSummary(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(getUrl(API_ENDPOINTS.DASHBOARD_SUMMARY));
  }
}

@Injectable()
export class ApiBookingRepository extends BookingRepository {
  private http = inject(HttpClient);

  getBookings(filter?: BookingFilter): Observable<ApiResponse<PageData<BookingSummary>>> {
    let params = new HttpParams();
    if (filter?.reference) params = params.set('reference', filter.reference);
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.page) params = params.set('page', filter.page.toString());
    if (filter?.size) params = params.set('size', filter.size.toString());
    return this.http.get<ApiResponse<PageData<BookingSummary>>>(getUrl(API_ENDPOINTS.BOOKINGS_LIST), { params });
  }

  getBookingById(id: number): Observable<ApiResponse<BookingDetails>> {
    return this.http.get<ApiResponse<BookingDetails>>(getUrl(API_ENDPOINTS.BOOKING_DETAILS(id)));
  }

  checkIn(id: number, request: CheckInRequest): Observable<ApiResponse<BookingDetails>> {
    return this.http.patch<ApiResponse<BookingDetails>>(getUrl(API_ENDPOINTS.BOOKING_CHECK_IN(id)), request);
  }

  checkOut(id: number, request: CheckOutRequest): Observable<ApiResponse<BookingDetails>> {
    return this.http.patch<ApiResponse<BookingDetails>>(getUrl(API_ENDPOINTS.BOOKING_CHECK_OUT(id)), request);
  }

  cancel(id: number, request: CancellationRequest): Observable<ApiResponse<BookingDetails>> {
    return this.http.post<ApiResponse<BookingDetails>>(getUrl(API_ENDPOINTS.BOOKING_CANCEL(id)), request);
  }
}

@Injectable()
export class ApiGuestRepository extends GuestRepository {
  private http = inject(HttpClient);

  getGuests(filter?: GuestFilter): Observable<ApiResponse<PageData<GuestSummary>>> {
    let params = new HttpParams();
    if (filter?.query) params = params.set('query', filter.query);
    if (filter?.page) params = params.set('page', filter.page.toString());
    if (filter?.size) params = params.set('size', filter.size.toString());
    return this.http.get<ApiResponse<PageData<GuestSummary>>>(getUrl(API_ENDPOINTS.GUESTS_LIST), { params });
  }

  getGuestById(id: number): Observable<ApiResponse<GuestDetails>> {
    return this.http.get<ApiResponse<GuestDetails>>(getUrl(API_ENDPOINTS.GUEST_DETAILS(id)));
  }

  getGuestBookings(id: number): Observable<ApiResponse<BookingSummary[]>> {
    return this.http.get<ApiResponse<BookingSummary[]>>(getUrl(API_ENDPOINTS.GUEST_BOOKINGS(id)));
  }
}

@Injectable()
export class ApiServiceRequestRepository extends ServiceRequestRepository {
  private http = inject(HttpClient);

  getRequests(filter?: ServiceRequestFilter): Observable<ApiResponse<PageData<ServiceRequest>>> {
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.page) params = params.set('page', filter.page.toString());
    if (filter?.size) params = params.set('size', filter.size.toString());
    return this.http.get<ApiResponse<PageData<ServiceRequest>>>(getUrl(API_ENDPOINTS.SERVICE_REQUESTS_LIST), { params });
  }

  getRequestById(id: number): Observable<ApiResponse<ServiceRequest>> {
    return this.http.get<ApiResponse<ServiceRequest>>(getUrl(API_ENDPOINTS.SERVICE_REQUEST_DETAILS(id)));
  }

  assignStaff(id: number, request: AssignStaffRequest): Observable<ApiResponse<ServiceRequest>> {
    return this.http.patch<ApiResponse<ServiceRequest>>(getUrl(API_ENDPOINTS.SERVICE_REQUEST_ASSIGN(id)), request);
  }

  updateStatus(id: number, request: UpdateStatusRequest): Observable<ApiResponse<ServiceRequest>> {
    return this.http.patch<ApiResponse<ServiceRequest>>(getUrl(API_ENDPOINTS.SERVICE_REQUEST_STATUS(id)), request);
  }
}

@Injectable()
export class ApiChatRepository extends ChatRepository {
  private http = inject(HttpClient);

  getThreads(filter?: ChatFilter): Observable<ApiResponse<PageData<ChatThread>>> {
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.page) params = params.set('page', filter.page.toString());
    if (filter?.size) params = params.set('size', filter.size.toString());
    return this.http.get<ApiResponse<PageData<ChatThread>>>(getUrl(API_ENDPOINTS.CHATS_LIST), { params });
  }

  getThreadById(id: number): Observable<ApiResponse<ChatThread>> {
    return this.http.get<ApiResponse<ChatThread>>(getUrl(API_ENDPOINTS.CHAT_DETAILS(id)));
  }

  assignAdmin(id: number, adminId: number, adminName: string): Observable<ApiResponse<ChatThread>> {
    return this.http.patch<ApiResponse<ChatThread>>(getUrl(API_ENDPOINTS.CHAT_ASSIGN(id)), { adminId, adminName });
  }

  sendMessage(id: number, request: SendReplyRequest): Observable<ApiResponse<ChatMessage>> {
    return this.http.post<ApiResponse<ChatMessage>>(getUrl(API_ENDPOINTS.CHAT_MESSAGES(id)), request);
  }

  resolveThread(id: number): Observable<ApiResponse<ChatThread>> {
    return this.http.patch<ApiResponse<ChatThread>>(getUrl(API_ENDPOINTS.CHAT_RESOLVE(id)), {});
  }

  markAsRead(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(getUrl(API_ENDPOINTS.CHAT_READ(id)), {});
  }
}

@Injectable()
export class ApiRoomRepository extends RoomRepository {
  private http = inject(HttpClient);

  getRooms(filter?: RoomFilter): Observable<ApiResponse<PageData<RoomSummary>>> {
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.page) params = params.set('page', filter.page.toString());
    if (filter?.size) params = params.set('size', filter.size.toString());
    return this.http.get<ApiResponse<PageData<RoomSummary>>>(getUrl(API_ENDPOINTS.ROOMS_LIST), { params });
  }

  getRoomById(id: number): Observable<ApiResponse<RoomDetails>> {
    return this.http.get<ApiResponse<RoomDetails>>(getUrl(API_ENDPOINTS.ROOM_DETAILS(id)));
  }

  createRoom(value: RoomFormValue): Observable<ApiResponse<RoomDetails>> {
    return this.http.post<ApiResponse<RoomDetails>>(getUrl(API_ENDPOINTS.ROOM_CREATE), value);
  }

  updateRoom(id: number, value: RoomFormValue): Observable<ApiResponse<RoomDetails>> {
    return this.http.put<ApiResponse<RoomDetails>>(getUrl(API_ENDPOINTS.ROOM_UPDATE(id)), value);
  }

  updateRoomStatus(id: number, status: RoomStatus): Observable<ApiResponse<RoomDetails>> {
    return this.http.patch<ApiResponse<RoomDetails>>(getUrl(API_ENDPOINTS.ROOM_STATUS(id)), { status });
  }

  getRoomTypes(): Observable<ApiResponse<RoomType[]>> {
    return this.http.get<ApiResponse<RoomType[]>>(getUrl(API_ENDPOINTS.ROOM_TYPES_LIST));
  }

  getRoomTypeById(id: number): Observable<ApiResponse<RoomType>> {
    return this.http.get<ApiResponse<RoomType>>(getUrl(API_ENDPOINTS.ROOM_TYPE_DETAILS(id)));
  }

  createRoomType(value: RoomTypeFormValue): Observable<ApiResponse<RoomType>> {
    return this.http.post<ApiResponse<RoomType>>(getUrl(API_ENDPOINTS.ROOM_TYPE_CREATE), value);
  }

  updateRoomType(id: number, value: RoomTypeFormValue): Observable<ApiResponse<RoomType>> {
    return this.http.put<ApiResponse<RoomType>>(getUrl(API_ENDPOINTS.ROOM_TYPE_UPDATE(id)), value);
  }

  getAmenities(): Observable<ApiResponse<Amenity[]>> {
    return this.http.get<ApiResponse<Amenity[]>>(getUrl(API_ENDPOINTS.AMENITIES_LIST));
  }

  createAmenity(name: string, iconName?: string): Observable<ApiResponse<Amenity>> {
    return this.http.post<ApiResponse<Amenity>>(getUrl(API_ENDPOINTS.AMENITY_CREATE), { name, iconName });
  }

  updateAmenity(id: number, name: string, iconName?: string): Observable<ApiResponse<Amenity>> {
    return this.http.put<ApiResponse<Amenity>>(getUrl(API_ENDPOINTS.AMENITY_UPDATE(id)), { name, iconName });
  }
}

@Injectable()
export class ApiCleaningRepository extends CleaningRepository {
  private http = inject(HttpClient);

  getCleaningTasks(filter?: CleaningFilter): Observable<ApiResponse<PageData<CleaningTask>>> {
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.page) params = params.set('page', filter.page.toString());
    if (filter?.size) params = params.set('size', filter.size.toString());
    return this.http.get<ApiResponse<PageData<CleaningTask>>>(getUrl(API_ENDPOINTS.CLEANING_TASKS_LIST), { params });
  }

  getCleaningTaskById(id: number): Observable<ApiResponse<CleaningTask>> {
    return this.http.get<ApiResponse<CleaningTask>>(getUrl(API_ENDPOINTS.CLEANING_TASK_DETAILS(id)));
  }

  assignStaff(id: number, staffId: number, staffName: string): Observable<ApiResponse<CleaningTask>> {
    return this.http.patch<ApiResponse<CleaningTask>>(getUrl(API_ENDPOINTS.CLEANING_TASK_ASSIGN(id)), { staffId, staffName });
  }

  startTask(id: number): Observable<ApiResponse<CleaningTask>> {
    return this.http.patch<ApiResponse<CleaningTask>>(getUrl(API_ENDPOINTS.CLEANING_TASK_START(id)), {});
  }

  completeTask(id: number, request: CompleteCleaningRequest): Observable<ApiResponse<CleaningTask>> {
    return this.http.patch<ApiResponse<CleaningTask>>(getUrl(API_ENDPOINTS.CLEANING_TASK_COMPLETE(id)), request);
  }
}

@Injectable()
export class ApiMaintenanceRepository extends MaintenanceRepository {
  private http = inject(HttpClient);

  getMaintenanceRecords(filter?: MaintenanceFilter): Observable<ApiResponse<PageData<MaintenanceRecord>>> {
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.page) params = params.set('page', filter.page.toString());
    if (filter?.size) params = params.set('size', filter.size.toString());
    return this.http.get<ApiResponse<PageData<MaintenanceRecord>>>(getUrl(API_ENDPOINTS.MAINTENANCE_LIST), { params });
  }

  getMaintenanceById(id: number): Observable<ApiResponse<MaintenanceRecord>> {
    return this.http.get<ApiResponse<MaintenanceRecord>>(getUrl(API_ENDPOINTS.MAINTENANCE_DETAILS(id)));
  }

  createRecord(request: CreateMaintenanceRequest): Observable<ApiResponse<MaintenanceRecord>> {
    return this.http.post<ApiResponse<MaintenanceRecord>>(getUrl(API_ENDPOINTS.MAINTENANCE_CREATE), request);
  }

  assignTechnician(id: number, techId: number, techName: string): Observable<ApiResponse<MaintenanceRecord>> {
    return this.http.patch<ApiResponse<MaintenanceRecord>>(getUrl(API_ENDPOINTS.MAINTENANCE_ASSIGN(id)), { techId, techName });
  }

  startRecord(id: number): Observable<ApiResponse<MaintenanceRecord>> {
    return this.http.patch<ApiResponse<MaintenanceRecord>>(getUrl(API_ENDPOINTS.MAINTENANCE_START(id)), {});
  }

  holdRecord(id: number, reason?: string): Observable<ApiResponse<MaintenanceRecord>> {
    return this.http.patch<ApiResponse<MaintenanceRecord>>(getUrl(API_ENDPOINTS.MAINTENANCE_HOLD(id)), { reason });
  }

  completeRecord(id: number, request: CompleteMaintenanceRequest): Observable<ApiResponse<MaintenanceRecord>> {
    return this.http.patch<ApiResponse<MaintenanceRecord>>(getUrl(API_ENDPOINTS.MAINTENANCE_COMPLETE(id)), request);
  }
}

@Injectable()
export class ApiPaymentRepository extends PaymentRepository {
  private http = inject(HttpClient);

  getPayments(filter?: PaymentFilter): Observable<ApiResponse<PageData<PaymentSummary>>> {
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.page) params = params.set('page', filter.page.toString());
    if (filter?.size) params = params.set('size', filter.size.toString());
    return this.http.get<ApiResponse<PageData<PaymentSummary>>>(getUrl(API_ENDPOINTS.PAYMENTS_LIST), { params });
  }

  getPaymentById(id: number): Observable<ApiResponse<PaymentDetails>> {
    return this.http.get<ApiResponse<PaymentDetails>>(getUrl(API_ENDPOINTS.PAYMENT_DETAILS(id)));
  }

  processRefund(paymentId: number, request: RefundRequest): Observable<ApiResponse<RefundRecord>> {
    return this.http.post<ApiResponse<RefundRecord>>(getUrl(API_ENDPOINTS.PAYMENT_REFUND(paymentId)), request);
  }

  getRefundsByPayment(paymentId: number): Observable<ApiResponse<RefundRecord[]>> {
    return this.http.get<ApiResponse<RefundRecord[]>>(getUrl(API_ENDPOINTS.PAYMENT_REFUNDS_LIST(paymentId)));
  }
}

@Injectable()
export class ApiPricingRepository extends PricingRepository {
  private http = inject(HttpClient);

  getPricingRules(): Observable<ApiResponse<PricingRule[]>> {
    return this.http.get<ApiResponse<PricingRule[]>>(getUrl(API_ENDPOINTS.PRICING_RULES_LIST));
  }

  getPricingRuleById(id: number): Observable<ApiResponse<PricingRule>> {
    return this.http.get<ApiResponse<PricingRule>>(getUrl(API_ENDPOINTS.PRICING_RULE_DETAILS(id)));
  }

  createPricingRule(rule: Partial<PricingRule>): Observable<ApiResponse<PricingRule>> {
    return this.http.post<ApiResponse<PricingRule>>(getUrl(API_ENDPOINTS.PRICING_RULE_CREATE), rule);
  }

  updatePricingRule(id: number, rule: Partial<PricingRule>): Observable<ApiResponse<PricingRule>> {
    return this.http.put<ApiResponse<PricingRule>>(getUrl(API_ENDPOINTS.PRICING_RULE_UPDATE(id)), rule);
  }

  toggleDynamicPricing(enabled: boolean): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(getUrl(API_ENDPOINTS.PRICING_ENABLED), { enabled });
  }

  recalculatePricing(): Observable<ApiResponse<RecalculatePricingResult>> {
    return this.http.post<ApiResponse<RecalculatePricingResult>>(getUrl(API_ENDPOINTS.PRICING_RECALCULATE), {});
  }

  previewPricing(request: PricingPreviewRequest): Observable<ApiResponse<PricingPreviewResult>> {
    return this.http.post<ApiResponse<PricingPreviewResult>>(getUrl(API_ENDPOINTS.PRICING_PREVIEW), request);
  }
}

@Injectable()
export class ApiReportRepository extends ReportRepository {
  private http = inject(HttpClient);

  getRevenueReport(filter: ReportFilter): Observable<ApiResponse<RevenueReport>> {
    let params = new HttpParams().set('fromDate', filter.fromDate).set('toDate', filter.toDate);
    return this.http.get<ApiResponse<RevenueReport>>(getUrl(API_ENDPOINTS.REPORTS_REVENUE), { params });
  }

  getBookingReport(filter: ReportFilter): Observable<ApiResponse<BookingReport>> {
    let params = new HttpParams().set('fromDate', filter.fromDate).set('toDate', filter.toDate);
    return this.http.get<ApiResponse<BookingReport>>(getUrl(API_ENDPOINTS.REPORTS_BOOKINGS), { params });
  }

  getOccupancyReport(filter: ReportFilter): Observable<ApiResponse<OccupancyReport>> {
    let params = new HttpParams().set('fromDate', filter.fromDate).set('toDate', filter.toDate);
    return this.http.get<ApiResponse<OccupancyReport>>(getUrl(API_ENDPOINTS.REPORTS_OCCUPANCY), { params });
  }

  getServiceReport(filter: ReportFilter): Observable<ApiResponse<ServiceReport>> {
    let params = new HttpParams().set('fromDate', filter.fromDate).set('toDate', filter.toDate);
    return this.http.get<ApiResponse<ServiceReport>>(getUrl(API_ENDPOINTS.REPORTS_SERVICES), { params });
  }
}

@Injectable()
export class ApiSettingsRepository extends SettingsRepository {
  private http = inject(HttpClient);

  getSettings(): Observable<ApiResponse<HotelSettings>> {
    return this.http.get<ApiResponse<HotelSettings>>(getUrl(API_ENDPOINTS.SETTINGS_GET));
  }

  updateSettings(request: UpdateHotelSettingsRequest): Observable<ApiResponse<HotelSettings>> {
    return this.http.put<ApiResponse<HotelSettings>>(getUrl(API_ENDPOINTS.SETTINGS_UPDATE), request);
  }
}
