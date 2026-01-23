import json
import os

class NumerologyBaseEngine:
    def __init__(self):
        self.rules_path = os.path.join(os.getcwd(), 'rules')

    def load_rules(self, filename):
        with open(os.path.join(self.rules_path, filename), 'r') as f:
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
        
        # Check for Master Numbers
        master_numbers = []
        if self.sum_digits(day) in [11, 22]:
            master_numbers.append(self.sum_digits(day))
        
        # Reduction of full DOB for master check
        def get_master_sum(d, m, y):
            s = self.sum_digits(d) + self.sum_digits(m) + self.sum_digits(y)
            if s in [11, 22, 33]:
                return s
            return None
        
        m_sum = get_master_sum(day, month, year)
        if m_sum:
            master_numbers.append(m_sum)

        # Check for Karmic Debt
        karmic_debts = []
        # Day checks
        if day in [13, 14, 16, 19]:
            karmic_debts.append(day)
        
        # Traits and warnings from rules
        birth_traits = next((item for item in self.rules['outputs'] if item['number'] == birth_number), {})
        destiny_traits = next((item for item in self.rules['outputs'] if item['number'] == destiny_number), {})
        
        warnings = []
        for debt in karmic_debts:
            warning = next((w for w in self.rules['warnings'] if w['id'] == f"karmic_debt_{debt}"), None)
            if warning:
                warnings.append(warning)

        return {
            "birth_number": birth_number,
            "destiny_number": destiny_number,
            "master_numbers": list(set(master_numbers)),
            "karmic_debts": karmic_debts,
            "birth_traits": birth_traits,
            "destiny_traits": destiny_traits,
            "warnings": warnings,
            "mark": "deterministic"
        }
