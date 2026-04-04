from sklearn.metrics.pairwise import cosine_similarity
import numpy as np



def skill_match_score(candidate_skills, jd_skills):
    if not jd_skills:
        return 0

    match_count = len(set(candidate_skills) & set(jd_skills))
    return match_count / len(jd_skills)



def calculate_final_score(candidate, jd):
    # semantic similarity
    sim = cosine_similarity(
        [candidate["embedding"]],
        [jd["embedding"]]
    )[0][0]

    # skill match
    skill_score = skill_match_score(candidate["skills"], jd["skills"])

    # experience score (normalize roughly)
    exp_score = min(candidate["experience"], 10) / 10     #Experience(yr)   1    2    5    10 
                                                          #Score            0.1  0.2  0.5  1.0  

    # FINAL WEIGHTED SCORE
    final_score = (
        0.6 * sim +
        0.25 * skill_score +
        0.15 * exp_score
    )

    return round(final_score * 100, 2)