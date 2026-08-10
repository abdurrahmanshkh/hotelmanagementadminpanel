import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
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
} from './contracts';
import {
  MockAuthRepository,
  MockDashboardRepository,
  MockBookingRepository,
  MockGuestRepository,
  MockServiceRequestRepository,
  MockChatRepository,
  MockRoomRepository,
  MockCleaningRepository,
  MockMaintenanceRepository,
  MockPaymentRepository,
  MockPricingRepository,
  MockReportRepository,
  MockSettingsRepository
} from './mock';
import {
  ApiAuthRepository,
  ApiDashboardRepository,
  ApiBookingRepository,
  ApiGuestRepository,
  ApiServiceRequestRepository,
  ApiChatRepository,
  ApiRoomRepository,
  ApiCleaningRepository,
  ApiMaintenanceRepository,
  ApiPaymentRepository,
  ApiPricingRepository,
  ApiReportRepository,
  ApiSettingsRepository
} from './api';

export const REPOSITORY_PROVIDERS: Provider[] = [
  {
    provide: AuthRepository,
    useClass: environment.useMockApi ? MockAuthRepository : ApiAuthRepository
  },
  {
    provide: DashboardRepository,
    useClass: environment.useMockApi ? MockDashboardRepository : ApiDashboardRepository
  },
  {
    provide: BookingRepository,
    useClass: environment.useMockApi ? MockBookingRepository : ApiBookingRepository
  },
  {
    provide: GuestRepository,
    useClass: environment.useMockApi ? MockGuestRepository : ApiGuestRepository
  },
  {
    provide: ServiceRequestRepository,
    useClass: environment.useMockApi ? MockServiceRequestRepository : ApiServiceRequestRepository
  },
  {
    provide: ChatRepository,
    useClass: environment.useMockApi ? MockChatRepository : ApiChatRepository
  },
  {
    provide: RoomRepository,
    useClass: environment.useMockApi ? MockRoomRepository : ApiRoomRepository
  },
  {
    provide: CleaningRepository,
    useClass: environment.useMockApi ? MockCleaningRepository : ApiCleaningRepository
  },
  {
    provide: MaintenanceRepository,
    useClass: environment.useMockApi ? MockMaintenanceRepository : ApiMaintenanceRepository
  },
  {
    provide: PaymentRepository,
    useClass: environment.useMockApi ? MockPaymentRepository : ApiPaymentRepository
  },
  {
    provide: PricingRepository,
    useClass: environment.useMockApi ? MockPricingRepository : ApiPricingRepository
  },
  {
    provide: ReportRepository,
    useClass: environment.useMockApi ? MockReportRepository : ApiReportRepository
  },
  {
    provide: SettingsRepository,
    useClass: environment.useMockApi ? MockSettingsRepository : ApiSettingsRepository
  }
];
