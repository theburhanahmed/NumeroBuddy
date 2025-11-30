"""URLs for developer_api app."""
from django.urls import path
from . import views

app_name = 'developer_api'

urlpatterns = [
    path('register/', views.register_api_key, name='register-api-key'),
    path('keys/', views.list_api_keys, name='list-api-keys'),
    path('keys/<uuid:key_id>/usage/', views.api_usage_stats, name='api-usage-stats'),
]

