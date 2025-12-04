"""
Unit tests for name normalization and transliteration.
"""
import pytest
from numerology.name_numerology import normalize_name


def test_strip_whitespace():
    """Test that leading/trailing whitespace is removed."""
    assert normalize_name("  John Doe  ") == "john doe"
    assert normalize_name("\t\nJohn\n\t") == "john"


def test_collapse_multiple_spaces():
    """Test that multiple spaces are collapsed to single space."""
    assert normalize_name("John    Doe") == "john doe"
    assert normalize_name("John  Mary  Jane") == "john mary jane"


def test_remove_punctuation():
    """Test that punctuation is removed."""
    assert normalize_name("John-Doe") == "john doe"
    assert normalize_name("O'Connor") == "o connor"
    assert normalize_name("Mary-Jane") == "mary jane"


def test_strip_diacritics():
    """Test that diacritics are stripped."""
    assert normalize_name("Émilie") == "emilie"
    assert normalize_name("José") == "jose"
    assert normalize_name("François") == "francois"


def test_lowercase():
    """Test that result is lowercased."""
    assert normalize_name("JOHN DOE") == "john doe"
    assert normalize_name("John Doe") == "john doe"


def test_transliteration():
    """Test transliteration of non-Latin characters."""
    # These depend on the transliteration map
    result = normalize_name("Émilie", transliterate=True)
    assert result == "emilie"  # é should be transliterated to e
    
    result = normalize_name("José", transliterate=True)
    assert result == "jose"  # é should be transliterated to e


def test_transliteration_disabled():
    """Test that transliteration can be disabled."""
    # When transliteration is disabled, diacritics should still be stripped
    result = normalize_name("Émilie", transliterate=False)
    assert "é" not in result.lower()


def test_empty_string():
    """Test that empty string returns empty string."""
    assert normalize_name("") == ""
    assert normalize_name("   ") == ""


def test_non_latin_characters():
    """Test handling of non-Latin characters."""
    # Non-Latin characters should be removed if not in transliteration map
    result = normalize_name("John123", transliterate=True)
    assert "123" not in result
    assert result == "john"

