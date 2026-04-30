# Permbledhje e Projektit

Ky dokument permbledh shkurt gjendjen aktuale te projektit, punen e kryer deri tani dhe pikat qe kane mbetur.

## Puna e kryer

### Frontend
- `Login` funksional me lidhje reale me API
- `Register` funksional me validime baze
- `ProtectedRoute` per ruajtjen e rrugeve private
- `Dashboard` funksional
- `Parking` funksional
- `Reservations` te lidhura me backend-in real
- navigim dhe `sidebar` sipas rolit
- `responsive UI` baze
- fallback me `mock data` vetem kur API nuk arrihet

### Backend
- `AuthController` dhe `AuthService` funksional
- autentifikim me `JWT`
- role baze: `Admin`, `Operator`, `Resident`, `Guest`
- endpoint-e kryesore aktive:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/slots/update`
  - `POST /api/entry`
  - `POST /api/exit`
  - `GET /api/dashboard/stats`
  - `GET /api/parking/available`
  - `GET /api/reservations`
- pagesa ne `exit` shenohet si `Paid`
- `dashboard stats` funksionale per `Admin` dhe `Operator`
- rezervimet filtrohen sipas rolit/perdoruesit

### Database
- `schema.sql` i perditesuar
- `seed.sql` i perditesuar
- 3 zona te definuara:
  - `Zone A`
  - `Zone B`
  - `Zone C`
- cdo zone ka `10` vende parkimi
- role seed te sinkronizuara me backend-in
- ndarje e qarte mes tabelave te `MVP` dhe tabelave te fazes tjeter

### IoT / Simulator
- `ESP32` kod baze funksional
- `simulator.py` per testim pa hardware
- dergimi i statusit ne backend funksional
- `X-Device-Key` per endpoint-in e `IoT`
- konfigurim i backend URL dhe device key ne `ESP32`

### AI Service
- `FastAPI` skeleton funksional
- `GET /health`
- `POST /anpr/detect`
- `OCR` baze me `Tesseract`
- strukturë reale ne `ai-service/app/`

### QA / Dokumentim
- `README.md` te perditesuara
- `iot/README.md` i perditesuar
- `backend/README.md` i perditesuar
- `database/README.md` i perditesuar
- `docs/qa-integration-checklist.md` i shtuar
- `npm test` ne rrënje verifikon backend + frontend

## Cfare ka mbetur

### Frontend
- ndarje me e plote e pamjeve per `Admin`, `User`, `Guest`
- faqe per `Users Management`
- faqe per `Reports`
- `Profile page`
- `History / Payments page`
- krijimi dhe anulimi i rezervimeve nga UI

### Backend
- `CRUD` i plote per rezervime
- menaxhim perdoruesish nga `Admin`
- role-based access me i plote ne cdo endpoint
- logjike per tarifa dinamike nga `Tariffs`
- `IoT logs` dhe `audit logs`
- endpoint real per integrimin e `AI`

### Database
- migrim i databazes ekzistuese me skript real
- sinkronizim me `EF Core migrations`
- lidhja reale e tabelave:
  - `Tariffs`
  - `SensorDevices`
  - `DeviceLogs`
  - `AnprLogs`
  - `AuditLogs`

### IoT / AI
- `YOLO` per detektim real te targave
- forward i rezultateve te `AI` ne backend
- log i sinjaleve nga pajisjet `IoT`
- testim me hardware real `ESP32 + sensor`

### QA / Finalizim
- testim manual i plote i roleve
- screenshot-e finale
- pastrim i README-ve nga pjeset e vjetra
- pergatitje per `merge / pull request`

## Prioritetet e ardhshme
1. `Create/Cancel Reservations`
2. `Role-based pages` me ndarje te plote
3. `Users Management` per `Admin`
4. `AI -> Backend integration`
5. `Database migration / cleanup`
