"""
ESP32 - Smart Parking Sensor
----------------------------
MicroPython kod baze per ESP32 + HC-SR04.
Mat distancen dhe dergon statusin ne backend.

Varet nga:
- wifi_config.py (SSID, PASSWORD)
- api_client.py  (URL, send_status)
"""

import time
import machine
from wifi_config import connect_wifi
from api_client import send_status

SLOT_ID = 1
TRIG_PIN = 5
ECHO_PIN = 18
THRESHOLD_CM = 50  # nen kete vlere slot-i konsiderohet i zene
INTERVAL_SEC = 5

trig = machine.Pin(TRIG_PIN, machine.Pin.OUT)
echo = machine.Pin(ECHO_PIN, machine.Pin.IN)


def read_distance_cm() -> float:
    trig.value(0)
    time.sleep_us(2)
    trig.value(1)
    time.sleep_us(10)
    trig.value(0)

    while echo.value() == 0:
        pulse_start = time.ticks_us()
    while echo.value() == 1:
        pulse_end = time.ticks_us()

    duration = time.ticks_diff(pulse_end, pulse_start)
    return (duration * 0.0343) / 2


def main():
    connect_wifi()
    print("ESP32 Smart Parking u nis.")
    last_status = None

    while True:
        try:
            distance = read_distance_cm()
            status = "occupied" if distance < THRESHOLD_CM else "free"
            print(f"Distance: {distance:.1f} cm -> {status}")
            if status != last_status:
                send_status(SLOT_ID, status)
                last_status = status
            else:
                print("Statusi nuk ndryshoi, update nuk u dergua.")
        except Exception as exc:
            print("Gabim:", exc)

        time.sleep(INTERVAL_SEC)


if __name__ == "__main__":
    main()
