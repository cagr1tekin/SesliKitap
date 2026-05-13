export const KATEGORILER = [
  'Roman',
  'Kişisel Gelişim',
  'Tarih',
  'Bilim',
  'Çocuk',
  'Felsefe',
  'Ekonomi',
  'Psikoloji',
  'Fantastik',
  'Sağlık',
] as const

export const HIZ_SECENEKLERI = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

export const UYKU_ZAMANLAYICI_SECENEKLERI = [5, 10, 15, 30, 45, 60, 'bolumSonu'] as const

export const ABONELIK_PLANLARI = {
  TEMEL: { ad: 'Temel', aylikFiyat: 29.9, kitapLimiti: 2 },
  STANDART: { ad: 'Standart', aylikFiyat: 59.9, kitapLimiti: 10 },
  PREMIUM: { ad: 'Premium', aylikFiyat: 99.9, kitapLimiti: null },
} as const

export const YILLIK_INDIRIM = 0.2

export const UCRETSIZ_PREVIEW_SURE = 5 * 60

export const ILERLEME_KAYIT_INTERVAL = 10 * 1000

export const GERI_SARMA = 15
export const ILERI_SARMA = 30
