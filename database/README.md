# Database – SQL Server

Ky folder permban skriptet `SQL` te projektit.

## Teknologjia
- `SQL Server 2019+`
- `SSMS` (SQL Server Management Studio)

## Struktura aktuale

```text
database/
├── schema.sql              Krijimi i tabelave
├── seed.sql                Te dhena fillestare
└── diagrams/               ER diagrams
```

## Si te fillohet
1. hap `SSMS`
2. krijo databazen: `CREATE DATABASE SmartParkingDB`
3. ekzekuto `schema.sql`
4. ekzekuto `seed.sql`
5. ekzekuto `indexes.sql`

## Tabelat aktive ne MVP
- `Roles`
- `Users`
- `Vehicles`
- `Zones`
- `ParkingSlots`
- `ParkingSessions`
- `Reservations`
- `Payments`

Keto tabela jane ato qe backend-i aktual i perdor realisht per `Auth`, `Parking`, `Reservations` dhe `Dashboard`.

## Tabelat e fazes tjeter
- `Tariffs`
- `SensorDevices`
- `DeviceLogs`
- `AnprLogs`
- `AuditLogs`

Keto tabela ekzistojne ne `schema.sql`, por nuk jane ende te lidhura plotesisht me API-ne aktuale. Ato mbeten pjese e fazes se ardhshme per `IoT logging`, `AI/ANPR`, `tarifa dinamike` dhe `auditim`.

## Si te fillohet
1. hap `SSMS`
2. krijo databazen: `CREATE DATABASE parkingIOT`
3. ekzekuto `schema.sql`
4. ekzekuto `seed.sql`

## Sinkronizimi me backend-in
- `AppDbContext` dhe entitetet aktuale mbulojne vetem tabelat e MVP-se
- kur shtohen `Tariffs`, `SensorDevices`, `DeviceLogs`, `AnprLogs` ose `AuditLogs` ne API, duhet te shtohen edhe ne modelin EF
- `schema.sql` mban edhe tabelat e fazes tjeter per te shmangur humbjen e dizajnit, por ato nuk duhen konsideruar te implementuara ne backend vetem pse ekzistojne ne SQL

## Pergjegjes
- `Personi 2` – `Database Engineer`
