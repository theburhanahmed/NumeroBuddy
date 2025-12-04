"""
Tests for phone number numerology calculations.
"""
import pytest
from numerology.phone_numerology import (
    compute_phone_numerology,
    reduce_number,
    compute_compatibility_score
)


def test_core_number_calculation():
    """Test core number calculation."""
    result = compute_phone_numerology("+14155552671", method="core", core_scope="national")
    
    # National digits: 4155552671
    # Sum: 4+1+5+5+5+5+2+6+7+1 = 41
    # Reduced: 4+1 = 5
    assert result["core_number"]["raw_total"] == 41
    assert result["core_number"]["reduced"] == 5
    assert 5 in result["core_number"]["reduction_steps"]


def test_repeated_digits():
    """Test repeated digits detection."""
    result = compute_phone_numerology("+14155552671", method="core", core_scope="national")
    
    # Digit 5 appears 4 times
    assert result["repeated_digits"]["5"] == 4
    assert result["dominant_digit"] == "5"


def test_positional_sequence():
    """Test positional sequence calculation."""
    result = compute_phone_numerology("+14155552671", method="core", core_scope="national")
    
    assert len(result["positional_sequence"]) > 0
    first = result["positional_sequence"][0]
    assert first["position"] == 1
    assert first["digit"] == "4"
    assert first["running_total"] == 4
    assert first["running_reduced"] == 4


def test_pair_sums():
    """Test pair sums calculation."""
    result = compute_phone_numerology("+14155552671", method="core", core_scope="national")
    
    assert len(result["pair_sums"]) > 0
    first_pair = result["pair_sums"][0]
    assert "pair" in first_pair
    assert "raw" in first_pair
    assert "reduced" in first_pair
    # First pair: 4-1 = 5
    assert first_pair["raw"] == 5
    assert first_pair["reduced"] == 5


def test_evidence_map():
    """Test that evidence map is created."""
    result = compute_phone_numerology("+14155552671", method="core", core_scope="national")
    
    assert "evidence_map" in result
    assert "E1" in result["evidence_map"]
    assert "E2" in result["evidence_map"]
    assert "E3" in result["evidence_map"]
    assert "E4" in result["evidence_map"]
    assert "E5" in result["evidence_map"]


def test_reduce_number():
    """Test number reduction algorithm."""
    reduced, steps = reduce_number(41, keep_master=False)
    assert reduced == 5
    assert 41 in steps
    assert 5 in steps


def test_reduce_number_with_master():
    """Test number reduction with master number preservation."""
    reduced, steps = reduce_number(11, keep_master=True)
    assert reduced == 11
    assert 11 in steps


def test_reduce_number_single_digit():
    """Test reduction of single digit."""
    reduced, steps = reduce_number(5, keep_master=False)
    assert reduced == 5
    assert steps == [5]


def test_compatibility_score():
    """Test compatibility score calculation."""
    result = compute_compatibility_score(
        "+14155552671",
        "+14155552672",
        core_scope="national",
        keep_master=False
    )
    
    assert "compatibility_score" in result
    assert 0 <= result["compatibility_score"] <= 100
    assert "core_number_1" in result
    assert "core_number_2" in result
    assert "difference" in result


def test_compatibility_same_numbers():
    """Test compatibility when numbers are the same."""
    result = compute_compatibility_score(
        "+14155552671",
        "+14155552671",
        core_scope="national",
        keep_master=False
    )
    
    # Same numbers should have high compatibility
    assert result["compatibility_score"] >= 80
    assert result["difference"] == 0


def test_full_scope_calculation():
    """Test calculation with full scope (including country code)."""
    result = compute_phone_numerology("+14155552671", method="core", core_scope="full")
    
    # Should include country code digit
    assert result["core_number"]["raw_total"] > 41  # More than national only
    assert "digits" in result

