from fastapi import FastAPI
from app.routes import upload
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Talent Engine")

# include routes
app.include_router(upload.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for dev)
    allow_credentials=True,
    allow_methods=["*"],  # allow POST, GET, OPTIONS
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Smart Talent Engine Running 🚀"}