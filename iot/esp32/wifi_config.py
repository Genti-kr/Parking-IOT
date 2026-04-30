"""Konfigurimi i Wi-Fi per ESP32."""

import network
import time

SSID = "YOUR_WIFI_NAME"
PASSWORD = "YOUR_WIFI_PASSWORD"
BACKEND_BASE_URL = "http://192.168.1.100:5000"
DEVICE_API_KEY = "SET_SHARED_DEVICE_KEY"


def connect_wifi(timeout: int = 15):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Duke u lidhur me Wi-Fi...")
        wlan.connect(SSID, PASSWORD)
        start = time.time()
        while not wlan.isconnected():
            if time.time() - start > timeout:
                raise RuntimeError("Wi-Fi nuk u lidh brenda kohes.")
            time.sleep(0.5)
    print("Wi-Fi u lidh. IP:", wlan.ifconfig()[0])
    return wlan
