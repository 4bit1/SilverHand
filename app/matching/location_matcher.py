import re
from typing import Tuple, Optional
from app.models.matching import CustomerRequest
from app.models.profile import UserProfile, Location

KNOWN_INDIAN_CITIES = {
    "chennai", "bengaluru", "bangalore", "mumbai", "delhi", "hyderabad", 
    "kolkata", "pune", "ahmedabad", "jaipur", "coimbatore", "madurai",
    "kochi", "trivandrum", "mysore", "chandigarh", "lucknow", "surat"
}

# Mapping of cities to state for proximity checks
CITY_STATE_MAP = {
    "chennai": "tamil nadu", "coimbatore": "tamil nadu", "madurai": "tamil nadu", "trichy": "tamil nadu", "salem": "tamil nadu",
    "bangalore": "karnataka", "bengaluru": "karnataka", "mysore": "karnataka", "hubli": "karnataka", "mangalore": "karnataka",
    "mumbai": "maharashtra", "pune": "maharashtra", "nagpur": "maharashtra", "nashik": "maharashtra",
    "hyderabad": "telangana", "warangal": "telangana",
    "delhi": "delhi", "noida": "uttar pradesh", "gurgaon": "haryana",
    "kolkata": "west bengal", "kochi": "kerala", "trivandrum": "kerala"
}

def extract_location_from_text(text: str) -> Optional[str]:
    """Extract known cities or localities from free-text string"""
    if not text:
        return None
    t = text.lower()
    for city in KNOWN_INDIAN_CITIES:
        if re.search(r'\b' + re.escape(city) + r'\b', t):
            return city
    # Common localities
    localities = ["mylapore", "t nagar", "t. nagar", "anna nagar", "adyaar", "adyar", "velachery", "indiranagar", "koramangala", "whitefield", "jayanagar", "bandra", "andheri"]
    for loc in localities:
        if re.search(r'\b' + re.escape(loc) + r'\b', t):
            return loc
    return None

def match_location(request: CustomerRequest, candidate: UserProfile) -> Tuple[float, str]:
    """
    Evaluates geographic match between customer requirement and provider.
    
    Grading Scale:
    - Remote service requested/accepted: 1.0
    - Same locality / sub-area: 1.0
    - Same city: 0.8
    - Nearby city / same state: 0.5
    - Far away / different state: 0.2
    
    Returns:
        (score: float in [0.0, 1.0], explanation: str)
    """
    # 1. Check for remote work
    is_remote_request = request.is_remote
    if not is_remote_request and request.raw_text:
        if any(w in request.raw_text.lower() for w in ["remote", "online", "zoom", "google meet", "video call", "work from home", "virtual"]):
            is_remote_request = True
            
    if is_remote_request:
        # Remote work neutralizes geographic distance constraints
        return 1.0, "Remote service: geographic distance has no restriction (1.0)."

    # Extract location parameters from customer request
    req_city = (request.location.city or "").strip().lower() if request.location else ""
    req_locality = (request.locality or "").strip().lower()
    req_state = (request.location.state or "").strip().lower() if request.location else ""
    req_pincode = (request.location.pincode or "").strip() if request.location else ""

    # Fallback to extracting from raw_text if not set
    if not req_city and not req_locality and request.raw_text:
        extracted = extract_location_from_text(request.raw_text)
        if extracted:
            req_city = extracted

    # Extract location parameters from candidate profile
    cand_city = (candidate.location.city or "").strip().lower() if candidate.location else ""
    cand_state = (candidate.location.state or "").strip().lower() if candidate.location else ""
    cand_district = (candidate.location.district or "").strip().lower() if candidate.location else ""
    cand_pincode = (candidate.location.pincode or "").strip() if candidate.location else ""

    # If neither customer nor provider specified location
    if not req_city and not req_state and not req_locality:
        return 0.7, "No specific location constraint specified in request (0.7)."

    if not cand_city and not cand_state:
        return 0.3, "Provider location details incomplete (0.3)."

    # Normalize city names (e.g. bengaluru == bangalore)
    if req_city in ["bengaluru", "bangalore"]:
        req_city = "bangalore"
    if cand_city in ["bengaluru", "bangalore"]:
        cand_city = "bangalore"

    # Infer states if missing
    if not req_state and req_city in CITY_STATE_MAP:
        req_state = CITY_STATE_MAP[req_city]
    if not cand_state and cand_city in CITY_STATE_MAP:
        cand_state = CITY_STATE_MAP[cand_city]

    # Check same pincode or same locality
    if (req_pincode and cand_pincode and req_pincode == cand_pincode) or \
       (req_locality and (req_locality in cand_district or req_locality in cand_city or req_locality in (candidate.profile_description or "").lower())):
        return 1.0, f"Same locality/area match (1.0)."

    # Check same city
    if req_city and cand_city and req_city == cand_city:
        return 0.8, f"Same city match ({req_city.title()}) (0.8)."

    # Check same state or nearby city in same region
    if (req_state and cand_state and req_state == cand_state) or \
       (cand_district and req_city and req_city in cand_district):
        return 0.5, f"Nearby city / same state ({cand_state.title() if cand_state else 'Region'}) (0.5)."

    # Different state / Far away
    return 0.2, f"Different city/state (Req: {req_city.title() or 'Other'}, Prov: {cand_city.title() or 'Other'}) (0.2)."
