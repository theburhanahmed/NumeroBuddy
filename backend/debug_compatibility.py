#!/usr/bin/env python3
"""
Debug script for compatibility analysis.
"""
import os
import sys
import django
from pathlib import Path
from datetime import date

# Add the project root to the path
sys.path.append(str(Path(__file__).parent))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'numerai.settings.development')
django.setup()

from numerology.compatibility import CompatibilityAnalyzer
from numerology.numerology import NumerologyCalculator

def debug_compatibility_analyzer():
    """Debug the enhanced compatibility analyzer."""
    print("Debugging Compatibility Analyzer...")
    
    # Test data
    user_full_name = "John Doe"
    user_birth_date = date(1990, 5, 15)
    partner_full_name = "Jane Smith"
    partner_birth_date = date(1995, 3, 20)
    
    # Test calculator directly
    print("\nTesting Numerology Calculator...")
    calculator = NumerologyCalculator()
    user_numbers = calculator.calculate_all(user_full_name, user_birth_date)
    partner_numbers = calculator.calculate_all(partner_full_name, partner_birth_date)
    
    print(f"User Numbers: {user_numbers}")
    print(f"Partner Numbers: {partner_numbers}")
    
    # Test individual calculations
    user_life_path = calculator.calculate_life_path_number(user_birth_date)
    partner_life_path = calculator.calculate_life_path_number(partner_birth_date)
    
    print(f"User Life Path: {user_life_path}")
    print(f"Partner Life Path: {partner_life_path}")
    
    # Test analyzer
    analyzer = CompatibilityAnalyzer(relationship_type='romantic')
    score, strengths, challenges = analyzer.calculate_compatibility_score(user_numbers, partner_numbers)
    
    print(f"\nCompatibility Score: {score}")
    print(f"Strengths: {strengths}")
    print(f"Challenges: {challenges}")
    
    # Test advice generation
    advice = analyzer.generate_compatibility_advice(user_numbers, partner_numbers, score, strengths, challenges)
    print(f"\nAdvice: {advice}")

if __name__ == "__main__":
    debug_compatibility_analyzer()