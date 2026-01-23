from .birth_destiny_engine import NumerologyBaseEngine

class CompoundInterpreter(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules_1_52 = self.load_rules('compound_numbers_1_52.rules.json')
        self.rules_53_73 = self.load_rules('compound_numbers_after_52.rules.json')

    def interpret(self, number, prominent_numbers=None, destiny_number=None):
        prominent_numbers = prominent_numbers or []
        
        # Combine rule sets
        all_outputs = self.rules_1_52['outputs'] + self.rules_53_73['outputs']
        all_warnings = self.rules_1_52['warnings'] + self.rules_53_73['warnings']
        all_remedies = self.rules_1_52['remedies'] + self.rules_53_73['remedies']
        all_conditions = self.rules_1_52['conditions'] + self.rules_53_73['conditions']

        data = next((item for item in all_outputs if item['number'] == number), None)
        if not data:
            return {"error": "Number interpretation not found"}

        # Check conditions
        specific_traits = []
        for cond in all_conditions:
            # Simple condition matching based on rule strings
            if cond['id'] == "54_destiny_9" and number == 54 and destiny_number == 9:
                specific_traits.append("flourishing_and_fortunate")
            if cond['id'] == "58_prominent_8" and number == 58 and 8 in prominent_numbers:
                specific_traits.append("roller_coaster_ride")
            if cond['id'] == "65_not_9" and number == 65 and 9 in prominent_numbers:
                specific_traits.append("not_suitable")
            # ... more condition checks could be added here based on JSON logic

        warning = next((w for w in all_warnings if w['number'] == number), None)
        remedy = next((r for r in all_remedies if r['number'] == number), None)

        return {
            "number": number,
            "traits": data['traits'],
            "specific_traits": specific_traits,
            "warning": warning,
            "remedy": remedy,
            "mark": "deterministic"
        }
