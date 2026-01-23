from .birth_destiny_engine import NumerologyBaseEngine

class LoShuEngine(NumerologyBaseEngine):
    def __init__(self):
        super().__init__()
        self.rules_grid = self.load_rules('missing_numbers_grid.rules.json')
        self.rules_donations = self.load_rules('missing_number_donations.rules.json')

    def calculate_grid(self, dob_day, dob_month, dob_year, driver, conductor):
        # Convert all to digits
        all_digits = str(dob_day) + str(dob_month) + str(dob_year) + str(driver) + str(conductor)
        # Note: Century digit '1' or '2' is usually ignored in some systems, but I'll follow common Lo Shu practice of using all digits unless specified.
        # Rule says "count_occurrences(dob_digits, range(1, 10))"
        
        counts = {}
        for i in range(1, 10):
            counts[str(i)] = all_digits.count(str(i))
        
        missing_numbers = [int(n) for n, count in counts.items() if count == 0]
        
        # Grid impact traits
        grid_access = self.rules_grid['outputs'][0]['number_repeats']
        traits = {}
        for n, count in counts.items():
            if count > 0:
                index = min(count - 1, 3) # capped at 4 times
                traits[n] = grid_access[n][index]
        
        # Missing number traits and remedies
        missing_info = []
        for n in missing_numbers:
            trait = self.rules_grid['outputs'][1]['traits'].get(str(n))
            remedy = next((r for r in self.rules_grid['remedies'] if r['number'] == n), {})
            donation = self.rules_donations['outputs'][0]['items'].get(str(n))
            
            missing_info.append({
                "number": n,
                "trait": trait,
                "remedy": remedy,
                "donation": donation
            })

        return {
            "counts": counts,
            "missing_info": missing_info,
            "traits": traits,
            "mark": "deterministic"
        }
