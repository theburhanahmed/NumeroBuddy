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
        
        # Validate calculation integrity
        conflict_warnings = []
        
        if gender.lower() == 'female':
            kua = self.reduce_to_single_digit(year_sum + 4)
        else:
            # Male: 11 - year_sum
            kua = self.reduce_to_single_digit(11 - year_sum)
            
        # Special mapping for 5
        data = next((item for item in self.rules['outputs'] if item.get('kua_number') == kua), None)
        original_kua = kua
        
        if kua == 5:
            if data:
                mapped_kua = data['female_mapping'] if gender.lower() == 'female' else data['male_mapping']
                data = next((item for item in self.rules['outputs'] if item.get('kua_number') == mapped_kua), None)
                conflict_warnings.append({
                    'type': 'kua_5_mapping',
                    'severity': 'info',
                    'message': f"Kua 5 mapped to {mapped_kua} for {gender}",
                    'original_kua': 5,
                    'mapped_kua': mapped_kua,
                    'override': False
                })
                kua = mapped_kua
            
        group = "East group" if original_kua in [1, 3, 4, 9] or (original_kua == 5 and gender.lower() == 'male') else "West group"
        
        # Validate that directions are provided
        if not data:
            conflict_warnings.append({
                'type': 'kua_data_missing',
                'severity': 'high',
                'message': f"Kua number {kua} data not found in rules",
                'override': False
            })
        
        return {
            "kua_number": kua,
            "original_kua": original_kua if original_kua != kua else None,
            "group": group,
            "directions": data.get('directions') if data else None,
            "avoid": data.get('avoid') if data else None,
            "donation": data.get('donation') if data else None,
            "usage_rule": self.rules['warnings'][0]['rule'] if self.rules.get('warnings') else None,
            "warnings": conflict_warnings if conflict_warnings else None,
            "mark": "deterministic"
        }
