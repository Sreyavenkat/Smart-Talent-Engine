import pdfplumber
from docx import Document
import pytesseract
from PIL import Image
import os
import fitz  # PyMuPDF


# PDF extraction 
def extract_text_from_pdf(file_path: str) -> str:
    try:
        # Try PyMuPDF first
        doc = fitz.open(file_path)
        text = ""

        for page in doc:
            blocks = page.get_text("blocks")
            blocks = sorted(blocks, key=lambda b: (b[1], b[0]))

            for block in blocks:
                block_text = block[4].strip()
                if block_text:
                    text += " ".join(block_text.split()) + "\n"

        return text

    except Exception as e:
        print("PyMuPDF failed, falling back to pdfplumber...")

        text = ""
        try:
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as e:
            print(f"Fallback also failed: {e}")

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