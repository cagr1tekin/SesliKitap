import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { booksApi } from '@/api/books.api'
import { ILERLEME_KAYIT_INTERVAL } from '@/utils/constants'
import type { Kitap } from '@/types/book.types'

export function usePlayer() {
  const store = usePlayerStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!store.currentKitap || !store.isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      if (store.currentKitap) {
        const yuzde = (store.currentTime / store.duration) * 100
        booksApi.saveProgress(store.currentKitap.id, yuzde).catch(() => {})
      }
    }, ILERLEME_KAYIT_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [store.currentKitap, store.isPlaying, store.currentTime, store.duration])

  const play = (kitap: Kitap) => {
    store.setKitap(kitap)
    store.setDuration(kitap.sure)
  }

  return {
    ...store,
    play,
  }
}
