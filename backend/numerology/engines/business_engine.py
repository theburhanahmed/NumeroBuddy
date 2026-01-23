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
        exclusions = ['PVT LTD', 'LTD', 'LLP', 'HUF']
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
        
        return {
            "company_name": company_name,
            "clean_name": clean_name,
            "name_total": name_total,
            "root_number": root_number,
            "is_harmonious": is_harmonious,
            "mark": "deterministic"
        }

    def analyze_mobile(self, phone_number, birth_number):
        total = sum(int(d) for d in phone_number if d != '0')
        root_total = self.reduce_to_single_digit(total)
        
        # Check combos
        combos_found = []
        for i in range(len(phone_number) - 1):
            pair = phone_number[i:i+2]
            combos_found.append(pair)
            
        malefic_list = self.rules_biz['outputs'][0]['malefic']
        warnings = [c for c in combos_found if c in malefic_list]
        
        return {
            "phone_number": phone_number,
            "total": total,
            "root_total": root_total,
            "malefic_combos": warnings,
            "mark": "deterministic"
        }
