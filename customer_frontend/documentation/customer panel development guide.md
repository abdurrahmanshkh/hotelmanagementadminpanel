# **SmartStay Customer Frontend Development Specification**

This document is the implementation guide for **Abdur Rehman Shaikh**, who will develop the complete SmartStay customer-facing Angular application. It defines the architecture, routes, models, mock-data system, API integration layer, UI requirements, validation, testing strategy, and handoff contract needed to build the frontend independently before Rohit’s Spring Boot APIs are ready.

The most important design requirement is:

> Every customer feature must work in both **Mock Mode** and **API Mode** without changing page components. Components must call repository or facade services, never access JSON files or `HttpClient` directly.

---

# **1\. Project Identity**

## **1.1 Application details**

* **Application name:** SmartStay  
* **Project folder:** `smartstay-customer-frontend`  
* **Framework:** Angular  
* **Language:** TypeScript  
* **Styling:** SCSS  
* **Application type:** Standalone Angular application  
* **Package manager:** npm  
* **Default development port:** `4200`  
* **Backend base URL:** `http://localhost:8080/api/v1`  
* **Currency:** INR  
* **Time zone:** Asia/Kolkata  
* **Primary role supported:** `CUSTOMER`  
* **Mock data location:** `src/assets/mock-data`  
* **Image sources:** Unsplash image URLs stored in mock data

Use the current Angular CLI version available through the company environment rather than forcing a version from an old tutorial. Standalone components simplify application structure because components can declare their dependencies directly without requiring feature `NgModule` files. [\[angular.io\]](https://angular.io/guide/standalone-components)

Angular recommends functional HTTP interceptors because their behavior is more predictable in complex applications. SmartStay should use functional interceptors for authentication, errors, loading state, and optional request logging. [\[angular.dev\]](https://angular.dev/guide/http/interceptors)

---

# **2\. Frontend Responsibilities**

The customer frontend is responsible for:

1. Public landing page  
2. Hotel and room presentation  
3. Room searching and filtering  
4. Room-detail display  
5. Customer registration  
6. Customer login and logout  
7. Customer profile management  
8. Room availability search  
9. Booking form and guest details  
10. Booking quote display  
11. Dummy payment interface  
12. Booking confirmation  
13. Customer booking management  
14. Room passcode display  
15. Room-access simulation page  
16. Service-request creation and tracking  
17. Keyword-based chatbot behavior  
18. String similarity matching  
19. Chat escalation to an administrator  
20. Customer-admin message display  
21. Notifications  
22. Feedback submission  
23. Responsive navigation  
24. Loading, empty, success, and error states  
25. Frontend form validation  
26. Mock-data operation without Spring Boot  
27. API integration without rewriting components  
28. Accessible and responsive presentation  
29. Animations and transitions  
30. Unsplash room and hotel imagery

---

# **3\. Important Security Boundary**

The frontend may perform calculations and validation for immediate user feedback, but it must not be considered authoritative for:

* Authentication  
* User role  
* Room availability  
* Final booking price  
* Booking ownership  
* Payment success  
* Refund amount  
* Passcode creation  
* Passcode validity  
* Permission checks  
* Booking status transitions

When API Mode is enabled, the backend response wins even if it differs from a frontend preview.

For example:

Frontend preview: INR 11,583  
Backend final quote: INR 11,700

Display the backend value: INR 11,700

Frontend validation improves the experience, but backend validation protects the system.

---

# **4\. Create the Angular Project**

## **4.1 Prerequisites**

Install:

* Node.js version supported by the selected Angular version  
* npm  
* Angular CLI  
* Visual Studio Code or another permitted editor

Check installations:

node \--version  
npm \--version  
ng version

Install Angular CLI if needed:

npm install \-g @angular/cli

## **4.2 Create the application**

ng new smartstay-customer-frontend \\  
  \--standalone \\  
  \--routing \\  
  \--style=scss \\  
  \--strict

Move into the application:

cd smartstay-customer-frontend

Run it:

npm install  
ng serve

Open:

http://localhost:4200

## **4.3 Recommended dependencies**

Use Angular’s built-in features wherever possible. Add third-party dependencies only when they provide clear value.

Suggested packages:

npm install lucide-angular  
npm install date-fns

Optional UI packages:

npm install @angular/cdk

Avoid installing multiple overlapping UI systems. Do not combine Angular Material, Bootstrap, Tailwind, and custom SCSS in the same project unless there is a strong reason.

For maximum visual control, use:

* Angular standalone components  
* SCSS  
* CSS custom properties  
* Angular CDK only where useful  
* Lucide icons  
* Native CSS transitions  
* Angular router view transitions if supported by the chosen version

---

# **5\. Required Project Structure**

smartstay-customer-frontend/  
├── angular.json  
├── package.json  
├── package-lock.json  
├── README.md  
├── API\_CHANGE\_LOG.txt  
├── VERSION.txt  
├── docs/  
│   ├── CUSTOMER\_ROUTES.md  
│   ├── MOCK\_MODE.md  
│   ├── API\_INTEGRATION.md  
│   ├── TEST\_SCENARIOS.md  
│   └── UI\_GUIDELINES.md  
├── public/  
│   ├── favicon.ico  
│   └── smartstay-logo.svg  
├── src/  
│   ├── index.html  
│   ├── main.ts  
│   ├── styles.scss  
│   ├── environments/  
│   │   ├── environment.ts  
│   │   ├── environment.mock.ts  
│   │   └── environment.production.ts  
│   ├── assets/  
│   │   ├── images/  
│   │   │   ├── logo/  
│   │   │   ├── placeholders/  
│   │   │   └── illustrations/  
│   │   ├── icons/  
│   │   └── mock-data/  
│   │       ├── users.json  
│   │       ├── room-types.json  
│   │       ├── rooms.json  
│   │       ├── bookings.json  
│   │       ├── payments.json  
│   │       ├── passcodes.json  
│   │       ├── service-requests.json  
│   │       ├── chat-threads.json  
│   │       ├── notifications.json  
│   │       ├── feedback.json  
│   │       ├── pricing-rules.json  
│   │       ├── hotel-settings.json  
│   │       └── chatbot-knowledge.json  
│   └── app/  
│       ├── app.component.ts  
│       ├── app.component.html  
│       ├── app.component.scss  
│       ├── app.config.ts  
│       ├── app.routes.ts  
│       ├── core/  
│       │   ├── constants/  
│       │   │   ├── api-endpoints.constants.ts  
│       │   │   ├── app.constants.ts  
│       │   │   ├── routes.constants.ts  
│       │   │   └── storage-keys.constants.ts  
│       │   ├── enums/  
│       │   ├── guards/  
│       │   │   ├── auth.guard.ts  
│       │   │   ├── guest.guard.ts  
│       │   │   └── pending-changes.guard.ts  
│       │   ├── interceptors/  
│       │   │   ├── auth.interceptor.ts  
│       │   │   ├── error.interceptor.ts  
│       │   │   ├── loading.interceptor.ts  
│       │   │   └── mock-delay.interceptor.ts  
│       │   ├── models/  
│       │   │   ├── common.models.ts  
│       │   │   ├── auth.models.ts  
│       │   │   ├── user.models.ts  
│       │   │   ├── room.models.ts  
│       │   │   ├── booking.models.ts  
│       │   │   ├── payment.models.ts  
│       │   │   ├── passcode.models.ts  
│       │   │   ├── service-request.models.ts  
│       │   │   ├── chat.models.ts  
│       │   │   ├── notification.models.ts  
│       │   │   ├── feedback.models.ts  
│       │   │   └── hotel-settings.models.ts  
│       │   ├── repositories/  
│       │   │   ├── contracts/  
│       │   │   ├── api/  
│       │   │   ├── mock/  
│       │   │   └── repository.providers.ts  
│       │   ├── services/  
│       │   │   ├── auth-state.service.ts  
│       │   │   ├── storage.service.ts  
│       │   │   ├── loading.service.ts  
│       │   │   ├── toast.service.ts  
│       │   │   ├── confirmation.service.ts  
│       │   │   ├── mock-database.service.ts  
│       │   │   ├── pricing-calculator.service.ts  
│       │   │   └── chatbot-engine.service.ts  
│       │   ├── tokens/  
│       │   │   ├── repository.tokens.ts  
│       │   │   └── config.tokens.ts  
│       │   ├── validators/  
│       │   │   ├── password.validator.ts  
│       │   │   ├── password-match.validator.ts  
│       │   │   ├── date-range.validator.ts  
│       │   │   ├── phone.validator.ts  
│       │   │   ├── government-id.validator.ts  
│       │   │   └── guest-capacity.validator.ts  
│       │   └── utilities/  
│       │       ├── date.utils.ts  
│       │       ├── money.utils.ts  
│       │       ├── string-match.utils.ts  
│       │       └── booking.utils.ts  
│       ├── layout/  
│       │   ├── public-layout/  
│       │   ├── customer-layout/  
│       │   ├── header/  
│       │   ├── footer/  
│       │   ├── mobile-navigation/  
│       │   └── account-sidebar/  
│       ├── shared/  
│       │   ├── components/  
│       │   │   ├── button/  
│       │   │   ├── form-field/  
│       │   │   ├── password-strength/  
│       │   │   ├── room-card/  
│       │   │   ├── booking-card/  
│       │   │   ├── status-badge/  
│       │   │   ├── price-summary/  
│       │   │   ├── image-gallery/  
│       │   │   ├── rating-stars/  
│       │   │   ├── pagination/  
│       │   │   ├── confirmation-dialog/  
│       │   │   ├── toast-container/  
│       │   │   ├── skeleton-loader/  
│       │   │   ├── empty-state/  
│       │   │   ├── error-state/  
│       │   │   └── chatbot-widget/  
│       │   ├── directives/  
│       │   └── pipes/  
│       └── features/  
│           ├── home/  
│           ├── about/  
│           ├── contact/  
│           ├── authentication/  
│           │   ├── login/  
│           │   ├── register/  
│           │   └── forgot-password/  
│           ├── rooms/  
│           │   ├── room-list/  
│           │   ├── room-details/  
│           │   ├── room-filters/  
│           │   └── availability-search/  
│           ├── booking/  
│           │   ├── booking-form/  
│           │   ├── booking-review/  
│           │   ├── payment/  
│           │   └── booking-confirmation/  
│           ├── account/  
│           │   ├── dashboard/  
│           │   ├── profile/  
│           │   ├── bookings/  
│           │   ├── booking-details/  
│           │   ├── passcode/  
│           │   ├── service-requests/  
│           │   ├── notifications/  
│           │   ├── chats/  
│           │   └── feedback/  
│           └── errors/  
│               ├── not-found/  
│               └── forbidden/  
└── dist/

---

# **6\. Architecture Rules**

## **6.1 Component rule**

A component should:

* Display information  
* Receive user interaction  
* Maintain page-specific UI state  
* Build and validate forms  
* Call repository or facade methods  
* Handle loading, success, empty, and error states

A component should not:

* Use `HttpClient` directly  
* Load JSON files directly  
* Write to `localStorage` directly  
* Calculate authoritative prices  
* Contain long reusable business algorithms  
* Know whether the app is using mock data or APIs

## **6.2 Repository pattern**

Each feature must define a consistent repository interface.

Example:

export abstract class RoomRepository {  
  abstract getRooms(filters?: RoomSearchFilters): Observable\<Room\[\]\>;  
  abstract getRoomById(roomId: number): Observable\<Room\>;  
  abstract getFeaturedRooms(): Observable\<Room\[\]\>;  
  abstract getAvailability(  
    request: AvailabilityRequest  
  ): Observable\<RoomAvailabilityResult\[\]\>;  
}

Implement it twice:

ApiRoomRepository  
MockRoomRepository

The component injects only:

private readonly roomRepository \= inject(RoomRepository);

It must not inject:

ApiRoomRepository

or:

MockRoomRepository

## **6.3 Why this architecture matters**

Without this separation, pages may become filled with conditions such as:

if (environment.useMockApi) {  
  // load JSON  
} else {  
  // call API  
}

That pattern becomes difficult to maintain. The repository provider should select the implementation once for the entire application.

---

# **7\. Mock Mode and API Mode**

## **7.1 Environment configuration**

Development environment:

export const environment \= {  
  production: false,  
  useMockApi: true,  
  apiBaseUrl: 'http://localhost:8080/api/v1',  
  mockDataPath: 'assets/mock-data',  
  mockDelayMs: 500,  
  enableMockPersistence: true,  
  chatPollingIntervalMs: 5000,  
  currency: 'INR',  
  timezone: 'Asia/Kolkata'  
};

API environment:

export const environment \= {  
  production: false,  
  useMockApi: false,  
  apiBaseUrl: 'http://localhost:8080/api/v1',  
  mockDataPath: 'assets/mock-data',  
  mockDelayMs: 0,  
  enableMockPersistence: false,  
  chatPollingIntervalMs: 5000,  
  currency: 'INR',  
  timezone: 'Asia/Kolkata'  
};

Production environment:

export const environment \= {  
  production: true,  
  useMockApi: false,  
  apiBaseUrl: '/api/v1',  
  mockDataPath: 'assets/mock-data',  
  mockDelayMs: 0,  
  enableMockPersistence: false,  
  chatPollingIntervalMs: 5000,  
  currency: 'INR',  
  timezone: 'Asia/Kolkata'  
};

## **7.2 Build configurations**

Add configurations in `angular.json` so the application can be run explicitly in either mode.

Commands should be:

ng serve \--configuration=mock  
ng serve \--configuration=development  
ng build \--configuration=production

Recommended meaning:

mock        \-\> JSON data, local persistence, no Spring Boot  
development \-\> Spring Boot at localhost:8080  
production  \-\> deployed API

## **7.3 Repository provider selection**

export const provideSmartStayRepositories \= (): Provider\[\] \=\> \[  
  {  
    provide: AuthRepository,  
    useClass: environment.useMockApi  
      ? MockAuthRepository  
      : ApiAuthRepository  
  },  
  {  
    provide: RoomRepository,  
    useClass: environment.useMockApi  
      ? MockRoomRepository  
      : ApiRoomRepository  
  },  
  {  
    provide: BookingRepository,  
    useClass: environment.useMockApi  
      ? MockBookingRepository  
      : ApiBookingRepository  
  },  
  {  
    provide: PaymentRepository,  
    useClass: environment.useMockApi  
      ? MockPaymentRepository  
      : ApiPaymentRepository  
  },  
  {  
    provide: ServiceRequestRepository,  
    useClass: environment.useMockApi  
      ? MockServiceRequestRepository  
      : ApiServiceRequestRepository  
  },  
  {  
    provide: ChatRepository,  
    useClass: environment.useMockApi  
      ? MockChatRepository  
      : ApiChatRepository  
  }  
\];

Register these providers in `app.config.ts`.

---

# **8\. Mock Database Design**

Static JSON files alone cannot save changes. A booking created against a JSON file disappears when the page reloads unless a persistence mechanism is added.

Use a three-layer mock database:

Seed JSON files  
      ↓  
MockDatabaseService  
      ↓  
localStorage runtime database

## **8.1 Startup behavior**

When Mock Mode starts:

1. Check whether a SmartStay mock database exists in `localStorage`.  
2. If it exists, load saved mock state.  
3. If it does not exist, load seed JSON files.  
4. Combine them into one `MockDatabase`.  
5. Save that database into `localStorage`.  
6. Mock repositories read and update this stored database.

## **8.2 Mock database interface**

export interface MockDatabase {  
  users: User\[\];  
  roomTypes: RoomType\[\];  
  rooms: Room\[\];  
  bookings: Booking\[\];  
  payments: Payment\[\];  
  passcodes: RoomPasscode\[\];  
  serviceRequests: ServiceRequest\[\];  
  chatThreads: ChatThread\[\];  
  notifications: Notification\[\];  
  feedback: Feedback\[\];  
  pricingRules: PricingRule\[\];  
  hotelSettings: HotelSettings;  
}

## **8.3 Storage keys**

export const STORAGE\_KEYS \= {  
  accessToken: 'smartstay\_access\_token',  
  authenticatedUser: 'smartstay\_authenticated\_user',  
  mockDatabase: 'smartstay\_mock\_database\_v1',  
  mockDatabaseVersion: 'smartstay\_mock\_database\_version',  
  pendingBooking: 'smartstay\_pending\_booking',  
  selectedLanguage: 'smartstay\_language'  
} as const;

## **8.4 Reset test data**

Provide a development-only button:

Reset Sample Data

It should:

1. Clear the mock database key.  
2. Clear mock authentication.  
3. Reload JSON seed data.  
4. Return the user to the landing page.  
5. Show a success message.

Do not display this button in production.

## **8.5 ID generation**

Mock repositories need predictable ID generation:

function nextId(items: { id: number }\[\]): number {  
  return items.length \=== 0  
    ? 1  
    : Math.max(...items.map(item \=\> item.id)) \+ 1;  
}

Public references can be generated as:

Booking: BK-20260803-0005  
Payment: PAY-20260803-0005  
Request: SR-20260803-0005  
Chat: CHAT-20260803-0005

Use a reusable reference generator service.

---

# **9\. API Response Models**

All mock repositories must return data in the same wrapper used by the Spring Boot API.

export interface ApiResponse\<T\> {  
  success: boolean;  
  message: string;  
  data: T;  
  timestamp: string;  
}

Paginated response:

export interface PageData\<T\> {  
  items: T\[\];  
  page: number;  
  size: number;  
  totalItems: number;  
  totalPages: number;  
}

Error response:

export interface ApiError {  
  success: false;  
  code: string;  
  message: string;  
  fieldErrors?: Record\<string, string\>;  
  path?: string;  
  timestamp: string;  
  traceId?: string;  
}

Mock errors must use the same codes expected from Spring Boot.

Examples:

AUTH\_INVALID\_CREDENTIALS  
EMAIL\_ALREADY\_EXISTS  
ROOM\_NOT\_FOUND  
ROOM\_NOT\_AVAILABLE  
BOOKING\_DATE\_CONFLICT  
BOOKING\_NOT\_FOUND  
INVALID\_BOOKING\_STATUS  
PAYMENT\_FAILED  
PAYMENT\_ALREADY\_COMPLETED  
PASSCODE\_NOT\_ACTIVE  
SERVICE\_REQUEST\_NOT\_ALLOWED  
CHAT\_THREAD\_CLOSED  
FORBIDDEN

---

# **10\. Core TypeScript Models**

## **10.1 Common enums**

export type UserRole \=  
  | 'CUSTOMER'  
  | 'STAFF'  
  | 'ADMIN'  
  | 'MANAGER';

export type BookingStatus \=  
  | 'PENDING\_PAYMENT'  
  | 'CONFIRMED'  
  | 'CHECKED\_IN'  
  | 'COMPLETED'  
  | 'CANCELLED';

export type RoomStatus \=  
  | 'AVAILABLE'  
  | 'RESERVED'  
  | 'OCCUPIED'  
  | 'UNDER\_CLEANING'  
  | 'MAINTENANCE';

export type PaymentStatus \=  
  | 'INITIATED'  
  | 'PENDING'  
  | 'SUCCESS'  
  | 'FAILED'  
  | 'REFUNDED'  
  | 'PARTIALLY\_REFUNDED';

export type PaymentMethod \=  
  | 'CARD'  
  | 'UPI'  
  | 'CASH';

export type PasscodeStatus \=  
  | 'NOT\_GENERATED'  
  | 'NOT\_ACTIVE\_YET'  
  | 'ACTIVE'  
  | 'LOCKED'  
  | 'EXPIRED'  
  | 'REVOKED';

export type ServiceRequestStatus \=  
  | 'PENDING'  
  | 'ACCEPTED'  
  | 'IN\_PROGRESS'  
  | 'COMPLETED'  
  | 'CANCELLED';

export type ChatMode \=  
  | 'BOT'  
  | 'ADMIN';

export type ChatStatus \=  
  | 'OPEN'  
  | 'WAITING\_FOR\_ADMIN'  
  | 'ASSIGNED'  
  | 'RESOLVED'  
  | 'CLOSED';

These names must remain synchronized with the backend contract.

## **10.2 User model**

export interface User {  
  id: number;  
  publicId: string;  
  firstName: string;  
  lastName: string;  
  email: string;  
  phone: string;  
  role: UserRole;  
  dateOfBirth?: string;  
  governmentIdType?: string;  
  governmentIdMasked?: string;  
  active: boolean;  
  createdAt: string;  
  updatedAt: string;  
}

The normal model must not contain `password`.

For Mock Mode only, use a separate private seed type:

export interface MockUserRecord extends User {  
  mockPassword: string;  
}

Never display or expose `mockPassword` through component models.

## **10.3 Room model**

export interface RoomType {  
  id: number;  
  name: string;  
  code: string;  
  description: string;  
  basePrice: number;  
  minimumPrice: number;  
  maximumPrice: number;  
  maximumAdults: number;  
  maximumChildren: number;  
  bedType: string;  
  roomSizeSqft: number;  
  active: boolean;  
}

export interface RoomImage {  
  url: string;  
  altText: string;  
  displayOrder: number;  
}

export interface Room {  
  id: number;  
  publicId: string;  
  roomNumber: string;  
  roomType: RoomType;  
  floorNumber: number;  
  status: RoomStatus;  
  description: string;  
  basePrice: number;  
  currentPrice: number;  
  currency: string;  
  maximumAdults: number;  
  maximumChildren: number;  
  rating: number;  
  amenities: string\[\];  
  images: RoomImage\[\];  
  featured: boolean;  
  active: boolean;  
}

## **10.4 Booking model**

export interface Booking {  
  id: number;  
  bookingReference: string;  
  userId: number;  
  room: RoomSummary;  
  checkInDate: string;  
  checkOutDate: string;  
  expectedCheckInAt: string;  
  expectedCheckOutAt: string;  
  actualCheckInAt?: string;  
  actualCheckOutAt?: string;  
  adults: number;  
  children: number;  
  guestCount: number;  
  numberOfNights: number;  
  status: BookingStatus;  
  basePricePerNight: number;  
  appliedPricePerNight: number;  
  roomAmount: number;  
  taxAmount: number;  
  serviceFee: number;  
  discountAmount: number;  
  totalAmount: number;  
  currency: string;  
  specialRequests?: string;  
  cancellationReason?: string;  
  createdAt: string;  
  updatedAt: string;  
}

## **10.5 Quote model**

export interface BookingQuote {  
  quoteId: string;  
  roomId: number;  
  numberOfNights: number;  
  nightlyPrices?: NightlyPrice\[\];  
  basePricePerNight: number;  
  appliedPricePerNight: number;  
  roomAmount: number;  
  taxPercentage: number;  
  taxAmount: number;  
  serviceFeePercentage: number;  
  serviceFee: number;  
  discountAmount: number;  
  totalAmount: number;  
  currency: string;  
  validUntil: string;  
}

---

# **11\. Sample JSON Structure**

## **11.1 Rooms JSON**

`src/assets/mock-data/rooms.json`

\[  
  {  
    "id": 1,  
    "publicId": "RM-101",  
    "roomNumber": "101",  
    "roomType": {  
      "id": 2,  
      "name": "Deluxe",  
      "code": "DELUXE",  
      "description": "A spacious room with premium amenities.",  
      "basePrice": 4500.00,  
      "minimumPrice": 3600.00,  
      "maximumPrice": 6500.00,  
      "maximumAdults": 2,  
      "maximumChildren": 1,  
      "bedType": "King",  
      "roomSizeSqft": 340,  
      "active": true  
    },  
    "floorNumber": 1,  
    "status": "AVAILABLE",  
    "description": "A modern deluxe room with a king-size bed and city view.",  
    "basePrice": 4500.00,  
    "currentPrice": 4950.00,  
    "currency": "INR",  
    "maximumAdults": 2,  
    "maximumChildren": 1,  
    "rating": 4.6,  
    "amenities": \[  
      "Wi-Fi",  
      "Air Conditioning",  
      "Smart TV",  
      "Mini Fridge",  
      "Room Service"  
    \],  
    "images": \[  
      {  
        "url": "https://images.unsplash.com/photo-URL",  
        "altText": "Modern deluxe hotel room",  
        "displayOrder": 1  
      }  
    \],  
    "featured": true,  
    "active": true  
  }  
\]

## **11.2 Bookings JSON**

\[  
  {  
    "id": 1,  
    "bookingReference": "BK-20260803-0001",  
    "userId": 1,  
    "room": {  
      "id": 1,  
      "publicId": "RM-101",  
      "roomNumber": "101",  
      "roomTypeName": "Deluxe",  
      "primaryImageUrl": "https://images.unsplash.com/photo-URL"  
    },  
    "checkInDate": "2026-08-10",  
    "checkOutDate": "2026-08-12",  
    "expectedCheckInAt": "2026-08-10T14:00:00+05:30",  
    "expectedCheckOutAt": "2026-08-12T11:00:00+05:30",  
    "adults": 2,  
    "children": 0,  
    "guestCount": 2,  
    "numberOfNights": 2,  
    "status": "CONFIRMED",  
    "basePricePerNight": 4500.00,  
    "appliedPricePerNight": 4950.00,  
    "roomAmount": 9900.00,  
    "taxAmount": 1188.00,  
    "serviceFee": 495.00,  
    "discountAmount": 0.00,  
    "totalAmount": 11583.00,  
    "currency": "INR",  
    "specialRequests": "Late arrival",  
    "createdAt": "2026-08-03T10:30:00+05:30",  
    "updatedAt": "2026-08-03T10:35:00+05:30"  
  }  
\]

## **11.3 Mock users JSON**

\[  
  {  
    "id": 1,  
    "publicId": "USR-0001",  
    "firstName": "Guest",  
    "lastName": "User",  
    "email": "guest@example.com",  
    "phone": "9876543210",  
    "mockPassword": "Guest@123",  
    "role": "CUSTOMER",  
    "dateOfBirth": "1995-04-18",  
    "governmentIdType": "AADHAAR",  
    "governmentIdMasked": "XXXXXXXX9012",  
    "active": true,  
    "createdAt": "2026-01-01T10:00:00+05:30",  
    "updatedAt": "2026-01-01T10:00:00+05:30"  
  }  
\]

Mock accounts:

guest@example.com  
Guest@123

emily@example.com  
Guest@123

---

# **12\. Application Routes**

## **12.1 Public routes**

/  
 /rooms  
 /rooms/:roomId  
 /about  
 /contact  
 /login  
 /register  
 /forgot-password

## **12.2 Booking routes**

/booking/:roomId  
/booking/:roomId/review  
/booking/:bookingId/payment  
/booking/:bookingId/confirmation

The booking form, review, payment, and confirmation pages require authentication.

If a guest selects a room before logging in:

1. Save the intended URL.  
2. Redirect to `/login`.  
3. Log in successfully.  
4. Return to the original booking route.

## **12.3 Customer account routes**

/account  
/account/profile  
/account/bookings  
/account/bookings/:bookingId  
/account/bookings/:bookingId/passcode  
/account/service-requests  
/account/service-requests/new  
/account/chats  
/account/chats/:threadId  
/account/notifications  
/account/feedback/:bookingId

## **12.4 Error routes**

/forbidden  
/\*\*

Unknown paths should load the not-found page.

## **12.5 Lazy loading**

Feature routes should be lazy-loaded so that the initial landing page bundle remains smaller.

Example:

{  
  path: 'rooms',  
  loadChildren: () \=\>  
    import('./features/rooms/rooms.routes')  
      .then(routes \=\> routes.ROOM\_ROUTES)  
}

---

# **13\. Route Guards**

## **13.1 Authentication guard**

Protected routes require an authenticated customer.

export const authGuard: CanActivateFn \= (\_, state) \=\> {  
  const authState \= inject(AuthStateService);  
  const router \= inject(Router);

  if (authState.isAuthenticated()) {  
    return true;  
  }

  return router.createUrlTree(\['/login'\], {  
    queryParams: { returnUrl: state.url }  
  });  
};

## **13.2 Guest guard**

Authenticated users should not normally reopen login or registration.

/login  
/register

Redirect an already logged-in customer to:

/account

## **13.3 Pending changes guard**

Use it for:

* Registration  
* Booking form  
* Service request form  
* Profile editing

If the form is dirty, show:

You have unsaved changes. Are you sure you want to leave?

Route guards should also be tested, including redirect behavior and protected navigation. Angular provides router testing utilities such as `RouterTestingHarness` for this purpose. [\[angular.dev\]](https://angular.dev/guide/routing/testing)

---

# **14\. Page-by-Page Requirements**

# **14.1 Landing page**

Sections:

1. Responsive header  
2. Hero image or video-style image section  
3. Availability search form  
4. Featured room types  
5. Amenities and hotel highlights  
6. Popular services  
7. Dynamic-pricing promotional section  
8. Guest review summary  
9. Location or contact section  
10. Newsletter-style visual section, without requiring email integration  
11. Footer  
12. Floating chatbot button

Hero search fields:

* Check-in date  
* Checkout date  
* Adults  
* Children  
* Room type, optional  
* Search button

Validation:

* Check-in cannot be before the current date  
* Checkout must be after check-in  
* Adults must be at least one  
* Capacity must use valid ranges

## **14.2 Room listing page**

Features:

* Search criteria summary  
* Desktop filter sidebar  
* Mobile filter drawer  
* Room cards  
* Sorting  
* Pagination  
* Loading skeletons  
* Empty state  
* Error state

Filters:

* Room type  
* Minimum and maximum price  
* Number of guests  
* Bed type  
* Amenities  
* Rating  
* Availability dates

Sorting:

Recommended  
Price: Low to High  
Price: High to Low  
Rating: High to Low  
Capacity

## **14.3 Room details page**

Display:

* Image gallery  
* Room name and number  
* Rating  
* Description  
* Amenities  
* Occupancy limits  
* Bed information  
* Room size  
* Base price  
* Current dynamic price  
* Pricing badge  
* Date selection  
* Price preview  
* Book button  
* Related rooms  
* Feedback summary

Provide meaningful image `alt` text. If an image fails, show a local placeholder.

## **14.4 Login page**

Fields:

* Email  
* Password  
* Show or hide password  
* Remember-me option, if desired  
* Forgot-password link  
* Login button  
* Registration link

Mock login behavior:

1. Find user by normalized email.  
2. Compare `mockPassword`.  
3. Confirm `active` is true.  
4. Create a mock token.  
5. Store a sanitized user object.  
6. Redirect to `returnUrl` or `/account`.

Do not log passwords.

## **14.5 Registration page**

Sections:

* Personal details  
* Contact details  
* Identity details  
* Password  
* Terms acceptance

Fields:

* First name  
* Last name  
* Email  
* Phone  
* Date of birth  
* Government ID type  
* Government ID number  
* Password  
* Confirm password  
* Terms checkbox

Show a live password-strength indicator.

## **14.6 Customer dashboard**

Cards:

* Upcoming booking  
* Active stay  
* Completed stays count  
* Pending requests count  
* Unread notifications  
* Chat waiting for reply

Actions:

* Browse rooms  
* View bookings  
* Request a service  
* View room passcode  
* Open concierge chat

## **14.7 Booking form**

Steps:

1. Stay details  
2. Guest details  
3. Special requests  
4. Review  
5. Payment  
6. Confirmation

Use a visible step indicator.

Do not create a booking until required fields are valid.

## **14.8 Booking review**

Display:

* Room summary  
* Dates  
* Guest count  
* Number of nights  
* Nightly prices  
* Taxes  
* Service fee  
* Discount  
* Total amount  
* Cancellation summary  
* Edit button  
* Proceed-to-payment button

## **14.9 Dummy payment page**

Tabs or options:

* Card  
* UPI  
* Cash, if permitted for the selected booking

Card demonstration fields:

* Cardholder name  
* Dummy card number  
* Expiry  
* CVV

Never save these values.

Convert the form to:

{  
  bookingId: 105,  
  method: 'CARD',  
  dummyPaymentToken: 'tok\_success'  
}

Presentation test shortcuts may be provided:

Success payment  
Failed payment  
Pending payment

They should be visually labeled as test controls and hidden in production.

## **14.10 Booking confirmation**

Display:

* Success animation  
* Booking reference  
* Payment reference  
* Hotel name  
* Room  
* Check-in  
* Checkout  
* Guest count  
* Paid amount  
* View booking button  
* Return home button

Do not display the passcode prematurely if it is not active.

## **14.11 My Bookings**

Tabs:

All  
Upcoming  
Active  
Completed  
Cancelled

Each card shows:

* Booking reference  
* Room  
* Dates  
* Status  
* Amount  
* Primary action  
* Secondary action

Actions vary by state:

PENDING\_PAYMENT \-\> Continue payment, Cancel  
CONFIRMED       \-\> View details, Cancel, View passcode status  
CHECKED\_IN      \-\> View passcode, Request service  
COMPLETED       \-\> View details, Give feedback  
CANCELLED       \-\> View details

## **14.12 Booking details**

Display:

* Booking timeline  
* Room information  
* Guest information  
* Price breakdown  
* Payment information  
* Cancellation information  
* Service requests  
* Passcode status  
* Feedback eligibility

## **14.13 Passcode page**

States:

### **Not generated**

Your room access code has not been generated yet.

### **Not active yet**

Show:

* Activation date and time  
* Expiry date and time  
* Masked code or no code  
* Security information

### **Active**

Show:

* Six-digit code  
* Copy button  
* Remaining validity  
* Room number  
* Security warning

### **Locked**

Show:

* Lock message  
* Retry time  
* Contact-front-desk action

### **Expired**

Show:

* Expired message  
* Checkout details  
* Contact option

Do not place the passcode in the page URL or browser logs.

## **14.14 Service requests**

List:

* Category  
* Title  
* Room  
* Date  
* Priority  
* Status  
* Timeline

New request form:

* Booking  
* Category  
* Title  
* Description  
* Priority

Only confirmed or checked-in bookings should appear as valid choices.

## **14.15 Notifications**

Features:

* Unread badge  
* Read and unread styling  
* Mark one as read  
* Mark all as read  
* Related resource navigation  
* Empty state

## **14.16 Profile**

Editable:

* First name  
* Last name  
* Phone

Read-only:

* Email  
* Role  
* Masked government ID  
* Account creation date

If email editing is not supported by the backend, do not provide an apparently functional email editor.

## **14.17 Feedback**

Available only for completed bookings.

Fields:

* Room rating  
* Service rating  
* Cleanliness rating  
* Overall rating  
* Comments

Validate ratings from 1 to 5 and comments length.

---

# **15\. Booking Workflow**

## **15.1 Normal API flow**

Search rooms  
   ↓  
Select room  
   ↓  
Request booking quote  
   ↓  
Enter guest information  
   ↓  
Create pending booking  
   ↓  
Submit dummy payment  
   ↓  
Payment succeeds  
   ↓  
Booking becomes confirmed  
   ↓  
Show confirmation

## **15.2 Mock flow**

The mock repositories must reproduce the same behavior:

1. Validate room.  
2. Check capacity.  
3. Check date overlap.  
4. Calculate dynamic price.  
5. Create `PENDING_PAYMENT` booking.  
6. Save booking into mock database.  
7. Process chosen dummy token.  
8. Create payment.  
9. On success, update booking to `CONFIRMED`.  
10. Generate mock passcode record.  
11. Create notification.  
12. Return the same response shape as the API.

## **15.3 Mock booking-overlap rule**

A conflict exists when:

existingCheckIn \< requestedCheckOut  
AND  
existingCheckOut \> requestedCheckIn

Include:

PENDING\_PAYMENT  
CONFIRMED  
CHECKED\_IN

Exclude:

COMPLETED  
CANCELLED

## **15.4 Booking state handling**

The frontend should never invent unsupported transitions.

PENDING\_PAYMENT \-\> CONFIRMED  
PENDING\_PAYMENT \-\> CANCELLED  
CONFIRMED \-\> CHECKED\_IN  
CONFIRMED \-\> CANCELLED  
CHECKED\_IN \-\> COMPLETED

Only the customer-visible transitions need customer controls. Admin transitions will be performed from the admin application.

---

# **16\. Dynamic Pricing in Mock Mode**

## **16.1 Default rules**

Occupancy below 30%:  
10% discount

Occupancy from 30% to below 70%:  
Base price

Occupancy at or above 70%:  
15% markup

## **16.2 Calculation**

For a room type on a given date:

occupancyPercentage \=  
activeBookingsForRoomType /  
activeBookableRoomsForRoomType × 100

Exclude:

* Inactive rooms  
* Maintenance rooms

Count bookings with:

* `CONFIRMED`  
* `CHECKED_IN`  
* Valid `PENDING_PAYMENT`, if mock expiry is implemented

## **16.3 Per-night calculation**

Calculate every night individually.

export interface NightlyPrice {  
  date: string;  
  occupancyPercentage: number;  
  basePrice: number;  
  adjustmentPercentage: number;  
  finalPrice: number;  
}

## **16.4 Price limits**

const adjustedPrice \= basePrice \* multiplier;

const finalPrice \= Math.min(  
  maximumPrice,  
  Math.max(minimumPrice, adjustedPrice)  
);

Round to two decimal places.

## **16.5 Quote formula**

Room Amount \= Sum of nightly prices  
Tax \= Room Amount × 12%  
Service Fee \= Room Amount × 5%  
Total \= Room Amount \+ Tax \+ Service Fee \- Discount

Read tax and service fee percentages from `hotel-settings.json`.

---

# **17\. Chatbot Specification**

## **17.1 Chat modes**

BOT  
ADMIN

The bot should initially answer using local frontend knowledge.

Escalate when:

* No keyword group matches  
* Similarity score is too low  
* User explicitly requests a human  
* User repeats an unmatched question  
* Question concerns a booking problem requiring staff  
* User selects “Talk to Front Desk”

## **17.2 Knowledge file**

`chatbot-knowledge.json`

\[  
  {  
    "id": "KB-001",  
    "category": "CHECK\_IN",  
    "keywords": \[  
      "check in",  
      "check-in",  
      "arrival",  
      "arrival time"  
    \],  
    "patterns": \[  
      "what time is check in",  
      "when can i check in",  
      "check in timing"  
    \],  
    "answer": "Standard check-in starts at 2:00 PM. Early check-in is subject to availability.",  
    "suggestions": \[  
      "Can I request early check-in?",  
      "What documents are required?"  
    \]  
  }  
\]

Include categories for:

* Check-in  
* Checkout  
* Booking  
* Cancellation  
* Refund  
* Payment  
* Passcode  
* Wi-Fi  
* Breakfast  
* Room service  
* Housekeeping  
* Parking  
* Hotel location  
* Amenities  
* Contacting front desk

## **17.3 Text normalization**

Before matching:

1. Convert to lowercase.  
2. Trim whitespace.  
3. Remove repeated spaces.  
4. Remove non-essential punctuation.  
5. Normalize common alternatives.  
6. Compare keywords.  
7. Compare known patterns.

Example:

"What TIME is CHECK-IN???"

becomes:

what time is check in

## **17.4 Matching strategy**

Recommended score:

Exact normalized pattern match: 1.00  
Keyword phrase match:          0.85  
Multiple keyword overlap:      0.70  
String similarity:             calculated value  
No match:                      below threshold

Suggested threshold:

0.62

If the best score is below threshold, escalate.

## **17.5 Chat message model**

export interface ChatMessage {  
  id: number;  
  threadId: number;  
  senderId?: number;  
  senderType: 'CUSTOMER' | 'BOT' | 'ADMIN';  
  messageType: 'TEXT' | 'SYSTEM';  
  content: string;  
  readAt?: string;  
  createdAt: string;  
}

## **17.6 Escalation flow**

Customer asks question  
        ↓  
Bot checks known answers  
        ↓  
No acceptable match  
        ↓  
Bot asks whether customer wants Front Desk  
        ↓  
Customer accepts  
        ↓  
Thread changes to ADMIN  
        ↓  
Status becomes WAITING\_FOR\_ADMIN  
        ↓  
Admin application receives thread  
        ↓  
Admin replies  
        ↓  
Customer sees reply through polling

## **17.7 Mock admin-reply simulation**

Because the real admin application may not yet exist, Mock Mode should support one of these test methods:

### **Preferred development panel**

Add a development-only mock panel that can:

* View escalated threads  
* Enter a mock admin reply  
* Mark the thread assigned  
* Mark the thread resolved

Route:

/dev/mock-admin-chat

This route must be disabled outside Mock Mode.

### **Optional automatic reply**

After a configurable delay, insert:

A front desk representative has received your message.

Do not pretend that an actual administrator replied. Label it as a simulated response.

---

# **18\. Validation Requirements**

Use Angular Reactive Forms.

## **18.1 General behavior**

* Do not show every error immediately on page load.  
* Show errors after a field is touched or form submission is attempted.  
* Place field errors near the relevant control.  
* Display server field errors against matching form controls.  
* Focus the first invalid field after submission.  
* Disable duplicate submission while a request is running.

## **18.2 Login**

Email:

* Required  
* Valid format  
* Maximum length

Password:

* Required  
* Never trim a password silently  
* Show or hide control  
* Maximum supported length

## **18.3 Password**

Minimum rules:

* 8 characters  
* One uppercase letter  
* One lowercase letter  
* One number  
* One special character  
* Confirmation matches

Strength states:

Weak  
Fair  
Good  
Strong

## **18.4 Phone**

For the test scope:

Exactly 10 digits

Do not accept letters.

## **18.5 Government ID**

Support only the ID types agreed with the backend.

Example presentation validation:

AADHAAR   \-\> 12 digits  
PASSPORT  \-\> agreed alphanumeric pattern  
DRIVING\_LICENSE \-\> agreed pattern

Do not store the full ID in normal local application state after registration completes.

## **18.6 Dates**

* Check-in cannot be before today  
* Checkout must be after check-in  
* One-night minimum  
* Maximum stay limit from hotel settings  
* Date calculations must avoid accidental UTC shifts

Use date-only values as:

yyyy-MM-dd

Do not convert date-only values to UTC timestamps unnecessarily.

## **18.7 Booking guests**

* Adults at least 1  
* Children cannot be negative  
* Total count must fit capacity  
* Guest name required  
* Guest age valid  
* Exactly one primary guest

## **18.8 Service requests**

* Booking required  
* Category required  
* Title between 3 and 100 characters  
* Description between 5 and 500 characters  
* Priority required

## **18.9 Feedback**

* Ratings from 1 to 5  
* Comments within configured maximum  
* Booking must be completed  
* One feedback per booking

---

# **19\. Authentication State**

## **19.1 Auth state service**

The service should expose:

readonly currentUser: Signal\<User | null\>;  
readonly isAuthenticated: Signal\<boolean\>;  
readonly isCustomer: Signal\<boolean\>;

It should handle:

* Login result  
* Registration result  
* Session restoration  
* Logout  
* Token removal  
* Session expiration

## **19.2 Token storage**

For this company test project, local storage may be used for the JWT if the backend contract requires a bearer token.

Be aware:

* Do not display tokens  
* Do not log tokens  
* Do not include tokens in URLs  
* Remove token on logout  
* Handle expired tokens centrally  
* Clear customer state after `401`

A production system should evaluate more secure cookie-based options with the backend team.

## **19.3 Mock token**

Mock Mode can generate a clearly fake token:

mock-jwt-customer-1-1722672000000

The mock token is only for reproducing authenticated application flow.

---

# **20\. HTTP Interceptors**

Register functional interceptors in this order:

provideHttpClient(  
  withInterceptors(\[  
    authInterceptor,  
    loadingInterceptor,  
    errorInterceptor  
  \])  
)

Interceptors are appropriate for common behavior such as attaching authentication, handling errors, monitoring requests, and controlling loading indicators. [\[angular.dev\]](https://angular.dev/guide/http/interceptors)

## **20.1 Authentication interceptor**

* Add bearer token only for SmartStay API URLs  
* Do not attach it to Unsplash image URLs  
* Do not attach it to public asset JSON requests in Mock Mode

## **20.2 Loading interceptor**

* Increment active request count  
* Decrement on completion  
* Avoid spinner flicker for very fast requests  
* Support multiple simultaneous requests

## **20.3 Error interceptor**

Handle:

400 \-\> validation or business message  
401 \-\> clear session and redirect to login  
403 \-\> forbidden page  
404 \-\> feature-specific not-found state  
409 \-\> business conflict  
500 \-\> generic system error

Do not replace useful backend messages with only:

Something went wrong

## **20.4 Mock delay**

Mock repositories should use an observable delay:

return of(response).pipe(delay(environment.mockDelayMs));

This allows loading states and button locks to be tested realistically.

---

# **21\. UI Design System**

## **21.1 Visual direction**

SmartStay should appear:

* Modern  
* Premium  
* Calm  
* Trustworthy  
* Clean  
* Responsive  
* Suitable for a hotel

Suggested visual identity:

Primary: Deep navy  
Accent: Warm gold  
Background: Soft cream or light gray  
Success: Green  
Warning: Amber  
Error: Red  
Text: Dark charcoal

## **21.2 CSS variables**

:root {  
  \--color-primary-900: \#11243e;  
  \--color-primary-700: \#1b3a5d;  
  \--color-accent-500: \#c99b4a;  
  \--color-surface: \#ffffff;  
  \--color-background: \#f7f8fa;  
  \--color-text: \#1f2937;  
  \--color-text-muted: \#6b7280;  
  \--color-success: \#16803c;  
  \--color-warning: \#b76e00;  
  \--color-error: \#c62828;

  \--radius-sm: 0.5rem;  
  \--radius-md: 0.875rem;  
  \--radius-lg: 1.25rem;

  \--shadow-card: 0 12px 32px rgba(17, 36, 62, 0.10);  
  \--page-max-width: 1200px;  
}

## **21.3 Responsive breakpoints**

Use a mobile-first approach.

Suggested breakpoints:

Small mobile: below 480px  
Mobile:       480px to 767px  
Tablet:       768px to 1023px  
Laptop:       1024px to 1439px  
Large:        1440px and above

Do not design every value around one laptop resolution.

## **21.4 Mobile behavior**

* Replace desktop navigation with drawer or mobile menu  
* Use full-width form controls  
* Stack booking summary below form  
* Use filter bottom sheet or drawer  
* Make touch targets at least comfortably tappable  
* Keep payment actions visible without covering form content  
* Convert large tables into cards

---

# **22\. Images and Media**

## **22.1 Image metadata**

Store images in JSON:

{  
  "url": "https://images.unsplash.com/...",  
  "altText": "Deluxe hotel room with a king-size bed",  
  "displayOrder": 1  
}

## **22.2 Image rules**

* Use optimized image URLs  
* Use lazy loading below the fold  
* Specify aspect ratios to avoid layout shifts  
* Provide meaningful alternative text  
* Provide local fallback placeholders  
* Do not use the same hero image for every room  
* Do not place essential information only inside images

Example:

\<img  
  \[src\]="image.url"  
  \[alt\]="image.altText"  
  loading="lazy"  
  width="800"  
  height="520"  
/\>

## **22.3 Unsplash usage**

Keep external image URLs isolated in mock JSON. This makes them easy to replace if company network restrictions block Unsplash.

Also keep a few local fallback images under:

src/assets/images/placeholders

---

# **23\. Animations and Transitions**

Use animations to improve clarity, not to delay the user.

Recommended:

* Header appearance  
* Hero content entrance  
* Room-card hover  
* Filter-panel transitions  
* Dialog appearance  
* Toast entrance and exit  
* Booking-step transitions  
* Payment success animation  
* Chat widget expansion  
* Skeleton loading shimmer  
* Status-change highlight

Avoid:

* Long page-entry animations  
* Constantly moving backgrounds  
* Excessive parallax  
* Animating every text element  
* Large animation libraries for simple effects

Respect reduced-motion preferences:

@media (prefers-reduced-motion: reduce) {  
  \*,  
  \*::before,  
  \*::after {  
    scroll-behavior: auto \!important;  
    animation-duration: 0.01ms \!important;  
    transition-duration: 0.01ms \!important;  
  }  
}

---

# **24\. Loading, Empty, and Error States**

Every data-driven page must define four states.

## **24.1 Loading**

Examples:

* Room-card skeletons  
* Booking-detail skeleton  
* Button spinner  
* Chat loading indicator

## **24.2 Success**

Show the requested data with appropriate actions.

## **24.3 Empty**

Examples:

No rooms match your filters.  
You do not have any bookings yet.  
No service requests have been created.  
You have no unread notifications.

Provide a useful action:

Clear filters  
Browse rooms  
Create request  
Return home

## **24.4 Error**

Show:

* Clear title  
* Helpful message  
* Retry button  
* Safe fallback navigation

Do not display raw Java, SQL, or stack-trace content.

---

# **25\. Mock Repository Requirements**

## **25.1 Mock Auth Repository**

Must support:

* Customer registration  
* Duplicate email rejection  
* Login  
* Active-account validation  
* Current user  
* Profile update  
* Logout

## **25.2 Mock Room Repository**

Must support:

* Room listing  
* Room details  
* Featured rooms  
* Room-type listing  
* Search  
* Filtering  
* Sorting  
* Availability  
* Dynamic prices

## **25.3 Mock Booking Repository**

Must support:

* Quote  
* Booking creation  
* My bookings  
* Booking details  
* Cancellation  
* Status grouping  
* Conflict detection

## **25.4 Mock Payment Repository**

Must support:

tok\_success \-\> SUCCESS  
tok\_failure \-\> FAILED  
tok\_pending \-\> PENDING  
upi\_success \-\> SUCCESS  
upi\_failure \-\> FAILED

Successful payment must update the associated booking.

## **25.5 Mock Passcode Repository**

Must support:

* Passcode creation after payment success  
* Status calculation by current time  
* Access validation  
* Lock after repeated incorrect attempts  
* Expiry  
* Revocation after cancellation

## **25.6 Mock Service Request Repository**

Must support:

* Create request  
* List customer requests  
* View details  
* Cancel valid request  
* Test status progression

For presentation purposes, a development action may simulate:

PENDING \-\> ACCEPTED \-\> IN\_PROGRESS \-\> COMPLETED

Clearly label it as a mock control.

## **25.7 Mock Chat Repository**

Must support:

* Thread creation  
* Message creation  
* Bot messages  
* Escalation  
* Mock admin reply  
* Read status  
* Resolution

## **25.8 Mock Notification Repository**

Must support:

* Listing  
* Unread count  
* Mark one as read  
* Mark all as read  
* Automatic notification creation

## **25.9 Mock Feedback Repository**

Must support:

* Completed-booking eligibility  
* Duplicate-feedback prevention  
* Feedback creation  
* Customer feedback listing

---

# **26\. API Repository Requirements**

Each API repository must map directly to the documented endpoint.

Examples:

@Injectable()  
export class ApiRoomRepository extends RoomRepository {  
  private readonly http \= inject(HttpClient);

  getRooms(  
    filters?: RoomSearchFilters  
  ): Observable\<ApiResponse\<PageData\<Room\>\>\> {  
    return this.http.get\<ApiResponse\<PageData\<Room\>\>\>(  
      \`${environment.apiBaseUrl}/rooms\`,  
      { params: buildHttpParams(filters) }  
    );  
  }  
}

Do not use `any`.

Incorrect:

this.http.get\<any\>(url);

Correct:

this.http.get\<ApiResponse\<PageData\<Room\>\>\>(url);

---

# **27\. API Endpoint Mapping**

## **Authentication**

POST /auth/register  
POST /auth/login  
GET  /auth/me  
POST /auth/logout

## **Rooms**

GET /rooms  
GET /rooms/:roomId  
GET /rooms/availability  
GET /rooms/featured  
GET /room-types  
GET /room-types/:roomTypeId

## **Bookings**

POST /bookings/quote  
POST /bookings  
GET  /bookings/my  
GET  /bookings/:bookingId  
POST /bookings/:bookingId/cancel

## **Payments**

POST /payments/initiate  
POST /payments/:paymentId/confirm  
GET  /payments/:paymentId  
GET  /payments/booking/:bookingId

## **Passcodes**

GET  /bookings/:bookingId/passcode  
POST /room-access/validate

## **Service requests**

POST /service-requests  
GET  /service-requests/my  
GET  /service-requests/:requestId  
POST /service-requests/:requestId/cancel

## **Chats**

POST  /chats  
GET   /chats/my  
GET   /chats/:threadId  
POST  /chats/:threadId/messages  
POST  /chats/:threadId/escalate  
PATCH /chats/:threadId/read

## **Notifications**

GET   /notifications  
GET   /notifications/unread-count  
PATCH /notifications/:notificationId/read  
PATCH /notifications/read-all

## **Feedback**

POST /feedback  
GET  /feedback/my  
GET  /rooms/:roomId/feedback

---

# **28\. Testing Strategy**

## **28.1 Unit tests**

Test:

* Date-range validator  
* Password validator  
* Password-match validator  
* Phone validator  
* Guest-capacity validator  
* String normalization  
* Chat keyword matching  
* Chat similarity threshold  
* Dynamic price calculation  
* Price clamping  
* Tax calculation  
* Service fee calculation  
* Booking overlap  
* Booking status grouping  
* Passcode status calculation  
* Money formatting

## **28.2 Component tests**

Test:

* Login validation  
* Registration validation  
* Room filters  
* Room card rendering  
* Booking form step navigation  
* Payment state rendering  
* Booking card actions by status  
* Passcode states  
* Service-request form  
* Chat escalation  
* Notification unread styling  
* Feedback eligibility

## **28.3 Repository tests**

Test both implementations against equivalent behavior.

Example contract:

RoomRepository.getRoomById(validId)  
must return matching Room in Mock Mode and API Mode.

RoomRepository.getRoomById(invalidId)  
must produce ROOM\_NOT\_FOUND in both modes.

## **28.4 Route tests**

Test:

* Guest opens protected route and is redirected  
* Login returns guest to intended booking route  
* Logged-in user opening login is redirected  
* Unknown route opens not-found page  
* Unsaved booking form shows leave warning

Angular’s router testing tools support route parameters, guards, redirects, and navigation scenarios, so routing should be tested instead of relying only on manual navigation. [\[angular.dev\]](https://angular.dev/guide/routing/testing)

## **28.5 Manual responsive testing**

At minimum:

360 × 800  
390 × 844  
768 × 1024  
1366 × 768  
1440 × 900

Test:

* Header  
* Hero search  
* Room filters  
* Gallery  
* Booking steps  
* Payment form  
* Account navigation  
* Chat widget  
* Dialogs  
* Error messages

---

# **29\. Presentation Test Scenarios**

The customer frontend should demonstrate these scenarios in Mock Mode before APIs exist.

## **Scenario 1: Registration**

1. Open registration.  
2. Submit empty form.  
3. Show required errors.  
4. Enter weak password.  
5. Show password-strength feedback.  
6. Enter mismatched password.  
7. Correct fields.  
8. Register successfully.  
9. Redirect to account or login.

## **Scenario 2: Room search**

1. Search valid dates.  
2. Filter by Deluxe.  
3. Sort low to high.  
4. Open room details.  
5. View gallery and amenities.  
6. Start booking.

## **Scenario 3: Booking and payment**

1. Enter guest details.  
2. Review dynamic price.  
3. Create pending booking.  
4. Use `tok_success`.  
5. Show payment success.  
6. Show confirmed booking.  
7. Create notification.  
8. Show passcode status.

## **Scenario 4: Failed payment**

1. Create another pending booking.  
2. Use `tok_failure`.  
3. Show useful error.  
4. Keep booking pending.  
5. Allow payment retry.  
6. Prevent duplicate submission.

## **Scenario 5: Conflict**

1. Select an already-booked room.  
2. Use overlapping dates.  
3. Receive `BOOKING_DATE_CONFLICT`.  
4. Keep form data.  
5. Suggest changing dates.

## **Scenario 6: Service request**

1. Open confirmed booking.  
2. Request housekeeping.  
3. See pending status.  
4. Simulate acceptance.  
5. Simulate completion.  
6. Receive notification.

## **Scenario 7: Chat escalation**

1. Ask a known check-in question.  
2. Receive bot answer.  
3. Ask an unknown question.  
4. Bot fails safely.  
5. Escalate to Front Desk.  
6. Add mock admin reply.  
7. Customer sees response.

## **Scenario 8: Feedback**

1. Open completed booking.  
2. Submit ratings and comments.  
3. Show success state.  
4. Prevent second feedback submission.

---

# **30\. Development Sequence**

## **Phase 1: Foundation**

1. Create Angular project.  
2. Add global SCSS variables.  
3. Create layouts.  
4. Configure routes.  
5. Create models and enums.  
6. Create API wrappers.  
7. Create repository contracts.  
8. Create Mock Database Service.  
9. Configure Mock/API provider switching.  
10. Create loading and error systems.

## **Phase 2: Public pages**

1. Header and footer  
2. Landing page  
3. Availability search  
4. Room listing  
5. Room filters  
6. Room details  
7. Responsive navigation  
8. Image fallbacks

## **Phase 3: Authentication**

1. Login  
2. Registration  
3. Validators  
4. Auth state  
5. Guards  
6. Session restoration  
7. Logout

## **Phase 4: Booking**

1. Quote calculation  
2. Booking form  
3. Guest details  
4. Review  
5. Pending booking  
6. Dummy payment  
7. Confirmation  
8. Conflict handling

## **Phase 5: Account**

1. Dashboard  
2. Profile  
3. My bookings  
4. Booking details  
5. Cancellation  
6. Passcode  
7. Notifications

## **Phase 6: Hotel services**

1. Service requests  
2. Request history  
3. Request status timeline  
4. Feedback

## **Phase 7: Chat**

1. Chat widget  
2. Knowledge JSON  
3. String matching  
4. Escalation  
5. Admin-message polling  
6. Mock admin-reply panel

## **Phase 8: Quality**

1. Unit tests  
2. Route tests  
3. Responsive tests  
4. Accessibility review  
5. API Mode verification  
6. Production build  
7. Documentation  
8. Presentation rehearsal

---

# **31\. API Integration Checklist**

When Rohit delivers the API:

1. Change to API Mode.  
2. Start Spring Boot on port `8080`.  
3. Verify CORS permits `http://localhost:4200`.  
4. Test customer login.  
5. Inspect actual API wrappers.  
6. Compare enum values.  
7. Compare property names.  
8. Check date formats.  
9. Check money fields.  
10. Check pagination structure.  
11. Test expired JWT behavior.  
12. Test booking conflict.  
13. Test successful payment.  
14. Test failed payment.  
15. Test passcode status.  
16. Test service-request creation.  
17. Test chat escalation.  
18. Test notifications.  
19. Remove any temporary API-specific component conditions.  
20. Keep Mock Mode operational for demonstrations.

If the API differs from the agreed contract, change the API repository mapping before changing page components.

For example, if the backend temporarily returns:

{  
  "content": \[\]  
}

but the application expects:

{  
  "items": \[\]  
}

map it in `ApiRoomRepository`. Do not spread backend inconsistencies across components.

---

# **32\. Collaboration Rules**

## **32.1 Shared frontend contract**

Use:

SmartStay-Integration-Contract/  
├── API\_CONTRACT.md  
├── API\_CHANGE\_LOG.txt  
├── ENUMS.json  
├── TEST\_ACCOUNTS.txt  
├── sample-requests/  
├── sample-responses/  
└── releases/

## **32.2 Version naming**

smartstay-customer-frontend-v0.1.0-2026-08-03.zip  
smartstay-customer-frontend-v0.5.0-2026-08-10.zip  
smartstay-customer-frontend-v1.0.0-2026-08-20.zip

## **32.3 Handoff documentation**

Include:

VERSION.txt  
README.md  
API\_CHANGE\_LOG.txt  
npm version information  
Angular version information  
Mock Mode command  
API Mode command  
Test account details  
Known issues

## **32.4 Avoid shared-component duplication**

Coordinate shared visual decisions with Pranay and Shubham:

* Colors  
* Buttons  
* Inputs  
* Status badges  
* Toasts  
* Dialogs  
* Typography  
* Spacing  
* Icons  
* API wrappers  
* Enums

Even though the customer and admin interfaces may be separate Angular projects, they should look like parts of the same SmartStay system.

---

# **33\. Definition of Done**

The customer frontend is complete only when:

* It runs without Spring Boot in Mock Mode  
* It runs with Spring Boot in API Mode  
* No component directly loads JSON  
* No component directly uses `HttpClient`  
* Mock and API repositories follow identical contracts  
* Refreshing Mock Mode preserves created bookings  
* Sample data can be reset  
* Registration and login validation work  
* Room search handles availability and filters  
* Booking conflicts are shown correctly  
* Dynamic-pricing previews work  
* Dummy payment supports success and failure  
* Booking confirmation works  
* Passcode states render correctly  
* Service requests can be created and tracked  
* Chatbot handles known questions  
* Unknown questions escalate to admin chat  
* Notifications work  
* Completed bookings accept feedback  
* All pages have loading, empty, and error states  
* Protected routes use guards  
* Forms prevent duplicate submission  
* The UI works on mobile and laptop  
* Images have fallbacks and alternative text  
* Important flows have unit or component tests  
* The production build finishes without errors  
* The final ZIP includes documentation and version details

---

# **34\. Final Rules for Abdur**

1. Build each feature in Mock Mode first.  
2. Use the same TypeScript models as the backend contract.  
3. Keep page components independent of data source.  
4. Use repository interfaces for every backend-related feature.  
5. Never trust a price supplied by the browser in API Mode.  
6. Never generate a real room passcode in the normal frontend flow.  
7. Keep chatbot matching local, but persist escalated messages through the chat repository.  
8. Do not use `any`.  
9. Do not duplicate status strings across components.  
10. Do not hardcode tax, service fee, check-in time, or checkout time in multiple files.  
11. Use shared components for repeated UI.  
12. Preserve form data when recoverable API errors occur.  
13. Test failure paths, not only successful flows.  
14. Keep Mock Mode available until the final presentation.  
15. Prefer complete and reliable workflows over unfinished additional pages.

## **Documentation design rationale**

The architecture uses repository contracts to make Mock Mode and API Mode interchangeable. JSON files supply seed data, while a local mock database provides realistic create, update, cancellation, payment, chat, notification, and passcode behavior. This allows the full customer interface to be developed and demonstrated before the Spring Boot backend is delivered, while keeping later API integration limited mainly to repository implementations.
