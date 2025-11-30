"""
URLs for analytics app.
"""
from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('personal/', views.personal_analytics, name='personal-analytics'),
    path('insights/', views.behavioral_insights, name='behavioral-insights'),
    path('growth/', views.growth_metrics, name='growth-metrics'),
    path('track/', views.track_behavior, name='track-behavior'),
]

