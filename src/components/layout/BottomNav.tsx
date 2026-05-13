import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Clock, User, CreditCard } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { to: '/', icon: Home, label: 'Ana Sayfa' },
  { to: '/katalog', icon: BookOpen, label: 'Katalog' },
  { to: '/gecmis', icon: Clock, label: 'Geçmiş', authRequired: true },
  { to: '/planlar', icon: CreditCard, label: 'Planlar' },
  { to: '/profil', icon: User, label: 'Profil', authRequired: true },
]

export function BottomNav() {
  const { isAuthenticated } = useAuthStore()

  const visibleItems = navItems.filter((item) => !item.authRequired || isAuthenticated)

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-raised">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {visibleItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[44px]',
                isActive ? 'text-teal-400' : 'text-text-tertiary',
              )
            }
          >
            <Icon size={22} strokeWidth={1.75} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
