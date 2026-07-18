"""
Conflict Resolution Engine for Numerobuddy System.

Implements strict priority rules from conflict_resolution.md.
All engines must use this module to validate conflicts and emit warnings.
"""
import json
from pathlib import Path
from typing import Dict, List, Optional, Set, Any


class ConflictResolver:
    """
    Central conflict resolution system that applies priority rules.
    Logic-only module - no UI components.
    """
    
    # Risky numbers that always trigger warnings
    RISKY_NUMBERS = {4, 8, 13, 16, 26, 28}
    
    # Karmic debt numbers
    KARMIC_DEBT_NUMBERS = {13, 14, 16, 19}
    
    # Master numbers that must not be reduced
    MASTER_NUMBERS = {11, 22, 33}
    
    def __init__(self):
        """Initialize conflict resolver with rule files."""
        rules_path = Path(__file__).resolve().parents[3] / 'rules'
        self.rules_path = rules_path
        
        # Load conflict resolution rules
        try:
            with (rules_path / 'conflict_resolution.md').open() as f:
                self.conflict_rules = f.read()
        except FileNotFoundError:
            self.conflict_rules = ""
        
        # Load compatibility rules for enemy number checks
        try:
            with (rules_path / 'compatibility_81.rules.json').open() as f:
                compat_rules = json.load(f)
                self.opposite_numbers = compat_rules.get('warnings', [{}])[0].get('list', {})
        except (FileNotFoundError, KeyError, IndexError):
            self.opposite_numbers = {}
        
        # Load lucky/unlucky table for enemy checks
        try:
            with (rules_path / 'eklavya_brahmastra.rules.json').open() as f:
                eklavya_rules = json.load(f)
                self.lucky_table = {}
                for item in eklavya_rules.get('outputs', [{}])[1].get('table', []):
                    self.lucky_table[item['number']] = {
                        'lucky': item.get('lucky', []),
                        'neutral': item.get('neutral', []),
                        'enemy': item.get('enemy', [])
                    }
        except (FileNotFoundError, KeyError, IndexError):
            self.lucky_table = {}
    
    def validate_karmic_debts(self, numbers: List[int]) -> List[Dict[str, Any]]:
        """
        Check for karmic debt numbers and return mandatory warnings.
        
        Args:
            numbers: List of numbers to check (birth day, destiny, compound, etc.)
            
        Returns:
            List of warning dictionaries
        """
        warnings = []
        detected_debts = [n for n in numbers if n in self.KARMIC_DEBT_NUMBERS]
        
        for debt in detected_debts:
            warnings.append({
                'type': 'karmic_debt',
                'number': debt,
                'severity': 'high',
                'message': f"Karmic Debt Number {debt} detected - mandatory warning",
                'override': True  # Overrides optimistic traits
            })
        
        return warnings
    
    def validate_risky_numbers(self, numbers: List[int]) -> List[Dict[str, Any]]:
        """
        Check for risky numbers (4, 8, 13, 16, 26, 28) and return warnings.
        
        Args:
            numbers: List of numbers to check
            
        Returns:
            List of warning dictionaries
        """
        warnings = []
        detected_risky = [n for n in numbers if n in self.RISKY_NUMBERS]
        
        for risky in detected_risky:
            warnings.append({
                'type': 'risky_number',
                'number': risky,
                'severity': 'high',
                'message': f"Risky Number {risky} detected - requires caution",
                'override': True
            })
        
        return warnings
    
    def validate_sun_worship_exclusion(self, birth_number: int, destiny_number: int) -> Optional[Dict[str, Any]]:
        """
        Check if sun-related remedies are prohibited.
        Rule: If Birth Number is 8 AND Destiny Number is 9, sun remedies are prohibited.
        
        Args:
            birth_number: Birth number (psychic/driver)
            destiny_number: Destiny number (conductor)
            
        Returns:
            Warning dict if exclusion applies, None otherwise
        """
        if birth_number == 8 and destiny_number == 9:
            return {
                'type': 'remedy_exclusion',
                'severity': 'high',
                'message': "Sun worship remedies (Argh) are strictly prohibited for Birth 8 + Destiny 9 combination",
                'blocked_remedies': ['sun_argh', 'sunlight', 'red_garnet', 'red_jasper'],
                'override': True
            }
        return None
    
    def validate_name_correction_priority(self, name_total: int, birth_number: int) -> Optional[Dict[str, Any]]:
        """
        Check if name correction is mandatory.
        Rule: If name total is 4 or 8 AND birth number is 4 or 8, name MUST be changed.
        
        Args:
            name_total: Total value of the name
            birth_number: Birth number
            
        Returns:
            Warning dict if correction required, None otherwise
        """
        if name_total in {4, 8} and birth_number in {4, 8}:
            return {
                'type': 'name_correction_mandatory',
                'severity': 'high',
                'message': f"Name total {name_total} with Birth Number {birth_number} requires mandatory name correction",
                'override': True  # Overrides positive letter vibrations
            }
        return None
    
    def validate_personal_year_override(self, personal_year: int, compound_number: int) -> Optional[Dict[str, Any]]:
        """
        Check if Personal Year restrictions override compound number optimism.
        Rule: Personal Year traits override long-term compound number traits for timing.
        
        Args:
            personal_year: Current personal year (1-9)
            compound_number: Compound number from name
            
        Returns:
            Warning dict if override applies, None otherwise
        """
        # Personal Years 4 and 9 are restrictive
        restrictive_years = {4, 9}
        
        if personal_year in restrictive_years:
            return {
                'type': 'temporal_override',
                'severity': 'medium',
                'message': f"Personal Year {personal_year} restrictions override compound number {compound_number} optimism for current timing",
                'override': True
            }
        return None
    
    def validate_enemy_numbers(self, psychic1: int, psychic2: int) -> Optional[Dict[str, Any]]:
        """
        Check if two psychic numbers are enemies.
        Rule: Enemy numbers override general compatibility ratings.
        
        Args:
            psychic1: First person's psychic number
            psychic2: Second person's psychic number
            
        Returns:
            Warning dict if enemies detected, None otherwise
        """
        if psychic1 in self.lucky_table:
            enemies = self.lucky_table[psychic1].get('enemy', [])
            if psychic2 in enemies:
                return {
                    'type': 'enemy_number_conflict',
                    'severity': 'high',
                    'message': f"Psychic {psychic2} is an enemy to Psychic {psychic1} - overrides compatibility rating",
                    'override': True
                }
        return None
    
    def validate_opposite_numbers(self, psychic: int, destiny: int) -> Optional[Dict[str, Any]]:
        """
        Check if psychic and destiny numbers are opposites (internal conflict).
        Rule: Opposite numbers override optimistic 81-combination ratings.
        
        Args:
            psychic: Psychic number (driver)
            destiny: Destiny number (conductor)
            
        Returns:
            Warning dict if opposites detected, None otherwise
        """
        if str(psychic) in self.opposite_numbers:
            opposites = self.opposite_numbers[str(psychic)]
            if destiny in opposites:
                return {
                    'type': 'opposite_number_conflict',
                    'severity': 'high',
                    'message': f"Psychic {psychic} and Destiny {destiny} are opposite numbers - internal conflict",
                    'override': True
                }
        return None
    
    def validate_mobile_digit_restriction(self, phone_number: str) -> List[Dict[str, Any]]:
        """
        Check for restricted digits in mobile number.
        Rule: Presence of 4 or 8 triggers malefic warning regardless of total.
        
        Args:
            phone_number: Phone number string
            
        Returns:
            List of warning dictionaries
        """
        warnings = []
        restricted_digits = {'4', '8'}
        
        for digit in restricted_digits:
            if digit in phone_number:
                warnings.append({
                    'type': 'mobile_digit_restriction',
                    'severity': 'high',
                    'digit': digit,
                    'message': f"Digit {digit} in mobile number triggers malefic warning regardless of total sum",
                    'override': True
                })
        
        return warnings
    
    def validate_master_number_preservation(self, number: int, context: str = "") -> Optional[Dict[str, Any]]:
        """
        Validate that master numbers are not reduced incorrectly.
        Rule: 11, 22, 33 must never be reduced during intermediate steps.
        
        Args:
            number: Number to check
            context: Context description for error message
            
        Returns:
            Warning dict if violation detected, None otherwise
        """
        if number in self.MASTER_NUMBERS:
            return {
                'type': 'master_number_preservation',
                'severity': 'high',
                'number': number,
                'message': f"Master Number {number} must not be reduced - preserve in {context}",
                'override': True
            }
        return None
    
    def resolve_conflicts(self, 
                         analysis_results: Dict[str, Any],
                         context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main conflict resolution function.
        Applies all priority rules and returns resolved analysis with warnings.
        
        Args:
            analysis_results: Results from various engines
            context: Context data (birth_number, destiny_number, personal_year, etc.)
            
        Returns:
            Resolved analysis with conflicts detected and warnings applied
        """
        all_warnings = []
        conflicts_detected = []
        
        # Extract context values
        birth_number = context.get('birth_number')
        destiny_number = context.get('destiny_number')
        personal_year = context.get('personal_year')
        compound_number = context.get('compound_number')
        name_total = context.get('name_total')
        phone_number = context.get('phone_number')
        psychic1 = context.get('psychic1')
        psychic2 = context.get('psychic2')
        
        # 1. Core Number Overrides
        numbers_to_check = []
        if birth_number:
            numbers_to_check.append(birth_number)
        if destiny_number:
            numbers_to_check.append(destiny_number)
        if compound_number:
            numbers_to_check.append(compound_number)
        
        all_warnings.extend(self.validate_karmic_debts(numbers_to_check))
        all_warnings.extend(self.validate_risky_numbers(numbers_to_check))
        
        # Sun worship exclusion
        if birth_number and destiny_number:
            sun_warning = self.validate_sun_worship_exclusion(birth_number, destiny_number)
            if sun_warning:
                all_warnings.append(sun_warning)
        
        # Name correction priority
        if name_total and birth_number:
            name_warning = self.validate_name_correction_priority(name_total, birth_number)
            if name_warning:
                all_warnings.append(name_warning)
        
        # 2. Temporal Overrides
        if personal_year and compound_number:
            temporal_warning = self.validate_personal_year_override(personal_year, compound_number)
            if temporal_warning:
                all_warnings.append(temporal_warning)
        
        # 3. Compatibility Overrides
        if psychic1 and psychic2:
            enemy_warning = self.validate_enemy_numbers(psychic1, psychic2)
            if enemy_warning:
                all_warnings.append(enemy_warning)
        
        if psychic1 and destiny_number:
            opposite_warning = self.validate_opposite_numbers(psychic1, destiny_number)
            if opposite_warning:
                all_warnings.append(opposite_warning)
        
        # 4. Business & Branding
        if phone_number:
            all_warnings.extend(self.validate_mobile_digit_restriction(phone_number))
        
        # 5. Calculation Integrity
        # Master number preservation is handled in calculation engines
        
        # Apply overrides to analysis results
        resolved_results = analysis_results.copy()
        
        # If any high-severity override warnings exist, mark optimistic traits
        high_severity_warnings = [w for w in all_warnings if w.get('severity') == 'high' and w.get('override')]
        if high_severity_warnings:
            conflicts_detected.extend([w['type'] for w in high_severity_warnings])
            # Mark optimistic traits as overridden
            if 'traits' in resolved_results:
                resolved_results['traits_overridden'] = True
            if 'rating' in resolved_results:
                resolved_results['rating_overridden'] = True
        
        return {
            'analysis': resolved_results,
            'warnings': all_warnings,
            'conflicts_detected': conflicts_detected,
            'validation_passed': len(high_severity_warnings) == 0
        }
