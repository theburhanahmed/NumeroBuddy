"""
URLs for decisions app.
"""
from django.urls import path
from . import views

app_name = 'decisions'

urlpatterns = [
    path('analyze/', views.analyze_decision, name='analyze-decision'),
    path('history/', views.decision_history, name='decision-history'),
    path('<uuid:decision_id>/outcome/', views.record_outcome, name='record-outcome'),
    path('recommendations/', views.get_recommendations, name='get-recommendations'),
    path('success-rate/', views.success_rate, name='success-rate'),
]

