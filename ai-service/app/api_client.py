import requests


def forward_result(backend_url: str, payload: dict) -> bool:
    try:
        response = requests.post(backend_url, json=payload, timeout=5)
        return response.ok
    except requests.RequestException:
        return False
