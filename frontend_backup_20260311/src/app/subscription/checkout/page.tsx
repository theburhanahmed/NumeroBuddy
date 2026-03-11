/**
 * Checkout Page
 * 
 * Streamlined checkout flow for subscriptions.
 */

'use client'

export const dynamic = 'force-dynamic'

import * as React from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftIcon, LockIcon, CheckIcon } from 'lucide-react'
import { BaseButton } from '@/components/base/BaseButton'
import { BaseCard } from '@/components/base/BaseCard'
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout'
import { useAuth } from '@/contexts/auth-context'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { paymentsAPI } from '@/lib/api-client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, refreshUser } = useAuth()
  const { refreshFeatures } = useSubscription()
  const [loading, setLoading] = React.useState(false)
  const [planId, setPlanId] = React.useState(searchParams.get('plan') || 'premium')
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>(
    (searchParams.get('cycle') as 'monthly' | 'yearly') || 'monthly'
  )

  const plans = {
    premium: {
      monthly: { price: 9.99, priceId: 'price_premium_monthly' },
      yearly: { price: 99.99, priceId: 'price_premium_yearly' },
    },
    elite: {
      monthly: { price: 29.99, priceId: 'price_elite_monthly' },
      yearly: { price: 299.99, priceId: 'price_elite_yearly' },
    },
  }

  const selectedPlan = plans[planId as keyof typeof plans]?.[billingCycle]
  const price = selectedPlan?.price || 0
  const priceId = selectedPlan?.priceId || ''

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login?redirect=/subscription/checkout')
      return
    }

    setLoading(true)
    try {
      // Prefer Stripe Checkout (redirect): user pays on Stripe-hosted page; webhook syncs DB; success page refreshes user.
      try {
        const sessionRes = await paymentsAPI.createCheckoutSession({
          plan: planId,
        })
        const sessionData = sessionRes.data || sessionRes
        if (sessionData?.url) {
          toast.success('Redirecting to secure payment...')
          window.location.href = sessionData.url
          return
        }
      } catch (_) {
        // Fallback: create subscription via API (e.g. when Stripe Checkout not configured)
      }

      const response = await paymentsAPI.createSubscription({
        plan: planId,
        payment_method_id: undefined,
      })
      const data = response.data || response
      const clientSecret = data.client_secret
      const status = data.status

      if (clientSecret && status !== 'active') {
        toast.info('Payment method required. Use Stripe Checkout when configured.')
      } else {
        await refreshUser()
        await refreshFeatures()
        toast.success('Subscription created successfully!')
        router.push('/dashboard')
      }
    } catch (error: unknown) {
      console.error('Checkout failed:', error)
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err?.response?.data?.error || 'Failed to process checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CosmicPageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BaseButton
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </BaseButton>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <BaseCard variant="space" padding="lg">
              <h2 className="text-2xl font-bold mb-6 font-['Playfair_Display']">
                Checkout
              </h2>

              {/* Plan Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Plan</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['premium', 'elite'] as const).map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setPlanId(plan)}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-all",
                        planId === plan
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      <div className="font-semibold capitalize mb-1">{plan}</div>
                      <div className="text-sm text-muted-foreground">
                        ${plans[plan][billingCycle].price}/{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Billing Cycle */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Billing Cycle</label>
                <div className="flex gap-3">
                  {(['monthly', 'yearly'] as const).map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => setBillingCycle(cycle)}
                      className={cn(
                        "flex-1 p-3 rounded-lg border text-center transition-all",
                        billingCycle === cycle
                          ? "border-primary bg-primary/10 font-semibold"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      {cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                      {cycle === 'yearly' && (
                        <span className="block text-xs text-primary mt-1">Save 17%</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <BaseCard variant="default" padding="md" className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LockIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">Secure Payment</div>
                        <div className="text-sm text-muted-foreground">
                          Powered by Stripe
                        </div>
                      </div>
                    </div>
                  </div>
                </BaseCard>
                <p className="text-xs text-muted-foreground">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </BaseCard>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <BaseCard variant="space" padding="lg" className="sticky top-4">
              <h3 className="text-lg font-semibold mb-4 font-['Playfair_Display']">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-semibold capitalize">{planId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-semibold capitalize">{billingCycle}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      ${price.toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <BaseButton
                variant="space"
                onClick={handleCheckout}
                loading={loading}
                className="w-full gap-2 mb-4"
              >
                <LockIcon className="w-4 h-4" />
                Complete Payment
              </BaseButton>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </CosmicPageLayout>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <CosmicPageLayout>
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="animate-pulse rounded-xl bg-white/5 h-64 w-full" />
          </div>
        </CosmicPageLayout>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}