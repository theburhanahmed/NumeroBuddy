"""
Calendar services for numerology date calculations.
"""
from datetime import date, timedelta
from typing import List, Dict, Optional
from numerology.numerology import NumerologyCalculator


class CalendarService:
    """Service for calculating numerology calendar events."""
    
    def __init__(self):
        self.calculator = NumerologyCalculator()
    
    def calculate_personal_year_start(self, birth_date: date, year: int) -> date:
        """Calculate the start date of a personal year."""
        return date(year, birth_date.month, birth_date.day)
    
    def calculate_personal_month_start(self, birth_date: date, year: int, month: int) -> date:
        """Calculate the start date of a personal month."""
        return date(year, month, birth_date.day)
    
    def get_personal_day_number(self, birth_date: date, target_date: date) -> int:
        """Calculate personal day number for a specific date."""
        return self.calculator.calculate_personal_day_number(birth_date, target_date)
    
    def find_auspicious_dates(
        self,
        birth_date: date,
        start_date: date,
        end_date: date,
        preferred_numbers: Optional[List[int]] = None,
        activity_type: str = 'other'
    ) -> List[Dict]:
        """Find auspicious dates within a date range."""
        if preferred_numbers is None:
            # Default: prefer numbers 1, 3, 6, 8, 9 for general activities
            preferred_numbers = [1, 3, 6, 8, 9]
        
        auspicious_dates = []
        current_date = start_date
        
        while current_date <= end_date:
            personal_day = self.get_personal_day_number(birth_date, current_date)
            
            # Calculate auspiciousness score
            score = 0
            if personal_day in preferred_numbers:
                score = 10
            elif personal_day in [2, 4, 5, 7]:
                score = 7
            else:
                score = 5
            
            # Boost score for master numbers
            if personal_day in [11, 22, 33]:
                score = min(10, score + 2)
            
            # Boost score for certain days of week (Monday, Thursday, Friday are generally auspicious)
            weekday = current_date.weekday()
            if weekday in [0, 3, 4]:  # Monday, Thursday, Friday
                score = min(10, score + 1)
            
            if score >= 7:  # Only include moderately to highly auspicious dates
                auspicious_dates.append({
                    'date': current_date,
                    'personal_day_number': personal_day,
                    'score': score,
                    'reasoning': self._generate_reasoning(personal_day, score, weekday)
                })
            
            current_date += timedelta(days=1)
        
        # Sort by score descending
        auspicious_dates.sort(key=lambda x: x['score'], reverse=True)
        return auspicious_dates[:10]  # Return top 10
    
    def _generate_reasoning(self, personal_day: int, score: int, weekday: int) -> str:
        """Generate reasoning for why a date is auspicious."""
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        day_name = day_names[weekday]
        
        number_meanings = {
            1: "New beginnings and leadership",
            2: "Cooperation and partnership",
            3: "Creativity and expression",
            4: "Stability and foundation",
            5: "Change and freedom",
            6: "Love and harmony",
            7: "Spirituality and introspection",
            8: "Success and abundance",
            9: "Completion and service",
            11: "Intuition and inspiration",
            22: "Master builder and vision",
            33: "Master teacher and healing"
        }
        
        meaning = number_meanings.get(personal_day, "A balanced day")
        return f"Personal Day {personal_day} ({meaning}) on {day_name}. This date aligns well with your numerology cycles."
    
    def get_upcoming_cycles(
        self,
        birth_date: date,
        start_date: date,
        days_ahead: int = 90
    ) -> List[Dict]:
        """Get upcoming personal cycles."""
        cycles = []
        end_date = start_date + timedelta(days=days_ahead)
        current_date = start_date
        
        # Track current personal year/month
        current_year = self.calculator.calculate_personal_year_number(birth_date, current_date)
        current_month = self.calculator.calculate_personal_month_number(birth_date, current_date)
        
        while current_date <= end_date:
            year_num = self.calculator.calculate_personal_year_number(birth_date, current_date)
            month_num = self.calculator.calculate_personal_month_number(birth_date, current_date)
            
            # Check for year change
            if year_num != current_year:
                cycles.append({
                    'type': 'personal_year_start',
                    'date': current_date,
                    'number': year_num,
                    'title': f'Personal Year {year_num} Begins'
                })
                current_year = year_num
            
            # Check for month change
            if month_num != current_month:
                cycles.append({
                    'type': 'personal_month_start',
                    'date': current_date,
                    'number': month_num,
                    'title': f'Personal Month {month_num} Begins'
                })
                current_month = month_num
            
            current_date += timedelta(days=1)
        
        return cycles

