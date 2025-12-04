'use client';

import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface NotificationBadgeProps {
  onClick?: () => void;
}

export function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const { user } = useAuth();

  // TEMPORARILY DISABLED: API calls removed to prevent database errors
  // TODO: Re-enable when notifications table migration is confirmed working
  // const [unreadCount, setUnreadCount] = useState(0);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!user) return;
  //   // API call logic removed - will be re-enabled after migration fix
  // }, [user]);

  if (!user) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Notifications"
    >
      <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      {/* Badge count temporarily disabled - no API calls */}
      {/* {unreadCount > 0 && (
        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )} */}
    </button>
  );
}

