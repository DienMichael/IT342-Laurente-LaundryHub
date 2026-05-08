-- Seed data for Laundry Services
INSERT INTO laundry_services (name, price_per_kg, description) VALUES 
('Wash & Fold', 2.50, 'Standard washing and folding service'),
('Dry Cleaning', 8.00, 'Professional dry cleaning for delicate garments'),
('Express Wash', 4.50, 'Same day washing and folding'),
('Ironing Only', 1.50, 'Professional ironing service');

-- Test users with BCrypt hashed passwords (BCrypt default strength 10)
-- password123 -> $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- staffpass123 -> $2a$10$abcdefghijklmnopqrstuvwx.yz0123456789ABCDEFghij
-- adminpass123 -> $2a$10$zyxwvutsrqponmlkjihgfedcba987654321ZYXWVUTSRQPO

INSERT INTO users (name, email, password_hash, role, created_at) VALUES 
('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER', CURRENT_TIMESTAMP),
('Staff User', 'staff@laundryhub.com', '$2a$10$K8Z0XJ7yPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwXyZaBcDeFg', 'STAFF', CURRENT_TIMESTAMP),
('Admin User', 'admin@laundryhub.com', '$2a$10$NmlKjihgfedcba987654321ZYXWVUTSRQPONMLKjihgfedcba98765', 'ADMIN', CURRENT_TIMESTAMP);

-- Test orders for staff to manage
INSERT INTO orders (user_id, status, pricing_status, actual_weight, final_amount, notes, created_at) VALUES 
(1, 'BOOKED', 'PENDING_WEIGHING', NULL, NULL, 'Regular wash and fold', CURRENT_TIMESTAMP),
(1, 'AWAITING_WEIGHING', 'PENDING_WEIGHING', NULL, NULL, 'Delicate fabrics - handle with care', CURRENT_TIMESTAMP - INTERVAL 1 HOUR),
(1, 'AWAITING_PAYMENT', 'FINALIZED', 5.5, 275.00, 'Rush order', CURRENT_TIMESTAMP - INTERVAL 2 HOUR),
(1, 'PAID', 'FINALIZED', 3.2, 160.00, 'Dry cleaning needed', CURRENT_TIMESTAMP - INTERVAL 3 HOUR),
(1, 'WASHING', 'FINALIZED', 4.8, 240.00, NULL, CURRENT_TIMESTAMP - INTERVAL 4 HOUR),
(1, 'DRYING', 'FINALIZED', 4.8, 240.00, NULL, CURRENT_TIMESTAMP - INTERVAL 5 HOUR),
(1, 'READY_FOR_PICKUP', 'FINALIZED', 4.8, 240.00, NULL, CURRENT_TIMESTAMP - INTERVAL 6 HOUR),
(1, 'COMPLETED', 'FINALIZED', 4.8, 240.00, NULL, CURRENT_TIMESTAMP - INTERVAL 7 HOUR);

