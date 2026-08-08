import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin, throwError } from 'rxjs';
import { map, delay, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { STORAGE_KEYS } from '../constants';
import {
  AdminUser,
  GuestDetails,
  RoomType,
  Amenity,
  RoomDetails,
  BookingDetails,
  PaymentDetails,
  RefundRecord,
  ServiceRequest,
  ChatThread,
  CleaningTask,
  MaintenanceRecord,
  PricingRule,
  HotelSettings
} from '../models';

export interface AdminMockDatabase {
  schemaVersion: string;
  adminUsers: AdminUser[];
  users: GuestDetails[];
  roomTypes: RoomType[];
  amenities: Amenity[];
  rooms: RoomDetails[];
  bookings: BookingDetails[];
  payments: PaymentDetails[];
  refunds: RefundRecord[];
  serviceRequests: ServiceRequest[];
  chatThreads: ChatThread[];
  notifications: any[];
  cleaningTasks: CleaningTask[];
  maintenanceRecords: MaintenanceRecord[];
  pricingRules: PricingRule[];
  priceSnapshots: any[];
  hotelSettings: HotelSettings;
}

const CURRENT_SCHEMA_VERSION = '1.0.0';

@Injectable({
  providedIn: 'root'
})
export class MockDatabaseService {
  private http = inject(HttpClient);
  private db$ = new BehaviorSubject<AdminMockDatabase | null>(null);
  private isInitializing = false;

  constructor() {
    this.initDatabaseFromStorageOrSeed().subscribe();
  }

  public ensureInitialized(): Observable<AdminMockDatabase> {
    if (this.db$.value) {
      return of(this.db$.value);
    }
    return this.initDatabaseFromStorageOrSeed();
  }

  public getDatabase(): AdminMockDatabase {
    const db = this.db$.value;
    if (!db) {
      const stored = localStorage.getItem(STORAGE_KEYS.MOCK_DB);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as AdminMockDatabase;
          this.db$.next(parsed);
          return parsed;
        } catch (e) {
          console.error('Failed to parse mock database from localStorage', e);
        }
      }
      throw new Error('Mock database not initialized yet.');
    }
    return db;
  }

  public saveDatabase(db: AdminMockDatabase): void {
    db.schemaVersion = CURRENT_SCHEMA_VERSION;
    localStorage.setItem(STORAGE_KEYS.MOCK_DB, JSON.stringify(db));
    this.db$.next(db);
  }

  public resetToSeedData(): Observable<AdminMockDatabase> {
    localStorage.removeItem(STORAGE_KEYS.MOCK_DB);
    this.db$.next(null);
    return this.fetchAndSeedDatabase();
  }

  public select<T>(projectFn: (db: AdminMockDatabase) => T): Observable<T> {
    return this.ensureInitialized().pipe(
      delay(environment.mockDelayMs || 500),
      map(db => projectFn(db))
    );
  }

  public mutate(mutationFn: (db: AdminMockDatabase) => void): Observable<AdminMockDatabase> {
    return this.ensureInitialized().pipe(
      delay(environment.mockDelayMs || 500),
      map(db => {
        const dbCopy: AdminMockDatabase = JSON.parse(JSON.stringify(db));
        mutationFn(dbCopy);
        this.saveDatabase(dbCopy);
        return dbCopy;
      })
    );
  }

  private initDatabaseFromStorageOrSeed(): Observable<AdminMockDatabase> {
    const rawData = localStorage.getItem(STORAGE_KEYS.MOCK_DB);
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData) as AdminMockDatabase;
        if (parsed && parsed.schemaVersion === CURRENT_SCHEMA_VERSION) {
          this.db$.next(parsed);
          return of(parsed);
        }
      } catch (err) {
        console.warn('Invalid mock database in storage, re-seeding...', err);
      }
    }
    return this.fetchAndSeedDatabase();
  }

  private fetchAndSeedDatabase(): Observable<AdminMockDatabase> {
    const path = environment.mockDataPath || 'assets/mock-data';
    return forkJoin({
      adminUsers: this.http.get<AdminUser[]>(`${path}/admin-users.json`),
      users: this.http.get<GuestDetails[]>(`${path}/users.json`),
      roomTypes: this.http.get<RoomType[]>(`${path}/room-types.json`),
      rooms: this.http.get<RoomDetails[]>(`${path}/rooms.json`),
      bookings: this.http.get<BookingDetails[]>(`${path}/bookings.json`),
      payments: this.http.get<PaymentDetails[]>(`${path}/payments.json`),
      refunds: this.http.get<RefundRecord[]>(`${path}/refunds.json`),
      serviceRequests: this.http.get<ServiceRequest[]>(`${path}/service-requests.json`),
      chatThreads: this.http.get<ChatThread[]>(`${path}/chat-threads.json`),
      notifications: this.http.get<any[]>(`${path}/notifications.json`),
      cleaningTasks: this.http.get<CleaningTask[]>(`${path}/cleaning-tasks.json`),
      maintenanceRecords: this.http.get<MaintenanceRecord[]>(`${path}/maintenance-records.json`),
      pricingRules: this.http.get<PricingRule[]>(`${path}/pricing-rules.json`),
      priceSnapshots: this.http.get<any[]>(`${path}/price-snapshots.json`),
      hotelSettings: this.http.get<HotelSettings>(`${path}/hotel-settings.json`)
    }).pipe(
      map(seed => {
        // Extract unique amenities from roomTypes for standalone amenities collection
        const amenityMap = new Map<number, Amenity>();
        seed.roomTypes.forEach(rt => {
          if (rt.amenities) {
            rt.amenities.forEach(a => amenityMap.set(a.id, a));
          }
        });

        const db: AdminMockDatabase = {
          schemaVersion: CURRENT_SCHEMA_VERSION,
          adminUsers: seed.adminUsers || [],
          users: seed.users || [],
          roomTypes: seed.roomTypes || [],
          amenities: Array.from(amenityMap.values()),
          rooms: seed.rooms || [],
          bookings: seed.bookings || [],
          payments: seed.payments || [],
          refunds: seed.refunds || [],
          serviceRequests: seed.serviceRequests || [],
          chatThreads: seed.chatThreads || [],
          notifications: seed.notifications || [],
          cleaningTasks: seed.cleaningTasks || [],
          maintenanceRecords: seed.maintenanceRecords || [],
          pricingRules: seed.pricingRules || [],
          priceSnapshots: seed.priceSnapshots || [],
          hotelSettings: seed.hotelSettings
        };
        this.saveDatabase(db);
        return db;
      }),
      catchError(err => {
        console.error('Failed to load mock JSON seed files', err);
        return throwError(() => new Error('Could not load mock seed data. Please check assets/mock-data.'));
      })
    );
  }
}
