from fastapi import FastAPI
from app.routes import upload

app = FastAPI(title="Smart Talent Engine")

# include routes
app.include_router(upload.router)

@app.get("/")
def home():
    return {"message": "Smart Talent Engine Running 🚀"}