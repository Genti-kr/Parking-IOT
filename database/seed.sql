-- =========================================================
-- Smart Parking Management System
-- Seed Data
-- =========================================================

-- Roles
INSERT INTO Roles (Name, Description)
SELECT 'Admin', 'Administrator i sistemit'
WHERE NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Admin');

INSERT INTO Roles (Name, Description)
SELECT 'Operator', 'Operator i parkimit'
WHERE NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Operator');

INSERT INTO Roles (Name, Description)
SELECT 'Resident', 'Perdorues banor'
WHERE NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Resident');

INSERT INTO Roles (Name, Description)
SELECT 'Guest', 'Perdorues mysafir'
WHERE NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Guest');
GO

-- Zones
INSERT INTO Zones (Name, Location, Capacity, HourlyRate)
SELECT 'Zone A', 'Hyrja kryesore', 10, 1.00
WHERE NOT EXISTS (SELECT 1 FROM Zones WHERE Name = 'Zone A');

INSERT INTO Zones (Name, Location, Capacity, HourlyRate)
SELECT 'Zone B', 'Pjesa qendrore', 10, 1.00
WHERE NOT EXISTS (SELECT 1 FROM Zones WHERE Name = 'Zone B');

INSERT INTO Zones (Name, Location, Capacity, HourlyRate)
SELECT 'Zone C', 'Dalja dhe pjesa e pasme', 10, 1.00
WHERE NOT EXISTS (SELECT 1 FROM Zones WHERE Name = 'Zone C');
GO

-- ParkingSlots per Zone A
DECLARE @i INT = 1;
WHILE @i <= 10
BEGIN
    IF NOT EXISTS (SELECT 1 FROM ParkingSlots WHERE ZoneId = 1 AND SlotNumber = CONCAT('A', @i))
    BEGIN
        INSERT INTO ParkingSlots (ZoneId, SlotNumber, Status)
        VALUES (1, CONCAT('A', @i), 'Free');
    END
    SET @i = @i + 1;
END
GO

-- ParkingSlots per Zone B
DECLARE @j INT = 1;
WHILE @j <= 10
BEGIN
    IF NOT EXISTS (SELECT 1 FROM ParkingSlots WHERE ZoneId = 2 AND SlotNumber = CONCAT('B', @j))
    BEGIN
        INSERT INTO ParkingSlots (ZoneId, SlotNumber, Status)
        VALUES (2, CONCAT('B', @j), 'Free');
    END
    SET @j = @j + 1;
END
GO

-- ParkingSlots per Zone C
DECLARE @k INT = 1;
WHILE @k <= 10
BEGIN
    IF NOT EXISTS (SELECT 1 FROM ParkingSlots WHERE ZoneId = 3 AND SlotNumber = CONCAT('C', @k))
    BEGIN
        INSERT INTO ParkingSlots (ZoneId, SlotNumber, Status)
        VALUES (3, CONCAT('C', @k), 'Free');
    END
    SET @k = @k + 1;
END
GO

-- Tariffs
INSERT INTO Tariffs (ZoneId, UserType, HourlyRate, DailyCap) VALUES
(1, 'Resident', 0.50,  5.00),
(1, 'Guest',    1.00, 10.00),
(1, 'VIP',      0.00,  0.00);
GO
