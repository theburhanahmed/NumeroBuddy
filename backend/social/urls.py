"""URLs for social app."""
from django.urls import path
from . import views

app_name = 'social'

urlpatterns = [
    path('connections/', views.connections, name='connections'),
    path('groups/', views.social_groups, name='social-groups'),
]

