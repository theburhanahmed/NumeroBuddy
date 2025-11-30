"""
Analytics services for processing user behavior and generating insights.
"""
from typing import List, Dict
from datetime import date, timedelta
from django.utils import timezone
from django.db.models import Count, Avg, Q
from .models import UserBehavior, AnalyticsInsight, GrowthMetric
from dashboard.models import UserActivity


class AnalyticsService:
    """Service for analytics operations."""
    
    def track_behavior(self, user, action_type: str, action_details: Dict = None, **kwargs):
        """Track user behavior."""
        if action_details is None:
            action_details = {}
        
        UserBehavior.objects.create(
            user=user,
            action_type=action_type,
            action_details=action_details,
            session_id=kwargs.get('session_id', ''),
            ip_address=kwargs.get('ip_address'),
            user_agent=kwargs.get('user_agent', '')
        )
        
        # Also track in UserActivity for dashboard
        activity_type_map = {
            'feature_used': 'ai_chat_used',
            'calculation_performed': 'birth_chart_viewed',
            'report_generated': 'report_generated',
        }
        
        activity_type = activity_type_map.get(action_type)
        if activity_type:
            UserActivity.objects.create(
                user=user,
                activity_type=activity_type,
                metadata=action_details
            )
    
    def get_personal_analytics(self, user, days: int = 30) -> Dict:
        """Get personal analytics for user."""
        start_date = timezone.now() - timedelta(days=days)
        
        # Feature usage
        behaviors = UserBehavior.objects.filter(
            user=user,
            created_at__gte=start_date
        )
        
        feature_usage = behaviors.values('action_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Engagement score (based on daily activity)
        daily_activity = {}
        for i in range(days):
            day = start_date + timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0)
            day_end = day.replace(hour=23, minute=59, second=59)
            
            day_behaviors = behaviors.filter(
                created_at__gte=day_start,
                created_at__lte=day_end
            ).count()
            
            daily_activity[day.date().isoformat()] = day_behaviors
        
        engagement_score = sum(daily_activity.values()) / days if days > 0 else 0
        
        # Most used features
        top_features = list(feature_usage[:5])
        
        return {
            'period_days': days,
            'total_actions': behaviors.count(),
            'engagement_score': round(engagement_score, 2),
            'feature_usage': top_features,
            'daily_activity': daily_activity,
            'average_daily_actions': round(engagement_score, 2)
        }
    
    def generate_insights(self, user) -> List[Dict]:
        """Generate behavioral insights."""
        insights = []
        
        # Insight 1: Engagement level
        analytics = self.get_personal_analytics(user, 7)
        if analytics['engagement_score'] > 5:
            insights.append({
                'type': 'engagement',
                'title': 'High Engagement',
                'content': f"You've been very active this week with {analytics['total_actions']} actions. Keep exploring!",
                'insight_data': analytics,
                'confidence_score': 0.9
            })
        elif analytics['engagement_score'] < 2:
            insights.append({
                'type': 'engagement',
                'title': 'Explore More Features',
                'content': "You haven't been active recently. Discover new numerology insights waiting for you.",
                'insight_data': analytics,
                'confidence_score': 0.8
            })
        
        # Insight 2: Feature usage patterns
        top_feature = analytics['feature_usage'][0] if analytics['feature_usage'] else None
        if top_feature:
            insights.append({
                'type': 'usage_pattern',
                'title': 'Most Used Feature',
                'content': f"Your most used feature is {top_feature['action_type']}. Explore related features for deeper insights.",
                'insight_data': {'top_feature': top_feature},
                'confidence_score': 0.85
            })
        
        # Save insights
        for insight_data in insights:
            AnalyticsInsight.objects.update_or_create(
                user=user,
                title=insight_data['title'],
                defaults={
                    'insight_type': insight_data['type'],
                    'content': insight_data['content'],
                    'insight_data': insight_data.get('insight_data', {}),
                    'confidence_score': insight_data['confidence_score'],
                    'is_read': False
                }
            )
        
        return insights
    
    def get_growth_metrics(self, user, period_days: int = 30) -> Dict:
        """Get personal growth metrics."""
        end_date = date.today()
        start_date = end_date - timedelta(days=period_days)
        
        # Feature adoption
        behaviors = UserBehavior.objects.filter(
            user=user,
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        )
        
        unique_features = behaviors.values('action_type').distinct().count()
        total_features_available = 10  # Approximate number of features
        feature_adoption = (unique_features / total_features_available) * 100
        
        # Consistency (days active)
        active_days = behaviors.values('created_at__date').distinct().count()
        consistency = (active_days / period_days) * 100 if period_days > 0 else 0
        
        # Save metrics
        GrowthMetric.objects.create(
            user=user,
            metric_type='feature_adoption',
            metric_value=feature_adoption,
            period_start=start_date,
            period_end=end_date
        )
        
        GrowthMetric.objects.create(
            user=user,
            metric_type='consistency',
            metric_value=consistency,
            period_start=start_date,
            period_end=end_date
        )
        
        return {
            'feature_adoption': round(feature_adoption, 2),
            'consistency': round(consistency, 2),
            'active_days': active_days,
            'total_days': period_days,
            'unique_features_used': unique_features
        }

