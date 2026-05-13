import { PageWrapper } from '@/components/layout/PageWrapper'
import { PlanCard } from '@/components/subscription/PlanCard'
import { usePlans, useCurrentSubscription } from '@/hooks/useSubscription'

export function PlansPage() {
  const { data: planlar, isLoading } = usePlans()
  const { data: mevcutAbonelik } = useCurrentSubscription()

  const handleSelectPlan = (planId: number) => {
    console.info('Plan seçildi:', planId)
  }

  return (
    <PageWrapper maxWidth="xl">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-3">Planlar</h1>
          <p className="text-text-secondary">
            İhtiyacınıza uygun planı seçin. İstediğiniz zaman değiştirebilirsiniz.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 bg-surface-raised rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : planlar?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planlar.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={mevcutAbonelik?.planID === plan.id}
                onSelect={handleSelectPlan}
                highlighted={i === 1}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-secondary">Plan bilgisi yüklenemedi.</p>
        )}
      </div>
    </PageWrapper>
  )
}
