**SmartStay**

**Complete Angular Admin Panel Development Specification**

## *Unified implementation contract for the complete administrator, manager, and staff frontend*

| Document item | Value |
| :---- | :---- |
| System | SmartStay, single-hotel management system |
| Frontend | Angular standalone application with strict TypeScript and SCSS |
| Developer scope | Complete admin panel, combining all former Part A and Part B responsibilities |
| Backend | Java 17 Spring Boot REST API with Spring JDBC and MySQL |
| Operation modes | Mock Mode and API Mode |
| Default admin URL | http://localhost:4300 |
| API base URL | http://localhost:8080/api/v1 |
| Currency and timezone | INR and Asia/Kolkata |

**Primary objective:** Build one coherent, responsive, secure, and modular Angular admin application that can be demonstrated without APIs and later connected to the Spring Boot backend without rewriting feature pages.

Prepared as the single authoritative admin frontend document. Where this document conflicts with earlier Part A or Part B documents, this unified document takes precedence.

# **Contents**

1. 1\. Scope and ownership  
2. 2\. Technology and project creation  
3. 3\. Architecture and coding rules  
4. 4\. Folder structure  
5. 5\. Environments and application configuration  
6. 6\. Shared contracts, enums, and models  
7. 7\. Authentication, authorization, guards, and interceptors  
8. 8\. Mock Mode architecture  
9. 9\. Admin shell and navigation  
10. 10\. Dashboard  
11. 11\. Booking management  
12. 12\. Guest directory  
13. 13\. Service request management  
14. 14\. Front-desk chat  
15. 15\. Room and room-type management  
16. 16\. Cleaning management  
17. 17\. Maintenance management  
18. 18\. Payments and refunds  
19. 19\. Dynamic pricing  
20. 20\. Reports and CSV export  
21. 21\. Hotel settings  
22. 22\. Validation and security  
23. 23\. Loading, errors, accessibility, and responsive UI  
24. 24\. API endpoint contract  
25. 25\. Testing strategy  
26. 26\. Collaboration and release management  
27. 27\. Implementation sequence  
28. 28\. Presentation scenarios  
29. 29\. Definition of done

**Navigation note:** The document uses Word heading styles. In Microsoft Word, use References \> Table of Contents if you want to insert an automatic page-numbered table of contents.

# **1\. Scope and Ownership**

This frontend is the complete SmartStay admin panel. It serves operational staff, administrators, and managers for a single hotel. The same Angular application contains all administrative domains and uses one shared layout, authentication state, repository layer, mock database, design system, and error-handling strategy.

## **1.1 Included modules**

* Admin login and session restoration  
* Role-based navigation for STAFF, ADMIN, and MANAGER  
* Operational dashboard  
* Booking search, details, check-in, checkout, and cancellation  
* Guest directory and stay history  
* Service request list, Kanban workflow, assignment, and completion  
* Front-desk chat inbox, assignment, replies, polling, and resolution  
* Room, room-type, amenity, and image metadata management  
* Cleaning task list, board, assignment, start, and completion  
* Maintenance issue creation, assignment, progress, hold, and completion  
* Payment search, payment details, refund history, and dummy refund processing  
* Dynamic pricing rules, preview, enable/disable, and recalculation  
* Revenue, booking, occupancy, and service reports  
* CSV export  
* Hotel, operational, financial, and pricing settings  
* Mock Mode with JSON seed data and local persistence  
* API Mode using Rohit Naik’s Spring Boot endpoints  
* Unit, repository, component, route, integration, accessibility, and responsive testing

## **1.2 Explicitly outside the admin frontend**

* Customer-facing landing page, registration, room browsing, booking form, and customer account pages  
* Authoritative authentication, authorization, pricing, payment, refund, passcode, booking-conflict, and database rules  
* SQL schema and queries  
* Real payment gateway integration  
* Physical smart-lock integration  
* Real-time WebSocket chat for the first release; polling is sufficient  
* Uploading and storing image files; the first version manages image URLs and metadata

**Security boundary:** The admin frontend improves usability and prevents accidental invalid actions, but the backend is authoritative. Hidden buttons, disabled fields, route guards, and mock calculations are not substitutes for server authorization and validation.

# **2\. Technology and Project Creation**

| Area | Standard |
| :---- | :---- |
| Framework | Angular standalone application |
| Language | Strict TypeScript; no any |
| Forms | Reactive Forms |
| Styling | SCSS and CSS custom properties |
| HTTP | Angular HttpClient behind API repositories |
| State | Signals for local shared state; RxJS for asynchronous flows |
| Routing | Lazy-loaded feature routes |
| Icons | Lucide Angular |
| Optional UI utility | Angular CDK for dialogs, overlays, and drag-and-drop |
| Testing | Angular test stack used by the selected CLI version |
| Port | 4300 |
| Node and Angular versions | Versions mutually supported by the selected Angular CLI and company environment |

## **2.1 Project commands**

ng new smartstay-admin-frontend \--standalone \--routing \--style=scss \--strict  
cd smartstay-admin-frontend  
npm install  
npm install lucide-angular date-fns @angular/cdk  
ng serve \--configuration=mock \--port 4300  
ng serve \--configuration=development \--port 4300  
ng build \--configuration=production  
ng test

## **2.2 Project rules**

* Use the same package.json and package-lock.json throughout the project.  
* Document every new dependency and its purpose.  
* Do not combine multiple competing UI frameworks.  
* Use Angular built-ins, SCSS, CDK, and Lucide unless a new dependency is justified.  
* Keep the application compilable after every implementation task.

# **3\. Architecture and Coding Rules**

## **3.1 Required data flow**

Page Component  
  \-\> Repository Contract  
      \-\> Mock Repository \-\> MockDatabaseService \-\> JSON seed/localStorage  
      \-\> API Repository  \-\> HttpClient \-\> Spring Boot API

Components may display data, own page-specific UI state, build forms, call repository contracts, and handle loading or error states. Components must not call HttpClient, read JSON, write localStorage, inspect useMockApi, or contain authoritative business rules.

## **3.2 Layer responsibilities**

| Layer | Responsibility |
| :---- | :---- |
| Feature component | Presentation, interaction, forms, route state, page state |
| Shared component | Reusable UI behavior without domain-specific API knowledge |
| Repository contract | Stable interface consumed by components |
| API repository | Endpoint calls and mapping backend responses to frontend models |
| Mock repository | Equivalent behavior using the shared mock database |
| State service | Authentication, loading, sidebar, settings cache, and other shared state |
| MockDatabaseService | Initial seed loading, storage migration, reads, writes, reset |
| Interceptor | Cross-cutting HTTP behavior such as JWT, errors, loading, request ID |
| Guard | Navigation decisions; never the only authorization layer |
| Utility/validator | Pure reusable calculation or validation |

## **3.3 Code-quality rules**

* No any types.  
* Use readonly where appropriate.  
* Use interfaces and union types for stable contracts.  
* Centralize endpoints, routes, labels, storage keys, and status mappings.  
* Avoid nested subscriptions; compose RxJS streams or use controlled async boundaries.  
* Stop polling and subscriptions when components are destroyed.  
* Prevent duplicate submissions.  
* Map backend inconsistencies only in API repositories.  
* Preserve documented field names, enum values, and API paths.  
* Use BigDecimal-equivalent server values as numbers only for display and mock calculations; format currency centrally.

# **4\. Unified Folder Structure**

smartstay-admin-frontend/  
├── angular.json  
├── package.json  
├── package-lock.json  
├── README.md  
├── VERSION.txt  
├── API\_CHANGE\_LOG.txt  
├── docs/  
│   ├── ADMIN\_ROUTES.md  
│   ├── MOCK\_MODE.md  
│   ├── API\_INTEGRATION.md  
│   ├── TEST\_SCENARIOS.md  
│   └── UI\_GUIDELINES.md  
├── src/  
│   ├── environments/  
│   │   ├── environment.ts  
│   │   ├── environment.mock.ts  
│   │   └── environment.production.ts  
│   ├── assets/  
│   │   ├── images/  
│   │   ├── icons/  
│   │   └── mock-data/  
│   │       ├── admin-users.json  
│   │       ├── users.json  
│   │       ├── room-types.json  
│   │       ├── rooms.json  
│   │       ├── bookings.json  
│   │       ├── payments.json  
│   │       ├── refunds.json  
│   │       ├── service-requests.json  
│   │       ├── chat-threads.json  
│   │       ├── notifications.json  
│   │       ├── cleaning-tasks.json  
│   │       ├── maintenance-records.json  
│   │       ├── pricing-rules.json  
│   │       ├── price-snapshots.json  
│   │       └── hotel-settings.json  
│   └── app/  
│       ├── app.component.\*  
│       ├── app.config.ts  
│       ├── app.routes.ts  
│       ├── core/  
│       │   ├── constants/  
│       │   ├── enums/  
│       │   ├── models/  
│       │   ├── guards/  
│       │   ├── interceptors/  
│       │   ├── repositories/  
│       │   │   ├── contracts/  
│       │   │   ├── api/  
│       │   │   ├── mock/  
│       │   │   └── repository.providers.ts  
│       │   ├── services/  
│       │   ├── validators/  
│       │   └── utilities/  
│       ├── layout/  
│       │   ├── admin-layout/  
│       │   ├── admin-header/  
│       │   ├── admin-sidebar/  
│       │   ├── breadcrumb/  
│       │   └── mobile-admin-navigation/  
│       ├── shared/  
│       │   ├── components/  
│       │   ├── directives/  
│       │   └── pipes/  
│       └── features/  
│           ├── authentication/  
│           ├── dashboard/  
│           ├── bookings/  
│           ├── guests/  
│           ├── service-requests/  
│           ├── chats/  
│           ├── rooms/  
│           ├── room-types/  
│           ├── cleaning/  
│           ├── maintenance/  
│           ├── payments/  
│           ├── pricing/  
│           ├── reports/  
│           ├── settings/  
│           └── errors/  
└── dist/

Shared components should include page header, button, form field, status badge, priority badge, data table, pagination, search input, filter drawer, metric card, confirmation dialog, toast container, empty state, error state, skeleton loader, user avatar, timeline, and chart summary components.

# **5\. Environments and Application Configuration**

## **5.1 Mock environment**

export const environment \= {  
  production: false,  
  useMockApi: true,  
  apiBaseUrl: 'http://localhost:8080/api/v1',  
  mockDataPath: 'assets/mock-data',  
  mockDelayMs: 500,  
  chatPollingIntervalMs: 5000,  
  dashboardRefreshIntervalMs: 30000,  
  enableMockControls: true,  
  currency: 'INR',  
  timezone: 'Asia/Kolkata'  
};

## **5.2 Development and production**

* Development sets useMockApi to false and uses localhost:8080.  
* Production sets useMockApi to false, normally uses /api/v1, disables mock controls, and enables optimizations.  
* Mock, development, and production configurations must be explicit in angular.json.  
* Mock-only routes and controls must be guarded by environment configuration and excluded from normal navigation.

# **6\. Shared Contracts, Enums, and Models**

## **6.1 Response wrappers**

export interface ApiResponse\<T\> {  
  success: boolean;  
  message: string;  
  data: T;  
  timestamp: string;  
}

export interface PageData\<T\> {  
  items: T\[\];  
  page: number;  
  size: number;  
  totalItems: number;  
  totalPages: number;  
}

export interface ApiError {  
  success: false;  
  code: string;  
  message: string;  
  fieldErrors?: Record\<string, string\>;  
  path?: string;  
  timestamp: string;  
  traceId?: string;  
}

## **6.2 Required status values**

| Domain | Allowed API values |
| :---- | :---- |
| Role | CUSTOMER, STAFF, ADMIN, MANAGER |
| Booking | PENDING\_PAYMENT, CONFIRMED, CHECKED\_IN, COMPLETED, CANCELLED |
| Room | AVAILABLE, RESERVED, OCCUPIED, UNDER\_CLEANING, MAINTENANCE |
| Payment | INITIATED, PENDING, SUCCESS, FAILED, REFUNDED, PARTIALLY\_REFUNDED |
| Payment method | CARD, UPI, CASH |
| Refund | PENDING, SUCCESS, FAILED |
| Service request | PENDING, ACCEPTED, IN\_PROGRESS, COMPLETED, CANCELLED |
| Cleaning | PENDING, ASSIGNED, IN\_PROGRESS, COMPLETED, CANCELLED |
| Maintenance | OPEN, ASSIGNED, IN\_PROGRESS, ON\_HOLD, COMPLETED, CANCELLED |
| Chat | OPEN, WAITING\_FOR\_ADMIN, ASSIGNED, RESOLVED, CLOSED |
| Chat mode | BOT, ADMIN |
| Priority | LOW, MEDIUM, HIGH, URGENT |
| Pricing adjustment | PERCENTAGE\_DISCOUNT, PERCENTAGE\_MARKUP, FIXED\_DISCOUNT, FIXED\_MARKUP, NO\_ADJUSTMENT |

Display labels must be mapped separately. Never alter API enum strings to produce UI labels.

## **6.3 Core model checklist**

* Admin user and authentication response  
* Dashboard summary and dashboard list items  
* Booking summary, details, filters, check-in, checkout, and cancellation requests  
* Guest summary, details, and stay history  
* Service request, filters, assignment, and status update requests  
* Chat thread summary, details, message, filters, and reply request  
* Room summary, room details, room type, amenity, and room image  
* Cleaning task and operation requests  
* Maintenance record and operation requests  
* Payment summary, payment details, refund, and refund result  
* Pricing rule, preview, snapshot, recalculation result, and dynamic pricing state  
* Revenue, booking, occupancy, and service report models  
* Hotel settings and update request

**Contract rule:** Repositories may map backend shapes, but components must consume the canonical frontend models defined in core/models.

# **7\. Authentication, Authorization, Guards, and Interceptors**

## **7.1 Seeded administrator accounts**

| Role | Email | Password | Staff code |
| :---- | :---- | :---- | :---- |
| ADMIN | admin@example.com | Admin@123 | STAFF2026 |
| MANAGER | manager@example.com | Manager@123 | STAFF2027 |
| STAFF | staff@example.com | Staff@123 | STAFF2028 |

## **7.2 Login form and behavior**

* Fields: email, password, staff code, show password, optional remember session.  
* Normalize email, but never silently trim or modify the password.  
* Reject CUSTOMER role from the admin application.  
* Use generic visible credential errors.  
* After login, navigate to the return URL or /admin/dashboard.  
* Store only the token and sanitized current user, never mock passwords or staff codes.  
* Remove all admin session state on logout or expired token.

## **7.3 Permission model**

| Capability | STAFF | ADMIN | MANAGER |
| :---- | :---- | :---- | :---- |
| Operational dashboard | Yes | Yes | Yes |
| Bookings/check-in/checkout | Yes | Yes | Yes |
| Service requests/chat | Yes | Yes | Yes |
| Room and task operations | Limited | Yes | Yes |
| Refunds | No or limited | Yes | Yes |
| Pricing rules | No | Yes | Yes |
| Financial reports | No | Limited | Yes |
| Hotel settings | No | No or limited | Yes |
| Exceptional state correction | No | No | Backend-authorized only |

## **7.4 Guards**

* adminAuthGuard: requires a current authenticated admin user.  
* roleGuard: checks route metadata against STAFF, ADMIN, or MANAGER.  
* unauthenticatedGuard: redirects logged-in administrators away from login.  
* pendingChangesGuard: protects dirty room, room-type, maintenance, pricing, and settings forms.

## **7.5 Functional interceptors**

provideHttpClient(withInterceptors(\[  
  authInterceptor,  
  loadingInterceptor,  
  errorInterceptor,  
  requestIdInterceptor  
\]));

* Authentication interceptor adds Bearer token only to SmartStay API URLs.  
* Loading interceptor uses an active-request counter.  
* Error interceptor handles 400, 401, 403, 404, 409, 422, and 500 consistently.  
* Request-ID interceptor sends a generated client request ID for tracing.  
* A 401 clears the session and redirects to login.  
* A 409 preserves user input and explains the stale-state or business conflict.

# **8\. Mock Mode Architecture**

## **8.1 Purpose**

Mock Mode must support real demonstrations before the backend exists. Static JSON alone is insufficient because it cannot preserve check-ins, checkout-created cleaning tasks, refunds, chat replies, pricing changes, or settings updates.

## **8.2 Startup sequence**

30. Check for smartstay\_admin\_mock\_database\_v1 in localStorage.  
31. Check the stored mock schema version.  
32. If current data exists, load and validate it.  
33. Otherwise, load all JSON seed files.  
34. Build one AdminMockDatabase object.  
35. Persist it through MockDatabaseService.  
36. Expose typed read and update operations to mock repositories.

## **8.3 Shared mock database collections**

adminUsers, users, roomTypes, amenities, rooms, bookings,  
payments, refunds, serviceRequests, chatThreads, notifications,  
cleaningTasks, maintenanceRecords, pricingRules, priceSnapshots,  
hotelSettings

## **8.4 Persistence and reset**

* Use one shared storage key, not one key per feature.  
* Use a schema version and migration or reset strategy.  
* Make updates atomically within MockDatabaseService.  
* Add artificial delay so loading and duplicate-submission behavior can be tested.  
* Provide a Mock Mode-only Reset Sample Data action.  
* Reset clears mock state and admin session, reloads seed data, and returns to login.

## **8.5 Cross-application limitation**

The customer app on port 4200 and admin app on port 4300 have different browser origins and cannot share normal localStorage. Independent Mock Mode is sufficient for page development. Full customer-to-admin chat and data synchronization must be tested in API Mode against Spring Boot.

# **9\. Admin Shell and Navigation**

The admin shell contains a persistent desktop sidebar, collapsible tablet sidebar, mobile drawer, header, breadcrumb, content outlet, global loading indicator, toast container, and account menu.

## **9.1 Navigation groups**

* Overview: Dashboard  
* Front Desk: Bookings, Guests, Service Requests, Chats  
* Property: Rooms, Room Types, Amenities  
* Operations: Cleaning, Maintenance  
* Finance: Payments, Pricing  
* Insights: Reports  
* Administration: Settings

## **9.2 Route map**

/admin/login  
/admin/dashboard  
/admin/bookings  
/admin/bookings/:bookingId  
/admin/guests  
/admin/guests/:guestId  
/admin/service-requests  
/admin/service-requests/board  
/admin/service-requests/:requestId  
/admin/chats  
/admin/chats/:threadId  
/admin/rooms  
/admin/rooms/new  
/admin/rooms/:roomId  
/admin/rooms/:roomId/edit  
/admin/room-types  
/admin/room-types/new  
/admin/room-types/:roomTypeId/edit  
/admin/amenities  
/admin/cleaning  
/admin/cleaning/board  
/admin/cleaning/:taskId  
/admin/maintenance  
/admin/maintenance/new  
/admin/maintenance/:maintenanceId  
/admin/payments  
/admin/payments/:paymentId  
/admin/pricing  
/admin/pricing/rules  
/admin/pricing/rules/new  
/admin/pricing/rules/:ruleId/edit  
/admin/pricing/preview  
/admin/reports  
/admin/reports/revenue  
/admin/reports/bookings  
/admin/reports/occupancy  
/admin/reports/services  
/admin/settings  
/admin/settings/hotel  
/admin/settings/operations  
/admin/settings/pricing

# **10\. Dashboard**

## **10.1 Metrics**

* Total, available, occupied, reserved, under-cleaning, and maintenance rooms  
* Today’s check-ins and checkouts  
* Pending and urgent service requests  
* Waiting front-desk chats  
* Current occupancy percentage  
* Today’s revenue, monthly revenue, and optionally refunded amount

## **10.2 Sections and actions**

* Today’s arrivals  
* Today’s departures  
* Urgent service requests  
* Waiting chats  
* Room status summary  
* Recent booking activity  
* Operational alerts  
* Quick actions for booking search, check-in, checkout, service board, chat inbox, and guest directory

## **10.3 Behavior**

* Refresh button and last-updated timestamp.  
* Optional 30-second refresh with no overlapping requests.  
* Mock metrics should be calculated from current mock collections wherever practical.  
* Stop refresh when the component is destroyed.  
* Use skeleton cards, meaningful empty states, and partial-error handling.

# **11\. Booking Management**

## **11.1 Booking list**

* Desktop columns: reference, guest, room, check-in, checkout, guest count, amount, payment, booking status, actions.  
* Mobile cards replace wide tables.  
* Filters: reference, customer name/email, room number, booking status, payment status, check-in range, checkout range, created range.  
* Sort: newest, oldest, check-in ascending/descending, amount ascending/descending, guest name.  
* Store filters in route query parameters, debounce text search, reset page after filter changes, and restore state after returning from details.

## **11.2 Details**

* Booking header and status  
* Guest and room details  
* Stay information  
* Price and payment summaries  
* Special requests  
* Activity timeline  
* Related service requests  
* Context-sensitive actions

## **11.3 Check-in workflow**

* Available only for CONFIRMED bookings.  
* Dialog shows booking, guest, room, expected time, payment state, identity verification, room-ready confirmation, and administrative notes.  
* Mock success updates booking to CHECKED\_IN, room to OCCUPIED, actual check-in time, customer notification, and dashboard.  
* Backend response is authoritative in API Mode.

## **11.4 Checkout workflow**

* Available only for CHECKED\_IN bookings.  
* Dialog contains outstanding-payment warning, issue notes, cleaning required, maintenance required, and maintenance notes.  
* Success changes booking to COMPLETED, passcode to expired, room to UNDER\_CLEANING, creates a cleaning task, creates a notification, and enables feedback.  
* If maintenance is required, create the agreed maintenance record or flag through the backend transaction.

## **11.5 Cancellation**

* Normally allowed for PENDING\_PAYMENT and CONFIRMED.  
* Require reason, notify-guest choice, refund preview, confirmation checkbox, and destructive-action confirmation.  
* Final refund and room availability are server-authoritative.  
* Do not allow normal cancellation for CHECKED\_IN, COMPLETED, or CANCELLED.

# **12\. Guest Directory**

List columns include guest ID, name, email, phone, current stay, upcoming booking, total bookings, last stay, account status, and actions.

## **12.1 Filters**

* Name, email, phone  
* Current guest, upcoming guest, or past guest  
* Account status  
* Registration date

## **12.2 Guest details**

* Basic profile and contact information  
* Masked identity information  
* Current stay  
* Upcoming bookings  
* Previous bookings  
* Service-request history  
* Chat history  
* Feedback history when authorized  
* Operational notes when supported

**Sensitive data:** Never show passwords, hashes, staff codes, JWTs, full government IDs, CVV, UPI PIN, or full payment credentials.

# **13\. Service Request Management**

Provide table and Kanban views, request details, assignment dialog, filters, status actions, timestamps, and customer context.

## **13.1 Board and filters**

* Columns: Pending, Accepted, In Progress, Completed.  
* Cancelled requests are available through filters.  
* Filters: reference, category, priority, status, room, guest, assigned staff, date, unassigned only.  
* Cards show reference, category, title, room, guest, priority, status, employee, age, and created time.

## **13.2 Allowed transitions**

PENDING \-\> ACCEPTED \-\> IN\_PROGRESS \-\> COMPLETED  
PENDING \-\> CANCELLED  
ACCEPTED \-\> CANCELLED

Reject COMPLETED to IN\_PROGRESS, CANCELLED to ACCEPTED, and PENDING directly to COMPLETED. Mock repositories must set acceptedAt, startedAt, and completedAt, create customer notifications, persist changes, and update dashboard values.

Drag-and-drop is optional. If used, it must not be the only status control. Validate the transition, perform the repository call, move the card only after success, and restore it after failure.

# **14\. Front-Desk Chat**

The customer application performs bot matching and escalation. The admin application manages escalated threads.

## **14.1 Layout and filters**

* Desktop: thread list, conversation, and customer/booking context.  
* Tablet: two panels with context drawer.  
* Mobile: list and conversation as separate views.  
* Filters: waiting, assigned to me, open, resolved, closed, unread, all, customer, booking, room, employee, date.

## **14.2 Workflow**

37. Open a WAITING\_FOR\_ADMIN thread.  
38. Assign it to the current administrator.  
39. Load customer and booking context.  
40. Send typed replies of no more than 1,000 characters.  
41. Mark customer messages read.  
42. Poll every five seconds for updates.  
43. Allow failed-message retry.  
44. Resolve with confirmation and optional closing message.

## **14.3 Polling rules**

* Start only while a conversation is open.  
* Stop on route exit, logout, or component destruction.  
* Avoid duplicate polling subscriptions.  
* Do not disturb scroll position when the administrator is reading older messages.  
* Mock Mode includes clearly marked controls to add a mock customer message or escalation.

# **15\. Room, Room-Type, Amenity, and Image Management**

## **15.1 Room list and details**

* Columns: room, type, floor, capacity, base price, current price, status, active, rating, actions.  
* Filters: ID or number, type, floor, status, active, price range, capacity, maintenance state.  
* Search accepts database ID, public ID such as RM-101, or room number 101, but resolved internal calls use the database ID.  
* Details show amenities, image metadata, current booking, pending cleaning task, open maintenance, and timestamps.

## **15.2 Room form**

* Room number, room type, floor, description, active state, optional room-specific image URLs.  
* Room number is required and unique.  
* Room type must exist and be active.  
* Image URLs must use safe HTTPS schemes.  
* Initial status is normally AVAILABLE.

## **15.3 Room states**

Valid examples:  
AVAILABLE \-\> RESERVED  
RESERVED \-\> OCCUPIED  
OCCUPIED \-\> UNDER\_CLEANING  
UNDER\_CLEANING \-\> AVAILABLE  
AVAILABLE \-\> MAINTENANCE  
MAINTENANCE \-\> UNDER\_CLEANING or AVAILABLE

Manual overrides require manager permission, a reason, and backend audit behavior. Do not directly allow OCCUPIED to AVAILABLE or MAINTENANCE to OCCUPIED.

## **15.4 Room types**

* Fields: name, code, description, base/minimum/maximum prices, adult and child capacity, bed type, room size, amenities, images, active state.  
* Require minimumPrice \<= basePrice \<= maximumPrice.  
* Name and code are unique; normalize code to uppercase.  
* Do not delete room types referenced by rooms or history; deactivate them.

## **15.5 Amenities and images**

* Amenities have name, optional icon name, active state, and usage count.  
* Room images have URL, alternative text, display order, active state, and primary-image designation.  
* Require meaningful alt text and HTTPS URLs.  
* Reject unsafe schemes such as javascript:.  
* Provide preview, reorder, primary selection, and fallback display.

# **16\. Cleaning Management**

Provide table, board, details, assignment, start, and completion workflows.

## **16.1 Cleaning states**

PENDING \-\> ASSIGNED \-\> IN\_PROGRESS \-\> COMPLETED  
PENDING \-\> IN\_PROGRESS  
PENDING or ASSIGNED \-\> CANCELLED

Reject PENDING directly to COMPLETED, COMPLETED to IN\_PROGRESS, and CANCELLED to ASSIGNED.

## **16.2 Completion**

* Fields: completion notes, room inspected, room ready, maintenance issue found, conditional maintenance description.  
* If ready, complete task and set room AVAILABLE.  
* If an issue is found, complete task, create OPEN maintenance record, and set room MAINTENANCE.  
* Persist the operation atomically in Mock Mode and rely on one backend transaction in API Mode.

## **16.3 Checkout integration**

Guest checkout \-\> Booking COMPLETED \-\> Room UNDER\_CLEANING \-\> Cleaning task PENDING

# **17\. Maintenance Management**

Features include list, board, details, creation, assignment, start, hold, resume, completion, cancellation, room history, and duplicate-open-issue warning.

## **17.1 States**

OPEN \-\> ASSIGNED or IN\_PROGRESS  
ASSIGNED \-\> IN\_PROGRESS  
IN\_PROGRESS \-\> ON\_HOLD \-\> IN\_PROGRESS  
IN\_PROGRESS \-\> COMPLETED  
OPEN or ASSIGNED \-\> CANCELLED

## **17.2 Operational effects**

* Blocking work sets the room to MAINTENANCE.  
* Completion requires resolution notes, room-ready decision, and cleaning-required decision.  
* If cleaning is required, create a cleaning task and set UNDER\_CLEANING.  
* If ready and no other blocking issue exists, set AVAILABLE.  
* If another blocking issue remains, keep MAINTENANCE.

# **18\. Payments and Refunds**

## **18.1 Payment management**

* Search by payment reference, booking, customer, method, status, amount, date, and refund state.  
* Display amount, refunded amount, refundable amount, currency, dummy gateway, dummy transaction reference, dates, failure reason, and refund history.  
* Never display full card numbers, CVV, UPI PIN, or real banking information.

## **18.2 Refund workflow**

* Visible only to authorized roles and eligible successful or partially refunded payments.  
* Dialog shows original amount, previous refunds, maximum refundable amount, requested amount, reason, and confirmation.  
* Amount must be positive and not exceed the remaining balance.  
* Full refund produces REFUNDED; partial refund produces PARTIALLY\_REFUNDED.  
* Mock Mode creates the refund record, updates payment state, creates a customer notification, and persists.  
* API Mode trusts the server’s final refundable balance and outcome.

# **19\. Dynamic Pricing**

## **19.1 Default demand rules**

| Occupancy | Default adjustment |
| :---- | :---- |
| Below 30% | 10% discount |
| 30% to below 70% | No adjustment |
| 70% and above | 15% markup |

## **19.2 Rule management**

* Fields: rule name, room type, minimum and maximum occupancy, adjustment type, adjustment value, allowed minimum and maximum price, active state.  
* Occupancy ranges remain within 0 to 100\.  
* Detect overlapping active ranges for the same room type.  
* Define interval boundaries consistently: 0 \<= x \< 30, 30 \<= x \< 70, 70 \<= x \<= 100\.

## **19.3 Preview and recalculation**

* Preview room type, date, base price, total bookable rooms, occupied rooms, occupancy, rule, calculated price, final clamped price, and currency.  
* Exclude inactive and maintenance rooms from bookable inventory.  
* Calculate each date separately when relevant.  
* Recalculation must not alter historical booked prices.  
* Show current enabled state, last recalculation, rule count, warning before disable, and result summary.

Percentage discount: basePrice \* (1 \- percentage / 100\)  
Percentage markup: basePrice \* (1 \+ percentage / 100\)  
Final price: min(max(calculatedPrice, minimumPrice), maximumPrice)

# **20\. Reports and CSV Export**

## **20.1 Reports**

| Report | Required measures |
| :---- | :---- |
| Revenue | Gross revenue, refunds, net revenue, average booking value, method, room type, period |
| Bookings | Total, statuses, cancellation rate, average stay, room type |
| Occupancy | Average, peak, lowest, by type, by date, maintenance impact |
| Services | Total, category, priority, status, response time, completion time, overdue |

## **20.2 Filters and visualizations**

* From and to dates, room type, booking status, payment status, service category, grouping.  
* Validate date range and maximum period.  
* Charts must also have text summaries, labels, tooltips, legends, empty states, and accessible alternatives.  
* Do not add a heavy chart library unless justified and documented.

## **20.3 CSV export**

* API Mode downloads backend blob.  
* Mock Mode exports the currently filtered records.  
* Use UTF-8, stable headers, correct escaping, and date range in filename.  
* Never export passwords, hashes, staff codes, tokens, passcodes, full IDs, card data, CVV, or security metadata.

# **21\. Hotel Settings**

## **21.1 Sections**

* Hotel identity: name, address, phone, email.  
* Operations: check-in, checkout, maximum stay, pending-payment timeout, cancellation cutoff.  
* Finance: currency, tax percentage, service-fee percentage.  
* Pricing: dynamic-pricing enabled and policy information.

## **21.2 Validation and behavior**

* Valid required hotel name, address, phone, and email.  
* Supported currency and time zone only.  
* Tax and service fee within configured limits.  
* Maximum stay at least one; timeouts greater than zero; cutoff non-negative.  
* Track dirty state and protect unsaved changes.  
* Show before-and-after confirmation for important changes.  
* Disable save during submission and update shared cached settings after success.  
* Display updated administrator and timestamp.

**Shared authority:** Settings affect customer forms, booking calculations, admin operations, and backend rules. Do not hardcode tax, fees, check-in time, checkout time, or maximum stay in multiple features.

# **22\. Validation and Security**

## **22.1 Form standards**

* Use Reactive Forms.  
* Show errors after touch or submit, not immediately on page load.  
* Map backend fieldErrors to controls.  
* Focus the first invalid control after submission.  
* Preserve valid form data after recoverable errors.  
* Disable repeated submissions while processing.  
* Use pending-changes protection for dirty forms.

## **22.2 Security requirements**

* Never trust role, ownership, price, refund amount, room status, or transition requested by the browser.  
* Never include sensitive data in URLs, logs, toasts, exports, or normal frontend models.  
* Sanitize or safely render chat messages and administrator notes.  
* Reject unsafe image URL schemes.  
* Use bearer tokens only for SmartStay API requests.  
* Clear state on logout and 401\.  
* Do not rely on route guards or hidden controls as the sole access control.  
* Confirm destructive and financial operations.  
* Use generic authentication failure wording.

# **23\. Loading, Errors, Accessibility, and Responsive UI**

## **23.1 Required page states**

* Initial loading  
* Refreshing  
* Success  
* Truly empty system  
* Empty filtered result  
* Recoverable error  
* Permission denied  
* Resource not found  
* Unexpected system error

## **23.2 Responsive behavior**

| Viewport | Required behavior |
| :---- | :---- |
| Desktop | Persistent sidebar, tables, grids, multi-panel chat, wide boards |
| Tablet | Collapsible sidebar, reduced table columns, drawers, horizontal board scroll |
| Mobile | Drawer navigation, card lists, filter drawer, full-screen forms/dialogs, separate chat views |

Test at 360x800, 390x844, 768x1024, 1366x768, and 1440x900.

## **23.3 Accessibility**

* Semantic buttons and inputs  
* Visible labels and focus indicators  
* Keyboard navigation  
* Accessible dialogs and focus restoration  
* Text labels in addition to color  
* Meaningful chart summaries  
* Appropriate heading order  
* Accessible icons  
* Reduced-motion support  
* Non-drag alternatives for board status changes

## **23.4 Design system**

Primary navy: \#11243E  
Secondary navy: \#1B3A5D  
Accent gold: \#C99B4A  
Background: \#F5F7FA  
Text: \#1F2937  
Success: \#16803C  
Warning: \#B76E00  
Error: \#C62828  
Information: \#2563EB

# **24\. API Endpoint Contract**

## **Authentication**

POST /api/v1/auth/login  
GET /api/v1/auth/me  
POST /api/v1/auth/logout

## **Dashboard**

GET /api/v1/admin/dashboard/summary

## **Bookings**

GET /api/v1/admin/bookings  
GET /api/v1/admin/bookings/{bookingId}  
PATCH /api/v1/admin/bookings/{bookingId}/check-in  
PATCH /api/v1/admin/bookings/{bookingId}/check-out  
POST /api/v1/admin/bookings/{bookingId}/cancel

## **Guests**

GET /api/v1/admin/guests  
GET /api/v1/admin/guests/{guestId}  
GET /api/v1/admin/guests/{guestId}/bookings

## **Service requests**

GET /api/v1/admin/service-requests  
GET /api/v1/admin/service-requests/{requestId}  
PATCH /api/v1/admin/service-requests/{requestId}/assign  
PATCH /api/v1/admin/service-requests/{requestId}/status

## **Chats**

GET /api/v1/admin/chats  
GET /api/v1/admin/chats/{threadId}  
PATCH /api/v1/admin/chats/{threadId}/assign  
POST /api/v1/admin/chats/{threadId}/messages  
PATCH /api/v1/admin/chats/{threadId}/resolve  
PATCH /api/v1/admin/chats/{threadId}/read

## **Rooms**

GET /api/v1/admin/rooms  
GET /api/v1/admin/rooms/{roomId}  
POST /api/v1/admin/rooms  
PUT /api/v1/admin/rooms/{roomId}  
PATCH /api/v1/admin/rooms/{roomId}/status  
PATCH /api/v1/admin/rooms/{roomId}/active

## **Room types and amenities**

GET /api/v1/room-types  
GET /api/v1/room-types/{roomTypeId}  
POST /api/v1/admin/room-types  
PUT /api/v1/admin/room-types/{roomTypeId}  
GET /api/v1/admin/amenities  
POST /api/v1/admin/amenities  
PUT /api/v1/admin/amenities/{amenityId}  
PATCH /api/v1/admin/amenities/{amenityId}/active

## **Cleaning**

GET /api/v1/admin/cleaning-tasks  
GET /api/v1/admin/cleaning-tasks/{taskId}  
POST /api/v1/admin/cleaning-tasks  
PATCH /api/v1/admin/cleaning-tasks/{taskId}/assign  
PATCH /api/v1/admin/cleaning-tasks/{taskId}/start  
PATCH /api/v1/admin/cleaning-tasks/{taskId}/complete

## **Maintenance**

GET /api/v1/admin/maintenance  
GET /api/v1/admin/maintenance/{maintenanceId}  
POST /api/v1/admin/maintenance  
PUT /api/v1/admin/maintenance/{maintenanceId}  
PATCH /api/v1/admin/maintenance/{maintenanceId}/assign  
PATCH /api/v1/admin/maintenance/{maintenanceId}/start  
PATCH /api/v1/admin/maintenance/{maintenanceId}/hold  
PATCH /api/v1/admin/maintenance/{maintenanceId}/complete

## **Payments**

GET /api/v1/admin/payments  
GET /api/v1/admin/payments/{paymentId}  
POST /api/v1/admin/payments/{paymentId}/refund  
GET /api/v1/admin/payments/{paymentId}/refunds

## **Pricing**

GET /api/v1/admin/pricing/rules  
GET /api/v1/admin/pricing/rules/{ruleId}  
POST /api/v1/admin/pricing/rules  
PUT /api/v1/admin/pricing/rules/{ruleId}  
PATCH /api/v1/admin/pricing/enabled  
POST /api/v1/admin/pricing/recalculate  
POST /api/v1/admin/pricing/preview

## **Reports**

GET /api/v1/admin/reports/revenue  
GET /api/v1/admin/reports/bookings  
GET /api/v1/admin/reports/occupancy  
GET /api/v1/admin/reports/services  
GET /api/v1/admin/reports/revenue/export  
GET /api/v1/admin/reports/bookings/export

## **Settings**

GET /api/v1/admin/settings  
PUT /api/v1/admin/settings

**Change control:** Any missing or changed endpoint must be documented in API\_CHANGE\_LOG.txt and agreed with Rohit before components are changed.

# **25\. Testing Strategy**

## **25.1 Unit tests**

* Status labels and transition utilities  
* Date, money, and query-parameter utilities  
* Room identity resolution  
* Dynamic pricing and clamping  
* Rule overlap detection  
* Refundable balance  
* Dashboard calculations  
* Report date validation  
* CSV escaping  
* Auth and role helpers

## **25.2 Mock repository tests**

* Login and role rejection  
* Booking search, check-in, checkout, cancellation, and invalid transitions  
* Checkout-created cleaning task  
* Guest queries and data masking  
* Service assignment and status flow  
* Chat assignment, reply, polling data, and resolution  
* Room creation, duplicate number, update, and invalid state  
* Cleaning completion and maintenance creation  
* Maintenance completion with remaining blocking issue  
* Payment search and partial/full/excess refund  
* Pricing preview, overlap, enabled state, and recalculation  
* Report generation and export  
* Settings update and persistence

## **25.3 Component and route tests**

* Forms and validation  
* Action visibility by status and role  
* Filters, pagination, and query parameters  
* Dialogs and duplicate-submit prevention  
* Loading, empty, error, and permission states  
* Auth, role, unauthenticated, and pending-changes guards  
* Invalid IDs and not-found routes  
* Responsive navigation state

## **25.4 Integration and manual tests**

* Run all major workflows in Mock Mode.  
* Run all endpoint mappings in API Mode.  
* Verify token handling, CORS, dates, enums, pagination, and 409 conflicts.  
* Verify mobile, tablet, laptop, keyboard navigation, focus, contrast, and reduced motion.  
* Run a production build before every release.

# **26\. Collaboration, Change Control, and Releases**

Although one developer now owns the whole admin panel, the application still integrates with Abdur’s customer frontend and Rohit’s backend.

## **26.1 Shared integration contract**

* API\_CONTRACT.md  
* API\_CHANGE\_LOG.txt  
* ENUMS.json  
* TEST\_ACCOUNTS.txt  
* ADMIN\_ROUTES.md  
* sample requests and responses  
* Postman collection supplied by backend

## **26.2 Versioned releases**

smartstay-admin-frontend-v0.1.0-2026-08-08.zip  
smartstay-admin-frontend-v0.5.0-2026-08-20.zip  
smartstay-admin-frontend-v1.0.0-2026-09-01.zip

Every release includes VERSION.txt, files changed, dependencies added, known issues, run commands, Mock Mode instructions, API Mode instructions, and test accounts. Avoid folders named final, latest, or final-final.

# **27\. Recommended Implementation Sequence**

## **Phase 1: Foundation**

45. Create Angular project and configurations  
46. Design system and global styles  
47. Models, enums, constants, API wrappers  
48. Repository contracts and providers  
49. MockDatabaseService and seed loading  
50. Interceptors, guards, authentication state  
51. Admin shell and shared components

## **Phase 2: Authentication and dashboard**

52. Admin login and session restoration  
53. Role navigation  
54. Dashboard calculations and UI

## **Phase 3: Front desk**

55. Booking list and details  
56. Check-in, checkout, cancellation  
57. Guest directory  
58. Service requests  
59. Chat inbox and polling

## **Phase 4: Property operations**

60. Rooms, room types, amenities, images  
61. Cleaning tasks  
62. Maintenance records

## **Phase 5: Finance and pricing**

63. Payment search and details  
64. Refunds  
65. Pricing rules, preview, toggle, recalculation

## **Phase 6: Reports and settings**

66. Reports and charts  
67. CSV export  
68. Hotel, operational, financial, and pricing settings

## **Phase 7: Quality and integration**

69. Unit and repository tests  
70. Component and route tests  
71. Responsive and accessibility review  
72. API Mode integration  
73. Production build and release package

**Implementation discipline:** Complete and verify one task at a time. Never move forward while the current task does not compile, run, or meet its definition of done.

# **28\. Required Presentation Scenarios**

74. Admin login with validation, failure, and role protection  
75. Dashboard metrics, arrivals, urgent requests, and waiting chat  
76. Booking search, confirmed booking check-in, dashboard update  
77. Checked-in booking checkout, cleaning task creation, room state update  
78. Invalid booking transition rejection  
79. Guest search with masked identity data  
80. Service request assignment, progress, completion, and notification  
81. Front-desk thread assignment, admin reply, mock customer response, and resolution  
82. Room creation and duplicate-room validation  
83. Room-type price validation, amenities, and image metadata  
84. Cleaning completion that makes a room available  
85. Cleaning completion that creates maintenance  
86. Maintenance hold, resume, completion, and optional cleaning  
87. Partial refund, full refund, and excess-refund rejection  
88. Overlapping pricing-rule rejection and high-demand preview  
89. Price recalculation without changing historical booking prices  
90. Revenue report filter and safe CSV export  
91. Hotel settings dirty-state warning and save  
92. Responsive mobile navigation and card layouts  
93. API Mode end-to-end verification against Spring Boot

# **29\. Definition of Done**

**☐** Runs in Mock Mode without Spring Boot

**☐** Runs in API Mode with the same page components

**☐** No feature component calls HttpClient, loads JSON, or accesses localStorage directly

**☐** Strict TypeScript compiles without any shortcuts

**☐** Authentication, roles, guards, interceptors, and logout work

**☐** Mock state survives refresh and can be reset

**☐** All documented routes exist and are lazy-loaded

**☐** Dashboard reflects operational changes

**☐** Bookings support search, details, check-in, checkout, cancellation, and invalid-state handling

**☐** Guest data is useful and sensitive fields are masked

**☐** Service requests and chat support complete workflows

**☐** Rooms, room types, amenities, and images are manageable

**☐** Cleaning and maintenance update room states correctly

**☐** Payments and refunds enforce balances and permissions

**☐** Dynamic pricing validates ranges and recalculates safely

**☐** Reports and safe CSV export work

**☐** Settings are shared, validated, and protected from unsaved loss

**☐** Every page has loading, empty, error, permission, and success states

**☐** Desktop, tablet, and mobile layouts are usable

**☐** Keyboard and accessibility requirements are met

**☐** Critical unit, repository, component, and route tests pass

**☐** Production build completes

**☐** API names, enum values, dates, and pagination match backend

**☐** Versioned release documentation is complete

# **Final Implementation Rules**

94. Treat this unified document as the single admin frontend contract.  
95. Build in Mock Mode first, but keep API contracts stable from the beginning.  
96. Use one shared mock database and one shared admin shell.  
97. Keep authoritative security and business rules in the backend.  
98. Do not add unfinished features merely to increase feature count.  
99. Test failures and invalid transitions as carefully as happy paths.  
100. Keep all mock-only features hidden in API and production modes.  
101. Record every API contract change before adapting the frontend.  
102. Run tests and production build before each versioned handoff.  
103. Prefer complete, readable, and maintainable workflows over shortcuts.

