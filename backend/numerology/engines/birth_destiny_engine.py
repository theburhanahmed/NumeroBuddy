import json
from pathlib import Path
from .conflict_resolver import ConflictResolver

class NumerologyBaseEngine:
    def __init__(self):
        self.rules_path = Path(__file__).resolve().parents[3] / 'rules'
        self.conflict_resolver = ConflictResolver()

    def load_rules(self, filename):
        with (self.rules_path / filename).open() as f:
            return json.load(f)

    def reduce_to_single_digit(self, n, exclude_master=False):
        if exclude_master and n in [11, 22, 33]:
            return n
        while n > 9:
            if exclude_master and n in [11, 22, 33]:
                return n
            n = sum(int(digit) for digit in str(n))
        return n

    def sum_digits(self, n):
        return sum(int(digit) for digit in str(n))

class BirthDestinyEngine(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules = self.load_rules('core_numbers_characteristics.rules.json')

    def calculate(self, day, month, year):
        birth_number = self.reduce_to_single_digit(day)
        
        # Destiny number calculation
        full_dob_sum = day + month + year
        destiny_number = self.reduce_to_single_digit(full_dob_sum)
        
        # Check for Master Numbers - preserve them
        master_numbers = []
        if day in [11, 22, 33]:
            master_numbers.append(day)
            # Validate master number preservation
            master_warning = self.conflict_resolver.validate_master_number_preservation(
                day, "birth day calculation"
            )
        
        # Reduction of full DOB for master check
        def get_master_sum(d, m, y):
            s = self.sum_digits(d) + self.sum_digits(m) + self.sum_digits(y)
            if s in [11, 22, 33]:
                return s
            return None
        
        m_sum = get_master_sum(day, month, year)
        if m_sum:
            master_numbers.append(m_sum)
            master_warning = self.conflict_resolver.validate_master_number_preservation(
                m_sum, "destiny number calculation"
            )
        
        # Check for Karmic Debt
        karmic_debts = []
        # Day checks
        if day in [13, 14, 16, 19]:
            karmic_debts.append(day)
        
        # Traits and warnings from rules
        birth_traits = next((item for item in self.rules['outputs'] if item['number'] == birth_number), {})
        destiny_traits = next((item for item in self.rules['outputs'] if item['number'] == destiny_number), {})
        
        # Rule-based warnings
        warnings = []
        for debt in karmic_debts:
            warning = next((w for w in self.rules['warnings'] if w['id'] == f"karmic_debt_{debt}"), None)
            if warning:
                warnings.append(warning)
        
        # Conflict resolution validation
        conflict_warnings = self.conflict_resolver.validate_karmic_debts([day, full_dob_sum])
        conflict_warnings.extend(self.conflict_resolver.validate_risky_numbers([birth_number, destiny_number]))
        
        # Sun worship exclusion check
        sun_warning = self.conflict_resolver.validate_sun_worship_exclusion(birth_number, destiny_number)
        if sun_warning:
            conflict_warnings.append(sun_warning)
        
        # Combine all warnings
        all_warnings = warnings + conflict_warnings
        
        # Check for opposite number conflict (internal)
        opposite_warning = self.conflict_resolver.validate_opposite_numbers(birth_number, destiny_number)
        if opposite_warning:
            all_warnings.append(opposite_warning)

        return {
            "birth_number": birth_number,
            "destiny_number": destiny_number,
            "master_numbers": list(set(master_numbers)),
            "karmic_debts": karmic_debts,
            "birth_traits": birth_traits,
            "destiny_traits": destiny_traits,
            "warnings": all_warnings,
            "mark": "deterministic"
        }
