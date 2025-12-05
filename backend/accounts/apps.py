from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    
    def ready(self):
        """Run startup checks when Django is ready."""
        # Only run in production/actual server, not during migrations
        import os
        if os.environ.get('RUN_MAIN') != 'true':
            return
            
        try:
            self._ensure_notifications_table()
        except Exception as e:
            logger.warning(f"Could not verify notifications table on startup: {e}")
    
    def _ensure_notifications_table(self):
        """Ensure notifications table exists, create if missing."""
        from django.db import connection
        from django.core.management import call_command
        
        cursor = connection.cursor()
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'notifications'
            )
        """)
        table_exists = cursor.fetchone()[0]
        
        if not table_exists:
            logger.info("Notifications table not found, attempting to create it...")
            try:
                # Try migration first
                call_command('migrate', 'accounts', '0003', verbosity=0, interactive=False)
                logger.info("Notifications table created via migration")
            except Exception as migration_error:
                logger.warning(f"Migration failed: {migration_error}, trying SQL fallback...")
                try:
                    # SQL fallback
                    cursor.execute("""
                        CREATE TABLE IF NOT EXISTS notifications (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            title VARCHAR(200) NOT NULL,
                            message TEXT NOT NULL,
                            notification_type VARCHAR(30) NOT NULL DEFAULT 'info',
                            is_read BOOLEAN NOT NULL DEFAULT FALSE,
                            is_sent BOOLEAN NOT NULL DEFAULT FALSE,
                            data JSONB DEFAULT '{}',
                            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                            read_at TIMESTAMP WITH TIME ZONE,
                            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
                        )
                    """)
                    cursor.execute("""
                        CREATE INDEX IF NOT EXISTS notificatio_user_id_a4dd5c_idx 
                        ON notifications(user_id, is_read)
                    """)
                    cursor.execute("""
                        CREATE INDEX IF NOT EXISTS notificatio_user_id_7336fd_idx 
                        ON notifications(user_id, created_at)
                    """)
                    cursor.execute("""
                        CREATE INDEX IF NOT EXISTS notificatio_notific_19df93_idx 
                        ON notifications(notification_type)
                    """)
                    connection.commit()
                    logger.info("Notifications table created via SQL fallback")
                except Exception as sql_error:
                    logger.error(f"Failed to create notifications table: {sql_error}")
        else:
            logger.debug("Notifications table verified")