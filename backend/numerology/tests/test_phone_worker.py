"""
Tests for phone numerology worker task.
"""
import pytest
from unittest.mock import patch, MagicMock
from numerology.tasks import generate_phone_report
from numerology.models import PhoneReport
from accounts.models import User


@pytest.mark.django_db
@patch('numerology.services.phone_explainer.generate_phone_explanation')
def test_worker_persists_with_explainer(mock_explainer, db_session):
    """Test that worker persists report with LLM explanation."""
    # Create a test user
    user = User.objects.create_user(
        email='test@example.com',
        password='testpass123'
    )
    
    # Mock LLM explainer
    mock_explainer.return_value = {
        'explanation': {
            'short_summary': 'Mock summary',
            'long_explanation': 'Mock long explanation',
            'action_points': ['Action 1', 'Action 2', 'Action 3'],
            'confidence_notes': 'Mock confidence notes'
        },
        'tokens_used': 100,
        'latency_ms': 500
    }
    
    # Call worker task
    result = generate_phone_report(
        user_id=str(user.id),
        phone_number='+1 (415) 555-2671',
        country_hint='US',
        method='core',
        persist=True,
        force_refresh=False,
        convert_vanity=False
    )
    
    # Check result
    assert 'report_id' in result
    assert result['status'] == 'completed'
    
    # Check database
    report = PhoneReport.objects.get(id=result['report_id'])
    assert report.user == user
    assert report.phone_e164 == '+14155552671'
    assert report.method == 'core'
    assert report.explanation is not None
    assert report.explanation['short_summary'] == 'Mock summary'
    assert report.explanation_error is None


@pytest.mark.django_db
@patch('numerology.services.phone_explainer.generate_phone_explanation')
def test_worker_handles_llm_failure(mock_explainer, db_session):
    """Test that worker persists numbers even if LLM fails."""
    # Create a test user
    user = User.objects.create_user(
        email='test2@example.com',
        password='testpass123'
    )
    
    # Mock LLM explainer to fail
    mock_explainer.return_value = {
        'error': 'LLM service unavailable',
        'explanation': None
    }
    
    # Call worker task
    result = generate_phone_report(
        user_id=str(user.id),
        phone_number='+1 (415) 555-2671',
        method='core',
        persist=True,
        force_refresh=False,
        convert_vanity=False
    )
    
    # Check result
    assert 'report_id' in result
    
    # Check database - should have computed data but no explanation
    report = PhoneReport.objects.get(id=result['report_id'])
    assert report.computed is not None
    assert report.explanation is None
    assert report.explanation_error is not None


@pytest.mark.django_db
def test_worker_with_invalid_phone(db_session):
    """Test worker with invalid phone number."""
    user = User.objects.create_user(
        email='test3@example.com',
        password='testpass123'
    )
    
    # Call worker with invalid phone
    result = generate_phone_report(
        user_id=str(user.id),
        phone_number='invalid',
        method='core',
        persist=True,
        force_refresh=False,
        convert_vanity=False
    )
    
    # Should return error
    assert 'error' in result
    assert 'invalid' in result['error'].lower()


@pytest.mark.django_db
@patch('numerology.services.phone_explainer.generate_phone_explanation')
def test_worker_without_persistence(mock_explainer, db_session):
    """Test worker with persist=False."""
    user = User.objects.create_user(
        email='test4@example.com',
        password='testpass123'
    )
    
    mock_explainer.return_value = {
        'explanation': {'short_summary': 'Test'},
        'tokens_used': 50
    }
    
    # Call worker with persist=False
    result = generate_phone_report(
        user_id=str(user.id),
        phone_number='+1 (415) 555-2671',
        method='core',
        persist=False,
        force_refresh=False,
        convert_vanity=False
    )
    
    # Should return computed data without persisting
    assert result['status'] == 'computed'
    assert 'computed' in result
    assert 'explanation' in result
    
    # Should not be in database
    assert PhoneReport.objects.filter(user=user).count() == 0


@pytest.mark.django_db
@patch('numerology.services.phone_explainer.generate_phone_explanation')
def test_worker_force_refresh(mock_explainer, db_session):
    """Test worker with force_refresh=True."""
    user = User.objects.create_user(
        email='test5@example.com',
        password='testpass123'
    )
    
    mock_explainer.return_value = {
        'explanation': {'short_summary': 'Test'},
        'tokens_used': 50
    }
    
    # Create existing report
    PhoneReport.objects.create(
        user=user,
        phone_raw='+1 (415) 555-2671',
        phone_e164='+14155552671',
        method='core',
        computed={'test': 'data'}
    )
    
    # Call worker with force_refresh=True
    result = generate_phone_report(
        user_id=str(user.id),
        phone_number='+1 (415) 555-2671',
        method='core',
        persist=True,
        force_refresh=True,
        convert_vanity=False
    )
    
    # Should create new report
    assert 'report_id' in result
    assert result['status'] == 'completed'
    
    # Should have 2 reports now
    assert PhoneReport.objects.filter(user=user).count() == 2

