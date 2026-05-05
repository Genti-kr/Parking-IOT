# Database – SQL Server

Ky folder permban skriptet `SQL` te projektit.

## Teknologjia
- `SQL Server 2019+`
- `SSMS` (SQL Server Management Studio)

## Struktura

```text
database/
├── schema.sql              Krijimi i tabelave
├── seed.sql                Te dhena fillestare
├── indexes.sql             Indekse per performance
├── procedures/             Stored procedures
└── diagrams/               ER diagrams
```

## Si te fillohet
1. hap `SSMS`
2. krijo databazen: `CREATE DATABASE SmartParkingDB`
3. ekzekuto `schema.sql`
4. ekzekuto `seed.sql`
5. ekzekuto `indexes.sql`

## Tabelat kryesore
- `Roles`
- `Users`
- `Vehicles`
- `Zones`
- `ParkingSlots`
- `ParkingSessions`
- `Reservations`
- `Payments`
- `Tariffs`
- `SensorDevices`
- `DeviceLogs`
- `AnprLogs`
- `AuditLogs`

Skema e plote gjendet ne `schema.sql`.

## Pergjegjes
- `Personi 2` – `Database Engineer`
