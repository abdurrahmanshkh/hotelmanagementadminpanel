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
    if (this.isLoaded && this.db$.value) {
      return of(this.db$.value);
    }

    const saved = localStorage.getItem(STORAGE_KEYS.mockDatabase);
    if (saved) {
      try {
        const parsed: MockDatabase = JSON.parse(saved);
        this.db$.next(parsed);
        this.isLoaded = true;
        return of(parsed);
      } catch (e) {
        console.warn('Failed to parse saved mock DB, re-seeding from JSON files.', e);
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
      users: this.http.get<MockUserRecord[]>('assets/mock-data/users.json'),
      roomTypes: this.http.get<RoomType[]>('assets/mock-data/room-types.json'),
      rooms: this.http.get<Room[]>('assets/mock-data/rooms.json'),
      bookings: this.http.get<Booking[]>('assets/mock-data/bookings.json'),
      payments: this.http.get<Payment[]>('assets/mock-data/payments.json'),
      passcodes: this.http.get<RoomPasscode[]>('assets/mock-data/passcodes.json'),
      serviceRequests: this.http.get<ServiceRequest[]>('assets/mock-data/service-requests.json'),
      chatThreads: this.http.get<ChatThread[]>('assets/mock-data/chat-threads.json'),
      notifications: this.http.get<Notification[]>('assets/mock-data/notifications.json'),
      feedback: this.http.get<Feedback[]>('assets/mock-data/feedback.json'),
      hotelSettings: this.http.get<HotelSettings>('assets/mock-data/hotel-settings.json')
    }).pipe(
      catchError(err => {
        console.error('Error loading mock seed files:', err);
        return of(this.getFallbackDatabase());
      })
    );
  }

  public getSnapshot(): MockDatabase {
    return this.db$.value || this.getFallbackDatabase();
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

  private getFallbackDatabase(): MockDatabase {
    return {
      users: [],
      roomTypes: [],
      rooms: [],
      bookings: [],
      payments: [],
      passcodes: [],
      serviceRequests: [],
      chatThreads: [],
      notifications: [],
      feedback: [],
      hotelSettings: {
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
      }
    };
  }

  public nextId<T extends { id: number }>(items: T[]): number {
    return items.length === 0 ? 1 : Math.max(...items.map(item => item.id)) + 1;
  }
}
