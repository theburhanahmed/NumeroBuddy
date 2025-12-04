"""
Pure deterministic logic for phone number numerology calculations.
No side effects, fully testable.
"""
import re
import unicodedata
from typing import Dict, List, Optional, Literal, Tuple


# Digit meanings for numerology
DIGIT_MEANINGS = {
    0: "Potential, blank slate, amplification",
    1: "Leadership, independence, initiative",
    2: "Cooperation, diplomacy, relationships",
    3: "Communication, creativity, sociability",
    4: "Stability, structure, work, practicality",
    5: "Change, freedom, unpredictability",
    6: "Harmony, responsibility, family, service",
    7: "Introspection, analysis, spirituality",
    8: "Power, abundance, material success, karma",
    9: "Completion, humanitarianism, endings, wisdom"
}

# Vanity number mapping (A-Z to telephone keypad digits)
VANITY_MAP = {
    'a': '2', 'b': '2', 'c': '2',
    'd': '3', 'e': '3', 'f': '3',
    'g': '4', 'h': '4', 'i': '4',
    'j': '5', 'k': '5', 'l': '5',
    'm': '6', 'n': '6', 'o': '6',
    'p': '7', 'q': '7', 'r': '7', 's': '7',
    't': '8', 'u': '8', 'v': '8',
    'w': '9', 'x': '9', 'y': '9', 'z': '9'
}

# Default validation limits (E.164)
MIN_DIGITS = 6
MAX_DIGITS = 15


def sanitize_and_validate_phone(
    phone_raw: str,
    country_hint: Optional[str] = None,
    convert_vanity: bool = False,
    min_digits: int = MIN_DIGITS,
    max_digits: int = MAX_DIGITS
) -> Dict:
    """
    Sanitize and validate phone number, returning E.164 format.
    
    Steps:
    1. Trim whitespace
    2. Remove common separators () - . and words (ext, x, extension)
    3. If starts with 00 and no +, convert to + + rest
    4. If starts with neither + nor 00, try to infer country code from country_hint
    5. Validate digits length (6-15 per E.164)
    6. Return sanitized E.164 string and metadata
    
    Args:
        phone_raw: Original phone number string
        country_hint: Optional ISO2/ISO3 country code to help parsing
        convert_vanity: Whether to convert letters to dial digits
        min_digits: Minimum number of digits allowed
        max_digits: Maximum number of digits allowed
        
    Returns:
        Dict with keys: e164, digits_only, country, valid, reason, extension
    """
    if not phone_raw:
        return {
            'e164': '',
            'digits_only': '',
            'country': None,
            'valid': False,
            'reason': 'Empty phone number',
            'extension': None
        }
    
    # Step 1: Trim whitespace
    phone = phone_raw.strip()
    
    # Step 2: Extract extension if present
    extension = None
    extension_patterns = [
        r'\s*(?:ext|extension|x)\s*:?\s*(\d+)',
        r'\s*#\s*(\d+)',
    ]
    for pattern in extension_patterns:
        match = re.search(pattern, phone, re.IGNORECASE)
        if match:
            extension = match.group(1)
            phone = re.sub(pattern, '', phone, flags=re.IGNORECASE)
            break
    
    # Step 2: Remove common separators
    phone = re.sub(r'[()\s.\-]', '', phone)
    
    # Step 3: Handle vanity numbers
    has_letters = bool(re.search(r'[a-zA-Z]', phone))
    if has_letters:
        if not convert_vanity:
            return {
                'e164': '',
                'digits_only': '',
                'country': None,
                'valid': False,
                'reason': 'Phone number contains letters. Set convert_vanity=true to convert.',
                'extension': extension
            }
        # Convert letters to digits
        converted = []
        for char in phone:
            if char.lower() in VANITY_MAP:
                converted.append(VANITY_MAP[char.lower()])
            elif char.isdigit() or char == '+':
                converted.append(char)
        phone = ''.join(converted)
    
    # Step 4: Normalize Unicode digits to ASCII
    phone = unicodedata.normalize('NFKD', phone)
    phone = ''.join(char for char in phone if not unicodedata.combining(char))
    
    # Step 5: Handle leading 00
    if phone.startswith('00') and not phone.startswith('+'):
        phone = '+' + phone[2:]
    
    # Step 6: Handle missing country code
    if not phone.startswith('+'):
        if country_hint:
            # Try to add country code (simplified - would need full country code mapping)
            # For now, just mark as needing country code
            return {
                'e164': '',
                'digits_only': phone,
                'country': country_hint,
                'valid': False,
                'reason': f'Phone number missing country code. Country hint: {country_hint}',
                'extension': extension
            }
        else:
            return {
                'e164': '',
                'digits_only': phone,
                'country': None,
                'valid': False,
                'reason': 'Phone number missing country code and no country hint provided',
                'extension': extension
            }
    
    # Extract digits only (for validation)
    digits_only = re.sub(r'[^\d]', '', phone)
    
    # Step 7: Validate length
    if len(digits_only) < min_digits:
        return {
            'e164': phone,
            'digits_only': digits_only,
            'country': country_hint,
            'valid': False,
            'reason': f'Phone number too short (minimum {min_digits} digits)',
            'extension': extension
        }
    
    if len(digits_only) > max_digits:
        return {
            'e164': phone,
            'digits_only': digits_only,
            'country': country_hint,
            'valid': False,
            'reason': f'Phone number too long (maximum {max_digits} digits)',
            'extension': extension
        }
    
    # Extract country code (first 1-3 digits after +)
    country_code = None
    if phone.startswith('+'):
        # Try to extract country code (simplified - would need full mapping)
        # For common codes: +1 (US/CA), +44 (UK), +91 (India), etc.
        if phone.startswith('+1'):
            country_code = 'US'
        elif phone.startswith('+44'):
            country_code = 'GB'
        elif phone.startswith('+91'):
            country_code = 'IN'
        # Add more as needed
    
    return {
        'e164': phone,
        'digits_only': digits_only,
        'country': country_code or country_hint,
        'valid': True,
        'reason': None,
        'extension': extension
    }


def reduce_number(n: int, keep_master: bool = False) -> Tuple[int, List[int]]:
    """
    Reduce a number to single digit (1-9) or master number (11, 22, 33).
    
    Args:
        n: Number to reduce
        keep_master: Whether to preserve master numbers (11, 22, 33)
        
    Returns:
        Tuple of (reduced_number, reduction_steps)
    """
    steps = [n]
    current = n
    
    while current >= 10:
        # Check for master numbers
        if keep_master and current in [11, 22, 33]:
            return current, steps
        
        # Sum digits
        current = sum(int(d) for d in str(current))
        steps.append(current)
    
    return current, steps


def compute_phone_numerology(
    phone_e164: str,
    method: str = 'core',
    core_scope: str = 'national',
    keep_master: bool = False
) -> Dict:
    """
    Compute deterministic numerology values from phone number.
    
    Args:
        phone_e164: E.164 format phone number (e.g., +14155552671)
        method: Calculation method ('core', 'full', 'compatibility')
        core_scope: 'full' (all digits) or 'national' (exclude country code)
        keep_master: Whether to preserve master numbers in reductions
        
    Returns:
        Dict with computed values and evidence_map
    """
    # Extract digits only
    digits_only = re.sub(r'[^\d]', '', phone_e164)
    digits_list = list(digits_only)
    
    # Determine which digits to use for core number
    if core_scope == 'national' and phone_e164.startswith('+'):
        # Try to identify country code and exclude it
        # Simplified: assume +1 is 1 digit, others vary
        if phone_e164.startswith('+1'):
            # US/Canada: +1 followed by 10 digits
            national_digits = digits_list[1:] if len(digits_list) > 1 else digits_list
        elif phone_e164.startswith('+44'):
            # UK: +44 followed by digits
            national_digits = digits_list[2:] if len(digits_list) > 2 else digits_list
        elif phone_e164.startswith('+91'):
            # India: +91 followed by 10 digits
            national_digits = digits_list[2:] if len(digits_list) > 2 else digits_list
        else:
            # Default: exclude first 1-3 digits as country code
            # This is a heuristic - full implementation would need country code database
            if len(digits_list) > 10:
                national_digits = digits_list[1:]  # Exclude first digit
            else:
                national_digits = digits_list
    else:
        national_digits = digits_list
    
    # A) Core number calculation
    core_total = sum(int(d) for d in national_digits)
    core_reduced, core_steps = reduce_number(core_total, keep_master)
    
    # B) Positional sequence (running totals)
    positional_sequence = []
    running_total = 0
    for i, digit in enumerate(national_digits, start=1):
        running_total += int(digit)
        running_reduced, _ = reduce_number(running_total, keep_master)
        positional_sequence.append({
            'position': i,
            'digit': digit,
            'running_total': running_total,
            'running_reduced': running_reduced
        })
    
    # C) Pair sums
    pair_sums = []
    for i in range(len(national_digits) - 1):
        d1 = int(national_digits[i])
        d2 = int(national_digits[i + 1])
        pair_total = d1 + d2
        pair_reduced, _ = reduce_number(pair_total, keep_master)
        pair_sums.append({
            'pair': f'{d1}-{d2}',
            'raw': pair_total,
            'reduced': pair_reduced
        })
    
    # D) Repeated digits
    digit_counts = {}
    for digit in national_digits:
        digit_counts[digit] = digit_counts.get(digit, 0) + 1
    
    # Find dominant digit (appears >= 3 times)
    dominant_digit = None
    for digit, count in digit_counts.items():
        if count >= 3:
            dominant_digit = digit
            break
    
    # E) Evidence map for LLM
    evidence_map = {
        'E1': 'digits and e164',
        'E2': 'core_number',
        'E3': 'positional_sequence',
        'E4': 'pair_sums',
        'E5': 'repeated_digits'
    }
    
    return {
        'digits': national_digits,
        'evidence_map': evidence_map,
        'core_number': {
            'raw_total': core_total,
            'reduced': core_reduced,
            'reduction_steps': core_steps
        },
        'positional_sequence': positional_sequence,
        'pair_sums': pair_sums,
        'repeated_digits': digit_counts,
        'dominant_digit': dominant_digit
    }


def compute_compatibility_score(
    phone1_e164: str,
    phone2_e164: str,
    core_scope: str = 'national',
    keep_master: bool = False
) -> Dict:
    """
    Compute compatibility score between two phone numbers.
    
    Args:
        phone1_e164: First phone number in E.164 format
        phone2_e164: Second phone number in E.164 format
        core_scope: 'full' or 'national'
        keep_master: Whether to preserve master numbers
        
    Returns:
        Dict with compatibility_score (0-100) and details
    """
    # Compute core numbers for both
    result1 = compute_phone_numerology(phone1_e164, method='core', core_scope=core_scope, keep_master=keep_master)
    result2 = compute_phone_numerology(phone2_e164, method='core', core_scope=core_scope, keep_master=keep_master)
    
    core1 = result1['core_number']['reduced']
    core2 = result2['core_number']['reduced']
    
    # Calculate absolute difference
    diff = abs(core1 - core2)
    
    # Map to score 0-100: score = 100 - (d * 11) clipped to 0-100
    base_score = 100 - (diff * 11)
    score = max(0, min(100, base_score))
    
    # Add modifiers for shared dominant digits
    dominant1 = result1.get('dominant_digit')
    dominant2 = result2.get('dominant_digit')
    
    shared_digits = set(result1['repeated_digits'].keys()) & set(result2['repeated_digits'].keys())
    modifier = min(15, len(shared_digits) * 5)  # +5 per shared digit, max +15
    
    final_score = min(100, score + modifier)
    
    return {
        'compatibility_score': final_score,
        'core_number_1': core1,
        'core_number_2': core2,
        'difference': diff,
        'base_score': score,
        'shared_digits_modifier': modifier,
        'shared_digits': list(shared_digits)
    }

