import { Check } from 'lucide-react'
import type { AbonelikPlani } from '@/types/subscription.types'
import { formatFiyat } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'

interface PlanCardProps {
  plan: AbonelikPlani
  isCurrentPlan?: boolean
  onSelect: (planId: number) => void
  highlighted?: boolean
}

export function PlanCard({ plan, isCurrentPlan, onSelect, highlighted = false }: PlanCardProps) {
  const ozellikler = [
    plan.aylikKitapLimiti ? `Ayda ${plan.aylikKitapLimiti} kitap` : 'Sınırsız kitap',
    plan.indirilebilirMi ? 'Çevrimdışı indirme' : 'Yalnızca çevrimiçi',
    'Web ve mobil erişim',
  ]

  return (
    <div className={cn('bg-surface-raised rounded-2xl p-6 flex flex-col gap-5 relative', highlighted && 'bg-teal-500/10')}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          En Popüler
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-text-primary">{plan.planAdi}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-bold text-text-primary">{formatFiyat(plan.aylikUcret)}</span>
          <span className="text-sm text-text-secondary">/ay</span>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {ozellikler.map((ozellik) => (
          <li key={ozellik} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check size={16} strokeWidth={1.75} className="text-teal-400 shrink-0 mt-0.5" />
            {ozellik}
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSelect(plan.id)}
        variant={isCurrentPlan ? 'secondary' : highlighted ? 'primary' : 'secondary'}
        disabled={isCurrentPlan}
        className="w-full"
      >
        {isCurrentPlan ? 'Mevcut Plan' : 'Planı Seç'}
      </Button>
    </div>
  )
}
