import re
from typing import Dict, Any, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class CriticalFactNormalizer:
    """Normalizes and validates critical facts with confidence scoring"""
    
    def __init__(self):
        # Number word mappings
        self.number_words = {
            'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
            'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
            'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13,
            'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17,
            'eighteen': 18, 'nineteen': 19, 'twenty': 20, 'thirty': 30,
            'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70,
            'eighty': 80, 'ninety': 90, 'hundred': 100,
            # Tamil
            'onnu': 1, 'rendu': 2, 'moonu': 3, 'naalu': 4, 'anju': 5,
            'aaru': 6, 'ezhu': 7, 'ettu': 8, 'onbathu': 9, 'pathu': 10,
            'irupadhu': 20, 'muppadhu': 30, 'naarpadhu': 40,
            # Hindi
            'ek': 1, 'do': 2, 'teen': 3, 'chaar': 4, 'paanch': 5,
            'chhe': 6, 'saat': 7, 'aath': 8, 'nau': 9, 'das': 10,
            'bees': 20, 'tees': 30, 'chalees': 40, 'pachaas': 50
        }
        
        # Experience patterns
        self.experience_patterns = [
            (r'(\d+)\s*(?:years?|yrs?|saal|varusham|varudam|varsh)', self._parse_years),
            (r'(?:about|around|approximately|lagbhag|suthi)\s*(\d+)\s*(?:years?|saal|varusham)', self._parse_years),
            (r'(\d+)\s*(?:plus|\+)\s*(?:years?|saal)', self._parse_plus_years),
            (r'([a-z]+)\s*(?:years?|saal|varusham)', self._parse_number_words),
        ]
        
        # Location patterns
        self.location_patterns = [
            r'(?:in|at|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'([A-Z][a-z]+)\s*(?:city|town|village|district)',
        ]
        
        # Compensation patterns
        self.compensation_patterns = [
            (r'(?:Rs\.?|INR|₹)\s*(\d[\d,]*\d|\d)', self._parse_amount),
            (r'(\d+)\s*(?:lakh|lakhs|lac|lacs)', self._parse_lakhs),
            (r'(\d+)\s*(?:thousand|hazar)', self._parse_thousands),
        ]
    
    def normalize_fact(
        self,
        field: str,
        value: Any,
        transcript: str,
        asr_confidence: float
    ) -> Dict[str, Any]:
        """Normalize a critical fact with confidence scoring"""
        
        result = {
            "field": field,
            "original_value": value,
            "normalized_value": value,
            "confidence": asr_confidence,
            "requires_confirmation": False,
            "normalization_applied": False
        }
        
        # Apply field-specific normalization
        if "experience_years" in field:
            result = self._normalize_experience(value, transcript, asr_confidence, result)
        elif "compensation" in field:
            result = self._normalize_compensation(value, transcript, asr_confidence, result)
        elif "location" in field:
            result = self._normalize_location(value, transcript, asr_confidence, result)
        
        # Set confirmation flag
        if result["confidence"] < 0.85:
            result["requires_confirmation"] = True
        
        return result
    
    def _normalize_experience(
        self,
        value: Any,
        transcript: str,
        asr_confidence: float,
        result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Normalize experience value"""
        
        # Try to parse from transcript if value is None
        if value is None:
            for pattern, parser in self.experience_patterns:
                match = re.search(pattern, transcript.lower())
                if match:
                    parsed_value = parser(match)
                    if parsed_value is not None:
                        result["normalized_value"] = parsed_value
                        result["normalization_applied"] = True
                        # Penalize confidence for normalization
                        result["confidence"] *= 0.9
                    break
        
        # Validate range
        if result["normalized_value"] is not None:
            years = float(result["normalized_value"])
            if years < 0 or years > 80:
                result["normalized_value"] = None
                result["confidence"] *= 0.5
                result["requires_confirmation"] = True
        
        return result
    
    def _normalize_compensation(
        self,
        value: Any,
        transcript: str,
        asr_confidence: float,
        result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Normalize compensation value"""
        
        if value is None:
            for pattern, parser in self.compensation_patterns:
                match = re.search(pattern, transcript.lower())
                if match:
                    parsed_value = parser(match)
                    if parsed_value is not None:
                        result["normalized_value"] = parsed_value
                        result["normalization_applied"] = True
                        result["confidence"] *= 0.85
                    break
        
        return result
    
    def _normalize_location(
        self,
        value: Any,
        transcript: str,
        asr_confidence: float,
        result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Normalize location value"""
        
        if value is None:
            for pattern in self.location_patterns:
                match = re.search(pattern, transcript)
                if match:
                    result["normalized_value"] = match.group(1)
                    result["normalization_applied"] = True
                    result["confidence"] *= 0.9
                    break
        
        return result
    
    def _parse_years(self, match) -> Optional[int]:
        """Parse years from match"""
        try:
            return int(match.group(1))
        except (ValueError, IndexError):
            return None
    
    def _parse_plus_years(self, match) -> Optional[int]:
        """Parse 'X plus years' pattern"""
        try:
            return int(match.group(1)) + 5  # Approximate
        except (ValueError, IndexError):
            return None
    
    def _parse_number_words(self, match) -> Optional[int]:
        """Parse number words"""
        try:
            word = match.group(1).lower()
            return self.number_words.get(word)
        except (ValueError, IndexError):
            return None
    
    def _parse_amount(self, match) -> Optional[float]:
        """Parse amount"""
        try:
            value = match.group(1).replace(',', '')
            return float(value)
        except (ValueError, IndexError):
            return None
    
    def _parse_lakhs(self, match) -> Optional[float]:
        """Parse lakhs"""
        try:
            return float(match.group(1)) * 100000
        except (ValueError, IndexError):
            return None
    
    def _parse_thousands(self, match) -> Optional[float]:
        """Parse thousands"""
        try:
            return float(match.group(1)) * 1000
        except (ValueError, IndexError):
            return None
