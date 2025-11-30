"""URLs for rewards app."""
from django.urls import path
from . import views

app_name = 'rewards'

urlpatterns = [
    path('points/', views.user_points, name='user-points'),
    path('achievements/', views.user_achievements, name='user-achievements'),
    path('catalog/', views.reward_catalog, name='reward-catalog'),
]

