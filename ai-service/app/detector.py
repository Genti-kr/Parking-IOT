import cv2
import numpy as np


def extract_plate_region(image_bytes: bytes):
    np_buffer = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(np_buffer, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Imazhi nuk mund te lexohet.")

    # MVP: perdor te gjithe imazhin si input per OCR.
    # Detektimi me YOLO mbetet hapi i ardhshem.
    return image
