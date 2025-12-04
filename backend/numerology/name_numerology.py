"""
Pure deterministic logic for name numerology calculations.
No side effects, fully testable.
"""
import unicodedata
import re
import json
import os
from typing import Dict, List, Optional, Literal, Tuple
from pathlib import Path


# Letter-to-number mappings
PYTHAGOREAN_MAP = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
}

CHALDEAN_MAP = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 8, 'g': 3, 'h': 5, 'i': 1,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 7, 'p': 8, 'q': 1, 'r': 2,
    's': 3, 't': 4, 'u': 6, 'v': 6, 'w': 6, 'x': 5, 'y': 1, 'z': 7
}

VOWELS = set('aeiou')
MASTER_NUMBERS = {11, 22, 33}


def _load_transliteration_map() -> Dict[str, str]:
    """Load transliteration map from config file."""
    config_path = Path(__file__).parent.parent / 'config' / 'transliteration.json'
    
    # If config file doesn't exist, return empty dict
    if not config_path.exists():
        return {}
    
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return {}


TRANSLITERATION_MAP = _load_transliteration_map()


def normalize_name(name: str, transliterate: bool = True) -> str:
    """
    Normalize a name for numerology calculation.
    
    Steps:
    1. Remove leading/trailing whitespace
    2. Collapse multiple spaces to single space
    3. Remove punctuation except apostrophes (optional)
    4. Strip diacritics using Unicode normalization
    5. Lowercase result
    6. Apply transliteration map if enabled
    
    Args:
        name: Input name string
        transliterate: Whether to apply transliteration mapping
        
    Returns:
        Normalized name string
    """
    if not name:
        return ""
    
    # Step 1 & 2: Strip and collapse whitespace
    name = ' '.join(name.split())
    
    # Step 3: Remove punctuation (keep apostrophes for now, convert to space)
    # Convert apostrophes and hyphens to spaces
    name = re.sub(r"[''-]", ' ', name)
    # Remove other punctuation
    name = re.sub(r'[^\w\s]', '', name)
    
    # Step 4: Strip diacritics using Unicode normalization
    # Normalize to NFKD (decomposed form) then remove combining characters
    name = unicodedata.normalize('NFKD', name)
    name = ''.join(char for char in name if not unicodedata.combining(char))
    
    # Step 5: Lowercase
    name = name.lower()
    
    # Step 6: Apply transliteration if enabled
    if transliterate and TRANSLITERATION_MAP:
        # Apply transliteration character by character
        transliterated = []
        for char in name:
            if char in TRANSLITERATION_MAP:
                transliterated.append(TRANSLITERATION_MAP[char])
            else:
                transliterated.append(char)
        name = ''.join(transliterated)
    
    # Final cleanup: remove any remaining non-Latin characters that aren't letters or spaces
    name = re.sub(r'[^a-z\s]', '', name)
    
    # Collapse spaces again after transliteration
    name = ' '.join(name.split())
    
    return name


def letter_value(letter: str, system: Literal["pythagorean", "chaldean"]) -> Optional[int]:
    """
    Get numeric value for a letter.
    
    Args:
        letter: Single character (will be lowercased)
        system: Numerology system to use
        
    Returns:
        Numeric value or None if not a letter
    """
    letter = letter.lower()
    
    if not letter.isalpha():
        return None
    
    if system == "pythagorean":
        return PYTHAGOREAN_MAP.get(letter)
    elif system == "chaldean":
        return CHALDEAN_MAP.get(letter)
    else:
        raise ValueError(f"Unknown system: {system}")


def reduce_number(number: int, keep_master: bool = True) -> Tuple[int, List[int]]:
    """
    Reduce a number to single digit, optionally preserving master numbers.
    
    Args:
        number: Number to reduce
        keep_master: Whether to preserve master numbers (11, 22, 33)
        
    Returns:
        Tuple of (reduced_number, reduction_steps)
    """
    steps = [number]
    current = number
    
    while current > 9:
        if keep_master and current in MASTER_NUMBERS:
            break
        
        # Sum digits
        current = sum(int(digit) for digit in str(current))
        steps.append(current)
        
        if keep_master and current in MASTER_NUMBERS:
            break
    
    return current, steps


def compute_name_numbers(
    name: str,
    system: str,
    keep_master: bool = True
) -> Dict:
    """
    Compute all numerology numbers for a name.
    
    Args:
        name: Input name
        system: "pythagorean" or "chaldean"
        keep_master: Whether to preserve master numbers
        
    Returns:
        Dictionary with:
        - normalized_name: Normalized version of input
        - words: List of words in the name
        - breakdown: Per-letter breakdown
        - expression: Expression number (sum of all letters)
        - soul_urge: Soul urge number (sum of vowels)
        - personality: Personality number (sum of consonants)
        - name_vibration: Final reduced expression
        - word_totals: Per-word totals
    """
    if not name or not name.strip():
        raise ValueError("Name cannot be empty")
    
    # Normalize name
    normalized = normalize_name(name, transliterate=True)
    
    if not normalized:
        raise ValueError("Name normalized to empty string")
    
    # Get letter map based on system
    if system == "pythagorean":
        letter_map = PYTHAGOREAN_MAP
    elif system == "chaldean":
        letter_map = CHALDEAN_MAP
    else:
        raise ValueError(f"Unknown system: {system}")
    
    # Break into words
    words = normalized.split()
    
    # Build letter-by-letter breakdown
    breakdown = []
    all_letters_sum = 0
    vowels_sum = 0
    consonants_sum = 0
    vowels_letters = []
    consonants_letters = []
    
    for char in normalized:
        if char == ' ':
            continue
        
        value = letter_map.get(char)
        if value is None:
            continue
        
        is_vowel = char in VOWELS
        is_consonant = not is_vowel
        
        breakdown.append({
            'letter': char,
            'value': value,
            'is_vowel': is_vowel,
            'is_consonant': is_consonant
        })
        
        all_letters_sum += value
        
        if is_vowel:
            vowels_sum += value
            vowels_letters.append(char)
        else:
            consonants_sum += value
            consonants_letters.append(char)
    
    # Compute expression (sum of all letters)
    expression_reduced, expression_steps = reduce_number(all_letters_sum, keep_master)
    
    # Compute soul urge (sum of vowels)
    soul_urge_reduced, soul_urge_steps = reduce_number(vowels_sum, keep_master)
    
    # Compute personality (sum of consonants)
    personality_reduced, personality_steps = reduce_number(consonants_sum, keep_master)
    
    # Compute name vibration (same as expression reduced)
    name_vibration = expression_reduced
    
    # Compute per-word totals
    word_totals = []
    for word in words:
        word_sum = sum(letter_map.get(char, 0) for char in word if char.isalpha())
        word_reduced, _ = reduce_number(word_sum, keep_master)
        word_totals.append({
            'word': word,
            'raw_total': word_sum,
            'reduced': word_reduced
        })
    
    return {
        'normalized_name': normalized,
        'words': words,
        'breakdown': breakdown,
        'expression': {
            'raw_total': all_letters_sum,
            'reduced': expression_reduced,
            'reduction_steps': expression_steps
        },
        'soul_urge': {
            'raw_total': vowels_sum,
            'reduced': soul_urge_reduced,
            'reduction_steps': soul_urge_steps,
            'letters': vowels_letters
        },
        'personality': {
            'raw_total': consonants_sum,
            'reduced': personality_reduced,
            'reduction_steps': personality_steps,
            'letters': consonants_letters
        },
        'name_vibration': name_vibration,
        'word_totals': word_totals
    }

