"""
URL routing for numerology application.
"""
from django.urls import path
from . import views

app_name = 'numerology'

urlpatterns = [
    # Health check
    path('health/', views.health_check, name='health-check'),
    
    # Numerology endpoints
    path('numerology/calculate/', views.calculate_numerology_profile, name='calculate-numerology'),
    path('numerology/profile/', views.get_numerology_profile, name='numerology-profile'),
    path('numerology/birth-chart/', views.get_birth_chart, name='birth-chart'),
    path('numerology/birth-chart/pdf/', views.export_birth_chart_pdf, name='birth-chart-pdf'),
    path('numerology/daily-reading/', views.get_daily_reading, name='daily-reading'),
    path('numerology/reading-history/', views.get_reading_history, name='reading-history'),
    
    # New numerology endpoints
    path('numerology/life-path-analysis/', views.get_life_path_analysis, name='life-path-analysis'),
    path('numerology/compatibility-check/', views.check_compatibility, name='compatibility-check'),
    path('numerology/compatibility-history/', views.get_compatibility_history, name='compatibility-history'),
    path('numerology/remedies/', views.get_personalized_remedies, name='personalized-remedies'),
    path('numerology/remedies/<uuid:remedy_id>/track/', views.track_remedy, name='track-remedy'),
    path('numerology/full-report/', views.get_full_numerology_report, name='full-numerology-report'),
    path('numerology/full-report/pdf/', views.export_full_numerology_report_pdf, name='full-numerology-report-pdf'),
    
    # Multi-person numerology endpoints
    path('people/', views.people_list_create, name='people-list-create'),
    path('people/<uuid:person_id>/', views.person_detail, name='person-detail'),
    path('people/<uuid:person_id>/calculate/', views.calculate_person_numerology, name='calculate-person-numerology'),
    path('people/<uuid:person_id>/profile/', views.get_person_numerology_profile, name='person-numerology-profile'),
    
    # Lo Shu Grid
    path('numerology/lo-shu-grid/', views.get_lo_shu_grid, name='lo-shu-grid'),
    
    # Raj Yog Detection
    path('numerology/raj-yog/', views.get_raj_yog_detection, name='raj-yog-detection'),
    path('numerology/raj-yog/<uuid:person_id>/', views.get_raj_yog_detection, name='person-raj-yog-detection'),
    path('numerology/raj-yog/explanation/', views.generate_raj_yog_explanation, name='raj-yog-explanation'),
    path('numerology/raj-yog/explanation/<uuid:person_id>/', views.generate_raj_yog_explanation, name='person-raj-yog-explanation'),
    
    # Explanations
    path('numerology/explanations/<uuid:explanation_id>/', views.get_explanation, name='get-explanation'),
    
    # Name Numerology endpoints
    path('name-numerology/generate/', views.generate_name_numerology, name='generate-name-numerology'),
    path('name-numerology/preview/', views.preview_name_numerology, name='preview-name-numerology'),
    path('name-numerology/<uuid:user_id>/<uuid:report_id>/', views.get_name_report, name='get-name-report'),
    path('name-numerology/<uuid:user_id>/latest/', views.get_latest_name_report, name='get-latest-name-report'),
    
    # Weekly Reports
    path('numerology/weekly-report/', views.get_weekly_report, name='weekly-report'),
    path('numerology/weekly-report/<str:week_start_date_str>/', views.get_weekly_report, name='weekly-report-date'),
    path('numerology/weekly-report/<uuid:person_id>/', views.get_weekly_report, name='person-weekly-report'),
    path('numerology/weekly-report/<uuid:person_id>/<str:week_start_date_str>/', views.get_weekly_report, name='person-weekly-report-date'),
    
    # Yearly Reports
    path('numerology/yearly-report/', views.get_yearly_report, name='yearly-report'),
    path('numerology/yearly-report/<int:year>/', views.get_yearly_report, name='yearly-report-year'),
    path('numerology/yearly-report/<uuid:person_id>/', views.get_yearly_report, name='person-yearly-report'),
    path('numerology/yearly-report/<uuid:person_id>/<int:year>/', views.get_yearly_report, name='person-yearly-report-year'),
    
    # Phone Numerology endpoints
    path('phone-numerology/generate/', views.generate_phone_numerology, name='generate-phone-numerology'),
    path('phone-numerology/preview/', views.preview_phone_numerology, name='preview-phone-numerology'),
    path('phone-numerology/<uuid:user_id>/<uuid:report_id>/', views.get_phone_report, name='get-phone-report'),
    path('phone-numerology/<uuid:user_id>/latest/', views.get_latest_phone_report, name='get-latest-phone-report'),
    path('phone-numerology/compatibility/', views.check_phone_compatibility, name='check-phone-compatibility'),
]