export type AbonelikDurum = 'Aktif' | 'Pasif' | 'İptal'

export interface AbonelikPlani {
  id: number
  planAdi: string
  aylikUcret: number
  aylikKitapLimiti: number | null
  indirilebilirMi: boolean
}

export interface Abonelik {
  id: number
  planID: number
  plan: AbonelikPlani
  baslangicTarihi: string
  bitisTarihi: string
  durum: AbonelikDurum
}

export interface OdemeData {
  planId: number
  baslangicTarihi: string
  bitisTarihi: string
}
