#!/usr/bin/env python3
"""
Test script for compatibility rules.
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to the path
sys.path.append(str(Path(__file__).parent))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'numerai.settings.development')
django.setup()

from numerology.compatibility import CompatibilityAnalyzer

def test_compatibility_rules():
    """Test compatibility rules with specific number combinations."""
    print("Testing Compatibility Rules...")
    
    # Test data that should match a rule: Life Path 1 and 8
    user_numbers = {
        'life_path_number': 1,
        'destiny_number': 1,
        'soul_urge_number': 1,
        'personality_number': 1,
        'attitude_number': 1,
        'maturity_number': 1,
        'balance_number': 1,
        'personal_year_number': 1,
        'personal_month_number': 1
    }
    
    partner_numbers = {
        'life_path_number': 8,
        'destiny_number': 8,
        'soul_urge_number': 8,
        'personality_number': 8,
        'attitude_number': 8,
        'maturity_number': 8,
        'balance_number': 8,
        'personal_year_number': 8,
        'personal_month_number': 8
    }
    
    # Test analyzer
    analyzer = CompatibilityAnalyzer(relationship_type='romantic')
    score, strengths, challenges = analyzer.calculate_compatibility_score(user_numbers, partner_numbers)
    
    print(f"Compatibility Score: {score}")
    print(f"Strengths: {strengths}")
    print(f"Challenges: {challenges}")
    
    # Test with Soul Urge 7 and 11
    print("\nTesting Soul Urge 7 and 11...")
    user_numbers['soul_urge_number'] = 7
    partner_numbers['soul_urge_number'] = 11
    
    score2, strengths2, challenges2 = analyzer.calculate_compatibility_score(user_numbers, partner_numbers)
    
    print(f"Compatibility Score: {score2}")
    print(f"Strengths: {strengths2}")
    print(f"Challenges: {challenges2}")

if __name__ == "__main__":
    test_compatibility_rules()