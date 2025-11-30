"""
URLs for smart_calendar app.
"""
from django.urls import path
from . import views

app_name = 'smart_calendar'

urlpatterns = [
    path('events/', views.calendar_events, name='calendar-events'),
    path('auspicious-dates/', views.auspicious_dates, name='auspicious-dates'),
    path('reminders/', views.create_reminder, name='create-reminder'),
    path('reminders/<uuid:reminder_id>/', views.reminder_detail, name='reminder-detail'),
    path('cycles/', views.personal_cycles, name='personal-cycles'),
    path('date-insight/', views.date_insight, name='date-insight'),
]

