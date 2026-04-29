# AI Service – ANPR (Automatic Number Plate Recognition)

Sherbim per identifikimin automatik te targave te automjeteve.

## Teknologjia
- `Python 3.10+`
- `FastAPI`
- `OpenCV`
- `YOLOv8` (Ultralytics)
- `Tesseract OCR`

## Struktura e propozuar

```text
ai-service/
├── app/
│   ├── main.py             FastAPI entry
│   ├── detector.py         YOLO detection
│   ├── ocr.py              Tesseract reader
│   └── api_client.py       Dergon ne backend
├── models/                 YOLO weights (.pt)
├── samples/                Imazhe test
├── requirements.txt
└── README.md
```

## Pipeline
1. kapja e imazhit (`camera` ose `upload`)
2. `YOLOv8` detekton targat
3. `OpenCV` nxjerr rajonin e targes
4. `Tesseract OCR` lexon tekstin
5. dergohet ne backend

## Endpoint lokal
- `POST /anpr/detect` – pranon imazh dhe kthen targen e lexuar

## Strategjia
1. filloni me foto statike dhe `OCR` te thjeshte
2. shtoni `YOLO` per detektim
3. integroni me backend vetem ne fund

## Pergjegjes
- `Personi 7` – `IoT` + `AI`
