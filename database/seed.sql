-- =========================================================
-- Smart Parking Management System
-- Seed Data
-- =========================================================

-- Roles
INSERT INTO Roles (Name, Description) VALUES
('Admin',    'Administrator i sistemit'),
('Operator', 'Operator i parkimit'),
('Resident', 'Perdorues banor'),
('Guest',    'Perdorues mysafir');
GO

-- Zones
INSERT INTO Zones (Name, Location, Capacity, HourlyRate) VALUES
('Zone Qendrore',   'Qendra e qytetit', 50, 1.00),
('Zone Periferike', 'Periferia',        30, 0.50);
GO

-- ParkingSlots per Zonen 1
DECLARE @i INT = 1;
WHILE @i <= 10
BEGIN
    INSERT INTO ParkingSlots (ZoneId, SlotNumber, Status)
    VALUES (1, CONCAT('A', @i), 'Free');
    SET @i = @i + 1;
END
GO

-- Tariffs
INSERT INTO Tariffs (ZoneId, UserType, HourlyRate, DailyCap) VALUES
(1, 'Resident', 0.50,  5.00),
(1, 'Guest',    1.00, 10.00),
(1, 'VIP',      0.00,  0.00);
GO
