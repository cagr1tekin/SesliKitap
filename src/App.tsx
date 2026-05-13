import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { MiniPlayer } from '@/components/player/MiniPlayer'
import { FullPlayer } from '@/components/player/FullPlayer'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { BookDetailPage } from '@/pages/BookDetailPage'
import { PlansPage } from '@/pages/PlansPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { HistoryPage } from '@/pages/HistoryPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'

export function App() {
  return (
    <div className="min-h-screen bg-surface-base font-sans">
      <Routes>
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/kayit" element={<RegisterPage />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/katalog" element={<CatalogPage />} />
                <Route path="/kitap/:id" element={<BookDetailPage />} />
                <Route path="/planlar" element={<PlansPage />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/gecmis" element={<HistoryPage />} />
              </Routes>
              <MiniPlayer />
              <FullPlayer />
              <BottomNav />
            </>
          }
        />
      </Routes>
    </div>
  )
}
