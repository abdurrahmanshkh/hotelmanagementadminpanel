-- ============================================================
-- SmartStay Hotel Management System
-- Default / Development Seed Data
-- Database: H2
-- ============================================================


-- ============================================================
-- 1. DEFAULT HOTEL SETTINGS
-- ============================================================

MERGE INTO hotel_settings (
    id,
    hotel_name,
    address,
    phone,
    email,
    check_in_time,
    check_out_time,
    max_stay_days,
    pending_payment_timeout_minutes,
    cancellation_cutoff_hours,
    currency,
    tax_percentage,
    service_fee_percentage,
    is_dynamic_pricing_enabled,
    updated_at
)
KEY(id)
VALUES (
    1,
    'SmartStay Luxury Hotel & Suites',
    '123 Beach Resort Boulevard, Goa, India',
    '+91 98765 43210',
    'support@smartstay.com',
    '14:00',
    '11:00',
    30,
    15,
    24,
    'INR',
    12.0,
    5.0,
    true,
    CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. TEST CUSTOMER ACCOUNTS
-- Password: Guest@123
-- ============================================================

MERGE INTO users (
    id,
    public_id,
    first_name,
    last_name,
    email,
    phone,
    password_hash,
    role,
    date_of_birth,
    government_id_type,
    government_id_last_four,
    active,
    failed_login_attempts,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    1,
    'USR-1001',
    'Guest',
    'User',
    'guest@example.com',
    '9876543210',
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    'CUSTOMER',
    '1990-01-01',
    'AADHAAR',
    '1234',
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO users (
    id,
    public_id,
    first_name,
    last_name,
    email,
    phone,
    password_hash,
    role,
    date_of_birth,
    government_id_type,
    government_id_last_four,
    active,
    failed_login_attempts,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    2,
    'USR-1002',
    'Emily',
    'Watson',
    'emily@example.com',
    '9876543211',
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    'CUSTOMER',
    '1992-05-12',
    'PASSPORT',
    '5678',
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


-- ============================================================
-- 3. TEST STAFF & ADMIN ACCOUNTS
-- Passwords:
-- Admin   -> Admin@123
-- Manager -> Manager@123
-- Staff   -> Staff@123
-- ============================================================

MERGE INTO users (
    id,
    public_id,
    first_name,
    last_name,
    email,
    phone,
    password_hash,
    role,
    staff_code_hash,
    active,
    failed_login_attempts,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    3,
    'ADM-2001',
    'System',
    'Admin',
    'admin@example.com',
    '9998887770',
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    'ADMIN',
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO users (
    id,
    public_id,
    first_name,
    last_name,
    email,
    phone,
    password_hash,
    role,
    staff_code_hash,
    active,
    failed_login_attempts,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    4,
    'MGR-2002',
    'General',
    'Manager',
    'manager@example.com',
    '9998887771',
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    'MANAGER',
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO users (
    id,
    public_id,
    first_name,
    last_name,
    email,
    phone,
    password_hash,
    role,
    staff_code_hash,
    active,
    failed_login_attempts,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    5,
    'STF-2003',
    'Hotel',
    'Staff',
    'staff@example.com',
    '9998887772',
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    'STAFF',
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. AMENITIES
-- ============================================================

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    1,
    'Wi-Fi',
    'wifi',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    2,
    'Air Conditioning',
    'snowflake',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    3,
    'Smart TV',
    'tv',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    4,
    'Mini Bar',
    'wine-glass',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    5,
    'Ocean View',
    'eye',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    6,
    'King Bed',
    'bed',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    7,
    'Jacuzzi',
    'bath',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    8,
    'Balcony',
    'sun',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    9,
    'Coffee Maker',
    'coffee',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    10,
    'Work Desk',
    'briefcase',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    11,
    'Safe',
    'lock',
    true
);

MERGE INTO amenities (
    id,
    name,
    icon_name,
    active
)
KEY(id)
VALUES (
    12,
    'Swimming Pool Access',
    'water',
    true
);


-- ============================================================
-- 5. ROOM TYPES
-- ============================================================

MERGE INTO room_types (
    id,
    name,
    code,
    description,
    base_price,
    minimum_price,
    maximum_price,
    maximum_adults,
    maximum_children,
    bed_type,
    room_size_sqft,
    active,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    1,
    'Standard Room',
    'STD',
    'Comfortable guest room with essential modern amenities',
    3500.00,
    2500.00,
    5000.00,
    2,
    1,
    'Queen Bed',
    300,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO room_types (
    id,
    name,
    code,
    description,
    base_price,
    minimum_price,
    maximum_price,
    maximum_adults,
    maximum_children,
    bed_type,
    room_size_sqft,
    active,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    2,
    'Deluxe Ocean Room',
    'DELUXE',
    'Spacious room with scenic ocean balcony view and premium furnishings',
    5500.00,
    4000.00,
    8000.00,
    2,
    1,
    'King Bed',
    450,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO room_types (
    id,
    name,
    code,
    description,
    base_price,
    minimum_price,
    maximum_price,
    maximum_adults,
    maximum_children,
    bed_type,
    room_size_sqft,
    active,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    3,
    'Executive Suite',
    'EXEC',
    'Luxury suite featuring separate living workspace and Jacuzzi tub',
    8500.00,
    6000.00,
    12000.00,
    3,
    2,
    'King Bed',
    650,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO room_types (
    id,
    name,
    code,
    description,
    base_price,
    minimum_price,
    maximum_price,
    maximum_adults,
    maximum_children,
    bed_type,
    room_size_sqft,
    active,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    4,
    'Presidential Suite',
    'PRES',
    'Ultra luxury suite with private terrace and dedicated butler service',
    15000.00,
    10000.00,
    25000.00,
    4,
    2,
    'King Bed',
    1200,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


-- ============================================================
-- 6. ROOM TYPE -> AMENITIES MAPPING
-- ============================================================

-- Standard Room
MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (1, 1);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (1, 2);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (1, 3);


-- Deluxe Ocean Room
MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (2, 1);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (2, 2);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (2, 3);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (2, 5);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (2, 6);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (2, 8);


-- Executive Suite
MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (3, 1);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (3, 2);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (3, 3);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (3, 4);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (3, 5);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (3, 6);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (3, 7);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (3, 9);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (3, 10);


-- Presidential Suite
MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 1);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 2);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 3);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 4);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 5);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 6);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 7);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 8);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 9);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 10);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 11);

MERGE INTO room_type_amenities (
    room_type_id,
    amenity_id
)
KEY(room_type_id, amenity_id)
VALUES (4, 12);


-- ============================================================
-- 7. ROOMS
-- ============================================================

MERGE INTO rooms (
    id,
    public_id,
    room_number,
    room_type_id,
    floor_number,
    status,
    description,
    image_url,
    rating,
    featured,
    active,
    version,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    1,
    'RM-101',
    '101',
    1,
    1,
    'AVAILABLE',
    'Cozy Standard room on 1st floor',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
    4.5,
    true,
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO rooms (
    id,
    public_id,
    room_number,
    room_type_id,
    floor_number,
    status,
    description,
    image_url,
    rating,
    featured,
    active,
    version,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    2,
    'RM-102',
    '102',
    1,
    1,
    'AVAILABLE',
    'Standard room with garden view',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427',
    4.6,
    false,
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO rooms (
    id,
    public_id,
    room_number,
    room_type_id,
    floor_number,
    status,
    description,
    image_url,
    rating,
    featured,
    active,
    version,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    3,
    'RM-201',
    '201',
    2,
    2,
    'AVAILABLE',
    'Deluxe room facing the ocean beach',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    4.8,
    true,
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO rooms (
    id,
    public_id,
    room_number,
    room_type_id,
    floor_number,
    status,
    description,
    image_url,
    rating,
    featured,
    active,
    version,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    4,
    'RM-202',
    '202',
    2,
    2,
    'RESERVED',
    'Deluxe room with balcony',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
    4.7,
    false,
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO rooms (
    id,
    public_id,
    room_number,
    room_type_id,
    floor_number,
    status,
    description,
    image_url,
    rating,
    featured,
    active,
    version,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    5,
    'RM-301',
    '301',
    3,
    3,
    'OCCUPIED',
    'Executive suite on 3rd floor',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
    4.9,
    true,
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO rooms (
    id,
    public_id,
    room_number,
    room_type_id,
    floor_number,
    status,
    description,
    image_url,
    rating,
    featured,
    active,
    version,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    6,
    'RM-302',
    '302',
    3,
    3,
    'UNDER_CLEANING',
    'Executive suite undergoing housekeeping',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
    4.8,
    false,
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO rooms (
    id,
    public_id,
    room_number,
    room_type_id,
    floor_number,
    status,
    description,
    image_url,
    rating,
    featured,
    active,
    version,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    7,
    'RM-401',
    '401',
    4,
    4,
    'AVAILABLE',
    'Presidential suite with panoramic view',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843',
    5.0,
    true,
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


-- ============================================================
-- 8. SAMPLE BOOKINGS
-- ============================================================

MERGE INTO bookings (
    id,
    booking_reference,
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    guest_count,
    adults,
    children,
    status,
    base_price_per_night,
    applied_price_per_night,
    number_of_nights,
    room_amount,
    tax_amount,
    service_fee,
    discount_amount,
    total_amount,
    currency,
    special_requests,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    1,
    'BK-2026-1001',
    1,
    1,
    '2026-08-15',
    '2026-08-17',
    2,
    2,
    0,
    'CONFIRMED',
    3500.00,
    3500.00,
    2,
    7000.00,
    840.00,
    350.00,
    0.00,
    8190.00,
    'INR',
    'High floor requested',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO bookings (
    id,
    booking_reference,
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    guest_count,
    adults,
    children,
    status,
    base_price_per_night,
    applied_price_per_night,
    number_of_nights,
    room_amount,
    tax_amount,
    service_fee,
    discount_amount,
    total_amount,
    currency,
    special_requests,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    2,
    'BK-2026-1002',
    2,
    3,
    '2026-08-16',
    '2026-08-18',
    2,
    2,
    0,
    'CHECKED_IN',
    5500.00,
    5500.00,
    2,
    11000.00,
    1320.00,
    550.00,
    0.00,
    12870.00,
    'INR',
    'Honeymoon arrangement',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


-- ============================================================
-- 9. SAMPLE PAYMENTS
-- ============================================================
-- IMPORTANT:
-- The original file specified 13 columns but supplied only
-- 12 values per payment. The missing value was updated_at.
-- Each payment is now a separate MERGE statement.
-- ============================================================

MERGE INTO payments (
    id,
    payment_reference,
    booking_id,
    user_id,
    method,
    amount,
    refunded_amount,
    status,
    gateway_name,
    gateway_transaction_reference,
    paid_at,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    1,
    'PAY-882910',
    1,
    1,
    'CARD',
    8190.00,
    0.00,
    'SUCCESS',
    'SmartStay Payment Gateway',
    'TXN_992019283',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO payments (
    id,
    payment_reference,
    booking_id,
    user_id,
    method,
    amount,
    refunded_amount,
    status,
    gateway_name,
    gateway_transaction_reference,
    paid_at,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    2,
    'PAY-882911',
    2,
    2,
    'UPI',
    12870.00,
    0.00,
    'SUCCESS',
    'SmartStay Payment Gateway',
    'TXN_992019284',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


-- ============================================================
-- 10. SAMPLE ROOM PASSCODES
-- ============================================================

MERGE INTO room_passcodes (
    id,
    booking_id,
    passcode_hash,
    passcode_last_two,
    valid_from,
    valid_until,
    status,
    failed_attempts,
    generated_at,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    1,
    1,
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    '13',
    '2026-08-15 14:00:00',
    '2026-08-17 11:00:00',
    'NOT_ACTIVE_YET',
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

MERGE INTO room_passcodes (
    id,
    booking_id,
    passcode_hash,
    passcode_last_two,
    valid_from,
    valid_until,
    status,
    failed_attempts,
    generated_at,
    created_at,
    updated_at
)
KEY(id)
VALUES (
    2,
    2,
    '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe11.7.g3.r1A0K5sZ0aO9.g5K.7e1e.C',
    '88',
    '2026-08-16 14:00:00',
    '2026-08-18 11:00:00',
    'ACTIVE',
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
