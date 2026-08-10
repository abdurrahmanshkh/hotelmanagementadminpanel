import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';

import { AuthRepository } from './contracts/auth.repository';
import { RoomRepository } from './contracts/room.repository';
import { BookingRepository } from './contracts/booking.repository';
import { PaymentRepository } from './contracts/payment.repository';
import { PasscodeRepository } from './contracts/passcode.repository';
import { ServiceRequestRepository } from './contracts/service-request.repository';
import { ChatRepository } from './contracts/chat.repository';
import { NotificationRepository } from './contracts/notification.repository';
import { FeedbackRepository } from './contracts/feedback.repository';

import { MockAuthRepository } from './mock/mock-auth.repository';
import { MockRoomRepository } from './mock/mock-room.repository';
import { MockBookingRepository } from './mock/mock-booking.repository';
import { MockPaymentRepository } from './mock/mock-payment.repository';
import { MockPasscodeRepository } from './mock/mock-passcode.repository';
import { MockServiceRequestRepository } from './mock/mock-service-request.repository';
import { MockChatRepository } from './mock/mock-chat.repository';
import { MockNotificationRepository } from './mock/mock-notification.repository';
import { MockFeedbackRepository } from './mock/mock-feedback.repository';

import { ApiAuthRepository } from './api/api-auth.repository';
import { ApiRoomRepository } from './api/api-room.repository';
import { ApiBookingRepository } from './api/api-booking.repository';
import { ApiPaymentRepository } from './api/api-payment.repository';
import { ApiPasscodeRepository } from './api/api-passcode.repository';
import { ApiServiceRequestRepository } from './api/api-service-request.repository';
import { ApiChatRepository } from './api/api-chat.repository';
import { ApiNotificationRepository } from './api/api-notification.repository';
import { ApiFeedbackRepository } from './api/api-feedback.repository';

export const provideSmartStayRepositories = (): Provider[] => [
  {
    provide: AuthRepository,
    useClass: environment.useMockApi ? MockAuthRepository : ApiAuthRepository
  },
  {
    provide: RoomRepository,
    useClass: environment.useMockApi ? MockRoomRepository : ApiRoomRepository
  },
  {
    provide: BookingRepository,
    useClass: environment.useMockApi ? MockBookingRepository : ApiBookingRepository
  },
  {
    provide: PaymentRepository,
    useClass: environment.useMockApi ? MockPaymentRepository : ApiPaymentRepository
  },
  {
    provide: PasscodeRepository,
    useClass: environment.useMockApi ? MockPasscodeRepository : ApiPasscodeRepository
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
    provide: NotificationRepository,
    useClass: environment.useMockApi ? MockNotificationRepository : ApiNotificationRepository
  },
  {
    provide: FeedbackRepository,
    useClass: environment.useMockApi ? MockFeedbackRepository : ApiFeedbackRepository
  }
];
