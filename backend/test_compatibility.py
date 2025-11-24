#!/usr/bin/env python3
"""
Test script for compatibility analysis.
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

def test_compatibility_analyzer():
    """Test the enhanced compatibility analyzer."""
    print("Testing Compatibility Analyzer...")
    
    # Create analyzer for romantic relationship
    analyzer = CompatibilityAnalyzer(relationship_type='romantic')
    
    # Test data
    user_full_name = "John Doe"
    user_birth_date = date(1990, 5, 15)
    partner_full_name = "Jane Smith"
    partner_birth_date = date(1995, 3, 20)
    
    # Perform compatibility analysis
    analysis = analyzer.analyze_compatibility(
        user_full_name=user_full_name,
        user_birth_date=user_birth_date,
        partner_full_name=partner_full_name,
        partner_birth_date=partner_birth_date
    )
    
    print(f"Compatibility Score: {analysis['compatibility_score']}")
    print(f"Strengths: {analysis['strengths']}")
    print(f"Challenges: {analysis['challenges']}")
    print(f"Advice: {analysis['advice']}")
    
    # Test with different relationship type
    print("\nTesting with business relationship...")
    business_analyzer = CompatibilityAnalyzer(relationship_type='business')
    business_analysis = business_analyzer.analyze_compatibility(
        user_full_name=user_full_name,
        user_birth_date=user_birth_date,
        partner_full_name=partner_full_name,
        partner_birth_date=partner_birth_date
    )
    
    print(f"Business Compatibility Score: {business_analysis['compatibility_score']}")
    
    # Test calculator directly
    print("\nTesting Numerology Calculator...")
    calculator = NumerologyCalculator()
    user_numbers = calculator.calculate_all(user_full_name, user_birth_date)
    partner_numbers = calculator.calculate_all(partner_full_name, partner_birth_date)
    
    print(f"User Life Path: {user_numbers['life_path_number']}")
    print(f"Partner Life Path: {partner_numbers['life_path_number']}")
    
    return analysis

if __name__ == "__main__":
    test_compatibility_analyzer()