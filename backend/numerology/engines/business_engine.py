from .birth_destiny_engine import NumerologyBaseEngine

class BusinessEngine(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules_biz = self.load_rules('business_numerology.rules.json')
        self.rules_chaldean = self.load_rules('chaldean_name_numerology.rules.json')

    def calculate_name_value(self, name):
        table = self.rules_chaldean['calculations'][0]['table']
        total = 0
        for char in name.upper():
            if char in table:
                total += table[char]
        return total

    def analyze_business(self, company_name, birth_number, destiny_number):
        # Exclusions logic (simplified for logic engine)
        clean_name = company_name.upper()
        exclusions = ['PVT LTD', 'LTD', 'LLP', 'HUF', 'SENIOR SECONDARY']
        for exc in exclusions:
            clean_name = clean_name.replace(exc, "").strip()
        
        name_total = self.calculate_name_value(clean_name)
        root_number = self.reduce_to_single_digit(name_total)
        
        # Harmony check
        # For simplicity, we check if root_number is in birth_number's lucky list
        # We need to load lucky table for this
        lucky_rules = self.load_rules('eklavya_brahmastra.rules.json')
        lucky_data = next((item for item in lucky_rules['outputs'][1]['table'] if item['number'] == birth_number), {})
        
        is_harmonious = root_number in lucky_data.get('lucky', [])
        
        # Conflict resolution: Name correction priority
        conflict_warnings = []
        name_warning = self.conflict_resolver.validate_name_correction_priority(root_number, birth_number)
        if name_warning:
            conflict_warnings.append(name_warning)
            # Override harmony if name correction required
            is_harmonious = False
        
        # Check if name total is risky
        if root_number in self.conflict_resolver.RISKY_NUMBERS:
            conflict_warnings.extend(
                self.conflict_resolver.validate_risky_numbers([root_number])
            )
        
        return {
            "company_name": company_name,
            "clean_name": clean_name,
            "name_total": name_total,
            "root_number": root_number,
            "is_harmonious": is_harmonious,
            "warnings": conflict_warnings,
            "mark": "deterministic"
        }

    def analyze_mobile(self, phone_number, birth_number):
        # Remove non-digit characters
        phone_digits = ''.join([d for d in phone_number if d.isdigit()])
        total = sum(int(d) for d in phone_digits if d != '0')
        root_total = self.reduce_to_single_digit(total)
        
        # Check combos (pairs)
        combos_found = []
        for i in range(len(phone_digits) - 1):
            pair = phone_digits[i:i+2]
            combos_found.append(pair)
        
        malefic_list = self.rules_biz['outputs'][0]['malefic']
        malefic_combos = [c for c in combos_found if c in malefic_list]
        
        # Conflict resolution: Mobile digit restriction
        conflict_warnings = []
        digit_warnings = self.conflict_resolver.validate_mobile_digit_restriction(phone_digits)
        conflict_warnings.extend(digit_warnings)
        
        # Check for digit repeats (3+ times)
        if 'warnings' in self.rules_biz:
            for warning in self.rules_biz['warnings']:
                if warning.get('id') == 'mobile_repeats':
                    repeats_data = warning.get('repeats_3_plus', {})
                    for digit, message in repeats_data.items():
                        if phone_digits.count(digit) >= 3:
                            conflict_warnings.append({
                                'type': 'mobile_digit_repeat',
                                'severity': 'medium',
                                'digit': digit,
                                'message': message,
                                'override': False
                            })
        
        return {
            "phone_number": phone_number,
            "phone_digits": phone_digits,
            "total": total,
            "root_total": root_total,
            "malefic_combos": malefic_combos,
            "warnings": conflict_warnings,
            "mark": "deterministic"
        }
