from fastapi import APIRouter, UploadFile, File
from typing import List

from app.utils.file_handler import save_file
from app.services.parser import extract_text_from_pdf
from app.services.embedding import get_embedding

router = APIRouter()

# temporary in-memory storage (we improve later)
DATABASE = []

@router.post("/upload-resumes")
async def upload_resumes(files: List[UploadFile] = File(...)):
    results = []

    for file in files:
        # 1. Save file
        file_path = save_file(file)

        # 2. Extract text
        text = extract_text_from_pdf(file_path)

        # 3. Generate embedding
        embedding = get_embedding(text)

        # 4. Store
        candidate_data = {
            "filename": file.filename,
            "text": text,
            "embedding": embedding.tolist()  # convert numpy → list
        }

        DATABASE.append(candidate_data)

        results.append({
            "filename": file.filename,
            "status": "processed"
        })

    return {
        "message": "Resumes processed successfully",
        "files": results
    }