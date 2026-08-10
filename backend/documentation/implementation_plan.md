# SmartStay Backend — Complete Implementation Plan

Build the full Spring Boot REST API backend for SmartStay hotel management system. The backend serves **both** the Customer Frontend and Admin Frontend Angular panels. Uses **Java 17, Spring Boot 3.4, Maven, and persistent H2 database** (adaptation from the guide's MySQL spec to match user requirements).

## Key Architectural Decisions

> [!IMPORTANT]
> **Database Change:** The guide specifies MySQL 8 + Spring JDBC. Per your request, we use **persistent H2** with **Spring Data JPA (Hibernate)** instead of raw JdbcTemplate. This drastically reduces boilerplate while maintaining the same API contract. H2 persistent mode stores data in a file so it survives restarts.

> [!IMPORTANT]
> **Spring Boot Version:** The guide says "Spring Boot 4.1" but that doesn't exist yet. We'll use **Spring Boot 3.4.x** (latest stable supporting Java 17).

> [!IMPORTANT]
> **JPA vs JDBC:** Using JPA/Hibernate instead of raw JdbcTemplate. This gives us entity management, automatic schema generation, and repository interfaces — dramatically less code for 20+ tables. The API contract remains identical.

## Open Questions

> [!WARNING]
> **Admin Panel Auth Difference:** The admin panel sends `{ email, password, staffCode }` while the backend guide shows a single login endpoint. The backend will accept an optional `staffCode` field in the login request. If `staffCode` is present and the user has an admin/staff role, it will be validated. Customer logins simply omit it. Is this acceptable?

> [!NOTE]
> **Admin Panel `token` vs Customer Panel `accessToken`:** The admin frontend expects `AuthResponse.token` while the customer frontend expects `AuthResponse.accessToken`. The backend will return **both** fields in the login response to avoid any frontend changes.

---

## Proposed Changes

### Phase 1: Project Foundation

Create the Spring Boot project skeleton, configure H2, set up global response handling, CORS, and exception handling.

#### [NEW] [pom.xml](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/pom.xml)
- Spring Boot 3.4.x parent
- Dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-validation`, `spring-boot-starter-actuator`, `h2`, `jjwt-api/impl/jackson` (0.12.x), `lombok`, `spring-boot-devtools`, `spring-boot-starter-test`

#### [NEW] [SmartStayApplication.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/SmartStayApplication.java)
- `@SpringBootApplication` entry point with `@EnableScheduling`

#### [NEW] [application.yml](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/resources/application.yml)
- H2 persistent mode: `jdbc:h2:file:./data/smartstay_db;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE`
- H2 console enabled for debugging at `/h2-console`
- JPA ddl-auto: `update` (with `schema.sql` + `data.sql` for seed)
- Jackson: camelCase, non-null, IST timezone
- Server port: 8080
- Custom `app.jwt.secret`, `app.hotel.*` properties

#### [NEW] Config Classes
- [CorsConfig.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/config/CorsConfig.java) — Allow `http://localhost:4200`, methods GET/POST/PUT/PATCH/DELETE/OPTIONS, headers Authorization/Content-Type/Idempotency-Key
- [JacksonConfig.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/config/JacksonConfig.java) — camelCase, non-null, ISO dates
- [SecurityConfig.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/config/SecurityConfig.java) — JWT filter chain, public/protected endpoints, role-based access
- [AppProperties.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/config/AppProperties.java) — `@ConfigurationProperties("app")` binding

#### [NEW] Global Response & Exception Handling
- [ApiResponse.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/dto/common/ApiResponse.java) — `{ success, message, data, timestamp }`
- [PageData.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/dto/common/PageData.java) — `{ items, page, size, totalItems, totalPages }`
- [GlobalExceptionHandler.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/exception/GlobalExceptionHandler.java) — `@RestControllerAdvice` handling validation, auth, business, 404, conflict errors
- [ResourceNotFoundException.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/exception/ResourceNotFoundException.java)
- [BusinessRuleException.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/exception/BusinessRuleException.java)
- [ConflictException.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/exception/ConflictException.java)

---

### Phase 2: Authentication & Authorization

JWT-based auth serving both customer and admin panels.

#### [NEW] Entity & Enums
- [User.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/User.java) — `id, publicId, firstName, lastName, email, phone, passwordHash, role, dateOfBirth, governmentIdType, governmentIdHash, governmentIdLastFour, staffCodeHash, active, failedLoginAttempts, lockedUntil, createdAt, updatedAt`
- [Role.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/enums/Role.java) — `CUSTOMER, STAFF, ADMIN, MANAGER`

#### [NEW] Security Layer
- [JwtService.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/security/JwtService.java) — Token generation (using JJWT), validation, expiration, user extraction
- [JwtAuthenticationFilter.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/security/JwtAuthenticationFilter.java) — `OncePerRequestFilter` extracting Bearer token
- [CustomUserDetailsService.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/security/CustomUserDetailsService.java) — Loads user from DB
- [RestAuthenticationEntryPoint.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/security/RestAuthenticationEntryPoint.java) — Returns JSON 401
- [RestAccessDeniedHandler.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/security/RestAccessDeniedHandler.java) — Returns JSON 403

#### [NEW] Auth DTOs
- [LoginRequestDto.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/dto/auth/LoginRequestDto.java) — `{ email, password, staffCode? }` (supports both panels)
- [RegisterRequestDto.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/dto/auth/RegisterRequestDto.java) — Full customer registration
- [AuthResponseDto.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/dto/auth/AuthResponseDto.java) — Returns both `token` and `accessToken` fields (same value), `user`, `expiresInSeconds`
- [UserResponseDto.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/dto/auth/UserResponseDto.java) — Customer user profile (matches `User` interface)
- [AdminUserResponseDto.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/dto/auth/AdminUserResponseDto.java) — Admin user profile (matches `AdminUser` interface)

#### [NEW] Repository, Service, Controller
- [UserRepository.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/repository/UserRepository.java)
- [AuthService.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/service/AuthService.java) — Register, login (BCrypt), getMe, update profile
- [AuthController.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/controller/AuthController.java) — `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- [UserController.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/controller/UserController.java) — `GET /customer/profile`, `PUT /customer/profile`

---

### Phase 3: Rooms, Room Types & Amenities

Public room listing + admin CRUD. Serves both panels.

#### [NEW] Entities
- [RoomType.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/RoomType.java) — `name, code, description, basePrice, minimumPrice, maximumPrice, maximumAdults, maximumChildren, bedType, roomSizeSqft, active`
- [Room.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/Room.java) — `publicId, roomNumber, roomType, floorNumber, status, description, imageUrl, rating, active, version`
- [Amenity.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/Amenity.java) — `name, iconName, active`
- [RoomImage.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/RoomImage.java) — `roomType, imageUrl, altText, displayOrder, active`

#### [NEW] DTOs, Repository, Service, Controller
- Customer-facing: `GET /rooms`, `GET /rooms/{id}`, `GET /room-types`, `GET /rooms/availability`, `GET /rooms/featured`
- Admin-facing: `POST /admin/rooms`, `PUT /admin/rooms/{id}`, `PATCH /admin/rooms/{id}/status`, `POST /admin/room-types`, `PUT /admin/room-types/{id}`, `GET /admin/amenities`, `POST /admin/amenities`, `PUT /admin/amenities/{id}`

---

### Phase 4: Bookings & Dynamic Pricing

Complete booking lifecycle with quote, creation, overlap protection, and dynamic pricing.

#### [NEW] Entities
- [Booking.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/Booking.java) — Full booking with all price breakdown fields
- [BookingGuest.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/BookingGuest.java) — Guest details per booking
- [PricingRule.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/PricingRule.java) — Occupancy-based pricing rules
- [PriceSnapshot.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/PriceSnapshot.java) — Historical price captures

#### [NEW] Service & Controllers
- **PricingService** — Occupancy calc, dynamic price, multi-night pricing, clamping
- **BookingService** — Quote, create (with overlap check in transaction), cancel, list
- Customer: `POST /bookings/quote`, `POST /bookings`, `GET /customer/bookings`, `GET /customer/bookings/{id}`, `POST /customer/bookings/{id}/cancel`
- Admin: `GET /admin/bookings`, `GET /admin/bookings/{id}`, `PATCH /admin/bookings/{id}/check-in`, `PATCH /admin/bookings/{id}/check-out`, `POST /admin/bookings/{id}/cancel`
- Pricing Admin: `GET /admin/pricing/rules`, `POST /admin/pricing/rules`, `PUT /admin/pricing/rules/{id}`, `PATCH /admin/pricing/enabled`, `POST /admin/pricing/recalculate`, `POST /admin/pricing/preview`

---

### Phase 5: Payments & Passcodes

Dummy payment processing and secure room passcode generation.

#### [NEW] Entities
- [Payment.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/Payment.java) — `paymentReference, bookingId, userId, method, amount, status, gatewayName, gatewayTransactionReference, failureReason, paidAt`
- [Refund.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/Refund.java) — `refundReference, paymentId, bookingId, amount, reason, status, processedBy`
- [RoomPasscode.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/RoomPasscode.java) — `bookingId, passcodeHash, passcodePlain (transient), validFrom, validUntil, status, failedAttempts, lockedUntil`

#### [NEW] Service & Controllers
- **PaymentService** — Initiate with dummy tokens (`tok_success`/`tok_failure`), confirm, refund calc. On success: update booking → CONFIRMED, generate passcode, create notification.
- **PasscodeService** — SecureRandom 6-digit generation, BCrypt hashing, time-window activation, lockout on 5 failures
- Customer: `POST /payments/process`, `GET /payments/booking/{bookingId}`, `GET /passcodes/booking/{bookingId}`, `POST /passcodes/booking/{bookingId}/generate`
- Admin: `GET /admin/payments`, `GET /admin/payments/{id}`, `POST /admin/payments/{id}/refund`, `GET /admin/payments/{id}/refunds`, `POST /admin/bookings/{id}/passcode/regenerate`

---

### Phase 6: Hotel Operations (Service Requests, Cleaning, Maintenance)

#### [NEW] Entities
- [ServiceRequestEntity.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/ServiceRequestEntity.java) — Full service request with status transitions
- [CleaningTask.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/CleaningTask.java) — Room cleaning lifecycle
- [MaintenanceRecord.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/MaintenanceRecord.java) — Maintenance tracking

#### [NEW] Service & Controllers
- Customer: `POST /customer/service-requests`, `GET /customer/service-requests`, `POST /customer/service-requests/{id}/cancel`
- Admin: `GET /admin/service-requests`, `PATCH /admin/service-requests/{id}/assign`, `PATCH /admin/service-requests/{id}/status`
- Admin Cleaning: `GET /admin/cleaning-tasks`, `POST /admin/cleaning-tasks`, `PATCH .../assign`, `PATCH .../start`, `PATCH .../complete`
- Admin Maintenance: `GET /admin/maintenance`, `POST /admin/maintenance`, `PATCH .../assign`, `PATCH .../start`, `PATCH .../hold`, `PATCH .../complete`
- Checkout flow: Booking COMPLETED → Room UNDER_CLEANING → Cleaning Task created → Complete → Room AVAILABLE

---

### Phase 7: Chat, Notifications & Feedback

#### [NEW] Entities
- [ChatThread.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/ChatThread.java) — Thread with mode (BOT/ADMIN), status, assignment
- [ChatMessage.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/ChatMessage.java) — Messages with sender type
- [NotificationEntity.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/NotificationEntity.java) — User notifications
- [Feedback.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/Feedback.java) — Booking feedback with ratings

#### [NEW] Service & Controllers
- Customer Chat: `POST /customer/chat/threads`, `GET /customer/chat/threads`, `GET /customer/chat/threads/{id}`, `POST /customer/chat/threads/{id}/messages`, `POST /customer/chat/threads/{id}/escalate`
- Admin Chat: `GET /admin/chats`, `GET /admin/chats/{id}`, `PATCH /admin/chats/{id}/assign`, `POST /admin/chats/{id}/messages`, `PATCH /admin/chats/{id}/resolve`, `PATCH /admin/chats/{id}/read`
- Notifications: `GET /customer/notifications`, `PATCH /customer/notifications/{id}/read`
- Feedback: `POST /customer/feedback`, `GET /customer/feedback`, `GET /admin/feedback`, `PATCH /admin/feedback/{id}/visibility`

---

### Phase 8: Dashboard, Reports, Settings, Guests & Seed Data

#### [NEW] Entities & Service
- [HotelSettings.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/HotelSettings.java) — System-wide hotel configuration
- [AuditLog.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/model/AuditLog.java) — Admin action audit trail

#### [NEW] Admin Controllers
- Dashboard: `GET /admin/dashboard/summary` — Room counters, arrivals, departures, service requests, chats, occupancy, revenue
- Guests: `GET /admin/guests`, `GET /admin/guests/{id}`, `GET /admin/guests/{id}/bookings`
- Reports: `GET /admin/reports/revenue`, `GET /admin/reports/bookings`, `GET /admin/reports/occupancy`, `GET /admin/reports/services`, `GET /admin/reports/revenue/export`, `GET /admin/reports/bookings/export`
- Settings: `GET /admin/settings`, `PUT /admin/settings`

#### [NEW] Seed Data — [data.sql](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/resources/data.sql)
- **Test Accounts** (BCrypt hashed passwords):
  - `guest@example.com` / `Guest@123` (CUSTOMER)
  - `emily@example.com` / `Guest@123` (CUSTOMER)
  - `admin@example.com` / `Admin@123` + `STAFF2026` (ADMIN)
  - `manager@example.com` / `Manager@123` + `STAFF2027` (MANAGER)
  - `staff@example.com` / `Staff@123` + `STAFF2028` (STAFF)
- 4 room types (Standard, Deluxe, Executive, Suite)
- 10 rooms across floors
- 12 amenities (Wi-Fi, AC, Smart TV, Mini Bar, etc.)
- Multiple room images (Unsplash URLs)
- 4 bookings in different statuses
- 4 payments
- 4 service requests
- 3 chat threads with messages
- Notifications, feedback, pricing rules
- Hotel settings (tax 12%, service fee 5%, INR currency)

#### [NEW] Scheduled Tasks
- [ScheduledTasks.java](file:///c:/Users/abdur/Code%20Projects/hotelmanagementadminpanel/backend/src/main/java/com/smartstay/scheduler/ScheduledTasks.java)
  - Expire `PENDING_PAYMENT` bookings after timeout
  - Passcode status updates
  - Upcoming check-in notifications

---

## Frontend Adjustments (if needed)

> [!NOTE]
> Minor frontend adjustments may be needed during integration to align field names. Both frontends already have API repository implementations that target `http://localhost:8080/api/v1`. The backend will match these endpoint paths exactly.

Key endpoint alignment verified:
| Frontend Path | Backend Path | Match |
|---|---|---|
| `/auth/login` | `POST /api/v1/auth/login` | ✅ |
| `/auth/register` | `POST /api/v1/auth/register` | ✅ |
| `/auth/me` | `GET /api/v1/auth/me` | ✅ |
| `/rooms` | `GET /api/v1/rooms` | ✅ |
| `/rooms/availability` | `GET /api/v1/rooms/availability` | ✅ |
| `/bookings/quote` | `POST /api/v1/bookings/quote` | ✅ |
| `/customer/bookings` | `GET /api/v1/customer/bookings` | ✅ |
| `/payments/process` | `POST /api/v1/payments/process` | ✅ |
| `/admin/bookings` | `GET /api/v1/admin/bookings` | ✅ |
| `/admin/dashboard/summary` | `GET /api/v1/admin/dashboard/summary` | ✅ |

---

## Verification Plan

### Automated Tests
```bash
cd backend
mvnw.cmd test
```
- Unit tests for PricingService (occupancy, dynamic pricing, clamping)
- Unit tests for BookingService (overlap detection, state transitions, price calculation)
- Unit tests for PasscodeService (generation, validation, expiry, lockout)
- Integration tests for AuthController (register, login, duplicate email, role-based access)
- Integration tests for BookingController (create, double-booking prevention, cancel)
- Integration tests for PaymentController (success, failure, duplicate payment)

### Manual Verification
1. Start backend: `mvnw.cmd spring-boot:run`
2. Start customer_frontend: `ng serve`
3. Start admin_frontend: `ng serve --port 4201`
4. Verify full flow: Register → Login → Search rooms → Book → Pay → View passcode → Service request → Chat → Admin check-in/out
5. Verify H2 console at `http://localhost:8080/h2-console`

---

## File Count Estimate

| Phase | New Files | Description |
|-------|-----------|-------------|
| 1 | ~15 | Project setup, config, exception handling |
| 2 | ~12 | Auth entities, security, DTOs, controller |
| 3 | ~10 | Room entities, DTOs, services, controllers |
| 4 | ~12 | Booking, pricing entities, services, controllers |
| 5 | ~10 | Payment, passcode entities, services, controllers |
| 6 | ~10 | Service requests, cleaning, maintenance |
| 7 | ~10 | Chat, notifications, feedback |
| 8 | ~8 | Dashboard, reports, settings, seed data |
| **Total** | **~87** | **Complete backend** |
