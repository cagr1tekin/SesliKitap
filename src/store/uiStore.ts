import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  searchOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  searchOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
