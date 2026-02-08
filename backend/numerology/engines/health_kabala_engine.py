from .birth_destiny_engine import NumerologyBaseEngine

class HealthKabalaEngine(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules = self.load_rules('health_kabala.rules.json')

    def calculate_health(self, name, birth_number=None):
        table = self.rules['outputs'][0]['mapping']
        total = 0
        # Kabala calculation uses specific pairs like 'Th', 'Ts', etc.
        # Simple implementation for now
        temp_name = name.upper()
        # Handle double characters first (longest first)
        special_keys = sorted([k for k in table.keys() if len(k) > 1], key=len, reverse=True)
        for sk in special_keys:
            count = temp_name.count(sk)
            total += count * table[sk]
            temp_name = temp_name.replace(sk, " ")
            
        for char in temp_name:
            if char in table:
                total += table[char]
        
        kabala_number = total
        # Rule: Reduce only if total exceeds 22
        if kabala_number > 22:
            kabala_number = self.reduce_to_single_digit(kabala_number)
        
        # Conflict resolution: Check if kabala number is 4 or 8 (not considered money number)
        conflict_warnings = []
        if kabala_number in {4, 8}:
            conflict_warnings.append({
                'type': 'kabala_money_exclusion',
                'severity': 'medium',
                'message': f"Kabala number {kabala_number} (4 or 8) is not considered as money number",
                'override': False
            })
            
        health_trait = self.rules['outputs'][1]['traits'].get(str(kabala_number))
        
        # Health warnings based on traits
        if health_trait:
            # Check for advisory-only health traits
            if "advisory" in health_trait.lower():
                conflict_warnings.append({
                    'type': 'health_advisory',
                    'severity': 'low',
                    'message': f"Health trait advisory: {health_trait}",
                    'override': False
                })
        
        # Check for risky health numbers
        if kabala_number in self.conflict_resolver.RISKY_NUMBERS:
            conflict_warnings.extend(
                self.conflict_resolver.validate_risky_numbers([kabala_number])
            )
        
        # Share market sectors (advisory-only)
        sectors = None
        if 'outputs' in self.rules and len(self.rules['outputs']) > 2:
            sectors_data = self.rules['outputs'][2]
            if sectors_data.get('category') == 'share_market_sectors':
                sectors = sectors_data.get('sectors', {}).get(str(kabala_number))
        
        return {
            "name": name,
            "kabala_total": total,
            "kabala_number": kabala_number,
            "health_trait": health_trait,
            "share_market_sectors": sectors,
            "warnings": conflict_warnings if conflict_warnings else None,
            "mark": "deterministic"
        }
