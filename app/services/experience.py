import re

def extract_experience(text: str) -> float:
    """
    Extracts years of experience from resume text.
    Returns max years found.
    """

    pattern = r'(\d+)\+?\s*(years|year)'
    matches = re.findall(pattern, text.lower())

    if not matches:
        return 0

    years = [int(match[0]) for match in matches]
    return max(years)