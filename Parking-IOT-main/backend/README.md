# Backend – Smart Parking API

Ky folder permban `ASP.NET Core Web API` te projektit.

## Teknologjia
- `.NET 8 Web API`
- `C#`
- `Entity Framework Core`
- `SQL Server`
- `JWT Authentication`

## Struktura e propozuar

```text
backend/
├── SmartParking.API/          Controllers, Program.cs, appsettings
├── SmartParking.Core/         Entities, DTOs, Interfaces
├── SmartParking.Infrastructure/ EF Core, Repositories, DbContext
├── SmartParking.Services/     Business logic (Auth, Parking, Payments)
└── SmartParking.Tests/        Unit tests
```

## Si te fillohet
1. hap `Visual Studio` ose `VS Code`
2. krijo projektin:
   ```bash
   dotnet new webapi -n SmartParking.API
   ```
3. shto `Entity Framework Core` dhe `JWT`
4. lidh me databazen e krijuar ne folderin `database/`
5. implemento endpoint-et e para

## Endpoints kryesore
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/entry`
- `POST /api/exit`
- `GET  /api/parking/available`
- `POST /api/slots/update`
- `GET  /api/dashboard/stats`

## Pergjegjes
- `Personi 3` – `Auth`, `Users`, `Roles`, `Vehicles`
- `Personi 4` – `Parking`, `Sessions`, `Payments`, `Reservations`
