import re


# SKILL DATABASE (EXPANDED)


TECH_SKILLS = [
    "python", "java", "c++", "c", "javascript", "typescript",
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn",
    "flask", "django", "fastapi", "spring boot",
    "react", "angular", "vue",
    "html", "css", "bootstrap", "tailwind",
    "sql", "mysql", "postgresql", "mongodb",
    "pandas", "numpy", "matplotlib", "seaborn",
    "api", "rest", "graphql",
    "docker", "kubernetes", "aws", "azure", "gcp",
    "linux", "git", "github", "devops", "supabase", "firebase"
]

SOFT_SKILLS = [
    "communication", "leadership", "teamwork",
    "problem solving", "critical thinking",
    "time management", "adaptability",
    "creativity", "collaboration",
    "decision making", "conflict resolution",
    "interpersonal skills", "negotiation"
]

BUSINESS_SKILLS = [
    "marketing", "digital marketing", "seo", "sem",
    "content marketing", "branding",
    "sales", "lead generation", "crm",
    "business analysis", "project management",
    "product management", "market research",
    "finance", "accounting", "budgeting",
    "data analysis", "strategy"
]

TOOLS = [
    "excel", "powerpoint", "word",
    "tableau", "power bi",
    "photoshop", "illustrator",
    "figma", "canva",
    "jira", "trello", "slack",
    "notion","vs code", "postman"
]

# Combine all known skills
ALL_KNOWN_SKILLS = (
    TECH_SKILLS + SOFT_SKILLS + BUSINESS_SKILLS + TOOLS
)


# EXTRACTION FUNCTION

def extract_skills(text: str):
    text_lower = text.lower()

    tech_found = set()
    soft_found = set()
    business_found = set()
    tools_found = set()
    dynamic_found = set()

    # 1. MATCH FROM DATABASE
   
    for skill in TECH_SKILLS:
        if re.search(r"\b" + re.escape(skill) + r"\b", text_lower):
            tech_found.add(skill)

    for skill in SOFT_SKILLS:
        if re.search(r"\b" + re.escape(skill) + r"\b", text_lower):
            soft_found.add(skill)

    for skill in BUSINESS_SKILLS:
        if re.search(r"\b" + re.escape(skill) + r"\b", text_lower):
            business_found.add(skill)

    for skill in TOOLS:
        if re.search(r"\b" + re.escape(skill) + r"\b", text_lower):
            tools_found.add(skill)

   
    # 2. DYNAMIC EXTRACTION
   
    #words = re.findall(r"\b[A-Za-z\+#\.]+\b", text)

    # for word in words:
    #     word_clean = word.lower()

    #     # Skip very small words
    #     if len(word_clean) < 3:
    #         continue

    #     # Skip if already known
    #     if word_clean in ALL_KNOWN_SKILLS:
    #         continue

    #     # Heuristic: pick words that look like skills/tools
    #     if word[0].isupper() or word.isupper():
    #         dynamic_found.add(word_clean)

    
    # FINAL OUTPUT
    
    all_skills = (
        tech_found |
        soft_found |
        business_found |
        tools_found |
        dynamic_found
    )

    return {
        "technical": list(tech_found),
        "soft": list(soft_found),
        "business": list(business_found),
        "tools": list(tools_found),
        "all_skills": list(all_skills)
    }