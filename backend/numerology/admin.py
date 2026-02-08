"""
Django admin configuration for numerology models.
"""
from django.contrib import admin
from .models import (
    NumerologyProfile,
    DailyReading,
    CompatibilityCheck,
    Remedy,
    RemedyTracking,
    RemedyEffectiveness,
    RemedyCombination,
    RemedyReminder,
    Person,
    PersonNumerologyProfile,
    RajYogDetection,
    Explanation,
    WeeklyReport,
    YearlyReport,
    NameReport,
    PhoneReport,
    DetailedReading,
    HealthNumerologyProfile,
    NameCorrection,
    SpiritualNumerologyProfile,
    SoulContract,
    KarmicTimeline,
    RebirthCycle,
    PredictiveCycle,
    LifeMilestone,
    GenerationalAnalysis,
    FamilyUnitProfile,
    KarmicContract,
    FengShuiAnalysis,
    SpaceOptimization,
    RoomNumerology,
    MentalStateTracking,
    MentalStateAnalysis,
    EmotionalCycle,
)


# ============================================================================
# Core Profile Models
# ============================================================================

@admin.register(NumerologyProfile)
class NumerologyProfileAdmin(admin.ModelAdmin):
    """Admin interface for NumerologyProfile model."""
    
    list_display = ['user', 'life_path_number', 'destiny_number', 'calculation_system', 'updated_at']
    list_filter = ['calculation_system', 'life_path_number', 'destiny_number']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-updated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Core Numbers', {'fields': ('life_path_number', 'destiny_number', 'soul_urge_number', 'personality_number', 'attitude_number', 'maturity_number', 'balance_number')}),
        ('Cycles', {'fields': ('personal_year_number', 'personal_month_number')}),
        ('Enhanced Numbers', {'fields': ('karmic_debt_number', 'hidden_passion_number', 'subconscious_self_number')}),
        ('Chaldean Numbers', {'fields': ('birthday_number', 'driver_number', 'conductor_number')}),
        ('Lo Shu Grid', {'fields': ('lo_shu_grid', 'personality_arrows')}),
        ('Zodiac Data', {'fields': ('zodiac_planet_data',)}),
        ('Metadata', {'fields': ('calculation_system', 'calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


@admin.register(PersonNumerologyProfile)
class PersonNumerologyProfileAdmin(admin.ModelAdmin):
    """Admin interface for PersonNumerologyProfile model."""
    
    list_display = ['person', 'life_path_number', 'destiny_number', 'calculation_system', 'calculated_at']
    list_filter = ['calculation_system', 'life_path_number', 'destiny_number']
    search_fields = ['person__user__email', 'person__user__full_name', 'person__name']
    ordering = ['-calculated_at']
    
    fieldsets = (
        ('Person', {'fields': ('person',)}),
        ('Core Numbers', {'fields': ('life_path_number', 'destiny_number', 'soul_urge_number', 'personality_number', 'attitude_number', 'maturity_number', 'balance_number')}),
        ('Cycles', {'fields': ('personal_year_number', 'personal_month_number')}),
        ('Metadata', {'fields': ('calculation_system', 'calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


@admin.register(HealthNumerologyProfile)
class HealthNumerologyProfileAdmin(admin.ModelAdmin):
    """Admin interface for HealthNumerologyProfile model."""
    
    list_display = ['user', 'stress_number', 'vitality_number', 'health_cycle_number', 'updated_at']
    list_filter = ['stress_number', 'vitality_number', 'health_cycle_number']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-updated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Health Numbers', {'fields': ('stress_number', 'vitality_number', 'health_cycle_number')}),
        ('Health Cycles', {'fields': ('health_cycles', 'current_cycle')}),
        ('Medical Timing', {'fields': ('medical_timing', 'health_windows')}),
        ('Risk Periods', {'fields': ('risk_periods',)}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


@admin.register(SpiritualNumerologyProfile)
class SpiritualNumerologyProfileAdmin(admin.ModelAdmin):
    """Admin interface for SpiritualNumerologyProfile model."""
    
    list_display = ['user', 'calculated_at', 'updated_at']
    list_filter = ['calculated_at']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-updated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Spiritual Data', {'fields': ('soul_contracts', 'karmic_cycles', 'rebirth_cycles', 'divine_gifts')}),
        ('Alignment', {'fields': ('spiritual_alignment', 'past_life_connections')}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


# ============================================================================
# Reading/Report Models
# ============================================================================

@admin.register(DailyReading)
class DailyReadingAdmin(admin.ModelAdmin):
    """Admin interface for DailyReading model."""
    
    list_display = ['user', 'reading_date', 'personal_day_number', 'lucky_number', 'raj_yog_status']
    list_filter = ['reading_date', 'personal_day_number', 'raj_yog_status']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-reading_date']
    
    fieldsets = (
        ('User & Date', {'fields': ('user', 'reading_date')}),
        ('Numbers', {'fields': ('personal_day_number', 'lucky_number')}),
        ('Content', {'fields': ('lucky_color', 'auspicious_time', 'activity_recommendation', 'warning', 'affirmation', 'actionable_tip')}),
        ('Raj Yog', {'fields': ('raj_yog_status', 'raj_yog_insight')}),
        ('LLM Explanation', {'fields': ('llm_explanation', 'explanation_id')}),
        ('Metadata', {'fields': ('generated_at',)}),
    )
    
    readonly_fields = ['generated_at']


@admin.register(WeeklyReport)
class WeeklyReportAdmin(admin.ModelAdmin):
    """Admin interface for WeeklyReport model."""
    
    list_display = ['user', 'person', 'week_start_date', 'week_number', 'year', 'weekly_number']
    list_filter = ['year', 'week_number', 'raj_yog_status']
    search_fields = ['user__email', 'user__full_name', 'person__name']
    ordering = ['-week_start_date']
    
    fieldsets = (
        ('User & Person', {'fields': ('user', 'person')}),
        ('Week Information', {'fields': ('week_start_date', 'week_end_date', 'week_number', 'year')}),
        ('Numbers', {'fields': ('weekly_number', 'personal_year_number', 'personal_month_number')}),
        ('Report Content', {'fields': ('main_theme', 'weekly_summary', 'daily_insights', 'weekly_trends', 'recommendations', 'challenges', 'opportunities')}),
        ('Raj Yog', {'fields': ('raj_yog_status', 'raj_yog_insights')}),
        ('LLM Content', {'fields': ('llm_summary', 'explanation_id')}),
        ('Metadata', {'fields': ('generated_at', 'updated_at')}),
    )
    
    readonly_fields = ['generated_at', 'updated_at']


@admin.register(YearlyReport)
class YearlyReportAdmin(admin.ModelAdmin):
    """Admin interface for YearlyReport model."""
    
    list_display = ['user', 'person', 'year', 'personal_year_number', 'generated_at']
    list_filter = ['year', 'personal_year_number', 'annual_raj_yog_status']
    search_fields = ['user__email', 'user__full_name', 'person__name']
    ordering = ['-year']
    
    fieldsets = (
        ('User & Person', {'fields': ('user', 'person')}),
        ('Year Information', {'fields': ('year', 'personal_year_number', 'personal_year_cycle')}),
        ('Report Content', {'fields': ('annual_overview', 'major_themes', 'month_by_month', 'key_dates', 'opportunities', 'challenges', 'recommendations')}),
        ('Raj Yog Analysis', {'fields': ('annual_raj_yog_status', 'raj_yog_patterns', 'raj_yog_insights')}),
        ('LLM Content', {'fields': ('llm_overview', 'explanation_id')}),
        ('Metadata', {'fields': ('generated_at', 'updated_at')}),
    )
    
    readonly_fields = ['generated_at', 'updated_at']


@admin.register(NameReport)
class NameReportAdmin(admin.ModelAdmin):
    """Admin interface for NameReport model."""
    
    list_display = ['user', 'name_type', 'system', 'computed_at']
    list_filter = ['name_type', 'system', 'computed_at']
    search_fields = ['user__email', 'user__full_name', 'name', 'normalized_name']
    ordering = ['-computed_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Name Information', {'fields': ('name', 'name_type', 'system', 'normalized_name')}),
        ('Calculated Numbers', {'fields': ('numbers', 'breakdown')}),
        ('LLM Explanation', {'fields': ('explanation', 'explanation_error')}),
        ('Metadata', {'fields': ('computed_at', 'version')}),
    )
    
    readonly_fields = ['computed_at']


@admin.register(PhoneReport)
class PhoneReportAdmin(admin.ModelAdmin):
    """Admin interface for PhoneReport model."""
    
    list_display = ['user', 'method', 'country', 'computed_at']
    list_filter = ['method', 'country', 'computed_at']
    search_fields = ['user__email', 'user__full_name', 'phone_raw', 'phone_e164']
    ordering = ['-computed_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Phone Information', {'fields': ('phone_raw', 'phone_e164', 'country', 'method')}),
        ('Computed Data', {'fields': ('computed',)}),
        ('LLM Explanation', {'fields': ('explanation', 'explanation_error')}),
        ('Metadata', {'fields': ('computed_at', 'version')}),
    )
    
    readonly_fields = ['computed_at']


@admin.register(DetailedReading)
class DetailedReadingAdmin(admin.ModelAdmin):
    """Admin interface for DetailedReading model."""
    
    list_display = ['user', 'reading_type', 'number', 'generated_at']
    list_filter = ['reading_type', 'number', 'generated_by_ai', 'generated_at']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-generated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Reading Details', {'fields': ('reading_type', 'number')}),
        ('AI Content', {'fields': ('detailed_interpretation', 'career_insights', 'relationship_insights', 'life_purpose', 'challenges_and_growth', 'personalized_advice')}),
        ('Metadata', {'fields': ('generated_at', 'generated_by_ai', 'updated_at')}),
    )
    
    readonly_fields = ['generated_at', 'updated_at']


# ============================================================================
# Remedy Models
# ============================================================================

@admin.register(Remedy)
class RemedyAdmin(admin.ModelAdmin):
    """Admin interface for Remedy model."""
    
    list_display = ['user', 'remedy_type', 'title', 'priority', 'difficulty', 'is_active', 'created_at']
    list_filter = ['remedy_type', 'difficulty', 'frequency', 'is_active', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'title', 'description']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Remedy Details', {'fields': ('remedy_type', 'title', 'description', 'recommendation')}),
        ('Settings', {'fields': ('priority', 'difficulty', 'duration_minutes', 'frequency', 'is_active')}),
        ('Personalization', {'fields': ('personalization_data',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RemedyTracking)
class RemedyTrackingAdmin(admin.ModelAdmin):
    """Admin interface for RemedyTracking model."""
    
    list_display = ['user', 'remedy', 'date', 'is_completed', 'effectiveness_rating']
    list_filter = ['is_completed', 'date', 'mood_before', 'mood_after']
    search_fields = ['user__email', 'user__full_name', 'remedy__title']
    ordering = ['-date']
    
    fieldsets = (
        ('User & Remedy', {'fields': ('user', 'remedy')}),
        ('Tracking', {'fields': ('date', 'is_completed', 'effectiveness_rating')}),
        ('Mood Tracking', {'fields': ('mood_before', 'mood_after')}),
        ('Notes', {'fields': ('notes',)}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']


@admin.register(RemedyEffectiveness)
class RemedyEffectivenessAdmin(admin.ModelAdmin):
    """Admin interface for RemedyEffectiveness model."""
    
    list_display = ['user', 'remedy', 'effectiveness_score', 'period_start', 'period_end', 'analyzed_at']
    list_filter = ['analyzed_at', 'period_start', 'period_end']
    search_fields = ['user__email', 'user__full_name', 'remedy__title', 'feedback']
    ordering = ['-analyzed_at']
    
    fieldsets = (
        ('User & Remedy', {'fields': ('user', 'remedy')}),
        ('Effectiveness', {'fields': ('effectiveness_score', 'feedback')}),
        ('Period', {'fields': ('period_start', 'period_end')}),
        ('Metadata', {'fields': ('analyzed_at',)}),
    )
    
    readonly_fields = ['analyzed_at']


@admin.register(RemedyCombination)
class RemedyCombinationAdmin(admin.ModelAdmin):
    """Admin interface for RemedyCombination model."""
    
    list_display = ['user', 'primary_remedy', 'secondary_remedy', 'combination_score', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'primary_remedy__title', 'secondary_remedy__title']
    ordering = ['-combination_score']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Remedies', {'fields': ('primary_remedy', 'secondary_remedy')}),
        ('Combination', {'fields': ('combination_score', 'notes', 'is_active')}),
        ('Metadata', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']


@admin.register(RemedyReminder)
class RemedyReminderAdmin(admin.ModelAdmin):
    """Admin interface for RemedyReminder model."""
    
    list_display = ['user', 'remedy', 'frequency', 'reminder_time', 'is_active', 'next_send_at']
    list_filter = ['frequency', 'is_active', 'next_send_at']
    search_fields = ['user__email', 'user__full_name', 'remedy__title']
    ordering = ['next_send_at']
    
    fieldsets = (
        ('User & Remedy', {'fields': ('user', 'remedy')}),
        ('Reminder Settings', {'fields': ('frequency', 'reminder_time', 'is_active')}),
        ('Schedule', {'fields': ('last_sent_at', 'next_send_at')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


# ============================================================================
# Person/Family Models
# ============================================================================

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    """Admin interface for Person model."""
    
    list_display = ['user', 'name', 'birth_date', 'relationship', 'is_active', 'created_at']
    list_filter = ['relationship', 'is_active', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Person Details', {'fields': ('name', 'birth_date', 'relationship', 'notes', 'is_active')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(FamilyUnitProfile)
class FamilyUnitProfileAdmin(admin.ModelAdmin):
    """Admin interface for FamilyUnitProfile model."""
    
    list_display = ['user', 'member_count', 'family_life_path', 'generational_number', 'compatibility_score', 'created_at']
    list_filter = ['member_count', 'generational_number', 'compatibility_score', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'family_unit_hash']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user', 'family_unit_hash', 'member_count')}),
        ('Family Numerology', {'fields': ('family_life_path', 'family_destiny', 'generational_number')}),
        ('Dynamics', {'fields': ('compatibility_score', 'dynamics')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(GenerationalAnalysis)
class GenerationalAnalysisAdmin(admin.ModelAdmin):
    """Admin interface for GenerationalAnalysis model."""
    
    list_display = ['user', 'generational_number', 'calculated_at']
    list_filter = ['generational_number', 'calculated_at']
    search_fields = ['user__email', 'user__full_name', 'family_unit_hash']
    ordering = ['-calculated_at']
    
    fieldsets = (
        ('User', {'fields': ('user', 'family_unit_hash')}),
        ('Analysis', {'fields': ('generational_number', 'analysis_data')}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


# ============================================================================
# Raj Yog/Explanation Models
# ============================================================================

@admin.register(RajYogDetection)
class RajYogDetectionAdmin(admin.ModelAdmin):
    """Admin interface for RajYogDetection model."""
    
    list_display = ['user', 'person', 'is_detected', 'yog_type', 'yog_name', 'strength_score', 'detected_at']
    list_filter = ['is_detected', 'yog_type', 'calculation_system', 'detected_at']
    search_fields = ['user__email', 'user__full_name', 'person__name', 'yog_name']
    ordering = ['-detected_at']
    
    fieldsets = (
        ('User & Person', {'fields': ('user', 'person')}),
        ('Detection Results', {'fields': ('is_detected', 'yog_type', 'yog_name', 'strength_score')}),
        ('Contributing Numbers', {'fields': ('contributing_numbers', 'detected_combinations')}),
        ('Metadata', {'fields': ('calculation_system', 'detected_at', 'updated_at')}),
    )
    
    readonly_fields = ['detected_at', 'updated_at']


@admin.register(Explanation)
class ExplanationAdmin(admin.ModelAdmin):
    """Admin interface for Explanation model."""
    
    list_display = ['user', 'explanation_type', 'title', 'llm_provider', 'is_cached', 'generated_at']
    list_filter = ['explanation_type', 'llm_provider', 'is_cached', 'generated_at']
    search_fields = ['user__email', 'user__full_name', 'title', 'content']
    ordering = ['-generated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Explanation', {'fields': ('explanation_type', 'title', 'content')}),
        ('LLM Metadata', {'fields': ('llm_provider', 'llm_model', 'tokens_used', 'cost')}),
        ('Context', {'fields': ('context_data',)}),
        ('Caching', {'fields': ('is_cached', 'cache_key', 'embedding')}),
        ('Metadata', {'fields': ('generated_at', 'expires_at')}),
    )
    
    readonly_fields = ['generated_at']


# ============================================================================
# Karmic/Spiritual Models
# ============================================================================

@admin.register(KarmicContract)
class KarmicContractAdmin(admin.ModelAdmin):
    """Admin interface for KarmicContract model."""
    
    list_display = ['user', 'parent_person', 'child_person', 'contract_type', 'compatibility_score', 'calculated_at']
    list_filter = ['contract_type', 'calculated_at']
    search_fields = ['user__email', 'user__full_name', 'parent_person__name', 'child_person__name']
    ordering = ['-calculated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Relationships', {'fields': ('parent_person', 'child_person')}),
        ('Contract Analysis', {'fields': ('contract_type', 'karmic_lessons', 'compatibility_score', 'analysis_data')}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


@admin.register(KarmicTimeline)
class KarmicTimelineAdmin(admin.ModelAdmin):
    """Admin interface for KarmicTimeline model."""
    
    list_display = ['user', 'spiritual_profile', 'start_year', 'end_year', 'cycle_number', 'is_current', 'calculated_at']
    list_filter = ['is_current', 'cycle_number', 'calculated_at']
    search_fields = ['user__email', 'user__full_name', 'karmic_theme']
    ordering = ['start_year']
    
    fieldsets = (
        ('User & Profile', {'fields': ('user', 'spiritual_profile')}),
        ('Timeline', {'fields': ('start_year', 'end_year', 'cycle_number', 'is_current')}),
        ('Details', {'fields': ('karmic_theme', 'lessons', 'timeline_data')}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


@admin.register(RebirthCycle)
class RebirthCycleAdmin(admin.ModelAdmin):
    """Admin interface for RebirthCycle model."""
    
    list_display = ['user', 'spiritual_profile', 'rebirth_number', 'start_year', 'end_year', 'is_current', 'calculated_at']
    list_filter = ['is_current', 'rebirth_number', 'calculated_at']
    search_fields = ['user__email', 'user__full_name', 'transformation_theme']
    ordering = ['start_year']
    
    fieldsets = (
        ('User & Profile', {'fields': ('user', 'spiritual_profile')}),
        ('Cycle Details', {'fields': ('rebirth_number', 'start_year', 'end_year', 'duration_years', 'is_current')}),
        ('Details', {'fields': ('transformation_theme', 'spiritual_growth', 'transition_warnings', 'preparation_guidance')}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


@admin.register(SoulContract)
class SoulContractAdmin(admin.ModelAdmin):
    """Admin interface for SoulContract model."""
    
    list_display = ['user', 'spiritual_profile', 'contract_number', 'contract_type', 'fulfillment_status', 'created_at']
    list_filter = ['contract_type', 'contract_number', 'fulfillment_status', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'description']
    ordering = ['contract_number']
    
    fieldsets = (
        ('User & Profile', {'fields': ('user', 'spiritual_profile')}),
        ('Contract Details', {'fields': ('contract_number', 'contract_type', 'description', 'lessons')}),
        ('Fulfillment', {'fields': ('fulfillment_status',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


# ============================================================================
# Predictive Models
# ============================================================================

@admin.register(PredictiveCycle)
class PredictiveCycleAdmin(admin.ModelAdmin):
    """Admin interface for PredictiveCycle model."""
    
    list_display = ['user', 'cycle_type', 'year', 'confidence_score', 'severity_level', 'calculated_at']
    list_filter = ['cycle_type', 'severity_level', 'calculated_at']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['year']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Cycle', {'fields': ('cycle_type', 'year', 'cycle_data')}),
        ('Prediction', {'fields': ('confidence_score', 'severity_level')}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


@admin.register(LifeMilestone)
class LifeMilestoneAdmin(admin.ModelAdmin):
    """Admin interface for LifeMilestone model."""
    
    list_display = ['user', 'year', 'age', 'milestone_type', 'calculated_at']
    list_filter = ['milestone_type', 'year', 'calculated_at']
    search_fields = ['user__email', 'user__full_name', 'milestone_type', 'significance']
    ordering = ['year']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Milestone', {'fields': ('year', 'age', 'milestone_type', 'significance')}),
        ('Numerology', {'fields': ('life_path_number', 'destiny_number')}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


@admin.register(EmotionalCycle)
class EmotionalCycleAdmin(admin.ModelAdmin):
    """Admin interface for EmotionalCycle model."""
    
    list_display = ['user', 'cycle_type', 'start_date', 'end_date', 'predicted_mood', 'energy_level', 'calculated_at']
    list_filter = ['cycle_type', 'energy_level', 'calculated_at']
    search_fields = ['user__email', 'user__full_name', 'predicted_mood']
    ordering = ['start_date']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Cycle', {'fields': ('cycle_type', 'start_date', 'end_date')}),
        ('Emotional Patterns', {'fields': ('predicted_mood', 'mood_score_range', 'energy_level')}),
        ('Recommendations', {'fields': ('recommendations',)}),
        ('Numerology', {'fields': ('personal_year', 'personal_month', 'personal_day')}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


# ============================================================================
# Compatibility Models
# ============================================================================

@admin.register(CompatibilityCheck)
class CompatibilityCheckAdmin(admin.ModelAdmin):
    """Admin interface for CompatibilityCheck model."""
    
    list_display = ['user', 'partner_name', 'relationship_type', 'compatibility_score', 'created_at']
    list_filter = ['relationship_type', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'partner_name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Partner Information', {'fields': ('partner_name', 'partner_birth_date', 'relationship_type')}),
        ('Compatibility Results', {'fields': ('compatibility_score', 'strengths', 'challenges', 'advice')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']


# ============================================================================
# Feng Shui Models
# ============================================================================

@admin.register(FengShuiAnalysis)
class FengShuiAnalysisAdmin(admin.ModelAdmin):
    """Admin interface for FengShuiAnalysis model."""
    
    list_display = ['user', 'house_number', 'numerology_vibration', 'hybrid_score', 'calculated_at']
    list_filter = ['numerology_vibration', 'hybrid_score', 'calculated_at']
    search_fields = ['user__email', 'user__full_name', 'property_address', 'house_number']
    ordering = ['-calculated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Property', {'fields': ('property_address', 'house_number')}),
        ('Analysis', {'fields': ('feng_shui_data', 'numerology_vibration', 'hybrid_score')}),
        ('Recommendations', {'fields': ('recommendations',)}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


@admin.register(SpaceOptimization)
class SpaceOptimizationAdmin(admin.ModelAdmin):
    """Admin interface for SpaceOptimization model."""
    
    list_display = ['analysis', 'room_name', 'room_number', 'direction', 'energy_flow_score', 'created_at']
    list_filter = ['direction', 'energy_flow_score', 'created_at']
    search_fields = ['analysis__user__email', 'analysis__user__full_name', 'room_name', 'room_number']
    ordering = ['room_name']
    
    fieldsets = (
        ('Analysis', {'fields': ('analysis',)}),
        ('Room Information', {'fields': ('room_name', 'room_number', 'direction')}),
        ('Recommendations', {'fields': ('color_recommendations', 'number_combinations', 'energy_flow_score')}),
        ('Layout', {'fields': ('layout_suggestions',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RoomNumerology)
class RoomNumerologyAdmin(admin.ModelAdmin):
    """Admin interface for RoomNumerology model."""
    
    list_display = ['analysis', 'room_name', 'room_number', 'direction', 'room_vibration', 'created_at']
    list_filter = ['direction', 'created_at']
    search_fields = ['analysis__user__email', 'analysis__user__full_name', 'room_name', 'room_number']
    ordering = ['room_name']
    
    fieldsets = (
        ('Analysis', {'fields': ('analysis',)}),
        ('Room Details', {'fields': ('room_name', 'room_number', 'direction')}),
        ('Numerology Analysis', {'fields': ('room_vibration', 'direction_compatibility')}),
        ('Recommendations', {'fields': ('color_recommendations', 'number_recommendations', 'layout_recommendations')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


# ============================================================================
# Mental State Models
# ============================================================================

@admin.register(MentalStateTracking)
class MentalStateTrackingAdmin(admin.ModelAdmin):
    """Admin interface for MentalStateTracking model."""
    
    list_display = ['user', 'date', 'emotional_state', 'stress_level', 'mood_score', 'created_at']
    list_filter = ['emotional_state', 'date', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'numerology_cycle', 'notes']
    ordering = ['-date']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Tracking', {'fields': ('date', 'emotional_state', 'stress_level', 'mood_score')}),
        ('Context', {'fields': ('numerology_cycle', 'notes')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(MentalStateAnalysis)
class MentalStateAnalysisAdmin(admin.ModelAdmin):
    """Admin interface for MentalStateAnalysis model."""
    
    list_display = ['user', 'period_start', 'period_end', 'calculated_at']
    list_filter = ['calculated_at', 'period_start', 'period_end']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-calculated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Period', {'fields': ('period_start', 'period_end')}),
        ('Analysis Results', {'fields': ('stress_patterns', 'wellbeing_recommendations', 'mood_predictions')}),
        ('Insights', {'fields': ('emotional_compatibility', 'numerology_correlations')}),
        ('Metadata', {'fields': ('calculated_at', 'updated_at')}),
    )
    
    readonly_fields = ['calculated_at', 'updated_at']


# ============================================================================
# Name Correction Models
# ============================================================================

@admin.register(NameCorrection)
class NameCorrectionAdmin(admin.ModelAdmin):
    """Admin interface for NameCorrection model."""
    
    list_display = ['user', 'original_name', 'name_type', 'current_expression', 'target_expression', 'created_at']
    list_filter = ['name_type', 'cultural_context', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'original_name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Name Information', {'fields': ('original_name', 'name_type', 'cultural_context')}),
        ('Analysis', {'fields': ('current_expression', 'target_expression')}),
        ('Results', {'fields': ('suggestions', 'phonetic_analysis', 'cultural_analysis', 'recommendations')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']
