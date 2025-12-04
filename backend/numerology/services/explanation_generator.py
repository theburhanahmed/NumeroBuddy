"""
Explanation generator service for numerology insights.
"""
import hashlib
import json
import logging
from typing import Dict, Optional, Any
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta

from .llm_service import get_llm_service
from ..models import Explanation

logger = logging.getLogger(__name__)


class ExplanationGenerator:
    """Generate human-readable explanations for numerology insights."""
    
    def __init__(self, llm_provider: Optional[str] = None):
        """
        Initialize explanation generator.
        
        Args:
            llm_provider: LLM provider to use ('openai' or 'anthropic')
        """
        self.llm_service = get_llm_service(provider=llm_provider)
        self.cache_ttl = 86400  # 24 hours
    
    def generate_raj_yog_explanation(
        self,
        user,
        raj_yog_data: Dict[str, Any],
        numerology_profile: Dict[str, Any]
    ) -> Explanation:
        """
        Generate explanation for Raj Yog detection.
        
        Args:
            user: User instance
            raj_yog_data: Raj Yog detection results
            numerology_profile: User's numerology profile data
        
        Returns:
            Explanation instance
        """
        # Check cache first
        cache_key = self._generate_cache_key('raj_yog', raj_yog_data, numerology_profile)
        cached = cache.get(cache_key)
        
        if cached:
            logger.info(f"Using cached explanation for Raj Yog: {cache_key}")
            explanation = Explanation.objects.filter(id=cached.get('explanation_id')).first()
            if explanation:
                return explanation
        
        # Generate prompt
        prompt = self._build_raj_yog_prompt(raj_yog_data, numerology_profile)
        
        # Generate explanation
        try:
            if not self.llm_service.is_available():
                logger.warning("LLM service not available, using template explanation")
                content = self._generate_template_raj_yog_explanation(raj_yog_data, numerology_profile)
                llm_data = {
                    'content': content,
                    'tokens_used': 0,
                    'cost': 0,
                    'model': 'template',
                    'provider': 'template'
                }
            else:
                context = {
                    'life_path': numerology_profile.get('life_path_number'),
                    'destiny': numerology_profile.get('destiny_number'),
                    'soul_urge': numerology_profile.get('soul_urge_number'),
                    'personality': numerology_profile.get('personality_number'),
                    'raj_yog_name': raj_yog_data.get('yog_name'),
                    'strength_score': raj_yog_data.get('strength_score')
                }
                llm_data = self.llm_service.generate_explanation(
                    prompt=prompt,
                    context=context,
                    max_tokens=600,  # Increased for richer explanations
                    temperature=0.7
                )
                content = llm_data['content']
        except Exception as e:
            logger.error(f"Error generating LLM explanation: {str(e)}")
            content = self._generate_template_raj_yog_explanation(raj_yog_data, numerology_profile)
            llm_data = {
                'content': content,
                'tokens_used': 0,
                'cost': 0,
                'model': 'template',
                'provider': 'template'
            }
        
        # Create explanation instance
        explanation = Explanation.objects.create(
            user=user,
            explanation_type='raj_yog',
            title=f"Raj Yog Explanation: {raj_yog_data.get('yog_name', 'No Raj Yog')}",
            content=content,
            llm_provider=llm_data.get('provider', 'template'),
            llm_model=llm_data.get('model', 'template'),
            tokens_used=llm_data.get('tokens_used', 0),
            cost=llm_data.get('cost', 0),
            context_data={
                'raj_yog_data': raj_yog_data,
                'numerology_profile': numerology_profile
            },
            is_cached=False,
            cache_key=cache_key,
            expires_at=timezone.now() + timedelta(days=30)
        )
        
        # Cache the explanation
        cache.set(cache_key, {'explanation_id': str(explanation.id)}, self.cache_ttl)
        
        return explanation
    
    def generate_daily_explanation(
        self,
        user,
        daily_reading: Dict[str, Any],
        numerology_profile: Dict[str, Any],
        raj_yog_status: Optional[str] = None
    ) -> Explanation:
        """
        Generate personalized daily reading explanation.
        
        Args:
            user: User instance
            daily_reading: Daily reading data
            numerology_profile: User's numerology profile
            raj_yog_status: Optional Raj Yog status for the day
        
        Returns:
            Explanation instance
        """
        # Check cache first
        cache_key = self._generate_cache_key('daily', daily_reading, numerology_profile)
        cached = cache.get(cache_key)
        
        if cached:
            logger.info(f"Using cached daily explanation: {cache_key}")
            explanation = Explanation.objects.filter(id=cached.get('explanation_id')).first()
            if explanation:
                return explanation
        
        # Generate prompt
        prompt = self._build_daily_prompt(daily_reading, numerology_profile, raj_yog_status)
        
        # Generate explanation
        try:
            if not self.llm_service.is_available():
                logger.warning("LLM service not available, using template explanation")
                content = self._generate_template_daily_explanation(daily_reading, numerology_profile)
                llm_data = {
                    'content': content,
                    'tokens_used': 0,
                    'cost': 0,
                    'model': 'template',
                    'provider': 'template'
                }
            else:
                context = {
                    'personal_day_number': daily_reading.get('personal_day_number'),
                    'life_path': numerology_profile.get('life_path_number'),
                    'destiny': numerology_profile.get('destiny_number'),
                    'raj_yog_status': raj_yog_status
                }
                llm_data = self.llm_service.generate_explanation(
                    prompt=prompt,
                    context=context,
                    max_tokens=400,  # Increased for richer explanations
                    temperature=0.7
                )
                content = llm_data['content']
        except Exception as e:
            logger.error(f"Error generating LLM explanation: {str(e)}")
            content = self._generate_template_daily_explanation(daily_reading, numerology_profile)
            llm_data = {
                'content': content,
                'tokens_used': 0,
                'cost': 0,
                'model': 'template',
                'provider': 'template'
            }
        
        # Create explanation instance
        explanation = Explanation.objects.create(
            user=user,
            explanation_type='daily',
            title=f"Daily Reading Explanation - Day {daily_reading.get('personal_day_number')}",
            content=content,
            llm_provider=llm_data.get('provider', 'template'),
            llm_model=llm_data.get('model', 'template'),
            tokens_used=llm_data.get('tokens_used', 0),
            cost=llm_data.get('cost', 0),
            context_data={
                'daily_reading': daily_reading,
                'numerology_profile': numerology_profile,
                'raj_yog_status': raj_yog_status
            },
            is_cached=False,
            cache_key=cache_key,
            expires_at=timezone.now() + timedelta(days=1)  # Daily explanations expire after 1 day
        )
        
        # Cache the explanation
        cache.set(cache_key, {'explanation_id': str(explanation.id)}, self.cache_ttl)
        
        return explanation
    
    def generate_weekly_explanation(
        self,
        user,
        weekly_report: Dict[str, Any],
        numerology_profile: Dict[str, Any]
    ) -> Explanation:
        """
        Generate explanation for weekly report.
        
        Args:
            user: User instance
            weekly_report: Weekly report data
            numerology_profile: User's numerology profile
        
        Returns:
            Explanation instance
        """
        cache_key = self._generate_cache_key('weekly', weekly_report, numerology_profile)
        cached = cache.get(cache_key)
        
        if cached:
            explanation = Explanation.objects.filter(id=cached.get('explanation_id')).first()
            if explanation:
                return explanation
        
        prompt = self._build_weekly_prompt(weekly_report, numerology_profile)
        
        try:
            if not self.llm_service.is_available():
                content = self._generate_template_weekly_explanation(weekly_report, numerology_profile)
                llm_data = {'content': content, 'tokens_used': 0, 'cost': 0, 'model': 'template', 'provider': 'template'}
            else:
                context = {
                    'weekly_number': weekly_report.get('weekly_number'),
                    'life_path': numerology_profile.get('life_path_number'),
                    'main_theme': weekly_report.get('main_theme')
                }
                llm_data = self.llm_service.generate_explanation(
                    prompt=prompt,
                    context=context,
                    max_tokens=500,
                    temperature=0.7
                )
                content = llm_data['content']
        except Exception as e:
            logger.error(f"Error generating weekly explanation: {str(e)}")
            content = self._generate_template_weekly_explanation(weekly_report, numerology_profile)
            llm_data = {'content': content, 'tokens_used': 0, 'cost': 0, 'model': 'template', 'provider': 'template'}
        
        explanation = Explanation.objects.create(
            user=user,
            explanation_type='weekly',
            title=f"Weekly Report Explanation - Week {weekly_report.get('week_number')}",
            content=content,
            llm_provider=llm_data.get('provider', 'template'),
            llm_model=llm_data.get('model', 'template'),
            tokens_used=llm_data.get('tokens_used', 0),
            cost=llm_data.get('cost', 0),
            context_data={'weekly_report': weekly_report, 'numerology_profile': numerology_profile},
            is_cached=False,
            cache_key=cache_key,
            expires_at=timezone.now() + timedelta(days=7)
        )
        
        cache.set(cache_key, {'explanation_id': str(explanation.id)}, self.cache_ttl)
        return explanation
    
    def generate_yearly_explanation(
        self,
        user,
        yearly_report: Dict[str, Any],
        numerology_profile: Dict[str, Any]
    ) -> Explanation:
        """
        Generate explanation for yearly report.
        
        Args:
            user: User instance
            yearly_report: Yearly report data
            numerology_profile: User's numerology profile
        
        Returns:
            Explanation instance
        """
        cache_key = self._generate_cache_key('yearly', yearly_report, numerology_profile)
        cached = cache.get(cache_key)
        
        if cached:
            explanation = Explanation.objects.filter(id=cached.get('explanation_id')).first()
            if explanation:
                return explanation
        
        prompt = self._build_yearly_prompt(yearly_report, numerology_profile)
        
        try:
            if not self.llm_service.is_available():
                content = self._generate_template_yearly_explanation(yearly_report, numerology_profile)
                llm_data = {'content': content, 'tokens_used': 0, 'cost': 0, 'model': 'template', 'provider': 'template'}
            else:
                context = {
                    'personal_year': yearly_report.get('personal_year_number'),
                    'life_path': numerology_profile.get('life_path_number'),
                    'cycle_phase': yearly_report.get('personal_year_cycle')
                }
                llm_data = self.llm_service.generate_explanation(
                    prompt=prompt,
                    context=context,
                    max_tokens=800,  # Longer for yearly reports
                    temperature=0.7
                )
                content = llm_data['content']
        except Exception as e:
            logger.error(f"Error generating yearly explanation: {str(e)}")
            content = self._generate_template_yearly_explanation(yearly_report, numerology_profile)
            llm_data = {'content': content, 'tokens_used': 0, 'cost': 0, 'model': 'template', 'provider': 'template'}
        
        explanation = Explanation.objects.create(
            user=user,
            explanation_type='yearly',
            title=f"Yearly Report Explanation - {yearly_report.get('year')}",
            content=content,
            llm_provider=llm_data.get('provider', 'template'),
            llm_model=llm_data.get('model', 'template'),
            tokens_used=llm_data.get('tokens_used', 0),
            cost=llm_data.get('cost', 0),
            context_data={'yearly_report': yearly_report, 'numerology_profile': numerology_profile},
            is_cached=False,
            cache_key=cache_key,
            expires_at=timezone.now() + timedelta(days=365)
        )
        
        cache.set(cache_key, {'explanation_id': str(explanation.id)}, self.cache_ttl)
        return explanation
    
    def _build_raj_yog_prompt(self, raj_yog_data: Dict, numerology_profile: Dict) -> str:
        """Build prompt for Raj Yog explanation with richer context."""
        yog_name = raj_yog_data.get('yog_name', 'No Raj Yog')
        strength = raj_yog_data.get('strength_score', 0)
        combinations = raj_yog_data.get('detected_combinations', [])
        life_path = numerology_profile.get('life_path_number')
        destiny = numerology_profile.get('destiny_number')
        soul_urge = numerology_profile.get('soul_urge_number')
        personality = numerology_profile.get('personality_number')
        
        # Get interpretations for richer context
        try:
            from ..interpretations import get_interpretation
            life_path_interp = get_interpretation(life_path) if life_path else None
            destiny_interp = get_interpretation(destiny) if destiny else None
        except:
            life_path_interp = None
            destiny_interp = None
        
        prompt = f"""Generate a warm, encouraging, and deeply personalized explanation for this Raj Yog detection:

Raj Yog Name: {yog_name}
Strength Score: {strength}/100

Core Numerology Numbers:
- Life Path Number: {life_path}{f" ({life_path_interp['title']})" if life_path_interp else ""}
- Destiny Number: {destiny}{f" ({destiny_interp['title']})" if destiny_interp else ""}
- Soul Urge Number: {soul_urge}
- Personality Number: {personality}

Detected Combinations: {json.dumps(combinations, indent=2)}

Context:
{f"- Life Path traits: {', '.join(life_path_interp['strengths'][:3])}" if life_path_interp and life_path_interp.get('strengths') else ""}
{f"- Destiny traits: {', '.join(destiny_interp['strengths'][:3])}" if destiny_interp and destiny_interp.get('strengths') else ""}

Please provide a comprehensive explanation that:
1. Explains what this Raj Yog means specifically for someone with these numerology numbers
2. Describes how the Life Path and Destiny numbers work together to create this auspicious combination
3. Details the unique strengths and opportunities this Raj Yog brings
4. Provides practical, actionable guidance on how to harness this energy in daily life
5. Discusses how to align actions with both the Raj Yog and the person's core numbers
6. Mentions any important considerations or cautions
7. Connects the Raj Yog to the person's life purpose and potential

Keep the tone warm, encouraging, deeply personal, and practical. Write 300-500 words with specific examples and actionable advice."""
        
        return prompt
    
    def _build_daily_prompt(self, daily_reading: Dict, numerology_profile: Dict, raj_yog_status: Optional[str]) -> str:
        """Build prompt for daily reading explanation with richer context."""
        day_number = daily_reading.get('personal_day_number')
        life_path = numerology_profile.get('life_path_number')
        destiny = numerology_profile.get('destiny_number')
        soul_urge = numerology_profile.get('soul_urge_number')
        
        # Get interpretations for richer context
        try:
            from ..interpretations import get_interpretation
            day_interp = get_interpretation(day_number) if day_number else None
            life_path_interp = get_interpretation(life_path) if life_path else None
        except:
            day_interp = None
            life_path_interp = None
        
        prompt = f"""Generate a warm, personalized, and deeply insightful daily numerology reading explanation:

Personal Day Number: {day_number}{f" - {day_interp['title']}" if day_interp else ""}
Life Path Number: {life_path}{f" ({life_path_interp['title']})" if life_path_interp else ""}
Destiny Number: {destiny}
Soul Urge Number: {soul_urge}
Raj Yog Status: {raj_yog_status or 'Not applicable'}

Today's Guidance:
- Lucky Color: {daily_reading.get('lucky_color')}
- Activity: {daily_reading.get('activity_recommendation')}
- Affirmation: {daily_reading.get('affirmation')}
- Warning: {daily_reading.get('warning')}

Context:
{f"- Day {day_number} energy: {day_interp['description'][:150]}" if day_interp else ""}
{f"- Life Path alignment: {life_path_interp['life_purpose']}" if life_path_interp else ""}

Please provide:
1. A personalized explanation of what this day number means specifically for someone with Life Path {life_path}
2. How today's energy interacts with their core numerology numbers
3. Practical, specific guidance for the day that aligns with their life path
4. How to leverage today's lucky elements (color, activity) in their daily life
5. Connection between today's energy and their broader life purpose
6. Encouragement and positive insights tailored to their numerology profile
{f"7. Special note about Raj Yog influence if applicable" if raj_yog_status == 'detected' else ""}

Keep it warm, deeply personal, actionable, and inspiring. Write 150-250 words with specific examples."""
        
        return prompt
    
    def _build_weekly_prompt(self, weekly_report: Dict, numerology_profile: Dict) -> str:
        """Build prompt for weekly report explanation."""
        weekly_number = weekly_report.get('weekly_number')
        main_theme = weekly_report.get('main_theme')
        trends = weekly_report.get('weekly_trends', {})
        
        prompt = f"""Generate a comprehensive weekly numerology report explanation:

Weekly Number: {weekly_number}
Main Theme: {main_theme}
Life Path: {numerology_profile.get('life_path_number')}

Weekly Trends:
- Most common day number: {trends.get('most_common_day_number')}
- Raj Yog days: {trends.get('raj_yog_days', 0)}
- Dominant energy: {trends.get('dominant_energy')}

Please provide:
1. What this week's energy means for the person
2. How to align with the weekly theme
3. Practical guidance based on trends
4. Connection to life path and destiny

Write 200-300 words."""
        return prompt
    
    def _build_yearly_prompt(self, yearly_report: Dict, numerology_profile: Dict) -> str:
        """Build prompt for yearly report explanation."""
        personal_year = yearly_report.get('personal_year_number')
        cycle_phase = yearly_report.get('personal_year_cycle')
        major_themes = yearly_report.get('major_themes', [])
        
        prompt = f"""Generate a comprehensive yearly numerology report explanation:

Personal Year: {personal_year}
Cycle Phase: {cycle_phase}
Life Path: {numerology_profile.get('life_path_number')}
Major Themes: {', '.join(major_themes[:3])}

Please provide:
1. What this year means for the person
2. How to navigate the cycle phase
3. Alignment with major themes
4. Long-term guidance

Write 400-600 words."""
        return prompt
    
    def _generate_template_raj_yog_explanation(self, raj_yog_data: Dict, numerology_profile: Dict) -> str:
        """Generate template-based Raj Yog explanation as fallback."""
        yog_name = raj_yog_data.get('yog_name', 'No Raj Yog')
        strength = raj_yog_data.get('strength_score', 0)
        
        if not raj_yog_data.get('is_detected'):
            return f"Your numerology profile does not show a traditional Raj Yog combination. However, every number combination has its unique strengths and opportunities. Focus on developing your Life Path {numerology_profile.get('life_path_number')} and Destiny {numerology_profile.get('destiny_number')} qualities to create your own path to success."
        
        return f"""You have been blessed with {yog_name}, which indicates auspicious energy in your numerology profile. 

With a strength score of {strength}/100, this Raj Yog brings significant potential for success, leadership, and spiritual growth. Your Life Path {numerology_profile.get('life_path_number')} and Destiny {numerology_profile.get('destiny_number')} numbers work in harmony to create powerful opportunities.

This combination suggests that you have natural abilities that, when properly harnessed, can lead to great achievements. Focus on aligning your actions with your numerological strengths, and you'll find that opportunities come more easily.

Remember that Raj Yog is a gift, but it requires conscious effort and alignment to fully manifest its benefits. Stay true to your path, trust your intuition, and take practical steps toward your goals."""
    
    def _generate_template_daily_explanation(self, daily_reading: Dict, numerology_profile: Dict) -> str:
        """Generate template-based daily explanation as fallback."""
        day_number = daily_reading.get('personal_day_number')
        life_path = numerology_profile.get('life_path_number')
        
        return f"""Today is a Personal Day {day_number} for you. This number energy influences your day and interacts with your Life Path {life_path} to create unique opportunities.

The energy of {day_number} brings its own qualities to your experience today. Combined with your life path, this creates a day where you can make meaningful progress toward your goals.

Remember to stay aligned with your numerology strengths and take practical action on the guidance provided in your daily reading."""
    
    def _generate_template_weekly_explanation(self, weekly_report: Dict, numerology_profile: Dict) -> str:
        """Generate template-based weekly explanation as fallback."""
        weekly_number = weekly_report.get('weekly_number')
        main_theme = weekly_report.get('main_theme')
        
        return f"""This week is governed by the energy of number {weekly_number}. The main theme is {main_theme}, which will influence your experiences throughout the week.

Align your actions with this weekly energy and focus on the recommendations provided in your weekly report."""
    
    def _generate_template_yearly_explanation(self, yearly_report: Dict, numerology_profile: Dict) -> str:
        """Generate template-based yearly explanation as fallback."""
        personal_year = yearly_report.get('personal_year_number')
        cycle_phase = yearly_report.get('personal_year_cycle')
        
        return f"""This is Personal Year {personal_year} for you, which is in the {cycle_phase} phase of your 9-year cycle. This year brings unique energies and opportunities aligned with this cycle phase.

Focus on the major themes and recommendations provided in your yearly report to make the most of this year's potential."""
    
    def _generate_cache_key(self, explanation_type: str, data: Dict, profile: Dict) -> str:
        """Generate cache key for explanation."""
        # Create a hash of the relevant data
        key_data = {
            'type': explanation_type,
            'data': data,
            'profile': {
                'life_path': profile.get('life_path_number'),
                'destiny': profile.get('destiny_number'),
            }
        }
        key_string = json.dumps(key_data, sort_keys=True)
        return f"explanation:{explanation_type}:{hashlib.md5(key_string.encode()).hexdigest()}"


def get_explanation_generator(llm_provider: Optional[str] = None) -> ExplanationGenerator:
    """Get explanation generator instance."""
    return ExplanationGenerator(llm_provider=llm_provider)
