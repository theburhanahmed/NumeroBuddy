"""
Yearly report generator service for numerology insights.
"""
import logging
from typing import Dict, Any, Optional, List
from datetime import date, timedelta
from django.utils import timezone

from ..models import NumerologyProfile, PersonNumerologyProfile, RajYogDetection, WeeklyReport
from ..numerology import NumerologyCalculator
from ..interpretations import get_interpretation
from .explanation_generator import get_explanation_generator

logger = logging.getLogger(__name__)


class YearlyReportGenerator:
    """Generate comprehensive yearly numerology reports."""
    
    def __init__(self):
        self.calculator = NumerologyCalculator()
        self.explanation_generator = get_explanation_generator()
    
    def generate_yearly_report(
        self,
        user,
        year: int,
        person=None,
        numerology_profile: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Generate yearly report for a user.
        
        Args:
            user: User instance
            year: Year to generate report for
            person: Optional Person instance
            numerology_profile: Optional numerology profile dict
        
        Returns:
            Dictionary with yearly report data
        """
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
                    }
                    from accounts.models import UserProfile
                    user_profile = UserProfile.objects.get(user=user)
                    birth_date = user_profile.date_of_birth
                except (NumerologyProfile.DoesNotExist, Exception) as e:
                    raise ValueError(f"Numerology profile not found: {str(e)}")
        else:
            if person:
                birth_date = person.birth_date
            else:
                from accounts.models import UserProfile
                user_profile = UserProfile.objects.get(user=user)
                birth_date = user_profile.date_of_birth
        
        # Calculate personal year number
        personal_year = self.calculator.calculate_personal_year_number(birth_date, year)
        
        # Determine cycle phase
        cycle_phase = self._determine_cycle_phase(year, birth_date)
        
        # Generate month-by-month overview
        month_by_month = self._generate_month_by_month(
            birth_date, year, numerology_profile
        )
        
        # Identify key dates
        key_dates = self._identify_key_dates(birth_date, year, personal_year)
        
        # Get Raj Yog patterns
        raj_yog_patterns = self._analyze_raj_yog_patterns(user, person, year)
        
        # Generate major themes
        major_themes = self._generate_major_themes(
            personal_year, numerology_profile, cycle_phase
        )
        
        # Generate opportunities
        opportunities = self._generate_opportunities(
            personal_year, numerology_profile, key_dates
        )
        
        # Generate challenges
        challenges = self._generate_challenges(
            personal_year, numerology_profile, cycle_phase
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            personal_year, numerology_profile, major_themes
        )
        
        # Generate annual overview
        annual_overview = self._generate_annual_overview(
            personal_year,
            numerology_profile,
            major_themes,
            opportunities,
            challenges
        )
        
        # Raj Yog insights
        annual_raj_yog_status = None
        raj_yog_insights = None
        if raj_yog_patterns:
            annual_raj_yog_status = 'active'
            raj_yog_insights = (
                f"Your Raj Yog patterns are active throughout {year}. "
                f"Focus on aligning your actions with these auspicious energies."
            )
        
        return {
            'year': year,
            'personal_year_number': personal_year,
            'personal_year_cycle': cycle_phase,
            'annual_overview': annual_overview,
            'major_themes': major_themes,
            'month_by_month': month_by_month,
            'key_dates': key_dates,
            'opportunities': opportunities,
            'challenges': challenges,
            'recommendations': recommendations,
            'annual_raj_yog_status': annual_raj_yog_status,
            'raj_yog_patterns': raj_yog_patterns,
            'raj_yog_insights': raj_yog_insights,
        }
    
    def _determine_cycle_phase(self, year: int, birth_date: date) -> str:
        """Determine if year is beginning, middle, or end of 9-year cycle."""
        # Personal year cycles are 1-9, repeating
        # Year 1-3: Beginning, 4-6: Middle, 7-9: End
        personal_year = self.calculator.calculate_personal_year_number(birth_date, year)
        
        if personal_year in [1, 2, 3]:
            return 'beginning'
        elif personal_year in [4, 5, 6]:
            return 'middle'
        else:
            return 'end'
    
    def _generate_month_by_month(
        self,
        birth_date: date,
        year: int,
        numerology_profile: Dict
    ) -> Dict[str, Dict]:
        """Generate month-by-month overview."""
        months = {}
        
        for month in range(1, 13):
            month_date = date(year, month, 1)
            personal_month = self.calculator.calculate_personal_month_number(
                birth_date, year, month
            )
            
            try:
                interpretation = get_interpretation(personal_month)
                month_theme = interpretation['title']
            except:
                month_theme = f"Month {personal_month}"
            
            months[month] = {
                'month_name': month_date.strftime('%B'),
                'personal_month_number': personal_month,
                'theme': month_theme,
                'description': f"Focus on {month_theme} energy this month",
            }
        
        return months
    
    def _identify_key_dates(
        self,
        birth_date: date,
        year: int,
        personal_year: int
    ) -> List[Dict]:
        """Identify key dates and periods for the year."""
        key_dates = []
        
        # Birthday
        birthday = date(year, birth_date.month, birth_date.day)
        if birthday.year == year:
            key_dates.append({
                'date': birthday.isoformat(),
                'type': 'birthday',
                'description': 'Your birthday - a powerful day for new beginnings',
                'importance': 'high',
            })
        
        # Personal year transition dates (if applicable)
        # Add dates where personal month numbers align with personal year
        for month in [1, 4, 7, 10]:  # Quarter starts
            month_date = date(year, month, 1)
            personal_month = self.calculator.calculate_personal_month_number(
                birth_date, year, month
            )
            if personal_month == personal_year:
                key_dates.append({
                    'date': month_date.isoformat(),
                    'type': 'alignment',
                    'description': f'Personal month aligns with personal year ({personal_year})',
                    'importance': 'medium',
                })
        
        return key_dates
    
    def _analyze_raj_yog_patterns(
        self,
        user,
        person,
        year: int
    ) -> List[Dict]:
        """Analyze Raj Yog patterns throughout the year."""
        patterns = []
        
        try:
            detection = RajYogDetection.objects.filter(
                user=user,
                person=person
            ).first()
            
            if detection and detection.is_detected:
                # Check weekly reports for Raj Yog activity
                year_start = date(year, 1, 1)
                year_end = date(year, 12, 31)
                
                weekly_reports = WeeklyReport.objects.filter(
                    user=user,
                    person=person,
                    week_start_date__gte=year_start,
                    week_start_date__lte=year_end,
                    raj_yog_status='detected'
                )
                
                patterns.append({
                    'type': 'continuous',
                    'description': f"{detection.yog_name} active throughout the year",
                    'strength': detection.strength_score,
                    'active_weeks': weekly_reports.count(),
                })
        except Exception as e:
            logger.warning(f"Error analyzing Raj Yog patterns: {str(e)}")
        
        return patterns
    
    def _generate_major_themes(
        self,
        personal_year: int,
        numerology_profile: Dict,
        cycle_phase: str
    ) -> List[str]:
        """Generate major themes for the year."""
        themes = []
        
        try:
            interpretation = get_interpretation(personal_year)
            themes.append(f"Year of {interpretation['title']}")
            themes.append(interpretation['description'][:100] + "...")
        except:
            themes.append(f"Personal Year {personal_year}")
        
        # Cycle phase themes
        if cycle_phase == 'beginning':
            themes.append("New beginnings and fresh starts")
        elif cycle_phase == 'middle':
            themes.append("Building and development phase")
        else:
            themes.append("Completion and preparation for new cycle")
        
        # Life path alignment
        life_path = numerology_profile.get('life_path_number')
        if life_path:
            try:
                lp_interp = get_interpretation(life_path)
                themes.append(f"Alignment with {lp_interp['title']} path")
            except:
                pass
        
        return themes
    
    def _generate_opportunities(
        self,
        personal_year: int,
        numerology_profile: Dict,
        key_dates: List[Dict]
    ) -> List[str]:
        """Generate opportunities for the year."""
        opportunities = []
        
        try:
            interpretation = get_interpretation(personal_year)
            if interpretation.get('strengths'):
                opportunities.append(f"Leverage {interpretation['strengths'][0]} throughout the year")
        except:
            pass
        
        # Key dates as opportunities
        if key_dates:
            opportunities.append(f"{len(key_dates)} key dates identified for important actions")
        
        return opportunities
    
    def _generate_challenges(
        self,
        personal_year: int,
        numerology_profile: Dict,
        cycle_phase: str
    ) -> List[str]:
        """Generate challenges for the year."""
        challenges = []
        
        try:
            interpretation = get_interpretation(personal_year)
            if interpretation.get('challenges'):
                challenges.extend(interpretation['challenges'][:2])
        except:
            pass
        
        # Cycle phase challenges
        if cycle_phase == 'end':
            challenges.append("Completing current cycle and letting go")
        
        return challenges
    
    def _generate_recommendations(
        self,
        personal_year: int,
        numerology_profile: Dict,
        major_themes: List[str]
    ) -> List[str]:
        """Generate recommendations for the year."""
        recommendations = []
        
        try:
            interpretation = get_interpretation(personal_year)
            recommendations.append(f"Focus on {interpretation['life_purpose']}")
        except:
            recommendations.append(f"Embrace the energy of Personal Year {personal_year}")
        
        # Add theme-based recommendations
        if major_themes:
            recommendations.append(f"Align actions with: {major_themes[0]}")
        
        return recommendations
    
    def _generate_annual_overview(
        self,
        personal_year: int,
        numerology_profile: Dict,
        major_themes: List[str],
        opportunities: List[str],
        challenges: List[str]
    ) -> str:
        """Generate annual overview text."""
        overview_parts = [
            f"Personal Year {personal_year} brings unique energies and opportunities.",
        ]
        
        if major_themes:
            overview_parts.append(f"Major themes: {', '.join(major_themes[:2])}.")
        
        if opportunities:
            overview_parts.append(f"Key opportunities: {opportunities[0]}.")
        
        if challenges:
            overview_parts.append(f"Be mindful of: {challenges[0]}.")
        
        return " ".join(overview_parts)


def get_yearly_report_generator() -> YearlyReportGenerator:
    """Get yearly report generator instance."""
    return YearlyReportGenerator()

