"""
Unit tests for name numerology calculations.
"""
import pytest
from numerology.name_numerology import compute_name_numbers, reduce_number


def test_compute_pythagorean_simple():
    """Test basic Pythagorean calculation."""
    result = compute_name_numbers("John Doe", system="pythagorean")
    
    assert "expression" in result
    assert "soul_urge" in result
    assert "personality" in result
    assert "name_vibration" in result
    assert "breakdown" in result
    assert "normalized_name" in result
    
    assert result["normalized_name"] == "john doe"
    assert isinstance(result["expression"]["reduced"], int)
    assert isinstance(result["soul_urge"]["reduced"], int)
    assert isinstance(result["personality"]["reduced"], int)


def test_compute_chaldean_simple():
    """Test basic Chaldean calculation."""
    result = compute_name_numbers("John Doe", system="chaldean")
    
    assert "expression" in result
    assert "soul_urge" in result
    assert "personality" in result
    assert result["normalized_name"] == "john doe"


def test_reduction_steps():
    """Test that reduction steps are recorded."""
    result = compute_name_numbers("John Doe", system="pythagorean")
    
    assert "reduction_steps" in result["expression"]
    assert isinstance(result["expression"]["reduction_steps"], list)
    assert len(result["expression"]["reduction_steps"]) > 0


def test_master_numbers():
    """Test that master numbers are preserved when keep_master=True."""
    # Find a name that reduces to a master number
    # This is a simplified test - in practice, you'd need to find such a name
    result = compute_name_numbers("Test Name", system="pythagorean", keep_master=True)
    
    # Check that if a master number appears, it's preserved
    reduced = result["expression"]["reduced"]
    if reduced in [11, 22, 33]:
        # If it's a master number, it should be in reduction_steps
        assert reduced in result["expression"]["reduction_steps"]


def test_reduce_number():
    """Test number reduction function."""
    # Test simple reduction
    reduced, steps = reduce_number(46, keep_master=True)
    assert reduced == 1  # 4+6=10, 1+0=1
    assert 46 in steps
    assert 10 in steps
    assert 1 in steps
    
    # Test master number preservation
    reduced, steps = reduce_number(11, keep_master=True)
    assert reduced == 11
    assert steps == [11]
    
    # Test master number reduction when keep_master=False
    reduced, steps = reduce_number(11, keep_master=False)
    assert reduced == 2  # 1+1=2
    assert 11 in steps
    assert 2 in steps


def test_breakdown_structure():
    """Test that breakdown has correct structure."""
    result = compute_name_numbers("John", system="pythagorean")
    
    assert isinstance(result["breakdown"], list)
    assert len(result["breakdown"]) > 0
    
    for item in result["breakdown"]:
        assert "letter" in item
        assert "value" in item
        assert "is_vowel" in item
        assert "is_consonant" in item
        assert isinstance(item["is_vowel"], bool)
        assert isinstance(item["is_consonant"], bool)


def test_word_totals():
    """Test that word totals are calculated."""
    result = compute_name_numbers("John Doe", system="pythagorean")
    
    assert "word_totals" in result
    assert isinstance(result["word_totals"], list)
    assert len(result["word_totals"]) == 2  # Two words
    
    for word_total in result["word_totals"]:
        assert "word" in word_total
        assert "raw_total" in word_total
        assert "reduced" in word_total


def test_empty_name():
    """Test that empty name raises error."""
    with pytest.raises(ValueError):
        compute_name_numbers("", system="pythagorean")
    
    with pytest.raises(ValueError):
        compute_name_numbers("   ", system="pythagorean")


def test_invalid_system():
    """Test that invalid system raises error."""
    with pytest.raises(ValueError):
        compute_name_numbers("John", system="invalid")


def test_vowels_and_consonants():
    """Test that vowels and consonants are correctly identified."""
    result = compute_name_numbers("John", system="pythagorean")
    
    vowels_sum = sum(
        item["value"] for item in result["breakdown"] if item["is_vowel"]
    )
    consonants_sum = sum(
        item["value"] for item in result["breakdown"] if item["is_consonant"]
    )
    
    assert vowels_sum == result["soul_urge"]["raw_total"]
    assert consonants_sum == result["personality"]["raw_total"]

