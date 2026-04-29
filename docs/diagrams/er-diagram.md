# ER Diagram – Smart Parking Management System

Diagrami i meposhtem eshte shkruar ne `Mermaid`. Mund ta hapesh ne:
- `GitHub` (rendet automatikisht)
- `draw.io` (import nga Mermaid)
- `Mermaid Live Editor`: https://mermaid.live

```mermaid
erDiagram
    ROLES ||--o{ USERS : has
    USERS ||--o{ VEHICLES : owns
    USERS ||--o{ RESERVATIONS : makes
    USERS ||--o{ PARKING_SESSIONS : has
    USERS ||--o{ AUDIT_LOGS : triggers

    ZONES ||--o{ PARKING_SLOTS : contains
    ZONES ||--o{ TARIFFS : has

    PARKING_SLOTS ||--o{ PARKING_SESSIONS : used_in
    PARKING_SLOTS ||--o{ RESERVATIONS : reserved_in
    PARKING_SLOTS ||--|| SENSOR_DEVICES : monitored_by

    SENSOR_DEVICES ||--o{ DEVICE_LOGS : generates

    VEHICLES ||--o{ PARKING_SESSIONS : parks_in
    VEHICLES ||--o{ RESERVATIONS : reserves

    PARKING_SESSIONS ||--|| PAYMENTS : paid_with
    PARKING_SESSIONS ||--o{ ANPR_LOGS : detected_by

    ROLES {
        int RoleId PK
        string Name
        string Description
    }

    USERS {
        int UserId PK
        string FullName
        string Email
        string PhoneNumber
        string PasswordHash
        int RoleId FK
        bit IsActive
        datetime CreatedAt
    }

    VEHICLES {
        int VehicleId PK
        int UserId FK
        string PlateNumber
        string Brand
        string Model
        string Color
    }

    ZONES {
        int ZoneId PK
        string Name
        string Location
        int Capacity
        decimal HourlyRate
    }

    PARKING_SLOTS {
        int SlotId PK
        int ZoneId FK
        string SlotNumber
        string Status
        datetime LastUpdate
        bit IsActive
    }

    PARKING_SESSIONS {
        int SessionId PK
        int SlotId FK
        int VehicleId FK
        int UserId FK
        datetime EntryTime
        datetime ExitTime
        decimal TotalAmount
        string Status
    }

    RESERVATIONS {
        int ReservationId PK
        int UserId FK
        int SlotId FK
        int VehicleId FK
        datetime StartTime
        datetime EndTime
        string Status
    }

    PAYMENTS {
        int PaymentId PK
        int SessionId FK
        decimal Amount
        string PaymentMethod
        string Status
        datetime PaidAt
    }

    TARIFFS {
        int TariffId PK
        int ZoneId FK
        string UserType
        decimal HourlyRate
        decimal DailyCap
    }

    SENSOR_DEVICES {
        int DeviceId PK
        int SlotId FK
        string DeviceCode
        string DeviceType
        bit IsOnline
        datetime LastPing
    }

    DEVICE_LOGS {
        bigint LogId PK
        int DeviceId FK
        string Status
        decimal Distance
        datetime CreatedAt
    }

    ANPR_LOGS {
        bigint AnprId PK
        string PlateNumber
        decimal Confidence
        string ImagePath
        int SessionId FK
        datetime CreatedAt
    }

    AUDIT_LOGS {
        bigint AuditId PK
        int UserId FK
        string Action
        string Entity
        string EntityId
        datetime CreatedAt
    }
```

## Relacionet kryesore
- `Roles` 1:N `Users`
- `Users` 1:N `Vehicles`, `Reservations`, `ParkingSessions`
- `Zones` 1:N `ParkingSlots`, `Tariffs`
- `ParkingSlots` 1:1 `SensorDevices`
- `ParkingSlots` 1:N `ParkingSessions`, `Reservations`
- `ParkingSessions` 1:1 `Payments`
- `ParkingSessions` 1:N `AnprLogs`
- `SensorDevices` 1:N `DeviceLogs`
