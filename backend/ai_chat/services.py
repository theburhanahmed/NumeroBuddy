"""
AI Co-Pilot services for proactive suggestions and context-aware recommendations.
"""
from typing import List, Dict, Optional
from django.utils import timezone
from datetime import date, timedelta
from numerology.models import NumerologyProfile, DailyReading
from numerology.numerology import NumerologyCalculator
from dashboard.models import QuickInsight
from knowledge_graph.services import KnowledgeGraphService


class CoPilotService:
    """Service for AI Co-Pilot functionality."""
    
    def __init__(self):
        self.calculator = NumerologyCalculator()
        self.knowledge_graph = KnowledgeGraphService()
    
    def generate_proactive_suggestions(self, user) -> List[Dict]:
        """Generate proactive suggestions based on user's numerology profile and behavior."""
        suggestions = []
        
        try:
            profile = NumerologyProfile.objects.get(user=user)
            today = date.today()
            
            # Suggestion 1: Daily reading reminder
            try:
                daily_reading = DailyReading.objects.get(user=user, reading_date=today)
                personal_day = daily_reading.personal_day_number
                
                if personal_day in [1, 3, 8]:
                    suggestions.append({
                        'type': 'daily_tip',
                        'title': 'Great Day for Action',
                        'content': f"Your Personal Day {personal_day} is perfect for taking initiative. Consider starting new projects or making important decisions today.",
                        'action_url': '/daily-reading',
                        'action_text': 'View Full Reading',
                        'priority': 8
                    })
                elif personal_day in [7, 9]:
                    suggestions.append({
                        'type': 'daily_tip',
                        'title': 'Reflection Day',
                        'content': f"Your Personal Day {personal_day} suggests introspection. Take time for meditation or spiritual practices.",
                        'action_url': '/remedies',
                        'action_text': 'View Remedies',
                        'priority': 7
                    })
            except DailyReading.DoesNotExist:
                suggestions.append({
                    'type': 'cycle_reminder',
                    'title': 'Check Your Daily Reading',
                    'content': "Your personalized daily numerology reading is ready. Discover what today holds for you.",
                    'action_url': '/daily-reading',
                    'action_text': 'View Daily Reading',
                    'priority': 9
                })
            
            # Suggestion 2: Personal Year/Month insights
            if user.profile.date_of_birth:
                personal_year = self.calculator.calculate_personal_year_number(
                    user.profile.date_of_birth, today
                )
                personal_month = self.calculator.calculate_personal_month_number(
                    user.profile.date_of_birth, today
                )
                
                if personal_year == 1:
                    suggestions.append({
                        'type': 'cycle_reminder',
                        'title': 'New Beginning Year',
                        'content': f"You're in Personal Year {personal_year} - a time for new beginnings and fresh starts. This is perfect for setting new goals.",
                        'action_url': '/life-path',
                        'action_text': 'Explore Life Path',
                        'priority': 8
                    })
            
            # Suggestion 3: Pattern discoveries
            patterns = self.knowledge_graph.discover_user_patterns(user)
            if patterns:
                top_pattern = patterns[0]
                suggestions.append({
                    'type': 'pattern_discovery',
                    'title': 'Pattern Discovered',
                    'content': top_pattern['description'],
                    'action_url': '/birth-chart',
                    'action_text': 'View Patterns',
                    'priority': 7
                })
            
            # Suggestion 4: Compatibility check reminder
            from numerology.models import CompatibilityCheck
            recent_checks = CompatibilityCheck.objects.filter(user=user).order_by('-created_at')[:1]
            if not recent_checks or (timezone.now() - recent_checks[0].created_at).days > 30:
                suggestions.append({
                    'type': 'recommendation',
                    'title': 'Check Compatibility',
                    'content': "Discover how numerology can help you understand your relationships better.",
                    'action_url': '/compatibility',
                    'action_text': 'Check Compatibility',
                    'priority': 6
                })
            
        except NumerologyProfile.DoesNotExist:
            suggestions.append({
                'type': 'alert',
                'title': 'Complete Your Profile',
                'content': "Calculate your numerology profile to unlock personalized insights and recommendations.",
                'action_url': '/birth-chart',
                'action_text': 'Calculate Profile',
                'priority': 10
            })
        
        return suggestions
    
    def analyze_decision(self, user, decision_text: str, decision_date: Optional[date] = None) -> Dict:
        """Analyze a decision using numerology."""
        if decision_date is None:
            decision_date = date.today()
        
        try:
            profile = NumerologyProfile.objects.get(user=user)
            
            if not user.profile.date_of_birth:
                return {
                    'error': 'Birth date is required for decision analysis'
                }
            
            birth_date = user.profile.date_of_birth
            
            # Calculate personal day for decision date
            personal_day = self.calculator.calculate_personal_day_number(birth_date, decision_date)
            personal_year = self.calculator.calculate_personal_year_number(birth_date, decision_date)
            personal_month = self.calculator.calculate_personal_month_number(birth_date, decision_date)
            
            # Analyze decision timing
            timing_score = 0
            timing_reasoning = []
            
            # Personal Day analysis
            if personal_day in [1, 3, 8]:
                timing_score += 3
                timing_reasoning.append(f"Personal Day {personal_day} is excellent for new beginnings and action")
            elif personal_day in [2, 6]:
                timing_score += 2
                timing_reasoning.append(f"Personal Day {personal_day} favors cooperation and relationships")
            elif personal_day in [7, 9]:
                timing_score += 1
                timing_reasoning.append(f"Personal Day {personal_day} suggests reflection before action")
            
            # Personal Year analysis
            if personal_year in [1, 5, 8]:
                timing_score += 2
                timing_reasoning.append(f"Personal Year {personal_year} supports change and new directions")
            
            # Overall recommendation
            if timing_score >= 5:
                recommendation = "Excellent timing for this decision"
            elif timing_score >= 3:
                recommendation = "Good timing, proceed with awareness"
            else:
                recommendation = "Consider waiting for a more favorable day"
            
            return {
                'decision_text': decision_text,
                'decision_date': decision_date.isoformat(),
                'personal_day_number': personal_day,
                'personal_year_number': personal_year,
                'personal_month_number': personal_month,
                'timing_score': min(10, timing_score),
                'timing_reasoning': timing_reasoning,
                'recommendation': recommendation,
                'suggested_actions': self._get_decision_actions(personal_day, personal_year)
            }
        
        except NumerologyProfile.DoesNotExist:
            return {
                'error': 'Please calculate your numerology profile first'
            }
    
    def _get_decision_actions(self, personal_day: int, personal_year: int) -> List[str]:
        """Get suggested actions based on numerology numbers."""
        actions = []
        
        if personal_day in [1, 3, 8]:
            actions.append("Take decisive action")
            actions.append("Trust your leadership abilities")
        elif personal_day in [2, 6]:
            actions.append("Seek input from others")
            actions.append("Consider partnership opportunities")
        elif personal_day == 7:
            actions.append("Research thoroughly before deciding")
            actions.append("Trust your intuition")
        elif personal_day == 9:
            actions.append("Consider the bigger picture")
            actions.append("Think about how this affects others")
        
        return actions
    
    def get_personalized_insights(self, user) -> List[Dict]:
        """Get personalized insights for the user."""
        insights = []
        
        try:
            profile = NumerologyProfile.objects.get(user=user)
            
            # Insight 1: Life Path focus
            insights.append({
                'type': 'recommendation',
                'title': f'Life Path {profile.life_path_number} Focus',
                'content': f"Your Life Path {profile.life_path_number} indicates your core purpose. Focus on activities aligned with this number.",
                'action_url': '/life-path',
                'action_text': 'Learn More',
                'priority': 8
            })
            
            # Insight 2: Current cycle
            if user.profile.date_of_birth:
                today = date.today()
                personal_year = self.calculator.calculate_personal_year_number(
                    user.profile.date_of_birth, today
                )
                
                year_meanings = {
                    1: "New beginnings and fresh starts",
                    2: "Partnership and cooperation",
                    3: "Creativity and self-expression",
                    4: "Building foundations",
                    5: "Change and freedom",
                    6: "Love and service",
                    7: "Spiritual growth",
                    8: "Success and achievement",
                    9: "Completion and letting go"
                }
                
                if personal_year in year_meanings:
                    insights.append({
                        'type': 'cycle_reminder',
                        'title': f'Personal Year {personal_year}',
                        'content': f"You're in Personal Year {personal_year}: {year_meanings[personal_year]}. Align your actions with this energy.",
                        'action_url': '/calendar',
                        'action_text': 'View Calendar',
                        'priority': 7
                    })
        
        except NumerologyProfile.DoesNotExist:
            pass
        
        return insights

