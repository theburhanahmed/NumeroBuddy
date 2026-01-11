"""
Management command to seed all database tables with test data.
Also ensures all migrations are run first.
"""
import random
from datetime import datetime, timedelta, date
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import transaction

# Import all models
from accounts.models import (
    UserProfile, OTPCode, RefreshToken, DeviceToken,
    PasswordResetToken, Notification, EmailTemplate, AuditLog
)
from accounts.models_notification_prefs import NotificationPreference
from accounts.models_privacy import PrivacySettings
from accounts.models_api_key import APIKey
from payments.models import Subscription, Payment, BillingHistory, WebhookEvent
from feature_flags.models import FeatureFlag, SubscriptionFeatureAccess
from numerology.models import (
    NumerologyProfile, DailyReading, CompatibilityCheck, Remedy,
    RemedyTracking, Person, PersonNumerologyProfile
)
from consultations.models import Expert, Consultation, ExpertAvailability
from reports.models import ReportTemplate, GeneratedReport
from rewards.models import Reward, Achievement, PointsTransaction
from smart_calendar.models import NumerologyEvent, PersonalCycle, AuspiciousDate
from dashboard.models import DashboardWidget, UserActivity, QuickInsight
from ai_chat.models import AIConversation, AIMessage
from social.models import Connection, SocialGroup
from matchmaking.models import Match, MatchPreference
from knowledge_graph.models import NumberRelationship, NumerologyPattern
from analytics.models import UserActivityLog, EventTracking
from decisions.models import Decision, DecisionOutcome


User = get_user_model()


class Command(BaseCommand):
    help = 'Seed all database tables with test data. Runs migrations first.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-migrations',
            action='store_true',
            help='Skip running migrations (use if already migrated)',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding (WARNING: deletes all data)',
        )

    def handle(self, *args, **options):
        skip_migrations = options['skip_migrations']
        clear_data = options['clear']

        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('NumerAI Database Seeding'))
        self.stdout.write(self.style.SUCCESS('=' * 60))

        # Step 1: Run migrations
        if not skip_migrations:
            self.stdout.write(self.style.WARNING('\n[Step 1/6] Running migrations...'))
            try:
                call_command('migrate', verbosity=0, interactive=False)
                self.stdout.write(self.style.SUCCESS('✓ Migrations completed'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'✗ Migration error: {e}'))
                return
        else:
            self.stdout.write(self.style.WARNING('\n[Step 1/6] Skipping migrations'))

        # Step 2: Initialize feature flags (real data)
        self.stdout.write(self.style.WARNING('\n[Step 2/6] Seeding feature flags...'))
        try:
            call_command('initialize_feature_flags', verbosity=0)
            self.stdout.write(self.style.SUCCESS('✓ Feature flags initialized'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Feature flags error: {e}'))

        # Step 3: Clear data if requested
        if clear_data:
            self.stdout.write(self.style.WARNING('\n[Step 3/6] Clearing existing data...'))
            self._clear_all_data()
            self.stdout.write(self.style.SUCCESS('✓ Data cleared'))

        # Step 4-6: Seed data
        with transaction.atomic():
            self.stdout.write(self.style.WARNING('\n[Step 4/6] Seeding core data (Users, Profiles, Pricing)...'))
            users = self._seed_users_and_profiles()
            self._seed_pricing_data(users)
            self.stdout.write(self.style.SUCCESS('✓ Core data seeded'))

            self.stdout.write(self.style.WARNING('\n[Step 5/6] Seeding feature data (Numerology, Reports, etc.)...'))
            self._seed_numerology_data(users)
            self._seed_consultations_data(users)
            self._seed_reports_data(users)
            self.stdout.write(self.style.SUCCESS('✓ Feature data seeded'))

            self.stdout.write(self.style.WARNING('\n[Step 6/6] Seeding additional data (Rewards, Calendar, etc.)...'))
            self._seed_rewards_data(users)
            self._seed_calendar_data(users)
            self._seed_dashboard_data(users)
            self._seed_ai_chat_data(users)
            self._seed_social_data(users)
            self._seed_analytics_data(users)
            self._seed_knowledge_graph_data()
            self.stdout.write(self.style.SUCCESS('✓ Additional data seeded'))

        self.stdout.write(self.style.SUCCESS('\n' + '=' * 60))
        self.stdout.write(self.style.SUCCESS('✓ Seeding completed successfully!'))
        self.stdout.write(self.style.SUCCESS('=' * 60))

    def _clear_all_data(self):
        """Clear all data from tables (in reverse dependency order)."""
        # Clear in reverse dependency order
        AIMessage.objects.all().delete()
        AIConversation.objects.all().delete()
        GeneratedReport.objects.all().delete()
        Consultation.objects.all().delete()
        RemedyTracking.objects.all().delete()
        Remedy.objects.all().delete()
        DailyReading.objects.all().delete()
        NumerologyProfile.objects.all().delete()
        PersonNumerologyProfile.objects.all().delete()
        Person.objects.all().delete()
        Subscription.objects.all().delete()
        Payment.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

    def _seed_users_and_profiles(self):
        """Seed users and profiles."""
        users = []
        
        # Create test users for each subscription tier
        test_users = [
            {
                'email': 'free@test.com',
                'full_name': 'Free Test User',
                'subscription_plan': 'free',
                'is_verified': True,
                'date_of_birth': date(1990, 5, 15),
            },
            {
                'email': 'basic@test.com',
                'full_name': 'Basic Test User',
                'subscription_plan': 'basic',
                'is_verified': True,
                'date_of_birth': date(1985, 8, 20),
            },
            {
                'email': 'premium@test.com',
                'full_name': 'Premium Test User',
                'subscription_plan': 'premium',
                'is_verified': True,
                'is_premium': True,
                'date_of_birth': date(1992, 3, 10),
            },
            {
                'email': 'elite@test.com',
                'full_name': 'Elite Test User',
                'subscription_plan': 'elite',
                'is_verified': True,
                'is_premium': True,
                'date_of_birth': date(1988, 11, 25),
            },
        ]

        for user_data in test_users:
            email = user_data.pop('email')
            date_of_birth = user_data.pop('date_of_birth', None)
            
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'full_name': user_data.pop('full_name'),
                    'subscription_plan': user_data.pop('subscription_plan', 'free'),
                    'is_verified': user_data.pop('is_verified', False),
                    'is_premium': user_data.pop('is_premium', False),
                    **user_data,
                }
            )
            user.set_password('testpass123')
            user.save()

            # Create profile
            if date_of_birth:
                UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'date_of_birth': date_of_birth,
                        'gender': random.choice(['male', 'female', 'other']),
                        'timezone': 'Asia/Kolkata',
                        'location': random.choice(['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', None]),
                    }
                )

            users.append(user)

        # Create additional random users
        for i in range(10):
            user = User.objects.create_user(
                email=f'user{i}@test.com',
                full_name=f'Test User {i}',
                password='testpass123',
                subscription_plan=random.choice(['free', 'basic', 'premium', 'elite']),
                is_verified=random.choice([True, False]),
            )
            
            if random.choice([True, False]):
                UserProfile.objects.create(
                    user=user,
                    date_of_birth=date(1990 + i, random.randint(1, 12), random.randint(1, 28)),
                    gender=random.choice(['male', 'female', 'other']),
                    timezone='Asia/Kolkata',
                )
            users.append(user)

        return users

    def _seed_pricing_data(self, users):
        """Seed pricing and subscription data with REAL pricing."""
        # Real pricing from payments/services.py
        PRICING = {
            'basic': Decimal('9.99'),  # $9.99/month
            'premium': Decimal('19.99'),  # $19.99/month
            'elite': Decimal('29.99'),  # $29.99/month
        }

        # Create subscriptions for premium users
        for user in users:
            if user.subscription_plan in ['basic', 'premium', 'elite']:
                subscription, _ = Subscription.objects.get_or_create(
                    user=user,
                    defaults={
                        'plan': user.subscription_plan,
                        'status': 'active',
                        'current_period_start': timezone.now() - timedelta(days=15),
                        'current_period_end': timezone.now() + timedelta(days=15),
                    }
                )

                # Create payment history
                if user.subscription_plan in PRICING:
                    Payment.objects.create(
                        user=user,
                        subscription=subscription,
                        amount=PRICING[user.subscription_plan],
                        currency='usd',
                        status='succeeded',
                        description=f'{user.subscription_plan.capitalize()} subscription payment',
                    )

    def _seed_numerology_data(self, users):
        """Seed numerology profiles and related data."""
        for user in users[:5]:  # Seed for first 5 users
            # Create numerology profile
            profile, _ = NumerologyProfile.objects.get_or_create(
                user=user,
                defaults={
                    'life_path_number': random.randint(1, 9),
                    'destiny_number': random.randint(1, 9),
                    'soul_urge_number': random.randint(1, 9),
                    'personality_number': random.randint(1, 9),
                    'attitude_number': random.randint(1, 9),
                    'maturity_number': random.randint(1, 9),
                    'balance_number': random.randint(1, 9),
                    'personal_year_number': random.randint(1, 9),
                    'personal_month_number': random.randint(1, 9),
                }
            )

            # Create daily readings
            for i in range(7):  # Last 7 days
                reading_date = date.today() - timedelta(days=i)
                DailyReading.objects.get_or_create(
                    user=user,
                    reading_date=reading_date,
                    defaults={
                        'personal_day_number': random.randint(1, 9),
                        'lucky_number': random.randint(1, 9),
                        'lucky_color': random.choice(['Red', 'Blue', 'Green', 'Yellow', 'Purple']),
                        'auspicious_time': f'{random.randint(6, 12)}:00 AM',
                        'activity_recommendation': 'Focus on creative activities today.',
                        'warning': 'Avoid making hasty decisions.',
                        'affirmation': 'I am aligned with my life path.',
                        'actionable_tip': 'Practice gratitude meditation.',
                    }
                )

            # Create remedies and tracking
            for i in range(3):
                remedy = Remedy.objects.create(
                    user=user,
                    remedy_type=random.choice(['mantra', 'gemstone', 'color', 'yoga', 'meditation']),
                    title=f'Remedy {i+1}',
                    description=f'Recommended remedy for {user.full_name}',
                    recommendation='Practice this daily for best results.',
                    priority=random.randint(1, 10),
                    difficulty=random.choice(['easy', 'medium', 'hard']),
                    frequency=random.choice(['daily', 'weekly', 'monthly']),
                )
                
                # Create remedy tracking
                for j in range(5):
                    RemedyTracking.objects.create(
                        user=user,
                        remedy=remedy,
                        date=date.today() - timedelta(days=j),
                        is_completed=random.choice([True, False]),
                        mood_before=random.choice(['neutral', 'good', 'very_good']),
                        mood_after=random.choice(['good', 'very_good']),
                        effectiveness_rating=random.randint(3, 5),
                        notes=f'Tracking entry {j+1}',
                    )
            
            # Create compatibility checks
            CompatibilityCheck.objects.create(
                user=user,
                partner_name='Test Partner',
                partner_birth_date=date(1990, 6, 20),
                relationship_type=random.choice(['romantic', 'business', 'friendship']),
                compatibility_score=random.randint(60, 100),
                strengths=['Communication', 'Trust'],
                challenges=['Different interests'],
                advice='Focus on open communication.',
            )

            # Create Person entries
            for i in range(2):
                person = Person.objects.create(
                    user=user,
                    name=f'Person {i+1}',
                    birth_date=date(1990 + i, random.randint(1, 12), random.randint(1, 28)),
                    relationship_type=random.choice(['family', 'friend', 'partner', 'colleague']),
                )

                PersonNumerologyProfile.objects.create(
                    person=person,
                    life_path_number=random.randint(1, 9),
                    destiny_number=random.randint(1, 9),
                )

    def _seed_consultations_data(self, users):
        """Seed consultation data."""
        # Create experts
        specialties = ['relationship', 'career', 'spiritual', 'health', 'general']
        experts = []
        for i, specialty in enumerate(specialties):
            expert = Expert.objects.create(
                name=f'Expert {specialty.title()}',
                email=f'expert_{specialty}@test.com',
                specialty=specialty,
                experience_years=random.randint(5, 20),
                rating=Decimal(str(round(random.uniform(4.0, 5.0), 2))),
                bio=f'Experienced {specialty} numerology expert with {random.randint(5, 20)} years of practice.',
                is_active=True,
                verification_status='approved',
            )
            experts.append(expert)

        # Create consultations
        for user in users[:3]:
            expert = random.choice(experts)
            Consultation.objects.create(
                user=user,
                expert=expert,
                consultation_type=random.choice(['video', 'chat', 'phone']),
                scheduled_at=timezone.now() + timedelta(days=random.randint(1, 30)),
                duration_minutes=30,
                status=random.choice(['pending', 'confirmed', 'completed']),
                price=Decimal(str(random.uniform(50.0, 200.0))),
                payment_status='paid',
            )

    def _seed_reports_data(self, users):
        """Seed report templates and generated reports."""
        # Create report templates (real data)
        templates_data = [
            {
                'name': 'Basic Birth Chart',
                'description': 'Basic numerology birth chart analysis',
                'report_type': 'basic',
                'is_premium': False,
            },
            {
                'name': 'Detailed Analysis',
                'description': 'Comprehensive numerology analysis',
                'report_type': 'detailed',
                'is_premium': True,
            },
            {
                'name': 'Compatibility Report',
                'description': 'Relationship compatibility analysis',
                'report_type': 'compatibility',
                'is_premium': True,
            },
        ]

        templates = []
        for template_data in templates_data:
            template, _ = ReportTemplate.objects.get_or_create(
                name=template_data['name'],
                defaults=template_data
            )
            templates.append(template)

        # Create generated reports
        for user in users[:3]:
            if Person.objects.filter(user=user).exists():
                person = Person.objects.filter(user=user).first()
                template = random.choice(templates)
                GeneratedReport.objects.create(
                    user=user,
                    person=person,
                    template=template,
                    title=f'{template.name} for {person.name}',
                    content={'sections': ['Introduction', 'Analysis', 'Conclusion']},
                )

    def _seed_rewards_data(self, users):
        """Seed rewards and achievements."""
        # Create rewards
        rewards_data = [
            {'name': 'Premium Feature Access', 'reward_type': 'premium_feature', 'points_cost': 1000},
            {'name': '10% Discount', 'reward_type': 'discount', 'points_cost': 500},
            {'name': 'Premium Badge', 'reward_type': 'badge', 'points_cost': 2000},
        ]

        rewards = []
        for reward_data in rewards_data:
            reward, _ = Reward.objects.get_or_create(
                name=reward_data['name'],
                defaults=reward_data
            )
            rewards.append(reward)

        # Create achievements
        achievements_data = [
            {'name': 'First Reading', 'points_awarded': 10},
            {'name': 'Weekly User', 'points_awarded': 50},
            {'name': 'Premium Member', 'points_awarded': 100},
        ]

        achievements = []
        for ach_data in achievements_data:
            achievement, _ = Achievement.objects.get_or_create(
                name=ach_data['name'],
                defaults=ach_data
            )
            achievements.append(achievement)

        # Create points transactions
        for user in users[:5]:
            PointsTransaction.objects.create(
                user=user,
                transaction_type='earned',
                points=random.randint(10, 100),
                description='Initial signup bonus',
            )

    def _seed_calendar_data(self, users):
        """Seed calendar events and cycles."""
        for user in users[:3]:
            # Create numerology events
            for i in range(5):
                NumerologyEvent.objects.create(
                    user=user,
                    event_type=random.choice([
                        'personal_year_start', 'personal_month_start',
                        'auspicious_day', 'remedy_day'
                    ]),
                    event_date=date.today() + timedelta(days=i*7),
                    title=f'Important Event {i+1}',
                    description=f'Description for event {i+1}',
                    numerology_number=random.randint(1, 9),
                    importance=random.randint(5, 10),
                )

            # Create personal cycles
            PersonalCycle.objects.create(
                user=user,
                cycle_type='personal_year',
                cycle_number=random.randint(1, 9),
                start_date=date.today().replace(month=1, day=1),
                end_date=date.today().replace(month=12, day=31),
                description='Current personal year cycle',
            )

    def _seed_dashboard_data(self, users):
        """Seed dashboard widgets and activities."""
        widget_types = [
            'daily_reading', 'birth_chart', 'calendar',
            'co_pilot', 'insights', 'remedies'
        ]

        for user in users[:5]:
            # Create widgets
            for i, widget_type in enumerate(widget_types[:4]):
                DashboardWidget.objects.get_or_create(
                    user=user,
                    widget_type=widget_type,
                    defaults={'position': i, 'is_visible': True}
                )

            # Create activities
            for i in range(10):
                UserActivity.objects.create(
                    user=user,
                    activity_type=random.choice([
                        'birth_chart_viewed', 'daily_reading_viewed',
                        'compatibility_checked', 'ai_chat_used'
                    ]),
                    metadata={},
                )

            # Create quick insights
            QuickInsight.objects.create(
                user=user,
                insight_type='daily_tip',
                title='Daily Numerology Tip',
                content='Today is a great day to focus on your life path goals.',
                priority=5,
            )

    def _seed_ai_chat_data(self, users):
        """Seed AI chat conversations."""
        for user in users[:3]:
            conversation = AIConversation.objects.create(
                user=user,
                is_active=True,
            )

            # Create messages
            AIMessage.objects.create(
                conversation=conversation,
                role='user',
                content='What does my life path number mean?',
            )
            AIMessage.objects.create(
                conversation=conversation,
                role='assistant',
                content='Your life path number reveals your core personality and life purpose...',
            )

    def _seed_social_data(self, users):
        """Seed social connections."""
        if len(users) >= 2:
            # Create connections between users
            for i in range(min(5, len(users) - 1)):
                Connection.objects.get_or_create(
                    user1=users[i],
                    user2=users[i+1],
                    defaults={'connection_type': 'friend', 'is_mutual': True}
                )

    def _seed_analytics_data(self, users):
        """Seed analytics data."""
        for user in users[:5]:
            UserActivityLog.objects.create(
                user=user,
                activity_type='page_view',
                activity_data={'page': 'dashboard'},
                page_path='/dashboard',
                feature_name='dashboard',
            )

            EventTracking.objects.create(
                user=user,
                event_name='user_signup',
                event_category='conversion',
                event_properties={'source': 'web'},
            )

    def _seed_knowledge_graph_data(self):
        """Seed knowledge graph data."""
        # Create number relationships
        for i in range(1, 10):
            for j in range(1, 10):
                if i != j:
                    NumberRelationship.objects.get_or_create(
                        number1=i,
                        number2=j,
                        defaults={
                            'relationship_type': random.choice(['compatible', 'challenging', 'neutral']),
                            'description': f'Relationship between {i} and {j}',
                        }
                    )

        # Create numerology patterns
        NumerologyPattern.objects.create(
            name='Master Number Pattern',
            pattern_type='master_number',
            description='Pattern involving master numbers 11, 22, 33',
            pattern_data={'numbers': [11, 22, 33]},
        )
