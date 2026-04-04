from fastapi import APIRouter, UploadFile, File
from typing import List
from typing import Annotated
from pydantic import BaseModel

from app.utils.file_handler import save_file
from app.services.parser import extract_text_from_pdf
from app.services.embedding import get_embedding
from app.utils.similarity import cosine_similarity
from app.services.experience import extract_experience
from app.utils.skill_extractor import extract_skills
from app.utils.scoring import calculate_final_score 
from app.utils.summary_generator import generate_summary
from app.services.parser import extract_text

router = APIRouter()

# temporary in-memory storage (we improve later)
DATABASE = []

JD_DATA = {}

from datetime import datetime

BATCHES = {}

@router.post("/upload-resumes")
async def upload_resumes(
    uploaded_files: List[UploadFile] = File(...)
):
    results = []

    # create batch id
    batch_id = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    BATCHES[batch_id] = []

    for file in uploaded_files:
        try:
            filename = file.filename

            # Duplicate check
            existing_files = [r["filename"] for r in DATABASE]
            if filename in existing_files:
                raise ValueError("Duplicate file already uploaded")

            # Save file
            file_path = save_file(file)

            # File type validation
            if not filename.endswith((".pdf", ".docx", ".jpg", ".jpeg", ".png")):
                raise ValueError("Unsupported file type")

            # Extract text
            text = extract_text(file_path)

            if not text or text.strip() == "":
                raise ValueError("Empty or unreadable file")

            # Processing
            embedding = get_embedding(text)
            experience = extract_experience(text)
            skills = extract_skills(text)

            candidate_data = {
                "filename": filename,
                "text": text,
                "embedding": embedding.tolist(),
                "experience": experience,
                "skills": skills
            }

            # Store in main DB
            DATABASE.append(candidate_data)

            # Store in batch
            BATCHES[batch_id].append(candidate_data)

            results.append({
                "filename": filename,
                "status": "processed"
            })

        except Exception as e:
            results.append({
                "filename": file.filename,
                "status": "failed",
                "error": str(e)
            })

    return {
        "message": "Resumes processed successfully",
        "batch_id": batch_id,
        "files": results
    }

class JDRequest(BaseModel):
    jd: str

@router.post("/upload-jd")
async def upload_jd(request: JDRequest):
    jd = request.jd

    embedding = get_embedding(jd)

    jd_skills = extract_skills(jd)

    JD_DATA["text"] = jd
    JD_DATA["embedding"] = embedding.tolist()
    JD_DATA["skills"] = jd_skills

    return {
        "message": "Job Description processed successfully",
        "extracted_skills": jd_skills
    }



@router.get("/rank-candidates")
def rank_candidates():
    if "embedding" not in JD_DATA:
        return {"error": "Upload JD first"}

    jd_embedding = JD_DATA["embedding"]

    ranked = []

    for candidate in DATABASE:
        #score = cosine_similarity(candidate["embedding"], jd_embedding)

        score = calculate_final_score(candidate, JD_DATA)
        summary = generate_summary(candidate, JD_DATA)

        ranked.append({
            "filename": candidate["filename"],
            "score": score,
            "skills": candidate["skills"],
            "experience": candidate["experience"],
            "summary": summary  
        })

    # sort descending
    ranked = sorted(ranked, key=lambda x: x["score"], reverse=True)

    for i, candidate in enumerate(ranked):
        if i < 5:
            candidate["summary"] = generate_summary(candidate)
        else:
            candidate["summary"] = ""

    return {
        "ranked_candidates": ranked
    }