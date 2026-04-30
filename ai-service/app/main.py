import os

from fastapi import FastAPI, File, HTTPException, UploadFile

from .api_client import forward_result
from .detector import extract_plate_region
from .ocr import read_plate_text

app = FastAPI(title="Smart Parking AI Service", version="0.1.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/anpr/detect")
async def detect_plate(file: UploadFile = File(...)) -> dict:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Ngarko nje file imazh.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="File-i eshte bosh.")

    try:
        plate_image = extract_plate_region(image_bytes)
        plate_number, raw_text = read_plate_text(plate_image)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    result = {
        "plateNumber": plate_number,
        "rawText": raw_text,
        "detected": bool(plate_number),
        "source": "ocr-baseline",
    }

    backend_url = os.getenv("AI_BACKEND_API_URL")
    if backend_url and plate_number:
        result["forwarded"] = forward_result(backend_url, result)

    return result
