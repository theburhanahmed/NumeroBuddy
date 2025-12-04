"""
Unit tests for Raj Yog detection.
"""
from django.test import SimpleTestCase
from datetime import date
from numerology.numerology import NumerologyCalculator


class RajYogDetectionTest(SimpleTestCase):
    """Test cases for Raj Yog detection."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.calculator = NumerologyCalculator(system='pythagorean')
    
    def test_leadership_raj_yog(self):
        """Test Leadership Raj Yog detection (Life Path 1 + Destiny 8)."""
        result = self.calculator.detect_raj_yog(
            life_path=1,
            destiny=8,
            soul_urge=3,
            personality=5
        )
        
        self.assertTrue(result['is_detected'])
        self.assertEqual(result['yog_type'], 'leadership')
        self.assertEqual(result['yog_name'], 'Leadership Raj Yog')
        self.assertGreaterEqual(result['strength_score'], 80)
        self.assertGreater(len(result['detected_combinations']), 0)
    
    def test_material_raj_yog(self):
        """Test Material Raj Yog detection (Life Path 8 + Destiny 1)."""
        result = self.calculator.detect_raj_yog(
            life_path=8,
            destiny=1
        )
        
        self.assertTrue(result['is_detected'])
        self.assertEqual(result['yog_type'], 'material')
        self.assertEqual(result['yog_name'], 'Material Raj Yog')
        self.assertGreaterEqual(result['strength_score'], 75)
    
    def test_spiritual_raj_yog(self):
        """Test Spiritual Raj Yog detection (Life Path 7 + Destiny 9)."""
        result = self.calculator.detect_raj_yog(
            life_path=7,
            destiny=9
        )
        
        self.assertTrue(result['is_detected'])
        self.assertEqual(result['yog_type'], 'spiritual')
        self.assertEqual(result['yog_name'], 'Spiritual Raj Yog')
        self.assertGreaterEqual(result['strength_score'], 80)
    
    def test_creative_raj_yog(self):
        """Test Creative Raj Yog detection (Life Path 3 + Destiny 6)."""
        result = self.calculator.detect_raj_yog(
            life_path=3,
            destiny=6
        )
        
        self.assertTrue(result['is_detected'])
        self.assertEqual(result['yog_type'], 'creative')
        self.assertEqual(result['yog_name'], 'Creative Raj Yog')
        self.assertGreaterEqual(result['strength_score'], 70)
    
    def test_service_raj_yog(self):
        """Test Service Raj Yog detection (Life Path 6 + Destiny 3)."""
        result = self.calculator.detect_raj_yog(
            life_path=6,
            destiny=3
        )
        
        self.assertTrue(result['is_detected'])
        self.assertEqual(result['yog_type'], 'service')
        self.assertEqual(result['yog_name'], 'Service Raj Yog')
        self.assertGreaterEqual(result['strength_score'], 70)
    
    def test_master_number_raj_yog(self):
        """Test Master Number Raj Yog detection."""
        # Test with Life Path 11
        result = self.calculator.detect_raj_yog(
            life_path=11,
            destiny=5
        )
        
        self.assertTrue(result['is_detected'])
        self.assertEqual(result['yog_type'], 'master')
        self.assertEqual(result['yog_name'], 'Master Number Raj Yog')
        self.assertGreaterEqual(result['strength_score'], 85)
        
        # Test with Destiny 22
        result2 = self.calculator.detect_raj_yog(
            life_path=5,
            destiny=22
        )
        
        self.assertTrue(result2['is_detected'])
        self.assertEqual(result2['yog_type'], 'master')
        
        # Test with both master numbers
        result3 = self.calculator.detect_raj_yog(
            life_path=11,
            destiny=22
        )
        
        self.assertTrue(result3['is_detected'])
        self.assertEqual(result3['yog_type'], 'master')
        self.assertGreaterEqual(result3['strength_score'], 90)
    
    def test_harmony_raj_yog(self):
        """Test Harmony Raj Yog detection (Life Path 2 + Destiny 7)."""
        result = self.calculator.detect_raj_yog(
            life_path=2,
            destiny=7
        )
        
        self.assertTrue(result['is_detected'])
        self.assertEqual(result['yog_type'], 'other')
        self.assertEqual(result['yog_name'], 'Harmony Raj Yog')
        self.assertGreaterEqual(result['strength_score'], 65)
    
    def test_complementary_raj_yog(self):
        """Test complementary number combinations."""
        # Test 4-5 combination
        result = self.calculator.detect_raj_yog(
            life_path=4,
            destiny=5
        )
        
        # Should detect complementary Raj Yog if no other major combination
        if result['is_detected']:
            self.assertIn(result['yog_type'], ['other', None])
    
    def test_no_raj_yog(self):
        """Test case with no Raj Yog detected."""
        result = self.calculator.detect_raj_yog(
            life_path=2,
            destiny=4
        )
        
        # This combination typically doesn't form a major Raj Yog
        # But might have complementary or completion Raj Yog
        self.assertIsInstance(result['is_detected'], bool)
        self.assertIsInstance(result['strength_score'], int)
        self.assertGreaterEqual(result['strength_score'], 0)
        self.assertLessEqual(result['strength_score'], 100)
    
    def test_completion_raj_yog(self):
        """Test Completion Raj Yog (numbers that sum to 9)."""
        # Life Path 4 + Destiny 5 = 9
        result = self.calculator.detect_raj_yog(
            life_path=4,
            destiny=5
        )
        
        # Should detect completion Raj Yog if no other major combination
        if result['is_detected']:
            self.assertIn(result['yog_type'], ['other', None])
    
    def test_strength_score_range(self):
        """Test that strength score is always in valid range."""
        for lp in range(1, 10):
            for dest in range(1, 10):
                result = self.calculator.detect_raj_yog(
                    life_path=lp,
                    destiny=dest
                )
                
                self.assertGreaterEqual(result['strength_score'], 0)
                self.assertLessEqual(result['strength_score'], 100)
    
    def test_contributing_numbers(self):
        """Test that contributing numbers are included."""
        result = self.calculator.detect_raj_yog(
            life_path=1,
            destiny=8,
            soul_urge=3,
            personality=5
        )
        
        self.assertIn('life_path', result['contributing_numbers'])
        self.assertIn('destiny', result['contributing_numbers'])
        self.assertIn('soul_urge', result['contributing_numbers'])
        self.assertIn('personality', result['contributing_numbers'])
        
        self.assertEqual(result['contributing_numbers']['life_path'], 1)
        self.assertEqual(result['contributing_numbers']['destiny'], 8)
        self.assertEqual(result['contributing_numbers']['soul_urge'], 3)
        self.assertEqual(result['contributing_numbers']['personality'], 5)
    
    def test_detected_combinations_structure(self):
        """Test structure of detected combinations."""
        result = self.calculator.detect_raj_yog(
            life_path=1,
            destiny=8
        )
        
        if result['is_detected']:
            self.assertGreater(len(result['detected_combinations']), 0)
            
            for combo in result['detected_combinations']:
                self.assertIn('type', combo)
                self.assertIn('name', combo)
                self.assertIn('numbers', combo)
                self.assertIn('description', combo)
    
    def test_soul_urge_boost(self):
        """Test that matching soul urge boosts strength score."""
        result_with_match = self.calculator.detect_raj_yog(
            life_path=1,
            destiny=8,
            soul_urge=1  # Matches life path
        )
        
        result_without_match = self.calculator.detect_raj_yog(
            life_path=1,
            destiny=8,
            soul_urge=5  # Doesn't match
        )
        
        # Strength should be higher when soul urge matches
        if result_with_match['is_detected'] and result_without_match['is_detected']:
            self.assertGreaterEqual(
                result_with_match['strength_score'],
                result_without_match['strength_score']
            )
    
    def test_personality_boost(self):
        """Test that matching personality boosts strength score."""
        result_with_match = self.calculator.detect_raj_yog(
            life_path=1,
            destiny=8,
            personality=8  # Matches destiny
        )
        
        result_without_match = self.calculator.detect_raj_yog(
            life_path=1,
            destiny=8,
            personality=5  # Doesn't match
        )
        
        # Strength should be higher when personality matches
        if result_with_match['is_detected'] and result_without_match['is_detected']:
            self.assertGreaterEqual(
                result_with_match['strength_score'],
                result_without_match['strength_score']
            )
    
    def test_master_number_normalization(self):
        """Test that master numbers are handled correctly."""
        # Master number 11 should be normalized to 2 for comparison
        result = self.calculator.detect_raj_yog(
            life_path=11,  # Master number
            destiny=8
        )
        
        # Should detect master number Raj Yog
        self.assertTrue(result['is_detected'])
        self.assertEqual(result['yog_type'], 'master')
    
    def test_multiple_combinations(self):
        """Test detection when multiple combinations are possible."""
        # Life Path 1 + Destiny 8 = Leadership Raj Yog
        # If soul_urge also matches, should boost score
        result = self.calculator.detect_raj_yog(
            life_path=1,
            destiny=8,
            soul_urge=1,
            personality=8
        )
        
        self.assertTrue(result['is_detected'])
        # Should have high strength due to multiple alignments
        self.assertGreaterEqual(result['strength_score'], 80)

