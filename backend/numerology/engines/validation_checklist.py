"""
Unified Validation Checklist System for Numerobuddy.

Tracks what was calculated, what was ignored, why recommendations were allowed/blocked,
and what risks were detected. Used by all engines for validation mode.
"""
from typing import Dict, List, Optional, Any, Set
from datetime import datetime


class ValidationChecklist:
    """
    Validation checklist that tracks all calculations, conflicts, and decisions.
    Logic-only module - no UI components.
    """
    
    def __init__(self):
        """Initialize validation checklist."""
        self.calculations = []
        self.ignored_items = []
        self.recommendations_allowed = []
        self.recommendations_blocked = []
        self.risks_detected = []
        self.conflicts_resolved = []
        self.warnings_emitted = []
    
    def add_calculation(self, engine_name: str, calculation_type: str, 
                       inputs: Dict[str, Any], outputs: Dict[str, Any],
                       deterministic: bool = True):
        """
        Record a calculation performed by an engine.
        
        Args:
            engine_name: Name of the engine (e.g., 'BirthDestinyEngine')
            calculation_type: Type of calculation (e.g., 'birth_number', 'personal_year')
            inputs: Input values used
            outputs: Output values produced
            deterministic: Whether calculation is deterministic
        """
        self.calculations.append({
            'timestamp': datetime.now().isoformat(),
            'engine': engine_name,
            'type': calculation_type,
            'inputs': inputs,
            'outputs': outputs,
            'deterministic': deterministic
        })
    
    def add_ignored(self, item: str, reason: str, category: str = "general"):
        """
        Record an item that was ignored during processing.
        
        Args:
            item: Description of ignored item
            reason: Why it was ignored
            category: Category (stories, examples, marketing, etc.)
        """
        self.ignored_items.append({
            'timestamp': datetime.now().isoformat(),
            'item': item,
            'reason': reason,
            'category': category
        })
    
    def add_recommendation_allowed(self, recommendation: str, reason: str,
                                   conditions: Optional[List[str]] = None):
        """
        Record a recommendation that was allowed.
        
        Args:
            recommendation: Description of recommendation
            reason: Why it was allowed
            conditions: Conditions that enabled it
        """
        self.recommendations_allowed.append({
            'timestamp': datetime.now().isoformat(),
            'recommendation': recommendation,
            'reason': reason,
            'conditions': conditions or []
        })
    
    def add_recommendation_blocked(self, recommendation: str, reason: str,
                                   blocking_rules: List[str]):
        """
        Record a recommendation that was blocked.
        
        Args:
            recommendation: Description of recommendation
            reason: Why it was blocked
            blocking_rules: List of rules that blocked it
        """
        self.recommendations_blocked.append({
            'timestamp': datetime.now().isoformat(),
            'recommendation': recommendation,
            'reason': reason,
            'blocking_rules': blocking_rules
        })
    
    def add_risk(self, risk_type: str, severity: str, description: str,
                 affected_numbers: Optional[List[int]] = None):
        """
        Record a detected risk.
        
        Args:
            risk_type: Type of risk (karmic_debt, risky_number, etc.)
            severity: Severity level (high, medium, low)
            description: Description of the risk
            affected_numbers: Numbers affected by the risk
        """
        self.risks_detected.append({
            'timestamp': datetime.now().isoformat(),
            'type': risk_type,
            'severity': severity,
            'description': description,
            'affected_numbers': affected_numbers or []
        })
    
    def add_conflict_resolved(self, conflict_type: str, resolution: str,
                             priority_rule: str, overridden_values: Optional[Dict] = None):
        """
        Record a conflict that was resolved.
        
        Args:
            conflict_type: Type of conflict
            resolution: How it was resolved
            priority_rule: Rule that determined priority
            overridden_values: Values that were overridden
        """
        self.conflicts_resolved.append({
            'timestamp': datetime.now().isoformat(),
            'type': conflict_type,
            'resolution': resolution,
            'priority_rule': priority_rule,
            'overridden_values': overridden_values or {}
        })
    
    def add_warning(self, warning_type: str, severity: str, message: str,
                   overrides: bool = False):
        """
        Record a warning that was emitted.
        
        Args:
            warning_type: Type of warning
            severity: Severity level
            message: Warning message
            overrides: Whether warning overrides other values
        """
        self.warnings_emitted.append({
            'timestamp': datetime.now().isoformat(),
            'type': warning_type,
            'severity': severity,
            'message': message,
            'overrides': overrides
        })
    
    def generate_report(self) -> Dict[str, Any]:
        """
        Generate a comprehensive validation report.
        
        Returns:
            Dictionary containing all validation information
        """
        return {
            'summary': {
                'total_calculations': len(self.calculations),
                'total_ignored': len(self.ignored_items),
                'recommendations_allowed': len(self.recommendations_allowed),
                'recommendations_blocked': len(self.recommendations_blocked),
                'risks_detected': len(self.risks_detected),
                'conflicts_resolved': len(self.conflicts_resolved),
                'warnings_emitted': len(self.warnings_emitted)
            },
            'calculations': self.calculations,
            'ignored_items': self.ignored_items,
            'recommendations_allowed': self.recommendations_allowed,
            'recommendations_blocked': self.recommendations_blocked,
            'risks_detected': self.risks_detected,
            'conflicts_resolved': self.conflicts_resolved,
            'warnings_emitted': self.warnings_emitted,
            'validation_passed': len([r for r in self.risks_detected if r['severity'] == 'high']) == 0
        }
    
    def reset(self):
        """Reset all checklist data."""
        self.calculations = []
        self.ignored_items = []
        self.recommendations_allowed = []
        self.recommendations_blocked = []
        self.risks_detected = []
        self.conflicts_resolved = []
        self.warnings_emitted = []


class ValidationTracker:
    """
    Singleton tracker that can be used across all engines.
    """
    _instance = None
    _checklist = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ValidationTracker, cls).__new__(cls)
            cls._checklist = ValidationChecklist()
        return cls._instance
    
    @property
    def checklist(self) -> ValidationChecklist:
        """Get the validation checklist instance."""
        return self._checklist
    
    def reset(self):
        """Reset the checklist."""
        self._checklist.reset()
