# QA dhe Integrim

Ky dokument permbledh kontrollat minimale per verifikimin e MVP-se.

## Smoke checks

### Backend
```bash
dotnet build backend/SmartParking.API/SmartParking.API.csproj
```

### Frontend
```bash
npm --prefix frontend-web run build
```

### Simulator
```bash
python iot/simulator/simulator.py --once --slot-id 1 --status occupied
```

## Rrjedhat qe duhen testuar manualisht
1. `Register` krijon perdorues me rol `Guest` dhe e kyç automatikisht.
2. `Login` kthen token dhe hap `Dashboard`.
3. `Dashboard` shfaq statistika reale kur API eshte online.
4. `Reservations` lexon te dhena reale nga backend-i.
5. `Exit` krijon pagese `Paid` dhe rrit `revenueToday`.
6. `Simulator` perditeson statusin e slot-it permes `POST /api/slots/update`.

## Bug checks
1. `401 Unauthorized` nuk duhet te shfaqet si mock data; perdoruesi duhet te kthehet te `login`.
2. Perdoruesit normal nuk duhet te shohin rezervimet e perdoruesve te tjere.
3. Seed-et e databazes duhet te perdorin rolin `Guest`, jo `User`, per regjistrimet e reja.

## Dokumentim qe duhet mbajtur ne sinkron
1. `README.md` ne rrënjë per endpoint-et dhe setup-in real.
2. `iot/README.md` per simulatorin dhe konfigurimin e ESP32.
3. `docs/README.md` per dokumentet e QA/integrimit.

## Screenshot-e te rekomanduara
- `Login`
- `Register`
- `Dashboard`
- `Parking`
- `Reservations`
- nje update i simulatorit ne terminal

## PR checklist
1. `dotnet build` kalon.
2. `npm run build` kalon.
3. README dhe dokumentimi i prekur jane perditesuar.
4. Ndryshimet jane testuar minimalisht ne UI ose me simulator.
