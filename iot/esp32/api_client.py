"""Klient HTTP per te derguar statusin ne backend."""

import urequests
import ujson
import time

try:
    from wifi_config import BACKEND_BASE_URL, DEVICE_API_KEY
except ImportError:
    BACKEND_BASE_URL = "http://192.168.1.100:5000"
    DEVICE_API_KEY = ""

API_URL = "{}/api/slots/update".format(BACKEND_BASE_URL.rstrip("/"))


def send_status(slot_id: int, status: str):
    payload = {
        "slotId": slot_id,
        "status": status.lower(),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
    try:
        response = urequests.post(
            API_URL,
            data=ujson.dumps(payload),
            headers={
                "Content-Type": "application/json",
                "X-Device-Key": DEVICE_API_KEY,
            },
        )
        print("Backend response:", response.status_code)
        response.close()
    except Exception as exc:
        print("Dergim deshtoi:", exc)
