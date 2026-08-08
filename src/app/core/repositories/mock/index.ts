import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDatabaseService } from '../../services/mock-database.service';
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
  BookingStatus,
  RoomStatus,
  PaymentStatus,
  RefundStatus,
  CleaningTaskStatus,
  MaintenanceStatus,
  ServiceRequestStatus,
  ChatThreadStatus,
  PricingAdjustmentType,
  Priority
} from '../../models';

function okResponse<T>(data: T, message: string = 'Success'): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

@Injectable()
export class MockAuthRepository extends AuthRepository {
  private db = inject(MockDatabaseService);

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.db.select(db => {
      const user = db.adminUsers.find(
        u => u.email.toLowerCase() === request.email.toLowerCase() && u.staffCode === request.staffCode
      );
      if (!user) {
        throw new Error('Invalid email, password, or staff code credentials.');
      }
      return okResponse({
        token: `mock_jwt_token_${user.id}_${Date.now()}`,
        user,
        expiresInSeconds: 86400
      }, 'Login successful');
    });
  }

  getMe(): Observable<ApiResponse<AdminUser>> {
    return this.db.select(db => okResponse(db.adminUsers[0]));
  }

  logout(): Observable<ApiResponse<void>> {
    return of(okResponse(undefined, 'Logged out successfully'));
  }
}

@Injectable()
export class MockDashboardRepository extends DashboardRepository {
  private db = inject(MockDatabaseService);

  getSummary(): Observable<ApiResponse<any>> {
    return this.db.select(db => {
      const roomCounters: Record<string, number> = {
        TOTAL: db.rooms.length,
        AVAILABLE: db.rooms.filter(r => r.status === RoomStatus.AVAILABLE).length,
        OCCUPIED: db.rooms.filter(r => r.status === RoomStatus.OCCUPIED).length,
        RESERVED: db.rooms.filter(r => r.status === RoomStatus.RESERVED).length,
        UNDER_CLEANING: db.rooms.filter(r => r.status === RoomStatus.UNDER_CLEANING).length,
        MAINTENANCE: db.rooms.filter(r => r.status === RoomStatus.MAINTENANCE).length
      };

      const arrivals = db.bookings.filter(b => b.status === BookingStatus.CONFIRMED);
      const departures = db.bookings.filter(b => b.status === BookingStatus.CHECKED_IN);
      const urgentServiceRequests = db.serviceRequests.filter(s => s.priority === Priority.URGENT || s.priority === Priority.HIGH);
      const waitingChats = db.chatThreads.filter(c => c.status === ChatThreadStatus.WAITING_FOR_ADMIN);
      const occupiedCount = roomCounters['OCCUPIED'] || 0;
      const totalCount = roomCounters['TOTAL'] || 1;
      const occupancyPercentage = Math.round((occupiedCount / totalCount) * 100);

      const todayRevenue = db.payments.reduce((acc, p) => acc + (p.status === PaymentStatus.SUCCESS ? p.amount : 0), 0);

      return okResponse({
        roomCounters,
        arrivals,
        departures,
        urgentServiceRequests,
        waitingChats,
        occupancyPercentage,
        todayRevenue,
        monthlyRevenue: todayRevenue * 3
      });
    });
  }
}

@Injectable()
export class MockBookingRepository extends BookingRepository {
  private db = inject(MockDatabaseService);

  getBookings(filter?: BookingFilter): Observable<ApiResponse<PageData<BookingSummary>>> {
    return this.db.select(db => {
      let items = [...db.bookings];
      if (filter?.reference) {
        items = items.filter(b => b.bookingReference.toLowerCase().includes(filter.reference!.toLowerCase()));
      }
      if (filter?.guestQuery) {
        const q = filter.guestQuery.toLowerCase();
        items = items.filter(b => b.guestName.toLowerCase().includes(q) || b.guestEmail.toLowerCase().includes(q));
      }
      if (filter?.roomNumber) {
        items = items.filter(b => b.roomNumber === filter.roomNumber);
      }
      if (filter?.status) {
        items = items.filter(b => b.status === filter.status);
      }
      if (filter?.paymentStatus) {
        items = items.filter(b => b.paymentStatus === filter.paymentStatus);
      }

      const page = filter?.page || 1;
      const size = filter?.size || 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / size) || 1;
      const pagedItems = items.slice((page - 1) * size, page * size);

      return okResponse({ items: pagedItems, page, size, totalItems, totalPages });
    });
  }

  getBookingById(id: number): Observable<ApiResponse<BookingDetails>> {
    return this.db.select(db => {
      const b = db.bookings.find(x => x.id === id);
      if (!b) throw new Error(`Booking #${id} not found.`);
      return okResponse(b);
    });
  }

  checkIn(id: number, request: CheckInRequest): Observable<ApiResponse<BookingDetails>> {
    return this.db.mutate(db => {
      const b = db.bookings.find(x => x.id === id);
      if (!b) throw new Error(`Booking #${id} not found.`);
      if (b.status !== BookingStatus.CONFIRMED) {
        throw new Error(`Cannot check in booking with status ${b.status}`);
      }
      b.status = BookingStatus.CHECKED_IN;
      b.actualCheckInAt = new Date().toISOString();
      b.passcode = Math.floor(100000 + Math.random() * 900000).toString();
      b.timeline.push({
        id: Date.now(),
        bookingId: id,
        action: 'CHECKED_IN',
        performedBy: 'Admin Staff',
        timestamp: b.actualCheckInAt,
        notes: request.notes || 'Guest check-in processed.'
      });

      const room = db.rooms.find(r => r.id === b.roomId);
      if (room) {
        room.status = RoomStatus.OCCUPIED;
        room.currentBookingId = id;
      }
    }).pipe(map(db => okResponse(db.bookings.find(x => x.id === id)!)));
  }

  checkOut(id: number, request: CheckOutRequest): Observable<ApiResponse<BookingDetails>> {
    return this.db.mutate(db => {
      const b = db.bookings.find(x => x.id === id);
      if (!b) throw new Error(`Booking #${id} not found.`);
      if (b.status !== BookingStatus.CHECKED_IN) {
        throw new Error(`Cannot check out booking with status ${b.status}`);
      }
      b.status = BookingStatus.COMPLETED;
      b.actualCheckOutAt = new Date().toISOString();
      b.passcode = undefined;
      b.timeline.push({
        id: Date.now(),
        bookingId: id,
        action: 'CHECKED_OUT',
        performedBy: 'Admin Staff',
        timestamp: b.actualCheckOutAt,
        notes: request.cleaningNotes || 'Guest checkout completed.'
      });

      const room = db.rooms.find(r => r.id === b.roomId);
      if (room) {
        room.status = RoomStatus.UNDER_CLEANING;
        room.currentBookingId = undefined;

        // Auto-create cleaning task
        const newTaskId = Date.now();
        const newTask: CleaningTask = {
          id: newTaskId,
          taskNumber: `CLN-2026-${Math.floor(100 + Math.random() * 900)}`,
          roomId: room.id,
          roomNumber: room.roomNumber,
          roomTypeName: room.roomTypeName,
          status: CleaningTaskStatus.PENDING,
          createdFromBookingId: id,
          createdAt: new Date().toISOString(),
          notes: request.cleaningNotes || 'Checkout cleaning required.'
        };
        db.cleaningTasks.unshift(newTask);
        room.pendingCleaningTaskId = newTaskId;

        if (request.maintenanceRequired) {
          const newMntId = Date.now() + 1;
          const newMnt: MaintenanceRecord = {
            id: newMntId,
            recordNumber: `MNT-2026-${Math.floor(100 + Math.random() * 900)}`,
            roomId: room.id,
            roomNumber: room.roomNumber,
            roomTypeName: room.roomTypeName,
            title: 'Checkout Flagged Maintenance',
            description: request.maintenanceNotes || 'Maintenance issue reported during checkout.',
            priority: Priority.HIGH,
            status: MaintenanceStatus.OPEN,
            reportedBy: 'Checkout Staff',
            createdAt: new Date().toISOString(),
            cleaningRequiredOnCompletion: true
          };
          db.maintenanceRecords.unshift(newMnt);
        }
      }
    }).pipe(map(db => okResponse(db.bookings.find(x => x.id === id)!)));
  }

  cancel(id: number, request: CancellationRequest): Observable<ApiResponse<BookingDetails>> {
    return this.db.mutate(db => {
      const b = db.bookings.find(x => x.id === id);
      if (!b) throw new Error(`Booking #${id} not found.`);
      if (b.status === BookingStatus.CHECKED_IN || b.status === BookingStatus.COMPLETED) {
        throw new Error(`Cannot cancel booking in ${b.status} state.`);
      }
      b.status = BookingStatus.CANCELLED;
      b.cancellationReason = request.reason;
      b.cancelledAt = new Date().toISOString();
      b.timeline.push({
        id: Date.now(),
        bookingId: id,
        action: 'CANCELLED',
        performedBy: 'Admin Staff',
        timestamp: b.cancelledAt,
        notes: `Cancelled: ${request.reason}`
      });

      const room = db.rooms.find(r => r.id === b.roomId);
      if (room && room.status === RoomStatus.RESERVED) {
        room.status = RoomStatus.AVAILABLE;
      }
    }).pipe(map(db => okResponse(db.bookings.find(x => x.id === id)!)));
  }
}

@Injectable()
export class MockGuestRepository extends GuestRepository {
  private db = inject(MockDatabaseService);

  getGuests(filter?: GuestFilter): Observable<ApiResponse<PageData<GuestSummary>>> {
    return this.db.select(db => {
      let items = [...db.users];
      if (filter?.query) {
        const q = filter.query.toLowerCase();
        items = items.filter(g => g.fullName.toLowerCase().includes(q) || g.email.toLowerCase().includes(q) || g.phone.includes(q));
      }
      const page = filter?.page || 1;
      const size = filter?.size || 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / size) || 1;
      const pagedItems = items.slice((page - 1) * size, page * size);
      return okResponse({ items: pagedItems, page, size, totalItems, totalPages });
    });
  }

  getGuestById(id: number): Observable<ApiResponse<GuestDetails>> {
    return this.db.select(db => {
      const guest = db.users.find(g => g.id === id);
      if (!guest) throw new Error(`Guest #${id} not found.`);
      const stayHistory = db.bookings.filter(b => b.guestId === id);
      return okResponse({ ...guest, stayHistory });
    });
  }

  getGuestBookings(id: number): Observable<ApiResponse<BookingSummary[]>> {
    return this.db.select(db => {
      const bookings = db.bookings.filter(b => b.guestId === id);
      return okResponse(bookings);
    });
  }
}

@Injectable()
export class MockServiceRequestRepository extends ServiceRequestRepository {
  private db = inject(MockDatabaseService);

  getRequests(filter?: ServiceRequestFilter): Observable<ApiResponse<PageData<ServiceRequest>>> {
    return this.db.select(db => {
      let items = [...db.serviceRequests];
      if (filter?.category) items = items.filter(s => s.category === filter.category);
      if (filter?.priority) items = items.filter(s => s.priority === filter.priority);
      if (filter?.status) items = items.filter(s => s.status === filter.status);
      if (filter?.roomNumber) items = items.filter(s => s.roomNumber === filter.roomNumber);

      const page = filter?.page || 1;
      const size = filter?.size || 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / size) || 1;
      const pagedItems = items.slice((page - 1) * size, page * size);
      return okResponse({ items: pagedItems, page, size, totalItems, totalPages });
    });
  }

  getRequestById(id: number): Observable<ApiResponse<ServiceRequest>> {
    return this.db.select(db => {
      const req = db.serviceRequests.find(s => s.id === id);
      if (!req) throw new Error(`Service Request #${id} not found.`);
      return okResponse(req);
    });
  }

  assignStaff(id: number, request: AssignStaffRequest): Observable<ApiResponse<ServiceRequest>> {
    return this.db.mutate(db => {
      const req = db.serviceRequests.find(s => s.id === id);
      if (!req) throw new Error(`Service Request #${id} not found.`);
      req.assignedStaffId = request.staffId;
      req.assignedStaffName = request.staffName;
      req.status = ServiceRequestStatus.ACCEPTED;
      req.acceptedAt = new Date().toISOString();
    }).pipe(map(db => okResponse(db.serviceRequests.find(s => s.id === id)!)));
  }

  updateStatus(id: number, request: UpdateStatusRequest): Observable<ApiResponse<ServiceRequest>> {
    return this.db.mutate(db => {
      const req = db.serviceRequests.find(s => s.id === id);
      if (!req) throw new Error(`Service Request #${id} not found.`);
      req.status = request.status;
      const now = new Date().toISOString();
      if (request.status === ServiceRequestStatus.IN_PROGRESS) req.startedAt = now;
      if (request.status === ServiceRequestStatus.COMPLETED) {
        req.completedAt = now;
        req.completionNotes = request.notes;
      }
    }).pipe(map(db => okResponse(db.serviceRequests.find(s => s.id === id)!)));
  }
}

@Injectable()
export class MockChatRepository extends ChatRepository {
  private db = inject(MockDatabaseService);

  getThreads(filter?: ChatFilter): Observable<ApiResponse<PageData<ChatThread>>> {
    return this.db.select(db => {
      let items = [...db.chatThreads];
      if (filter?.status) items = items.filter(c => c.status === filter.status);

      const page = filter?.page || 1;
      const size = filter?.size || 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / size) || 1;
      const pagedItems = items.slice((page - 1) * size, page * size);
      return okResponse({ items: pagedItems, page, size, totalItems, totalPages });
    });
  }

  getThreadById(id: number): Observable<ApiResponse<ChatThread>> {
    return this.db.select(db => {
      const thread = db.chatThreads.find(c => c.id === id);
      if (!thread) throw new Error(`Chat Thread #${id} not found.`);
      return okResponse(thread);
    });
  }

  assignAdmin(id: number, adminId: number, adminName: string): Observable<ApiResponse<ChatThread>> {
    return this.db.mutate(db => {
      const t = db.chatThreads.find(c => c.id === id);
      if (!t) throw new Error(`Chat Thread #${id} not found.`);
      t.assignedAdminId = adminId;
      t.assignedAdminName = adminName;
      t.status = ChatThreadStatus.ASSIGNED;
    }).pipe(map(db => okResponse(db.chatThreads.find(c => c.id === id)!)));
  }

  sendMessage(id: number, request: SendReplyRequest): Observable<ApiResponse<ChatMessage>> {
    let createdMsg: ChatMessage;
    return this.db.mutate(db => {
      const t = db.chatThreads.find(c => c.id === id);
      if (!t) throw new Error(`Chat Thread #${id} not found.`);
      createdMsg = {
        id: Date.now(),
        threadId: id,
        senderType: 'ADMIN',
        senderId: 1,
        senderName: t.assignedAdminName || 'Admin Staff',
        content: request.content,
        sentAt: new Date().toISOString(),
        isRead: true
      };
      if (!t.messages) t.messages = [];
      t.messages.push(createdMsg);
      t.lastMessageText = request.content;
      t.lastMessageAt = createdMsg.sentAt;
    }).pipe(map(() => okResponse(createdMsg)));
  }

  resolveThread(id: number): Observable<ApiResponse<ChatThread>> {
    return this.db.mutate(db => {
      const t = db.chatThreads.find(c => c.id === id);
      if (!t) throw new Error(`Chat Thread #${id} not found.`);
      t.status = ChatThreadStatus.RESOLVED;
      t.resolvedAt = new Date().toISOString();
    }).pipe(map(db => okResponse(db.chatThreads.find(c => c.id === id)!)));
  }

  markAsRead(id: number): Observable<ApiResponse<void>> {
    return this.db.mutate(db => {
      const t = db.chatThreads.find(c => c.id === id);
      if (t) {
        t.unreadCount = 0;
        if (t.messages) t.messages.forEach(m => m.isRead = true);
      }
    }).pipe(map(() => okResponse(undefined)));
  }
}

@Injectable()
export class MockRoomRepository extends RoomRepository {
  private db = inject(MockDatabaseService);

  getRooms(filter?: RoomFilter): Observable<ApiResponse<PageData<RoomSummary>>> {
    return this.db.select(db => {
      let items = [...db.rooms];
      if (filter?.roomTypeId) items = items.filter(r => r.roomTypeId === filter.roomTypeId);
      if (filter?.status) items = items.filter(r => r.status === filter.status);

      const page = filter?.page || 1;
      const size = filter?.size || 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / size) || 1;
      const pagedItems = items.slice((page - 1) * size, page * size);
      return okResponse({ items: pagedItems, page, size, totalItems, totalPages });
    });
  }

  getRoomById(id: number): Observable<ApiResponse<RoomDetails>> {
    return this.db.select(db => {
      const r = db.rooms.find(x => x.id === id);
      if (!r) throw new Error(`Room #${id} not found.`);
      return okResponse(r);
    });
  }

  createRoom(value: RoomFormValue): Observable<ApiResponse<RoomDetails>> {
    let newRoom: RoomDetails;
    return this.db.mutate(db => {
      if (db.rooms.some(r => r.roomNumber.toLowerCase() === value.roomNumber.toLowerCase())) {
        throw new Error(`Room number ${value.roomNumber} already exists.`);
      }
      const roomType = db.roomTypes.find(rt => rt.id === value.roomTypeId);
      newRoom = {
        id: Date.now(),
        roomNumber: value.roomNumber,
        roomTypeId: value.roomTypeId,
        roomTypeName: roomType ? roomType.name : 'Standard Room',
        floor: value.floor,
        capacity: roomType ? roomType.adultCapacity : 2,
        basePrice: roomType ? roomType.basePrice : 5000,
        currentPrice: roomType ? roomType.basePrice : 5000,
        status: value.status || RoomStatus.AVAILABLE,
        isActive: value.isActive,
        rating: 5.0,
        description: value.description,
        amenities: roomType ? roomType.amenities : [],
        images: [],
        updatedAt: new Date().toISOString()
      };
      db.rooms.unshift(newRoom);
    }).pipe(map(() => okResponse(newRoom)));
  }

  updateRoom(id: number, value: RoomFormValue): Observable<ApiResponse<RoomDetails>> {
    return this.db.mutate(db => {
      const r = db.rooms.find(x => x.id === id);
      if (!r) throw new Error(`Room #${id} not found.`);
      r.roomNumber = value.roomNumber;
      r.roomTypeId = value.roomTypeId;
      r.floor = value.floor;
      r.description = value.description;
      r.isActive = value.isActive;
      r.status = value.status;
      r.updatedAt = new Date().toISOString();
    }).pipe(map(db => okResponse(db.rooms.find(x => x.id === id)!)));
  }

  updateRoomStatus(id: number, status: RoomStatus): Observable<ApiResponse<RoomDetails>> {
    return this.db.mutate(db => {
      const r = db.rooms.find(x => x.id === id);
      if (!r) throw new Error(`Room #${id} not found.`);
      r.status = status;
      r.updatedAt = new Date().toISOString();
    }).pipe(map(db => okResponse(db.rooms.find(x => x.id === id)!)));
  }

  getRoomTypes(): Observable<ApiResponse<RoomType[]>> {
    return this.db.select(db => okResponse(db.roomTypes));
  }

  getRoomTypeById(id: number): Observable<ApiResponse<RoomType>> {
    return this.db.select(db => {
      const rt = db.roomTypes.find(x => x.id === id);
      if (!rt) throw new Error(`Room Type #${id} not found.`);
      return okResponse(rt);
    });
  }

  createRoomType(value: RoomTypeFormValue): Observable<ApiResponse<RoomType>> {
    let newType: RoomType;
    return this.db.mutate(db => {
      newType = {
        id: Date.now(),
        name: value.name,
        code: value.code.toUpperCase(),
        description: value.description,
        basePrice: value.basePrice,
        minimumPrice: value.minimumPrice,
        maximumPrice: value.maximumPrice,
        adultCapacity: value.adultCapacity,
        childCapacity: value.childCapacity,
        bedType: value.bedType,
        roomSizeSqFt: value.roomSizeSqFt,
        amenities: db.amenities.filter(a => value.amenityIds.includes(a.id)),
        images: [],
        isActive: value.isActive,
        totalRoomsCount: 0
      };
      db.roomTypes.push(newType);
    }).pipe(map(() => okResponse(newType)));
  }

  updateRoomType(id: number, value: RoomTypeFormValue): Observable<ApiResponse<RoomType>> {
    return this.db.mutate(db => {
      const rt = db.roomTypes.find(x => x.id === id);
      if (!rt) throw new Error(`Room Type #${id} not found.`);
      rt.name = value.name;
      rt.code = value.code.toUpperCase();
      rt.description = value.description;
      rt.basePrice = value.basePrice;
      rt.minimumPrice = value.minimumPrice;
      rt.maximumPrice = value.maximumPrice;
      rt.adultCapacity = value.adultCapacity;
      rt.childCapacity = value.childCapacity;
      rt.bedType = value.bedType;
      rt.roomSizeSqFt = value.roomSizeSqFt;
      rt.isActive = value.isActive;
    }).pipe(map(db => okResponse(db.roomTypes.find(x => x.id === id)!)));
  }

  getAmenities(): Observable<ApiResponse<Amenity[]>> {
    return this.db.select(db => okResponse(db.amenities));
  }

  createAmenity(name: string, iconName?: string): Observable<ApiResponse<Amenity>> {
    let newAmenity: Amenity;
    return this.db.mutate(db => {
      newAmenity = {
        id: Date.now(),
        name,
        iconName: iconName || 'check',
        isActive: true,
        usageCount: 0
      };
      db.amenities.push(newAmenity);
    }).pipe(map(() => okResponse(newAmenity)));
  }

  updateAmenity(id: number, name: string, iconName?: string): Observable<ApiResponse<Amenity>> {
    return this.db.mutate(db => {
      const a = db.amenities.find(x => x.id === id);
      if (!a) throw new Error(`Amenity #${id} not found.`);
      a.name = name;
      if (iconName) a.iconName = iconName;
    }).pipe(map(db => okResponse(db.amenities.find(x => x.id === id)!)));
  }
}

@Injectable()
export class MockCleaningRepository extends CleaningRepository {
  private db = inject(MockDatabaseService);

  getCleaningTasks(filter?: CleaningFilter): Observable<ApiResponse<PageData<CleaningTask>>> {
    return this.db.select(db => {
      let items = [...db.cleaningTasks];
      if (filter?.status) items = items.filter(c => c.status === filter.status);

      const page = filter?.page || 1;
      const size = filter?.size || 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / size) || 1;
      const pagedItems = items.slice((page - 1) * size, page * size);
      return okResponse({ items: pagedItems, page, size, totalItems, totalPages });
    });
  }

  getCleaningTaskById(id: number): Observable<ApiResponse<CleaningTask>> {
    return this.db.select(db => {
      const task = db.cleaningTasks.find(c => c.id === id);
      if (!task) throw new Error(`Cleaning Task #${id} not found.`);
      return okResponse(task);
    });
  }

  assignStaff(id: number, staffId: number, staffName: string): Observable<ApiResponse<CleaningTask>> {
    return this.db.mutate(db => {
      const t = db.cleaningTasks.find(c => c.id === id);
      if (!t) throw new Error(`Cleaning Task #${id} not found.`);
      t.assignedStaffId = staffId;
      t.assignedStaffName = staffName;
      t.status = CleaningTaskStatus.ASSIGNED;
      t.assignedAt = new Date().toISOString();
    }).pipe(map(db => okResponse(db.cleaningTasks.find(c => c.id === id)!)));
  }

  startTask(id: number): Observable<ApiResponse<CleaningTask>> {
    return this.db.mutate(db => {
      const t = db.cleaningTasks.find(c => c.id === id);
      if (!t) throw new Error(`Cleaning Task #${id} not found.`);
      t.status = CleaningTaskStatus.IN_PROGRESS;
      t.startedAt = new Date().toISOString();
    }).pipe(map(db => okResponse(db.cleaningTasks.find(c => c.id === id)!)));
  }

  completeTask(id: number, request: CompleteCleaningRequest): Observable<ApiResponse<CleaningTask>> {
    return this.db.mutate(db => {
      const t = db.cleaningTasks.find(c => c.id === id);
      if (!t) throw new Error(`Cleaning Task #${id} not found.`);
      t.status = CleaningTaskStatus.COMPLETED;
      t.completedAt = new Date().toISOString();
      t.notes = request.notes;
      t.maintenanceIssueFound = request.maintenanceIssueFound;

      const room = db.rooms.find(r => r.id === t.roomId);
      if (room) {
        if (request.maintenanceIssueFound) {
          room.status = RoomStatus.MAINTENANCE;
          const newMnt: MaintenanceRecord = {
            id: Date.now(),
            recordNumber: `MNT-2026-${Math.floor(100 + Math.random() * 900)}`,
            roomId: room.id,
            roomNumber: room.roomNumber,
            roomTypeName: room.roomTypeName,
            title: 'Housekeeping Issue Found',
            description: request.maintenanceDescription || 'Issue detected during cleaning inspection.',
            priority: request.priority || Priority.HIGH,
            status: MaintenanceStatus.OPEN,
            reportedBy: 'Housekeeping Staff',
            createdAt: new Date().toISOString(),
            cleaningRequiredOnCompletion: true
          };
          db.maintenanceRecords.unshift(newMnt);
          room.openMaintenanceRecordId = newMnt.id;
        } else {
          room.status = RoomStatus.AVAILABLE;
          room.pendingCleaningTaskId = undefined;
        }
      }
    }).pipe(map(db => okResponse(db.cleaningTasks.find(c => c.id === id)!)));
  }
}

@Injectable()
export class MockMaintenanceRepository extends MaintenanceRepository {
  private db = inject(MockDatabaseService);

  getMaintenanceRecords(filter?: MaintenanceFilter): Observable<ApiResponse<PageData<MaintenanceRecord>>> {
    return this.db.select(db => {
      let items = [...db.maintenanceRecords];
      if (filter?.status) items = items.filter(m => m.status === filter.status);

      const page = filter?.page || 1;
      const size = filter?.size || 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / size) || 1;
      const pagedItems = items.slice((page - 1) * size, page * size);
      return okResponse({ items: pagedItems, page, size, totalItems, totalPages });
    });
  }

  getMaintenanceById(id: number): Observable<ApiResponse<MaintenanceRecord>> {
    return this.db.select(db => {
      const m = db.maintenanceRecords.find(x => x.id === id);
      if (!m) throw new Error(`Maintenance Record #${id} not found.`);
      return okResponse(m);
    });
  }

  createRecord(request: CreateMaintenanceRequest): Observable<ApiResponse<MaintenanceRecord>> {
    let created: MaintenanceRecord;
    return this.db.mutate(db => {
      const room = db.rooms.find(r => r.id === request.roomId);
      if (!room) throw new Error(`Room #${request.roomId} not found.`);
      created = {
        id: Date.now(),
        recordNumber: `MNT-2026-${Math.floor(100 + Math.random() * 900)}`,
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomTypeName: room.roomTypeName,
        title: request.title,
        description: request.description,
        priority: request.priority,
        status: MaintenanceStatus.OPEN,
        reportedBy: 'Admin Staff',
        createdAt: new Date().toISOString()
      };
      db.maintenanceRecords.unshift(created);
      room.status = RoomStatus.MAINTENANCE;
      room.openMaintenanceRecordId = created.id;
    }).pipe(map(() => okResponse(created)));
  }

  assignTechnician(id: number, techId: number, techName: string): Observable<ApiResponse<MaintenanceRecord>> {
    return this.db.mutate(db => {
      const m = db.maintenanceRecords.find(x => x.id === id);
      if (!m) throw new Error(`Maintenance Record #${id} not found.`);
      m.assignedTechnicianId = techId;
      m.assignedTechnicianName = techName;
      m.status = MaintenanceStatus.ASSIGNED;
      m.assignedAt = new Date().toISOString();
    }).pipe(map(db => okResponse(db.maintenanceRecords.find(x => x.id === id)!)));
  }

  startRecord(id: number): Observable<ApiResponse<MaintenanceRecord>> {
    return this.db.mutate(db => {
      const m = db.maintenanceRecords.find(x => x.id === id);
      if (!m) throw new Error(`Maintenance Record #${id} not found.`);
      m.status = MaintenanceStatus.IN_PROGRESS;
      m.startedAt = new Date().toISOString();
    }).pipe(map(db => okResponse(db.maintenanceRecords.find(x => x.id === id)!)));
  }

  holdRecord(id: number, reason?: string): Observable<ApiResponse<MaintenanceRecord>> {
    return this.db.mutate(db => {
      const m = db.maintenanceRecords.find(x => x.id === id);
      if (!m) throw new Error(`Maintenance Record #${id} not found.`);
      m.status = MaintenanceStatus.ON_HOLD;
      m.onHoldAt = new Date().toISOString();
      if (reason) m.resolutionNotes = `Hold Reason: ${reason}`;
    }).pipe(map(db => okResponse(db.maintenanceRecords.find(x => x.id === id)!)));
  }

  completeRecord(id: number, request: CompleteMaintenanceRequest): Observable<ApiResponse<MaintenanceRecord>> {
    return this.db.mutate(db => {
      const m = db.maintenanceRecords.find(x => x.id === id);
      if (!m) throw new Error(`Maintenance Record #${id} not found.`);
      m.status = MaintenanceStatus.COMPLETED;
      m.completedAt = new Date().toISOString();
      m.resolutionNotes = request.resolutionNotes;

      const room = db.rooms.find(r => r.id === m.roomId);
      if (room) {
        room.openMaintenanceRecordId = undefined;
        if (request.cleaningRequired) {
          room.status = RoomStatus.UNDER_CLEANING;
          const newTask: CleaningTask = {
            id: Date.now(),
            taskNumber: `CLN-2026-${Math.floor(100 + Math.random() * 900)}`,
            roomId: room.id,
            roomNumber: room.roomNumber,
            roomTypeName: room.roomTypeName,
            status: CleaningTaskStatus.PENDING,
            createdAt: new Date().toISOString(),
            notes: 'Post-maintenance cleaning required.'
          };
          db.cleaningTasks.unshift(newTask);
          room.pendingCleaningTaskId = newTask.id;
        } else {
          room.status = RoomStatus.AVAILABLE;
        }
      }
    }).pipe(map(db => okResponse(db.maintenanceRecords.find(x => x.id === id)!)));
  }
}

@Injectable()
export class MockPaymentRepository extends PaymentRepository {
  private db = inject(MockDatabaseService);

  getPayments(filter?: PaymentFilter): Observable<ApiResponse<PageData<PaymentSummary>>> {
    return this.db.select(db => {
      let items = [...db.payments];
      if (filter?.method) items = items.filter(p => p.paymentMethod === filter.method);
      if (filter?.status) items = items.filter(p => p.status === filter.status);

      const page = filter?.page || 1;
      const size = filter?.size || 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / size) || 1;
      const pagedItems = items.slice((page - 1) * size, page * size);
      return okResponse({ items: pagedItems, page, size, totalItems, totalPages });
    });
  }

  getPaymentById(id: number): Observable<ApiResponse<PaymentDetails>> {
    return this.db.select(db => {
      const p = db.payments.find(x => x.id === id);
      if (!p) throw new Error(`Payment #${id} not found.`);
      return okResponse(p);
    });
  }

  processRefund(paymentId: number, request: RefundRequest): Observable<ApiResponse<RefundRecord>> {
    let refund: RefundRecord;
    return this.db.mutate(db => {
      const p = db.payments.find(x => x.id === paymentId);
      if (!p) throw new Error(`Payment #${paymentId} not found.`);
      const remainingBalance = p.amount - p.refundedAmount;
      if (request.amount <= 0 || request.amount > remainingBalance) {
        throw new Error(`Refund amount ₹${request.amount} exceeds remaining refundable balance of ₹${remainingBalance}`);
      }

      refund = {
        id: Date.now(),
        refundReference: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
        paymentId,
        amount: request.amount,
        reason: request.reason,
        status: RefundStatus.SUCCESS,
        processedBy: 'Admin Staff',
        createdAt: new Date().toISOString()
      };
      db.refunds.unshift(refund);
      if (!p.refunds) p.refunds = [];
      p.refunds.push(refund);

      p.refundedAmount += request.amount;
      p.status = p.refundedAmount >= p.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;

      const booking = db.bookings.find(b => b.id === p.bookingId);
      if (booking) {
        booking.refundedAmount = p.refundedAmount;
        booking.paymentStatus = p.status;
      }
    }).pipe(map(() => okResponse(refund)));
  }

  getRefundsByPayment(paymentId: number): Observable<ApiResponse<RefundRecord[]>> {
    return this.db.select(db => {
      const refunds = db.refunds.filter(r => r.paymentId === paymentId);
      return okResponse(refunds);
    });
  }
}

@Injectable()
export class MockPricingRepository extends PricingRepository {
  private db = inject(MockDatabaseService);

  getPricingRules(): Observable<ApiResponse<PricingRule[]>> {
    return this.db.select(db => okResponse(db.pricingRules));
  }

  getPricingRuleById(id: number): Observable<ApiResponse<PricingRule>> {
    return this.db.select(db => {
      const r = db.pricingRules.find(x => x.id === id);
      if (!r) throw new Error(`Pricing Rule #${id} not found.`);
      return okResponse(r);
    });
  }

  createPricingRule(rule: Partial<PricingRule>): Observable<ApiResponse<PricingRule>> {
    let created: PricingRule;
    return this.db.mutate(db => {
      const roomType = db.roomTypes.find(rt => rt.id === rule.roomTypeId);
      created = {
        id: Date.now(),
        name: rule.name || 'New Demand Rule',
        roomTypeId: rule.roomTypeId || 1,
        roomTypeName: roomType ? roomType.name : 'Deluxe King Suite',
        minOccupancyPercentage: rule.minOccupancyPercentage || 0,
        maxOccupancyPercentage: rule.maxOccupancyPercentage || 30,
        adjustmentType: rule.adjustmentType || PricingAdjustmentType.PERCENTAGE_DISCOUNT,
        adjustmentValue: rule.adjustmentValue || 10,
        allowedMinPrice: rule.allowedMinPrice || 4500,
        allowedMaxPrice: rule.allowedMaxPrice || 9500,
        isActive: rule.isActive ?? true,
        createdAt: new Date().toISOString()
      };
      db.pricingRules.unshift(created);
    }).pipe(map(() => okResponse(created)));
  }

  updatePricingRule(id: number, rule: Partial<PricingRule>): Observable<ApiResponse<PricingRule>> {
    return this.db.mutate(db => {
      const r = db.pricingRules.find(x => x.id === id);
      if (!r) throw new Error(`Pricing Rule #${id} not found.`);
      Object.assign(r, rule);
    }).pipe(map(db => okResponse(db.pricingRules.find(x => x.id === id)!)));
  }

  toggleDynamicPricing(enabled: boolean): Observable<ApiResponse<boolean>> {
    return this.db.mutate(db => {
      db.hotelSettings.isDynamicPricingEnabled = enabled;
    }).pipe(map(() => okResponse(enabled)));
  }

  recalculatePricing(): Observable<ApiResponse<RecalculatePricingResult>> {
    return this.db.select(db => okResponse({
      totalRoomsEvaluated: db.rooms.length,
      pricesUpdated: db.rooms.length,
      recalculatedAt: new Date().toISOString()
    }));
  }

  previewPricing(request: PricingPreviewRequest): Observable<ApiResponse<PricingPreviewResult>> {
    return this.db.select(db => {
      const roomType = db.roomTypes.find(rt => rt.id === request.roomTypeId);
      const totalRooms = db.rooms.filter(r => r.roomTypeId === request.roomTypeId).length || 10;
      const occupiedRooms = db.rooms.filter(r => r.roomTypeId === request.roomTypeId && r.status === RoomStatus.OCCUPIED).length;
      const occupancyPercentage = Math.round((occupiedRooms / totalRooms) * 100);

      const rule = db.pricingRules.find(
        r => r.roomTypeId === request.roomTypeId && r.isActive &&
        occupancyPercentage >= r.minOccupancyPercentage && occupancyPercentage <= r.maxOccupancyPercentage
      );

      const basePrice = roomType ? roomType.basePrice : 5000;
      let calculatedPrice = basePrice;

      if (rule) {
        if (rule.adjustmentType === PricingAdjustmentType.PERCENTAGE_DISCOUNT) {
          calculatedPrice = basePrice * (1 - rule.adjustmentValue / 100);
        } else if (rule.adjustmentType === PricingAdjustmentType.PERCENTAGE_MARKUP) {
          calculatedPrice = basePrice * (1 + rule.adjustmentValue / 100);
        } else if (rule.adjustmentType === PricingAdjustmentType.FIXED_DISCOUNT) {
          calculatedPrice = basePrice - rule.adjustmentValue;
        } else if (rule.adjustmentType === PricingAdjustmentType.FIXED_MARKUP) {
          calculatedPrice = basePrice + rule.adjustmentValue;
        }
      }

      const minP = rule ? rule.allowedMinPrice : (roomType ? roomType.minimumPrice : 3000);
      const maxP = rule ? rule.allowedMaxPrice : (roomType ? roomType.maximumPrice : 10000);
      const clampedFinalPrice = Math.min(Math.max(calculatedPrice, minP), maxP);

      return okResponse({
        roomTypeId: request.roomTypeId,
        roomTypeName: roomType ? roomType.name : 'Deluxe King Suite',
        targetDate: request.targetDate,
        basePrice,
        totalRooms,
        occupiedRooms,
        occupancyPercentage,
        appliedRuleName: rule ? rule.name : undefined,
        adjustmentType: rule ? rule.adjustmentType : PricingAdjustmentType.NO_ADJUSTMENT,
        adjustmentValue: rule ? rule.adjustmentValue : 0,
        calculatedPrice,
        clampedFinalPrice,
        currency: db.hotelSettings.currency || 'INR'
      });
    });
  }
}

@Injectable()
export class MockReportRepository extends ReportRepository {
  private db = inject(MockDatabaseService);

  getRevenueReport(filter: ReportFilter): Observable<ApiResponse<RevenueReport>> {
    return this.db.select(db => {
      const grossRevenue = db.payments.reduce((acc, p) => acc + (p.status === PaymentStatus.SUCCESS ? p.amount : 0), 0);
      const totalRefunds = db.refunds.reduce((acc, r) => acc + r.amount, 0);
      const netRevenue = grossRevenue - totalRefunds;
      return okResponse({
        period: `${filter.fromDate} to ${filter.toDate}`,
        grossRevenue,
        totalRefunds,
        netRevenue,
        averageBookingValue: Math.round(grossRevenue / (db.bookings.length || 1)),
        revenueByPaymentMethod: { CARD: grossRevenue * 0.7, UPI: grossRevenue * 0.3 },
        revenueByRoomType: { 'Deluxe King Suite': grossRevenue * 0.6, 'Executive Twin Room': grossRevenue * 0.4 },
        dailyBreakdown: [
          { date: filter.fromDate, gross: grossRevenue * 0.5, net: netRevenue * 0.5, refunds: totalRefunds * 0.5 },
          { date: filter.toDate, gross: grossRevenue * 0.5, net: netRevenue * 0.5, refunds: totalRefunds * 0.5 }
        ]
      });
    });
  }

  getBookingReport(filter: ReportFilter): Observable<ApiResponse<BookingReport>> {
    return this.db.select(db => okResponse({
      period: `${filter.fromDate} to ${filter.toDate}`,
      totalBookings: db.bookings.length,
      completedBookings: db.bookings.filter(b => b.status === BookingStatus.COMPLETED).length,
      cancelledBookings: db.bookings.filter(b => b.status === BookingStatus.CANCELLED).length,
      cancellationRatePercentage: 15,
      averageStayDays: 2.5,
      bookingsByStatus: { CONFIRMED: 2, CHECKED_IN: 1, COMPLETED: 1, CANCELLED: 1 },
      bookingsByRoomType: { 'Deluxe King Suite': 3, 'Executive Twin Room': 2 },
      dailyBreakdown: [{ date: filter.fromDate, total: 3, cancelled: 1 }]
    }));
  }

  getOccupancyReport(filter: ReportFilter): Observable<ApiResponse<OccupancyReport>> {
    return this.db.select(db => okResponse({
      period: `${filter.fromDate} to ${filter.toDate}`,
      averageOccupancyPercentage: 65,
      peakOccupancyPercentage: 85,
      lowestOccupancyPercentage: 40,
      maintenanceImpactDays: 3,
      occupancyByRoomType: { 'Deluxe King Suite': 70, 'Executive Twin Room': 60 },
      dailyBreakdown: [{ date: filter.fromDate, occupancyPercentage: 65, occupiedCount: 4 }]
    }));
  }

  getServiceReport(filter: ReportFilter): Observable<ApiResponse<ServiceReport>> {
    return this.db.select(db => okResponse({
      period: `${filter.fromDate} to ${filter.toDate}`,
      totalRequests: db.serviceRequests.length,
      completedRequests: db.serviceRequests.filter(s => s.status === ServiceRequestStatus.COMPLETED).length,
      cancelledRequests: db.serviceRequests.filter(s => s.status === ServiceRequestStatus.CANCELLED).length,
      averageResponseTimeMinutes: 12,
      averageCompletionTimeMinutes: 25,
      requestsByCategory: { Housekeeping: 2, Maintenance: 1 },
      requestsByPriority: { HIGH: 1, MEDIUM: 1, LOW: 1 }
    }));
  }
}

@Injectable()
export class MockSettingsRepository extends SettingsRepository {
  private db = inject(MockDatabaseService);

  getSettings(): Observable<ApiResponse<HotelSettings>> {
    return this.db.select(db => okResponse(db.hotelSettings));
  }

  updateSettings(request: UpdateHotelSettingsRequest): Observable<ApiResponse<HotelSettings>> {
    return this.db.mutate(db => {
      Object.assign(db.hotelSettings, request);
      db.hotelSettings.updatedAt = new Date().toISOString();
      db.hotelSettings.updatedBy = 'Admin Staff';
    }).pipe(map(db => okResponse(db.hotelSettings)));
  }
}
