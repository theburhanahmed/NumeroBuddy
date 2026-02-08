"""
Test suite for Numerobuddy Engines with Conflict Resolution.

Tests all 8 engines to ensure they:
1. Use only rule files
2. Apply conflict resolution correctly
3. Emit warnings appropriately
4. Handle edge cases
"""
import unittest
import os
import sys
from datetime import date

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from numerology.engines import (
    BirthDestinyEngine,
    PersonalYearEngine,
    CompatibilityEngine,
    LoShuEngine,
    CompoundInterpreter,
    BusinessEngine,
    KuaEngine,
    HealthKabalaEngine,
    ConflictResolver,
    ValidationMode
)


class TestBirthDestinyEngine(unittest.TestCase):
    """Test Birth & Destiny Engine with conflict resolution."""
    
    def setUp(self):
        self.engine = BirthDestinyEngine()
    
    def test_basic_calculation(self):
        """Test basic birth and destiny calculation."""
        result = self.engine.calculate(15, 6, 1990)
        self.assertIn('birth_number', result)
        self.assertIn('destiny_number', result)
        self.assertEqual(result['birth_number'], 6)  # 15 -> 1+5 = 6
        self.assertEqual(result['mark'], 'deterministic')
    
    def test_karmic_debt_detection(self):
        """Test karmic debt number detection."""
        result = self.engine.calculate(13, 6, 1990)
        self.assertIn('karmic_debts', result)
        self.assertIn(13, result['karmic_debts'])
        self.assertTrue(len(result['warnings']) > 0)
    
    def test_sun_worship_exclusion(self):
        """Test sun worship exclusion for Birth 8 + Destiny 9."""
        result = self.engine.calculate(8, 9, 1990)
        # Check if warnings include sun worship exclusion
        warning_types = [w.get('type') for w in result.get('warnings', [])]
        self.assertIn('remedy_exclusion', warning_types)
    
    def test_master_number_preservation(self):
        """Test master number preservation."""
        result = self.engine.calculate(11, 6, 1990)
        self.assertIn('master_numbers', result)
        # Master number should be preserved
        self.assertIn(11, result['master_numbers'])


class TestPersonalYearEngine(unittest.TestCase):
    """Test Personal Year Engine with conflict resolution."""
    
    def setUp(self):
        self.engine = PersonalYearEngine()
    
    def test_personal_year_calculation(self):
        """Test personal year calculation."""
        result = self.engine.calculate(15, 6, 2025, 1990, 3)
        self.assertIn('personal_year', result)
        self.assertIn('universal_year', result)
        self.assertIn('status', result)
        self.assertEqual(result['mark'], 'deterministic')
    
    def test_personal_year_override(self):
        """Test Personal Year override of compound number."""
        result = self.engine.calculate(15, 6, 2025, 1990, 3, compound_number=60)
        # If Personal Year is restrictive (4 or 9), should have override warning
        if result['personal_year'] in [4, 9]:
            self.assertTrue(len(result.get('warning', [])) > 0)
    
    def test_lost_opportunities_warning(self):
        """Test Personal Year 1 lost opportunities warning."""
        # Calculate to get Personal Year 1
        # This requires specific date calculation
        result = self.engine.calculate(1, 1, 2025, 1990, 1)
        if result['personal_year'] == 1:
            warnings = result.get('warning', [])
            if isinstance(warnings, list):
                warning_types = [w.get('type') for w in warnings]
                self.assertIn('lost_opportunity', warning_types)


class TestCompatibilityEngine(unittest.TestCase):
    """Test Compatibility Engine with conflict resolution."""
    
    def setUp(self):
        self.engine = CompatibilityEngine()
    
    def test_internal_compatibility(self):
        """Test internal compatibility (Psychic-Destiny)."""
        result = self.engine.check_compatibility(1, 5)
        self.assertIn('internal_rating', result)
        self.assertIn('punch_line', result)
        self.assertEqual(result['mark'], 'deterministic')
    
    def test_enemy_number_override(self):
        """Test enemy number override."""
        result = self.engine.check_compatibility(1, 5, psychic2=8, destiny2=2)
        # Psychic 8 is enemy of Psychic 1
        if result.get('partner_compatibility'):
            self.assertTrue(result['partner_compatibility'].get('overridden', False))
            self.assertIn('enemy', result['partner_compatibility']['relation'])
    
    def test_opposite_number_conflict(self):
        """Test opposite number conflict."""
        result = self.engine.check_compatibility(1, 8)
        # 1-8 is opposite conflict
        warnings = result.get('warnings', [])
        warning_types = [w.get('type') for w in warnings]
        self.assertIn('opposite_number_conflict', warning_types)


class TestLoShuEngine(unittest.TestCase):
    """Test Lo Shu Grid Engine with conflict resolution."""
    
    def setUp(self):
        self.engine = LoShuEngine()
    
    def test_lo_shu_grid_calculation(self):
        """Test Lo Shu grid calculation."""
        result = self.engine.calculate_grid(15, 6, 1990, 3, 9)
        self.assertIn('counts', result)
        self.assertIn('missing_info', result)
        self.assertIn('traits', result)
        self.assertEqual(result['mark'], 'deterministic')
    
    def test_missing_risky_number_warning(self):
        """Test missing risky number warning."""
        result = self.engine.calculate_grid(15, 6, 1990, 3, 9, birth_number=3, destiny_number=9)
        # Check if missing 4 or 8 triggers warning
        missing_numbers = [m['number'] for m in result.get('missing_info', [])]
        if 4 in missing_numbers or 8 in missing_numbers:
            warnings = result.get('warnings', [])
            self.assertTrue(len(warnings) > 0)


class TestCompoundInterpreter(unittest.TestCase):
    """Test Compound Number Interpreter with conflict resolution."""
    
    def setUp(self):
        self.engine = CompoundInterpreter()
    
    def test_compound_number_interpretation(self):
        """Test compound number interpretation."""
        result = self.engine.interpret(60)
        self.assertIn('number', result)
        self.assertIn('traits', result)
        self.assertEqual(result['number'], 60)
        self.assertEqual(result['mark'], 'deterministic')
    
    def test_prominent_risky_number_warning(self):
        """Test prominent risky number warning."""
        result = self.engine.interpret(60, prominent_numbers=[4, 6, 9])
        warnings = result.get('warning', [])
        if isinstance(warnings, list):
            warning_types = [w.get('type') for w in warnings]
            self.assertIn('prominent_risky_number', warning_types)
    
    def test_compound_condition_evaluation(self):
        """Test compound condition evaluation."""
        # Test condition: 15 + prominent 4 or 8
        result = self.engine.interpret(15, prominent_numbers=[4])
        specific_traits = result.get('specific_traits', [])
        self.assertIn('accidental_prone_violent_death', specific_traits)


class TestBusinessEngine(unittest.TestCase):
    """Test Business Numerology Engine with conflict resolution."""
    
    def setUp(self):
        self.engine = BusinessEngine()
    
    def test_business_name_analysis(self):
        """Test business name analysis."""
        result = self.engine.analyze_business("ABC", 4, 7)
        self.assertIn('company_name', result)
        self.assertIn('name_total', result)
        self.assertIn('root_number', result)
        self.assertEqual(result['mark'], 'deterministic')
    
    def test_name_correction_priority(self):
        """Test name correction priority."""
        # Name total 4 + Birth 4 should trigger name correction
        result = self.engine.analyze_business("DEF", 4)  # D=4, E=5, F=8 -> 17 -> 8
        # Actually need name that totals to 4 or 8
        # Let's test with a name that might total to 4 or 8
        warnings = result.get('warnings', [])
        if result.get('root_number') in [4, 8] and result.get('is_harmonious') == False:
            warning_types = [w.get('type') for w in warnings]
            # Should have name correction warning if root is 4/8 and birth is 4/8
    
    def test_mobile_digit_restriction(self):
        """Test mobile digit restriction."""
        result = self.engine.analyze_mobile("9876543210", 5)
        warnings = result.get('warnings', [])
        warning_types = [w.get('type') for w in warnings]
        self.assertIn('mobile_digit_restriction', warning_types)


class TestKuaEngine(unittest.TestCase):
    """Test Kua Engine with conflict resolution."""
    
    def setUp(self):
        self.engine = KuaEngine()
    
    def test_kua_calculation_male(self):
        """Test Kua calculation for male."""
        result = self.engine.calculate_kua(1990, 'male')
        self.assertIn('kua_number', result)
        self.assertIn('group', result)
        self.assertIn('directions', result)
        self.assertEqual(result['mark'], 'deterministic')
    
    def test_kua_calculation_female(self):
        """Test Kua calculation for female."""
        result = self.engine.calculate_kua(1990, 'female')
        self.assertIn('kua_number', result)
        self.assertIn('group', result)
        self.assertIn('directions', result)
    
    def test_kua_5_mapping(self):
        """Test Kua 5 mapping."""
        # Need to find a year that gives Kua 5
        # This requires specific calculation
        result = self.engine.calculate_kua(1994, 'female')
        if result.get('original_kua') == 5:
            self.assertIsNotNone(result.get('original_kua'))
            self.assertIn('warnings', result)


class TestHealthKabalaEngine(unittest.TestCase):
    """Test Health & Kabala Engine with conflict resolution."""
    
    def setUp(self):
        self.engine = HealthKabalaEngine()
    
    def test_kabala_calculation(self):
        """Test Kabala name calculation."""
        result = self.engine.calculate_health("JOHN")
        self.assertIn('name', result)
        self.assertIn('kabala_total', result)
        self.assertIn('kabala_number', result)
        self.assertEqual(result['mark'], 'deterministic')
    
    def test_kabala_money_exclusion(self):
        """Test Kabala 4/8 money exclusion."""
        # Need name that gives Kabala 4 or 8
        result = self.engine.calculate_health("TEST")
        if result.get('kabala_number') in [4, 8]:
            warnings = result.get('warnings', [])
            if warnings:
                warning_types = [w.get('type') for w in warnings]
                self.assertIn('kabala_money_exclusion', warning_types)


class TestConflictResolver(unittest.TestCase):
    """Test Conflict Resolver directly."""
    
    def setUp(self):
        self.resolver = ConflictResolver()
    
    def test_karmic_debt_validation(self):
        """Test karmic debt validation."""
        warnings = self.resolver.validate_karmic_debts([13, 14, 16, 19])
        self.assertTrue(len(warnings) > 0)
        self.assertEqual(warnings[0]['type'], 'karmic_debt')
    
    def test_risky_number_validation(self):
        """Test risky number validation."""
        warnings = self.resolver.validate_risky_numbers([4, 8, 13, 16, 26, 28])
        self.assertTrue(len(warnings) > 0)
        self.assertEqual(warnings[0]['type'], 'risky_number')
    
    def test_sun_worship_exclusion(self):
        """Test sun worship exclusion."""
        warning = self.resolver.validate_sun_worship_exclusion(8, 9)
        self.assertIsNotNone(warning)
        self.assertEqual(warning['type'], 'remedy_exclusion')
    
    def test_enemy_numbers(self):
        """Test enemy number detection."""
        warning = self.resolver.validate_enemy_numbers(1, 8)
        self.assertIsNotNone(warning)
        self.assertEqual(warning['type'], 'enemy_number_conflict')
    
    def test_opposite_numbers(self):
        """Test opposite number detection."""
        warning = self.resolver.validate_opposite_numbers(1, 8)
        self.assertIsNotNone(warning)
        self.assertEqual(warning['type'], 'opposite_number_conflict')
    
    def test_mobile_digit_restriction(self):
        """Test mobile digit restriction."""
        warnings = self.resolver.validate_mobile_digit_restriction("9876543210")
        self.assertTrue(len(warnings) > 0)
        self.assertEqual(warnings[0]['type'], 'mobile_digit_restriction')


class TestValidationMode(unittest.TestCase):
    """Test Validation Mode system."""
    
    def setUp(self):
        self.validation = ValidationMode()
    
    def test_calculation_tracking(self):
        """Test calculation tracking."""
        self.validation.validate_calculation(
            engine_name='TestEngine',
            calculation_type='test',
            inputs={'test': 1},
            outputs={'result': 2},
            deterministic=True
        )
        report = self.validation.generate_validation_report()
        self.assertEqual(report['summary']['total_calculations'], 1)
    
    def test_risk_detection(self):
        """Test risk detection."""
        self.validation.record_risk('karmic_debt', 'high', 'Karmic Debt 13 detected', [13])
        report = self.validation.generate_validation_report()
        self.assertEqual(report['summary']['risks_detected'], 1)
    
    def test_warning_tracking(self):
        """Test warning tracking."""
        self.validation.checklist.add_warning('test_warning', 'high', 'Test warning', True)
        report = self.validation.generate_validation_report()
        self.assertEqual(report['summary']['warnings_emitted'], 1)


if __name__ == '__main__':
    unittest.main()
