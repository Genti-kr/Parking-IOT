# IoT – ESP32 Parking Sensor

Ky folder permban kodin per pajisjet `IoT` te monitorimit te vendeve te parkimit.

## Hardware
- `ESP32` (Wi-Fi)
- `HC-SR04 Ultrasonic Sensor`
- `LCD 16x2 I2C`
- `LED` indikator (i kuq / i gjelber)
- `Push Button`

## Teknologjia
- `MicroPython` ose `Arduino C++`
- `HTTP POST` ne backend
- format `JSON`

## Struktura aktuale

```text
iot/
├── esp32/
│   ├── main.py             Kodi kryesor
│   ├── wifi_config.py      Konfigurimi i Wi-Fi
│   └── api_client.py       Dergesa ne backend
├── simulator/
│   └── simulator.py        Simulator per testim pa hardware
└── README.md
```

## Payload qe dergohet ne backend

```json
{
  "slotId": 12,
  "status": "occupied",
  "timestamp": "2026-04-20T10:30:00"
}
```

Endpoint real: `POST /api/slots/update`

## ESP32
1. ploteso `SSID`, `PASSWORD`, `BACKEND_BASE_URL` dhe `DEVICE_API_KEY` te `esp32/wifi_config.py`
2. ngarko `main.py`, `wifi_config.py` dhe `api_client.py` ne pajisje
3. sensori dergon update vetem kur statusi ndryshon, per te shmangur spam ne backend

## Simulator
Shembuj:

```bash
python simulator.py
set IOT_DEVICE_KEY=your_shared_key
python simulator.py --once --slot-id 1 --status occupied
python simulator.py --slots 20 --interval 2
```

Opsionet kryesore:
- `--url` per endpoint-in e backend-it
- `--slot-id` per te testuar nje vend specifik
- `--status` per te detyruar nje status te caktuar
- `--once` per nje update te vetem
- `IOT_DEVICE_KEY` si environment variable per `X-Device-Key`

## Verifikim i shpejte
1. nis backend-in ne `http://localhost:5000`
2. ekzekuto `python simulator.py --once --slot-id 1 --status occupied`
3. kontrollo `GET /api/parking/available` ose UI-n qe statusi te reflektohet ne databaze

## Strategjia
1. filloni me `simulator.py` per integrimin me backend
2. kaloni ne `ESP32` real pasi endpoint-i te jete validuar
3. testoni logjiken fillimisht ne Wi-Fi lokal dhe me disa statuse (`free`, `occupied`, `reserved`)

## Pergjegjes
- `Personi 7` – `IoT` + `AI`
