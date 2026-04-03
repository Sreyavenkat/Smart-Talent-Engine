import pdfplumber
from docx import Document
import pytesseract
from PIL import Image
import os


# PDF extraction 
def extract_text_from_pdf(file_path: str) -> str:
    text = ""

    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"Error parsing PDF: {e}")

    return text


# DOCX extraction
def extract_text_from_docx(file_path: str) -> str:
    text = ""
    try:
        doc = Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error parsing DOCX: {e}")

    return text


# IMAGE OCR extraction
def extract_text_from_image(file_path: str) -> str:
    text = ""
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
    except Exception as e:
        print(f"Error in OCR: {e}")

    return text


# MAIN UNIFIED FUNCTION
def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        text = extract_text_from_pdf(file_path)

        # fallback to OCR if PDF has no text (scanned PDF)
        if not text.strip():
            print("No text found in PDF, using OCR...")
            text = extract_text_from_image(file_path)

        return text

    elif ext == ".docx":
        return extract_text_from_docx(file_path)

    elif ext in [".jpg", ".jpeg", ".png"]:
        return extract_text_from_image(file_path)

    else:
        print("Unsupported file format")
        return ""