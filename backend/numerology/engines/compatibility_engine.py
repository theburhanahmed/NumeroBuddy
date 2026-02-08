from .birth_destiny_engine import NumerologyBaseEngine

class CompatibilityEngine(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules_81 = self.load_rules('compatibility_81.rules.json')
        self.rules_lucky = self.load_rules('eklavya_brahmastra.rules.json')

    def check_compatibility(self, psychic1, destiny1, psychic2=None, destiny2=None):
        # Case 1: Internal compatibility (Driver-Conductor)
        internal_key = f"{psychic1}-{destiny1}"
        rating = self.rules_81['outputs'][0]['ratings'].get(internal_key, "No rating found")
        punch_line = self.rules_81['outputs'][1]['traits'].get(internal_key, "")
        
        # Check opposite numbers
        opposites = self.rules_81['warnings'][0]['list']
        is_opposite = str(destiny1) in [str(o) for o in opposites.get(str(psychic1), [])]
        
        # Lucky/Unlucky classification from Eklavya
        lucky_data = next((item for item in self.rules_lucky['outputs'][1]['table'] if item['number'] == psychic1), {})
        
        # Conflict resolution: Check for opposite number conflict
        conflict_warnings = []
        opposite_warning = self.conflict_resolver.validate_opposite_numbers(psychic1, destiny1)
        if opposite_warning:
            conflict_warnings.append(opposite_warning)
            # Override rating if opposite conflict exists
            rating = f"{rating} (OVERRIDDEN: Internal conflict detected)"
        
        result = {
            "internal_rating": rating,
            "punch_line": punch_line,
            "is_opposite_conflict": is_opposite,
            "lucky_numbers": lucky_data.get('lucky', []),
            "neutral_numbers": lucky_data.get('neutral', []),
            "enemy_numbers": lucky_data.get('enemy', []),
            "warnings": conflict_warnings,
            "mark": "deterministic"
        }

        # Case 2: Partner compatibility (if provided)
        if psychic2 and destiny2:
            # Simplification: check if psychic2 is in psychic1's lucky/neutral/enemy list
            relation = "unknown"
            if psychic2 in lucky_data.get('lucky', []):
                relation = "lucky"
            elif psychic2 in lucky_data.get('neutral', []):
                relation = "neutral"
            elif psychic2 in lucky_data.get('enemy', []):
                relation = "enemy"
            
            # Conflict resolution: Check for enemy number override
            enemy_warning = self.conflict_resolver.validate_enemy_numbers(psychic1, psychic2)
            if enemy_warning:
                conflict_warnings.append(enemy_warning)
                # Override relation if enemy detected
                relation = "enemy (OVERRIDDEN: Enemy number conflict)"
            
            partner_key = f"{psychic1}-{psychic2}"
            partner_rating = self.rules_81['outputs'][0]['ratings'].get(partner_key, "No rating found")
            
            result["partner_compatibility"] = {
                "relation": relation,
                "rating": partner_rating,
                "note": f"Psychic {psychic2} is {relation} for Psychic {psychic1}",
                "overridden": enemy_warning is not None
            }
            
            # Update warnings list
            result["warnings"] = conflict_warnings

        return result
