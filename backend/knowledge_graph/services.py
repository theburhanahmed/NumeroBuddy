"""
Knowledge Graph services for pattern discovery and relationship analysis.
"""
from typing import List, Dict, Optional
from django.db import models
from numerology.models import NumerologyProfile, DailyReading
from .models import NumberRelationship, NumerologyPattern, NumerologyRule


class KnowledgeGraphService:
    """Service for knowledge graph operations."""
    
    def discover_user_patterns(self, user) -> List[Dict]:
        """Discover patterns in user's numerology data."""
        patterns = []
        
        try:
            profile = NumerologyProfile.objects.get(user=user)
            
            # Pattern 1: Check for repeating numbers
            numbers = [
                profile.life_path_number,
                profile.destiny_number,
                profile.soul_urge_number,
                profile.personality_number,
            ]
            
            from collections import Counter
            number_counts = Counter(numbers)
            repeating_numbers = [num for num, count in number_counts.items() if count > 1]
            
            if repeating_numbers:
                patterns.append({
                    'type': 'combination',
                    'pattern_data': {
                        'repeating_numbers': repeating_numbers,
                        'frequency': {num: number_counts[num] for num in repeating_numbers}
                    },
                    'description': f"Repeating numbers in your core profile: {', '.join(map(str, repeating_numbers))}",
                    'significance': "Repeating numbers indicate strong themes in your life path and may require special attention.",
                    'confidence_score': 0.8
                })
            
            # Pattern 2: Check for master numbers
            master_numbers = [num for num in numbers if num in [11, 22, 33]]
            if master_numbers:
                patterns.append({
                    'type': 'combination',
                    'pattern_data': {
                        'master_numbers': master_numbers
                    },
                    'description': f"Master numbers present: {', '.join(map(str, master_numbers))}",
                    'significance': "Master numbers indicate heightened spiritual potential and special life missions.",
                    'confidence_score': 0.9
                })
            
            # Pattern 3: Check for sequential patterns
            sorted_numbers = sorted(set(numbers))
            sequences = []
            for i in range(len(sorted_numbers) - 1):
                if sorted_numbers[i+1] - sorted_numbers[i] == 1:
                    sequences.append((sorted_numbers[i], sorted_numbers[i+1]))
            
            if sequences:
                patterns.append({
                    'type': 'sequence',
                    'pattern_data': {
                        'sequences': sequences
                    },
                    'description': f"Sequential number patterns detected",
                    'significance': "Sequential numbers suggest a progressive life journey with natural flow.",
                    'confidence_score': 0.7
                })
            
        except NumerologyProfile.DoesNotExist:
            pass
        
        return patterns
    
    def find_number_connections(self, number: int) -> List[Dict]:
        """Find connections for a specific number."""
        connections = []
        
        # Get relationships where this number appears
        relationships = NumberRelationship.objects.filter(
            models.Q(number1=number) | models.Q(number2=number)
        )
        
        for rel in relationships:
            other_number = rel.number2 if rel.number1 == number else rel.number1
            connections.append({
                'number': other_number,
                'relationship_type': rel.relationship_type,
                'strength': rel.strength,
                'description': rel.description
            })
        
        return connections
    
    def generate_insights(self, user) -> List[Dict]:
        """Generate insights from knowledge graph data."""
        insights = []
        
        try:
            profile = NumerologyProfile.objects.get(user=user)
            
            # Insight 1: Number relationships
            life_path_connections = self.find_number_connections(profile.life_path_number)
            if life_path_connections:
                compatible = [c for c in life_path_connections if c['relationship_type'] == 'compatible']
                if compatible:
                    insights.append({
                        'type': 'pattern_discovery',
                        'title': 'Compatible Numbers',
                        'content': f"Your Life Path {profile.life_path_number} is compatible with numbers: {', '.join([str(c['number']) for c in compatible[:3]])}",
                        'action_url': '/birth-chart',
                        'action_text': 'View Birth Chart'
                    })
            
            # Insight 2: Pattern discoveries
            patterns = self.discover_user_patterns(user)
            if patterns:
                for pattern in patterns[:2]:  # Top 2 patterns
                    insights.append({
                        'type': 'pattern_discovery',
                        'title': 'Pattern Discovered',
                        'content': pattern['description'],
                        'action_url': '/birth-chart',
                        'action_text': 'Learn More'
                    })
        
        except NumerologyProfile.DoesNotExist:
            pass
        
        return insights
    
    def query_graph(self, query_type: str, params: Dict) -> Dict:
        """Execute custom graph queries."""
        if query_type == 'compatibility_matrix':
            # Generate compatibility matrix for numbers
            numbers = params.get('numbers', [])
            matrix = {}
            
            for num1 in numbers:
                matrix[num1] = {}
                for num2 in numbers:
                    if num1 != num2:
                        rel = NumberRelationship.objects.filter(
                            models.Q(number1=num1, number2=num2) |
                            models.Q(number1=num2, number2=num1)
                        ).first()
                        
                        if rel:
                            matrix[num1][num2] = {
                                'type': rel.relationship_type,
                                'strength': rel.strength
                            }
                        else:
                            matrix[num1][num2] = {
                                'type': 'unknown',
                                'strength': 5
                            }
            
            return {'matrix': matrix}
        
        elif query_type == 'number_path':
            # Find path between two numbers
            start = params.get('start_number')
            end = params.get('end_number')
            
            # Simple implementation - can be enhanced with graph algorithms
            return {'path': [start, end], 'distance': 1}
        
        return {'error': 'Unknown query type'}

