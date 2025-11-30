"""URLs for matchmaking app."""
from django.urls import path
from . import views

app_name = 'matchmaking'

urlpatterns = [
    path('discover/', views.discover_matches, name='discover-matches'),
]

