"""
Weekly report generator service for numerology insights.
"""
import logging
from typing import Dict, Any, Optional, List
from datetime import date, timedelta
from django.utils import timezone
from django.core.cache import cache

from ..models import DailyReading, NumerologyProfile, PersonNumerologyProfile, RajYogDetection
from ..numerology import NumerologyCalculator
from ..interpretations import get_interpretation
from .explanation_generator import get_explanation_generator

logger = logging.getLogger(__name__)


class WeeklyReportGenerator:
    """Generate comprehensive weekly numerology reports."""
    
    def __init__(self):
        self.calculator = NumerologyCalculator()
        self.explanation_generator = get_explanation_generator()
    
    def generate_weekly_report(
        self,
        user,
        week_start_date: date,
        person=None,
        numerology_profile: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Generate weekly report for a user.
        
        Args:
            user: User instance
            week_start_date: Start date of the week (typically Sunday)
            person: Optional Person instance
            numerology_profile: Optional numerology profile dict
        
        Returns:
            Dictionary with weekly report data
        """
        week_end_date = week_start_date + timedelta(days=6)
        week_number = week_start_date.isocalendar()[1]
        year = week_start_date.year
        
        # Get numerology profile
        if not numerology_profile:
            if person:
                try:
                    profile = PersonNumerologyProfile.objects.get(person=person)
                    numerology_profile = {
                        'life_path_number': profile.life_path_number,
                        'destiny_number': profile.destiny_number,
                        'soul_urge_number': profile.soul_urge_number,
                        'personality_number': profile.personality_number,
                        'personal_year_number': profile.personal_year_number,
                        'personal_month_number': profile.personal_month_number,
                    }
                    birth_date = person.birth_date
                except PersonNumerologyProfile.DoesNotExist:
                    raise ValueError("Numerology profile not found for person")
            else:
                try:
                    profile = NumerologyProfile.objects.get(user=user)
                    numerology_profile = {
                        'life_path_number': profile.life_path_number,
                        'destiny_number': profile.destiny_number,
                        'soul_urge_number': profile.soul_urge_number,
                        'personality_number': profile.personality_number,
                        'personal_year_number': profile.personal_year_number,
                        'personal_month_number': profile.personal_month_number,
                    }
                    from accounts.models import UserProfile
                    user_profile = UserProfile.objects.get(user=user)
                    birth_date = user_profile.date_of_birth
                except (NumerologyProfile.DoesNotExist, Exception) as e:
                    raise ValueError(f"Numerology profile not found: {str(e)}")
        else:
            # If profile dict provided, need birth_date separately
            if person:
                birth_date = person.birth_date
            else:
                from accounts.models import UserProfile
                user_profile = UserProfile.objects.get(user=user)
                birth_date = user_profile.date_of_birth
        
        # Calculate weekly number (average of personal day numbers for the week)
        personal_day_numbers = []
        daily_insights = []
        
        current_date = week_start_date
        while current_date <= week_end_date:
            personal_day = self.calculator.calculate_personal_day_number(
                birth_date, current_date
            )
            personal_day_numbers.append(personal_day)
            
            # Get daily reading if available
            try:
                daily_reading = DailyReading.objects.get(
                    user=user,
                    reading_date=current_date
                )
                daily_insights.append({
                    'date': current_date.isoformat(),
                    'day_name': current_date.strftime('%A'),
                    'personal_day_number': personal_day,
                    'lucky_number': daily_reading.lucky_number,
                    'lucky_color': daily_reading.lucky_color,
                    'activity': daily_reading.activity_recommendation,
                    'affirmation': daily_reading.affirmation,
                    'raj_yog_status': daily_reading.raj_yog_status,
                })
            except DailyReading.DoesNotExist:
                daily_insights.append({
                    'date': current_date.isoformat(),
                    'day_name': current_date.strftime('%A'),
                    'personal_day_number': personal_day,
                    'lucky_number': None,
                    'lucky_color': None,
                    'activity': None,
                    'affirmation': None,
                    'raj_yog_status': None,
                })
            
            current_date += timedelta(days=1)
        
        # Calculate weekly number (average, rounded)
        weekly_number = round(sum(personal_day_numbers) / len(personal_day_numbers))
        if weekly_number > 9:
            weekly_number = self.calculator._reduce_to_single_digit(weekly_number, preserve_master=False)
        
        # Get Raj Yog status
        raj_yog_status = None
        raj_yog_insights = None
        try:
            detection = RajYogDetection.objects.filter(
                user=user,
                person=person
            ).first()
            if detection and detection.is_detected:
                raj_yog_status = 'detected'
                raj_yog_insights = (
                    f"Your {detection.yog_name} (strength: {detection.strength_score}/100) "
                    f"influences this week. Focus on activities aligned with your Raj Yog strengths."
                )
        except Exception as e:
            logger.warning(f"Error getting Raj Yog detection: {str(e)}")
        
        # Identify trends
        trends = self._identify_trends(daily_insights, numerology_profile)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            weekly_number,
            numerology_profile,
            daily_insights,
            trends
        )
        
        # Generate challenges
        challenges = self._generate_challenges(weekly_number, numerology_profile)
        
        # Generate opportunities
        opportunities = self._generate_opportunities(
            weekly_number,
            numerology_profile,
            trends
        )
        
        # Generate main theme
        main_theme = self._generate_main_theme(weekly_number, numerology_profile, trends)
        
        # Generate weekly summary
        weekly_summary = self._generate_weekly_summary(
            weekly_number,
            numerology_profile,
            main_theme,
            trends,
            recommendations
        )
        
        return {
            'week_start_date': week_start_date,
            'week_end_date': week_end_date,
            'week_number': week_number,
            'year': year,
            'weekly_number': weekly_number,
            'personal_year_number': numerology_profile['personal_year_number'],
            'personal_month_number': numerology_profile['personal_month_number'],
            'main_theme': main_theme,
            'weekly_summary': weekly_summary,
            'daily_insights': daily_insights,
            'weekly_trends': trends,
            'recommendations': recommendations,
            'challenges': challenges,
            'opportunities': opportunities,
            'raj_yog_status': raj_yog_status,
            'raj_yog_insights': raj_yog_insights,
        }
    
    def _identify_trends(self, daily_insights: List[Dict], numerology_profile: Dict) -> Dict[str, Any]:
        """Identify trends and patterns in the week."""
        # Count personal day numbers
        day_numbers = [insight['personal_day_number'] for insight in daily_insights if insight.get('personal_day_number')]
        number_frequency = {}
        for num in day_numbers:
            number_frequency[num] = number_frequency.get(num, 0) + 1
        
        # Find most common number
        most_common = max(number_frequency.items(), key=lambda x: x[1])[0] if number_frequency else None
        
        # Count Raj Yog days
        raj_yog_days = sum(1 for insight in daily_insights if insight.get('raj_yog_status') == 'detected')
        
        # Identify energy patterns
        energy_levels = []
        for insight in daily_insights:
            day_num = insight.get('personal_day_number', 0)
            # Higher numbers (7-9) often indicate more intense energy
            if day_num in [7, 8, 9]:
                energy_levels.append('high')
            elif day_num in [4, 5, 6]:
                energy_levels.append('medium')
            else:
                energy_levels.append('low')
        
        return {
            'most_common_day_number': most_common,
            'number_frequency': number_frequency,
            'raj_yog_days': raj_yog_days,
            'total_days': len(daily_insights),
            'energy_pattern': {
                'high': energy_levels.count('high'),
                'medium': energy_levels.count('medium'),
                'low': energy_levels.count('low'),
            },
            'dominant_energy': max(set(energy_levels), key=energy_levels.count) if energy_levels else 'medium',
        }
    
    def _generate_recommendations(
        self,
        weekly_number: int,
        numerology_profile: Dict,
        daily_insights: List[Dict],
        trends: Dict
    ) -> List[str]:
        """Generate recommendations for the week."""
        recommendations = []
        
        try:
            interpretation = get_interpretation(weekly_number)
            recommendations.append(f"Focus on {interpretation['title']} qualities this week")
        except:
            recommendations.append(f"Embrace the energy of number {weekly_number} this week")
        
        # Add trend-based recommendations
        if trends.get('raj_yog_days', 0) > 3:
            recommendations.append("Multiple Raj Yog days this week - capitalize on auspicious energy")
        
        if trends.get('dominant_energy') == 'high':
            recommendations.append("High energy week - take on challenging projects")
        elif trends.get('dominant_energy') == 'low':
            recommendations.append("Lower energy week - focus on rest and reflection")
        
        # Life path based recommendations
        life_path = numerology_profile.get('life_path_number')
        if life_path:
            try:
                lp_interp = get_interpretation(life_path)
                recommendations.append(f"Align activities with your {lp_interp['title']} nature")
            except:
                pass
        
        return recommendations
    
    def _generate_challenges(self, weekly_number: int, numerology_profile: Dict) -> List[str]:
        """Generate potential challenges for the week."""
        challenges = []
        
        try:
            interpretation = get_interpretation(weekly_number)
            if interpretation.get('challenges'):
                challenges.extend(interpretation['challenges'][:2])  # Top 2 challenges
        except:
            pass
        
        return challenges
    
    def _generate_opportunities(
        self,
        weekly_number: int,
        numerology_profile: Dict,
        trends: Dict
    ) -> List[str]:
        """Generate opportunities for the week."""
        opportunities = []
        
        try:
            interpretation = get_interpretation(weekly_number)
            if interpretation.get('strengths'):
                opportunities.append(f"Leverage your {interpretation['strengths'][0]} this week")
        except:
            pass
        
        if trends.get('raj_yog_days', 0) > 0:
            opportunities.append("Raj Yog days provide extra auspicious energy")
        
        return opportunities
    
    def _generate_main_theme(
        self,
        weekly_number: int,
        numerology_profile: Dict,
        trends: Dict
    ) -> str:
        """Generate main theme for the week."""
        try:
            interpretation = get_interpretation(weekly_number)
            theme = f"Week of {interpretation['title']}"
            
            if trends.get('dominant_energy') == 'high':
                theme += " - High Energy"
            elif trends.get('dominant_energy') == 'low':
                theme += " - Reflection"
            
            return theme
        except:
            return f"Week of Number {weekly_number}"
    
    def _generate_weekly_summary(
        self,
        weekly_number: int,
        numerology_profile: Dict,
        main_theme: str,
        trends: Dict,
        recommendations: List[str]
    ) -> str:
        """Generate weekly summary text."""
        summary_parts = [
            f"This week is governed by the energy of number {weekly_number}.",
            f"Main theme: {main_theme}.",
        ]
        
        if trends.get('raj_yog_days', 0) > 0:
            summary_parts.append(
                f"You have {trends['raj_yog_days']} Raj Yog days this week, "
                "bringing auspicious energy and opportunities."
            )
        
        if recommendations:
            summary_parts.append(f"Key focus: {recommendations[0]}")
        
        return " ".join(summary_parts)


def get_weekly_report_generator() -> WeeklyReportGenerator:
    """Get weekly report generator instance."""
    return WeeklyReportGenerator()

