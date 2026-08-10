# **SmartStay Backend Development Specification**

This document is the implementation contract for **Rohit Naik**, who will develop the complete SmartStay REST API, Spring Boot application, and SQL database layer. Its main goal is to ensure that Abdur’s user frontend and the two admin frontend modules integrate with the backend without requiring major changes when all four codebases are combined.

> **Important architectural decision:** Client-side code may handle presentation, filtering, animations, chatbot keyword matching, and provisional calculations. However, authentication, authorization, booking availability, final pricing, payments, refunds, passcodes, status changes, and database updates must always be validated by the backend. Frontend logic can be modified by a browser user and therefore cannot be treated as authoritative.

---

# **1\. Project Identity**

## **1.1 Application details**

* **Application name:** SmartStay  
* **Backend repository/folder name:** `smartstay-backend`  
* **Base Java package:** `com.smartstay`  
* **Backend framework:** Spring Boot  
* **Java version:** Java 17  
* **Build system:** Maven  
* **Database:** MySQL 8  
* **Database access:** Spring JDBC using `JdbcTemplate` or `NamedParameterJdbcTemplate`  
* **IDE:** Eclipse  
* **API style:** RESTful JSON API  
* **Authentication:** Spring Security with JWT access tokens  
* **Default backend port:** `8080`  
* **API base path:** `/api/v1`  
* **Default Angular URL:** `http://localhost:4200`  
* **Time zone:** `Asia/Kolkata`  
* **Currency:** INR  
* **Date format:** ISO 8601

Spring Boot supports direct SQL access using `JdbcTemplate` and `JdbcClient`, making Spring JDBC suitable for this project without introducing JPA or Hibernate. [\[docs.spring.io\]](https://docs.spring.io/spring-boot/reference/data/sql.html)

Java 17 is a valid baseline for the current Spring ecosystem, including Spring Security. [\[docs.spring.io\]](https://docs.spring.io/spring-boot/system-requirements.html), [\[docs.spring.io\]](https://docs.spring.io/spring-security/reference/prerequisites.html)

## **1.2 Recommended Spring Boot choice**

For a company test project, use a Spring Boot release that:

* Supports Java 17  
* Is available through Spring Initializr  
* Is accepted by the company Maven environment  
* Has compatible Spring Security and validation starters

Do not hardcode an arbitrary version from an online tutorial. Generate the project using Spring Initializr and retain the generated supported version.

---

# **2\. Backend Responsibilities**

The SmartStay backend is responsible for:

1. Customer registration and login  
2. Admin login  
3. JWT generation and validation  
4. Role-based access control  
5. Customer profile management  
6. Room and room-type management  
7. Room availability calculation  
8. Booking creation and management  
9. Booking conflict prevention  
10. Server-authoritative price calculation  
11. Dummy payment processing  
12. Cancellation and refund calculation  
13. Room passcode generation and validation  
14. Service request management  
15. Cleaning and maintenance tracking  
16. Chat thread and message persistence  
17. Chat escalation to an administrator  
18. Notification creation and retrieval  
19. Dynamic pricing calculation  
20. Feedback management  
21. Admin dashboard metrics  
22. Reports and CSV exports  
23. Hotel settings management  
24. Validation and consistent error responses  
25. Audit logging for sensitive admin actions

## **2.1 Logic that may remain primarily in Angular**

The following can be implemented in the frontend:

* Keyword-based chatbot response selection  
* String similarity and fallback checks  
* UI sorting and filtering on already-loaded data  
* Animation and transition logic  
* Form usability checks  
* Temporary price preview  
* Date-picker restrictions  
* Responsive layout  
* Image presentation  
* Local chat typing indicators

However, the backend must still record:

* Escalated chat threads  
* Customer and admin chat messages  
* Final booking price  
* Final availability  
* Booking and payment status  
* Passcode lifecycle  
* Service-request state  
* Admin actions

---

# **3\. Project Creation**

## **3.1 Spring Initializr configuration**

Use:

* Project: Maven  
* Language: Java  
* Packaging: Jar  
* Java: 17  
* Group: `com.smartstay`  
* Artifact: `smartstay-backend`  
* Name: `SmartStay Backend`  
* Package: `com.smartstay`

Add these dependencies:

* Spring Web  
* Spring JDBC  
* Spring Security  
* Validation  
* MySQL Driver  
* Spring Boot Actuator  
* Spring Boot DevTools  
* Lombok, optional  
* Spring Boot Test  
* Spring Security Test

Actuator can provide controlled endpoints such as application health and metrics. Only `health` and `info` should be publicly exposed in this project. [\[docs.spring.io\]](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html), [\[docs.spring.io\]](https://docs.spring.io/spring-boot/reference/actuator/index.html)

## **3.2 Maven commands**

mvn clean

mvn test

mvn spring-boot:run

mvn clean package

java \-jar target/smartstay-backend-0.0.1-SNAPSHOT.jar

Windows Maven wrapper:

mvnw.cmd clean test

mvnw.cmd spring-boot:run

mvnw.cmd clean package

## **3.3 Eclipse setup**

1. Open Eclipse.  
2. Select **File \> Import**.  
3. Select **Existing Maven Projects**.  
4. Choose the `smartstay-backend` directory.  
5. Wait for Maven dependencies to download.  
6. Set project encoding to UTF-8.  
7. Confirm JDK 17 under the project build path.  
8. Run `SmartStayApplication.java` as a Java application.  
9. If dependencies are not recognized, use:  
   * Right-click project  
   * Maven  
   * Update Project

---

# **4\. Required Folder Structure**

smartstay-backend/

├── pom.xml

├── README.md

├── .gitignore

├── docs/

│   ├── API\_CONTRACT.md

│   ├── DATABASE\_SCHEMA.md

│   ├── TEST\_ACCOUNTS.md

│   └── POSTMAN\_GUIDE.md

├── postman/

│   ├── SmartStay.postman\_collection.json

│   └── SmartStay-Local.postman\_environment.json

├── src/

│   ├── main/

│   │   ├── java/

│   │   │   └── com/

│   │   │       └── smartstay/

│   │   │           ├── SmartStayApplication.java

│   │   │           ├── config/

│   │   │           │   ├── CorsConfig.java

│   │   │           │   ├── SecurityConfig.java

│   │   │           │   ├── JacksonConfig.java

│   │   │           │   └── TimeConfig.java

│   │   │           ├── controller/

│   │   │           │   ├── AuthController.java

│   │   │           │   ├── UserController.java

│   │   │           │   ├── RoomController.java

│   │   │           │   ├── BookingController.java

│   │   │           │   ├── PaymentController.java

│   │   │           │   ├── PasscodeController.java

│   │   │           │   ├── ServiceRequestController.java

│   │   │           │   ├── ChatController.java

│   │   │           │   ├── NotificationController.java

│   │   │           │   ├── FeedbackController.java

│   │   │           │   ├── AdminController.java

│   │   │           │   ├── DashboardController.java

│   │   │           │   ├── PricingController.java

│   │   │           │   ├── ReportController.java

│   │   │           │   └── SettingsController.java

│   │   │           ├── dto/

│   │   │           │   ├── auth/

│   │   │           │   ├── user/

│   │   │           │   ├── room/

│   │   │           │   ├── booking/

│   │   │           │   ├── payment/

│   │   │           │   ├── passcode/

│   │   │           │   ├── service/

│   │   │           │   ├── chat/

│   │   │           │   ├── notification/

│   │   │           │   ├── feedback/

│   │   │           │   ├── dashboard/

│   │   │           │   └── common/

│   │   │           ├── model/

│   │   │           ├── repository/

│   │   │           │   ├── mapper/

│   │   │           │   └── impl/

│   │   │           ├── service/

│   │   │           │   └── impl/

│   │   │           ├── security/

│   │   │           │   ├── JwtAuthenticationFilter.java

│   │   │           │   ├── JwtService.java

│   │   │           │   ├── CustomUserDetailsService.java

│   │   │           │   ├── RestAuthenticationEntryPoint.java

│   │   │           │   └── RestAccessDeniedHandler.java

│   │   │           ├── exception/

│   │   │           │   ├── GlobalExceptionHandler.java

│   │   │           │   ├── ResourceNotFoundException.java

│   │   │           │   ├── BusinessRuleException.java

│   │   │           │   ├── ConflictException.java

│   │   │           │   └── UnauthorizedOperationException.java

│   │   │           ├── validation/

│   │   │           ├── scheduler/

│   │   │           ├── util/

│   │   │           └── enums/

│   │   └── resources/

│   │       ├── application.yml

│   │       ├── application-dev.yml

│   │       ├── application-test.yml

│   │       ├── schema.sql

│   │       ├── data.sql

│   │       └── logback-spring.xml

│   └── test/

│       └── java/

│           └── com/

│               └── smartstay/

│                   ├── controller/

│                   ├── service/

│                   ├── repository/

│                   └── integration/

└── target/

## **4.1 Layer responsibilities**

### **Controller**

* Accepts HTTP requests  
* Validates request DTOs  
* Reads authenticated user identity  
* Invokes services  
* Returns response DTOs  
* Contains no SQL  
* Contains no major business rules

### **Service**

* Contains business rules  
* Controls transactions  
* Performs ownership and authorization checks  
* Coordinates multiple repositories  
* Calculates prices, refunds, and status transitions

### **Repository**

* Contains SQL queries  
* Uses `JdbcTemplate` or `NamedParameterJdbcTemplate`  
* Maps rows to model objects  
* Does not contain HTTP logic  
* Does not return controller DTOs

### **DTO**

* Defines the exact request and response contract  
* Prevents database models from being exposed directly  
* Contains Jakarta validation annotations

### **Model**

* Represents database records  
* Contains database-oriented fields  
* Must not contain passwords in response serialization

---

# **5\. Configuration**

## **5.1 Development configuration**

server:

  port: 8080

spring:

  application:

    name: smartstay-backend

  datasource:

    url: jdbc:mysql://localhost:3306/smartstay\_db?useSSL=false\&allowPublicKeyRetrieval=true\&serverTimezone=Asia/Kolkata

    username: ${DB\_USERNAME:root}

    password: ${DB\_PASSWORD:root}

    driver-class-name: com.mysql.cj.jdbc.Driver

  sql:

    init:

      mode: always

      encoding: UTF-8

  jackson:

    time-zone: Asia/Kolkata

    default-property-inclusion: non\_null

management:

  endpoints:

    web:

      exposure:

        include: health,info

app:

  frontend-url: ${FRONTEND\_URL:http://localhost:4200}

  jwt:

    secret: ${JWT\_SECRET}

    access-token-expiration-minutes: 60

  hotel:

    timezone: Asia/Kolkata

    currency: INR

    check-in-time: "14:00"

    check-out-time: "11:00"

  passcode:

    activation-offset-minutes: 0

    length: 6

## **5.2 Secret handling**

Never commit:

* MySQL passwords  
* JWT signing secrets  
* Production database URLs  
* Real card data  
* Real UPI credentials

For development, configure environment variables:

DB\_USERNAME=root

DB\_PASSWORD=your\_mysql\_password

JWT\_SECRET=a-long-random-development-secret-at-least-64-characters

FRONTEND\_URL=http://localhost:4200

---

# **6\. API Standards**

## **6.1 Base URL**

http://localhost:8080/api/v1

## **6.2 JSON naming**

Use `camelCase` consistently.

Correct:

{

  "checkInDate": "2026-08-10",

  "roomTypeId": 2,

  "guestCount": 2

}

Do not mix names such as:

{

  "check\_in\_date": "...",

  "RoomTypeID": 2

}

## **6.3 Date and time formats**

* Date: `yyyy-MM-dd`  
* Local time: `HH:mm:ss`  
* Timestamp: ISO 8601 with offset  
* Birth date: `yyyy-MM-dd`

Examples:

2026-08-10

14:00:00

2026-08-10T14:30:00+05:30

## **6.4 Monetary values**

* Use Java `BigDecimal`  
* Use SQL `DECIMAL(12,2)`  
* Never use `double` or `float` for money  
* Round to two decimal places using `RoundingMode.HALF_UP`

## **6.5 Successful response format**

Single resource:

{

  "success": true,

  "message": "Booking retrieved successfully",

  "data": {

    "id": 105

  },

  "timestamp": "2026-08-03T16:44:00+05:30"

}

List response:

{

  "success": true,

  "message": "Rooms retrieved successfully",

  "data": {

    "items": \[\],

    "page": 0,

    "size": 10,

    "totalItems": 0,

    "totalPages": 0

  },

  "timestamp": "2026-08-03T16:44:00+05:30"

}

## **6.6 Error response format**

{

  "success": false,

  "code": "BOOKING\_DATE\_CONFLICT",

  "message": "The selected room is not available for these dates",

  "fieldErrors": {

    "checkInDate": "The selected dates overlap an existing booking"

  },

  "path": "/api/v1/bookings",

  "timestamp": "2026-08-03T16:44:00+05:30",

  "traceId": "b3bc92d8"

}

Do not return:

* Java stack traces  
* SQL statements  
* Database names  
* Internal exception class names  
* JWT secrets  
* Password hashes

## **6.7 HTTP status rules**

* `200 OK`: successful fetch or update  
* `201 Created`: resource created  
* `204 No Content`: successful deletion when no body is needed  
* `400 Bad Request`: malformed or invalid input  
* `401 Unauthorized`: login required or invalid token  
* `403 Forbidden`: authenticated but insufficient permissions  
* `404 Not Found`: resource does not exist  
* `409 Conflict`: booking overlap, duplicate email, invalid state transition  
* `422 Unprocessable Entity`: optional for complex business-rule failures  
* `500 Internal Server Error`: unexpected server failure

---

# **7\. Authentication and Authorization**

Spring Security secures web applications by default when present, but the project must supply a custom `SecurityFilterChain`, authentication provider, and REST-specific handlers. [\[docs.spring.io\]](https://docs.spring.io/spring-boot/reference/web/spring-security.html)

## **7.1 Roles**

CUSTOMER

ADMIN

MANAGER

STAFF

Recommended permissions:

* `CUSTOMER`: customer-facing endpoints only  
* `STAFF`: bookings, cleaning, maintenance, service requests, chat  
* `ADMIN`: all operational admin functionality  
* `MANAGER`: all admin functionality, reports, settings, staff management

## **7.2 Password storage**

Do not migrate SHA-256 password storage from the console application.

Use:

new BCryptPasswordEncoder()

Requirements:

* Never store plain-text passwords  
* Never log passwords  
* Never return hashes  
* Minimum 8 characters  
* At least one uppercase letter  
* At least one lowercase letter  
* At least one number  
* At least one special character  
* Maximum 72 characters when using BCrypt

## **7.3 JWT flow**

1. User sends email and password to login endpoint.  
2. Backend authenticates credentials.  
3. Backend returns JWT and sanitized user information.  
4. Angular sends:

Authorization: Bearer \<token\>

5. JWT filter validates:  
   * Signature  
   * Expiration  
   * Subject  
   * User status  
   * Role  
6. Backend sets the authenticated principal.  
7. Ownership checks are still performed in services.

## **7.4 Authentication endpoints**

### **Register customer**

POST /api/v1/auth/register

Request:

{

  "firstName": "Abdur",

  "lastName": "Shaikh",

  "email": "abdur@example.com",

  "phone": "9876543210",

  "password": "Guest@123",

  "confirmPassword": "Guest@123",

  "dateOfBirth": "1998-05-15",

  "governmentIdType": "AADHAAR",

  "governmentIdNumber": "123456789012"

}

Security requirement:

* Store a masked, encrypted, or one-way protected government ID  
* Do not return the full ID  
* Response should show only a masked value such as `XXXXXXXX9012`

### **Customer/admin login**

POST /api/v1/auth/login

Request:

{

  "email": "guest@example.com",

  "password": "Guest@123",

  "staffCode": null

}

Response:

{

  "success": true,

  "message": "Login successful",

  "data": {

    "accessToken": "jwt-token",

    "tokenType": "Bearer",

    "expiresInSeconds": 3600,

    "user": {

      "id": 1,

      "firstName": "Guest",

      "lastName": "User",

      "email": "guest@example.com",

      "role": "CUSTOMER"

    }

  }

}

### **Current authenticated user**

GET /api/v1/auth/me

### **Logout**

POST /api/v1/auth/logout

For a simple stateless demonstration, the frontend can delete the token. If true server-side logout is required, maintain a token revocation table.

---

# **8\. Database Design**

## **8.1 General database rules**

* Database name: `smartstay_db`  
* Use `BIGINT AUTO_INCREMENT` for internal keys  
* Use unique public reference codes for UI display  
* Use foreign keys  
* Use indexes on search and relationship columns  
* Use `created_at` and `updated_at`  
* Use `deleted` or `active` for soft deletion where historical records matter  
* Never delete completed financial or booking records  
* Store enum values as readable `VARCHAR` values  
* Keep identifier names in `snake_case`

## **8.2 Core tables**

### **Users**

users

\- id

\- public\_id

\- first\_name

\- last\_name

\- email

\- phone

\- password\_hash

\- role

\- date\_of\_birth

\- government\_id\_type

\- government\_id\_hash

\- government\_id\_last\_four

\- staff\_code\_hash

\- active

\- failed\_login\_attempts

\- locked\_until

\- created\_at

\- updated\_at

Constraints:

* Unique: `email`  
* Unique: `public_id`  
* Optional unique: `phone`  
* Index: `role`  
* Index: `active`

### **Room types**

room\_types

\- id

\- name

\- code

\- description

\- base\_price

\- minimum\_price

\- maximum\_price

\- maximum\_adults

\- maximum\_children

\- bed\_type

\- room\_size\_sqft

\- active

\- created\_at

\- updated\_at

Examples:

* Standard  
* Deluxe  
* Executive  
* Suite

### **Rooms**

rooms

\- id

\- public\_id

\- room\_number

\- room\_type\_id

\- floor\_number

\- status

\- description

\- image\_url

\- rating

\- active

\- version

\- created\_at

\- updated\_at

Constraints:

* Unique: `public_id`  
* Unique: `room_number`  
* Foreign key: `room_type_id`

The `version` column can be incremented during updates to help detect conflicting changes.

### **Amenities**

amenities

\- id

\- name

\- icon\_name

\- active

### **Room-type amenities**

room\_type\_amenities

\- room\_type\_id

\- amenity\_id

### **Room images**

room\_images

\- id

\- room\_type\_id

\- image\_url

\- alt\_text

\- display\_order

\- active

The backend only stores image URLs and metadata. Angular loads the images.

### **Bookings**

bookings

\- id

\- booking\_reference

\- user\_id

\- room\_id

\- check\_in\_date

\- check\_out\_date

\- expected\_check\_in\_at

\- expected\_check\_out\_at

\- actual\_check\_in\_at

\- actual\_check\_out\_at

\- guest\_count

\- adults

\- children

\- status

\- base\_price\_per\_night

\- applied\_price\_per\_night

\- number\_of\_nights

\- room\_amount

\- tax\_amount

\- service\_fee

\- discount\_amount

\- total\_amount

\- special\_requests

\- cancellation\_reason

\- cancelled\_at

\- created\_at

\- updated\_at

### **Booking guests**

booking\_guests

\- id

\- booking\_id

\- full\_name

\- age

\- gender

\- primary\_guest

\- government\_id\_type

\- government\_id\_last\_four

Do not store unnecessary full government IDs for every guest.

### **Payments**

payments

\- id

\- payment\_reference

\- booking\_id

\- user\_id

\- method

\- amount

\- status

\- gateway\_name

\- gateway\_transaction\_reference

\- failure\_reason

\- paid\_at

\- created\_at

\- updated\_at

### **Refunds**

refunds

\- id

\- refund\_reference

\- payment\_id

\- booking\_id

\- amount

\- reason

\- status

\- processed\_by

\- processed\_at

\- created\_at

### **Room passcodes**

room\_passcodes

\- id

\- booking\_id

\- passcode\_hash

\- passcode\_last\_two

\- valid\_from

\- valid\_until

\- status

\- failed\_attempts

\- locked\_until

\- generated\_at

\- last\_used\_at

\- created\_at

\- updated\_at

Never store the six-digit passcode as plain text.

### **Service requests**

service\_requests

\- id

\- request\_reference

\- user\_id

\- booking\_id

\- room\_id

\- category

\- title

\- description

\- priority

\- status

\- assigned\_to

\- accepted\_at

\- started\_at

\- completed\_at

\- created\_at

\- updated\_at

### **Maintenance records**

maintenance\_records

\- id

\- maintenance\_reference

\- room\_id

\- title

\- description

\- priority

\- status

\- reported\_by

\- assigned\_to

\- started\_at

\- completed\_at

\- created\_at

\- updated\_at

### **Cleaning tasks**

cleaning\_tasks

\- id

\- cleaning\_reference

\- room\_id

\- booking\_id

\- assigned\_to

\- status

\- notes

\- scheduled\_at

\- started\_at

\- completed\_at

\- created\_at

\- updated\_at

### **Chat threads**

chat\_threads

\- id

\- thread\_reference

\- user\_id

\- booking\_id

\- mode

\- status

\- assigned\_admin\_id

\- escalated\_at

\- last\_message\_at

\- created\_at

\- updated\_at

### **Chat messages**

chat\_messages

\- id

\- thread\_id

\- sender\_id

\- sender\_type

\- message\_type

\- content

\- read\_at

\- created\_at

### **Notifications**

notifications

\- id

\- user\_id

\- type

\- title

\- message

\- related\_entity\_type

\- related\_entity\_id

\- read\_at

\- created\_at

### **Pricing rules**

pricing\_rules

\- id

\- room\_type\_id

\- name

\- minimum\_occupancy\_percentage

\- maximum\_occupancy\_percentage

\- adjustment\_type

\- adjustment\_value

\- minimum\_price

\- maximum\_price

\- active

\- created\_at

\- updated\_at

### **Price snapshots**

price\_snapshots

\- id

\- room\_type\_id

\- target\_date

\- occupancy\_percentage

\- calculated\_price

\- calculated\_at

### **Feedback**

feedback

\- id

\- booking\_id

\- user\_id

\- room\_rating

\- service\_rating

\- cleanliness\_rating

\- overall\_rating

\- comments

\- visible

\- created\_at

\- updated\_at

### **Hotel settings**

hotel\_settings

\- id

\- hotel\_name

\- address

\- phone

\- email

\- currency

\- timezone

\- check\_in\_time

\- check\_out\_time

\- tax\_percentage

\- service\_fee\_percentage

\- cancellation\_cutoff\_hours

\- dynamic\_pricing\_enabled

\- updated\_by

\- updated\_at

### **Audit logs**

audit\_logs

\- id

\- actor\_user\_id

\- action

\- entity\_type

\- entity\_id

\- old\_value\_json

\- new\_value\_json

\- ip\_address

\- created\_at

---

# **9\. Required Enums**

Use exactly these API values unless all frontend teams agree to a formal contract change.

public enum Role {

    CUSTOMER,

    STAFF,

    ADMIN,

    MANAGER

}

public enum BookingStatus {

    PENDING\_PAYMENT,

    CONFIRMED,

    CHECKED\_IN,

    COMPLETED,

    CANCELLED

}

public enum RoomStatus {

    AVAILABLE,

    RESERVED,

    OCCUPIED,

    UNDER\_CLEANING,

    MAINTENANCE

}

public enum PaymentStatus {

    INITIATED,

    PENDING,

    SUCCESS,

    FAILED,

    REFUNDED,

    PARTIALLY\_REFUNDED

}

public enum PaymentMethod {

    CARD,

    UPI,

    CASH

}

public enum PasscodeStatus {

    NOT\_GENERATED,

    NOT\_ACTIVE\_YET,

    ACTIVE,

    LOCKED,

    EXPIRED,

    REVOKED

}

public enum ServiceRequestStatus {

    PENDING,

    ACCEPTED,

    IN\_PROGRESS,

    COMPLETED,

    CANCELLED

}

public enum ServiceCategory {

    HOUSEKEEPING,

    ROOM\_SERVICE,

    MAINTENANCE,

    CONCIERGE,

    LAUNDRY,

    OTHER

}

public enum Priority {

    LOW,

    MEDIUM,

    HIGH,

    URGENT

}

public enum ChatMode {

    BOT,

    ADMIN

}

public enum ChatStatus {

    OPEN,

    WAITING\_FOR\_ADMIN,

    ASSIGNED,

    RESOLVED,

    CLOSED

}

---

# **10\. Room APIs**

## **10.1 Public and customer APIs**

GET /api/v1/rooms

GET /api/v1/rooms/{roomId}

GET /api/v1/room-types

GET /api/v1/room-types/{roomTypeId}

GET /api/v1/rooms/availability

GET /api/v1/rooms/featured

Availability query:

GET /api/v1/rooms/availability?checkInDate=2026-08-10\&checkOutDate=2026-08-12\&adults=2\&children=0\&roomTypeId=2

Example room response:

{

  "id": 1,

  "publicId": "RM-101",

  "roomNumber": "101",

  "roomType": {

    "id": 2,

    "name": "Deluxe",

    "code": "DELUXE"

  },

  "floorNumber": 1,

  "status": "AVAILABLE",

  "basePrice": 4500.00,

  "currentPrice": 4950.00,

  "currency": "INR",

  "maximumAdults": 2,

  "maximumChildren": 1,

  "rating": 4.6,

  "amenities": \[

    "Wi-Fi",

    "Air Conditioning",

    "Smart TV"

  \],

  "images": \[

    {

      "url": "https://images.unsplash.com/...",

      "altText": "Deluxe hotel room"

    }

  \]

}

## **10.2 Admin room APIs**

POST   /api/v1/admin/rooms

PUT    /api/v1/admin/rooms/{roomId}

PATCH  /api/v1/admin/rooms/{roomId}/status

PATCH  /api/v1/admin/rooms/{roomId}/active

POST   /api/v1/admin/room-types

PUT    /api/v1/admin/room-types/{roomTypeId}

Room lookup should accept either:

1

RM-101

101

Internally, resolve the input and use the database room ID consistently.

---

# **11\. Booking APIs and Rules**

## **11.1 Customer booking endpoints**

POST   /api/v1/bookings/quote

POST   /api/v1/bookings

GET    /api/v1/bookings/my

GET    /api/v1/bookings/{bookingId}

POST   /api/v1/bookings/{bookingId}/cancel

## **11.2 Quote request**

{

  "roomId": 1,

  "checkInDate": "2026-08-10",

  "checkOutDate": "2026-08-12",

  "adults": 2,

  "children": 0,

  "promoCode": null

}

Quote response:

{

  "quoteId": "QT-72F681",

  "roomId": 1,

  "numberOfNights": 2,

  "basePricePerNight": 4500.00,

  "appliedPricePerNight": 4950.00,

  "roomAmount": 9900.00,

  "taxPercentage": 12.00,

  "taxAmount": 1188.00,

  "serviceFeePercentage": 5.00,

  "serviceFee": 495.00,

  "discountAmount": 0.00,

  "totalAmount": 11583.00,

  "currency": "INR",

  "validUntil": "2026-08-03T17:00:00+05:30"

}

The frontend may show its own estimate, but the quote endpoint is authoritative.

## **11.3 Booking creation**

{

  "roomId": 1,

  "checkInDate": "2026-08-10",

  "checkOutDate": "2026-08-12",

  "adults": 2,

  "children": 0,

  "specialRequests": "Late arrival",

  "guests": \[

    {

      "fullName": "Abdur Rehman Shaikh",

      "age": 28,

      "primaryGuest": true

    }

  \]

}

Initial booking status:

PENDING\_PAYMENT

The backend should:

1. Authenticate the customer.  
2. Validate dates and capacity.  
3. Check room and room-type activity.  
4. Reject maintenance rooms.  
5. Check booking overlap.  
6. Calculate the price again.  
7. Create the booking.  
8. Return the booking reference and payment amount.  
9. Expire abandoned pending bookings after a configurable period.

## **11.4 Booking overlap query**

A room is unavailable when an existing active booking satisfies:

existing.check\_in\_date \< requested.check\_out\_date

AND

existing.check\_out\_date \> requested.check\_in\_date

Only consider these statuses:

PENDING\_PAYMENT, CONFIRMED, CHECKED\_IN

If pending bookings expire, exclude expired pending-payment records.

This check and booking insertion must execute inside one database transaction.

## **11.5 Price calculation**

Room Amount \= Applied Price per Night × Number of Nights

Tax Amount \= Room Amount × Tax Percentage

Service Fee \= Room Amount × Service Fee Percentage

Total Amount \= Room Amount \+ Tax Amount \+ Service Fee \- Discount

The current console formula uses:

* Tax: 12%  
* Service fee: 5%

These values must come from `hotel_settings`, not be duplicated in several Java classes.

## **11.6 Admin booking APIs**

GET   /api/v1/admin/bookings

GET   /api/v1/admin/bookings/{bookingId}

PATCH /api/v1/admin/bookings/{bookingId}/check-in

PATCH /api/v1/admin/bookings/{bookingId}/check-out

POST  /api/v1/admin/bookings/{bookingId}/cancel

Filters:

status

bookingReference

customerName

customerEmail

roomNumber

checkInFrom

checkInTo

page

size

sort

## **11.7 Allowed booking transitions**

PENDING\_PAYMENT \-\> CONFIRMED

PENDING\_PAYMENT \-\> CANCELLED

CONFIRMED \-\> CHECKED\_IN

CONFIRMED \-\> CANCELLED

CHECKED\_IN \-\> COMPLETED

Disallow:

COMPLETED \-\> CONFIRMED

CANCELLED \-\> CHECKED\_IN

CHECKED\_IN \-\> CANCELLED

Exceptional corrections must be restricted to a manager and written to `audit_logs`.

---

# **12\. Dummy Payment API**

The dummy payment system must simulate realistic states without collecting real financial data.

## **12.1 Endpoints**

POST /api/v1/payments/initiate

POST /api/v1/payments/{paymentId}/confirm

GET  /api/v1/payments/{paymentId}

GET  /api/v1/payments/booking/{bookingId}

POST /api/v1/admin/payments/{paymentId}/refund

GET  /api/v1/admin/payments

## **12.2 Payment request**

{

  "bookingId": 105,

  "method": "CARD",

  "dummyPaymentToken": "tok\_success"

}

Supported dummy tokens:

tok\_success

tok\_failure

tok\_pending

For UPI:

upi\_success

upi\_failure

The backend must not accept or store:

* Full real card numbers  
* CVV  
* UPI PIN  
* Internet banking passwords

If the presentation requires card fields, Angular should validate them visually and convert the dummy form to a dummy token before calling the backend.

## **12.3 Successful payment transaction**

Within one transaction:

1. Confirm the booking is `PENDING_PAYMENT`.  
2. Confirm payment amount equals booking amount.  
3. Create or update payment as `SUCCESS`.  
4. Change booking to `CONFIRMED`.  
5. Generate the passcode record.  
6. Create a booking confirmation notification.  
7. Return the final booking and payment response.

## **12.4 Idempotency**

Accept:

Idempotency-Key: 2df91f3a-8af7-4ed1-ae1a-8bdac96bac86

The same key must not create duplicate payments or duplicate bookings.

---

# **13\. Room Passcode Security**

## **13.1 Passcode lifecycle**

A six-digit passcode is generated after the booking is confirmed.

The generated code:

* Must use `SecureRandom`  
* Must never use `Math.random()`  
* Must be shown only to the booking owner  
* Must not be logged  
* Must be stored as a hash  
* Must be valid only for the booking window  
* Must expire automatically  
* Must be revoked on cancellation  
* Must lock temporarily after repeated failures

## **13.2 Recommended activation rule**

validFrom \= checkInDate at configured check-in time

validUntil \= checkOutDate at configured check-out time

Example:

Check-in: 10 August 2026 at 2:00 PM

Check-out: 12 August 2026 at 11:00 AM

The code is inactive before `validFrom` and expired after `validUntil`.

## **13.3 Passcode endpoints**

GET  /api/v1/bookings/{bookingId}/passcode

POST /api/v1/room-access/validate

POST /api/v1/admin/bookings/{bookingId}/passcode/regenerate

Passcode status response before activation:

{

  "bookingId": 105,

  "status": "NOT\_ACTIVE\_YET",

  "validFrom": "2026-08-10T14:00:00+05:30",

  "validUntil": "2026-08-12T11:00:00+05:30",

  "passcode": null

}

Active response:

{

  "bookingId": 105,

  "status": "ACTIVE",

  "validFrom": "2026-08-10T14:00:00+05:30",

  "validUntil": "2026-08-12T11:00:00+05:30",

  "passcode": "482913"

}

## **13.4 Room access validation**

{

  "roomNumber": "101",

  "passcode": "482913"

}

Response:

{

  "accessGranted": true,

  "message": "Room access granted",

  "validUntil": "2026-08-12T11:00:00+05:30"

}

Rate-limit this endpoint by room and source IP. After five failed attempts, lock access temporarily and notify admin.

---

# **14\. Dynamic Pricing**

## **14.1 Backend authority**

Angular can calculate a preview, but the backend must calculate the final booking price. Otherwise, a user could manipulate the browser request and submit an artificially reduced price.

## **14.2 Occupancy calculation**

For each room type and target date:

Occupancy Percentage \=

Booked Active Rooms of Type / Total Active Bookable Rooms of Type × 100

Exclude maintenance and inactive rooms from total bookable inventory.

## **14.3 Default rules**

Occupancy below 30%:

10% discount

Occupancy from 30% to below 70%:

No adjustment

Occupancy at or above 70%:

15% markup

Example:

Base price: INR 5,000

Occupancy: 75%

Markup: 15%

Calculated price: INR 5,750

Then clamp the value:

finalPrice \= min(max(calculatedPrice, minimumPrice), maximumPrice)

## **14.4 Multi-night booking**

Calculate each night separately, because occupancy can differ by date.

Night 1: INR 4,500

Night 2: INR 4,950

Night 3: INR 5,175

Room amount: INR 14,625

Do not simply use the first night’s price for every night.

## **14.5 Pricing endpoints**

GET  /api/v1/pricing/room-types/{roomTypeId}?date=2026-08-10

GET  /api/v1/admin/pricing/rules

POST /api/v1/admin/pricing/rules

PUT  /api/v1/admin/pricing/rules/{ruleId}

PATCH /api/v1/admin/pricing/enabled

POST /api/v1/admin/pricing/recalculate

The booking record must store a price snapshot. Historical bookings must not change when pricing rules are edited later.

---

# **15\. Service Requests, Cleaning, and Maintenance**

## **15.1 Customer service request APIs**

POST /api/v1/service-requests

GET  /api/v1/service-requests/my

GET  /api/v1/service-requests/{requestId}

POST /api/v1/service-requests/{requestId}/cancel

Request:

{

  "bookingId": 105,

  "category": "HOUSEKEEPING",

  "title": "Extra towels required",

  "description": "Please provide two extra towels",

  "priority": "MEDIUM"

}

Backend checks:

* Booking belongs to authenticated customer  
* Booking is confirmed or checked in  
* Customer may only request services during the allowed stay period  
* Room is derived from booking, not trusted from request input

## **15.2 Admin service APIs**

GET   /api/v1/admin/service-requests

PATCH /api/v1/admin/service-requests/{requestId}/assign

PATCH /api/v1/admin/service-requests/{requestId}/status

Allowed flow:

PENDING \-\> ACCEPTED \-\> IN\_PROGRESS \-\> COMPLETED

Optional:

PENDING \-\> CANCELLED

ACCEPTED \-\> CANCELLED

## **15.3 Cleaning APIs**

GET   /api/v1/admin/cleaning-tasks

POST  /api/v1/admin/cleaning-tasks

PATCH /api/v1/admin/cleaning-tasks/{taskId}/assign

PATCH /api/v1/admin/cleaning-tasks/{taskId}/start

PATCH /api/v1/admin/cleaning-tasks/{taskId}/complete

Checkout flow:

1. Booking becomes `COMPLETED`.  
2. Room becomes `UNDER_CLEANING`.  
3. Cleaning task is created.  
4. Cleaning completion changes room to `AVAILABLE`.  
5. If maintenance is required, room becomes `MAINTENANCE` instead.

## **15.4 Maintenance APIs**

GET   /api/v1/admin/maintenance

POST  /api/v1/admin/maintenance

PATCH /api/v1/admin/maintenance/{maintenanceId}/assign

PATCH /api/v1/admin/maintenance/{maintenanceId}/start

PATCH /api/v1/admin/maintenance/{maintenanceId}/complete

A room under maintenance must not appear as bookable.

---

# **16\. Chat Integration**

## **16.1 Architectural split**

Abdur’s Angular frontend may implement:

* Keyword matching  
* Text normalization  
* String similarity  
* Predefined bot answers  
* Suggested questions  
* Escalation decision

The backend implements:

* Thread creation  
* Message storage  
* Customer ownership  
* Escalation status  
* Admin assignment  
* Admin replies  
* Read status  
* Thread resolution

## **16.2 Customer chat endpoints**

POST /api/v1/chats

GET  /api/v1/chats/my

GET  /api/v1/chats/{threadId}

POST /api/v1/chats/{threadId}/messages

POST /api/v1/chats/{threadId}/escalate

PATCH /api/v1/chats/{threadId}/read

Create thread:

{

  "bookingId": 105,

  "initialMessage": "Can I request an early check-in?",

  "mode": "BOT"

}

Escalation request:

{

  "reason": "BOT\_DID\_NOT\_UNDERSTAND",

  "lastBotConfidence": 0.32

}

After escalation:

mode \= ADMIN

status \= WAITING\_FOR\_ADMIN

## **16.3 Admin chat endpoints**

GET   /api/v1/admin/chats

GET   /api/v1/admin/chats/{threadId}

PATCH /api/v1/admin/chats/{threadId}/assign

POST  /api/v1/admin/chats/{threadId}/messages

PATCH /api/v1/admin/chats/{threadId}/resolve

## **16.4 Real-time strategy**

For the first version, use HTTP polling every 3 to 5 seconds.

This is simpler than WebSockets and reduces integration risk.

Angular flow:

GET /admin/chats/{id}

Every 5 seconds

Stop polling when the component is destroyed

WebSockets may be added after all normal chat behavior works correctly.

---

# **17\. Notifications and Feedback**

## **17.1 Notification APIs**

GET   /api/v1/notifications

GET   /api/v1/notifications/unread-count

PATCH /api/v1/notifications/{notificationId}/read

PATCH /api/v1/notifications/read-all

Generate notifications for:

* Booking confirmed  
* Payment successful  
* Booking cancelled  
* Refund processed  
* Passcode active  
* Upcoming check-in  
* Service request accepted  
* Service request completed  
* Admin chat reply

## **17.2 Feedback APIs**

POST /api/v1/feedback

GET  /api/v1/feedback/my

GET  /api/v1/rooms/{roomId}/feedback

GET  /api/v1/admin/feedback

PATCH /api/v1/admin/feedback/{feedbackId}/visibility

Rules:

* Only completed bookings can be reviewed  
* Only the booking owner can submit feedback  
* One feedback record per booking  
* Ratings must be between 1 and 5  
* Feedback cannot be submitted for cancelled bookings

---

# **18\. Admin Dashboard and Reports**

## **18.1 Dashboard endpoint**

GET /api/v1/admin/dashboard/summary

Response:

{

  "totalRooms": 10,

  "availableRooms": 4,

  "occupiedRooms": 3,

  "reservedRooms": 2,

  "maintenanceRooms": 1,

  "todayCheckIns": 2,

  "todayCheckOuts": 1,

  "pendingServiceRequests": 5,

  "waitingChatThreads": 2,

  "currentOccupancyPercentage": 50.00,

  "todayRevenue": 12500.00,

  "monthlyRevenue": 285000.00,

  "currency": "INR"

}

## **18.2 Reports**

GET /api/v1/admin/reports/revenue

GET /api/v1/admin/reports/bookings

GET /api/v1/admin/reports/occupancy

GET /api/v1/admin/reports/services

GET /api/v1/admin/reports/revenue/export

GET /api/v1/admin/reports/bookings/export

Filters:

fromDate

toDate

roomTypeId

bookingStatus

paymentStatus

serviceCategory

CSV export requirements:

* UTF-8 output  
* Header row  
* Stable column ordering  
* Correct date and money formatting  
* No password, token, passcode, or full government-ID data

---

# **19\. Validation Rules**

## **19.1 Registration**

* First and last name: 2 to 50 characters  
* Letters, spaces, apostrophes, and hyphens only  
* Email: syntactically valid and unique  
* Phone: exactly 10 digits for the current test scope  
* Password: strong-password rules  
* Confirmation password must match  
* Date of birth cannot be in the future  
* Minimum age can be set to 18 for the primary account holder  
* Government ID type must be supported  
* ID format must match the selected type

## **19.2 Booking**

* Check-in cannot be before the current hotel date  
* Checkout must be after check-in  
* At least one night  
* Maximum stay length should be configurable  
* Guest count must be positive  
* Guest count must not exceed room capacity  
* Room must be active and bookable  
* Dates must not overlap another active booking  
* Customer must be active

## **19.3 Payment**

* Booking must belong to customer  
* Booking must be pending payment  
* Payment amount comes from the database  
* Customer cannot submit a custom amount  
* Duplicate successful payment must be rejected  
* Refund cannot exceed successful paid amount

## **19.4 Service requests**

* Title: 3 to 100 characters  
* Description: 5 to 500 characters  
* Valid booking ownership  
* Valid booking state  
* Valid status transition  
* Assigned user must have admin or staff privileges

## **19.5 Chat**

* Message cannot be blank  
* Maximum length: 1,000 characters  
* Strip or safely encode unsafe HTML  
* Customer must own the thread  
* Closed threads cannot accept messages unless reopened by admin

---

# **20\. Security Requirements**

## **20.1 Mandatory protections**

* BCrypt password hashing  
* JWT signature validation  
* Role checking  
* Resource ownership checks  
* DTO validation  
* Parameterized SQL  
* Restricted CORS  
* Rate limiting for login and passcode validation  
* Generic login error messages  
* Account lockout after repeated login failures  
* Masked government IDs  
* No sensitive data in logs  
* No raw SQL built using user input  
* No front-end supplied user ID trusted for ownership  
* No front-end supplied payment amount trusted  
* No front-end supplied role trusted  
* No client-side passcode generation  
* No public admin registration endpoint

## **20.2 CORS**

Development origin:

http://localhost:4200

Allowed methods:

GET, POST, PUT, PATCH, DELETE, OPTIONS

Allowed headers:

Authorization, Content-Type, Idempotency-Key

Do not use unrestricted origins together with credentials.

## **20.3 SQL safety**

Correct:

jdbcTemplate.query(

    "SELECT \* FROM users WHERE email \= ?",

    userRowMapper,

    email

);

Incorrect:

String sql \= "SELECT \* FROM users WHERE email \= '" \+ email \+ "'";

## **20.4 Authorization example**

A customer requesting:

GET /api/v1/bookings/105

must only receive the booking if:

booking.user\_id \== authenticatedUser.id

An administrator may access it through an admin endpoint.

Do not rely only on hiding buttons in Angular.

---

# **21\. Transactions and Concurrency**

Use `@Transactional` at the service level for:

* Booking creation  
* Payment success  
* Refund processing  
* Cancellation  
* Check-in  
* Checkout  
* Cleaning completion  
* Passcode regeneration  
* Room maintenance changes affecting bookings

Example payment transaction:

BEGIN

  Validate booking

  Verify no existing successful payment

  Insert/update payment

  Update booking status

  Create passcode

  Create notification

COMMIT

If any step fails:

ROLLBACK

## **21.1 Preventing double booking**

At minimum:

1. Begin transaction.  
2. Lock the selected room row or relevant availability records.  
3. Check overlapping bookings.  
4. Insert booking.  
5. Commit.

The availability endpoint alone is insufficient because two customers can view the same room as available simultaneously.

---

# **22\. Scheduled Tasks**

Create scheduled services for:

## **22.1 Pending booking expiry**

Run every few minutes:

PENDING\_PAYMENT booking older than configured timeout

\-\> CANCELLED

## **22.2 Passcode status**

Status can be calculated at request time:

now \< validFrom             \-\> NOT\_ACTIVE\_YET

validFrom \<= now \< validUntil \-\> ACTIVE

now \>= validUntil           \-\> EXPIRED

A scheduler may also persist updated states, but API behavior must not depend exclusively on the scheduler.

## **22.3 Upcoming stay notifications**

Run periodically and create notifications for:

* Check-in within 24 hours  
* Passcode activation  
* Checkout approaching

## **22.4 Abandoned chat cleanup**

Optionally close inactive resolved chat threads after a configured period.

---

# **23\. Seed Data**

Seed data must be idempotent. Restarting the backend must not insert duplicates.

## **23.1 Customers**

guest@example.com

Guest@123

emily@example.com

Guest@123

## **23.2 Administrators**

admin@example.com

Admin@123

STAFF2026

Role: ADMIN

manager@example.com

Manager@123

STAFF2027

Role: MANAGER

staff@example.com

Staff@123

STAFF2028

Role: STAFF

Passwords and staff codes must be stored as hashes.

## **23.3 Additional seed data**

Create:

* 4 room types  
* 10 rooms  
* 8 to 12 amenities  
* Multiple room image URLs  
* 4 bookings across different statuses  
* 4 payments  
* 4 service requests  
* 3 chat threads  
* Notifications  
* Feedback  
* Dynamic pricing rules  
* Hotel settings  
* Cleaning tasks  
* Maintenance record

---

# **24\. Testing Requirements**

## **24.1 Unit tests**

At minimum:

* Price calculation  
* Occupancy calculation  
* Dynamic pricing thresholds  
* Minimum and maximum price limits  
* Number of nights  
* Booking overlap  
* Cancellation refund calculation  
* Booking state transitions  
* Passcode status  
* Passcode expiry  
* Service request transitions

## **24.2 Integration tests**

Test:

* Registration and duplicate email  
* Successful and failed login  
* Customer denied admin endpoint  
* Admin allowed admin endpoint  
* Room availability  
* Booking creation  
* Double-booking prevention  
* Payment success  
* Payment failure  
* Duplicate payment  
* Cancellation and refund  
* Access to another customer’s booking denied  
* Service request lifecycle  
* Chat escalation  
* Admin chat reply  
* Feedback before completed stay rejected

## **24.3 Required demonstration scenarios**

During the presentation, the team should be able to demonstrate:

1. Customer registration  
2. Customer login  
3. Room search  
4. Dynamic price display  
5. Booking creation  
6. Dummy successful payment  
7. Booking confirmation  
8. Passcode inactive before booking  
9. Passcode active during booking  
10. Customer service request  
11. Admin accepts and completes request  
12. Bot cannot understand question  
13. Chat escalates to admin  
14. Admin responds  
15. Customer sees reply  
16. Admin checks guest in  
17. Admin checks guest out  
18. Room moves to cleaning  
19. Cleaning completion makes room available  
20. Completed booking becomes eligible for feedback

---

# **25\. Angular Integration Contract**

## **25.1 Backend deliverables to other team members**

Rohit must provide:

smartstay-backend.zip

database/schema.sql

database/data.sql

Postman collection

Postman environment

API contract

Enum list

Test account list

application configuration example

run instructions

## **25.2 Do not rename API fields independently**

Once Angular development starts, do not silently change:

checkInDate \-\> arrivalDate

bookingReference \-\> bookingCode

roomType \-\> category

Any API change must be recorded in a shared file:

API\_CHANGE\_LOG.txt

Entry format:

Date: 2026-08-03

Changed by: Rohit Naik

Endpoint: POST /api/v1/bookings

Change: Added children field

Reason: Capacity validation

Frontend impact: Booking form and BookingRequest interface

## **25.3 Shared frontend model example**

Angular will expect interfaces similar to:

export interface ApiResponse\<T\> {

  success: boolean;

  message: string;

  data: T;

  timestamp: string;

}

export type BookingStatus \=

  | 'PENDING\_PAYMENT'

  | 'CONFIRMED'

  | 'CHECKED\_IN'

  | 'COMPLETED'

  | 'CANCELLED';

Backend responses must match these values exactly.

---

# **26\. Collaboration Without GitHub**

Since the team cannot use GitHub or a shared source-control system, use a strict handoff process.

## **26.1 Ownership**

* Rohit: entire backend  
* Abdur: complete customer-facing Angular panel  
* Pranay: assigned admin Angular pages  
* Shubham: remaining admin Angular pages

Only Rohit should edit backend source files during the main development phase.

## **26.2 Shared contract folder**

Maintain a common folder:

SmartStay-Integration-Contract/

├── API\_CONTRACT.md

├── API\_CHANGE\_LOG.txt

├── ENUMS.json

├── TEST\_ACCOUNTS.txt

├── DATABASE\_SCHEMA.sql

├── SmartStay.postman\_collection.json

├── sample-responses/

└── releases/

## **26.3 Release naming**

smartstay-backend-v0.1.0-2026-08-03.zip

smartstay-backend-v0.2.0-2026-08-07.zip

smartstay-backend-v1.0.0-2026-08-15.zip

Do not exchange folders named:

final

latest

final-new

final-working

final-final

## **26.4 Manual version record**

Every delivery should include:

VERSION.txt

Example:

Version: 0.3.0

Developer: Rohit Naik

Date: 2026-08-10

Added:

\- Booking creation

\- Dummy payment

\- Passcode generation

Changed:

\- Room availability response

Fixed:

\- Checkout date overlap

Known issues:

\- CSV report export pending

---

# **27\. Recommended Development Order**

## **Phase 1: Foundation**

1. Create project.  
2. Configure MySQL.  
3. Create schema and seed data.  
4. Implement global response format.  
5. Implement exception handling.  
6. Configure CORS.  
7. Add health endpoint.

## **Phase 2: Authentication**

1. User repository  
2. Registration  
3. BCrypt  
4. Login  
5. JWT  
6. Roles  
7. `/auth/me`  
8. Security tests

## **Phase 3: Rooms**

1. Room types  
2. Rooms  
3. Amenities  
4. Images  
5. Search and filters  
6. Availability  
7. Admin CRUD

## **Phase 4: Booking and pricing**

1. Pricing calculation  
2. Dynamic pricing  
3. Booking quote  
4. Booking creation  
5. Overlap protection  
6. Booking lists  
7. Admin booking management

## **Phase 5: Payment and passcode**

1. Dummy payment  
2. Payment confirmation  
3. Booking confirmation  
4. Passcode generation  
5. Passcode validation  
6. Refunds  
7. Cancellation

## **Phase 6: Hotel operations**

1. Service requests  
2. Cleaning tasks  
3. Maintenance  
4. Check-in  
5. Checkout  
6. Notifications

## **Phase 7: Communication**

1. Chat threads  
2. Chat messages  
3. Escalation  
4. Admin assignment  
5. Polling-compatible responses

## **Phase 8: Reporting and quality**

1. Dashboard  
2. Reports  
3. CSV exports  
4. Audit logs  
5. Tests  
6. Postman collection  
7. Documentation

---

# **28\. Definition of Done**

The backend is complete only when:

* The project starts through Eclipse and Maven  
* MySQL schema initializes successfully  
* Seed accounts work  
* Every endpoint has a predictable response structure  
* All enums match the documented contract  
* JWT authentication works  
* Customer and admin permissions are separated  
* Customers cannot access one another’s records  
* Booking conflicts are prevented by the server  
* Final pricing is calculated by the server  
* Payment is safely simulated  
* Passcodes are generated securely and expire correctly  
* Service-request transitions are enforced  
* Chat escalation persists correctly  
* Admin replies can be retrieved by customers  
* Cleaning and maintenance affect room availability  
* Validation errors identify the relevant form fields  
* Sensitive information is not returned or logged  
* Unit and integration tests pass  
* Postman collection is current  
* API change log is current  
* A clean database can be created from supplied scripts

---

# **29\. Final Instructions for Rohit**

1. Treat this document as the backend contract.  
2. Do not expose database models directly.  
3. Do not trust amounts, roles, user IDs, room status, or prices sent by Angular.  
4. Keep controllers thin.  
5. Put business rules in services.  
6. Put SQL only in repositories.  
7. Use transactions for multi-step operations.  
8. Use database constraints in addition to Java validation.  
9. Keep API names and enum values stable.  
10. Test every status transition.  
11. Supply sample requests and responses before Angular integration begins.  
12. Prefer complete, reliable modules over adding unfinished features.  
13. Inform all three frontend developers before changing an established endpoint.  
14. Maintain a Postman collection as the executable API specification.  
15. Make the backend independently demonstrable before combining it with Angular.

## **Documentation design rationale**

This specification separates API, database, security, validation, and integration responsibilities so that frontend developers can work against a stable contract. It also keeps optional presentation logic in Angular while ensuring that security-sensitive and data-sensitive rules remain authoritative in Spring Boot.

