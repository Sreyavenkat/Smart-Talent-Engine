import re

# basic skill dictionary (we can expand later)
SKILLS_DB = [
    "python", "java", "machine learning", "deep learning",
    "nlp", "flask", "django", "fastapi",
    "react", "javascript", "html", "css",
    "sql", "mongodb", "pandas", "numpy",
    "tensorflow", "pytorch", "api", "rest"
]

def extract_skills(text: str):
    text = text.lower()
    found_skills = []

    for skill in SKILLS_DB:
        if re.search(r"\b" + re.escape(skill) + r"\b", text):
            found_skills.append(skill)

    return list(set(found_skills))