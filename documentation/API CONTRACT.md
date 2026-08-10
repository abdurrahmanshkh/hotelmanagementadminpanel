# SmartStay Spring Boot REST API Contract


**Audience:** Frontend developers integrating the SmartStay web/mobile interface  
**Backend base URL (development):** `http://localhost:8080`  
**API prefix:** `/api/v1`  
**Authentication:** JWT bearer token  
**Default hotel timezone:** Configurable through hotel settings; initial value `Asia/Kolkata`  
**Default currency:** Configurable through hotel settings; initial value `INR`


> **Implementation note:** This contract consolidates the APIs designed during backend development. The endpoint paths and DTOs should be checked once against the final controller classes, especially payment, chat, notification, service-request, and passcode methods if their names were changed during implementation.


---


## 1. Common conventions


### 1.1 JSON request headers


```http
Content-Type: application/json
```


### 1.2 Authenticated request headers


```http
Authorization: Bearer <access-token>
```


### 1.3 Idempotent payment header


Payment confirmation should also send:


```http
Idempotency-Key: <UUID-or-other-unique-key>
```


Generate one key for a payment operation and reuse that same key only when retrying the identical request.


### 1.4 Standard success envelope


```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```


### 1.5 Standard error envelope


```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "fieldErrors": {
    "fieldName": "Validation message"
  },
  "path": "/api/v1/example",
  "timestamp": "2026-08-09T15:10:47.6513883+05:30"
}
```


### 1.6 Common HTTP statuses


- `200 OK` — successful read/update/action.
- `201 Created` — resource created.
- `400 Bad Request` — validation or business-rule failure.
- `401 Unauthorized` — missing, invalid, or expired JWT.
- `403 Forbidden` — valid user does not have the required role.
- `404 Not Found` — requested resource does not exist or is not visible to the caller.
- `405 Method Not Allowed` — path exists but the HTTP method is wrong.
- `409 Conflict` — duplicate resource, invalid state transition, optimistic-lock conflict, or concurrent update.
- `429 Too Many Requests` — reserved for rate limiting.
- `500 Internal Server Error` — unexpected server error.


### 1.7 Roles


```text
CUSTOMER
STAFF
ADMIN
MANAGER
```


### 1.8 Date and time formats


```text
Local date:       YYYY-MM-DD
Local time:       HH:mm:ss
Offset timestamp: YYYY-MM-DDTHH:mm:ss+05:30
```


---


# 2. Authentication APIs


## 2.1 Register customer


```http
POST /api/v1/auth/register
```


**Authentication:** Public


### Request


```json
{
  "firstName": "Rohit",
  "lastName": "Sharma",
  "email": "rohit@example.com",
  "phone": "9876543210",
  "password": "Guest@123",
  "confirmPassword": "Guest@123"
}
```


### Validation


- First and last name are required.
- Email must be valid and unique.
- Phone must be a unique 10-digit Indian mobile number.
- Password must satisfy configured complexity rules.
- `confirmPassword` must equal `password`.


### Success — `201 Created`


```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 12,
    "publicId": "USR-A1B2C3D4",
    "firstName": "Rohit",
    "lastName": "Sharma",
    "email": "rohit@example.com",
    "phone": "9876543210",
    "role": "CUSTOMER"
  }
}
```


### Important errors


```text
VALIDATION_FAILED
DUPLICATE_USER
```


---


## 2.2 Login


```http
POST /api/v1/auth/login
```


**Authentication:** Public


### Request


```json
{
  "email": "rohit@example.com",
  "password": "Guest@123"
}
```


### Success — `200 OK`


```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresInSeconds": 3600,
    "user": {
      "id": 12,
      "publicId": "USR-A1B2C3D4",
      "firstName": "Rohit",
      "lastName": "Sharma",
      "email": "rohit@example.com",
      "phone": "9876543210",
      "role": "CUSTOMER"
    }
  }
}
```


### Important errors


```text
INVALID_CREDENTIALS
ACCOUNT_TEMPORARILY_LOCKED
```


The backend may lock an account temporarily after repeated failed attempts. The frontend must not reveal whether an email is registered.


---


## 2.3 Current authenticated identity


```http
GET /api/v1/auth/me
```


**Authentication:** Any authenticated user


### Success


```json
{
  "success": true,
  "message": "Authenticated user retrieved successfully",
  "data": {
    "id": 12,
    "publicId": "USR-A1B2C3D4",
    "firstName": "Rohit",
    "lastName": "Sharma",
    "email": "rohit@example.com",
    "phone": "9876543210",
    "role": "CUSTOMER"
  }
}
```


---


# 3. Customer profile APIs


## 3.1 Get profile


```http
GET /api/v1/users/me
```


**Authentication:** Any authenticated user


### Success payload


```json
{
  "id": 12,
  "publicId": "USR-A1B2C3D4",
  "firstName": "Rohit",
  "lastName": "Sharma",
  "email": "rohit@example.com",
  "phone": "9876543210",
  "role": "CUSTOMER",
  "active": true,
  "createdAt": "2026-08-09T14:00:00+05:30",
  "updatedAt": "2026-08-09T14:00:00+05:30"
}
```


---


## 3.2 Update profile


```http
PUT /api/v1/users/me
```


**Authentication:** Any authenticated user


### Request


```json
{
  "firstName": "Rohit",
  "lastName": "Sharma",
  "phone": "9876543299"
}
```


Email, role, active status, and password cannot be changed here.


### Important errors


```text
PHONE_ALREADY_IN_USE
PROFILE_UPDATE_FAILED
```


---


## 3.3 Change password


```http
POST /api/v1/users/me/change-password
```


**Authentication:** Any authenticated user


### Request


```json
{
  "currentPassword": "Guest@123",
  "newPassword": "Guest@456",
  "confirmNewPassword": "Guest@456"
}
```


### Success


```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "passwordChanged": true
  }
}
```


### Important errors


```text
PASSWORD_CONFIRMATION_MISMATCH
CURRENT_PASSWORD_INCORRECT
NEW_PASSWORD_SAME_AS_CURRENT
PASSWORD_UPDATE_FAILED
```


---


# 4. Public room-type APIs


## 4.1 List active room types


```http
GET /api/v1/room-types
```


**Authentication:** Public


### Success payload


```json
[
  {
    "id": 1,
    "name": "Deluxe",
    "code": "DELUXE",
    "description": "Comfortable deluxe room",
    "basePrice": 4500.00,
    "minimumPrice": 4000.00,
    "maximumPrice": 6500.00,
    "maximumAdults": 2,
    "maximumChildren": 1,
    "bedType": "KING",
    "roomSizeSqft": 350,
    "active": true,
    "currency": "INR"
  }
]
```


---


## 4.2 Get one room type


```http
GET /api/v1/room-types/{roomTypeId}
```


**Authentication:** Public


---


# 5. Public room APIs


## 5.1 List active rooms


```http
GET /api/v1/rooms
```


**Authentication:** Public


### Success payload


```json
[
  {
    "id": 3,
    "publicId": "RM-203",
    "roomNumber": "203",
    "floorNumber": 2,
    "status": "AVAILABLE",
    "description": "A modern deluxe room",
    "imageUrl": "https://example.com/room-203.jpg",
    "rating": 4.50,
    "active": true,
    "roomType": {
      "id": 1,
      "name": "Deluxe",
      "code": "DELUXE",
      "basePrice": 4500.00,
      "maximumAdults": 2,
      "maximumChildren": 1
    },
    "basePrice": 4500.00,
    "currency": "INR"
  }
]
```


> If the final backend response exposes flat fields such as `roomTypeId` and `roomTypeName`, the frontend interface should follow the actual Network response.


---


## 5.2 Get room details


```http
GET /api/v1/rooms/{roomIdentifier}
```


`roomIdentifier` may be a database ID or public room ID, depending on the final service implementation.


Examples:


```http
GET /api/v1/rooms/3
GET /api/v1/rooms/RM-203
```


**Authentication:** Public


---


## 5.3 Search room availability


```http
GET /api/v1/rooms/availability
```


**Authentication:** Public


### Query parameters


```text
checkInDate   required, YYYY-MM-DD
checkOutDate  required, YYYY-MM-DD
adults        required, integer >= 1
children      required, integer >= 0
roomTypeId    optional
```


### Example


```http
GET /api/v1/rooms/availability?checkInDate=2026-08-20&checkOutDate=2026-08-22&adults=2&children=0&roomTypeId=1
```


### Success payload


Returns the same room structure as `GET /api/v1/rooms`, filtered by capacity, active status, room status, and booking overlap.


### Important errors


```text
INVALID_CHECK_IN_DATE
INVALID_BOOKING_DATES
MAXIMUM_STAY_EXCEEDED
```


---


## 5.4 Get public room feedback


```http
GET /api/v1/rooms/{roomId}/feedback
```


**Authentication:** Public


### Success payload


```json
[
  {
    "id": 1,
    "feedbackReference": "FDB-ABC123",
    "bookingId": 42,
    "bookingReference": "BK-XYZ123",
    "roomId": 3,
    "publicRoomId": "RM-203",
    "roomNumber": "203",
    "roomTypeName": "Deluxe",
    "userId": 12,
    "customerName": "Rohit Sharma",
    "rating": 5,
    "title": "Excellent stay",
    "comments": "The room was clean and comfortable.",
    "visible": true,
    "adminResponse": null,
    "respondedBy": null,
    "respondedByName": null,
    "respondedAt": null,
    "createdAt": "2026-08-09T12:00:00+05:30",
    "updatedAt": "2026-08-09T12:00:00+05:30"
  }
]
```


---


# 6. Booking quote API


## 6.1 Generate quote


```http
POST /api/v1/bookings/quote
```


**Authentication:** Customer JWT recommended/required according to final controller security.


### Request


```json
{
  "roomId": 3,
  "checkInDate": "2026-08-20",
  "checkOutDate": "2026-08-22",
  "adults": 2,
  "children": 0,
  "promoCode": null
}
```


### Success payload


```json
{
  "quoteId": "QTE-ABC123",
  "roomId": 3,
  "publicRoomId": "RM-203",
  "roomNumber": "203",
  "roomTypeId": 1,
  "roomTypeName": "Deluxe",
  "numberOfNights": 2,
  "basePricePerNight": 4500.00,
  "appliedPricePerNight": 4500.00,
  "nightlyPrices": [
    {
      "date": "2026-08-20",
      "totalRooms": 10,
      "occupiedRooms": 4,
      "occupancyPercentage": 40.00,
      "basePrice": 4500.00,
      "adjustmentPercentage": 0.00,
      "appliedPrice": 4500.00
    },
    {
      "date": "2026-08-21",
      "totalRooms": 10,
      "occupiedRooms": 7,
      "occupancyPercentage": 70.00,
      "basePrice": 4500.00,
      "adjustmentPercentage": 15.00,
      "appliedPrice": 5175.00
    }
  ],
  "roomAmount": 9675.00,
  "taxPercentage": 12.00,
  "taxAmount": 1161.00,
  "serviceFeePercentage": 6.00,
  "serviceFee": 580.50,
  "discountAmount": 0.00,
  "totalAmount": 11416.50,
  "currency": "INR",
  "validUntil": "2026-08-09T15:45:00+05:30"
}
```


### Important errors


```text
ROOM_NOT_FOUND
BOOKING_DATE_CONFLICT
INVALID_CHECK_IN_DATE
INVALID_BOOKING_DATES
MAXIMUM_STAY_EXCEEDED
INVALID_ROOM_CAPACITY
```


---


# 7. Customer booking APIs


## 7.1 Create booking


```http
POST /api/v1/bookings
```


**Authentication:** Customer


### Request


```json
{
  "roomId": 3,
  "checkInDate": "2026-08-20",
  "checkOutDate": "2026-08-22",
  "adults": 2,
  "children": 0,
  "specialRequests": "Quiet room if possible"
}
```


If the final DTO includes `quoteId` or `promoCode`, include those fields according to the controller request record.


### Success — `201 Created`


```json
{
  "id": 43,
  "bookingReference": "BK-ABC123",
  "roomId": 3,
  "publicRoomId": "RM-203",
  "roomNumber": "203",
  "roomTypeName": "Deluxe",
  "checkInDate": "2026-08-20",
  "checkOutDate": "2026-08-22",
  "adults": 2,
  "children": 0,
  "numberOfNights": 2,
  "status": "PENDING_PAYMENT",
  "roomAmount": 9675.00,
  "taxAmount": 1161.00,
  "serviceFee": 580.50,
  "discountAmount": 0.00,
  "totalAmount": 11416.50,
  "currency": "INR",
  "paymentExpiresAt": "2026-08-09T15:50:00+05:30"
}
```


---


## 7.2 List current customer bookings


```http
GET /api/v1/bookings/my
```


**Authentication:** Customer


> Some implementations may expose `GET /api/v1/bookings` for the authenticated customer instead. Confirm the final `BookingController` mapping.


### Success payload


```json
[
  {
    "id": 43,
    "bookingReference": "BK-ABC123",
    "roomId": 3,
    "publicRoomId": "RM-203",
    "roomNumber": "203",
    "roomTypeName": "Deluxe",
    "checkInDate": "2026-08-20",
    "checkOutDate": "2026-08-22",
    "adults": 2,
    "children": 0,
    "numberOfNights": 2,
    "status": "PENDING_PAYMENT",
    "basePricePerNight": 4500.00,
    "appliedPricePerNight": 4500.00,
    "roomAmount": 9000.00,
    "taxAmount": 1080.00,
    "serviceFee": 540.00,
    "discountAmount": 0.00,
    "totalAmount": 10620.00,
    "specialRequests": "Quiet room",
    "currency": "INR",
    "paymentExpiresAt": "2026-08-09T15:50:00+05:30",
    "createdAt": "2026-08-09T15:30:00+05:30"
  }
]
```


---


## 7.3 Get customer booking details


```http
GET /api/v1/bookings/{bookingIdentifier}
```


**Authentication:** Customer and booking owner


`bookingIdentifier` may be a database ID or booking reference.


Examples:


```http
GET /api/v1/bookings/43
GET /api/v1/bookings/BK-ABC123
```


---


## 7.4 Cancel booking


```http
POST /api/v1/bookings/{bookingId}/cancel
```


**Authentication:** Customer and booking owner


### Request


```json
{
  "reason": "Travel plans changed"
}
```


### Success payload


```json
{
  "bookingId": 43,
  "bookingReference": "BK-ABC123",
  "bookingStatus": "CANCELLED",
  "paymentFound": true,
  "refundEligible": true,
  "refundPercentage": 100.00,
  "refundAmount": 10620.00,
  "refundId": 9,
  "refundReference": "REF-ABC123",
  "refundStatus": "PROCESSED",
  "passcodeRevoked": true,
  "cancelledAt": "2026-08-09T16:00:00+05:30",
  "currency": "INR"
}
```


### Important errors


```text
BOOKING_ALREADY_CANCELLED
CHECKED_IN_BOOKING_CANNOT_BE_CANCELLED
COMPLETED_BOOKING_CANNOT_BE_CANCELLED
INVALID_BOOKING_STATUS
BOOKING_STATUS_CHANGED
```


---


# 8. Payment APIs


## 8.1 Initiate payment


```http
POST /api/v1/payments/initiate
```


**Authentication:** Customer and booking owner


### Request


```json
{
  "bookingId": 43
}
```


The final initiation DTO may also request a payment method. Check the final Java record if validation reports another required field.


### Success payload


```json
{
  "id": 15,
  "paymentId": 15,
  "paymentReference": "PAY-ABC123",
  "bookingId": 43,
  "status": "PENDING",
  "amount": 10620.00,
  "currency": "INR",
  "dummyPaymentToken": "DUMMY-TOKEN-ABC123",
  "createdAt": "2026-08-09T15:35:00+05:30"
}
```


The frontend must retain:


```text
paymentId
dummyPaymentToken
```


---


## 8.2 Confirm payment


```http
POST /api/v1/payments/{paymentId}/confirm
```


**Authentication:** Customer and payment owner


**Additional header:**


```http
Idempotency-Key: edfa16eb-c76a-413f-8f98-fac7edc4c0d4
```


### Request


```json
{
  "dummyPaymentToken": "DUMMY-TOKEN-ABC123"
}
```


### Success payload


```json
{
  "id": 15,
  "paymentReference": "PAY-ABC123",
  "bookingId": 43,
  "bookingReference": "BK-ABC123",
  "status": "SUCCESS",
  "amount": 10620.00,
  "currency": "INR",
  "failureReason": null,
  "paidAt": "2026-08-09T15:37:00+05:30",
  "createdAt": "2026-08-09T15:35:00+05:30"
}
```


A successful payment should confirm the booking, generate a room passcode, and create notifications in the same business flow.


### Important errors


```text
PAYMENT_NOT_FOUND
INVALID_DUMMY_PAYMENT_TOKEN
PAYMENT_ALREADY_PROCESSED
BOOKING_STATUS_CHANGED
IDEMPOTENCY_KEY_REQUIRED
INVALID_IDEMPOTENCY_KEY
IDEMPOTENCY_KEY_REUSED
PAYMENT_REQUEST_IN_PROGRESS
```


---


# 9. Room passcode APIs


## 9.1 Get passcode status


```http
GET /api/v1/bookings/{bookingId}/passcode
```


**Authentication:** Customer and booking owner


> Confirm the final passcode controller mapping; some versions may use `/api/v1/passcodes/{bookingId}`.


### Success payload


```json
{
  "bookingId": 43,
  "status": "NOT_ACTIVE_YET",
  "maskedPasscode": "****42",
  "failedAttempts": 0,
  "lockedUntil": null,
  "validFrom": "2026-08-20T14:00:00+05:30",
  "validUntil": "2026-08-22T11:00:00+05:30",
  "lastUsedAt": null
}
```


Possible statuses:


```text
NOT_ACTIVE_YET
ACTIVE
LOCKED
EXPIRED
REVOKED
```


---


## 9.2 Validate room access


```http
POST /api/v1/room-access/validate
```


**Authentication:** Public or authenticated according to final security configuration.


### Request


```json
{
  "roomId": 3,
  "passcode": "123456"
}
```


### Success payload


```json
{
  "granted": true,
  "message": "Room access granted",
  "validUntil": "2026-08-22T11:00:00+05:30"
}
```


### Important errors


```text
PASSCODE_NOT_ACTIVE
PASSCODE_EXPIRED
PASSCODE_REVOKED
PASSCODE_LOCKED
INVALID_PASSCODE
```


---


# 10. Customer service-request APIs


## 10.1 Create service request


```http
POST /api/v1/service-requests
```


**Authentication:** Customer


### Request


```json
{
  "bookingId": 43,
  "category": "HOUSEKEEPING",
  "title": "Extra towels required",
  "description": "Please provide two extra towels",
  "priority": "MEDIUM"
}
```


Example categories may include:


```text
HOUSEKEEPING
ROOM_SERVICE
MAINTENANCE
OTHER
```


Use the values in the final `ServiceCategory` enum.


### Success payload


```json
{
  "id": 18,
  "serviceReference": "SRV-ABC123",
  "bookingId": 43,
  "bookingReference": "BK-ABC123",
  "roomId": 3,
  "roomNumber": "203",
  "category": "HOUSEKEEPING",
  "title": "Extra towels required",
  "description": "Please provide two extra towels",
  "priority": "MEDIUM",
  "status": "PENDING",
  "assignedTo": null,
  "assignedToName": null,
  "createdAt": "2026-08-20T16:00:00+05:30",
  "updatedAt": "2026-08-20T16:00:00+05:30"
}
```


---


## 10.2 List my service requests


```http
GET /api/v1/service-requests/my
```


**Authentication:** Customer


---


## 10.3 Get one service request


```http
GET /api/v1/service-requests/{serviceRequestId}
```


**Authentication:** Customer and owner


---


## 10.4 Cancel service request


```http
POST /api/v1/service-requests/{serviceRequestId}/cancel
```


**Authentication:** Customer and owner


### Request


```json
{
  "reason": "No longer required"
}
```


> Confirm whether the final implementation uses `POST`, `PATCH`, or `DELETE` for customer cancellation.


---


# 11. Notification APIs


## 11.1 List notifications


```http
GET /api/v1/notifications
```


**Authentication:** Authenticated user


### Success payload


```json
[
  {
    "id": 101,
    "type": "BOOKING_CONFIRMED",
    "title": "Booking confirmed",
    "message": "Your booking BK-ABC123 has been confirmed.",
    "read": false,
    "relatedEntityType": "BOOKING",
    "relatedEntityId": 43,
    "createdAt": "2026-08-09T15:37:00+05:30"
  }
]
```


---


## 11.2 Unread count


```http
GET /api/v1/notifications/unread-count
```


### Success payload


```json
{
  "unreadCount": 3
}
```


---


## 11.3 Mark one notification read


```http
PATCH /api/v1/notifications/{notificationId}/read
```


---


## 11.4 Mark all notifications read


```http
PATCH /api/v1/notifications/read-all
```


---


# 12. Customer chat APIs


## 12.1 Create chat thread


```http
POST /api/v1/chats
```


**Authentication:** Customer


### Request


```json
{
  "bookingId": 43,
  "initialMessage": "I need help with my booking.",
  "mode": "BOT"
}
```


`bookingId` may be `null` for a general enquiry.


### Success payload


```json
{
  "id": 7,
  "chatReference": "CHT-ABC123",
  "bookingId": 43,
  "status": "BOT_ACTIVE",
  "assignedAdminId": null,
  "assignedAdminName": null,
  "createdAt": "2026-08-09T16:00:00+05:30",
  "updatedAt": "2026-08-09T16:00:00+05:30"
}
```


---


## 12.2 List my chats


```http
GET /api/v1/chats/my
```


---


## 12.3 Get chat thread and messages


```http
GET /api/v1/chats/{chatId}
```


### Example payload


```json
{
  "id": 7,
  "chatReference": "CHT-ABC123",
  "status": "BOT_ACTIVE",
  "messages": [
    {
      "id": 70,
      "senderType": "CUSTOMER",
      "senderUserId": 12,
      "message": "I need help with my booking.",
      "createdAt": "2026-08-09T16:00:00+05:30"
    }
  ]
}
```


---


## 12.4 Send chat message


```http
POST /api/v1/chats/{chatId}/messages
```


### Request


```json
{
  "message": "Can I arrive one hour early?"
}
```


---


## 12.5 Escalate chat to admin


```http
POST /api/v1/chats/{chatId}/escalate
```


### Request


```json
{
  "reason": "BOT_DID_NOT_UNDERSTAND",
  "lastBotConfidence": 0.32
}
```


---


## 12.6 Close chat


```http
POST /api/v1/chats/{chatId}/close
```


> Confirm final status/action mapping in `ChatController`.


---


# 13. Customer feedback APIs


## 13.1 Submit feedback


```http
POST /api/v1/feedback
```


**Authentication:** Customer and booking owner


The booking must be `COMPLETED`, and only one feedback record is allowed per booking.


### Request


```json
{
  "bookingId": 43,
  "rating": 5,
  "title": "Excellent stay",
  "comments": "The room was clean and staff were helpful."
}
```


### Important errors


```text
BOOKING_NOT_COMPLETED
FEEDBACK_ALREADY_SUBMITTED
```


---


## 13.2 List my feedback


```http
GET /api/v1/feedback/my
```


**Authentication:** Customer


---


# 14. Admin booking APIs


## 14.1 List all bookings


```http
GET /api/v1/admin/bookings
```


**Roles:** `STAFF`, `ADMIN`, `MANAGER`


## 14.2 Get booking details


```http
GET /api/v1/admin/bookings/{bookingId}
```


**Roles:** `STAFF`, `ADMIN`, `MANAGER`


## 14.3 Check in


```http
PATCH /api/v1/admin/bookings/{bookingId}/check-in
```


### Request


```json
{
  "notes": "Customer identity verified"
}
```


## 14.4 Check out


```http
PATCH /api/v1/admin/bookings/{bookingId}/check-out
```


### Request


```json
{
  "notes": "Checkout completed",
  "maintenanceRequired": false,
  "maintenanceDescription": null
}
```


## 14.5 Admin cancellation


```http
POST /api/v1/admin/bookings/{bookingId}/cancel
```


**Roles:** `ADMIN`, `MANAGER`


### Request


```json
{
  "reason": "Hotel operational issue",
  "processRefund": true
}
```


---


# 15. Admin cleaning APIs


```http
GET   /api/v1/admin/cleaning-tasks
PATCH /api/v1/admin/cleaning-tasks/{taskId}/assign
PATCH /api/v1/admin/cleaning-tasks/{taskId}/start
PATCH /api/v1/admin/cleaning-tasks/{taskId}/complete
```


### Assign request


```json
{
  "assignedToUserId": 2,
  "notes": "Assigned to housekeeping"
}
```


### Start request


```json
{
  "notes": "Cleaning started"
}
```


### Complete request


```json
{
  "notes": "Room cleaned and inspected",
  "maintenanceRequired": false,
  "maintenanceDescription": null
}
```


---


# 16. Admin maintenance APIs


```http
GET   /api/v1/admin/maintenance
POST  /api/v1/admin/maintenance
PATCH /api/v1/admin/maintenance/{maintenanceId}/assign
PATCH /api/v1/admin/maintenance/{maintenanceId}/start
PATCH /api/v1/admin/maintenance/{maintenanceId}/complete
```


### Create


```json
{
  "roomId": 3,
  "title": "Air conditioner not cooling",
  "description": "The air conditioner requires inspection",
  "priority": "HIGH"
}
```


### Assign


```json
{
  "assignedToUserId": 2,
  "notes": "Assigned to maintenance staff"
}
```


### Start


```json
{
  "notes": "Inspection started"
}
```


### Complete


```json
{
  "notes": "Air conditioner repaired and tested",
  "roomReady": true
}
```


Status lifecycle:


```text
PENDING -> ASSIGNED -> IN_PROGRESS -> COMPLETED
```


---


# 17. Admin room management APIs


```http
POST  /api/v1/admin/rooms
PUT   /api/v1/admin/rooms/{roomId}
PATCH /api/v1/admin/rooms/{roomId}/status
PATCH /api/v1/admin/rooms/{roomId}/active
```


**Roles:** `ADMIN`, `MANAGER`


### Create room


```json
{
  "roomNumber": "501",
  "roomTypeId": 1,
  "floorNumber": 5,
  "description": "Premium room on the fifth floor",
  "imageUrl": "https://example.com/room-501.jpg",
  "active": true
}
```


### Update room


```json
{
  "roomNumber": "501",
  "roomTypeId": 1,
  "floorNumber": 5,
  "description": "Updated room description",
  "imageUrl": "https://example.com/room-501-new.jpg",
  "version": 0
}
```


### Update room status


```json
{
  "status": "MAINTENANCE",
  "reason": "Room inspection required"
}
```


### Update active status


```json
{
  "active": false,
  "reason": "Temporarily removed from inventory"
}
```


---


# 18. Admin room-type management APIs


```http
POST /api/v1/admin/room-types
PUT  /api/v1/admin/room-types/{roomTypeId}
```


### Request


```json
{
  "name": "Premium",
  "code": "PREMIUM",
  "description": "Premium room with modern facilities",
  "basePrice": 7000.00,
  "minimumPrice": 5500.00,
  "maximumPrice": 9500.00,
  "maximumAdults": 3,
  "maximumChildren": 2,
  "bedType": "KING",
  "roomSizeSqft": 500,
  "active": true
}
```


---


# 19. Admin feedback APIs


```http
GET   /api/v1/admin/feedback
PATCH /api/v1/admin/feedback/{feedbackId}/visibility
```


**Roles:** `ADMIN`, `MANAGER`


### Visibility request


```json
{
  "visible": false,
  "reason": "Review contains personal information"
}
```


---


# 20. Hotel settings APIs


```http
GET /api/v1/admin/settings
PUT /api/v1/admin/settings
```


**Roles:** `ADMIN`, `MANAGER`


### Update request


```json
{
  "hotelName": "SmartStay Hotel",
  "currency": "INR",
  "timezone": "Asia/Kolkata",
  "checkInTime": "14:00:00",
  "checkOutTime": "11:00:00",
  "taxPercentage": 12.00,
  "serviceFeePercentage": 6.00,
  "maximumStayNights": 30,
  "paymentTimeoutMinutes": 20,
  "fullRefundCutoffHours": 48,
  "lateRefundPercentage": 25.00,
  "dynamicPricingEnabled": true
}
```


---


# 21. Admin dashboard API


```http
GET /api/v1/admin/dashboard/summary
```


**Roles:** `STAFF`, `ADMIN`, `MANAGER`


### Success payload


```json
{
  "businessDate": "2026-08-09",
  "totalRooms": 12,
  "activeRooms": 11,
  "inactiveRooms": 1,
  "availableRooms": 6,
  "reservedRooms": 1,
  "occupiedRooms": 2,
  "underCleaningRooms": 1,
  "maintenanceRooms": 1,
  "occupancyPercentage": 20.00,
  "todayCheckIns": 2,
  "todayCheckOuts": 1,
  "pendingServiceRequests": 3,
  "waitingAdminChats": 1,
  "pendingCleaningTasks": 2,
  "openMaintenanceRecords": 1,
  "pendingPaymentBookings": 2,
  "confirmedBookings": 4,
  "checkedInBookings": 2,
  "confirmedRevenue": 52750.00,
  "currency": "INR",
  "generatedAt": "2026-08-09T15:30:00+05:30"
}
```


---


# 22. Admin report APIs


All report endpoints require:


```text
fromDate=YYYY-MM-DD
toDate=YYYY-MM-DD
```


Maximum range: 366 days.


```http
GET /api/v1/admin/reports/revenue
GET /api/v1/admin/reports/bookings
GET /api/v1/admin/reports/occupancy
GET /api/v1/admin/reports/services
```


CSV variants:


```http
GET /api/v1/admin/reports/revenue/export
GET /api/v1/admin/reports/bookings/export
GET /api/v1/admin/reports/occupancy/export
GET /api/v1/admin/reports/services/export
```


Example:


```http
GET /api/v1/admin/reports/revenue?fromDate=2026-08-01&toDate=2026-08-31
```


CSV responses use:


```http
Content-Type: text/csv;charset=UTF-8
Content-Disposition: attachment; filename="smartstay-revenue-2026-08-01-to-2026-08-31.csv"
```


Financial reports are for `ADMIN` and `MANAGER`. Operational reports may also allow `STAFF`.


---


# 23. Admin user APIs


```http
GET   /api/v1/admin/users
GET   /api/v1/admin/users/{userId}
PATCH /api/v1/admin/users/{userId}/role
PATCH /api/v1/admin/users/{userId}/active
```


Viewing: `ADMIN`, `MANAGER`  
Role/active changes: `ADMIN` only


### Role request


```json
{
  "role": "STAFF",
  "reason": "Assigned to hotel operations"
}
```


### Active request


```json
{
  "active": false,
  "reason": "Account temporarily disabled"
}
```


Important protections:


```text
SELF_ROLE_CHANGE_NOT_ALLOWED
SELF_DEACTIVATION_NOT_ALLOWED
LAST_ACTIVE_ADMIN_REQUIRED
USER_ROLE_UNCHANGED
USER_ACTIVE_STATUS_UNCHANGED
```


---


# 24. Audit log APIs


```http
GET /api/v1/admin/audit-logs
GET /api/v1/admin/audit-logs/{auditLogId}
```


**Roles:** `ADMIN`, `MANAGER`


### Optional filters


```text
action
entityType
actorUserId
entityId
fromDate
toDate
limit (1-500, default 100)
```


Example:


```http
GET /api/v1/admin/audit-logs?action=USER_ROLE_CHANGED&fromDate=2026-08-01&toDate=2026-08-31&limit=50
```


---


# 25. Admin service-request APIs


The designed admin lifecycle includes list, assignment, status transitions, and completion. Confirm exact final method names in `AdminServiceRequestController`.


Typical mappings:


```http
GET   /api/v1/admin/service-requests
GET   /api/v1/admin/service-requests/{requestId}
PATCH /api/v1/admin/service-requests/{requestId}/assign
PATCH /api/v1/admin/service-requests/{requestId}/start
PATCH /api/v1/admin/service-requests/{requestId}/complete
PATCH /api/v1/admin/service-requests/{requestId}/cancel
```


---


# 26. Admin chat APIs


Confirm exact mappings in `AdminChatController`. The designed workflow includes:


```http
GET  /api/v1/admin/chats
GET  /api/v1/admin/chats/{chatId}
POST /api/v1/admin/chats/{chatId}/assign
POST /api/v1/admin/chats/{chatId}/messages
POST /api/v1/admin/chats/{chatId}/resolve
```


Typical statuses:


```text
BOT_ACTIVE
WAITING_FOR_ADMIN
ASSIGNED_TO_ADMIN
RESOLVED
CLOSED
```


---


# 27. State reference


## Booking statuses


```text
PENDING_PAYMENT
CONFIRMED
CHECKED_IN
COMPLETED
CANCELLED
```


## Room statuses


```text
AVAILABLE
RESERVED
OCCUPIED
UNDER_CLEANING
MAINTENANCE
```


## Payment statuses


```text
PENDING
SUCCESS
FAILED
PARTIALLY_REFUNDED
REFUNDED
```


## Maintenance statuses


```text
PENDING
ASSIGNED
IN_PROGRESS
COMPLETED
CANCELLED
```


## Priority values


```text
LOW
MEDIUM
HIGH
URGENT
```


---


# 28. Frontend integration recommendations


## 28.1 Angular environment


```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/v1'
};
```


## 28.2 Authorization interceptor


Attach the bearer token to authenticated API calls:


```http
Authorization: Bearer <token>
```


Do not send the token to unrelated third-party origins.


## 28.3 Error handling


Frontend error views should use:


```text
error.error.code
error.error.message
error.error.fieldErrors
```


Map `fieldErrors` keys to matching reactive-form controls.


## 28.4 Payment flow


```text
Create booking
-> initiate payment
-> retain paymentId and dummyPaymentToken
-> generate idempotency key
-> confirm payment
-> retrieve booking
```


## 28.5 Date handling


Send date-only values as `YYYY-MM-DD`. Do not convert date-only booking fields to UTC timestamps.


## 28.6 Currency


Display the currency returned by the backend. Changing the currency setting changes the label; it does not perform foreign-exchange conversion.


## 28.7 Role separation


The customer frontend should accept only `CUSTOMER` users. Admin/staff/manager portals should be separate route trees or applications.


---


# 29. Final controller verification checklist


Before handing this contract to the frontend team, compare it against these controller classes:


```text
AuthController
UserProfileController
RoomTypeController
RoomController
BookingController
PaymentController
PasscodeController / RoomAccessController
ServiceRequestController
NotificationController
ChatController
FeedbackController
AdminBookingController
AdminCleaningTaskController
AdminMaintenanceController
AdminRoomController
AdminRoomTypeController
AdminFeedbackController
AdminHotelSettingsController
AdminDashboardController
AdminReportController
AdminUserController
AdminAuditLogController
AdminServiceRequestController
AdminChatController
```


For each controller, verify:


1. Class-level `@RequestMapping`.
2. Method annotation and HTTP verb.
3. Path variables.
4. Query parameters.
5. Request DTO field names.
6. Response DTO field names.
7. Spring Security roles.
8. Actual status code.


---


# 30. Suggested frontend priority


For the customer Angular application, implement in this order:


```text
1. Register/login
2. Rooms and availability
3. Room details and feedback
4. Quote
5. Booking creation
6. Payment initiation and confirmation
7. My bookings and cancellation
8. Passcode
9. Notifications
10. Service requests
11. Chat
12. Profile and password
13. Feedback
```