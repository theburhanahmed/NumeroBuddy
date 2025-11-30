"""
Decision Engine services for decision analysis and pattern learning.
"""
from typing import List, Dict, Optional
from datetime import date
from django.utils import timezone
from .models import Decision, DecisionOutcome, DecisionPattern
from ai_chat.services import CoPilotService
from collections import Counter


class DecisionEngineService:
    """Service for decision engine operations."""
    
    def __init__(self):
        self.co_pilot = CoPilotService()
    
    def analyze_decision(self, user, decision_text: str, decision_category: str, decision_date: Optional[date] = None) -> Dict:
        """Analyze a decision using numerology."""
        if decision_date is None:
            decision_date = date.today()
        
        # Use Co-Pilot service for analysis
        analysis = self.co_pilot.analyze_decision(user, decision_text, decision_date)
        
        if 'error' in analysis:
            return analysis
        
        # Create decision record
        decision = Decision.objects.create(
            user=user,
            decision_text=decision_text,
            decision_category=decision_category,
            decision_date=decision_date,
            personal_day_number=analysis['personal_day_number'],
            personal_year_number=analysis['personal_year_number'],
            personal_month_number=analysis['personal_month_number'],
            timing_score=analysis['timing_score'],
            timing_reasoning=analysis['timing_reasoning'],
            recommendation=analysis['recommendation'],
            suggested_actions=analysis['suggested_actions']
        )
        
        return {
            'decision_id': str(decision.id),
            **analysis
        }
    
    def record_outcome(self, decision_id: str, user, outcome_data: Dict) -> Dict:
        """Record the outcome of a decision."""
        try:
            decision = Decision.objects.get(id=decision_id, user=user)
        except Decision.DoesNotExist:
            return {'error': 'Decision not found'}
        
        outcome, created = DecisionOutcome.objects.update_or_create(
            decision=decision,
            defaults={
                'outcome_type': outcome_data.get('outcome_type', 'pending'),
                'outcome_description': outcome_data.get('outcome_description', ''),
                'satisfaction_score': outcome_data.get('satisfaction_score'),
                'actual_date': outcome_data.get('actual_date'),
                'notes': outcome_data.get('notes', '')
            }
        )
        
        decision.outcome_recorded = True
        decision.is_made = True
        if outcome_data.get('actual_date'):
            decision.made_date = outcome_data['actual_date']
        decision.save()
        
        # Learn from outcome
        self._learn_from_outcome(user, decision, outcome)
        
        return {
            'message': 'Outcome recorded successfully',
            'outcome_id': str(outcome.id)
        }
    
    def _learn_from_outcome(self, user, decision: Decision, outcome: DecisionOutcome):
        """Learn patterns from decision outcomes."""
        # Analyze timing accuracy
        if outcome.satisfaction_score and decision.timing_score:
            timing_accuracy = abs(outcome.satisfaction_score - decision.timing_score)
            
            if timing_accuracy <= 2:  # Good prediction
                # Update pattern for successful timing
                pattern_data = {
                    'personal_day_numbers': [decision.personal_day_number],
                    'personal_year_numbers': [decision.personal_year_number],
                    'categories': [decision.decision_category],
                    'success_rate': 1.0
                }
                
                DecisionPattern.objects.update_or_create(
                    user=user,
                    pattern_type=f'best_timing_for_{decision.decision_category}',
                    defaults={
                        'pattern_data': pattern_data,
                        'confidence_score': 0.8
                    }
                )
    
    def get_recommendations(self, user, decision_category: Optional[str] = None) -> List[Dict]:
        """Get decision recommendations based on patterns."""
        recommendations = []
        
        # Get user's successful decision patterns
        patterns = DecisionPattern.objects.filter(user=user).order_by('-confidence_score')[:5]
        
        for pattern in patterns:
            pattern_data = pattern.pattern_data
            if decision_category and pattern_data.get('categories'):
                if decision_category not in pattern_data['categories']:
                    continue
            
            recommendations.append({
                'pattern_type': pattern.pattern_type,
                'recommendation': f"Based on your past decisions, {pattern.pattern_type.replace('_', ' ')} has shown success.",
                'confidence': pattern.confidence_score,
                'suggested_timing': pattern_data.get('personal_day_numbers', [])
            })
        
        # Get best timing from numerology
        today = date.today()
        try:
            from numerology.models import NumerologyProfile
            profile = NumerologyProfile.objects.get(user=user)
            if user.profile.date_of_birth:
                from numerology.numerology import NumerologyCalculator
                calculator = NumerologyCalculator()
                personal_day = calculator.calculate_personal_day_number(
                    user.profile.date_of_birth, today
                )
                
                if personal_day in [1, 3, 8]:
                    recommendations.append({
                        'pattern_type': 'numerology_timing',
                        'recommendation': f"Today (Personal Day {personal_day}) is excellent for making decisions.",
                        'confidence': 0.7,
                        'suggested_timing': [personal_day]
                    })
        except NumerologyProfile.DoesNotExist:
            pass
        
        return recommendations
    
    def get_decision_history(self, user, limit: int = 10) -> List[Dict]:
        """Get user's decision history with outcomes."""
        decisions = Decision.objects.filter(user=user).order_by('-analysis_date')[:limit]
        
        history = []
        for decision in decisions:
            decision_data = {
                'id': str(decision.id),
                'decision_text': decision.decision_text,
                'category': decision.decision_category,
                'decision_date': decision.decision_date.isoformat(),
                'timing_score': decision.timing_score,
                'recommendation': decision.recommendation,
                'is_made': decision.is_made,
                'outcome_recorded': decision.outcome_recorded
            }
            
            if hasattr(decision, 'outcome'):
                decision_data['outcome'] = {
                    'type': decision.outcome.outcome_type,
                    'satisfaction_score': decision.outcome.satisfaction_score
                }
            
            history.append(decision_data)
        
        return history
    
    def get_success_rate(self, user) -> Dict:
        """Calculate decision success rate."""
        decisions_with_outcomes = Decision.objects.filter(
            user=user,
            outcome_recorded=True
        )
        
        total = decisions_with_outcomes.count()
        if total == 0:
            return {
                'total_decisions': 0,
                'success_rate': 0,
                'average_satisfaction': 0
            }
        
        positive_outcomes = DecisionOutcome.objects.filter(
            decision__user=user,
            outcome_type='positive'
        ).count()
        
        outcomes_with_scores = DecisionOutcome.objects.filter(
            decision__user=user
        ).exclude(satisfaction_score__isnull=True)
        
        avg_satisfaction = 0
        if outcomes_with_scores.exists():
            avg_satisfaction = sum(o.satisfaction_score for o in outcomes_with_scores) / outcomes_with_scores.count()
        
        return {
            'total_decisions': total,
            'success_rate': (positive_outcomes / total) * 100 if total > 0 else 0,
            'average_satisfaction': round(avg_satisfaction, 2),
            'positive_outcomes': positive_outcomes,
            'negative_outcomes': DecisionOutcome.objects.filter(
                decision__user=user,
                outcome_type='negative'
            ).count()
        }

