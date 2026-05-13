export function formatSure(saniye: number): string {
  const saat = Math.floor(saniye / 3600)
  const dakika = Math.floor((saniye % 3600) / 60)
  const kalan = Math.floor(saniye % 60)

  if (saat > 0) {
    return `${saat}:${dakika.toString().padStart(2, '0')}:${kalan.toString().padStart(2, '0')}`
  }
  return `${dakika}:${kalan.toString().padStart(2, '0')}`
}

export function formatSureOkunabilir(saniye: number): string {
  const saat = Math.floor(saniye / 3600)
  const dakika = Math.floor((saniye % 3600) / 60)

  if (saat > 0 && dakika > 0) return `${saat} sa ${dakika} dk`
  if (saat > 0) return `${saat} sa`
  return `${dakika} dk`
}

export function formatFiyat(fiyat: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(fiyat)
}

export function formatTarih(tarih: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(tarih))
}

export function formatYuzde(ilerleme: number): string {
  return `%${Math.round(ilerleme)}`
}
