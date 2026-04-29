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

## Struktura e propozuar

```text
iot/
├── esp32/
│   ├── main.py             Kodi kryesor
│   ├── sensor.py           Logjika HC-SR04
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

Endpoint: `POST /api/parking/slots/update`

## Strategjia
1. filloni me `simulator.py` ne Python qe dergon sinjale fake
2. pastaj kaloni ne `ESP32` real kur hardware te jete gati
3. testoni logjiken fillimisht ne Wi-Fi lokal

## Pergjegjes
- `Personi 7` – `IoT` + `AI`
