'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { FloatingChatWidget } from '@/components/ai-chat/floating-chat-widget';
import { AIChatModal } from '@/components/ai-chat/ai-chat-modal';

/**
 * Renders the AI chat widget (floating button + modal) only on the dashboard
 * when the user is logged in and has subscription access to AI chat.
 */
export function DashboardAIChatOnly() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { hasAccess } = useSubscription();

  const isDashboard = pathname?.includes('/dashboard') ?? false;
  const canUseChat = hasAccess('ai-chat');

  if (!isDashboard || !user || !canUseChat) {
    return null;
  }

  return (
    <>
      <FloatingChatWidget />
      <AIChatModal />
    </>
  );
}
