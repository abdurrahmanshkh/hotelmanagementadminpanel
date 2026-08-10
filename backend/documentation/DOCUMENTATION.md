# **SmartStay Backend — Comprehensive System Architecture & Specification Contract**

This document serves as the **definitive, end-to-end implementation specification** for the SmartStay Spring Boot backend application. It contains all exact API endpoint schemas, request/response formats, database models, business logic algorithms, security constraints, and seed data definitions. Any developer or AI coding agent can build the entire backend using this document alone.

---

# **1. Application Overview & Technology Stack**

## **1.1 Tech Stack Specification**
* **Application Name:** SmartStay Backend
* **Language:** Java 17
* **Framework:** Spring Boot 3.4.x
* **Build Tool:** Apache Maven
* **Database:** Persistent H2 Database (File-based storage: `./data/smartstay_db`)
* **Persistence Layer:** Spring Data JPA / Hibernate
* **Security & Auth:** Spring Security 6 with JWT (JSON Web Tokens)
* **Default Server Port:** `8080`
* **Base API Path:** `/api/v1`
* **Timezone:** `Asia/Kolkata` (`+05:30`)
* **Currency:** INR (`₹`)
* **JSON Naming Convention:** `camelCase`
* **Date & Time Formats:** 
  * Date: `yyyy-MM-dd`
  * Local Time: `HH:mm:ss`
  * Timestamp: ISO-8601 (`yyyy-MM-dd'T'HH:mm:ss.SSSXXX`)

---

# **2. Complete Project Directory Structure**

```
backend/
├── pom.xml
├── DOCUMENTATION.md
├── README.md
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── smartstay/
│   │   │           ├── SmartStayApplication.java
│   │   │           ├── config/
│   │   │           │   ├── AppProperties.java
│   │   │           │   ├── CorsConfig.java
│   │   │           │   ├── JacksonConfig.java
│   │   │           │   └── SecurityConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AdminController.java
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── BookingController.java
│   │   │           │   ├── ChatController.java
│   │   │           │   ├── CleaningController.java
│   │   │           │   ├── DashboardController.java
│   │   │           │   ├── FeedbackController.java
│   │   │           │   ├── MaintenanceController.java
│   │   │           │   ├── NotificationController.java
│   │   │           │   ├── PasscodeController.java
│   │   │           │   ├── PaymentController.java
│   │   │           │   ├── PricingController.java
│   │   │           │   ├── ReportController.java
│   │   │           │   ├── RoomController.java
│   │   │           │   ├── ServiceRequestController.java
│   │   │           │   ├── SettingsController.java
│   │   │           │   └── UserController.java
│   │   │           ├── dto/
│   │   │           │   ├── auth/
│   │   │           │   ├── booking/
│   │   │           │   ├── chat/
│   │   │           │   ├── cleaning/
│   │   │           │   ├── common/
│   │   │           │   ├── dashboard/
│   │   │           │   ├── feedback/
│   │   │           │   ├── maintenance/
│   │   │           │   ├── notification/
│   │   │           │   ├── passcode/
│   │   │           │   ├── payment/
│   │   │           │   ├── pricing/
│   │   │           │   ├── report/
│   │   │           │   ├── room/
│   │   │           │   ├── service/
│   │   │           │   └── settings/
│   │   │           ├── enums/
│   │   │           │   ├── BookingStatus.java
│   │   │           │   ├── ChatMode.java
│   │   │           │   ├── ChatStatus.java
│   │   │           │   ├── CleaningTaskStatus.java
│   │   │           │   ├── MaintenanceStatus.java
│   │   │           │   ├── PasscodeStatus.java
│   │   │           │   ├── PaymentMethod.java
│   │   │           │   ├── PaymentStatus.java
│   │   │           │   ├── PricingAdjustmentType.java
│   │   │           │   ├── Priority.java
│   │   │           │   ├── RefundStatus.java
│   │   │           │   ├── Role.java
│   │   │           │   ├── RoomStatus.java
│   │   │           │   └── ServiceRequestStatus.java
│   │   │           ├── exception/
│   │   │           │   ├── BusinessRuleException.java
│   │   │           │   ├── ConflictException.java
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   └── UnauthorizedException.java
│   │   │           ├── model/
│   │   │           │   ├── Amenity.java
│   │   │           │   ├── AuditLog.java
│   │   │           │   ├── Booking.java
│   │   │           │   ├── BookingGuest.java
│   │   │           │   ├── ChatMessage.java
│   │   │           │   ├── ChatThread.java
│   │   │           │   ├── CleaningTask.java
│   │   │           │   ├── Feedback.java
│   │   │           │   ├── HotelSettings.java
│   │   │           │   ├── MaintenanceRecord.java
│   │   │           │   ├── NotificationEntity.java
│   │   │           │   ├── Payment.java
│   │   │           │   ├── PriceSnapshot.java
│   │   │           │   ├── PricingRule.java
│   │   │           │   ├── Refund.java
│   │   │           │   ├── Room.java
│   │   │           │   ├── RoomImage.java
│   │   │           │   ├── RoomPasscode.java
│   │   │           │   ├── RoomType.java
│   │   │           │   ├── ServiceRequestEntity.java
│   │   │           │   └── User.java
│   │   │           ├── repository/
│   │   │           │   ├── AmenityRepository.java
│   │   │           │   ├── AuditLogRepository.java
│   │   │           │   ├── BookingGuestRepository.java
│   │   │           │   ├── BookingRepository.java
│   │   │           │   ├── ChatMessageRepository.java
│   │   │           │   ├── ChatThreadRepository.java
│   │   │           │   ├── CleaningTaskRepository.java
│   │   │           │   ├── FeedbackRepository.java
│   │   │           │   ├── HotelSettingsRepository.java
│   │   │           │   ├── MaintenanceRecordRepository.java
│   │   │           │   ├── NotificationRepository.java
│   │   │           │   ├── PaymentRepository.java
│   │   │           │   ├── PriceSnapshotRepository.java
│   │   │           │   ├── PricingRuleRepository.java
│   │   │           │   ├── RefundRepository.java
│   │   │           │   ├── RoomImageRepository.java
│   │   │           │   ├── RoomPasscodeRepository.java
│   │   │           │   ├── RoomRepository.java
│   │   │           │   ├── RoomTypeRepository.java
│   │   │           │   ├── ServiceRequestRepository.java
│   │   │           │   └── UserRepository.java
│   │   │           ├── scheduler/
│   │   │           │   └── ScheduledTasks.java
│   │   │           ├── security/
│   │   │           │   ├── CustomUserDetails.java
│   │   │           │   ├── CustomUserDetailsService.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   ├── JwtService.java
│   │   │           │   ├── RestAccessDeniedHandler.java
│   │   │           │   └── RestAuthenticationEntryPoint.java
│   │   │           └── service/
│   │   │               ├── AuthService.java
│   │   │               ├── BookingService.java
│   │   │               ├── ChatService.java
│   │   │               ├── CleaningService.java
│   │   │               ├── DashboardService.java
│   │   │               ├── FeedbackService.java
│   │   │               ├── MaintenanceService.java
│   │   │               ├── NotificationService.java
│   │   │               ├── PasscodeService.java
│   │   │               ├── PaymentService.java
│   │   │               ├── PricingService.java
│   │   │               ├── ReportService.java
│   │   │               ├── RoomService.java
│   │   │               ├── ServiceRequestManager.java
│   │   │               ├── SettingsService.java
│   │   │               └── UserService.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── data.sql
```

---

# **3. Project Dependencies (`pom.xml`) & Configuration (`application.yml`)**

## **3.1 `pom.xml` Specification**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.2</version>
        <relativePath/>
    </parent>
    
    <groupId>com.smartstay</groupId>
    <artifactId>smartstay-backend</artifactId>
    <version>1.0.0</version>
    <name>SmartStay Backend</name>
    <description>REST API Backend for SmartStay Hotel Management System</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.6</jjwt.version>
    </properties>

    <dependencies>
        <!-- Web & REST -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- JPA Data Access -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Persistent H2 Database -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Security & JWT -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Monitoring & DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## **3.2 `application.yml` Specification**
```yaml
server:
  port: 8080

spring:
  application:
    name: smartstay-backend
  datasource:
    url: jdbc:h2:file:./data/smartstay_db;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE;MODE=MySQL
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  h2:
    console:
      enabled: true
      path: /h2-console
      settings:
        web-allow-others: true
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        format_sql: true
  sql:
    init:
      mode: always
      data-locations: classpath:data.sql

management:
  endpoints:
    web:
      exposure:
        include: health,info

app:
  jwt:
    secret: 9a6f8b12c4d3e5f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1
    expiration-minutes: 1440 # 24 hours
  hotel:
    tax-percentage: 12.0
    service-fee-percentage: 5.0
    check-in-time: "14:00"
    check-out-time: "11:00"
    max-stay-days: 30
    pending-payment-timeout-minutes: 15
    cancellation-cutoff-hours: 24
```

---

# **4. Enumerations Specification**

All enums must match frontend contracts precisely:

```java
public enum Role { CUSTOMER, STAFF, ADMIN, MANAGER }

public enum BookingStatus { PENDING_PAYMENT, CONFIRMED, CHECKED_IN, COMPLETED, CANCELLED }

public enum RoomStatus { AVAILABLE, RESERVED, OCCUPIED, UNDER_CLEANING, MAINTENANCE }

public enum PaymentStatus { INITIATED, PENDING, SUCCESS, FAILED, REFUNDED, PARTIALLY_REFUNDED }

public enum PaymentMethod { CARD, UPI, CASH }

public enum RefundStatus { PENDING, SUCCESS, FAILED }

public enum PasscodeStatus { NOT_GENERATED, NOT_ACTIVE_YET, ACTIVE, LOCKED, EXPIRED, REVOKED }

public enum ServiceRequestStatus { PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED }

public enum CleaningTaskStatus { PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED }

public enum MaintenanceStatus { OPEN, ASSIGNED, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED }

public enum Priority { LOW, MEDIUM, HIGH, URGENT }

public enum ChatMode { BOT, ADMIN }

public enum ChatStatus { OPEN, WAITING_FOR_ADMIN, ASSIGNED, RESOLVED, CLOSED }

public enum PricingAdjustmentType { PERCENTAGE_DISCOUNT, PERCENTAGE_MARKUP, FIXED_DISCOUNT, FIXED_MARKUP, NO_ADJUSTMENT }
```

---

# **5. Database Schema & JPA Entity Specifications**

## **5.1 Common Envelope Formats**

### **Standard Success Envelope (`ApiResponse<T>`)**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-08-10T23:45:00.000+05:30"
}
```

### **Paginated Data Envelope (`PageData<T>`)**
```json
{
  "items": [ ... ],
  "page": 0,
  "size": 10,
  "totalItems": 42,
  "totalPages": 5
}
```

### **Standard Error Envelope (`ApiError`)**
```json
{
  "success": false,
  "code": "RESOURCE_NOT_FOUND",
  "message": "Room with ID 99 not found",
  "fieldErrors": {
    "roomId": "Invalid room selection"
  },
  "path": "/api/v1/rooms/99",
  "timestamp": "2026-08-10T23:45:00.000+05:30",
  "traceId": "8f3b2c1a"
}
```

---

# **6. Complete REST API Specifications**

## **6.1 Authentication APIs**

### **1. Customer Registration**
* **Method:** `POST`
* **Path:** `/api/v1/auth/register`
* **Authentication:** Public
* **Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1995-06-15",
  "governmentIdType": "AADHAAR",
  "governmentIdNumber": "123456789012",
  "password": "Password@123"
}
```
* **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresInSeconds": 86400,
    "user": {
      "id": 1,
      "publicId": "USR-1001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "role": "CUSTOMER",
      "dateOfBirth": "1995-06-15",
      "governmentIdType": "AADHAAR",
      "governmentIdMasked": "XXXXXXXX9012",
      "active": true,
      "createdAt": "2026-08-10T23:45:00.000+05:30",
      "updatedAt": "2026-08-10T23:45:00.000+05:30"
    }
  },
  "timestamp": "2026-08-10T23:45:00.000+05:30"
}
```

### **2. User / Admin Login**
* **Method:** `POST`
* **Path:** `/api/v1/auth/login`
* **Authentication:** Public
* **Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "Admin@123",
  "staffCode": "STAFF2026"
}
```
> **Note:** `staffCode` is optional for CUSTOMER logins. For ADMIN/STAFF logins, if `staffCode` is provided, it is validated against the user's recorded staff code.
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresInSeconds": 86400,
    "user": {
      "id": 2,
      "publicId": "ADM-2001",
      "firstName": "System",
      "lastName": "Admin",
      "email": "admin@example.com",
      "phone": "9998887770",
      "role": "ADMIN",
      "staffCode": "STAFF2026",
      "active": true,
      "createdAt": "2026-08-10T23:45:00.000+05:30",
      "updatedAt": "2026-08-10T23:45:00.000+05:30"
    }
  },
  "timestamp": "2026-08-10T23:45:00.000+05:30"
}
```

### **3. Get Current Authenticated User**
* **Method:** `GET`
* **Path:** `/api/v1/auth/me`
* **Authentication:** Bearer Token
* **Success Response (200 OK):** Returns `ApiResponse<User>`

### **4. Logout**
* **Method:** `POST`
* **Path:** `/api/v1/auth/logout`
* **Authentication:** Bearer Token
* **Success Response (200 OK):** `{ "success": true, "message": "Logged out successfully", "data": null }`

---

## **6.2 Customer Profile APIs**

* `GET /api/v1/customer/profile` — Returns profile of logged-in user.
* `PUT /api/v1/customer/profile` — Updates firstName, lastName, phone, dateOfBirth. Returns updated user.

---

## **6.3 Room & Availability APIs**

### **1. Public Room Search / Filter**
* **Method:** `GET`
* **Path:** `/api/v1/rooms`
* **Query Parameters:** `checkInDate`, `checkOutDate`, `adults`, `children`, `roomTypeId`, `minPrice`, `maxPrice`, `bedType`, `sortBy`
* **Success Response (200 OK):** Returns `ApiResponse<List<Room>>`

### **2. Check Room Availability**
* **Method:** `GET`
* **Path:** `/api/v1/rooms/availability?checkInDate=2026-08-15&checkOutDate=2026-08-17&adults=2&children=0&roomTypeId=1`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Availability calculated",
  "data": [
    {
      "room": {
        "id": 1,
        "publicId": "RM-101",
        "roomNumber": "101",
        "roomType": { "id": 1, "name": "Standard Deluxe", "code": "STD" },
        "floorNumber": 1,
        "status": "AVAILABLE",
        "basePrice": 3500.00,
        "currentPrice": 3500.00,
        "currency": "INR",
        "maximumAdults": 2,
        "maximumChildren": 1,
        "rating": 4.8,
        "amenities": ["Wi-Fi", "Air Conditioning", "Smart TV"],
        "images": [{ "url": "https://images.unsplash.com/photo-1611892440504-42a792e24d32", "altText": "Room 101", "displayOrder": 1 }]
      },
      "available": true,
      "nightlyPrice": 3500.00,
      "totalPriceForStay": 7000.00
    }
  ],
  "timestamp": "2026-08-10T23:45:00.000+05:30"
}
```

### **3. Admin Room Management**
* `POST /api/v1/admin/rooms` — Create new room
* `PUT /api/v1/admin/rooms/{id}` — Update room details
* `PATCH /api/v1/admin/rooms/{id}/status` — Update room status (`AVAILABLE`, `MAINTENANCE`, `UNDER_CLEANING`)
* `GET /api/v1/room-types` — Public room types list
* `POST /api/v1/admin/room-types` — Create room type
* `PUT /api/v1/admin/room-types/{id}` — Update room type
* `GET /api/v1/admin/amenities` — List amenities
* `POST /api/v1/admin/amenities` — Create amenity

---

## **6.4 Booking & Dynamic Pricing APIs**

### **1. Request Booking Quote**
* **Method:** `POST`
* **Path:** `/api/v1/bookings/quote`
* **Request Body:**
```json
{
  "roomId": 1,
  "checkInDate": "2026-08-15",
  "checkOutDate": "2026-08-17",
  "adults": 2,
  "children": 0
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Quote generated",
  "data": {
    "quoteId": "QT-9A8B7C",
    "roomId": 1,
    "numberOfNights": 2,
    "basePricePerNight": 3500.00,
    "appliedPricePerNight": 3500.00,
    "roomAmount": 7000.00,
    "taxPercentage": 12.0,
    "taxAmount": 840.00,
    "serviceFeePercentage": 5.0,
    "serviceFee": 350.00,
    "discountAmount": 0.00,
    "totalAmount": 8190.00,
    "currency": "INR",
    "validUntil": "2026-08-11T00:00:00.000+05:30"
  },
  "timestamp": "2026-08-10T23:45:00.000+05:30"
}
```

### **2. Create Booking**
* **Method:** `POST`
* **Path:** `/api/v1/bookings`
* **Authentication:** Bearer Token (CUSTOMER)
* **Request Body:**
```json
{
  "roomId": 1,
  "checkInDate": "2026-08-15",
  "checkOutDate": "2026-08-17",
  "adults": 2,
  "children": 0,
  "specialRequests": "High floor requested",
  "quoteId": "QT-9A8B7C"
}
```
* **Success Response (201 Created):** Returns created `Booking` object with status `PENDING_PAYMENT`.

### **3. Customer My Bookings**
* `GET /api/v1/customer/bookings` — Returns customer's booking list.
* `GET /api/v1/customer/bookings/{id}` — Returns booking details.
* `POST /api/v1/customer/bookings/{id}/cancel` — Cancels booking (if within cancellation window).

### **4. Admin Booking Management**
* `GET /api/v1/admin/bookings` — Paginated filtered bookings list.
* `GET /api/v1/admin/bookings/{id}` — Full booking details with activity timeline.
* `PATCH /api/v1/admin/bookings/{id}/check-in` — Check-in guest. Status changes to `CHECKED_IN`, room status to `OCCUPIED`.
* `PATCH /api/v1/admin/bookings/{id}/check-out` — Check-out guest. Status changes to `COMPLETED`, room status to `UNDER_CLEANING`, generates cleaning task automatically.
* `POST /api/v1/admin/bookings/{id}/cancel` — Admin cancellation.

---

## **6.5 Payment & Passcode APIs**

### **1. Process Dummy Payment**
* **Method:** `POST`
* **Path:** `/api/v1/payments/process`
* **Authentication:** Bearer Token
* **Request Body:**
```json
{
  "bookingId": 101,
  "paymentMethod": "CARD",
  "dummyPaymentToken": "tok_success"
}
```
> Supported tokens: `tok_success`, `tok_failure`, `upi_success`, `upi_failure`.
* **Behavior on `tok_success`:**
  1. Set payment status to `SUCCESS`.
  2. Update booking status to `CONFIRMED`.
  3. Update room status to `RESERVED`.
  4. Generate 6-digit room passcode securely.
  5. Create booking confirmation notification for user.
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "id": 1,
    "paymentReference": "PAY-882910",
    "bookingId": 101,
    "bookingReference": "BK-2026-001",
    "amount": 8190.00,
    "currency": "INR",
    "paymentMethod": "CARD",
    "status": "SUCCESS",
    "gatewayTransactionId": "TXN_992019283",
    "createdAt": "2026-08-10T23:45:00.000+05:30"
  },
  "timestamp": "2026-08-10T23:45:00.000+05:30"
}
```

### **2. Room Passcode Retrieval**
* **Method:** `GET`
* **Path:** `/api/v1/passcodes/booking/{bookingId}`
* **Authentication:** Bearer Token (Booking Owner)
* **Response (Active booking stay):**
```json
{
  "success": true,
  "message": "Passcode retrieved",
  "data": {
    "id": 1,
    "bookingId": 101,
    "bookingReference": "BK-2026-001",
    "roomId": 1,
    "roomNumber": "101",
    "passcode": "482913",
    "maskedPasscode": "****13",
    "status": "ACTIVE",
    "validFrom": "2026-08-15T14:00:00.000+05:30",
    "validUntil": "2026-08-17T11:00:00.000+05:30",
    "failedAttempts": 0,
    "maxAllowedAttempts": 5
  },
  "timestamp": "2026-08-10T23:45:00.000+05:30"
}
```

### **3. Admin Refund Processing**
* `POST /api/v1/admin/payments/{paymentId}/refund`
* Request Body: `{ "amount": 8190.00, "reason": "Customer cancellation" }`

---

## **6.6 Hotel Operations APIs (Service Requests, Cleaning, Maintenance)**

### **1. Customer Service Request**
* `POST /api/v1/customer/service-requests`
* Request Body: `{ "bookingId": 101, "category": "HOUSEKEEPING", "title": "Extra Towels", "description": "Need 2 extra bath towels", "priority": "MEDIUM" }`
* `GET /api/v1/customer/service-requests` — Customer request history.

### **2. Admin Service Request Operations**
* `GET /api/v1/admin/service-requests` — All requests with filters.
* `PATCH /api/v1/admin/service-requests/{id}/assign` — Body: `{ "staffId": 5, "staffName": "Rahul Kumar" }`
* `PATCH /api/v1/admin/service-requests/{id}/status` — Body: `{ "status": "IN_PROGRESS", "notes": "Staff assigned" }`

### **3. Housekeeping / Cleaning Tasks**
* `GET /api/v1/admin/cleaning-tasks` — List tasks.
* `PATCH /api/v1/admin/cleaning-tasks/{id}/assign` — Assign staff.
* `PATCH /api/v1/admin/cleaning-tasks/{id}/start` — Set IN_PROGRESS.
* `PATCH /api/v1/admin/cleaning-tasks/{id}/complete` — Complete task. **Updates room status back to `AVAILABLE`**.

### **4. Room Maintenance**
* `GET /api/v1/admin/maintenance` — List records.
* `POST /api/v1/admin/maintenance` — Report issue. Updates room status to `MAINTENANCE`.
* `PATCH /api/v1/admin/maintenance/{id}/complete` — Complete repair. Option to trigger cleaning task.

---

## **6.7 Chat & Escalation APIs**

* `POST /api/v1/customer/chat/threads` — Start thread `{ "initialMessage": "Can I have late check-out?", "mode": "BOT" }`.
* `GET /api/v1/customer/chat/threads` — Customer threads.
* `POST /api/v1/customer/chat/threads/{id}/messages` — Send message.
* `POST /api/v1/customer/chat/threads/{id}/escalate` — Escalate to human staff. Sets `mode = ADMIN`, `status = WAITING_FOR_ADMIN`.
* `GET /api/v1/admin/chats` — Admin view of escalated threads.
* `PATCH /api/v1/admin/chats/{id}/assign` — Admin claims thread.
* `POST /api/v1/admin/chats/{id}/messages` — Admin reply.
* `PATCH /api/v1/admin/chats/{id}/resolve` — Mark thread resolved.

---

## **6.8 Notifications & Feedback APIs**

* `GET /api/v1/customer/notifications` — List notifications.
* `PATCH /api/v1/customer/notifications/{id}/read` — Mark read.
* `POST /api/v1/customer/feedback` — Submit stay feedback (for COMPLETED bookings only).
* `GET /api/v1/admin/feedback` — Admin view feedback.

---

## **6.9 Admin Dashboard, Analytics & Settings APIs**

### **1. Admin Dashboard Summary**
* **Method:** `GET`
* **Path:** `/api/v1/admin/dashboard/summary`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Dashboard summary fetched",
  "data": {
    "roomCounters": {
      "AVAILABLE": 6,
      "RESERVED": 2,
      "OCCUPIED": 1,
      "UNDER_CLEANING": 1,
      "MAINTENANCE": 0
    },
    "arrivals": [ ... ],
    "departures": [ ... ],
    "urgentServiceRequests": [ ... ],
    "waitingChats": [ ... ],
    "occupancyPercentage": 30.0,
    "todayRevenue": 16380.00,
    "monthlyRevenue": 245000.00
  },
  "timestamp": "2026-08-10T23:45:00.000+05:30"
}
```

### **2. Guest Management APIs**
* `GET /api/v1/admin/guests` — Paginated list of registered customers.
* `GET /api/v1/admin/guests/{id}` — Customer details with stay history.
* `GET /api/v1/admin/guests/{id}/bookings` — Bookings history for specific guest.

### **3. Reports & CSV Export APIs**
* `GET /api/v1/admin/reports/revenue?fromDate=2026-08-01&toDate=2026-08-31`
* `GET /api/v1/admin/reports/bookings`
* `GET /api/v1/admin/reports/occupancy`
* `GET /api/v1/admin/reports/services`
* `GET /api/v1/admin/reports/revenue/export` — Downloads UTF-8 CSV file `revenue-report.csv`.
* `GET /api/v1/admin/reports/bookings/export` — Downloads UTF-8 CSV file `bookings-report.csv`.

### **4. Hotel Settings APIs**
* `GET /api/v1/admin/settings` — Returns current `HotelSettings`.
* `PUT /api/v1/admin/settings` — Update tax percentages, check-in/out times, cancellation policies.

---

# **7. Core Business Logic & Algorithms**

## **7.1 Room Overlap Check (Double Booking Protection)**
An active room booking exists if:
```sql
(existing.check_in_date < requested.check_out_date) 
AND 
(existing.check_out_date > requested.check_in_date)
AND 
existing.status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CHECKED_IN')
```
Executed within a `@Transactional` boundary to guarantee isolation.

## **7.2 Dynamic Pricing Calculation**
```
Occupancy % = (Booked Active Rooms of Type / Total Active Bookable Rooms of Type) * 100

If Occupancy < 30%: Apply 10% Discount
If 30% <= Occupancy < 70%: Base Price (No Adjustment)
If Occupancy >= 70%: Apply 15% Markup

Final Nightly Price = Clamp(Calculated Price, Minimum Price, Maximum Price)
```

---

# **8. Seed Data Specifications (`data.sql`)**

The `data.sql` script initializes the H2 database with test accounts (BCrypt hashed passwords):

```sql
-- Test Customer Accounts (Password: Guest@123)
-- Hash: $2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C
INSERT INTO users (id, public_id, first_name, last_name, email, phone, password_hash, role, date_of_birth, government_id_type, government_id_last_four, active, failed_login_attempts, created_at, updated_at)
VALUES 
(1, 'USR-1001', 'Guest', 'User', 'guest@example.com', '9876543210', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C', 'CUSTOMER', '1990-01-01', 'AADHAAR', '1234', true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'USR-1002', 'Emily', 'Watson', 'emily@example.com', '9876543211', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C', 'CUSTOMER', '1992-05-12', 'PASSPORT', '5678', true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Test Staff & Admin Accounts (Password: Admin@123 / Manager@123 / Staff@123)
INSERT INTO users (id, public_id, first_name, last_name, email, phone, password_hash, role, staff_code_hash, active, failed_login_attempts, created_at, updated_at)
VALUES 
(3, 'ADM-2001', 'System', 'Admin', 'admin@example.com', '9998887770', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C', 'ADMIN', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C', true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'MGR-2002', 'General', 'Manager', 'manager@example.com', '9998887771', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C', 'MANAGER', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C', true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'STF-2003', 'Hotel', 'Staff', 'staff@example.com', '9998887772', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C', 'STAFF', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C', true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Default Hotel Settings
INSERT INTO hotel_settings (id, hotel_name, address, phone, email, check_in_time, check_out_time, max_stay_days, pending_payment_timeout_minutes, cancellation_cutoff_hours, currency, tax_percentage, service_fee_percentage, is_dynamic_pricing_enabled, updated_at)
VALUES (1, 'SmartStay Luxury Hotel & Suites', '123 Beach Resort Boulevard, Goa, India', '+91 98765 43210', 'support@smartstay.com', '14:00', '11:00', 30, 15, 24, 'INR', 12.0, 5.0, true, CURRENT_TIMESTAMP);
```

---

# **9. Integration Verification Checklist**

When running the Spring Boot backend alongside both Angular frontends:
1. Customer Angular frontend (`http://localhost:4200`) operates with `environment.ts` (`apiBaseUrl: 'http://localhost:8080/api/v1'`).
2. Admin Angular frontend (`http://localhost:4201`) operates with `environment.ts` (`apiBaseUrl: 'http://localhost:8080/api/v1'`).
3. CORS configuration explicitly permits `http://localhost:4200` and `http://localhost:4201` with `Authorization` and `Content-Type` headers.
4. JWT token returned during authentication contains claims `sub` (email) and `role`, valid for 24 hours.
5. All mock mode features seamlessly transition to production mode API calls without any breaking frontend contract changes.
