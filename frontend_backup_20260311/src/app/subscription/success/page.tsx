/**
 * Subscription Success Page
 *
 * Post-payment landing page. Refreshes user and subscription state,
 * then redirects to dashboard for immediate feature access.
 */

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircleIcon, Loader2Icon } from 'lucide-react'
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout'
import { useAuth } from '@/contexts/auth-context'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { toast } from 'sonner'

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const { refreshFeatures } = useSubscription()
  const [refreshing, setRefreshing] = React.useState(true)

  React.useEffect(() => {
    if (!user) {
      router.replace('/login?redirect=/subscription/success')
      return
    }

    const refreshAndRedirect = async () => {
      try {
        await refreshUser()
        await refreshFeatures()
        toast.success('Subscription activated!')
        router.replace('/dashboard')
      } catch (error) {
        console.error('Failed to refresh after payment:', error)
        toast.error('Subscription activated. Refreshing...')
        router.replace('/dashboard')
      } finally {
        setRefreshing(false)
      }
    }

    refreshAndRedirect()
  }, [user, refreshUser, refreshFeatures, router])

  return (
    <CosmicPageLayout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        {refreshing ? (
          <>
            <Loader2Icon className="w-16 h-16 text-primary animate-spin mb-6" />
            <h1 className="text-2xl font-bold mb-2">Activating your subscription...</h1>
            <p className="text-muted-foreground">You'll be redirected shortly.</p>
          </>
        ) : (
          <>
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-6" />
            <h1 className="text-2xl font-bold mb-2">Payment successful!</h1>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
          </>
        )}
      </div>
    </CosmicPageLayout>
  )
}
