"""
URL routing for ai_chat application.
"""
from django.urls import path
from . import views

app_name = 'ai_chat'

urlpatterns = [
    # AI Chat endpoints
    path('ai/chat/', views.ai_chat, name='ai-chat'),
    path('ai/conversations/', views.get_conversations, name='ai-conversations'),
    path('ai/conversations/<uuid:conversation_id>/messages/', views.get_conversation_messages, name='ai-conversation-messages'),
    # AI Co-Pilot endpoints
    path('ai-co-pilot/suggest/', views.co_pilot_suggest, name='co-pilot-suggest'),
    path('ai-co-pilot/analyze-decision/', views.co_pilot_analyze_decision, name='co-pilot-analyze-decision'),
    path('ai-co-pilot/insights/', views.co_pilot_insights, name='co-pilot-insights'),
]