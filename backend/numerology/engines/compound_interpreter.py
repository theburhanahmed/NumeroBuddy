from .birth_destiny_engine import NumerologyBaseEngine

class CompoundInterpreter(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules_1_52 = self.load_rules('compound_numbers_1_52.rules.json')
        self.rules_53_73 = self.load_rules('compound_numbers_after_52.rules.json')

    def interpret(self, number, prominent_numbers=None, destiny_number=None, birth_number=None):
        prominent_numbers = prominent_numbers or []
        
        # Combine rule sets
        all_outputs = self.rules_1_52['outputs'] + self.rules_53_73['outputs']
        all_warnings = self.rules_1_52['warnings'] + self.rules_53_73['warnings']
        all_remedies = self.rules_1_52['remedies'] + self.rules_53_73['remedies']
        all_conditions = self.rules_1_52['conditions'] + self.rules_53_73['conditions']

        data = next((item for item in all_outputs if item['number'] == number), None)
        if not data:
            return {"error": "Number interpretation not found"}

        # Check conditions with proper evaluation
        specific_traits = []
        condition_warnings = []
        
        for cond in all_conditions:
            cond_id = cond.get('id', '')
            cond_if = cond.get('if', '')
            cond_then = cond.get('then', '')
            
            # Evaluate conditions based on rule structure
            condition_met = False
            
            # Parse condition strings (simplified evaluator)
            if "compound_number == " in cond_if and "prominent_numbers.includes" in cond_if:
                # Extract compound number check
                cn_check = int(cond_if.split("compound_number == ")[1].split()[0])
                # Extract prominent number check
                if "prominent_numbers.includes(" in cond_if:
                    pn_str = cond_if.split("prominent_numbers.includes(")[1].split(")")[0]
                    pn_check = int(pn_str)
                    if number == cn_check and pn_check in prominent_numbers:
                        condition_met = True
            elif "compound_number == " in cond_if and "destiny_number == " in cond_if:
                cn_check = int(cond_if.split("compound_number == ")[1].split()[0])
                dn_check = int(cond_if.split("destiny_number == ")[1].split()[0])
                if number == cn_check and destiny_number == dn_check:
                    condition_met = True
            elif "compound_number == " in cond_if:
                cn_check = int(cond_if.split("compound_number == ")[1].split()[0])
                if number == cn_check:
                    condition_met = True
            
            if condition_met:
                specific_traits.append(cond_then)
                # Check if condition triggers a warning
                if "unlucky" in cond_then or "prone" in cond_then or "not_suitable" in cond_then:
                    condition_warnings.append({
                        'type': 'compound_condition_warning',
                        'severity': 'medium',
                        'condition': cond_id,
                        'message': f"Condition {cond_id} triggered: {cond_then}",
                        'override': False
                    })

        # Rule-based warnings
        rule_warning = next((w for w in all_warnings if w['number'] == number), None)
        remedy = next((r for r in all_remedies if r['number'] == number), None)
        
        # Conflict resolution: Check for risky numbers
        conflict_warnings = []
        if number in self.conflict_resolver.RISKY_NUMBERS:
            conflict_warnings.extend(
                self.conflict_resolver.validate_risky_numbers([number])
            )
        
        # Check prominent numbers for conflicts
        if prominent_numbers:
            risky_prominent = [n for n in prominent_numbers if n in self.conflict_resolver.RISKY_NUMBERS]
            if risky_prominent:
                conflict_warnings.append({
                    'type': 'prominent_risky_number',
                    'severity': 'high',
                    'numbers': risky_prominent,
                    'message': f"Prominent risky numbers {risky_prominent} detected - override optimistic traits",
                    'override': True
                })
        
        # Combine all warnings
        all_warnings_list = []
        if rule_warning:
            all_warnings_list.append(rule_warning)
        all_warnings_list.extend(condition_warnings)
        all_warnings_list.extend(conflict_warnings)

        return {
            "number": number,
            "traits": data['traits'],
            "specific_traits": specific_traits,
            "warning": all_warnings_list if all_warnings_list else None,
            "remedy": remedy,
            "mark": "deterministic"
        }
