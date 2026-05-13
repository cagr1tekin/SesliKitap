import { create } from 'zustand'
import type { Kitap } from '../types/book.types'

type PlayerHiz = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2
type UykuZamanlayici = 5 | 10 | 15 | 30 | 45 | 60 | 'bolumSonu' | null

interface PlayerState {
  currentKitap: Kitap | null
  isPlaying: boolean
  currentTime: number
  duration: number
  hiz: PlayerHiz
  volume: number
  uykuZamanlayici: UykuZamanlayici
  isFullscreen: boolean
  setKitap: (kitap: Kitap) => void
  setPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setHiz: (hiz: PlayerHiz) => void
  setVolume: (volume: number) => void
  setUykuZamanlayici: (timer: UykuZamanlayici) => void
  toggleFullscreen: () => void
  close: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentKitap: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  hiz: 1,
  volume: 1,
  uykuZamanlayici: null,
  isFullscreen: false,
  setKitap: (kitap) => set({ currentKitap: kitap, currentTime: 0, isPlaying: true }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setHiz: (hiz) => set({ hiz }),
  setVolume: (volume) => set({ volume }),
  setUykuZamanlayici: (uykuZamanlayici) => set({ uykuZamanlayici }),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  close: () => set({ currentKitap: null, isPlaying: false, currentTime: 0, isFullscreen: false }),
}))
