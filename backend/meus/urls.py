"""
URL configuration for MEUS API.
"""
from django.urls import path
from . import views

app_name = 'meus'

urlpatterns = [
    # Entity management
    path('entity/', views.EntityProfileListCreateView.as_view(), name='entity-list-create'),
    path('entity/<uuid:id>/', views.EntityProfileDetailView.as_view(), name='entity-detail'),
    path('entity/<uuid:id>/profile/', views.EntityProfileDetailView.as_view(), name='entity-profile'),
    
    # Universe dashboard
    path('universe/dashboard/', views.UniverseDashboardView.as_view(), name='universe-dashboard'),
    path('universe/influence-map/', views.InfluenceMapView.as_view(), name='influence-map'),
    path('universe/cycles/', views.CycleSynchronizationView.as_view(), name='cycle-synchronization'),
    
    # Analysis
    path('analysis/cross-entity/', views.CrossEntityAnalysisView.as_view(), name='cross-entity-analysis'),
    
    # Recommendations
    path('recommendations/next-actions/', views.NextActionsView.as_view(), name='next-actions'),
    
    # Events
    path('universe/events/', views.UniverseEventListCreateView.as_view(), name='event-list-create'),
    path('universe/events/<uuid:pk>/', views.UniverseEventDetailView.as_view(), name='event-detail'),

    # Assets
    path('universe/assets/', views.AssetProfileListCreateView.as_view(), name='asset-list-create'),
    path('universe/assets/<uuid:pk>/', views.AssetProfileDetailView.as_view(), name='asset-detail'),

    # Relationships and reports
    path('universe/relationships/', views.EntityRelationshipListCreateView.as_view(), name='relationship-list-create'),
    path('universe/relationships/<uuid:pk>/', views.EntityRelationshipDetailView.as_view(), name='relationship-detail'),
    path('universe/report/', views.UniverseReportView.as_view(), name='universe-report'),
]

