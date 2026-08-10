import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { STORAGE_KEYS } from '../constants/storage-keys.constants';
import {
  MockUserRecord,
  Room,
  RoomType,
  Booking,
  Payment,
  RoomPasscode,
  ServiceRequest,
  ChatThread,
  Notification,
  Feedback,
  HotelSettings
} from '../models';

export interface MockDatabase {
  users: MockUserRecord[];
  roomTypes: RoomType[];
  rooms: Room[];
  bookings: Booking[];
  payments: Payment[];
  passcodes: RoomPasscode[];
  serviceRequests: ServiceRequest[];
  chatThreads: ChatThread[];
  notifications: Notification[];
  feedback: Feedback[];
  hotelSettings: HotelSettings;
}

@Injectable({
  providedIn: 'root'
})
export class MockDatabaseService {
  private http = inject(HttpClient);
  private db$ = new BehaviorSubject<MockDatabase | null>(null);
  private isLoaded = false;

  public initialize(): Observable<MockDatabase> {
    if (this.isLoaded && this.db$.value && this.db$.value.rooms && this.db$.value.rooms.length > 0 && this.db$.value.users && this.db$.value.users.length > 0) {
      return of(this.db$.value);
    }

    const saved = localStorage.getItem(STORAGE_KEYS.mockDatabase);
    if (saved) {
      try {
        const parsed: MockDatabase = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.rooms) && parsed.rooms.length > 0 && Array.isArray(parsed.users) && parsed.users.length > 0) {
          this.db$.next(parsed);
          this.isLoaded = true;
          return of(parsed);
        } else {
          console.warn('LocalStorage database had empty arrays. Purging and re-seeding...');
          localStorage.removeItem(STORAGE_KEYS.mockDatabase);
        }
      } catch (e) {
        console.warn('Failed to parse saved mock DB, re-seeding from JSON files.', e);
        localStorage.removeItem(STORAGE_KEYS.mockDatabase);
      }
    }

    return this.loadSeedData().pipe(
      tap(db => {
        this.saveDatabase(db);
        this.db$.next(db);
        this.isLoaded = true;
      })
    );
  }

  private loadSeedData(): Observable<MockDatabase> {
    return forkJoin({
      users: this.http.get<MockUserRecord[]>('assets/mock-data/users.json').pipe(catchError(() => of(this.getFallbackUsers()))),
      roomTypes: this.http.get<RoomType[]>('assets/mock-data/room-types.json').pipe(catchError(() => of(this.getFallbackRoomTypes()))),
      rooms: this.http.get<Room[]>('assets/mock-data/rooms.json').pipe(catchError(() => of(this.getFallbackRooms()))),
      bookings: this.http.get<Booking[]>('assets/mock-data/bookings.json').pipe(catchError(() => of(this.getFallbackBookings()))),
      payments: this.http.get<Payment[]>('assets/mock-data/payments.json').pipe(catchError(() => of([]))),
      passcodes: this.http.get<RoomPasscode[]>('assets/mock-data/passcodes.json').pipe(catchError(() => of(this.getFallbackPasscodes()))),
      serviceRequests: this.http.get<ServiceRequest[]>('assets/mock-data/service-requests.json').pipe(catchError(() => of([]))),
      chatThreads: this.http.get<ChatThread[]>('assets/mock-data/chat-threads.json').pipe(catchError(() => of([]))),
      notifications: this.http.get<Notification[]>('assets/mock-data/notifications.json').pipe(catchError(() => of([]))),
      feedback: this.http.get<Feedback[]>('assets/mock-data/feedback.json').pipe(catchError(() => of([]))),
      hotelSettings: this.http.get<HotelSettings>('assets/mock-data/hotel-settings.json').pipe(catchError(() => of(this.getFallbackSettings())))
    }).pipe(
      map(data => {
        if (!data.users || data.users.length === 0) data.users = this.getFallbackUsers();
        if (!data.roomTypes || data.roomTypes.length === 0) data.roomTypes = this.getFallbackRoomTypes();
        if (!data.rooms || data.rooms.length === 0) data.rooms = this.getFallbackRooms();
        if (!data.bookings || data.bookings.length === 0) data.bookings = this.getFallbackBookings();
        if (!data.passcodes || data.passcodes.length === 0) data.passcodes = this.getFallbackPasscodes();
        if (!data.hotelSettings) data.hotelSettings = this.getFallbackSettings();
        return data as MockDatabase;
      })
    );
  }

  public getSnapshot(): MockDatabase {
    if (!this.db$.value || !this.db$.value.rooms || this.db$.value.rooms.length === 0) {
      const fb = this.getFallbackDatabase();
      this.db$.next(fb);
      return fb;
    }
    return this.db$.value;
  }

  public saveDatabase(db: MockDatabase): void {
    localStorage.setItem(STORAGE_KEYS.mockDatabase, JSON.stringify(db));
    this.db$.next(db);
  }

  public resetDatabase(): Observable<MockDatabase> {
    localStorage.removeItem(STORAGE_KEYS.mockDatabase);
    this.isLoaded = false;
    return this.initialize();
  }

  private getFallbackUsers(): MockUserRecord[] {
    return [
      {
        id: 1,
        publicId: 'USR-20260810-0001',
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@example.com',
        phone: '9876543210',
        dateOfBirth: '1995-05-15',
        governmentIdType: 'AADHAAR',
        governmentIdMasked: 'XXXX-XXXX-1234',
        role: 'CUSTOMER',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mockPassword: 'Guest@123'
      }
    ];
  }

  private getFallbackRoomTypes(): RoomType[] {
    return [
      {
        id: 1,
        name: 'Deluxe Suite',
        code: 'DELUXE',
        basePrice: 4500,
        minimumPrice: 4000,
        maximumPrice: 6000,
        roomSizeSqft: 450,
        bedType: 'King Bed',
        maximumAdults: 2,
        maximumChildren: 1,
        description: 'Luxury room with ocean balcony view.',
        active: true
      },
      {
        id: 2,
        name: 'Executive Suite',
        code: 'EXECUTIVE',
        basePrice: 7500,
        minimumPrice: 7000,
        maximumPrice: 10000,
        roomSizeSqft: 650,
        bedType: 'King Bed',
        maximumAdults: 3,
        maximumChildren: 2,
        description: 'Spacious executive suite with private lounge access.',
        active: true
      },
      {
        id: 3,
        name: 'Presidential Villa',
        code: 'PRESIDENTIAL',
        basePrice: 15000,
        minimumPrice: 14000,
        maximumPrice: 20000,
        roomSizeSqft: 1200,
        bedType: 'Super King Bed',
        maximumAdults: 4,
        maximumChildren: 2,
        description: 'Ultra-luxury villa with private plunge pool.',
        active: true
      }
    ];
  }

  private getFallbackRooms(): Room[] {
    const types = this.getFallbackRoomTypes();
    return [
      {
        id: 1,
        publicId: 'RM-101',
        roomNumber: '101',
        floorNumber: 1,
        status: 'AVAILABLE',
        roomType: types[0],
        description: 'Deluxe Ocean View Room with Private Balcony',
        basePrice: 4500,
        currentPrice: 4500,
        currency: 'INR',
        maximumAdults: 2,
        maximumChildren: 1,
        rating: 4.9,
        featured: true,
        active: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80', altText: 'Ocean View Room', displayOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', altText: 'Bathroom', displayOrder: 2 }
        ],
        amenities: ['High-speed Wi-Fi', 'Smart TV', 'Mini Bar', 'Climate Control', 'Keyless Passcode']
      },
      {
        id: 2,
        publicId: 'RM-201',
        roomNumber: '201',
        floorNumber: 2,
        status: 'AVAILABLE',
        roomType: types[1],
        description: 'Executive Lounge Suite with Horizon Skyline View',
        basePrice: 7500,
        currentPrice: 7500,
        currency: 'INR',
        maximumAdults: 3,
        maximumChildren: 2,
        rating: 4.8,
        featured: true,
        active: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80', altText: 'Executive Suite', displayOrder: 1 }
        ],
        amenities: ['Lounge Access', 'King Bed', 'Jacuzzi', '24/7 Butler', 'Fiber Wi-Fi']
      },
      {
        id: 3,
        publicId: 'RM-301',
        roomNumber: '301',
        floorNumber: 3,
        status: 'AVAILABLE',
        roomType: types[2],
        description: 'Presidential Pool Villa with Panoramic Sunset Deck',
        basePrice: 15000,
        currentPrice: 15000,
        currency: 'INR',
        maximumAdults: 4,
        maximumChildren: 2,
        rating: 5.0,
        featured: true,
        active: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', altText: 'Presidential Villa', displayOrder: 1 }
        ],
        amenities: ['Private Pool', 'Ocean Deck', 'Spa Service', 'Chef on Demand', 'VIP Keycode']
      }
    ];
  }

  private getFallbackBookings(): Booking[] {
    const rooms = this.getFallbackRooms();
    return [
      {
        id: 1,
        bookingReference: 'BK-20260810-0001',
        userId: 1,
        room: {
          id: rooms[0].id,
          publicId: rooms[0].publicId,
          roomNumber: rooms[0].roomNumber,
          roomTypeName: rooms[0].roomType.name,
          primaryImageUrl: rooms[0].images[0].url
        },
        checkInDate: '2026-08-10',
        checkOutDate: '2026-08-12',
        expectedCheckInAt: '2026-08-10T14:00:00+05:30',
        expectedCheckOutAt: '2026-08-12T11:00:00+05:30',
        adults: 2,
        children: 0,
        guestCount: 2,
        numberOfNights: 2,
        status: 'CHECKED_IN',
        basePricePerNight: 4500,
        appliedPricePerNight: 4500,
        roomAmount: 9000,
        taxAmount: 1080,
        serviceFee: 450,
        discountAmount: 0,
        totalAmount: 10530,
        currency: 'INR',
        guestName: 'Guest User',
        guestEmail: 'guest@example.com',
        guestPhone: '9876543210',
        createdAt: '2026-08-10T10:00:00+05:30',
        updatedAt: '2026-08-10T10:00:00+05:30'
      }
    ];
  }

  private getFallbackPasscodes(): RoomPasscode[] {
    return [
      {
        id: 1,
        bookingId: 1,
        bookingReference: 'BK-20260810-0001',
        roomId: 1,
        roomNumber: '101',
        userId: 1,
        passcode: '123456',
        maskedPasscode: '******',
        status: 'ACTIVE',
        validFrom: '2026-08-10T14:00:00+05:30',
        validUntil: '2026-08-12T11:00:00+05:30',
        failedAttempts: 0,
        maxAllowedAttempts: 5,
        createdAt: '2026-08-10T10:00:00+05:30',
        updatedAt: '2026-08-10T10:00:00+05:30'
      }
    ];
  }

  private getFallbackSettings(): HotelSettings {
    return {
      hotelName: 'SmartStay Grand Resort & Spa',
      tagline: 'Luxury Living & Digital Hospitality',
      email: 'concierge@smartstay.com',
      phone: '+91 98765 43210',
      address: '100 Ocean Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      currency: 'INR',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      taxPercentage: 12.0,
      serviceFeePercentage: 5.0,
      policyText: 'Free cancellation up to 48 hours prior to check-in.'
    };
  }

  private getFallbackDatabase(): MockDatabase {
    return {
      users: this.getFallbackUsers(),
      roomTypes: this.getFallbackRoomTypes(),
      rooms: this.getFallbackRooms(),
      bookings: this.getFallbackBookings(),
      payments: [],
      passcodes: this.getFallbackPasscodes(),
      serviceRequests: [],
      chatThreads: [],
      notifications: [],
      feedback: [],
      hotelSettings: this.getFallbackSettings()
    };
  }

  public nextId<T extends { id: number }>(items: T[]): number {
    return items.length === 0 ? 1 : Math.max(...items.map(item => item.id)) + 1;
  }
}
