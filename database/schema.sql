-- =========================================================
-- Smart Parking Management System
-- Database Schema (SQL Server)
-- =========================================================
-- IMPLEMENTATION STEPS
-- STEP 1: Core structure (roles, users, vehicles, zones, slots)
-- STEP 2: Parking operations (sessions, reservations, payments, tariffs)
-- STEP 3: IoT integration (sensors, device logs, ANPR logs)
-- STEP 4: Administration and seed data
-- =========================================================

-- CREATE DATABASE parkingIOT;
-- GO
-- USE parkingIOT;
-- GO

-- =========================================================
-- STEP 1 - Core structure
-- =========================================================
-- 1.1 Roles
-- =========================================================
-- Roles
-- =========================================================
CREATE TABLE Roles (
    RoleId       INT IDENTITY(1,1) PRIMARY KEY,
    Name         NVARCHAR(50) NOT NULL UNIQUE,
    Description  NVARCHAR(255) NULL
);
GO

-- =========================================================
-- 1.2 Users
-- =========================================================
-- Users
-- =========================================================
CREATE TABLE Users (
    UserId        INT IDENTITY(1,1) PRIMARY KEY,
    FullName      NVARCHAR(150) NOT NULL,
    Email         NVARCHAR(150) NOT NULL UNIQUE,
    PhoneNumber   NVARCHAR(20) NULL,
    PasswordHash  NVARCHAR(255) NOT NULL,
    RoleId        INT NOT NULL,
    IsActive      BIT NOT NULL DEFAULT 1,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt     DATETIME2 NULL,
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);
GO

-- =========================================================
-- 1.3 Vehicles
-- =========================================================
-- Vehicles
-- =========================================================
CREATE TABLE Vehicles (
    VehicleId     INT IDENTITY(1,1) PRIMARY KEY,
    UserId        INT NOT NULL,
    PlateNumber   NVARCHAR(20) NOT NULL UNIQUE,
    Brand         NVARCHAR(50) NULL,
    Model         NVARCHAR(50) NULL,
    Color         NVARCHAR(30) NULL,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Vehicles_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- =========================================================
-- 1.4 Zones
-- =========================================================
-- Zones
-- =========================================================
CREATE TABLE Zones (
    ZoneId        INT IDENTITY(1,1) PRIMARY KEY,
    Name          NVARCHAR(100) NOT NULL,
    Location      NVARCHAR(255) NULL,
    Capacity      INT NOT NULL DEFAULT 0,
    HourlyRate    DECIMAL(10,2) NOT NULL DEFAULT 0,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- =========================================================
-- 1.5 ParkingSlots
-- =========================================================
-- ParkingSlots
-- =========================================================
CREATE TABLE ParkingSlots (
    SlotId        INT IDENTITY(1,1) PRIMARY KEY,
    ZoneId        INT NOT NULL,
    SlotNumber    NVARCHAR(20) NOT NULL,
    Status        NVARCHAR(20) NOT NULL DEFAULT 'Free',
    LastUpdate    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    IsActive      BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Slots_Zones FOREIGN KEY (ZoneId) REFERENCES Zones(ZoneId),
    CONSTRAINT UQ_Slot_Zone UNIQUE (ZoneId, SlotNumber),
    CONSTRAINT CK_Slot_Status CHECK (Status IN ('Free','Occupied','Reserved','OutOfService'))
);
GO

-- =========================================================
-- STEP 2 - Parking operations
-- =========================================================
-- 2.1 ParkingSessions
-- =========================================================
-- ParkingSessions
-- =========================================================
CREATE TABLE ParkingSessions (
    SessionId     INT IDENTITY(1,1) PRIMARY KEY,
    SlotId        INT NOT NULL,
    VehicleId     INT NULL,
    UserId        INT NULL,
    EntryTime     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ExitTime      DATETIME2 NULL,
    DurationMin   AS DATEDIFF(MINUTE, EntryTime, ISNULL(ExitTime, SYSUTCDATETIME())),
    TotalAmount   DECIMAL(10,2) NULL,
    Status        NVARCHAR(20) NOT NULL DEFAULT 'Active',
    CONSTRAINT FK_Sessions_Slots    FOREIGN KEY (SlotId)    REFERENCES ParkingSlots(SlotId),
    CONSTRAINT FK_Sessions_Vehicles FOREIGN KEY (VehicleId) REFERENCES Vehicles(VehicleId),
    CONSTRAINT FK_Sessions_Users    FOREIGN KEY (UserId)    REFERENCES Users(UserId),
    CONSTRAINT CK_Session_Status    CHECK (Status IN ('Active','Completed','Cancelled'))
);
GO

-- =========================================================
-- 2.2 Reservations
-- =========================================================
-- Reservations
-- =========================================================
CREATE TABLE Reservations (
    ReservationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId        INT NOT NULL,
    SlotId        INT NOT NULL,
    VehicleId     INT NULL,
    StartTime     DATETIME2 NOT NULL,
    EndTime       DATETIME2 NOT NULL,
    Status        NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Reservations_Users    FOREIGN KEY (UserId)    REFERENCES Users(UserId),
    CONSTRAINT FK_Reservations_Slots    FOREIGN KEY (SlotId)    REFERENCES ParkingSlots(SlotId),
    CONSTRAINT FK_Reservations_Vehicles FOREIGN KEY (VehicleId) REFERENCES Vehicles(VehicleId),
    CONSTRAINT CK_Reservation_Status    CHECK (Status IN ('Pending','Confirmed','Cancelled','Completed','NoShow'))
);
GO

-- =========================================================
-- 2.3 Payments
-- =========================================================
-- Payments
-- =========================================================
CREATE TABLE Payments (
    PaymentId     INT IDENTITY(1,1) PRIMARY KEY,
    SessionId     INT NOT NULL UNIQUE,
    Amount        DECIMAL(10,2) NOT NULL,
    PaymentMethod NVARCHAR(30) NOT NULL,
    Status        NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    PaidAt        DATETIME2 NULL,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Payments_Sessions FOREIGN KEY (SessionId) REFERENCES ParkingSessions(SessionId),
    CONSTRAINT CK_Payment_Status    CHECK (Status IN ('Pending','Paid','Failed','Refunded')),
    CONSTRAINT CK_Payment_Method    CHECK (PaymentMethod IN ('Cash','Card','Mobile','Online'))
);
GO

-- =========================================================
-- 2.4 Tariffs
-- =========================================================
-- Tariffs
-- =========================================================
CREATE TABLE Tariffs (
    TariffId      INT IDENTITY(1,1) PRIMARY KEY,
    ZoneId        INT NOT NULL,
    UserType      NVARCHAR(20) NOT NULL,
    HourlyRate    DECIMAL(10,2) NOT NULL,
    DailyCap      DECIMAL(10,2) NULL,
    ValidFrom     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ValidTo       DATETIME2 NULL,
    CONSTRAINT FK_Tariffs_Zones    FOREIGN KEY (ZoneId) REFERENCES Zones(ZoneId),
    CONSTRAINT CK_Tariff_UserType  CHECK (UserType IN ('Resident','Guest','VIP'))
);
GO

-- =========================================================
-- STEP 3 - IoT integration
-- =========================================================
-- 3.1 SensorDevices
-- =========================================================
-- SensorDevices
-- =========================================================
CREATE TABLE SensorDevices (
    DeviceId      INT IDENTITY(1,1) PRIMARY KEY,
    SlotId        INT NOT NULL UNIQUE,
    DeviceCode    NVARCHAR(50) NOT NULL UNIQUE,
    DeviceType    NVARCHAR(50) NOT NULL DEFAULT 'Ultrasonic',
    IsOnline      BIT NOT NULL DEFAULT 1,
    LastPing      DATETIME2 NULL,
    CONSTRAINT FK_Devices_Slots FOREIGN KEY (SlotId) REFERENCES ParkingSlots(SlotId)
);
GO

-- =========================================================
-- 3.2 DeviceLogs
-- =========================================================
-- DeviceLogs
-- =========================================================
CREATE TABLE DeviceLogs (
    LogId         BIGINT IDENTITY(1,1) PRIMARY KEY,
    DeviceId      INT NOT NULL,
    Status        NVARCHAR(20) NOT NULL,
    Distance      DECIMAL(6,2) NULL,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_DeviceLogs_Devices FOREIGN KEY (DeviceId) REFERENCES SensorDevices(DeviceId)
);
GO

-- =========================================================
-- 3.3 AnprLogs
-- =========================================================
-- AnprLogs
-- =========================================================
CREATE TABLE AnprLogs (
    AnprId        BIGINT IDENTITY(1,1) PRIMARY KEY,
    PlateNumber   NVARCHAR(20) NOT NULL,
    Confidence    DECIMAL(5,2) NULL,
    ImagePath     NVARCHAR(500) NULL,
    SessionId     INT NULL,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Anpr_Sessions FOREIGN KEY (SessionId) REFERENCES ParkingSessions(SessionId)
);
GO

-- =========================================================
-- STEP 4 - Administration and seeds
-- =========================================================
-- 4.1 AuditLogs
-- =========================================================
-- AuditLogs
-- =========================================================
CREATE TABLE AuditLogs (
    AuditId       BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId        INT NULL,
    Action        NVARCHAR(100) NOT NULL,
    Entity        NVARCHAR(100) NULL,
    EntityId      NVARCHAR(50) NULL,
    Details       NVARCHAR(MAX) NULL,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Audit_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- =========================================================
-- 4.2 Indexes
-- =========================================================
-- Indexes
-- =========================================================
CREATE INDEX IX_Slots_Status       ON ParkingSlots(Status);
CREATE INDEX IX_Sessions_Status    ON ParkingSessions(Status);
CREATE INDEX IX_Sessions_Entry     ON ParkingSessions(EntryTime);
CREATE INDEX IX_Reservations_Time  ON Reservations(StartTime, EndTime);
CREATE INDEX IX_Payments_Status    ON Payments(Status);
CREATE INDEX IX_Anpr_Plate         ON AnprLogs(PlateNumber);
GO

-- =========================================================
-- 4.3 Seed: Roles, Zones, users
-- STEP 1 starts here with initial master data
-- =========================================================
-- Seed: Roles + users (optional)
-- Password for both users: password
-- =========================================================
IF NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Admin')
BEGIN
    INSERT INTO Roles (Name, Description)
    VALUES ('Admin', 'Administrator i sistemit');
END
GO

IF NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'User')
BEGIN
    INSERT INTO Roles (Name, Description)
    VALUES ('User', 'Perdorues standard i sistemit');
END
GO

IF NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Operator')
BEGIN
    INSERT INTO Roles (Name, Description)
    VALUES ('Operator', 'Stafi operativ i parkingut');
END
GO

IF NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Resident')
BEGIN
    INSERT INTO Roles (Name, Description)
    VALUES ('Resident', 'Banor rezident me tarifa speciale');
END
GO

IF NOT EXISTS (SELECT 1 FROM Zones WHERE Name = 'Zone A')
BEGIN
    INSERT INTO Zones (Name, Location, Capacity, HourlyRate)
    VALUES ('Zone A', 'Hyrja kryesore', 20, 1.00);
END
GO

IF NOT EXISTS (SELECT 1 FROM Zones WHERE Name = 'Zone B')
BEGIN
    INSERT INTO Zones (Name, Location, Capacity, HourlyRate)
    VALUES ('Zone B', 'Pjesa qendrore', 20, 1.00);
END
GO

IF NOT EXISTS (SELECT 1 FROM Zones WHERE Name = 'Zone C')
BEGIN
    INSERT INTO Zones (Name, Location, Capacity, HourlyRate)
    VALUES ('Zone C', 'Dalja dhe pjesa e pasme', 20, 1.00);
END
GO

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'parking.iot.prishtine@gmail.com')
BEGIN
    INSERT INTO Users (FullName, Email, PhoneNumber, PasswordHash, RoleId, IsActive)
    SELECT
        'Admin',
        'parking.iot.prishtine@gmail.com',
        '+38344738192',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        r.RoleId,
        1
    FROM Roles r
    WHERE r.Name = 'Admin';
END
GO

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'user.parking.iot.prishtine@gmail.com')
BEGIN
    INSERT INTO Users (FullName, Email, PhoneNumber, PasswordHash, RoleId, IsActive)
    SELECT
        'User',
        'user.parking.iot.prishtine@gmail.com',
        '+38349627415',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        r.RoleId,
        1
    FROM Roles r
    WHERE r.Name = 'User';
END
GO
