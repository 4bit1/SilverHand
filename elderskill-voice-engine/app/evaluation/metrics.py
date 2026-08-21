from typing import List, Dict, Any
import numpy as np
from jiwer import wer, cer
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

class ASRMetrics:
    @staticmethod
    def calculate_wer(reference: str, hypothesis: str) -> float:
        """Calculate Word Error Rate"""
        return wer(reference, hypothesis)
    
    @staticmethod
    def calculate_cer(reference: str, hypothesis: str) -> float:
        """Calculate Character Error Rate"""
        return cer(reference, hypothesis)
    
    @staticmethod
    def calculate_number_accuracy(reference: str, hypothesis: str) -> float:
        """Calculate accuracy of numbers"""
        import re
        
        ref_numbers = set(re.findall(r'\d+', reference))
        hyp_numbers = set(re.findall(r'\d+', hypothesis))
        
        if not ref_numbers:
            return 1.0
        
        correct = len(ref_numbers & hyp_numbers)
        return correct / len(ref_numbers)
    
    @staticmethod
    def calculate_skill_name_accuracy(
        reference_skills: List[str],
        hypothesis_skills: List[str]
    ) -> float:
        """Calculate skill name accuracy"""
        if not reference_skills:
            return 1.0
        
        ref_set = set(s.lower() for s in reference_skills)
        hyp_set = set(s.lower() for s in hypothesis_skills)
        
        correct = len(ref_set & hyp_set)
        return correct / len(ref_set)

class ProfileExtractionMetrics:
    @staticmethod
    def calculate_precision(
        ground_truth: Dict[str, Any],
        predicted: Dict[str, Any]
    ) -> float:
        """Calculate precision of profile extraction"""
        gt_fields = set(ground_truth.keys())
        pred_fields = set(predicted.keys())
        
        if not pred_fields:
            return 0.0
        
        correct = len(gt_fields & pred_fields)
        return correct / len(pred_fields)
    
    @staticmethod
    def calculate_recall(
        ground_truth: Dict[str, Any],
        predicted: Dict[str, Any]
    ) -> float:
        """Calculate recall of profile extraction"""
        gt_fields = set(ground_truth.keys())
        pred_fields = set(predicted.keys())
        
        if not gt_fields:
            return 0.0
        
        correct = len(gt_fields & pred_fields)
        return correct / len(gt_fields)
    
    @staticmethod
    def calculate_f1(precision: float, recall: float) -> float:
        """Calculate F1 score"""
        if precision + recall == 0:
            return 0.0
        return 2 * (precision * recall) / (precision + recall)
    
    @staticmethod
    def calculate_hallucination_rate(
        ground_truth: Dict[str, Any],
        predicted: Dict[str, Any]
    ) -> float:
        """Calculate hallucination rate (false facts)"""
        gt_fields = set(ground_truth.keys())
        pred_fields = set(predicted.keys())
        
        hallucinations = pred_fields - gt_fields
        
        return len(hallucinations) / len(pred_fields) if pred_fields else 0.0

class ConversationMetrics:
    @staticmethod
    def calculate_question_relevance(
        questions: List[str],
        answered_fields: List[str]
    ) -> float:
        """Calculate question relevance score"""
        if not questions:
            return 0.0
        
        relevant_count = 0
        for question in questions:
            # Check if question relates to unanswered fields
            for field in answered_fields:
                if field.lower() in question.lower():
                    relevant_count += 1
                    break
        
        return relevant_count / len(questions)
    
    @staticmethod
    def calculate_repetition_rate(
        questions: List[str]
    ) -> float:
        """Calculate question repetition rate"""
        if len(questions) <= 1:
            return 0.0
        
        # Check for semantic similarity
        repetitions = 0
        for i in range(len(questions)):
            for j in range(i + 1, len(questions)):
                similarity = ConversationMetrics.text_similarity(
                    questions[i],
                    questions[j]
                )
                if similarity > 0.8:
                    repetitions += 1
        
        return repetitions / (len(questions) * (len(questions) - 1) / 2)
    
    @staticmethod
    def text_similarity(text1: str, text2: str) -> float:
        """Calculate simple text similarity"""
        from difflib import SequenceMatcher
        return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()

class CriticalFactMetrics:
    @staticmethod
    def calculate_false_fact_rate(
        ground_truth: List[Dict[str, Any]],
        predicted: List[Dict[str, Any]]
    ) -> float:
        """Calculate false profile fact rate"""
        if not predicted:
            return 0.0
        
        false_facts = 0
        for pred_fact in predicted:
            is_correct = False
            for gt_fact in ground_truth:
                if (
                    pred_fact["field"] == gt_fact["field"] and
                    pred_fact["value"] == gt_fact["value"]
                ):
                    is_correct = True
                    break
            
            if not is_correct:
                false_facts += 1
        
        return false_facts / len(predicted)
