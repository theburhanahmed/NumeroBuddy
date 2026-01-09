"""
Generational Numerology service for family analysis, karmic contracts, and generational patterns.
"""
from typing import Dict, List, Any, Optional
from datetime import date
from ..numerology import NumerologyCalculator


class GenerationalNumerologyService:
    """Service for Generational Numerology calculations."""
    
    def __init__(self, system: str = 'pythagorean'):
        """Initialize with calculation system."""
        self.calculator = NumerologyCalculator(system=system)
        self.system = system
    
    def analyze_family_generations(
        self,
        family_members: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyze numerology across family generations.
        
        Args:
            family_members: List of dicts with 'name', 'birth_date', 'relationship' (e.g., 'father', 'mother', 'child')
        
        Returns:
            Dictionary with generational analysis
        """
        if not family_members:
            return {'error': 'At least one family member is required'}
        
        # Calculate numbers for each member
        member_analyses = []
        for member in family_members:
            name = member.get('name', '')
            birth_date = member.get('birth_date')
            relationship = member.get('relationship', 'unknown')
            
            if not birth_date:
                continue
            
            if isinstance(birth_date, str):
                from datetime import datetime
                birth_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
            
            life_path = self.calculator.calculate_life_path_number(birth_date)
            destiny = self.calculator.calculate_destiny_number(name) if name else None
            
            member_analyses.append({
                'name': name,
                'relationship': relationship,
                'birth_date': birth_date.isoformat() if isinstance(birth_date, date) else birth_date,
                'life_path': life_path,
                'destiny': destiny,
                'age': self._calculate_age(birth_date)
            })
        
        # Analyze generational patterns
        generational_patterns = self._detect_generational_patterns(member_analyses)
        karmic_contracts = self._identify_karmic_contracts(member_analyses)
        family_unit_numerology = self._calculate_family_unit_numerology(member_analyses)
        generational_cycles = self._track_generational_cycles(member_analyses)
        
        return {
            'family_members': member_analyses,
            'generational_patterns': generational_patterns,
            'karmic_contracts': karmic_contracts,
            'family_unit_numerology': family_unit_numerology,
            'generational_cycles': generational_cycles,
            'summary': self._generate_family_summary(
                generational_patterns,
                karmic_contracts,
                family_unit_numerology
            )
        }
    
    def identify_karmic_contracts(
        self,
        family_members: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Identify karmic contracts between family members.
        
        Args:
            family_members: List of dicts with 'name', 'birth_date', 'relationship'
        
        Returns:
            List of karmic contract dictionaries
        """
        if len(family_members) < 2:
            return []
        
        contracts = []
        
        # Calculate numbers for all members
        member_numbers = {}
        for member in family_members:
            name = member.get('name', '')
            birth_date = member.get('birth_date')
            
            if not birth_date:
                continue
            
            if isinstance(birth_date, str):
                from datetime import datetime
                birth_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
            
            life_path = self.calculator.calculate_life_path_number(birth_date)
            destiny = self.calculator.calculate_destiny_number(name) if name else None
            
            member_numbers[member.get('relationship', 'unknown')] = {
                'life_path': life_path,
                'destiny': destiny,
                'name': name
            }
        
        # Analyze parent-child contracts
        if 'father' in member_numbers and 'child' in member_numbers:
            contract = self._analyze_parent_child_contract(
                member_numbers['father'],
                member_numbers['child'],
                'father-child'
            )
            if contract:
                contracts.append(contract)
        
        if 'mother' in member_numbers and 'child' in member_numbers:
            contract = self._analyze_parent_child_contract(
                member_numbers['mother'],
                member_numbers['child'],
                'mother-child'
            )
            if contract:
                contracts.append(contract)
        
        # Analyze sibling contracts
        siblings = [k for k in member_numbers.keys() if 'sibling' in k.lower() or 'brother' in k.lower() or 'sister' in k.lower()]
        if len(siblings) >= 2:
            for i, sib1 in enumerate(siblings):
                for sib2 in siblings[i+1:]:
                    contract = self._analyze_sibling_contract(
                        member_numbers[sib1],
                        member_numbers[sib2]
                    )
                    if contract:
                        contracts.append(contract)
        
        return contracts
    
    def detect_generational_patterns(
        self,
        family_members: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Detect patterns across generations.
        
        Args:
            family_members: List of dicts with 'name', 'birth_date', 'relationship'
        
        Returns:
            Dictionary with detected patterns
        """
        if not family_members:
            return {}
        
        # Calculate life paths for all members
        life_paths = []
        for member in family_members:
            birth_date = member.get('birth_date')
            if not birth_date:
                continue
            
            if isinstance(birth_date, str):
                from datetime import datetime
                birth_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
            
            life_path = self.calculator.calculate_life_path_number(birth_date)
            life_paths.append(life_path)
        
        # Detect patterns
        repeating_numbers = self._find_repeating_numbers(life_paths)
        number_distribution = self._analyze_number_distribution(life_paths)
        generational_themes = self._identify_generational_themes(life_paths)
        
        return {
            'repeating_numbers': repeating_numbers,
            'number_distribution': number_distribution,
            'generational_themes': generational_themes,
            'pattern_strength': self._calculate_pattern_strength(repeating_numbers, number_distribution)
        }
    
    def calculate_family_unit_numerology(
        self,
        family_members: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Calculate numerology for the family as a unit.
        
        Args:
            family_members: List of dicts with 'name', 'birth_date', 'relationship'
        
        Returns:
            Dictionary with family unit numerology
        """
        if not family_members:
            return {}
        
        # Calculate combined family vibration
        family_vibration = 0
        for member in family_members:
            name = member.get('name', '')
            if name:
                destiny = self.calculator.calculate_destiny_number(name)
                family_vibration += destiny
        
        family_number = self.calculator._reduce_to_single_digit(family_vibration, preserve_master=False)
        
        # Calculate family compatibility
        compatibility_scores = []
        for i, member1 in enumerate(family_members):
            for member2 in family_members[i+1:]:
                score = self._calculate_pair_compatibility(member1, member2)
                compatibility_scores.append(score)
        
        avg_compatibility = sum(compatibility_scores) / len(compatibility_scores) if compatibility_scores else 0
        
        return {
            'family_number': family_number,
            'family_vibration': family_vibration,
            'family_theme': self._get_family_theme(family_number),
            'average_compatibility': round(avg_compatibility, 2),
            'family_strengths': self._get_family_strengths(family_number),
            'family_challenges': self._get_family_challenges(family_number)
        }
    
    def track_generational_cycles(
        self,
        family_members: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Track numerology cycles across generations.
        
        Args:
            family_members: List of dicts with 'name', 'birth_date', 'relationship'
        
        Returns:
            Dictionary with cycle tracking data
        """
        if not family_members:
            return {}
        
        today = date.today()
        current_year = today.year
        
        # Calculate personal years for all members
        member_cycles = []
        for member in family_members:
            birth_date = member.get('birth_date')
            if not birth_date:
                continue
            
            if isinstance(birth_date, str):
                from datetime import datetime
                birth_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
            
            personal_year = self.calculator.calculate_personal_year_number(birth_date, current_year)
            personal_month = self.calculator.calculate_personal_month_number(
                birth_date, current_year, today.month
            )
            
            member_cycles.append({
                'name': member.get('name', ''),
                'relationship': member.get('relationship', 'unknown'),
                'personal_year': personal_year,
                'personal_month': personal_month,
                'cycle_alignment': self._get_cycle_alignment(personal_year, personal_month)
            })
        
        # Find aligned cycles
        aligned_cycles = self._find_aligned_cycles(member_cycles)
        
        return {
            'member_cycles': member_cycles,
            'aligned_cycles': aligned_cycles,
            'current_year': current_year,
            'cycle_insights': self._generate_cycle_insights(member_cycles, aligned_cycles)
        }
    
    def _calculate_age(self, birth_date: date) -> int:
        """Calculate age from birth date."""
        today = date.today()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    def _detect_generational_patterns(self, member_analyses: List[Dict]) -> Dict[str, Any]:
        """Detect patterns from member analyses."""
        life_paths = [m['life_path'] for m in member_analyses if 'life_path' in m]
        return self.detect_generational_patterns([
            {'birth_date': m.get('birth_date')} for m in member_analyses
        ])
    
    def _identify_karmic_contracts(self, member_analyses: List[Dict]) -> List[Dict[str, Any]]:
        """Identify karmic contracts from member analyses."""
        return self.identify_karmic_contracts([
            {
                'name': m.get('name', ''),
                'birth_date': m.get('birth_date'),
                'relationship': m.get('relationship', 'unknown')
            }
            for m in member_analyses
        ])
    
    def _calculate_family_unit_numerology(self, member_analyses: List[Dict]) -> Dict[str, Any]:
        """Calculate family unit numerology from member analyses."""
        return self.calculate_family_unit_numerology([
            {
                'name': m.get('name', ''),
                'birth_date': m.get('birth_date'),
                'relationship': m.get('relationship', 'unknown')
            }
            for m in member_analyses
        ])
    
    def _track_generational_cycles(self, member_analyses: List[Dict]) -> Dict[str, Any]:
        """Track generational cycles from member analyses."""
        return self.track_generational_cycles([
            {
                'name': m.get('name', ''),
                'birth_date': m.get('birth_date'),
                'relationship': m.get('relationship', 'unknown')
            }
            for m in member_analyses
        ])
    
    def _analyze_parent_child_contract(
        self,
        parent: Dict[str, Any],
        child: Dict[str, Any],
        relationship_type: str
    ) -> Optional[Dict[str, Any]]:
        """Analyze karmic contract between parent and child."""
        parent_lp = parent.get('life_path')
        child_lp = child.get('life_path')
        
        if not parent_lp or not child_lp:
            return None
        
        # Calculate contract number
        contract_number = self.calculator._reduce_to_single_digit(
            parent_lp + child_lp, preserve_master=False
        )
        
        # Determine contract type
        contract_type = self._get_contract_type(parent_lp, child_lp)
        
        return {
            'relationship': relationship_type,
            'parent_name': parent.get('name', ''),
            'child_name': child.get('name', ''),
            'contract_number': contract_number,
            'contract_type': contract_type,
            'lessons': self._get_contract_lessons(contract_number, contract_type),
            'strengths': self._get_contract_strengths(parent_lp, child_lp),
            'challenges': self._get_contract_challenges(parent_lp, child_lp)
        }
    
    def _analyze_sibling_contract(
        self,
        sibling1: Dict[str, Any],
        sibling2: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Analyze karmic contract between siblings."""
        sib1_lp = sibling1.get('life_path')
        sib2_lp = sibling2.get('life_path')
        
        if not sib1_lp or not sib2_lp:
            return None
        
        contract_number = self.calculator._reduce_to_single_digit(
            sib1_lp + sib2_lp, preserve_master=False
        )
        
        return {
            'relationship': 'sibling',
            'sibling1_name': sibling1.get('name', ''),
            'sibling2_name': sibling2.get('name', ''),
            'contract_number': contract_number,
            'contract_type': 'sibling_karmic',
            'lessons': self._get_sibling_lessons(contract_number),
            'dynamics': self._get_sibling_dynamics(sib1_lp, sib2_lp)
        }
    
    def _find_repeating_numbers(self, numbers: List[int]) -> Dict[int, int]:
        """Find numbers that repeat across generations."""
        from collections import Counter
        counts = Counter(numbers)
        return {num: count for num, count in counts.items() if count > 1}
    
    def _analyze_number_distribution(self, numbers: List[int]) -> Dict[str, Any]:
        """Analyze distribution of numbers."""
        from collections import Counter
        counts = Counter(numbers)
        
        return {
            'most_common': counts.most_common(3) if counts else [],
            'distribution': dict(counts),
            'unique_numbers': len(counts),
            'total_members': len(numbers)
        }
    
    def _identify_generational_themes(self, life_paths: List[int]) -> List[str]:
        """Identify themes across generations."""
        themes = []
        
        # Check for leadership theme (1s)
        if life_paths.count(1) >= 2:
            themes.append("Leadership and independence runs in the family")
        
        # Check for service theme (6s)
        if life_paths.count(6) >= 2:
            themes.append("Service and nurturing is a family value")
        
        # Check for spiritual theme (7s)
        if life_paths.count(7) >= 2:
            themes.append("Spiritual seeking is a generational pattern")
        
        # Check for material success theme (8s)
        if life_paths.count(8) >= 2:
            themes.append("Material achievement is valued across generations")
        
        return themes
    
    def _calculate_pattern_strength(
        self,
        repeating_numbers: Dict[int, int],
        number_distribution: Dict[str, Any]
    ) -> str:
        """Calculate strength of generational patterns."""
        if not repeating_numbers:
            return 'weak'
        
        max_repeats = max(repeating_numbers.values()) if repeating_numbers else 0
        total_members = number_distribution.get('total_members', 0)
        
        if max_repeats >= total_members * 0.5:
            return 'strong'
        elif max_repeats >= total_members * 0.3:
            return 'moderate'
        else:
            return 'weak'
    
    def _calculate_pair_compatibility(
        self,
        member1: Dict[str, Any],
        member2: Dict[str, Any]
    ) -> float:
        """Calculate compatibility score between two family members."""
        birth_date1 = member1.get('birth_date')
        birth_date2 = member2.get('birth_date')
        
        if not birth_date1 or not birth_date2:
            return 50.0
        
        if isinstance(birth_date1, str):
            from datetime import datetime
            birth_date1 = datetime.strptime(birth_date1, '%Y-%m-%d').date()
        if isinstance(birth_date2, str):
            from datetime import datetime
            birth_date2 = datetime.strptime(birth_date2, '%Y-%m-%d').date()
        
        lp1 = self.calculator.calculate_life_path_number(birth_date1)
        lp2 = self.calculator.calculate_life_path_number(birth_date2)
        
        # Simple compatibility: closer numbers = higher compatibility
        diff = abs(lp1 - lp2)
        if diff == 0:
            return 100.0
        elif diff <= 2:
            return 80.0 - (diff * 10)
        else:
            return max(30.0, 60.0 - (diff * 5))
    
    def _get_family_theme(self, family_number: int) -> str:
        """Get theme for family number."""
        themes = {
            1: "Independent and leadership-oriented family",
            2: "Harmonious and cooperative family",
            3: "Creative and expressive family",
            4: "Stable and foundation-building family",
            5: "Dynamic and change-embracing family",
            6: "Service-oriented and nurturing family",
            7: "Spiritual and wisdom-seeking family",
            8: "Material success and achievement-focused family",
            9: "Humanitarian and service-to-all family"
        }
        return themes.get(family_number, f"Family with number {family_number} energy")
    
    def _get_family_strengths(self, family_number: int) -> List[str]:
        """Get strengths for family number."""
        strengths_map = {
            1: ["Strong leadership", "Independence", "Initiative"],
            2: ["Cooperation", "Harmony", "Diplomacy"],
            3: ["Creativity", "Expression", "Joy"],
            4: ["Stability", "Organization", "Reliability"],
            5: ["Adaptability", "Adventure", "Freedom"],
            6: ["Service", "Nurturing", "Responsibility"],
            7: ["Wisdom", "Spirituality", "Intuition"],
            8: ["Achievement", "Material success", "Power"],
            9: ["Humanitarianism", "Compassion", "Universal love"]
        }
        return strengths_map.get(family_number, [])
    
    def _get_family_challenges(self, family_number: int) -> List[str]:
        """Get challenges for family number."""
        challenges_map = {
            1: ["Ego conflicts", "Independence vs. cooperation", "Leadership struggles"],
            2: ["Codependency", "Lack of assertiveness", "Conflict avoidance"],
            3: ["Scattered energy", "Superficiality", "Lack of focus"],
            4: ["Rigidity", "Resistance to change", "Stagnation"],
            5: ["Instability", "Restlessness", "Lack of commitment"],
            6: ["Over-giving", "Boundary issues", "Self-neglect"],
            7: ["Isolation", "Escapism", "Disconnection"],
            8: ["Materialism", "Power struggles", "Work-life imbalance"],
            9: ["Burnout", "Over-giving", "Lack of boundaries"]
        }
        return challenges_map.get(family_number, [])
    
    def _get_contract_type(self, parent_lp: int, child_lp: int) -> str:
        """Get type of karmic contract."""
        if parent_lp == child_lp:
            return "Mirror Contract"
        elif abs(parent_lp - child_lp) <= 1:
            return "Harmonious Contract"
        elif abs(parent_lp - child_lp) >= 4:
            return "Challenging Contract"
        else:
            return "Balanced Contract"
    
    def _get_contract_lessons(self, contract_number: int, contract_type: str) -> List[str]:
        """Get lessons for karmic contract."""
        lessons_map = {
            1: ["Learning independence", "Developing leadership", "Trusting the path"],
            2: ["Learning cooperation", "Building harmony", "Balancing needs"],
            3: ["Expressing creativity", "Sharing joy", "Communicating"],
            4: ["Building foundations", "Creating stability", "Maintaining structure"],
            5: ["Embracing change", "Seeking freedom", "Staying flexible"],
            6: ["Serving with love", "Nurturing relationships", "Taking responsibility"],
            7: ["Seeking truth", "Developing intuition", "Spiritual growth"],
            8: ["Balancing material and spiritual", "Using power wisely", "Achieving mastery"],
            9: ["Serving humanity", "Letting go", "Universal love"]
        }
        base_lessons = lessons_map.get(contract_number, [])
        
        if contract_type == "Challenging Contract":
            base_lessons.append("Learning to bridge differences")
            base_lessons.append("Finding common ground")
        
        return base_lessons
    
    def _get_contract_strengths(self, parent_lp: int, child_lp: int) -> List[str]:
        """Get strengths of parent-child contract."""
        strengths = []
        
        if parent_lp == child_lp:
            strengths.append("Strong understanding and connection")
            strengths.append("Shared values and perspectives")
        elif abs(parent_lp - child_lp) <= 2:
            strengths.append("Complementary energies")
            strengths.append("Mutual growth opportunities")
        else:
            strengths.append("Diverse perspectives")
            strengths.append("Learning from differences")
        
        return strengths
    
    def _get_contract_challenges(self, parent_lp: int, child_lp: int) -> List[str]:
        """Get challenges of parent-child contract."""
        challenges = []
        
        if abs(parent_lp - child_lp) >= 4:
            challenges.append("Different approaches to life")
            challenges.append("Need for understanding and patience")
            challenges.append("Bridging generational differences")
        elif parent_lp == child_lp:
            challenges.append("Potential for mirroring issues")
            challenges.append("Need for individual identity")
        
        return challenges
    
    def _get_sibling_lessons(self, contract_number: int) -> List[str]:
        """Get lessons for sibling contract."""
        return self._get_contract_lessons(contract_number, "sibling")
    
    def _get_sibling_dynamics(self, sib1_lp: int, sib2_lp: int) -> str:
        """Get dynamics description for siblings."""
        if sib1_lp == sib2_lp:
            return "Siblings share similar life paths, creating strong bond but potential for competition"
        elif abs(sib1_lp - sib2_lp) <= 2:
            return "Siblings have complementary energies, supporting each other's growth"
        else:
            return "Siblings have different approaches, learning from each other's perspectives"
    
    def _get_cycle_alignment(self, personal_year: int, personal_month: int) -> str:
        """Get alignment description for cycles."""
        if personal_year == personal_month:
            return "Perfect alignment"
        elif abs(personal_year - personal_month) <= 2:
            return "Strong alignment"
        else:
            return "Different energies"
    
    def _find_aligned_cycles(self, member_cycles: List[Dict]) -> List[Dict[str, Any]]:
        """Find family members with aligned cycles."""
        aligned = []
        
        for i, member1 in enumerate(member_cycles):
            for member2 in member_cycles[i+1:]:
                if member1['personal_year'] == member2['personal_year']:
                    aligned.append({
                        'member1': member1['name'],
                        'member2': member2['name'],
                        'aligned_number': member1['personal_year'],
                        'alignment_type': 'personal_year'
                    })
        
        return aligned
    
    def _generate_cycle_insights(
        self,
        member_cycles: List[Dict],
        aligned_cycles: List[Dict]
    ) -> List[str]:
        """Generate insights from cycle analysis."""
        insights = []
        
        if aligned_cycles:
            insights.append(f"{len(aligned_cycles)} family member(s) are in aligned cycles this year")
        
        # Check for high-energy years
        high_energy_years = [1, 3, 5, 8]
        high_energy_count = sum(1 for m in member_cycles if m['personal_year'] in high_energy_years)
        if high_energy_count >= len(member_cycles) * 0.5:
            insights.append("Family is experiencing high-energy year collectively")
        
        return insights
    
    def _generate_family_summary(
        self,
        generational_patterns: Dict[str, Any],
        karmic_contracts: List[Dict],
        family_unit_numerology: Dict[str, Any]
    ) -> str:
        """Generate summary of family analysis."""
        parts = []
        
        if generational_patterns.get('repeating_numbers'):
            parts.append("Strong generational patterns detected in the family.")
        
        if karmic_contracts:
            parts.append(f"{len(karmic_contracts)} karmic contract(s) identified between family members.")
        
        if family_unit_numerology:
            family_number = family_unit_numerology.get('family_number')
            if family_number:
                parts.append(f"Family unit number is {family_number}, indicating {family_unit_numerology.get('family_theme', '')}")
        
        return " ".join(parts) if parts else "Family numerology analysis reveals the energetic patterns and relationships within your family."

