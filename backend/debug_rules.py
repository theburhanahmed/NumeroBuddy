#!/usr/bin/env python3
"""
Debug script for compatibility rules.
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

def debug_compatibility_rules():
    """Debug compatibility rules."""
    print("Debugging Compatibility Rules...")
    
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
    print(f"Weights: {analyzer.weights}")
    
    # Manually check the rules
    print("\nChecking rules manually...")
    factor = 'life_path'
    user_num = user_numbers['life_path_number']
    partner_num = partner_numbers['life_path_number']
    rule_key = (min(user_num, partner_num), max(user_num, partner_num))
    
    print(f"Factor: {factor}")
    print(f"User num: {user_num}")
    print(f"Partner num: {partner_num}")
    print(f"Rule key: {rule_key}")
    print(f"Rules for {factor}: {analyzer.COMPATIBILITY_RULES.get(factor, {})}")
    print(f"Rule key in rules: {rule_key in analyzer.COMPATIBILITY_RULES.get(factor, {})}")
    
    if factor in analyzer.COMPATIBILITY_RULES and rule_key in analyzer.COMPATIBILITY_RULES.get(factor, {}):
        rule = analyzer.COMPATIBILITY_RULES[factor][rule_key]
        print(f"Found rule: {rule}")
    else:
        print("No matching rule found")

if __name__ == "__main__":
    debug_compatibility_rules()