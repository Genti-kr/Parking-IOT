# AI Service – ANPR (Automatic Number Plate Recognition)

Sherbim per identifikimin automatik te targave te automjeteve.

## Teknologjia
- `Python 3.10+`
- `FastAPI`
- `OpenCV`
- `YOLOv8` (Ultralytics)
- `Tesseract OCR`

## Struktura aktuale

```text
ai-service/
├── app/
│   ├── main.py             FastAPI entry
│   ├── detector.py         MVP detector (full-frame)
│   ├── ocr.py              Tesseract reader
│   └── api_client.py       Forward opsional ne backend
├── requirements.txt
└── README.md
```

## Pipeline
1. kapja e imazhit (`camera` ose `upload`)
2. `YOLOv8` detekton targat
3. `OpenCV` nxjerr rajonin e targes
4. `Tesseract OCR` lexon tekstin
5. dergohet ne backend

## Endpoint-e lokale
- `GET /health`
- `POST /anpr/detect` – pranon imazh dhe kthen targen e lexuar

## Si te niset
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Shembull testimi
```bash
curl -X POST "http://localhost:8001/anpr/detect" ^
  -F "file=@sample-car.jpg"
```

## Gjendja aktuale
- sherbimi eshte MVP me `OCR` bazik
- `detector.py` aktualisht perdor te gjithe imazhin si input
- integrimi me `YOLO` dhe forward real ne backend mbeten hapi i ardhshem

## Strategjia
1. validoni `OCR` me foto statike
2. shtoni `YOLO` per lokalizim me sakte te targes
3. lidhni rezultatin me endpoint-in final te backend-it

## Pergjegjes
- `Personi 7` – `IoT` + `AI`
