"""
LLM service abstraction for OpenAI and Anthropic APIs.
"""
import os
import logging
from typing import Dict, Optional, Any
from django.conf import settings
from decouple import config

logger = logging.getLogger(__name__)


class LLMService:
    """Abstract LLM service supporting multiple providers."""
    
    def __init__(self, provider: str = None):
        """
        Initialize LLM service.
        
        Args:
            provider: 'openai' or 'anthropic'. Defaults to OPENAI_LLM_PROVIDER setting.
        """
        self.provider = provider or config('OPENAI_LLM_PROVIDER', default='openai')
        self._client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the LLM client based on provider."""
        if self.provider.lower() == 'openai':
            try:
                import openai
                api_key = config('OPENAI_API_KEY', default='')
                if not api_key:
                    logger.warning("OPENAI_API_KEY not set. LLM features will not work.")
                self._client = openai.OpenAI(api_key=api_key) if api_key else None
            except ImportError:
                logger.error("openai package not installed. Install with: pip install openai")
                self._client = None
        elif self.provider.lower() == 'anthropic':
            try:
                import anthropic
                api_key = config('ANTHROPIC_API_KEY', default='')
                if not api_key:
                    logger.warning("ANTHROPIC_API_KEY not set. LLM features will not work.")
                self._client = anthropic.Anthropic(api_key=api_key) if api_key else None
            except ImportError:
                logger.error("anthropic package not installed. Install with: pip install anthropic")
                self._client = None
        else:
            logger.warning(f"Unknown LLM provider: {self.provider}")
            self._client = None
    
    def generate_explanation(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Generate explanation using LLM.
        
        Args:
            prompt: The prompt to send to LLM
            context: Additional context data
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0-1)
        
        Returns:
            Dictionary with:
            - content: Generated text
            - tokens_used: Number of tokens used
            - cost: Estimated cost
            - model: Model used
        """
        if not self._client:
            raise ValueError(f"LLM client not initialized for provider: {self.provider}")
        
        try:
            if self.provider.lower() == 'openai':
                return self._generate_openai(prompt, context, max_tokens, temperature)
            elif self.provider.lower() == 'anthropic':
                return self._generate_anthropic(prompt, context, max_tokens, temperature)
        except Exception as e:
            logger.error(f"Error generating explanation with {self.provider}: {str(e)}")
            raise
    
    def _generate_openai(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]],
        max_tokens: int,
        temperature: float
    ) -> Dict[str, Any]:
        """Generate using OpenAI API."""
        model = config('OPENAI_MODEL', default='gpt-3.5-turbo')
        
        # Build system message with context
        system_message = "You are a numerology expert providing warm, encouraging, and practical insights."
        if context:
            system_message += f"\n\nContext: {self._format_context(context)}"
        
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ]
        
        response = self._client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        content = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        # Estimate cost (rough calculation)
        # GPT-3.5-turbo: ~$0.002 per 1K tokens
        cost = (tokens_used / 1000) * 0.002
        
        return {
            'content': content,
            'tokens_used': tokens_used,
            'cost': cost,
            'model': model,
            'provider': 'openai'
        }
    
    def _generate_anthropic(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]],
        max_tokens: int,
        temperature: float
    ) -> Dict[str, Any]:
        """Generate using Anthropic API."""
        model = config('ANTHROPIC_MODEL', default='claude-3-haiku-20240307')
        
        # Build system message with context
        system_message = "You are a numerology expert providing warm, encouraging, and practical insights."
        if context:
            system_message += f"\n\nContext: {self._format_context(context)}"
        
        message = f"{system_message}\n\n{prompt}"
        
        response = self._client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=[{"role": "user", "content": message}]
        )
        
        content = response.content[0].text
        tokens_used = response.usage.input_tokens + response.usage.output_tokens
        
        # Estimate cost (rough calculation)
        # Claude 3 Haiku: ~$0.00025 per 1K input tokens, ~$0.00125 per 1K output tokens
        input_cost = (response.usage.input_tokens / 1000) * 0.00025
        output_cost = (response.usage.output_tokens / 1000) * 0.00125
        cost = input_cost + output_cost
        
        return {
            'content': content,
            'tokens_used': tokens_used,
            'cost': cost,
            'model': model,
            'provider': 'anthropic'
        }
    
    def _format_context(self, context: Dict[str, Any]) -> str:
        """Format context dictionary into readable string."""
        parts = []
        for key, value in context.items():
            if isinstance(value, (dict, list)):
                parts.append(f"{key}: {str(value)}")
            else:
                parts.append(f"{key}: {value}")
        return ", ".join(parts)
    
    def is_available(self) -> bool:
        """Check if LLM service is available."""
        return self._client is not None


def get_llm_service(provider: Optional[str] = None) -> LLMService:
    """Get LLM service instance."""
    return LLMService(provider=provider)

