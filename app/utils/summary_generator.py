def generate_summary(candidate, jd):
    candidate_skills = set(candidate.get("skills", []))
    jd_skills = set(jd.get("skills", []))

    matched = candidate_skills & jd_skills
    missing = jd_skills - candidate_skills

    experience = candidate.get("experience", 0)

    # Build summary parts
    summary_parts = []

    # Part 1: Strength
    if matched:
        summary_parts.append(
            f"Strong in {', '.join(matched)}"
        )

    # Part 2: Experience
    summary_parts.append(
        f"with {experience} year{'s' if experience != 1 else ''} of experience"
    )

    # Part 3: Gap (optional)
    if missing:
        summary_parts.append(
            f"lacks experience in {', '.join(missing)}"
        )

    return ". ".join(summary_parts).capitalize() + "."