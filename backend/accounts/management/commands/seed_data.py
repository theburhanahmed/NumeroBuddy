"""
Management command to seed all database tables with test data.
Also ensures all migrations are run first.
"""
import random
import hashlib
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
    RemedyTracking, RemedyEffectiveness, RemedyCombination, RemedyReminder,
    Person, PersonNumerologyProfile, RajYogDetection, Explanation,
    WeeklyReport, YearlyReport, NameReport, PhoneReport, DetailedReading,
    HealthNumerologyProfile, NameCorrection, SpiritualNumerologyProfile,
    SoulContract, KarmicTimeline, RebirthCycle, PredictiveCycle,
    BreakthroughYear, CrisisYear, LifeMilestone, GenerationalAnalysis,
    FamilyUnitProfile, KarmicContract, FengShuiAnalysis, SpaceOptimization,
    RoomNumerology, MentalStateTracking, MentalStateAnalysis, EmotionalCycle
)
from consultations.models import (
    Expert, Consultation, ExpertAvailability, ConsultationReview,
    ExpertApplication, ExpertVerificationDocument, ExpertChatConversation, 
    ExpertChatMessage, ExpertUnavailability
)
from reports.models import ReportTemplate, GeneratedReport, ScheduledReport, ReportComparison
from rewards.models import Reward, Achievement, PointsTransaction, UserReward, UserAchievement
from smart_calendar.models import NumerologyEvent, PersonalCycle, AuspiciousDate, CalendarReminder
from dashboard.models import DashboardWidget, UserActivity, QuickInsight
from ai_chat.models import AIConversation, AIMessage
from social.models import Connection, SocialGroup, Interaction
from matchmaking.models import Match, MatchPreference
from knowledge_graph.models import NumberRelationship, NumerologyPattern, NumerologyRule
from analytics.models import UserActivityLog, EventTracking
from decisions.models import Decision, DecisionOutcome, DecisionPattern
from developer_api.models import APIKey as DeveloperAPIKey, APIUsage
from meus.models import (
    EntityProfile, EntityRelationship, EntityInfluence, UniverseEvent,
    AssetProfile, CrossProfileAnalysisCache
)


User = get_user_model()


class Command(BaseCommand):
    help = 'Seed all database tables with test data. Runs migrations first.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-migrations',
            action='store_true',
            help='Skip running migrations (use if already migrated or migration issues exist)',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding (WARNING: deletes all data)',
        )
        parser.add_argument(
            '--ignore-migration-errors',
            action='store_true',
            help='Continue seeding even if migrations fail (use with caution)',
        )

    def handle(self, *args, **options):
        skip_migrations = options['skip_migrations']
        clear_data = options['clear']
        ignore_migration_errors = options['ignore_migration_errors']

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
                error_msg = str(e)
                if 'InconsistentMigrationHistory' in error_msg:
                    self.stdout.write(self.style.ERROR(
                        f'✗ Migration dependency error detected.\n'
                        f'Error: {error_msg[:200]}...\n'
                        f'This indicates inconsistent migration history in the database.\n'
                    ))
                    if ignore_migration_errors:
                        self.stdout.write(self.style.WARNING(
                            '⚠ Continuing despite migration errors (--ignore-migration-errors flag set)'
                        ))
                    else:
                        self.stdout.write(self.style.WARNING(
                            '\nRecommendation: Use --skip-migrations if tables already exist.\n'
                            'Or use --ignore-migration-errors to continue anyway (use with caution).'
                        ))
                        return
                else:
                    self.stdout.write(self.style.ERROR(f'✗ Migration error: {e}'))
                    if ignore_migration_errors:
                        self.stdout.write(self.style.WARNING(
                            '⚠ Continuing despite migration errors (--ignore-migration-errors flag set)'
                        ))
                    else:
                        self.stdout.write(self.style.WARNING(
                            '\nUse --skip-migrations to skip migrations and seed data anyway.'
                        ))
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
            experts = self._seed_consultations_data(users)
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
            self._seed_decisions_data(users)
            self._seed_matchmaking_data(users)
            self._seed_developer_api_data(users)
            self._seed_meus_data(users)
            self._seed_additional_consultations_data(users, experts)
            self._seed_additional_reports_data(users)
            self._seed_additional_rewards_data(users)
            self._seed_additional_numerology_data(users)
            self._seed_accounts_additional_data(users)
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

        # Create additional random users (skip if they already exist)
        for i in range(10):
            email = f'user{i}@test.com'
            try:
                user = User.objects.get(email=email)
                # User already exists, add to list
                users.append(user)
            except User.DoesNotExist:
                # Create new user
                user = User.objects.create_user(
                    email=email,
                    full_name=f'Test User {i}',
                    password='testpass123',
                    subscription_plan=random.choice(['free', 'basic', 'premium', 'elite']),
                    is_verified=random.choice([True, False]),
                )
                users.append(user)
            
            # Create profile if it doesn't exist
            if not hasattr(user, 'profile') or not user.profile:
                UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'date_of_birth': date(1990 + i, random.randint(1, 12), random.randint(1, 28)),
                        'gender': random.choice(['male', 'female', 'other']),
                        'timezone': 'Asia/Kolkata',
                    }
                )

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

            # Create Person entries (use get_or_create to handle unique constraint on user, name, birth_date)
            for i in range(2):
                birth_date = date(1990 + i, random.randint(1, 12), random.randint(1, 28))
                person, created = Person.objects.get_or_create(
                    user=user,
                    name=f'Person {i+1}',
                    birth_date=birth_date,
                    defaults={
                        'relationship': random.choice(['spouse', 'friend', 'colleague', 'partner', 'other']),
                    }
                )

                # Only create profile if person was just created or doesn't have one
                if created or not hasattr(person, 'person_numerology_profile'):
                    PersonNumerologyProfile.objects.get_or_create(
                        person=person,
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

    def _seed_consultations_data(self, users):
        """Seed consultation data."""
        # Create experts (use get_or_create to handle existing experts)
        specialties = ['relationship', 'career', 'spiritual', 'health', 'general']
        experts = []
        for i, specialty in enumerate(specialties):
            email = f'expert_{specialty}@test.com'
            expert, created = Expert.objects.get_or_create(
                email=email,
                defaults={
                    'name': f'Expert {specialty.title()}',
                    'specialty': specialty,
                    'experience_years': random.randint(5, 20),
                    'rating': Decimal(str(round(random.uniform(4.0, 5.0), 2))),
                    'bio': f'Experienced {specialty} numerology expert with {random.randint(5, 20)} years of practice.',
                    'is_active': True,
                    'verification_status': 'approved',
                }
            )
            experts.append(expert)

        # Create consultations
        consultations = []
        for user in users[:3]:
            expert = random.choice(experts)
            consultation, created = Consultation.objects.get_or_create(
                user=user,
                expert=expert,
                defaults={
                    'consultation_type': random.choice(['video', 'chat', 'phone']),
                    'scheduled_at': timezone.now() + timedelta(days=random.randint(1, 30)),
                    'duration_minutes': 30,
                    'status': random.choice(['pending', 'confirmed', 'completed']),
                    'price': Decimal(str(random.uniform(50.0, 200.0))),
                    'payment_status': 'paid',
                }
            )
            consultations.append(consultation)
        
        return experts

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
            
            # Create auspicious dates
            AuspiciousDate.objects.create(
                user=user,
                activity_type=random.choice(['wedding', 'business_start', 'travel']),
                activity_description='Important activity',
                auspicious_date=date.today() + timedelta(days=random.randint(30, 90)),
                numerology_score=random.randint(7, 10),
                reasoning='Favorable numerology alignment for this activity',
            )
            
            # Create calendar reminders
            CalendarReminder.objects.create(
                user=user,
                reminder_type=random.choice(['remedy', 'meditation', 'affirmation']),
                title='Daily Reminder',
                description='Important reminder',
                reminder_date=date.today() + timedelta(days=1),
                reminder_time='09:00:00',
                numerology_context='Favorable day for practice',
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
            
            # Create interactions
            for i in range(min(3, len(users) - 1)):
                Interaction.objects.create(
                    from_user=users[i],
                    to_user=users[i+1],
                    interaction_type=random.choice(['compatibility_shared', 'insight_shared']),
                    metadata={},
                )
            
            # Create social groups
            if len(users) >= 3:
                group, _ = SocialGroup.objects.get_or_create(
                    name='Life Path 7 Community',
                    group_type='life_path_7',
                    defaults={
                        'description': 'Group for people with Life Path 7',
                        'created_by': users[0],
                    }
                )
                group.members.add(*users[:3])

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
                            'strength': random.randint(5, 10),
                            'description': f'Relationship between {i} and {j}',
                        }
                    )

        # Create numerology patterns
        NumerologyPattern.objects.get_or_create(
            pattern_type='sequence',
            defaults={
                'pattern_data': {'numbers': [11, 22, 33]},
                'description': 'Pattern involving master numbers 11, 22, 33',
                'significance': 'Master numbers represent heightened spiritual energy and potential.',
            }
        )
        
        # Create numerology rules
        NumerologyRule.objects.get_or_create(
            rule_type='compatibility_rule',
            rule_name='Life Path Compatibility',
            defaults={
                'rule_condition': {'life_path_numbers': [1, 5, 8]},
                'rule_result': 'These life path numbers are highly compatible',
                'examples': [{'number1': 1, 'number2': 5, 'compatibility': 'high'}],
                'is_active': True,
            }
        )
    
    def _seed_additional_consultations_data(self, users, experts):
        """Seed additional consultation-related data."""
        # Get existing consultations
        consultations = Consultation.objects.filter(user__in=users[:3])
        
        # Create consultation reviews for completed consultations
        for consultation in consultations.filter(status='completed')[:2]:
            ConsultationReview.objects.get_or_create(
                consultation=consultation,
                defaults={
                    'rating': random.randint(4, 5),
                    'review_text': 'Great consultation, very helpful insights!',
                    'is_anonymous': False,
                }
            )
        
        # Create expert availability
        for expert in experts:
            for day in range(5):  # Monday to Friday
                ExpertAvailability.objects.get_or_create(
                    expert=expert,
                    day_of_week=day,
                    start_time='09:00:00',
                    defaults={
                        'end_time': '17:00:00',
                        'timezone': 'UTC',
                        'is_available': True,
                    }
                )
        
        # Create expert chat conversations
        for user in users[:2]:
            expert = random.choice(experts)
            conversation, created = ExpertChatConversation.objects.get_or_create(
                user=user,
                expert=expert,
                defaults={'status': 'active'}
            )
            if created:
                # Create messages
                ExpertChatMessage.objects.create(
                    conversation=conversation,
                    sender_type='user',
                    sender_user=user,
                    message_content='Hello, I have a question about my numerology reading.',
                    message_type='text',
                )
                ExpertChatMessage.objects.create(
                    conversation=conversation,
                    sender_type='expert',
                    message_content='Hello! I would be happy to help. What would you like to know?',
                    message_type='text',
                )
        
        # Create expert applications (ExpertApplication uses user, not expert)
        # Note: We'll create applications for users who want to become experts
        for user in users[:2]:
            ExpertApplication.objects.get_or_create(
                user=user,
                defaults={
                    'name': user.full_name,
                    'email': user.email or f'{user.full_name.lower().replace(" ", ".")}@example.com',
                    'phone': f'+1{random.randint(1000000000, 9999999999)}',
                    'specialty': random.choice(['relationship', 'career', 'spiritual', 'health', 'general']),
                    'experience_years': random.randint(5, 20),
                    'bio': f'Experienced numerology practitioner with {random.randint(5, 20)} years of practice.',
                    'application_notes': f'Application from {user.full_name} to become an expert',
                    'status': random.choice(['pending', 'under_review', 'approved']),
                }
            )
        
        # Create expert verification documents
        applications = ExpertApplication.objects.filter(user__in=users[:2])
        for application in applications:
            ExpertVerificationDocument.objects.get_or_create(
                application=application,
                document_type='certificate',
                defaults={
                    'document_name': f'{application.name} Certificate',
                    'description': 'Professional certification document',
                    'is_verified': random.choice([True, False]),
                }
            )
        
        # Create expert unavailability
        for expert in experts[:2]:
            start_date = date.today() + timedelta(days=random.randint(1, 7))
            ExpertUnavailability.objects.create(
                expert=expert,
                start_date=start_date,
                end_date=start_date + timedelta(days=random.randint(1, 3)),
                reason=random.choice(['personal', 'holiday', 'training']),
            )

    def _seed_additional_reports_data(self, users):
        """Seed additional report data."""
        # Get existing reports and persons
        persons = Person.objects.filter(user__in=users[:3])
        templates = ReportTemplate.objects.all()[:3]
        
        if persons.exists() and templates.exists():
            # Create scheduled reports
            for user in users[:2]:
                person = persons.filter(user=user).first()
                template = templates.first()
                if person and template:
                    ScheduledReport.objects.get_or_create(
                        user=user,
                        template=template,
                        person=person,
                        defaults={
                            'schedule_frequency': 'monthly',
                            'next_run_date': timezone.now() + timedelta(days=30),
                            'is_active': True,
                        }
                    )
            
            # Create report comparisons
            reports = GeneratedReport.objects.filter(user__in=users[:2])[:2]
            if reports.count() >= 2:
                report1, report2 = reports[0], reports[1]
                ReportComparison.objects.get_or_create(
                    user=report1.user,
                    report1=report1,
                    report2=report2,
                    defaults={
                        'comparison_data': {
                            'similarities': ['Both have strong leadership qualities'],
                            'differences': ['Different life path numbers'],
                            'overall_score': 75,
                        }
                    }
                )

    def _seed_additional_rewards_data(self, users):
        """Seed additional rewards data."""
        rewards = Reward.objects.all()[:3]
        achievements = Achievement.objects.all()[:3]
        
        # Create user rewards
        for user in users[:3]:
            if rewards.exists():
                reward = random.choice(rewards)
                UserReward.objects.get_or_create(
                    user=user,
                    reward=reward,
                )
        
        # Create user achievements
        for user in users[:3]:
            if achievements.exists():
                achievement = random.choice(achievements)
                UserAchievement.objects.get_or_create(
                    user=user,
                    achievement=achievement,
                )

    def _seed_decisions_data(self, users):
        """Seed decision engine data."""
        for user in users[:3]:
            # Create decisions
            decision = Decision.objects.create(
                user=user,
                decision_text='Should I pursue a new career opportunity?',
                decision_category=random.choice(['career', 'personal', 'financial']),
                decision_date=date.today() + timedelta(days=random.randint(1, 30)),
                personal_day_number=random.randint(1, 9),
                personal_year_number=random.randint(1, 9),
                personal_month_number=random.randint(1, 9),
                timing_score=random.randint(6, 10),
                timing_reasoning=['Favorable personal day', 'Good cycle alignment'],
                recommendation='This is a favorable time for career decisions.',
                suggested_actions=['Research the opportunity', 'Consult with mentors'],
                is_made=random.choice([True, False]),
            )
            
            # Create outcome for made decisions
            if decision.is_made:
                DecisionOutcome.objects.get_or_create(
                    decision=decision,
                    defaults={
                        'outcome_type': random.choice(['positive', 'neutral', 'pending']),
                        'outcome_description': 'Decision was made and is progressing well.',
                        'satisfaction_score': random.randint(7, 10),
                        'actual_date': date.today() - timedelta(days=random.randint(1, 10)),
                    }
                )
            
            # Create decision patterns
            DecisionPattern.objects.create(
                user=user,
                pattern_type='best_timing_for_career',
                pattern_data={'favorable_days': [1, 5, 8], 'cycles': [3, 6, 9]},
                confidence_score=0.75,
            )

    def _seed_matchmaking_data(self, users):
        """Seed matchmaking data."""
        if len(users) >= 2:
            # Create matches
            for i in range(min(5, len(users) - 1)):
                user1, user2 = users[i], users[i+1]
                Match.objects.get_or_create(
                    user1=user1,
                    user2=user2,
                    defaults={
                        'match_score': random.randint(70, 95),
                        'match_details': {
                            'life_path_compatibility': random.randint(70, 100),
                            'destiny_compatibility': random.randint(70, 100),
                        },
                        'is_mutual': random.choice([True, False]),
                    }
                )
            
            # Create match preferences
            for user in users[:3]:
                MatchPreference.objects.get_or_create(
                    user=user,
                    defaults={
                        'preferred_life_paths': [random.randint(1, 9) for _ in range(3)],
                        'min_compatibility_score': 70,
                        'age_range_min': 25,
                        'age_range_max': 45,
                    }
                )

    def _seed_developer_api_data(self, users):
        """Seed developer API data."""
        for user in users[:2]:
            # Create API keys
            api_key, created = DeveloperAPIKey.objects.get_or_create(
                user=user,
                key_name=f'{user.full_name} API Key',
                defaults={'is_active': True, 'rate_limit': 100}
            )
            
            # Create API usage records
            if created:
                for i in range(5):
                    APIUsage.objects.create(
                        api_key=api_key,
                        endpoint='/api/v1/numerology/profile/',
                        method='POST',
                        response_status=200,
                        response_time_ms=random.randint(100, 500),
                    )

    def _seed_meus_data(self, users):
        """Seed MEUS (Multi-Entity Universe System) data."""
        for user in users[:3]:
            # Get user's numerology profile
            try:
                numerology_profile = user.numerology_profile
            except:
                continue
            
            # Create entity profiles
            entity = EntityProfile.objects.create(
                user=user,
                entity_type='person',
                name=f'Entity for {user.full_name}',
                date_of_birth=date(1990, 5, 15),
                relationship_type='family',
                numerology_profile=numerology_profile,
            )
            
            # Create entity relationships if we have multiple entities
            entities = EntityProfile.objects.filter(user=user)
            if entities.count() >= 2:
                entity1, entity2 = entities[0], entities[1]
                EntityRelationship.objects.get_or_create(
                    entity_1=entity1,
                    entity_2=entity2,
                    defaults={
                        'relationship_type': 'compatible',
                        'compatibility_score': random.randint(70, 95),
                    }
                )
            
            # Create entity influence
            if entities.exists():
                EntityInfluence.objects.get_or_create(
                    user=user,
                    entity=entities.first(),
                    cycle_period='year',
                    cycle_value=str(date.today().year),
                    defaults={
                        'influence_strength': random.randint(70, 100),
                        'impact_type': 'positive',
                        'impact_areas': {'health': 80, 'career': 75},
                    }
                )
            
            # Create universe events
            UniverseEvent.objects.create(
                user=user,
                event_type=random.choice(['wedding', 'business_launch', 'travel']),
                event_date=date.today() + timedelta(days=random.randint(30, 90)),
                title='Important Life Event',
                description='A significant event based on numerology cycles',
                numerology_insight={'score': random.randint(7, 10)},
                is_completed=False,
            )
            
            # Create asset entity and profile
            asset_entity = EntityProfile.objects.create(
                user=user,
                entity_type='asset',
                name=f'Vehicle for {user.full_name}',
                relationship_type='other',
            )
            
            AssetProfile.objects.create(
                entity=asset_entity,
                asset_type='vehicle',
                asset_number=str(random.randint(1000, 9999)),
                numerology_vibration=random.randint(1, 9),
                safety_score=random.randint(70, 100),
                compatibility_with_owner=random.randint(70, 100),
            )
            
            # Create cross-profile analysis cache
            if entities.count() >= 2:
                entity_ids_str = ''.join(sorted([str(e.id) for e in entities[:2]]))
                entity_hash = hashlib.sha256(entity_ids_str.encode()).hexdigest()
                CrossProfileAnalysisCache.objects.get_or_create(
                    user=user,
                    entity_combination_hash=entity_hash,
                    defaults={
                        'analysis_result': {'score': random.randint(70, 95)},
                        'expires_at': timezone.now() + timedelta(days=30),
                    }
                )
    
    def _seed_additional_numerology_data(self, users):
        """Seed additional numerology models."""
        # Get existing profiles and persons
        profiles = NumerologyProfile.objects.filter(user__in=users[:5])
        persons = Person.objects.filter(user__in=users[:3])
        remedies = Remedy.objects.filter(user__in=users[:3])
        
        # Remedy Effectiveness
        for remedy in remedies[:3]:
            RemedyEffectiveness.objects.create(
                user=remedy.user,
                remedy=remedy,
                effectiveness_score=random.uniform(3.5, 5.0),
                feedback='Very effective, noticed positive changes',
                period_start=date.today() - timedelta(days=30),
                period_end=date.today(),
            )
        
        # Remedy Combinations
        if remedies.count() >= 2:
            RemedyCombination.objects.create(
                user=remedies[0].user,
                primary_remedy=remedies[0],
                secondary_remedy=remedies[1],
                combination_score=random.uniform(7.0, 10.0),
                notes='Combination for morning energy',
            )
        
        # Remedy Reminders
        for remedy in remedies[:3]:
            RemedyReminder.objects.create(
                user=remedy.user,
                remedy=remedy,
                reminder_time='09:00:00',
                is_active=True,
                frequency='daily',
            )
        
        # RajYog Detection
        for profile in profiles[:3]:
            person = persons.filter(user=profile.user).first() if persons.exists() else None
            RajYogDetection.objects.create(
                user=profile.user,
                person=person,
                is_detected=random.choice([True, False]),
                yog_type=random.choice(['leadership', 'spiritual', 'material']) if random.choice([True, False]) else None,
                yog_name='Leadership Raj Yog' if random.choice([True, False]) else None,
                strength_score=random.randint(70, 100) if random.choice([True, False]) else 0,
                contributing_numbers={'life_path': profile.life_path_number, 'destiny': profile.destiny_number},
                detected_combinations=[[profile.life_path_number, profile.destiny_number]],
            )
        
        # Explanations
        for profile in profiles[:3]:
            Explanation.objects.create(
                user=profile.user,
                explanation_type=random.choice(['raj_yog', 'daily', 'number', 'general']),
                title='Life Path Number Meaning',
                content='Your life path number indicates strong leadership qualities and independence.',
                context_data={'life_path_number': profile.life_path_number},
            )
        
        # Weekly Reports
        for user in users[:3]:
            person = persons.filter(user=user).first() if persons.exists() else None
            week_start = date.today() - timedelta(days=7)
            WeeklyReport.objects.create(
                user=user,
                person=person,
                week_start_date=week_start,
                week_end_date=week_start + timedelta(days=6),
                week_number=random.randint(1, 52),
                year=date.today().year,
                weekly_number=random.randint(1, 9),
                personal_year_number=random.randint(1, 9),
                personal_month_number=random.randint(1, 9),
                main_theme='A week of growth and opportunities',
                weekly_summary='Focus on communication and make important decisions',
                daily_insights=[{'day': i, 'insight': f'Day {i} insight'} for i in range(7)],
                weekly_trends={'trend': 'positive', 'energy': 'high'},
                recommendations=['Focus on communication', 'Good time for decisions'],
                challenges=['Time management', 'Balancing priorities'],
                opportunities=['New connections', 'Career growth'],
            )
        
        # Yearly Reports
        for user in users[:3]:
            person = persons.filter(user=user).first() if persons.exists() else None
            YearlyReport.objects.get_or_create(
                user=user,
                person=person,
                year=date.today().year,
                defaults={
                    'personal_year_number': random.randint(1, 9),
                    'personal_year_cycle': random.choice(['beginning', 'middle', 'end']),
                    'annual_overview': 'A transformative year ahead with growth, relationships, and career opportunities',
                    'major_themes': ['Growth', 'Relationships', 'Career'],
                    'month_by_month': {str(i): f'Month {i} theme' for i in range(1, 13)},
                    'key_dates': [{'date': str(date.today() + timedelta(days=random.randint(30, 365))), 'significance': 'Important event'}],
                    'opportunities': ['Career advancement', 'New relationships'],
                    'challenges': ['Work-life balance', 'Financial planning'],
                    'recommendations': ['Focus on growth', 'Maintain balance'],
                }
            )
        
        # Name Reports
        for user in users[:3]:
            NameReport.objects.create(
                user=user,
                name=user.full_name,
                name_type=random.choice(['birth', 'current', 'nickname']),
                system=random.choice(['pythagorean', 'chaldean']),
                normalized_name=user.full_name.upper(),
                numbers={
                    'expression': random.randint(1, 9),
                    'soul_urge': random.randint(1, 9),
                    'personality': random.randint(1, 9),
                    'name_vibration': random.randint(1, 9),
                },
                breakdown={'letters': {}, 'words': {}},
            )
        
        # Phone Reports
        for user in users[:3]:
            phone_num = f'+1{random.randint(1000000000, 9999999999)}'
            PhoneReport.objects.create(
                user=user,
                phone_raw=phone_num,
                phone_e164=phone_num,
                country='US',
                method=random.choice(['core', 'full', 'compatibility']),
                computed={
                    'vibration': random.randint(1, 9),
                    'compatibility_score': random.randint(70, 100),
                    'breakdown': {},
                    'evidence_map': {},
                },
            )
        
        # Detailed Readings
        for profile in profiles[:3]:
            DetailedReading.objects.get_or_create(
                user=profile.user,
                reading_type='life_path',
                number=profile.life_path_number,
                defaults={
                    'detailed_interpretation': 'Your life path number reveals your core purpose and natural talents.',
                    'career_insights': 'Natural leadership abilities and innovative thinking will serve you well in your career.',
                    'relationship_insights': 'You value independence and seek partners who respect your need for space.',
                    'life_purpose': 'To lead and inspire others through your unique vision and creativity.',
                    'challenges_and_growth': 'Learn to balance independence with collaboration.',
                    'personalized_advice': 'Focus on developing your leadership skills while remaining open to feedback.',
                }
            )
        
        # Health Numerology Profile
        for profile in profiles[:3]:
            HealthNumerologyProfile.objects.get_or_create(
                user=profile.user,
                defaults={
                    'stress_number': random.randint(1, 9),
                    'vitality_number': random.randint(1, 9),
                    'health_cycle_number': random.randint(1, 9),
                    'health_cycles': {'nine_year': random.randint(1, 9), 'seven_year': random.randint(1, 7)},
                    'current_cycle': {'phase': 'growth', 'number': random.randint(1, 9)},
                    'medical_timing': {'optimal_months': [3, 6, 9]},
                    'health_windows': [{'year': date.today().year, 'months': [3, 6, 9]}],
                    'risk_periods': [],
                }
            )
        
        # Name Correction
        for user in users[:3]:
            NameCorrection.objects.create(
                user=user,
                original_name=user.full_name,
                current_expression=random.randint(1, 9),
                target_expression=random.randint(1, 9),
                suggestions=[{'name': f'{user.full_name} Modified', 'reason': 'Better numerology alignment'}],
                recommendations=['Consider name adjustments for better alignment'],
            )
        
        # Spiritual Numerology Profile
        for profile in profiles[:3]:
            SpiritualNumerologyProfile.objects.get_or_create(
                user=profile.user,
                defaults={
                    'spiritual_number': random.randint(1, 9),
                    'spiritual_path': 'Enlightenment and service',
                    'karmic_lessons': ['Patience', 'Compassion'],
                    'spiritual_insights': {'awakening_level': 'moderate', 'soul_age': 'mature'},
                }
            )
        
        # Soul Contract
        for profile in profiles[:3]:
            SoulContract.objects.get_or_create(
                user=profile.user,
                defaults={
                    'contract_type': random.choice(['service', 'learning', 'teaching']),
                    'contract_details': 'Your soul contract involves helping others through numerology insights.',
                    'karmic_debts': [random.randint(1, 9)],
                    'spiritual_mission': 'Spread awareness and guidance',
                }
            )
        
        # Karmic Timeline
        for profile in profiles[:3]:
            KarmicTimeline.objects.create(
                user=profile.user,
                timeline_data={
                    'past_lives': [{'era': 'ancient', 'role': 'teacher'}],
                    'current_life': {'purpose': 'service', 'lessons': ['compassion']},
                    'future_potential': {'growth': 'spiritual', 'impact': 'high'},
                },
                karmic_cycles=[{'cycle': 1, 'theme': 'learning'}, {'cycle': 2, 'theme': 'teaching'}],
            )
        
        # Rebirth Cycle
        for profile in profiles[:3]:
            RebirthCycle.objects.create(
                user=profile.user,
                cycle_number=random.randint(1, 9),
                cycle_phase=random.choice(['beginning', 'middle', 'end']),
                rebirth_insights='You are in a phase of spiritual renewal.',
                cycle_duration_years=random.randint(7, 9),
            )
        
        # Predictive Cycle
        for user in users[:3]:
            PredictiveCycle.objects.create(
                user=user,
                cycle_type=random.choice(['nine_year', 'breakthrough', 'crisis', 'opportunity']),
                year=date.today().year,
                cycle_data={'number': random.randint(1, 9), 'phase': 'growth'},
            )
        
        # Breakthrough Year
        for user in users[:3]:
            BreakthroughYear.objects.create(
                user=user,
                year=date.today().year + random.randint(0, 2),
                personal_year=random.randint(1, 9),
                breakthrough_type=random.choice(['career', 'spiritual', 'personal']),
                description='A year of major breakthroughs and transformations',
                preparation='Focus on personal growth and opportunities',
            )
        
        # Crisis Year
        for user in users[:3]:
            CrisisYear.objects.create(
                user=user,
                year=date.today().year + random.randint(1, 3),
                personal_year=random.randint(1, 9),
                crisis_type=random.choice(['financial', 'relationship', 'health']),
                severity=random.choice(['low', 'medium', 'high']),
                guidance='Focus on stability and seek support during challenging times.',
            )
        
        # Life Milestone
        for user in users[:3]:
            LifeMilestone.objects.create(
                user=user,
                milestone_type=random.choice(['career', 'relationship', 'spiritual']),
                predicted_date=date.today() + timedelta(days=random.randint(90, 365)),
                significance='A significant life event that will shape your future',
                numerology_context={'number': random.randint(1, 9), 'meaning': 'Transformation'},
            )
        
        # Generational Analysis
        if persons.count() >= 2:
            person_ids = sorted([str(p.id) for p in persons[:2]])
            family_hash = hashlib.sha256(''.join(person_ids).encode()).hexdigest()
            GenerationalAnalysis.objects.get_or_create(
                user=users[0],
                family_unit_hash=family_hash,
                defaults={
                    'generational_number': random.randint(1, 9),
                    'analysis_data': {'common_numbers': [1, 5], 'patterns': ['independence', 'innovation']},
                }
            )
        
        # Family Unit Profile
        if persons.count() >= 2:
            person_ids = sorted([str(p.id) for p in persons[:2]])
            family_hash = hashlib.sha256(''.join(person_ids).encode()).hexdigest()
            FamilyUnitProfile.objects.get_or_create(
                user=users[0],
                family_unit_hash=family_hash,
                defaults={
                    'member_count': persons.count(),
                    'family_life_path': random.randint(1, 9),
                    'family_destiny': random.randint(1, 9),
                    'generational_number': random.randint(1, 9),
                    'compatibility_score': random.randint(70, 100),
                    'dynamics': {'harmony': 'high', 'communication': 'strong'},
                }
            )
        
        # Karmic Contract
        if persons.count() >= 2:
            KarmicContract.objects.create(
                user=users[0],
                parent_person=persons[0],
                child_person=persons[1] if persons.count() > 1 else persons[0],
                contract_type=random.choice(['teaching', 'learning', 'healing']),
                karmic_lessons=['Unconditional love', 'Patience'],
                relationship_dynamics='Parent-child relationship with strong karmic bonds',
            )
        
        # Feng Shui Analysis
        for user in users[:3]:
            FengShuiAnalysis.objects.create(
                user=user,
                house_number=str(random.randint(1, 999)),
                numerology_vibration=random.randint(1, 9),
                hybrid_score=random.randint(70, 100),
                recommendations=['Place water elements in north', 'Use number 8 colors'],
            )
        
        # Space Optimization (requires FengShuiAnalysis)
        feng_shui_analyses = FengShuiAnalysis.objects.filter(user__in=users[:3])
        for analysis in feng_shui_analyses[:2]:
            SpaceOptimization.objects.create(
                analysis=analysis,
                room_name=random.choice(['Bedroom', 'Office', 'Living Room']),
                room_number=str(random.randint(1, 9)),
                direction=random.choice(['north', 'east', 'south', 'west']),
                color_recommendations=['blue', 'green'],
                number_combinations=[[random.randint(1, 9), random.randint(1, 9)]],
                energy_flow_score=random.randint(70, 100),
            )
        
        # Room Numerology
        for user in users[:3]:
            RoomNumerology.objects.create(
                user=user,
                room_type=random.choice(['bedroom', 'office', 'living_room']),
                room_number=random.randint(1, 9),
                room_vibration=random.randint(1, 9),
                recommendations=['Use specific colors', 'Place items in favorable positions'],
                compatibility_score=random.randint(70, 100),
            )
        
        # Mental State Tracking
        for user in users[:3]:
            for i in range(5):
                MentalStateTracking.objects.get_or_create(
                    user=user,
                    date=date.today() - timedelta(days=i),
                    defaults={
                        'emotional_state': random.choice(['very_positive', 'positive', 'neutral', 'negative']),
                        'mood_score': random.randint(50, 100),
                        'stress_level': random.randint(0, 50),
                        'notes': f'Day {i+1} tracking',
                    }
                )
        
        # Mental State Analysis
        for user in users[:3]:
            MentalStateAnalysis.objects.create(
                user=user,
                period_start=date.today() - timedelta(days=30),
                period_end=date.today(),
                overall_state=random.choice(['balanced', 'positive', 'needs_attention']),
                numerology_insights='Your current numerology cycle supports mental clarity',
                recommendations=['Practice meditation', 'Maintain routine'],
                analysis_data={'patterns': ['stable', 'growing'], 'trends': ['improving']},
            )
        
        # Emotional Cycle
        for user in users[:3]:
            EmotionalCycle.objects.create(
                user=user,
                cycle_phase=random.choice(['high', 'low', 'transition']),
                cycle_number=random.randint(1, 9),
                emotional_insights='Current emotional cycle supports growth and healing',
                cycle_duration_days=random.randint(7, 28),
                peak_dates=[date.today() + timedelta(days=random.randint(1, 30)) for _ in range(2)],
            )
    
    def _seed_accounts_additional_data(self, users):
        """Seed additional accounts models."""
        # OTP Codes
        for user in users[:2]:
            OTPCode.objects.create(
                user=user,
                code=str(random.randint(100000, 999999)),
                type=random.choice(['email', 'phone']),
                expires_at=timezone.now() + timedelta(minutes=10),
            )
        
        # Refresh Tokens
        for user in users[:2]:
            RefreshToken.objects.create(
                user=user,
                token=f'refresh_token_{user.id}_{random.randint(1000, 9999)}',
                expires_at=timezone.now() + timedelta(days=30),
            )
        
        # Device Tokens
        for user in users[:3]:
            DeviceToken.objects.create(
                user=user,
                fcm_token=f'fcm_token_{user.id}_{random.randint(100000, 999999)}',
                device_type=random.choice(['ios', 'android', 'web']),
                device_name=random.choice(['iPhone 14', 'Samsung Galaxy', 'Chrome Browser']),
            )
        
        # Password Reset Tokens
        for user in users[:2]:
            PasswordResetToken.objects.create(
                user=user,
                token=f'reset_token_{user.id}_{random.randint(1000, 9999)}',
                expires_at=timezone.now() + timedelta(hours=1),
            )
        
        # Email Templates
        email_templates = [
            {'name': 'Welcome Email', 'subject': 'Welcome to NumerAI', 'template_type': 'welcome'},
            {'name': 'Daily Reading', 'subject': 'Your Daily Numerology Reading', 'template_type': 'daily_reading'},
            {'name': 'Report Ready', 'subject': 'Your Report is Ready', 'template_type': 'report_ready'},
        ]
        for template_data in email_templates:
            EmailTemplate.objects.get_or_create(
                name=template_data['name'],
                defaults=template_data
            )
        
        # Audit Logs
        for user in users[:3]:
            AuditLog.objects.create(
                user=user,
                action=random.choice(['profile_update', 'subscription_change', 'payment']),
                resource_type='user',
                resource_id=str(user.id),
                metadata={'ip_address': '127.0.0.1', 'user_agent': 'Mozilla/5.0'},
            )
