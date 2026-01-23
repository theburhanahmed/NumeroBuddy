from .birth_destiny_engine import NumerologyBaseEngine

class KuaEngine(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules = self.load_rules('kua_fengshui.rules.json')

    def calculate_kua(self, birth_year, gender):
        # Calculation formula from rules
        year_sum = self.sum_digits(birth_year)
        while year_sum > 9:
            year_sum = self.sum_digits(year_sum)
            
        if gender.lower() == 'female':
            kua = self.reduce_to_single_digit(year_sum + 4)
        else:
            kua = self.reduce_to_single_digit(11 - year_sum)
            
        # Special mapping for 5
        data = next((item for item in self.rules['outputs'] if item.get('kua_number') == kua), None)
        if kua == 5:
            mapped_kua = data['female_mapping'] if gender.lower() == 'female' else data['male_mapping']
            data = next((item for item in self.rules['outputs'] if item.get('kua_number') == mapped_kua), None)
            
        group = "East group" if kua in [1, 3, 4, 9] or (kua == 5 and gender.lower() == 'male') else "West group"
        
        return {
            "kua_number": kua,
            "group": group,
            "directions": data.get('directions') if data else None,
            "avoid": data.get('avoid') if data else None,
            "donation": data.get('donation') if data else None,
            "usage_rule": self.rules['warnings'][0]['rule'],
            "mark": "deterministic"
        }
