export type KategoriAdi =
  | 'Roman'
  | 'Kişisel Gelişim'
  | 'Tarih'
  | 'Bilim'
  | 'Çocuk'
  | 'Felsefe'
  | 'Ekonomi'
  | 'Psikoloji'
  | 'Fantastik'
  | 'Sağlık'

export interface Kategori {
  id: number
  kategoriAdi: string
  aciklama?: string
}

export interface Yazar {
  id: number
  ad: string
  soyad: string
  biyografi?: string
  uyruk?: string
}

export interface Kitap {
  id: number
  baslik: string
  isbn?: string
  sure: number
  dil?: string
  yayinTarihi?: string
  ucret: number
  ortalamaPuan: number
  degerlendirmeSayisi: number
  kategori: Kategori
  yazar: Yazar
}

export interface KitapListParams {
  cursor?: string
  limit?: number
  kategoriId?: number
  yazarId?: number
  arama?: string
  siralama?: 'enYeni' | 'enCokDinlenen' | 'enYuksekPuanli' | 'ucret'
}

export interface DinlemeGecmisi {
  id: number
  kitap: Kitap
  kalinanSaniye: number
  dinlemeTarihi: string
  tamamlandiMi: boolean
}

export interface Degerlendirme {
  id: number
  kullanici: {
    id: number
    ad: string
  }
  kitapId: number
  puan: number
  yorum?: string
  tarih: string
}
