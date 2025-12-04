"""
LLM service for generating name numerology explanations.
"""
import json
import re
import logging
import time
from typing import Dict, Optional, Any
from pathlib import Path
from .llm_service import get_llm_service

logger = logging.getLogger(__name__)


def load_prompt_template() -> str:
    """Load the prompt template from file."""
    prompt_path = Path(__file__).parent / 'prompts' / 'name_explainer_prompt.txt'
    
    try:
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()
    except IOError as e:
        logger.error(f"Failed to load prompt template: {e}")
        return "You are a professional numerologist. Explain the name numerology results provided."


def build_evidence_mapping(breakdown: list, numbers: dict) -> Dict[str, Any]:
    """
    Build evidence mapping with IDs (E1, E2, etc.) for LLM referencing.
    
    Args:
        breakdown: Per-letter breakdown
        numbers: Calculated numbers dict
        
    Returns:
        Evidence mapping with IDs
    """
    evidence = {}
    evidence_id = 1
    
    # Expression number
    evidence[f'E{evidence_id}'] = {
        'type': 'expression',
        'value': numbers.get('expression', {}).get('reduced'),
        'raw_total': numbers.get('expression', {}).get('raw_total')
    }
    evidence_id += 1
    
    # Soul urge number
    evidence[f'E{evidence_id}'] = {
        'type': 'soul_urge',
        'value': numbers.get('soul_urge', {}).get('reduced'),
        'raw_total': numbers.get('soul_urge', {}).get('raw_total')
    }
    evidence_id += 1
    
    # Personality number
    evidence[f'E{evidence_id}'] = {
        'type': 'personality',
        'value': numbers.get('personality', {}).get('reduced'),
        'raw_total': numbers.get('personality', {}).get('raw_total')
    }
    evidence_id += 1
    
    # Name vibration
    if 'name_vibration' in numbers:
        evidence[f'E{evidence_id}'] = {
            'type': 'name_vibration',
            'value': numbers.get('name_vibration')
        }
        evidence_id += 1
    
    # Add letter-level evidence for key letters (first letter, vowels, etc.)
    if breakdown:
        # First letter
        if breakdown[0]:
            evidence[f'E{evidence_id}'] = {
                'type': 'first_letter',
                'letter': breakdown[0].get('letter'),
                'value': breakdown[0].get('value')
            }
            evidence_id += 1
    
    return evidence


def sanitize_json_response(text: str) -> Optional[Dict]:
    """
    Sanitize LLM response to extract valid JSON.
    
    Args:
        text: Raw LLM response text
        
    Returns:
        Parsed JSON dict or None if invalid
    """
    if not text:
        return None
    
    # Try to extract JSON from markdown code blocks
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if json_match:
        text = json_match.group(1)
    
    # Try to find JSON object in text
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        text = json_match.group(0)
    
    # Try to parse JSON
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        logger.warning(f"Failed to parse JSON from LLM response: {text[:200]}")
        return None


def generate_name_explanation(
    user: Any,
    name: str,
    name_type: str,
    system: str,
    numbers: Dict,
    breakdown: list,
    keep_master: bool = True,
    report_type: str = "saved"
) -> Dict[str, Any]:
    """
    Generate LLM explanation for name numerology results.
    
    Args:
        user: User object
        name: Original name
        name_type: Type of name (birth, current, nickname)
        system: Numerology system used
        numbers: Calculated numbers dict
        breakdown: Per-letter breakdown
        keep_master: Whether master numbers were preserved
        report_type: "preview" or "saved"
        
    Returns:
        Dictionary with explanation fields or error info
    """
    try:
        llm_service = get_llm_service()
        
        if not llm_service.is_available():
            logger.warning("LLM service not available")
            return {
                'error': 'LLM service not available',
                'explanation': None
            }
        
        # Load prompt template
        prompt_template = load_prompt_template()
        
        # Build evidence mapping
        evidence = build_evidence_mapping(breakdown, numbers)
        
        # Build input JSON
        input_data = {
            'user': {
                'id': str(user.id),
                'name': name,
                'name_type': name_type
            },
            'system': system,
            'numbers': numbers,
            'breakdown': breakdown,
            'context': {
                'report_type': report_type,
                'keep_master': keep_master
            },
            'evidence': evidence
        }
        
        # Build full prompt
        prompt = f"""{prompt_template}

Input JSON:
{json.dumps(input_data, indent=2)}

Please provide your explanation as a JSON object following the specified format."""
        
        # Generate explanation with retries
        max_retries = 2
        backoff = 0.5
        
        for attempt in range(max_retries):
            try:
                start_time = time.time()
                result = llm_service.generate_explanation(
                    prompt=prompt,
                    context=input_data,
                    max_tokens=500,
                    temperature=0.7
                )
                latency_ms = (time.time() - start_time) * 1000
                
                content = result.get('content', '')
                if not content:
                    raise ValueError("Empty response from LLM")
                
                # Sanitize and parse JSON
                explanation_json = sanitize_json_response(content)
                
                if explanation_json:
                    # Validate required fields
                    required_fields = ['short_summary', 'long_explanation', 'action_points', 'confidence_notes']
                    if all(field in explanation_json for field in required_fields):
                        return {
                            'explanation': explanation_json,
                            'tokens_used': result.get('tokens_used'),
                            'cost': result.get('cost'),
                            'model': result.get('model'),
                            'provider': result.get('provider'),
                            'latency_ms': latency_ms
                        }
                    else:
                        logger.warning(f"Missing required fields in explanation JSON: {explanation_json.keys()}")
                
                # If we get here, JSON parsing failed
                if attempt < max_retries - 1:
                    time.sleep(backoff * (attempt + 1))
                    continue
                else:
                    return {
                        'error': 'Failed to parse valid JSON from LLM response',
                        'raw_response': content[:500],
                        'explanation': None
                    }
                    
            except Exception as e:
                logger.error(f"Error generating explanation (attempt {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(backoff * (attempt + 1))
                    continue
                else:
                    return {
                        'error': str(e),
                        'explanation': None
                    }
        
        return {
            'error': 'Failed to generate explanation after retries',
            'explanation': None
        }
        
    except Exception as e:
        logger.error(f"Unexpected error in generate_name_explanation: {e}")
        return {
            'error': str(e),
            'explanation': None
        }

