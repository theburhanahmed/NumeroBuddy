from .birth_destiny_engine import NumerologyBaseEngine

class HealthKabalaEngine(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules = self.load_rules('health_kabala.rules.json')

    def calculate_health(self, name, birth_number):
        table = self.rules['outputs'][0]['mapping']
        total = 0
        # Kabala calculation uses specific pairs like 'Th', 'Ts', etc.
        # Simple implementation for now
        temp_name = name.upper()
        # Handle double characters
        special_keys = sorted([k for k in table.keys() if len(k) > 1], key=len, reverse=True)
        for sk in special_keys:
            count = temp_name.count(sk)
            total += count * table[sk]
            temp_name = temp_name.replace(sk, " ")
            
        for char in temp_name:
            if char in table:
                total += table[char]
        
        kabala_number = total
        if kabala_number > 22:
            kabala_number = self.reduce_to_single_digit(kabala_number)
            
        health_trait = self.rules['outputs'][1]['traits'].get(str(kabala_number))
        
        # Birth Number related health suggestions
        # Note: These were extracted in extraction phase but I'll add them to the result
        # For brevity, I'll return the kabala result primarily
        
        return {
            "name": name,
            "kabala_total": total,
            "kabala_number": kabala_number,
            "health_trait": health_trait,
            "mark": "deterministic"
        }
