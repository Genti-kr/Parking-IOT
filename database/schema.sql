-- =========================================================
-- Smart Parking Management System
-- Database Schema (SQL Server)
-- =========================================================

-- CREATE DATABASE SmartParkingDB;
-- GO
-- USE SmartParkingDB;
-- GO

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
-- Indexes
-- =========================================================
CREATE INDEX IX_Slots_Status       ON ParkingSlots(Status);
CREATE INDEX IX_Sessions_Status    ON ParkingSessions(Status);
CREATE INDEX IX_Sessions_Entry     ON ParkingSessions(EntryTime);
CREATE INDEX IX_Reservations_Time  ON Reservations(StartTime, EndTime);
CREATE INDEX IX_Payments_Status    ON Payments(Status);
CREATE INDEX IX_Anpr_Plate         ON AnprLogs(PlateNumber);
GO
