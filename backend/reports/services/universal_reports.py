from typing import Any

from accounts.models import User
from reports.models import UniversalReport


def persist_report(user: User, payload: dict[str, Any]) -> UniversalReport:
    """Persist an immutable calculation payload as a universal report."""
    return UniversalReport.objects.create(user=user, **payload)


def duplicate_report(report: UniversalReport) -> UniversalReport:
    """Create a new editable copy without re-running calculations."""
    return UniversalReport.objects.create(
        user=report.user,
        report_type=report.report_type,
        title=f'{report.title} (copy)',
        input_data=report.input_data,
        calculated_results=report.calculated_results,
        ai_insights=report.ai_insights,
        recommendations=report.recommendations,
        remedies=report.remedies,
        metadata=report.metadata,
        is_saved=report.is_saved,
        is_pinned=False,
        pdf_status='not_requested',
    )
