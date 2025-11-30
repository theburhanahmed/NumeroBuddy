"""
URLs for knowledge_graph app.
"""
from django.urls import path
from . import views

app_name = 'knowledge_graph'

urlpatterns = [
    path('patterns/', views.discover_patterns, name='discover-patterns'),
    path('connections/', views.find_connections, name='find-connections'),
    path('insights/', views.generate_insights, name='generate-insights'),
    path('query/', views.query_graph, name='query-graph'),
]

