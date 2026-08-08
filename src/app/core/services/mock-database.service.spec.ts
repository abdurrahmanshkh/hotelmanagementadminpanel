import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MockDatabaseService } from './mock-database.service';
import { STORAGE_KEYS } from '../constants';
import { environment } from '../../../environments/environment';

describe('MockDatabaseService', () => {
  let service: MockDatabaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEYS.MOCK_DB);
    TestBed.configureTestingModule({
      providers: [
        MockDatabaseService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MockDatabaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem(STORAGE_KEYS.MOCK_DB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize database from seed files if storage is empty', (done) => {
    service.ensureInitialized().subscribe(db => {
      expect(db).toBeTruthy();
      expect(db.adminUsers.length).toBe(1);
      expect(db.hotelSettings.hotelName).toBe('Test Hotel');
      expect(localStorage.getItem(STORAGE_KEYS.MOCK_DB)).toBeTruthy();
      done();
    });

    const path = environment.mockDataPath || 'assets/mock-data';
    httpMock.expectOne(`${path}/admin-users.json`).flush([{ id: 1, email: 'admin@test.com' }]);
    httpMock.expectOne(`${path}/users.json`).flush([]);
    httpMock.expectOne(`${path}/room-types.json`).flush([]);
    httpMock.expectOne(`${path}/rooms.json`).flush([]);
    httpMock.expectOne(`${path}/bookings.json`).flush([]);
    httpMock.expectOne(`${path}/payments.json`).flush([]);
    httpMock.expectOne(`${path}/refunds.json`).flush([]);
    httpMock.expectOne(`${path}/service-requests.json`).flush([]);
    httpMock.expectOne(`${path}/chat-threads.json`).flush([]);
    httpMock.expectOne(`${path}/notifications.json`).flush([]);
    httpMock.expectOne(`${path}/cleaning-tasks.json`).flush([]);
    httpMock.expectOne(`${path}/maintenance-records.json`).flush([]);
    httpMock.expectOne(`${path}/pricing-rules.json`).flush([]);
    httpMock.expectOne(`${path}/price-snapshots.json`).flush([]);
    httpMock.expectOne(`${path}/hotel-settings.json`).flush({ id: 1, hotelName: 'Test Hotel' });
  });

  it('should mutate database and persist changes to localStorage', (done) => {
    const mockDb = {
      schemaVersion: '1.0.0',
      adminUsers: [],
      users: [],
      roomTypes: [],
      amenities: [],
      rooms: [],
      bookings: [],
      payments: [],
      refunds: [],
      serviceRequests: [],
      chatThreads: [],
      notifications: [],
      cleaningTasks: [],
      maintenanceRecords: [],
      pricingRules: [],
      priceSnapshots: [],
      hotelSettings: { id: 1, hotelName: 'Initial Hotel' } as any
    };
    service.saveDatabase(mockDb);

    service.mutate(db => {
      db.hotelSettings.hotelName = 'Updated Hotel';
    }).subscribe(updated => {
      expect(updated.hotelSettings.hotelName).toBe('Updated Hotel');
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOCK_DB)!);
      expect(stored.hotelSettings.hotelName).toBe('Updated Hotel');
      done();
    });
  });
});
