# Smart Talent Selection Engine

## The Problem

Recruiters often receive large volumes of resumes in different formats and layouts, making it difficult to quickly identify the most suitable candidates. Traditional keyword-based filtering fails to capture the true relevance of a candidate’s profile, especially when resumes contain non-linear structures such as columns and tables.

## The Solution

Smart Talent Engine is an AI-powered resume screening system that allows recruiters to upload resumes in multiple formats (PDF, DOCX, images) and rank candidates based on their compatibility with a given job description. The system uses semantic embeddings, skill extraction, and experience weighting to generate a meaningful compatibility score.

To handle non-linear resume layouts, the system uses layout-aware parsing for PDF files, which helps preserve the reading order in two-column resumes and table-like content without merging unrelated text. For DOCX and image-based resumes, standard text extraction and OCR are used, which may not fully retain complex layouts but still enable effective information extraction.

## Tech Stack

### Programming Languages

* Python
* JavaScript

### Frameworks & Libraries

* FastAPI (Backend API)
* React (Frontend)
* Vite (Frontend tooling)
* React Router DOM (Routing)

### Machine Learning / NLP

* NumPy
* Scikit-learn (Cosine similarity)

### Resume Parsing

* PyMuPDF (Layout-aware PDF parsing)
* pdfplumber (Fallback PDF parsing)
* python-docx (DOCX parsing)
* pytesseract (OCR for images)
* Pillow (Image processing)

### Other Tools

* Tesseract OCR (system dependency)

## Setup Instructions

### 1. Clone the Repository

```bash id="xj6l4o"
git clone <your-repo-link>
cd Smart-Talent-Engine
```

---

### 2. Backend Setup (Python)

#### Create and activate virtual environment

```bash id="3qk4ru"
python3 -m venv venv
source venv/bin/activate
```

#### Install dependencies manually

```bash id="svjbgw"
pip install fastapi uvicorn python-multipart numpy scikit-learn pdfplumber pymupdf python-docx pytesseract Pillow
```

#### Install Tesseract OCR (Linux)

```bash id="n36v0q"
sudo apt install tesseract-ocr
```

#### Run backend server

```bash id="x1b3y7"
uvicorn app.main:app --reload
```

---

### 3. Frontend Setup (React)

```bash id="u6j3lx"
cd frontend
npm install
npm run dev
```

---

### 4. Access the Application

* Frontend: http://localhost:5173
* Backend API: http://127.0.0.1:8000

---

### 5. Usage Flow

1. Upload resumes (PDF/DOCX/Image)
2. Enter Job Description
3. View ranked candidates with:

   * Compatibility score
   * Extracted skills
   * Experience
   * AI-generated summary


### Important Notes
### Ensure Python 3.10 or above is installed

### Tesseract OCR must be installed separately for image-based resume parsing:
### sudo apt install tesseract-ocr

### If any dependency issues occur, install packages individually as listed above instead of using a single command   
