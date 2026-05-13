import { Play, Pause, X, ChevronUp } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatSure } from '@/utils/formatters'

export function MiniPlayer() {
  const { currentKitap, isPlaying, currentTime, duration, setPlaying, toggleFullscreen, close } =
    usePlayerStore()

  if (!currentKitap) return null

  return (
    <div className="fixed bottom-16 md:bottom-0 inset-x-0 z-30 bg-surface-raised">
      <ProgressBar value={currentTime} max={duration || 1} className="rounded-none h-0.5" />
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-lg bg-surface-sunken shrink-0 flex items-center justify-center">
          <span className="text-text-tertiary text-xs text-center line-clamp-2 px-1">{currentKitap.baslik.slice(0, 2)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{currentKitap.baslik}</p>
          <p className="text-xs text-text-secondary">
            {formatSure(currentTime)} / {formatSure(duration)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors"
          >
            {isPlaying ? (
              <Pause size={18} strokeWidth={1.75} />
            ) : (
              <Play size={18} strokeWidth={1.75} className="ml-0.5" />
            )}
          </button>
          <button
            onClick={toggleFullscreen}
            aria-label="Tam ekran oynatıcı"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-overlay text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronUp size={20} strokeWidth={1.75} />
          </button>
          <button
            onClick={close}
            aria-label="Oynatıcıyı kapat"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-overlay text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  )
}
