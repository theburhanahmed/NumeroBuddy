"""
Validation Mode System for Numerobuddy.

Tracks what was calculated, what was ignored, why recommendations were allowed/blocked,
and what risks were detected. Used by all engines for validation mode.
"""
from typing import Dict, List, Optional, Any
from .validation_checklist import ValidationChecklist, ValidationTracker
from .conflict_resolver import ConflictResolver


class ValidationMode:
    """
    Validation mode that tracks all calculations, conflicts, and decisions.
    Logic-only module - no UI components.
    """
    
    def __init__(self):
        """Initialize validation mode with tracker and conflict resolver."""
        self.tracker = ValidationTracker()
        self.checklist = self.tracker.checklist
        self.conflict_resolver = ConflictResolver()
    
    def validate_calculation(self, engine_name: str, calculation_type: str,
                            inputs: Dict[str, Any], outputs: Dict[str, Any],
                            deterministic: bool = True):
        """
        Record and validate a calculation.
        
        Args:
            engine_name: Name of the engine
            calculation_type: Type of calculation
            inputs: Input values
            outputs: Output values
            deterministic: Whether calculation is deterministic
        """
        # Record calculation
        self.checklist.add_calculation(
            engine_name=engine_name,
            calculation_type=calculation_type,
            inputs=inputs,
            outputs=outputs,
            deterministic=deterministic
        )
        
        # Validate outputs for conflicts
        context = {
            'birth_number': inputs.get('birth_number') or outputs.get('birth_number'),
            'destiny_number': inputs.get('destiny_number') or outputs.get('destiny_number'),
            'personal_year': inputs.get('personal_year') or outputs.get('personal_year'),
            'compound_number': inputs.get('compound_number') or outputs.get('compound_number'),
            'name_total': inputs.get('name_total') or outputs.get('name_total'),
            'phone_number': inputs.get('phone_number') or str(inputs.get('phone_number', '')),
            'psychic1': inputs.get('psychic1') or inputs.get('psychic_number'),
            'psychic2': inputs.get('psychic2') or inputs.get('partner_psychic'),
        }
        
        # Resolve conflicts
        resolved = self.conflict_resolver.resolve_conflicts(outputs, context)
        
        # Record warnings and conflicts
        for warning in resolved.get('warnings', []):
            self.checklist.add_warning(
                warning_type=warning.get('type', 'unknown'),
                severity=warning.get('severity', 'medium'),
                message=warning.get('message', ''),
                overrides=warning.get('override', False)
            )
        
        # Record conflicts resolved
        for conflict_type in resolved.get('conflicts_detected', []):
            self.checklist.add_conflict_resolved(
                conflict_type=conflict_type,
                resolution='Applied priority rule override',
                priority_rule=f"Conflict resolution rule for {conflict_type}",
                overridden_values=outputs
            )
        
        return resolved
    
    def record_ignored(self, item: str, reason: str, category: str = "general"):
        """Record an ignored item."""
        self.checklist.add_ignored(item, reason, category)
    
    def record_recommendation_allowed(self, recommendation: str, reason: str,
                                     conditions: Optional[List[str]] = None):
        """Record an allowed recommendation."""
        self.checklist.add_recommendation_allowed(recommendation, reason, conditions)
    
    def record_recommendation_blocked(self, recommendation: str, reason: str,
                                     blocking_rules: List[str]):
        """Record a blocked recommendation."""
        self.checklist.add_recommendation_blocked(recommendation, reason, blocking_rules)
    
    def record_risk(self, risk_type: str, severity: str, description: str,
                   affected_numbers: Optional[List[int]] = None):
        """Record a detected risk."""
        self.checklist.add_risk(risk_type, severity, description, affected_numbers)
        
        # Also add as warning if high severity
        if severity == 'high':
            self.checklist.add_warning(
                warning_type=risk_type,
                severity=severity,
                message=description,
                overrides=True
            )
    
    def generate_validation_report(self) -> Dict[str, Any]:
        """
        Generate comprehensive validation report.
        
        Returns:
            Dictionary containing validation report
        """
        report = self.checklist.generate_report()
        
        # Add validation summary
        report['validation_summary'] = {
            'total_calculations': len(self.checklist.calculations),
            'deterministic_calculations': len([c for c in self.checklist.calculations if c['deterministic']]),
            'non_deterministic_calculations': len([c for c in self.checklist.calculations if not c['deterministic']]),
            'high_severity_warnings': len([w for w in self.checklist.warnings_emitted if w['severity'] == 'high']),
            'medium_severity_warnings': len([w for w in self.checklist.warnings_emitted if w['severity'] == 'medium']),
            'low_severity_warnings': len([w for w in self.checklist.warnings_emitted if w['severity'] == 'low']),
            'recommendations_blocked': len(self.checklist.recommendations_blocked),
            'recommendations_allowed': len(self.checklist.recommendations_allowed),
            'conflicts_resolved': len(self.checklist.conflicts_resolved),
            'risks_detected': len(self.checklist.risks_detected),
            'validation_passed': report['validation_passed']
        }
        
        return report
    
    def reset(self):
        """Reset validation mode."""
        self.checklist.reset()
    
    def get_what_was_calculated(self) -> List[Dict[str, Any]]:
        """Get list of all calculations performed."""
        return self.checklist.calculations.copy()
    
    def get_what_was_ignored(self) -> List[Dict[str, Any]]:
        """Get list of all ignored items."""
        return self.ignored_items.copy()
    
    def get_why_recommendation_allowed(self, recommendation: str) -> Optional[Dict[str, Any]]:
        """Get reason why a recommendation was allowed."""
        for rec in self.checklist.recommendations_allowed:
            if rec['recommendation'] == recommendation:
                return rec
        return None
    
    def get_why_recommendation_blocked(self, recommendation: str) -> Optional[Dict[str, Any]]:
        """Get reason why a recommendation was blocked."""
        for rec in self.checklist.recommendations_blocked:
            if rec['recommendation'] == recommendation:
                return rec
        return None
    
    def get_risks_detected(self) -> List[Dict[str, Any]]:
        """Get list of all risks detected."""
        return self.checklist.risks_detected.copy()
    
    def get_warnings_emitted(self) -> List[Dict[str, Any]]:
        """Get list of all warnings emitted."""
        return self.checklist.warnings_emitted.copy()
    
    def get_conflicts_resolved(self) -> List[Dict[str, Any]]:
        """Get list of all conflicts resolved."""
        return self.checklist.conflicts_resolved.copy()
