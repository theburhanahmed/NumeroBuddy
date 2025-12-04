"""
LLM service for generating phone number numerology explanations.
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
    prompt_path = Path(__file__).parent / 'prompts' / 'phone_explainer_prompt.txt'
    
    try:
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()
    except IOError as e:
        logger.error(f"Failed to load prompt template: {e}")
        return "You are a professional numerologist. Explain the phone number numerology results provided."


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


def generate_phone_explanation(
    user: Any,
    phone_raw: str,
    phone_e164: str,
    method: str,
    computed: Dict,
    persist: bool = True
) -> Dict[str, Any]:
    """
    Generate LLM explanation for phone number numerology results.
    
    Args:
        user: User object
        phone_raw: Original phone number string
        phone_e164: Sanitized E.164 format phone number
        method: Calculation method ('core', 'full', 'compatibility')
        computed: Computed numerology data with evidence_map
        persist: Whether this is for a persisted report
        
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
        
        # Build input JSON
        input_data = {
            'user': {
                'id': str(user.id),
                'phone_raw': phone_raw,
                'phone_e164': phone_e164
            },
            'computed': computed,
            'context': {
                'method': method,
                'persist': persist
            }
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
        logger.error(f"Unexpected error in generate_phone_explanation: {e}")
        return {
            'error': str(e),
            'explanation': None
        }

