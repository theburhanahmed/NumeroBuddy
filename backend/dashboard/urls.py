"""
URLs for dashboard app.
"""
from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('overview/', views.dashboard_overview, name='dashboard-overview'),
    path('widgets/', views.dashboard_widgets, name='dashboard-widgets'),
    path('widgets/<uuid:widget_id>/', views.dashboard_widget_detail, name='dashboard-widget-detail'),
    path('widgets/reorder/', views.dashboard_widgets_reorder, name='dashboard-widgets-reorder'),
    path('insights/', views.dashboard_insights, name='dashboard-insights'),
    path('insights/<uuid:insight_id>/mark-read/', views.dashboard_insight_mark_read, name='dashboard-insight-mark-read'),
]

