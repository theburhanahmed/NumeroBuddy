"""
Unit tests for letter-to-number mappings.
"""
import pytest
from numerology.name_numerology import PYTHAGOREAN_MAP, CHALDEAN_MAP, letter_value


def test_pythagorean_map_complete():
    """Test that Pythagorean map has all letters A-Z."""
    letters = "abcdefghijklmnopqrstuvwxyz"
    assert set(PYTHAGOREAN_MAP.keys()) == set(letters)
    
    # Test specific values
    assert PYTHAGOREAN_MAP['a'] == 1
    assert PYTHAGOREAN_MAP['j'] == 1
    assert PYTHAGOREAN_MAP['z'] == 8
    assert PYTHAGOREAN_MAP['i'] == 9


def test_chaldean_map_complete():
    """Test that Chaldean map has all letters A-Z."""
    letters = "abcdefghijklmnopqrstuvwxyz"
    assert set(CHALDEAN_MAP.keys()) == set(letters)
    
    # Test specific values
    assert CHALDEAN_MAP['a'] == 1
    assert CHALDEAN_MAP['z'] == 7
    assert CHALDEAN_MAP['i'] == 1
    assert CHALDEAN_MAP['f'] == 8


def test_letter_value_pythagorean():
    """Test letter_value function with Pythagorean system."""
    assert letter_value('A', 'pythagorean') == 1
    assert letter_value('a', 'pythagorean') == 1
    assert letter_value('J', 'pythagorean') == 1
    assert letter_value('Z', 'pythagorean') == 8
    assert letter_value('I', 'pythagorean') == 9


def test_letter_value_chaldean():
    """Test letter_value function with Chaldean system."""
    assert letter_value('A', 'chaldean') == 1
    assert letter_value('a', 'chaldean') == 1
    assert letter_value('Z', 'chaldean') == 7
    assert letter_value('I', 'chaldean') == 1
    assert letter_value('F', 'chaldean') == 8


def test_letter_value_non_letter():
    """Test letter_value returns None for non-letters."""
    assert letter_value('1', 'pythagorean') is None
    assert letter_value(' ', 'pythagorean') is None
    assert letter_value('@', 'pythagorean') is None


def test_letter_value_invalid_system():
    """Test letter_value raises error for invalid system."""
    with pytest.raises(ValueError):
        letter_value('A', 'invalid')

