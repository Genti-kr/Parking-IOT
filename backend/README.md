# Backend – Smart Parking API

Ky folder permban `ASP.NET Core Web API` te projektit.

## Teknologjia
- `.NET 8 Web API`
- `C#`
- `Entity Framework Core`
- `SQL Server`
- `JWT Authentication`

## Struktura aktuale

```text
backend/
└── SmartParking.API/          Controllers, Services, Data, Models, appsettings
```

## Si te fillohet
1. hap `Visual Studio` ose `VS Code`
2. konfiguro `Jwt:Key` dhe `Iot:DeviceApiKey`
3. lidh backend-in me databazen e krijuar ne folderin `database/`
4. nise API-ne me `dotnet run`

## Endpoints kryesore
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/entry`
- `POST /api/exit`
- `GET  /api/parking/available`
- `POST /api/slots/update`
- `GET  /api/dashboard/stats`

## Konfigurime minimale
- `Jwt:Key` duhet te jete sekret real me te pakten 32 karaktere
- `Iot:DeviceApiKey` perdoret nga `POST /api/slots/update`
- `Cors:AllowedOrigins` kontrollon origjinat e lejuara te frontend-it
- `appsettings.example.json` tregon formen e konfigurimit

## Pergjegjes
- `Personi 3` – `Auth`, `Users`, `Roles`, `Vehicles`
- `Personi 4` – `Parking`, `Sessions`, `Payments`, `Reservations`
