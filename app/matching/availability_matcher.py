import re
from typing import Tuple, List, Set
from app.models.matching import CustomerRequest
from app.models.profile import UserProfile, Availability

DAY_ALIASES = {
    "mon": "monday", "monday": "monday",
    "tue": "tuesday", "tues": "tuesday", "tuesday": "tuesday",
    "wed": "wednesday", "wednesday": "wednesday",
    "thu": "thursday", "thur": "thursday", "thurs": "thursday", "thursday": "thursday",
    "fri": "friday", "friday": "friday",
    "sat": "saturday", "saturday": "saturday",
    "sun": "sunday", "sunday": "sunday",
    "weekend": "weekend", "weekends": "weekend",
    "weekday": "weekday", "weekdays": "weekday"
}

TIME_SLOT_BUCKETS = {
    "morning": {"morning", "am", "10 am", "11 am", "9 am", "8 am", "7 am", "10:00", "11:00", "09:00", "08:00", "10 am–12 pm", "10 am-12 pm", "10:00-12:00", "10-12"},
    "afternoon": {"afternoon", "pm", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm", "12:00", "13:00", "14:00", "15:00", "16:00", "12-4", "12-2"},
    "evening": {"evening", "5 pm", "6 pm", "7 pm", "8 pm", "17:00", "18:00", "19:00", "20:00", "night", "5-8", "6-8"}
}

def extract_days_from_text(text: str) -> Set[str]:
    """Extract mentioned days of the week from text"""
    if not text:
        return set()
    found = set()
    t = text.lower()
    for word in re.findall(r'\b[a-zA-Z]+\b', t):
        if word in DAY_ALIASES:
            canonical = DAY_ALIASES[word]
            if canonical == "weekend":
                found.update({"saturday", "sunday"})
            elif canonical == "weekday":
                found.update({"monday", "tuesday", "wednesday", "thursday", "friday"})
            else:
                found.add(canonical)
    return found

def normalize_time_slot_string(text: str) -> Set[str]:
    """
    Extracts and normalizes time slot tokens from a string.
    Examples:
    '10:00-12:00' -> {'10-12', 'morning'}
    '10 AM - 12 PM' -> {'10-12', 'morning'}
    'morning' -> {'morning'}
    """
    if not text:
        return set()
    found = set()
    t = text.lower().strip()
    
    # 1. Check bucket terms
    for bucket, keywords in TIME_SLOT_BUCKETS.items():
        for kw in keywords:
            if kw in t:
                found.add(bucket)
                break
                
    # 2. Extract numeric hours interval e.g. 10:00-12:00 or 10am-12pm or 10-12
    m = re.search(r'(\d{1,2})(?::\d{2})?\s*(?:am|pm)?\s*(?:to|-|–)\s*(\d{1,2})(?::\d{2})?\s*(?:am|pm)?', t)
    if m:
        h1, h2 = int(m.group(1)), int(m.group(2))
        found.add(f"{h1}-{h2}")
        if (h1 >= 6 and h2 <= 13) or "am" in t or "morning" in t:
            found.add("morning")
        elif (h1 >= 12 and h2 <= 17) or "afternoon" in t:
            found.add("afternoon")
        elif h1 >= 16 or "evening" in t:
            found.add("evening")
            
    return found

def extract_time_slots_from_text(text: str) -> Set[str]:
    return normalize_time_slot_string(text)

def match_availability(request: CustomerRequest, candidate: UserProfile) -> Tuple[float, str]:
    """
    Computes availability alignment score between customer's requested schedule
    and the provider's specific availability window.
    
    Target user suitability:
    - Homemakers with specific free windows (e.g. 10 AM - 1 PM)
    - Retired professionals and seniors with weekend or morning availability
    - Part-time and flexible workers
    
    Returns:
        (score: float in [0.0, 1.0], explanation: str)
    """
    cand_avail = candidate.availability or Availability()

    # If provider is completely flexible, assign high default
    if cand_avail.flexible:
        return 0.95, "Provider has full flexible schedule availability (0.95)."

    # 1. Determine requested days
    req_days = set()
    for d in request.preferred_days:
        d_clean = d.strip().lower()
        if d_clean in DAY_ALIASES:
            canon = DAY_ALIASES[d_clean]
            if canon == "weekend":
                req_days.update({"saturday", "sunday"})
            elif canon == "weekday":
                req_days.update({"monday", "tuesday", "wednesday", "thursday", "friday"})
            else:
                req_days.add(canon)
        else:
            req_days.add(d_clean)

    if not req_days and request.raw_text:
        req_days = extract_days_from_text(request.raw_text)

    # 2. Determine provider days
    cand_days = set()
    for d in cand_avail.specific_days:
        d_clean = d.strip().lower()
        if d_clean in DAY_ALIASES:
            canon = DAY_ALIASES[d_clean]
            if canon == "weekend":
                cand_days.update({"saturday", "sunday"})
            elif canon == "weekday":
                cand_days.update({"monday", "tuesday", "wednesday", "thursday", "friday"})
            else:
                cand_days.add(canon)
        else:
            cand_days.add(d_clean)

    # 3. Determine time slots
    req_slots: Set[str] = set()
    for s in request.preferred_time_slots:
        req_slots.update(normalize_time_slot_string(s))
    if not req_slots and request.raw_text:
        req_slots = normalize_time_slot_string(request.raw_text)

    cand_slot_text = (cand_avail.specific_hours or "").lower()
    cand_slots = normalize_time_slot_string(cand_slot_text)

    # If customer did not specify any days or times
    if not req_days and not req_slots:
        return 0.85, "No specific day/time constraints requested (0.85)."

    # Compute Day Match
    day_score = 1.0
    if req_days:
        if cand_days:
            overlap = req_days.intersection(cand_days)
            day_score = len(overlap) / len(req_days)
        elif cand_avail.part_time or cand_avail.full_time:
            day_score = 0.75 # Has general part-time/full-time availability
        else:
            day_score = 0.40 # No days specified by provider

    # Compute Time Slot Match
    time_score = 1.0
    if req_slots:
        if cand_slots:
            slot_overlap = req_slots.intersection(cand_slots)
            if slot_overlap:
                time_score = 1.0
            else:
                time_score = 0.20
        elif cand_slot_text:
            if any(slot in cand_slot_text for slot in req_slots):
                time_score = 0.90
            else:
                time_score = 0.50
        elif cand_avail.flexible or cand_avail.part_time:
            time_score = 0.80
        else:
            time_score = 0.50

    # Combined availability score (70% days match + 30% hours/slots match)
    final_avail_score = (0.70 * day_score) + (0.30 * time_score)
    final_avail_score = round(max(0.0, min(1.0, final_avail_score)), 4)

    explanation = f"Availability score: {final_avail_score:.2f} (Days match: {day_score:.2f}, Slots match: {time_score:.2f})."
    return final_avail_score, explanation
