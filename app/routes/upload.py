from fastapi import APIRouter, UploadFile, File
from typing import List
from typing import Annotated
from pydantic import BaseModel

from app.utils.file_handler import save_file
from app.services.parser import extract_text_from_pdf
from app.services.embedding import get_embedding
from app.utils.similarity import cosine_similarity

router = APIRouter()

# temporary in-memory storage (we improve later)
DATABASE = []

JD_DATA = {}

@router.post("/upload-resumes")
async def upload_resumes(
    uploaded_files: List[UploadFile] = File(...)
):
    results = []

    for file in uploaded_files:
        file_path = save_file(file)
        text = extract_text_from_pdf(file_path)
        embedding = get_embedding(text)

        candidate_data = {
            "filename": file.filename,
            "text": text,
            "embedding": embedding.tolist()
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

class JDRequest(BaseModel):
    jd: str

@router.post("/upload-jd")
async def upload_jd(request: JDRequest):
    jd = request.jd

    embedding = get_embedding(jd)

    JD_DATA["text"] = jd
    JD_DATA["embedding"] = embedding.tolist()

    return {
        "message": "Job Description processed successfully"
    }



@router.get("/rank-candidates")
def rank_candidates():
    if "embedding" not in JD_DATA:
        return {"error": "Upload JD first"}

    jd_embedding = JD_DATA["embedding"]

    ranked = []

    for candidate in DATABASE:
        score = cosine_similarity(candidate["embedding"], jd_embedding)

        ranked.append({
            "filename": candidate["filename"],
            "score": round(float(score) * 100, 2)
        })

    # sort descending
    ranked = sorted(ranked, key=lambda x: x["score"], reverse=True)

    return {
        "ranked_candidates": ranked
    }