# Smart Parking Management System

`Smart Parking Management System` eshte nje projekt per menaxhimin inteligjent te parkimit duke kombinuar `IoT`, `Artificial Intelligence`, `Cloud Computing`, `Web` dhe `Mobile`.

Qellimi i sistemit eshte te ofroje monitorim ne kohe reale te vendeve te parkimit, identifikim automatik te automjeteve, llogaritje te tarifave dhe raportim per administrim me efikas te hapesirave urbane.

## Permbledhje
Sistemi synon te:

- reduktoje kohen e kerkimit per parkim
- optimizoje perdorimin e hapesirave ekzistuese
- mbeshtese vendimmarrjen per planifikim urban
- digjitalizoje proceset tradicionale te parkimit

## Qellimi i Projektit
Ky projekt synon te ndertoje nje platforme te integruar per:

- monitorimin e vendeve te lira dhe te zena ne kohe reale
- regjistrimin e hyrjeve dhe daljeve te automjeteve
- menaxhimin e perdoruesve sipas roleve
- llogaritjen automatike te tarifave
- ofrimin e statistikave dhe raporteve per administrate dhe komune

## Objektivat
### Objektiva Funksionale
- monitorimi ne kohe reale i vendeve te parkimit
- identifikimi automatik i automjeteve me `ANPR`
- menaxhimi i perdoruesve `Resident` dhe `Guest`
- llogaritja automatike e tarifave
- rezervimi i parkimit permes aplikacionit mobil
- gjenerimi i raporteve dhe statistikave

### Objektiva Jo-Funksionale
- shkallezueshmeri
- siguri e te dhenave
- disponueshmeri e larte
- performance ne kohe reale

## Scope dhe MVP
Per te mbajtur projektin te realizueshem, versioni i pare (`MVP`) duhet te perfshije:

- menaxhimin e vendeve te parkimit
- hyrje dhe dalje te automjeteve
- tarifim bazik
- dashboard admin
- shfaqjen e vendeve te lira

Gjendja aktuale e MVP-se ne kod perfshin:
- `Auth` me `JWT`
- `Dashboard` me statistika baze
- `Parking slots` dhe update te statusit nga `IoT`
- `Reservations` ne lexim nga backend-i
- `Payments` bazike ne dalje

Fazat me te avancuara mund te perfshijne:

- integrimin e plote me `IoT`
- `ANPR` me `YOLO` dhe `OCR`
- aplikacion mobil me rezervime
- pagesa online
- sistem rekomandimi per parkim

## Aktoret e Sistemit
- `Admin`
- `Operator`
- `Resident`
- `Guest`
- `IoT Device`
- `AI Service`

## Kerkesat Funksionale
- sistemi duhet te tregoje vendet e lira ne kohe reale
- sistemi duhet te regjistroje hyrjen dhe daljen e automjeteve
- sistemi duhet te llogarise tarifat sipas kohes se parkimit
- sistemi duhet te ruaje historikun e sesioneve te parkimit
- sistemi duhet te menaxhoje perdoruesit dhe rolet
- sistemi duhet te gjeneroje statistika dhe raporte

## Kerkesat Jo-Funksionale
- koha e pergjigjes se API-se duhet te jete nen `500ms` per kerkesat kryesore
- perditesimi i statusit te nje vendi parkimi duhet te ndodhe nen `2 sekonda`
- autentifikimi duhet te realizohet me `JWT`
- komunikimi duhet te jete me `HTTPS`
- sistemi duhet te kete disponueshmeri te larte dhe te jete i zgjerueshem

## Arkitektura e Sistemit
Sistemi propozohet si arkitekture `multi-layer`:

1. `IoT Layer`
2. `AI Processing Layer`
3. `Backend API Layer`
4. `Database Layer`
5. `Web Application Layer`
6. `Mobile Application Layer`

Komunikimi ndermjet komponentave realizohet me:

- `REST API`
- `HTTP/HTTPS`
- format `JSON`

## Teknologjite Kryesore
| Shtresa | Teknologjia |
|---|---|
| IoT | `ESP32`, `MicroPython`, `HC-SR04` |
| AI | `Python`, `OpenCV`, `YOLOv8`, `Tesseract OCR`, `FastAPI` |
| Backend | `.NET 8 Web API`, `C#` |
| Database | `SQL Server` |
| Web | `React` |
| Mobile | `Flutter` |
| Communication | `REST API`, `JSON` |

## IoT Layer
### Komponentet Hardware
- `ESP32`
- `HC-SR04 Ultrasonic Sensor`
- `LCD 16x2 I2C`
- `LED` indikator
- `Push Button`

### Funksionimi
Sensori mat distancen dhe percakton statusin e vendit te parkimit:

- `Free`
- `Occupied`

Me pas, `ESP32` dergon statusin ne backend.

Shembull payload:

```json
{
  "slotId": 12,
  "status": "occupied",
  "timestamp": "2026-04-20T10:30:00"
}
```

Endpoint real:

```text
POST /api/slots/update
```

## AI Layer - ANPR
Pipeline i perpunimit:

1. kapja e imazhit nga kamera
2. detektimi i targes me `YOLO`
3. nxjerrja e rajonit te targes
4. `OCR` per leximin e tekstit
5. dergimi i rezultatit ne backend

Teknologjite e propozuara:

- `Python`
- `OpenCV`
- `YOLOv8`
- `Tesseract OCR`
- `FastAPI`

## Backend Layer
### Teknologjia
- `.NET 8 Web API`
- `C#`

### Funksionalitetet Kryesore
- menaxhimi i parkimeve
- autentifikim dhe autorizim me `JWT`
- llogaritja e tarifave dinamike ose bazike
- menaxhimi i perdoruesve dhe roleve
- integrimi me sherbimet `AI` dhe `IoT`

### Endpoints Kryesore reale
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/slots/update`
- `POST /api/entry`
- `POST /api/exit`
- `GET /api/dashboard/stats`
- `GET /api/parking/available`
- `GET /api/reservations`

## Si testohet shpejt
### Backend
```bash
dotnet build backend/SmartParking.API/SmartParking.API.csproj
```

Para nisjes se backend-it, konfiguro:
- `Jwt:Key` me te pakten 32 karaktere
- `Iot:DeviceApiKey` per `POST /api/slots/update`
- `Cors:AllowedOrigins` sipas frontend-it lokal

### Frontend
```bash
npm --prefix frontend-web run build
```

### IoT Simulator
```bash
set IOT_DEVICE_KEY=your_shared_key
python iot/simulator/simulator.py --once --slot-id 1 --status occupied
```

Dokumenti i plote i kontrollave gjendet te `docs/qa-integration-checklist.md`.

## Database Design
### Tabelat Kryesore
- `Users`
- `ParkingSlots`
- `ParkingSessions`
- `Zones`
- `Payments`
- `Reservations`
- `Vehicles`

### Relacionet Kryesore
- `User -> ParkingSessions` `(1:N)`
- `ParkingSlots -> Zones` `(N:1)`
- `ParkingSessions -> Payments` `(1:1)`
- `Users -> Vehicles` `(1:N)`
- `Users -> Reservations` `(1:N)`

### SQL Schema (SQL Server)
Me poshte jane tabelat e propozuara per databazen e sistemit. Kjo eshte nje skeme baze qe mund te zgjerohet me tej sipas nevojave te projektit.

#### Tabela `Roles`
Perdoret per te ruajtur rolet e perdoruesve ne sistem.

```sql
CREATE TABLE Roles (
    RoleId       INT IDENTITY(1,1) PRIMARY KEY,
    Name         NVARCHAR(50) NOT NULL UNIQUE,
    Description  NVARCHAR(255) NULL
);
```

#### Tabela `Users`
Ruan te dhenat e perdoruesve, duke perfshire admin, operator, resident dhe guest.

```sql
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
```

#### Tabela `Vehicles`
Ruan automjetet e lidhura me perdoruesit.

```sql
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
```

#### Tabela `Zones`
Ruan zonat e parkimit, p.sh. zone qendrore, zone periferike etj.

```sql
CREATE TABLE Zones (
    ZoneId        INT IDENTITY(1,1) PRIMARY KEY,
    Name          NVARCHAR(100) NOT NULL,
    Location      NVARCHAR(255) NULL,
    Capacity      INT NOT NULL DEFAULT 0,
    HourlyRate    DECIMAL(10,2) NOT NULL DEFAULT 0,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
```

#### Tabela `ParkingSlots`
Ruan cdo vend parkimi te monitoruar nga sensoret.

```sql
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
```

#### Tabela `ParkingSessions`
Ruan cdo sesion parkimi nga hyrja deri ne dalje.

```sql
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
```

#### Tabela `Reservations`
Ruan rezervimet e berta nga perdoruesit permes aplikacionit mobil.

```sql
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
```

#### Tabela `Payments`
Ruan pagesat e sesioneve te parkimit.

```sql
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
```

#### Tabela `Tariffs`
Ruan rregullat e tarifave per zona dhe lloje perdoruesish.

```sql
CREATE TABLE Tariffs (
    TariffId      INT IDENTITY(1,1) PRIMARY KEY,
    ZoneId        INT NOT NULL,
    UserType      NVARCHAR(20) NOT NULL,
    HourlyRate    DECIMAL(10,2) NOT NULL,
    DailyCap      DECIMAL(10,2) NULL,
    ValidFrom     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ValidTo       DATETIME2 NULL,
    CONSTRAINT FK_Tariffs_Zones FOREIGN KEY (ZoneId) REFERENCES Zones(ZoneId),
    CONSTRAINT CK_Tariff_UserType CHECK (UserType IN ('Resident','Guest','VIP'))
);
```

#### Tabela `SensorDevices`
Ruan informacionin per cdo sensor `IoT` te lidhur me nje vend parkimi.

```sql
CREATE TABLE SensorDevices (
    DeviceId      INT IDENTITY(1,1) PRIMARY KEY,
    SlotId        INT NOT NULL UNIQUE,
    DeviceCode    NVARCHAR(50) NOT NULL UNIQUE,
    DeviceType    NVARCHAR(50) NOT NULL DEFAULT 'Ultrasonic',
    IsOnline      BIT NOT NULL DEFAULT 1,
    LastPing      DATETIME2 NULL,
    CONSTRAINT FK_Devices_Slots FOREIGN KEY (SlotId) REFERENCES ParkingSlots(SlotId)
);
```

#### Tabela `DeviceLogs`
Ruan historikun e sinjaleve nga sensoret.

```sql
CREATE TABLE DeviceLogs (
    LogId         BIGINT IDENTITY(1,1) PRIMARY KEY,
    DeviceId      INT NOT NULL,
    Status        NVARCHAR(20) NOT NULL,
    Distance      DECIMAL(6,2) NULL,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_DeviceLogs_Devices FOREIGN KEY (DeviceId) REFERENCES SensorDevices(DeviceId)
);
```

#### Tabela `AnprLogs`
Ruan rezultatet e leximit te targave nga moduli `AI`.

```sql
CREATE TABLE AnprLogs (
    AnprId        BIGINT IDENTITY(1,1) PRIMARY KEY,
    PlateNumber   NVARCHAR(20) NOT NULL,
    Confidence    DECIMAL(5,2) NULL,
    ImagePath     NVARCHAR(500) NULL,
    SessionId     INT NULL,
    CreatedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Anpr_Sessions FOREIGN KEY (SessionId) REFERENCES ParkingSessions(SessionId)
);
```

#### Tabela `AuditLogs`
Ruan veprimet kritike ne sistem per qellime sigurie.

```sql
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
```

### Indekse te Rekomanduara
Per performance me te mire ne querit me te shpeshta:

```sql
CREATE INDEX IX_Slots_Status       ON ParkingSlots(Status);
CREATE INDEX IX_Sessions_Status    ON ParkingSessions(Status);
CREATE INDEX IX_Sessions_Entry     ON ParkingSessions(EntryTime);
CREATE INDEX IX_Reservations_Time  ON Reservations(StartTime, EndTime);
CREATE INDEX IX_Payments_Status    ON Payments(Status);
CREATE INDEX IX_Anpr_Plate         ON AnprLogs(PlateNumber);
```

### Te Dhena Fillestare (Seed)
Te dhena te rekomanduara per fillim:

```sql
INSERT INTO Roles (Name, Description) VALUES
('Admin',    'Administrator i sistemit'),
('Operator', 'Operator i parkimit'),
('Resident', 'Perdorues banor'),
('Guest',    'Perdorues mysafir');
```

## Web Application
### Teknologjia
- `React`

### Funksionalitetet
- dashboard ne kohe reale
- pamje e vendeve te parkimit
- menaxhim perdoruesish
- statistika dhe raporte
- analiza per planifikim urban

### Vizualizime
- `Chart.js` ose `Recharts`
- integrim me harta si `Google Maps API`

## Mobile Application
### Teknologjia
- `Flutter`

### Funksionalitetet
- shikimi i vendeve te lira
- rezervimi i parkimit
- navigimi deri te vendi i parkimit
- pagesa online
- historiku i parkimeve

## Sistemi i Rekomandimit
Parkimi i rekomanduar mund te bazohet ne:

- distance
- cmim
- disponueshmeri
- ngarkese te zones

## Siguria e Sistemit
- `HTTPS` per komunikim
- `JWT Authentication`
- `Role-Based Access Control (RBAC)`
- enkriptim per te dhena sensitive
- validim i inputeve ne backend
- auditim i veprimeve kritike

## API Design
Per cdo endpoint duhet te dokumentohen:

- `request body`
- `response body`
- `status codes`
- `error messages`

Shembuj endpoint-esh:

```text
POST /api/entry
POST /api/exit
GET /api/parking/available
POST /api/slots/update
GET /api/dashboard/stats
```

## Testimi
Duhet te perfshihen:

- testim i API-se
- testim i databazes
- testim i skenareve kryesore
- testim i integrimit me `IoT`
- testim i saktesise se modulit `ANPR`

## Rreziqet dhe Kufizimet
- saktesia e leximit te targave mund te ndikohet nga ndricimi dhe kendet e kameres
- deshtimi i sensoreve mund te jape status te pasakte te vendeve
- mungesa e hardware real mund te vonoje testimin e plote
- integrimi i njehershem i shume moduleve e ben projektin me kompleks

## Si te Fillosh ne Javen e Pare
Java e pare duhet te fokusohet te baza e sistemit, jo te modulet me te renda si `AI`, `Flutter` apo hardware real.

### Dita 1
- percakto emrin final te projektit
- percakto scope-in
- percakto `MVP`
- percakto rolet e perdoruesve

### Dita 2
- shkruaj kerkesat funksionale
- shkruaj kerkesat jo-funksionale
- pergatit `use cases` kryesore

### Dita 3
- dizajno databazen fillestare
- krijo `ER Diagram`
- pershkruaj tabelat kryesore

### Dita 4
- defino backend-in me `ASP.NET Core Web API`
- percakto endpoint-et kryesore
- dokumento `request/response`

### Dita 5
- krijo projektin backend
- krijo databazen
- krijo modelet baze
- implemento endpoint-in e pare

### Dita 6
- implemento logjiken baze per slot-et
- implemento hyrje dhe dalje
- implemento llogaritjen e thjeshte te tarifes

### Dita 7
- dokumento progresin
- kontrollo cfare funksionon
- planifiko javen e dyte

## Renditja e Rekomanduar e Implementimit
1. `Database`
2. `Backend API`
3. `Web Dashboard` i thjeshte
4. `IoT Integration`
5. `AI / ANPR`
6. `Mobile Application`

## Deliverables te Javes se Pare
Ne fund te javes se pare duhet te kesh:

- dokumentin e strukturuar
- `ER Diagram`
- `Use Cases`
- `API Design` bazik
- skeleton te backend-it ne `.NET`
- databazen fillestare
- `2-3` endpoint-e funksionale

## Perfundim
`Smart Parking Management System` paraqet nje zgjidhje moderne dhe te shkallezueshme per menaxhimin e parkimit ne mjedise urbane. Projekti kombinon teknologji moderne per te krijuar nje sistem praktik, te automatizuar dhe te pershtatshem per zgjerim ne faza te ardhshme.
