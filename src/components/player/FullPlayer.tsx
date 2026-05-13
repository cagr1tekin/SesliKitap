import { Play, Pause, RotateCcw, RotateCw, X, Volume2, Gauge } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatSure } from '@/utils/formatters'
import { HIZ_SECENEKLERI, GERI_SARMA, ILERI_SARMA } from '@/utils/constants'
import { cn } from '@/utils/cn'

export function FullPlayer() {
  const {
    currentKitap, isPlaying, currentTime, duration, hiz, volume, isFullscreen,
    setPlaying, setCurrentTime, setHiz, setVolume, toggleFullscreen, close,
  } = usePlayerStore()

  if (!currentKitap || !isFullscreen) return null

  return (
    <div className="fixed inset-0 z-50 bg-surface-base flex flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={toggleFullscreen} aria-label="Küçült"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-overlay text-text-secondary hover:text-text-primary transition-colors">
          <X size={20} strokeWidth={1.75} />
        </button>
        <p className="text-sm font-medium text-text-secondary">Şu an dinleniyor</p>
        <button onClick={close} aria-label="Oynatıcıyı kapat"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-overlay text-text-secondary hover:text-red-400 transition-colors">
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <div className="w-56 h-72 md:w-72 md:h-96 rounded-2xl bg-surface-raised flex items-center justify-center">
          <p className="text-text-secondary text-center text-sm font-medium px-4">{currentKitap.baslik}</p>
        </div>

        <div className="w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-text-primary">{currentKitap.baslik}</h2>
          <p className="text-base text-text-secondary mt-1">
            {currentKitap.yazar.ad} {currentKitap.yazar.soyad}
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3">
          <ProgressBar value={currentTime} max={duration || 1} onClick={setCurrentTime} showThumb className="h-1.5" />
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>{formatSure(currentTime)}</span>
            <span>{formatSure(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button onClick={() => setCurrentTime(Math.max(0, currentTime - GERI_SARMA))}
            aria-label={`${GERI_SARMA} saniye geri sar`}
            className="flex flex-col items-center gap-1 text-text-secondary hover:text-text-primary transition-colors">
            <RotateCcw size={28} strokeWidth={1.5} />
            <span className="text-xs">{GERI_SARMA}s</span>
          </button>

          <button onClick={() => setPlaying(!isPlaying)} aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
            className="w-16 h-16 rounded-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 flex items-center justify-center text-white transition-colors">
            {isPlaying
              ? <Pause size={28} strokeWidth={1.75} />
              : <Play size={28} strokeWidth={1.75} className="ml-1" />}
          </button>

          <button onClick={() => setCurrentTime(Math.min(duration, currentTime + ILERI_SARMA))}
            aria-label={`${ILERI_SARMA} saniye ileri sar`}
            className="flex flex-col items-center gap-1 text-text-secondary hover:text-text-primary transition-colors">
            <RotateCw size={28} strokeWidth={1.5} />
            <span className="text-xs">{ILERI_SARMA}s</span>
          </button>
        </div>

        <div className="w-full max-w-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={18} strokeWidth={1.75} className="text-text-secondary" />
            <input type="range" min={0} max={1} step={0.05} value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Ses seviyesi" className="w-24 accent-teal-500" />
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={18} strokeWidth={1.75} className="text-text-secondary" />
            <div className="flex gap-1">
              {HIZ_SECENEKLERI.map((h) => (
                <button key={h} onClick={() => setHiz(h)}
                  className={cn('text-xs font-semibold px-2 py-1 rounded-lg transition-colors',
                    hiz === h ? 'bg-teal-500 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay')}>
                  {h}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
