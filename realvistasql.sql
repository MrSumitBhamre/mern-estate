DROP DATABASE IF EXISTS realvista;
CREATE DATABASE realvista;
USE realvista;

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO roles (id, name, description) VALUES
(1, 'ADMIN', 'Platform administrator with full system access'),
(2, 'AGENT', 'Property owner / listing manager'),
(3, 'USER', 'End customer who books properties');


CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    status ENUM('ACTIVE','SUSPENDED','BANNED') DEFAULT 'ACTIVE',
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_users_role_id ON users(role_id);

INSERT INTO users 
(id, role_id, first_name, last_name, email, password, phone, is_verified, status)
VALUES
(1, 1, 'Harry', 'Potter', 'admin@realvista.com', '$2b$10$adminhashedpassword', '9876543210', TRUE, 'ACTIVE'),
(2, 2, 'Ron', 'Wesley', 'ron.agent@realvista.com', '$2b$10$agenthashedpassword', '9811122233', TRUE, 'ACTIVE'),
(3, 2, 'Hermoine', 'Ganger', 'hermoine.agent@realvista.com', '$2b$10$agenthashedpassword', '9822233344', TRUE, 'ACTIVE'),
(4, 3, 'Darco', 'Malfoy', 'darco.user@gmail.com', '$2b$10$userhashedpassword', '9833344455', TRUE, 'ACTIVE'),
(5, 3, 'Luna', 'Lovegood', 'luna.user@gmail.com', '$2b$10$userhashedpassword', '9844455566', TRUE, 'ACTIVE');


CREATE TABLE properties (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price_per_night DECIMAL(12,2) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_properties_owner FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_properties_city_status ON properties(city, status);
CREATE INDEX idx_properties_owner_id ON properties(owner_id);


INSERT INTO properties
(id, owner_id, title, slug, description, price_per_night,
 address, city, state, country, zip_code,
 latitude, longitude, status, is_available)
VALUES

(1, 2, 
'Luxury Sea View Apartment',
'luxury-sea-view-apartment-mumbai',
'Premium 2BHK apartment with Arabian Sea view and modern amenities.',
7500.00,
'Juhu Tara Road', 'Mumbai', 'Maharashtra', 'India', '400049',
19.1075, 72.8263,
'APPROVED', TRUE),

(2, 2,
'Modern Business Studio',
'modern-business-studio-pune',
'Compact and fully furnished studio perfect for business travelers.',
4200.00,
'Baner Road', 'Pune', 'Maharashtra', 'India', '411045',
18.5590, 73.7868,
'APPROVED', TRUE),

(3, 3,
'Hilltop Villa with Private Pool',
'hilltop-villa-lonavala',
'Spacious 4BHK villa with private pool and mountain view.',
15000.00,
'Tiger Point Road', 'Lonavala', 'Maharashtra', 'India', '410401',
18.7546, 73.4062,
'APPROVED', TRUE);


CREATE TABLE property_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_property_images_property FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO property_images
(id, property_id, image_url, public_id, is_primary)
VALUES
(1, 1, 'https://cdn.realvista.com/mumbai1.jpg', 'mumbai1', TRUE),
(2, 1, 'https://cdn.realvista.com/mumbai2.jpg', 'mumbai2', FALSE),

(3, 2, 'https://cdn.realvista.com/pune1.jpg', 'pune1', TRUE),

(4, 3, 'https://cdn.realvista.com/lonavala1.jpg', 'lonavala1', TRUE),
(5, 3, 'https://cdn.realvista.com/lonavala2.jpg', 'lonavala2', FALSE);



CREATE TABLE property_features (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO property_features (id, name) VALUES
(1, 'WiFi'),
(2, 'Parking'),
(3, 'Swimming Pool'),
(4, 'Air Conditioning'),
(5, 'Fully Equipped Kitchen'),
(6, 'Balcony'),
(7, 'Gym Access'),
(8, 'Security Surveillance');


CREATE TABLE property_feature_map (
    property_id BIGINT UNSIGNED NOT NULL,
    feature_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (property_id, feature_id),
    CONSTRAINT fk_pf_property FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pf_feature FOREIGN KEY (feature_id)
        REFERENCES property_features(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO property_feature_map (property_id, feature_id) VALUES
-- Mumbai Apartment
(1,1),(1,2),(1,4),(1,6),(1,8),

-- Pune Studio
(2,1),(2,4),(2,5),

-- Lonavala Villa
(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,8);

CREATE TABLE bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    property_id BIGINT UNSIGNED NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_property FOREIGN KEY (property_id)
        REFERENCES properties(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_bookings_property_status ON bookings(property_id, status);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);

INSERT INTO bookings
(id, user_id, property_id, start_date, end_date, total_amount, status)
VALUES
(1, 4, 1, '2026-04-10', '2026-04-12', 15000.00, 'CONFIRMED'),
(2, 5, 3, '2026-05-01', '2026-05-03', 30000.00, 'PENDING');








CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,
    payment_provider ENUM('STRIPE','RAZORPAY') NOT NULL,
    provider_payment_id VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status ENUM('INITIATED','SUCCESS','FAILED') DEFAULT 'INITIATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO payments
(id, booking_id, payment_provider, provider_payment_id, amount, currency, status)
VALUES
(1, 1, 'RAZORPAY', 'pay_RZP_12345', 15000.00, 'INR', 'SUCCESS'),
(2, 2, 'STRIPE', 'pi_STRIPE_67890', 30000.00, 'INR', 'INITIATED');

CREATE TABLE transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT UNSIGNED NOT NULL,
    transaction_ref VARCHAR(255) NOT NULL UNIQUE,
    gateway_response JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_payment FOREIGN KEY (payment_id)
        REFERENCES payments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO transactions
(id, payment_id, transaction_ref, gateway_response)
VALUES
(1, 1, 'TXN-RZP-2026-0001',
JSON_OBJECT(
    'status','captured',
    'method','upi',
    'bank','HDFC'
));

CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    property_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_reviews_property FOREIGN KEY (property_id)
        REFERENCES properties(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_review (user_id, property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO reviews
(id, user_id, property_id, rating, comment)
VALUES
(1, 4, 1, 5, 'Amazing stay! Sea view was breathtaking.'),
(2, 4, 2, 4, 'Clean and well maintained studio.');

CREATE TABLE favorites (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    property_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY unique_favorite (user_id, property_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_property FOREIGN KEY (property_id)
        REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO favorites
(id, user_id, property_id)
VALUES
(1, 4, 3),
(2, 5, 1);


CREATE TABLE audit_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT UNSIGNED NOT NULL,
    metadata JSON NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO audit_log
(user_id, action, entity_type, entity_id, metadata, ip_address)
VALUES
(1, 'PROPERTY_APPROVED', 'PROPERTY', 1,
 JSON_OBJECT('approved_by','Arjun Mehta'),
 '122.160.45.12'),

(4, 'BOOKING_CREATED', 'BOOKING', 1,
 JSON_OBJECT('property','Luxury Sea View Apartment'),
 '49.36.12.98');
 
 
 CREATE TABLE refresh_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_refresh_user (user_id),
    INDEX idx_refresh_token (token(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE password_resets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    reset_token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reset_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_reset_token (reset_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


USE realvista;

-- 1. Roles
SELECT * FROM roles;

-- 2. Users
SELECT * FROM users;

-- 3. Properties
SELECT * FROM properties;

-- 4. Property Images
SELECT * FROM property_images;

-- 5. Property Features
SELECT * FROM property_features;

-- 6. Property Feature Map
SELECT * FROM property_feature_map;

-- 7. Bookings
SELECT * FROM bookings;

-- 8. Payments
SELECT * FROM payments;

-- 9. Transactions
SELECT * FROM transactions;

-- 10. Reviews
SELECT * FROM reviews;

-- 11. Favorites
SELECT * FROM favorites;

-- 12. Audit Log
SELECT * FROM audit_log;

-- 13. Refresh Tokens
SELECT * FROM refresh_tokens;

-- 14. Password Resets
SELECT  *  FROM password_resetsUSE realvista;

-- 1. Users with Roles
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    r.name AS role
FROM users u
JOIN roles r ON u.role_id = r.id;


-- 2. Properties with Owner
SELECT 
    p.id,
    p.title,
    p.city,
    p.price_per_night,
    CONCAT(u.first_name,' ',u.last_name) AS owner_name
FROM properties p
JOIN users u ON p.owner_id = u.id;


-- 3. Property Images with Property
SELECT 
    pi.id,
    p.title,
    pi.image_url,
    pi.is_primary
FROM property_images pi
JOIN properties p ON pi.property_id = p.id;


-- 4. Property Features
SELECT 
    p.title,
    f.name AS feature
FROM property_feature_map pf
JOIN properties p ON pf.property_id = p.id
JOIN property_features f ON pf.feature_id = f.id;


-- 5. Booking Details
SELECT 
    b.id,
    b.start_date,
    b.end_date,
    b.total_amount,
    u.first_name,
    p.title
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN properties p ON b.property_id = p.id;


-- 6. Payment Details
SELECT 
    pay.id,
    pay.amount,
    pay.status,
    b.id AS booking_id,
    p.title
FROM payments pay
JOIN bookings b ON pay.booking_id = b.id
JOIN properties p ON b.property_id = p.id;


-- 7. Reviews with Property and User
SELECT 
    r.rating,
    r.comment,
    u.first_name AS reviewer,
    p.title AS property
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN properties p ON r.property_id = p.id;


-- 8. Favorites
SELECT 
    u.first_name,
    p.title
FROM favorites f
JOIN users u ON f.user_id = u.id
JOIN properties p ON f.property_id = p.id;;


