import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Avatar } from '@/components/ui/Avatar'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/giris')
  }

  return (
    <nav className="sticky top-0 z-40 bg-surface-base/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-teal-400 shrink-0">
          Sesli
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
          <Link to="/katalog" className="hover:text-text-primary transition-colors">
            Katalog
          </Link>
          <Link to="/planlar" className="hover:text-text-primary transition-colors">
            Planlar
          </Link>
          {user && (
            <>
              <Link to="/gecmis" className="hover:text-text-primary transition-colors">
                Geçmiş
              </Link>
              <Link to="/profil" className="hover:text-text-primary transition-colors">
                Profil
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Ara"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-overlay transition-colors text-text-secondary hover:text-text-primary"
          >
            <Search size={20} strokeWidth={1.75} />
          </button>

          {user ? (
            <>
              <button
                aria-label="Bildirimler"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-overlay transition-colors text-text-secondary hover:text-text-primary"
              >
                <Bell size={20} strokeWidth={1.75} />
              </button>
              <div className="flex items-center gap-2 ml-1">
                <Link to="/profil">
                  <Avatar src={user.profilFoto} alt={`${user.ad} ${user.soyad}`} size="sm" />
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Çıkış yap"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-overlay transition-colors text-text-secondary hover:text-red-400"
                >
                  <LogOut size={18} strokeWidth={1.75} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link
                to="/giris"
                className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors px-3 py-2"
              >
                Giriş
              </Link>
              <Link
                to="/kayit"
                className="text-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl transition-colors"
              >
                Üye Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
