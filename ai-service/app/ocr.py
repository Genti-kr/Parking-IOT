import re

import cv2
import pytesseract


def read_plate_text(image) -> tuple[str, str]:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    filtered = cv2.bilateralFilter(gray, 11, 17, 17)
    _, threshold = cv2.threshold(filtered, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    try:
        raw_text = pytesseract.image_to_string(threshold, config="--psm 7")
    except pytesseract.pytesseract.TesseractNotFoundError as exc:
        raise RuntimeError("Tesseract OCR nuk eshte i instaluar ne sistem.") from exc

    normalized = re.sub(r"[^A-Z0-9]", "", raw_text.upper())
    return normalized, raw_text.strip()
