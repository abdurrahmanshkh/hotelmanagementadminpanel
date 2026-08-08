# SmartStay Hotel Management System - Admin Panel Frontend (Phase 1 Architectural Blueprint & Implementation Plan)

## Executive Summary
This document establishes the authoritative Phase 1 architectural analysis, system decomposition, technical specification, and dependency-aware implementation plan for the **SmartStay Admin Panel Frontend** assigned to **Abdur Rehman Shaikh**.

The application is built as a single-page standalone Angular 19 application running on Node.js/TypeScript with SCSS styling, supporting both **Mock Mode** (with client-side `localStorage` persistence and JSON seed data) and **API Mode** (communicating with the Java 17 Spring Boot backend at `http://localhost:8080/api/v1`).

---

## 1. Assignment Summary

- **SmartStay System Module:** Complete Administrator, Manager, and Staff Frontend Panel (`smartstay-admin-frontend`).
- **Assigned Developer:** Abdur Rehman Shaikh.
- **Main Responsibilities:**
  - Full end-to-end admin interface for staff, admin, and manager personas.
  - Complete operational dashboard, booking lifecycle (search, check-in, checkout, cancellation), guest directory with PII masking, service requests (table & Kanban), front-desk chat inbox (with 5s polling), room & room type management, housekeeping/cleaning operations, maintenance issue tracking, payments & refund processing, dynamic pricing engine (rules, preview, recalculation), analytics & reports with safe CSV export, and hotel operational settings.
  - Mock Mode architecture utilizing JSON seed data and `localStorage` persistence (`smartstay_admin_mock_database_v1`).
  - Dual Repository architecture seamlessly switching between Mock Repositories and Spring Boot REST API Repositories.
  - Responsive UI across Mobile (360px), Tablet (768px), and Desktop (1440px) viewports with strict accessibility compliance.
- **Technologies Involved:**
  - Angular 19 (Standalone Components, Signals, RxJS, Reactive Forms, Lazy Loading, Router Guards, Functional Interceptors).
  - TypeScript (Strict mode enabled, `noImplicitAny: true`, no `any` types).
  - Styling: SCSS with CSS Custom Properties / Design Tokens (Navy `#11243E`, Gold `#C99B4A`, Background `#F5F7FA`).
  - Icons & Utilities: `lucide-angular`, `@angular/cdk` (Overlays, Modals, Drag & Drop), `date-fns`.
- **Explicitly Outside Scope:**
  - Customer-facing application (assigned to Pranay Maurya & Shubham Bhandari).
  - Spring Boot backend REST endpoints, DB schema, SQL scripts (assigned to Rohit Naik).
  - Real payment gateway API processing & hardware smart-lock integration.
  - Server-Side Rendering (SSR) / Static Site Generation (SSG).

---

## 2. Functional Modules

### 2.1 Authentication & Session Management
- **Purpose:** Secure login and role-based access control for hotel operational staff.
- **Workflows:** Login with email, password, and staff code; session restoration from token; role-based UI rendering and route protection; logout.
- **Allowed Roles:** `STAFF`, `ADMIN`, `MANAGER` (Reject `CUSTOMER` role).
- **Routes:** `/admin/login`.

### 2.2 Operational Dashboard
- **Purpose:** Central command center providing real-time room stats, revenue metrics, arrivals/departures, and operational alerts.
- **Workflows:** View live room counters, today's check-in/out queues, urgent service requests, waiting chat notifications; trigger 30s auto-refresh or manual sync; navigate via quick actions.
- **Routes:** `/admin/dashboard`.

### 2.3 Booking Management
- **Purpose:** Complete lifecycle management of customer room reservations.
- **Workflows:** Search/filter/sort bookings; view stay and billing details; perform Check-in (updates booking to `CHECKED_IN`, room to `OCCUPIED`); perform Checkout (updates booking to `COMPLETED`, room to `UNDER_CLEANING`, creates Cleaning Task); perform Cancellation (with refund calculation preview & reason logging).
- **Status Transitions:** `PENDING_PAYMENT` -> `CONFIRMED` -> `CHECKED_IN` -> `COMPLETED` | `CANCELLED`.
- **Routes:** `/admin/bookings`, `/admin/bookings/:bookingId`.

### 2.4 Guest Directory
- **Purpose:** Manage guest profiles, contact info, and stay history while enforcing privacy safeguards.
- **Workflows:** Search guests by name/email/phone; view current, upcoming, and past stays; mask sensitive identity records (passwords, payment secrets, full ID numbers).
- **Routes:** `/admin/guests`, `/admin/guests/:guestId`.

### 2.5 Service Request Management
- **Purpose:** Handle guest service and amenity requests via list or Kanban views.
- **Workflows:** View requests grouped by status; assign staff; transition status (`PENDING` -> `ACCEPTED` -> `IN_PROGRESS` -> `COMPLETED` / `CANCELLED`); log timestamps.
- **Routes:** `/admin/service-requests`, `/admin/service-requests/board`, `/admin/service-requests/:requestId`.

### 2.6 Front-Desk Chat Inbox
- **Purpose:** Administrative communication channel for handling escalated guest chats.
- **Workflows:** Filter waiting threads; assign to active staff; view customer/booking side drawer; send replies (max 1000 chars); 5s polling for incoming messages; mark read; resolve thread.
- **Status Transitions:** `WAITING_FOR_ADMIN` -> `ASSIGNED` -> `RESOLVED` / `CLOSED`.
- **Routes:** `/admin/chats`, `/admin/chats/:threadId`.

### 2.7 Room, Room Type & Amenity Management
- **Purpose:** Manage hotel inventory, pricing constraints, amenities, and image metadata.
- **Workflows:** Manage room types (enforcing `minimumPrice <= basePrice <= maximumPrice`); manage room inventory with unique numbers; update room status; manage amenities & HTTPS image links.
- **Room Statuses:** `AVAILABLE`, `RESERVED`, `OCCUPIED`, `UNDER_CLEANING`, `MAINTENANCE`.
- **Routes:** `/admin/rooms`, `/admin/rooms/new`, `/admin/rooms/:roomId/edit`, `/admin/room-types`, `/admin/amenities`.

### 2.8 Housekeeping / Cleaning Management
- **Purpose:** Operational tracking of room cleaning tasks.
- **Workflows:** View cleaning queue/board; assign staff; track progress (`PENDING` -> `ASSIGNED` -> `IN_PROGRESS` -> `COMPLETED`); complete task (setting room to `AVAILABLE` or creating maintenance issue and setting to `MAINTENANCE`).
- **Routes:** `/admin/cleaning`, `/admin/cleaning/board`, `/admin/cleaning/:taskId`.

### 2.9 Maintenance Management
- **Purpose:** Track facility maintenance issues and hardware fixes.
- **Workflows:** Report maintenance issue; assign engineer; transition states (`OPEN` -> `ASSIGNED` -> `IN_PROGRESS` -> `ON_HOLD` -> `COMPLETED`); set room to `MAINTENANCE`; upon completion, set room to `UNDER_CLEANING` or `AVAILABLE`.
- **Routes:** `/admin/maintenance`, `/admin/maintenance/new`, `/admin/maintenance/:maintenanceId`.

### 2.10 Payments & Refunds
- **Purpose:** Audit ledger of financial transactions and administrative refund processing.
- **Workflows:** Filter transaction logs by reference, guest, method (`CARD`, `UPI`, `CASH`), status; view transaction breakdown; process partial or full refunds (validating against remaining balance).
- **Status Values:** Payment (`INITIATED`, `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`), Refund (`PENDING`, `SUCCESS`, `FAILED`).
- **Routes:** `/admin/payments`, `/admin/payments/:paymentId`.

### 2.11 Dynamic Pricing Engine
- **Purpose:** Occupancy-based dynamic pricing rule management and price adjustments.
- **Workflows:** Create/edit demand pricing rules (e.g. <30% occupancy = 10% discount, >=70% occupancy = 15% markup); validate occupancy range overlaps; preview price impact; toggle global dynamic pricing; trigger recalculation without affecting past bookings.
- **Routes:** `/admin/pricing`, `/admin/pricing/rules`, `/admin/pricing/preview`.

### 2.12 Reports & CSV Export
- **Purpose:** Business intelligence reporting on revenue, booking trends, occupancy, and service performance.
- **Workflows:** Filter by date range and room type; render accessible chart summaries; download formatted, scrubbed CSV exports.
- **Routes:** `/admin/reports/revenue`, `/admin/reports/bookings`, `/admin/reports/occupancy`, `/admin/reports/services`.

### 2.13 Hotel Settings
- **Purpose:** Admin configuration for hotel identity, operating hours, financial taxes, and cancellation policies.
- **Workflows:** Edit multi-tab form (Identity, Operations, Finance, Dynamic Pricing); enforce unsaved dirty state warnings via `pendingChangesGuard`; update shared settings cache.
- **Routes:** `/admin/settings/hotel`, `/admin/settings/operations`, `/admin/settings/pricing`.

---

## 3. Technical Architecture

### 3.1 Folder & Module Blueprint
```
src/app/
├── core/
│   ├── constants/            # Routing, API endpoints, label mappings
│   ├── enums/                # Role, Booking, Room, Payment, Service, Chat enums
│   ├── models/               # Canonical TypeScript interfaces (ApiResponse, PageData, Domain models)
│   ├── guards/               # adminAuthGuard, roleGuard, unauthenticatedGuard, pendingChangesGuard
│   ├── interceptors/         # authInterceptor, loadingInterceptor, errorInterceptor, requestIdInterceptor
│   ├── services/             # AuthService, MockDatabaseService, ToastService, ThemeService, NotificationService
│   ├── validators/           # Custom reactive form validators (price range, occupancy overlap, HTTPS URL)
│   ├── utilities/            # Formatters (currency, date, status labels, CSV generator)
│   └── repositories/
│       ├── contracts/        # 13 Repository Interface contracts
│       ├── mock/             # 13 Mock Repository implementations (backed by MockDatabaseService)
│       ├── api/              # 13 API Repository implementations (backed by HttpClient)
│       └── repository.providers.ts # Provider factory switching repositories based on environment
├── layout/
│   ├── admin-layout/         # Root shell container with main outlet
│   ├── admin-header/         # Top navigation bar, user avatar menu, notifications, theme toggle
│   ├── admin-sidebar/        # Desktop persistent / tablet collapsible sidebar navigation
│   ├── breadcrumb/           # Dynamic route breadcrumb path navigation
│   └── mobile-admin-navigation/ # Mobile drawer navigation (<768px)
├── shared/
│   ├── components/           # Reusable UI elements (page-header, button, form-field, data-table, pagination, modals, badges, etc.)
│   ├── directives/           # ClickOutside, PermissionCheck directives
│   └── pipes/                # CurrencyPipe, DateFormatPipe, MaskedIdPipe, StatusLabelPipe
└── features/                 # Lazy-loaded feature modules
    ├── authentication/       # Login component
    ├── dashboard/            # Overview metrics & quick actions
    ├── bookings/             # List, Details, Check-in, Checkout, Cancellation
    ├── guests/               # Directory, Details, Stay History
    ├── service-requests/     # List, Kanban Board, Assignment, Details
    ├── chats/                # Inbox, Thread view, Reply form, Context drawer
    ├── rooms/                # Inventory, Room Form, Room Status Override
    ├── room-types/           # Types Form, Amenity Manager, HTTPS Image Manager
    ├── cleaning/             # Cleaning Queue, Kanban Board, Task Completion
    ├── maintenance/          # Maintenance Log, Issue Creation, Status Hold/Resume/Complete
    ├── payments/             # Transaction Ledger, Refund Modal
    ├── pricing/              # Dynamic Rules, Pricing Preview, Global Recalculate
    ├── reports/              # Analytics views & CSV Export
    └── settings/             # Multi-tab hotel configuration
```

### 3.2 Repository Data Flow Architecture
```
[ Feature Page Component ]
         │
         ▼
[ Abstract Repository Contract Interface ]
         │
    ┌────┴──────────────────────────┐
    ▼                               ▼
[ Mock Repository Implementation ]   [ API Repository Implementation ]
    │                               │
    ▼                               ▼
[ MockDatabaseService ]              [ Angular HttpClient ]
    │                               │
    ▼                               ▼
[ localStorage: smartstay_... ]     [ Spring Boot REST API: localhost:8080 ]
```

### 3.3 Mock Database Engine Architecture
- Storage Key: `smartstay_admin_mock_database_v1`
- Seed Loading: On initial load, if key is absent or schema version mismatched, fetch 16 seed files from `assets/mock-data/` via RxJS `forkJoin` and populate `localStorage`.
- Artificial Latency: All mock operations introduce a 500ms delay via RxJS `delay(500)` to accurately test loading spinners and button debouncing.
- Atomic Persistence: Writes mutate the in-memory object graph and commit atomically to `localStorage`.
- Reset Action: Provides a developer button to purge `localStorage` and re-initialize from seed JSON files.

---

## 4. Integration Contract

### 4.1 Backend REST API Endpoint Mapping
- Base URL: `http://localhost:8080/api/v1`
- Auth: `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- Dashboard: `GET /admin/dashboard/summary`
- Bookings: `GET /admin/bookings`, `GET /admin/bookings/{id}`, `PATCH /admin/bookings/{id}/check-in`, `PATCH /admin/bookings/{id}/check-out`, `POST /admin/bookings/{id}/cancel`
- Guests: `GET /admin/guests`, `GET /admin/guests/{id}`, `GET /admin/guests/{id}/bookings`
- Service Requests: `GET /admin/service-requests`, `GET /admin/service-requests/{id}`, `PATCH /admin/service-requests/{id}/assign`, `PATCH /admin/service-requests/{id}/status`
- Chats: `GET /admin/chats`, `GET /admin/chats/{id}`, `PATCH /admin/chats/{id}/assign`, `POST /admin/chats/{id}/messages`, `PATCH /admin/chats/{id}/resolve`, `PATCH /admin/chats/{id}/read`
- Rooms & Types: `GET /admin/rooms`, `GET /admin/rooms/{id}`, `POST /admin/rooms`, `PUT /admin/rooms/{id}`, `PATCH /admin/rooms/{id}/status`, `GET /room-types`, `POST /admin/room-types`, `PUT /admin/room-types/{id}`, `GET /admin/amenities`, `POST /admin/amenities`
- Cleaning & Maintenance: `GET /admin/cleaning-tasks`, `POST /admin/cleaning-tasks`, `PATCH /admin/cleaning-tasks/{id}/complete`, `GET /admin/maintenance`, `POST /admin/maintenance`, `PATCH /admin/maintenance/{id}/complete`
- Payments & Refunds: `GET /admin/payments`, `POST /admin/payments/{id}/refund`
- Dynamic Pricing: `GET /admin/pricing/rules`, `POST /admin/pricing/rules`, `PATCH /admin/pricing/enabled`, `POST /admin/pricing/recalculate`, `POST /admin/pricing/preview`
- Reports & Settings: `GET /admin/reports/revenue`, `GET /admin/reports/bookings`, `GET /admin/settings`, `PUT /admin/settings`

### 4.2 Standard Envelope Schemas
- `ApiResponse<T>`: `{ success: boolean, message: string, data: T, timestamp: string }`
- `PageData<T>`: `{ items: T[], page: number, size: number, totalItems: number, totalPages: number }`
- `ApiError`: `{ success: false, code: string, message: string, fieldErrors?: Record<string, string>, path?: string, timestamp: string }`

---

## 5. Assumptions and Open Issues

1. **Mock Seed Generation:** The 16 seed JSON files will contain complete, realistic initial dataset records matching the exact model contracts defined in the specification.
2. **Chart Visualization:** Standardized CSS/SVG dynamic components will be constructed to avoid external bundle overhead while delivering high-contrast accessible visual reporting.
3. **Chat Polling Mechanism:** Polling is configured at 5 seconds via RxJS `timer(0, 5000)` piped through `switchMap` and automatically torn down using Angular's `destroyRef` or `takeUntilDestroyed`.
4. **Currency Formatting:** All financial figures default to Indian Rupee (`INR` / `₹`) with standard two-decimal precision.

---

## 6. Ordered Task Breakdown

The implementation is broken down into **12 structured, comprehensive tasks**, perfectly optimized for execution with Gemini 3.6 Flash.

### TASK-01: FOUNDATION-01 - Dependencies, Environments, Core Models, Enums, and Utilities Setup
- **Objective:** Establish the project dependencies, Angular configuration files, core type definitions, constants, custom validators, and utility formatters.
- **Dependencies:** None.
- **Target Files:**
  - `package.json`, `angular.json`
  - `src/environments/environment.ts`, `src/environments/environment.mock.ts`, `src/environments/environment.production.ts`
  - `src/app/core/enums/*.ts`
  - `src/app/core/models/*.ts`
  - `src/app/core/constants/*.ts`
  - `src/app/core/utilities/*.ts`
  - `src/app/core/validators/*.ts`
- **Requirements:**
  - Add `lucide-angular`, `date-fns`, `@angular/cdk`.
  - Define environment files for `mock`, `development`, and `production`.
  - Implement standard enums: `Role`, `BookingStatus`, `RoomStatus`, `PaymentStatus`, `PaymentMethod`, `RefundStatus`, `ServiceRequestStatus`, `CleaningTaskStatus`, `MaintenanceStatus`, `ChatThreadStatus`, `Priority`, `PricingAdjustmentType`.
  - Implement models: `ApiResponse`, `PageData`, `ApiError`, `AdminUser`, `Booking`, `Room`, `RoomType`, `Amenity`, `ServiceRequest`, `ChatThread`, `ChatMessage`, `CleaningTask`, `MaintenanceRecord`, `Payment`, `Refund`, `PricingRule`, `HotelSettings`, `ReportData`.
  - Implement utility helpers: `CurrencyFormatter`, `DateFormatter`, `StatusLabelMapper`, `CsvGenerator`.
- **Validation & Security:** Strict TypeScript types (`noImplicitAny`), no `any` keyword.
- **Verification Steps:** Run `npm install` and `ng build` to verify clean compilation without errors.

---

### TASK-02: FOUNDATION-02 - Mock Database Engine & Seed Asset Files
- **Objective:** Create the complete set of 16 seed JSON files and implement `MockDatabaseService` with atomic `localStorage` persistence.
- **Dependencies:** `FOUNDATION-01`.
- **Target Files:**
  - `src/assets/mock-data/admin-users.json`
  - `src/assets/mock-data/users.json`
  - `src/assets/mock-data/room-types.json`
  - `src/assets/mock-data/rooms.json`
  - `src/assets/mock-data/bookings.json`
  - `src/assets/mock-data/payments.json`
  - `src/assets/mock-data/refunds.json`
  - `src/assets/mock-data/service-requests.json`
  - `src/assets/mock-data/chat-threads.json`
  - `src/assets/mock-data/notifications.json`
  - `src/assets/mock-data/cleaning-tasks.json`
  - `src/assets/mock-data/maintenance-records.json`
  - `src/assets/mock-data/pricing-rules.json`
  - `src/assets/mock-data/price-snapshots.json`
  - `src/assets/mock-data/hotel-settings.json`
  - `src/app/core/services/mock-database.service.ts`
- **Requirements:**
  - Populate 16 JSON seed files with realistic administrative data.
  - Implement `MockDatabaseService` that checks for key `smartstay_admin_mock_database_v1`.
  - Provide asynchronous CRUD methods with 500ms delay simulation.
  - Add developer reset method to clear storage and re-load seed JSONs.
- **Verification Steps:** Run unit test for `MockDatabaseService` to confirm seed initialization and CRUD mutations.

---

### TASK-03: FOUNDATION-03 - Repository Contracts, Mock Repositories, API Repositories & Provider Registry
- **Objective:** Implement 13 Repository Interface Contracts along with their complete `Mock` and `API` implementation classes, wired through a dynamic provider factory.
- **Dependencies:** `FOUNDATION-02`.
- **Target Files:**
  - `src/app/core/repositories/contracts/*.ts` (13 contracts)
  - `src/app/core/repositories/mock/*.ts` (13 mock implementations)
  - `src/app/core/repositories/api/*.ts` (13 API implementations)
  - `src/app/core/repositories/repository.providers.ts`
- **Requirements:**
  - Define contracts: `AuthRepository`, `DashboardRepository`, `BookingRepository`, `GuestRepository`, `ServiceRequestRepository`, `ChatRepository`, `RoomRepository`, `CleaningRepository`, `MaintenanceRepository`, `PaymentRepository`, `PricingRepository`, `ReportRepository`, `SettingsRepository`.
  - Mock Repositories execute state mutations against `MockDatabaseService` (e.g. check-in updates booking & room state).
  - API Repositories invoke `HttpClient` using backend REST endpoint URLs.
  - `repository.providers.ts` registers injection tokens using `useClass` driven by `environment.useMockApi`.
- **Verification Steps:** Build app and execute mock repository integration test.

---

### TASK-04: CORE-01 - Global Design System, Shared Components & SCSS Theme Setup
- **Objective:** Create the global SCSS design tokens, typography, responsive utilities, and reusable atomic shared components.
- **Dependencies:** `FOUNDATION-01`.
- **Target Files:**
  - `src/styles.scss`, `src/app/shared/styles/_variables.scss`, `src/app/shared/styles/_mixins.scss`
  - `src/app/shared/components/page-header/`
  - `src/app/shared/components/button/`
  - `src/app/shared/components/form-field/`
  - `src/app/shared/components/status-badge/`
  - `src/app/shared/components/priority-badge/`
  - `src/app/shared/components/data-table/`
  - `src/app/shared/components/pagination/`
  - `src/app/shared/components/search-input/`
  - `src/app/shared/components/filter-drawer/`
  - `src/app/shared/components/metric-card/`
  - `src/app/shared/components/confirmation-dialog/`
  - `src/app/shared/components/toast-container/`
  - `src/app/shared/components/skeleton-loader/`
  - `src/app/shared/components/empty-state/`
  - `src/app/shared/components/error-state/`
- **Requirements:**
  - Theme colors: Navy `#11243E`, Gold `#C99B4A`, Background `#F5F7FA`.
  - Build standalone shared UI components with ARIA accessibility labels and full keyboard navigation support.
- **Verification Steps:** Render shared component story suite / smoke test in Angular.

---

### TASK-05: AUTH-01 - Auth State, Interceptors, Guards, Login Component & Session Management
- **Objective:** Implement full authentication workflow, state management, HTTP interceptors, router guards, and login view.
- **Dependencies:** `FOUNDATION-03`, `CORE-01`.
- **Target Files:**
  - `src/app/core/services/auth.service.ts`
  - `src/app/core/interceptors/auth.interceptor.ts`, `loading.interceptor.ts`, `error.interceptor.ts`, `request-id.interceptor.ts`
  - `src/app/core/guards/admin-auth.guard.ts`, `role.guard.ts`, `unauthenticated.guard.ts`, `pending-changes.guard.ts`
  - `src/app/features/authentication/login/login.component.*`
- **Requirements:**
  - `AuthService` manages current user signal & token.
  - Login form using Reactive Forms (email, password, staff code).
  - Interceptors inject Bearer tokens, track active request counts, handle 401/409 errors globally.
  - Guards restrict routes by role (`STAFF`, `ADMIN`, `MANAGER`).
- **Verification Steps:** Test login with `admin@example.com` / `Admin@123` / `STAFF2026`, verify token persistence, test invalid login rejection.

---

### TASK-06: LAYOUT-01 - Admin Shell Layout, Navigation Sidebar, Header & Breadcrumbs
- **Objective:** Build the responsive shell layout featuring persistent/collapsible sidebar, mobile drawer, header bar, and breadcrumb navigation.
- **Dependencies:** `AUTH-01`.
- **Target Files:**
  - `src/app/layout/admin-layout/admin-layout.component.*`
  - `src/app/layout/admin-header/admin-header.component.*`
  - `src/app/layout/admin-sidebar/admin-sidebar.component.*`
  - `src/app/layout/breadcrumb/breadcrumb.component.*`
  - `src/app/layout/mobile-admin-navigation/mobile-admin-navigation.component.*`
  - `src/app/app.routes.ts`
- **Requirements:**
  - Organize 7 nav groups: Overview, Front Desk, Property, Operations, Finance, Insights, Administration.
  - Configure lazy-loaded feature routes with guards.
  - Implement mobile drawer toggle for screens < 768px.
- **Verification Steps:** Navigate across shell routes; test mobile drawer toggle at 390px viewport width.

---

### TASK-07: DASHBOARD-01 - Operational Dashboard Component & Real-time Metrics
- **Objective:** Implement the real-time operational dashboard with metrics, queues, alerts, and 30-second auto-refresh.
- **Dependencies:** `LAYOUT-01`.
- **Target Files:**
  - `src/app/features/dashboard/dashboard.component.*`
- **Requirements:**
  - Display summary cards for total, available, occupied, reserved, cleaning, maintenance rooms, today's check-ins/outs, urgent requests, waiting chats, occupancy %, revenue.
  - Include list panels for Arrivals, Departures, Urgent Requests, Waiting Chats.
  - Auto-refresh every 30s using RxJS `timer`, with manual refresh button & loading skeleton.
- **Verification Steps:** Verify dashboard metrics load correctly and auto-refresh stream unsubscribes on route destroy.

---

### TASK-08: FRONTDESK-01 - Booking Management & Guest Directory Features
- **Objective:** Build the complete booking management workflows (list, details, check-in, checkout, cancellation) and guest directory.
- **Dependencies:** `LAYOUT-01`.
- **Target Files:**
  - `src/app/features/bookings/booking-list/booking-list.component.*`
  - `src/app/features/bookings/booking-detail/booking-detail.component.*`
  - `src/app/features/bookings/check-in-dialog/check-in-dialog.component.*`
  - `src/app/features/bookings/check-out-dialog/check-out-dialog.component.*`
  - `src/app/features/bookings/cancellation-dialog/cancellation-dialog.component.*`
  - `src/app/features/guests/guest-list/guest-list.component.*`
  - `src/app/features/guests/guest-detail/guest-detail.component.*`
- **Requirements:**
  - Multi-column filtering, sorting, pagination, URL query param sync.
  - Check-in Dialog: `CONFIRMED` -> `CHECKED_IN` (updates room to `OCCUPIED`).
  - Checkout Dialog: `CHECKED_IN` -> `COMPLETED` (updates room to `UNDER_CLEANING`, creates Cleaning Task).
  - Cancellation Dialog: Refund preview, reason input, destructive action verification.
  - Guest Directory with identity masking (passwords, payment cards, full government IDs).
- **Verification Steps:** Perform complete check-in, checkout, and cancellation workflows in Mock Mode; verify room state transitions.

---

### TASK-09: FRONTDESK-02 - Service Requests & Front-Desk Chat Features
- **Objective:** Implement service request tracking (List & Kanban views) and front-desk chat inbox with 5s polling.
- **Dependencies:** `LAYOUT-01`.
- **Target Files:**
  - `src/app/features/service-requests/service-request-list/service-request-list.component.*`
  - `src/app/features/service-requests/service-request-board/service-request-board.component.*`
  - `src/app/features/service-requests/service-request-detail/service-request-detail.component.*`
  - `src/app/features/chats/chat-inbox/chat-inbox.component.*`
  - `src/app/features/chats/chat-thread/chat-thread.component.*`
- **Requirements:**
  - Service Requests: Table and Kanban views, status transitions (`PENDING` -> `ACCEPTED` -> `IN_PROGRESS` -> `COMPLETED`), staff assignment modal.
  - Chat Inbox: Responsive 2-panel/drawer view, filter waiting threads, staff assignment, reply form (max 1000 chars), 5s polling via RxJS timer, resolve thread action.
- **Verification Steps:** Assign and complete a service request; test chat reply, 5s polling stream, and resolution.

---

### TASK-010: PROPERTY-01 - Rooms, Room Types, Amenities, Cleaning & Maintenance Operations
- **Objective:** Implement property management (Rooms, Room Types, Amenities) and operational workflows (Housekeeping & Maintenance).
- **Dependencies:** `LAYOUT-01`.
- **Target Files:**
  - `src/app/features/rooms/room-list/room-list.component.*`
  - `src/app/features/rooms/room-form/room-form.component.*`
  - `src/app/features/room-types/room-type-list/room-type-list.component.*`
  - `src/app/features/room-types/room-type-form/room-type-form.component.*`
  - `src/app/features/room-types/amenity-manager/amenity-manager.component.*`
  - `src/app/features/cleaning/cleaning-list/cleaning-list.component.*`
  - `src/app/features/cleaning/cleaning-board/cleaning-board.component.*`
  - `src/app/features/maintenance/maintenance-list/maintenance-list.component.*`
  - `src/app/features/maintenance/maintenance-form/maintenance-form.component.*`
- **Requirements:**
  - Room CRUD: Enforce unique room number, room type reference, HTTPS image URLs, room status overrides.
  - Room Type CRUD: Enforce `minimumPrice <= basePrice <= maximumPrice`.
  - Cleaning Task Completion: Complete task and set room `AVAILABLE` or create Maintenance Record and set room `MAINTENANCE`.
  - Maintenance Issue Tracking: Handle `OPEN` -> `IN_PROGRESS` -> `ON_HOLD` -> `COMPLETED`; set room to `MAINTENANCE` during work.
- **Verification Steps:** Create room, complete cleaning task with maintenance issue flag, verify room status updates to `MAINTENANCE`.

---

### TASK-011: FINANCE-01 - Payments, Refunds, Dynamic Pricing Engine & Reports/CSV Export
- **Objective:** Implement financial transaction ledger, administrative refund processing, dynamic pricing engine, analytics reporting, and safe CSV export.
- **Dependencies:** `LAYOUT-01`.
- **Target Files:**
  - `src/app/features/payments/payment-list/payment-list.component.*`
  - `src/app/features/payments/refund-dialog/refund-dialog.component.*`
  - `src/app/features/pricing/pricing-rules/pricing-rules.component.*`
  - `src/app/features/pricing/pricing-preview/pricing-preview.component.*`
  - `src/app/features/reports/revenue-report/revenue-report.component.*`
  - `src/app/features/reports/booking-report/booking-report.component.*`
  - `src/app/features/reports/occupancy-report/occupancy-report.component.*`
  - `src/app/features/reports/service-report/service-report.component.*`
- **Requirements:**
  - Payment Ledger: Filter by method, status; open Refund Dialog (validating requested amount <= remaining balance; updating status to `PARTIALLY_REFUNDED` or `REFUNDED`).
  - Dynamic Pricing: Rule management, range overlap detection, demand price calculator, global toggle, recalculation trigger.
  - Reports: Accessible dynamic chart summaries, metric tables, safe CSV export scrubbing PII/secrets.
- **Verification Steps:** Process a partial refund; test dynamic pricing overlap rejection; trigger CSV export.

---

### TASK-012: SETTINGS-01 - Hotel Settings, Route Protection, Accessibility, Testing & Build Verification
- **Objective:** Implement multi-tab hotel configuration settings, unsaved form guards, comprehensive test suite, accessibility audit, and production build validation.
- **Dependencies:** `TASK-01` through `TASK-11`.
- **Target Files:**
  - `src/app/features/settings/hotel-settings/hotel-settings.component.*`
  - `src/app/features/settings/operations-settings/operations-settings.component.*`
  - `src/app/features/settings/pricing-settings/pricing-settings.component.*`
  - `src/app/**/*.spec.ts`
- **Requirements:**
  - Multi-tab settings form (Identity, Operations, Finance, Pricing); `pendingChangesGuard` dirty state warning; update cached settings.
  - Unit tests for core utilities, mock repository tests, component route tests.
  - Mobile, tablet, desktop responsive check; WCAG accessibility verification (keyboard focus, ARIA tags).
  - Validate production build (`ng build --configuration=production`).
- **Verification Steps:** Execute `ng test` (all tests passing) and `ng build --configuration=production` (zero compilation errors).

---

## 7. Recommended Execution Order

```
Phase 1: Foundation Setup (TASK-01 -> TASK-02 -> TASK-03)
  └── Establish core models, seed assets, mock database engine, and repository contracts.

Phase 2: UI System & Authentication (TASK-04 -> TASK-05 -> TASK-06)
  └── Build design system, shared UI components, auth state/guards, login, and admin shell navigation.

Phase 3: Core Front-Desk & Operational Workflows (TASK-07 -> TASK-08 -> TASK-09)
  └── Deliver real-time dashboard, booking management (check-in/out), guest directory, service requests, and chat inbox.

Phase 4: Property & Field Operations (TASK-10)
  └── Deliver rooms, room types, amenities, housekeeping queue, and maintenance issue management.

Phase 5: Financial Operations, Dynamic Pricing & Analytics (TASK-11)
  └── Deliver payment ledger, refund modal, occupancy dynamic pricing engine, reports, and safe CSV export.

Phase 6: Administration, Testing & Release Hardening (TASK-12)
  └── Complete hotel settings, unsaved form guards, unit/component tests, accessibility validation, and production build verification.
```

---

## 8. Dependency Map

```
TASK-01 (FOUNDATION-01: Types, Enums & Utilities)
  ├──> TASK-02 (FOUNDATION-02: Seed Data & Mock Database)
  │      └──> TASK-03 (FOUNDATION-03: Repository Contracts & Implementations)
  │             └──> TASK-05 (AUTH-01: Auth State, Interceptors & Login)
  │                    └──> TASK-06 (LAYOUT-01: Shell & Router Navigation)
  │                           ├──> TASK-07 (DASHBOARD-01: Operational Dashboard)
  │                           ├──> TASK-08 (FRONTDESK-01: Bookings & Guest Directory)
  │                           ├──> TASK-09 (FRONTDESK-02: Service Requests & Chat)
  │                           ├──> TASK-10 (PROPERTY-01: Rooms, Cleaning & Maintenance)
  │                           └──> TASK-11 (FINANCE-01: Payments, Pricing & Reports)
  │                                  └──> TASK-12 (SETTINGS-01: Settings, Tests & Build)
  └──> TASK-04 (CORE-01: Design System & Shared Components) ───┘
```

---

## 9. Milestones

- **Milestone 1: Foundation Ready** (Tasks 01, 02, 03 completed) - Data contracts, seed data, and repository layer operational.
- **Milestone 2: Navigation & Auth Live** (Tasks 04, 05, 06 completed) - Design system ready, admin login and main shell running.
- **Milestone 3: Front-Desk Operational** (Tasks 07, 08, 09 completed) - Dashboard live, bookings check-in/checkout working, chat polling functional.
- **Milestone 4: Property & Field Operations Ready** (Task 10 completed) - Room management, housekeeping board, and maintenance complete.
- **Milestone 5: Finance & Analytics Complete** (Task 11 completed) - Refund processing, dynamic pricing engine, and CSV export active.
- **Milestone 6: Production & Integration Ready** (Task 12 completed) - All settings operational, unit/repo tests passing, production build succeeded.

---

## 10. Risk Register

| Risk Event | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **API Contract Mismatch** | High | Abstract components behind repository contracts; enforce exact field names matching `Backend Development Guide.md`. |
| **Mock vs. API Divergence** | High | `MockDatabaseService` reproduces business rules (e.g. status transitions, refund balance checks, cleaning task auto-creation). |
| **Memory Leak in Polling / Subscriptions** | Medium | Use Angular 19 `destroyRef` or `takeUntilDestroyed` for all RxJS timers and polling streams. |
| **Form Unsaved Data Loss** | Medium | Enforce `pendingChangesGuard` on dirty room, pricing, maintenance, and settings forms. |
| **PII / Financial Data Leakage** | High | Mask passwords, tokens, full credit card numbers, CVVs, and government IDs across UI components and CSV exports. |
| **Responsive Layout Overflow** | Medium | Define clear breakpoint behaviors (360px cards, 768px collapsible drawers, 1440px tables) tested during verification. |

---

## 11. First Coding Task Recommendation

- **Recommended First Task:** `TASK-01: FOUNDATION-01 - Dependencies, Environments, Core Models, Enums, and Utilities Setup`
- **Why First:** Establishes the foundational type safety, core domain models, environment configs, custom validators, and utility formatters required by every subsequent task.
- **Files Involved:**
  - `package.json`, `angular.json`
  - `src/environments/environment.ts`, `src/environments/environment.mock.ts`, `src/environments/environment.production.ts`
  - `src/app/core/enums/*.ts`
  - `src/app/core/models/*.ts`
  - `src/app/core/constants/*.ts`
  - `src/app/core/utilities/*.ts`
  - `src/app/core/validators/*.ts`
- **Verification Method:** Successful `npm install` and clean TypeScript build via `ng build`.

---

## 12. Task Tracker Checklist

- [ ] **TASK-01 (FOUNDATION-01):** Dependencies, Environments, Core Models, Enums, and Utilities Setup
- [ ] **TASK-02 (FOUNDATION-02):** Mock Database Engine & Seed Asset Files
- [ ] **TASK-03 (FOUNDATION-03):** Repository Contracts, Mock Repositories, API Repositories & Provider Registry
- [ ] **TASK-04 (CORE-01):** Global Design System, Shared Components & SCSS Theme Setup
- [ ] **TASK-05 (AUTH-01):** Auth State, Interceptors, Guards, Login Component & Session Management
- [ ] **TASK-06 (LAYOUT-01):** Admin Shell Layout, Navigation Sidebar, Header & Breadcrumbs
- [ ] **TASK-07 (DASHBOARD-01):** Operational Dashboard Component & Real-time Metrics
- [ ] **TASK-08 (FRONTDESK-01):** Booking Management & Guest Directory Features
- [ ] **TASK-09 (FRONTDESK-02):** Service Requests & Front-Desk Chat Features
- [ ] **TASK-10 (PROPERTY-01):** Rooms, Room Types, Amenities, Cleaning & Maintenance Operations
- [ ] **TASK-11 (FINANCE-01):** Payments, Refunds, Dynamic Pricing Engine & Reports/CSV Export
- [ ] **TASK-12 (SETTINGS-01):** Hotel Settings, Route Protection, Accessibility, Testing & Build Verification
