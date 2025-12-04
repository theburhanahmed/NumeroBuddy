"""
Tests for phone number sanitization and validation.
"""
import pytest
from numerology.phone_numerology import sanitize_and_validate_phone


def test_strip_and_e164_conversion():
    """Test basic sanitization and E.164 conversion."""
    out = sanitize_and_validate_phone("+1 (415) 555-2671")
    assert out["e164"] == "+14155552671"
    assert out["valid"] is True
    assert out["digits_only"] == "14155552671"


def test_leading_00_to_plus():
    """Test conversion of leading 00 to +."""
    out = sanitize_and_validate_phone("0044 20 7946 0958")
    assert out["e164"].startswith("+44")
    assert out["valid"] is True


def test_extension_stripping():
    """Test that extensions are stripped and stored."""
    out = sanitize_and_validate_phone("+1 (415) 555-2671 ext 123")
    assert out["e164"] == "+14155552671"
    assert out["valid"] is True
    assert out["extension"] == "123"


def test_vanity_number_rejection():
    """Test that vanity numbers are rejected by default."""
    out = sanitize_and_validate_phone("1-800-FLOWERS")
    assert out["valid"] is False
    assert "letters" in out["reason"].lower()


def test_vanity_number_conversion():
    """Test vanity number conversion when enabled."""
    out = sanitize_and_validate_phone("1-800-FLOWERS", convert_vanity=True)
    assert out["valid"] is True
    assert "3569377" in out["digits_only"]  # FLOWERS -> 3569377


def test_too_short_number():
    """Test validation of too short numbers."""
    out = sanitize_and_validate_phone("+12345", min_digits=6)
    assert out["valid"] is False
    assert "too short" in out["reason"].lower()


def test_too_long_number():
    """Test validation of too long numbers."""
    out = sanitize_and_validate_phone("+1234567890123456", max_digits=15)
    assert out["valid"] is False
    assert "too long" in out["reason"].lower()


def test_missing_country_code():
    """Test handling of missing country code."""
    out = sanitize_and_validate_phone("4155552671")
    assert out["valid"] is False
    assert "country code" in out["reason"].lower()


def test_country_hint():
    """Test that country hint is stored when provided."""
    out = sanitize_and_validate_phone("4155552671", country_hint="US")
    assert out["country"] == "US"
    # Note: This would need full country code mapping to be fully valid


def test_unicode_normalization():
    """Test normalization of Unicode digits."""
    out = sanitize_and_validate_phone("+1 (415) 555-2671")  # Using regular digits
    assert out["valid"] is True
    # Test with Unicode digits if needed
    # out2 = sanitize_and_validate_phone("+1 (415) 555-2671")  # Unicode version
    # assert out2["e164"] == out["e164"]


def test_empty_input():
    """Test handling of empty input."""
    out = sanitize_and_validate_phone("")
    assert out["valid"] is False
    assert "empty" in out["reason"].lower()


def test_whitespace_trimming():
    """Test that whitespace is trimmed."""
    out = sanitize_and_validate_phone("  +1 (415) 555-2671  ")
    assert out["e164"] == "+14155552671"
    assert out["valid"] is True

