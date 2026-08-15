import re
from typing import List, Tuple, Dict, Any, Optional
from app.models.matching import CustomerRequest
from app.models.profile import UserProfile, Skill

# Common synonyms and domain taxonomies for elderly skills and homemakers
SYNONYM_CLUSTERS = [
    {"carnatic music", "carnatic", "classical music", "indian classical vocal", "music teacher", "vocal music", "singing"},
    {"hindustani music", "hindustani", "classical music", "vocal music", "singing"},
    {"maths", "math", "mathematics", "vedic maths", "algebra", "geometry", "arithmetic"},
    {"science", "physics", "chemistry", "biology"},
    {"tailoring", "stitching", "sewing", "garment making", "dress designing", "cutting and stitching"},
    {"embroidery", "hand embroidery", "zari work", "crochet", "knitting", "needlework", "aari work"},
    {"cooking", "baking", "catering", "culinary", "traditional cooking", "meal prep", "chef"},
    {"tutoring", "teaching", "tuition", "home tutor", "mentor", "coaching", "educator"},
    {"yoga", "meditation", "pranayama", "wellness", "fitness"},
    {"software development", "programming", "python", "web development", "coding", "software engineer"},
    {"gardening", "organic farming", "horticulture", "plant care"},
    {"storytelling", "slokas", "sanskrit", "mythology", "vedic chanting"},
    {"crafts", "origami", "pottery", "handicrafts", "art and craft", "painting", "drawing"},
    {"caregiving", "elder care", "patient care", "companion", "babysitting", "child care"}
]

STOP_WORDS = {
    "i", "need", "want", "someone", "to", "for", "my", "a", "an", "the", "in", "at", 
    "is", "and", "or", "with", "please", "looking", "help", "find", "good", "best", "experienced"
}

def extract_skills_from_text(text: str) -> List[str]:
    """
    NLP extraction to identify key skill keywords and domain terms from natural language.
    """
    if not text:
        return []
    
    clean_text = text.lower()
    extracted = []

    # Check against known multi-word skill synonyms first
    for cluster in SYNONYM_CLUSTERS:
        for term in sorted(cluster, key=len, reverse=True):
            pattern = r'\b' + re.escape(term) + r'\b'
            if re.search(pattern, clean_text):
                extracted.append(term)
                break
    
    # If no clusters matched, fallback to noun tokens (excluding stopwords)
    if not extracted:
        tokens = re.findall(r'\b[a-zA-Z]{3,}\b', clean_text)
        meaningful = [t for t in tokens if t not in STOP_WORDS]
        if meaningful:
            extracted.extend(meaningful[:3])
            
    return list(dict.fromkeys(extracted))

def calculate_token_similarity(req_term: str, cand_term: str) -> float:
    """
    Calculates semantic & token similarity between requested skill and candidate skill.
    """
    r = req_term.strip().lower()
    c = cand_term.strip().lower()

    if r == c:
        return 1.0
    
    # Check synonym cluster membership
    for cluster in SYNONYM_CLUSTERS:
        if r in cluster and c in cluster:
            return 0.95
        # Partial containment within cluster
        if any(r in term or term in r for term in cluster) and any(c in term or term in c for term in cluster):
            return 0.90

    # Substring containment
    if r in c or c in r:
        return 0.85
    
    # Word token Jaccard overlap
    r_words = set(re.findall(r'\w+', r))
    c_words = set(re.findall(r'\w+', c))
    if r_words and c_words:
        intersection = r_words.intersection(c_words)
        union = r_words.union(c_words)
        jaccard = len(intersection) / len(union)
        if jaccard > 0:
            return 0.5 + (0.5 * jaccard)

    return 0.0

def match_skill(request: CustomerRequest, candidate: UserProfile) -> Tuple[float, str]:
    """
    Matches customer's skill requirement against provider's skills, specializations, 
    capabilities, description, and teaching experience.
    
    Returns:
        (score: float in [0.0, 1.0], explanation: str)
    """
    required_skills = list(request.required_skills)
    
    # If no structured skills provided, extract from raw natural language text
    if not required_skills and request.raw_text:
        required_skills = extract_skills_from_text(request.raw_text)
    
    if not required_skills:
        # Default neutral baseline if customer has not specified any skill
        return 0.5, "No specific skill requirement specified."

    if not candidate.skills and not candidate.teaching_experience and not candidate.work_examples:
        return 0.0, "Provider has no recorded skills or experience."

    # Check if request involves teaching/tutoring
    requires_teaching = False
    req_text_combined = " ".join(required_skills + ([request.raw_text] if request.raw_text else [])).lower()
    if any(k in req_text_combined for k in ["teach", "tutor", "tuition", "classes", "learn", "mentor", "trainer"]):
        requires_teaching = True

    best_skill_matches = []
    
    for req_skill in required_skills:
        req_best = 0.0
        matched_details = []

        # 1. Compare against candidate's primary skills
        for skill in candidate.skills:
            # Skill name
            sim = calculate_token_similarity(req_skill, skill.name)
            if sim > req_best:
                req_best = sim
                matched_details.append(f"Skill '{skill.name}' (sim: {sim:.2f})")
            
            # Specializations
            for spec in skill.specializations:
                sim_spec = calculate_token_similarity(req_skill, spec) * 0.95
                if sim_spec > req_best:
                    req_best = sim_spec
                    matched_details.append(f"Specialization '{spec}'")

            # Capabilities
            for cap in skill.capabilities:
                sim_cap = calculate_token_similarity(req_skill, cap) * 0.90
                if sim_cap > req_best:
                    req_best = sim_cap
                    matched_details.append(f"Capability '{cap}'")

        # 2. Check work examples & descriptions
        for work in candidate.work_examples:
            sim_work = calculate_token_similarity(req_skill, work.description) * 0.80
            if sim_work > req_best:
                req_best = sim_work

        # 3. Check teaching experience if teaching is relevant
        if requires_teaching and candidate.teaching_experience:
            for teach in candidate.teaching_experience:
                sim_teach = calculate_token_similarity(req_skill, teach.description) * 0.90
                if sim_teach > req_best:
                    req_best = min(1.0, sim_teach + 0.1)

        best_skill_matches.append(req_best)

    # Average score across all required skills
    avg_score = sum(best_skill_matches) / len(best_skill_matches) if best_skill_matches else 0.0
    
    # Teaching bonus if requested and verified
    if requires_teaching:
        if candidate.teaching_experience or any("teaching" in s.name.lower() or "tutor" in s.name.lower() for s in candidate.skills):
            avg_score = min(1.0, avg_score * 1.1 + 0.05)

    avg_score = round(max(0.0, min(1.0, avg_score)), 4)
    explanation = f"Matched skills with score {avg_score:.2f} based on keywords {required_skills}."
    
    return avg_score, explanation
