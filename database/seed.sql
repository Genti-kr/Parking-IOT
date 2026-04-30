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
('Zone Periferike', 'Periferia',        30, 0.50),
('Zone Lindore',    'Lindja e qytetit', 30, 0.70);
GO

-- ParkingSlots per Zonen 1 (A1-A10)
DECLARE @i INT = 1;
WHILE @i <= 10
BEGIN
    INSERT INTO ParkingSlots (ZoneId, SlotNumber, Status)
    VALUES (1, CONCAT('A', @i), 'Free');
    SET @i = @i + 1;
END
GO

-- ParkingSlots per Zonen 2 (B1-B10)
DECLARE @j INT = 1;
WHILE @j <= 10
BEGIN
    INSERT INTO ParkingSlots (ZoneId, SlotNumber, Status)
    VALUES (2, CONCAT('B', @j), 'Free');
    SET @j = @j + 1;
END
GO

-- ParkingSlots per Zonen 3 (C1-C10)
DECLARE @k INT = 1;
WHILE @k <= 10
BEGIN
    INSERT INTO ParkingSlots (ZoneId, SlotNumber, Status)
    VALUES (3, CONCAT('C', @k), 'Free');
    SET @k = @k + 1;
END
GO

-- Disa vende te zena per demo ne secilen zone (do duken me te kuqe ne frontend)
UPDATE ParkingSlots
SET Status = 'Occupied'
WHERE (ZoneId = 1 AND SlotNumber IN ('A1', 'A2', 'A4'))
   OR (ZoneId = 2 AND SlotNumber IN ('B3', 'B6', 'B8'))
   OR (ZoneId = 3 AND SlotNumber IN ('C2', 'C5', 'C9'));

UPDATE ParkingSlots
SET Status = 'Reserved'
WHERE (ZoneId = 1 AND SlotNumber IN ('A6'))
   OR (ZoneId = 2 AND SlotNumber IN ('B5'))
   OR (ZoneId = 3 AND SlotNumber IN ('C7'));
GO

-- Tariffs
INSERT INTO Tariffs (ZoneId, UserType, HourlyRate, DailyCap) VALUES
(1, 'Resident', 0.50,  5.00),
(1, 'Guest',    1.00, 10.00),
(1, 'VIP',      0.00,  0.00);
GO
