from .birth_destiny_engine import NumerologyBaseEngine

class PersonalYearEngine(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules = self.load_rules('personal_years.rules.json')

    def calculate(self, birth_day, birth_month, current_year, birth_year, driver_number):
        # Universal Year
        universal_year = self.reduce_to_single_digit(current_year)
        
        # Personal Year: Universal Year + Birth Day + Birth Month
        # Note: Rule says Step 1 (UY) + Step 2 (Day+Month)
        step2 = self.reduce_to_single_digit(birth_day + birth_month)
        personal_year = self.reduce_to_single_digit(universal_year + step2)
        
        # Running Age
        running_age = current_year - birth_year
        age_digit = self.reduce_to_single_digit(running_age)
        
        # Eventful Years logic
        # As per Chaldean Numerology, running age significance depends on the digit of age.
        # Check if age digit is compatible with birth/destiny/sun (simplified to driver here)
        def is_age_good(age, driver):
            mapping = self.rules['eventful_years_mapping']
            return driver in mapping.get(str(self.reduce_to_single_digit(age)), [])

        def is_py_good(py, driver):
            # Check good_for, okay_for, worst_for in personal_year rules
            py_data = next((p for p in self.rules['outputs'] if p['personal_year'] == py), {})
            if driver in py_data.get('good_for', []):
                return True
            if 'all' in py_data.get('good_for', []):
                return True
            return False

        is_py_compatible = is_py_good(personal_year, driver_number)
        is_age_compatible = is_age_good(running_age, driver_number)
        
        status = ""
        symbol = ""
        if is_py_compatible and is_age_compatible:
            status = "double_strength_success_year"
            symbol = "**"
        elif is_age_compatible and not is_py_compatible:
            status = "year_of_contradiction"
            symbol = "*0"
        elif not is_age_compatible and not is_py_compatible:
            status = "year_of_caution"
            symbol = "00"
        else:
            status = "standard_year"
            symbol = "*" if is_py_compatible else "0"

        # Personal Months
        personal_months = []
        for m in range(1, 13):
            pm = self.reduce_to_single_digit(m + personal_year)
            personal_months.append({"month": m, "value": pm})

        py_data = next((p for p in self.rules['outputs'] if p['personal_year'] == personal_year), {})
        warning = next((w for w in self.rules['warnings'] if w['personal_year'] == personal_year), None)
        remedy = next((r for r in self.rules['remedies'] if r['personal_year'] == personal_year), None)

        return {
            "universal_year": universal_year,
            "personal_year": personal_year,
            "running_age": running_age,
            "status": status,
            "symbol": symbol,
            "py_significance": py_data.get('significance'),
            "positive_aspects": py_data.get('positive'),
            "negative_aspects": py_data.get('negative'),
            "personal_months": personal_months,
            "warning": warning,
            "remedy": remedy,
            "mark": "deterministic"
        }
