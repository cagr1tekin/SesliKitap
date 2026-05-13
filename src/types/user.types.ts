export interface User {
  id: number
  ad: string
  soyad: string
  eposta: string
  profilFoto?: string
  kayitTarihi: string
  aktifAbonelikId?: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  eposta: string
  sifre: string
  beniHatirla?: boolean
}

export interface RegisterData {
  ad: string
  soyad: string
  eposta: string
  sifre: string
}

export interface ListeningStats {
  toplamSure: number
  tamamlananKitap: number
  enCokDinlenenKategori: string
}
