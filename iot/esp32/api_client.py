"""Klient HTTP per te derguar statusin ne backend."""

import urequests
import ujson
import time

API_URL = "http://192.168.1.100:5000/api/slots/update"


def send_status(slot_id: int, status: str):
    payload = {
        "slotId": slot_id,
        "status": status,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
    try:
        response = urequests.post(
            API_URL,
            data=ujson.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        print("Backend response:", response.status_code)
        response.close()
    except Exception as exc:
        print("Dergim deshtoi:", exc)
