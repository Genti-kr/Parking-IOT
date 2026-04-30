"""
Smart Parking Slot Simulator
----------------------------
Dergon statuse fake ne backend per testim pa hardware real.

Perdorimi:
  pip install requests
  python simulator.py
  python simulator.py --once --slot-id 1 --status occupied
"""

import argparse
import os
import random
import time
from datetime import datetime

try:
    import requests
except ImportError:
    raise SystemExit("Instalo 'requests' me: pip install requests")


DEFAULT_URL = "http://localhost:5000/api/slots/update"
VALID_STATUSES = ("free", "occupied", "reserved", "outofservice")


def build_payload(slot_id: int, status: str | None = None) -> dict:
    return {
        "slotId": slot_id,
        "status": (status or random.choice(VALID_STATUSES)).lower(),
        "timestamp": datetime.utcnow().isoformat(timespec="seconds"),
    }


def send_update(url: str, payload: dict) -> None:
    headers = {}
    device_key = os.environ.get("IOT_DEVICE_KEY")
    if device_key:
        headers["X-Device-Key"] = device_key

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        body = response.text.strip()
        print(
            f"[{payload['slotId']:>2}] {payload['status']:<9} "
            f"-> HTTP {response.status_code}"
        )
        if body:
            print(f"     {body}")
    except requests.RequestException as exc:
        print(f"[{payload['slotId']:>2}] gabim: {exc}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Parking slot simulator")
    parser.add_argument("--url", default=DEFAULT_URL, help="Endpoint i backend-it")
    parser.add_argument("--slots", type=int, default=10, help="Numri i vendeve")
    parser.add_argument("--interval", type=float, default=5.0, help="Sekonda mes update-ve")
    parser.add_argument("--slot-id", type=int, help="Dergon update vetem per nje slot specifik")
    parser.add_argument(
        "--status",
        choices=VALID_STATUSES,
        help="Status fiks per cdo update",
    )
    parser.add_argument("--once", action="store_true", help="Dergon vetem nje cikel")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.slot_id is not None and args.slot_id < 1:
        raise SystemExit("--slot-id duhet te jete >= 1")
    if args.slots < 1:
        raise SystemExit("--slots duhet te jete >= 1")

    print(f"Simulator nisi. Endpoint: {args.url}")
    print(f"Slotet: 1..{args.slots}, intervali: {args.interval}s\n")

    while True:
        slot_id = args.slot_id or random.randint(1, args.slots)
        send_update(args.url, build_payload(slot_id, args.status))
        if args.once:
            break
        time.sleep(args.interval)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nSimulator u ndalua.")
