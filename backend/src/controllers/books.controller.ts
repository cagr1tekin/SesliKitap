import type { Response } from 'express'
import { z } from 'zod'
import { getPool, sql } from '../db/connection.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'

export async function getBooks(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { arama, kategoriId, yazarId, siralama = 'enYeni', limit = 20 } = req.query

    const pool = await getPool()
    const request = pool.request()

    let orderBy = 'k.yayinTarihi DESC'
    if (siralama === 'enYuksekPuanli') orderBy = 'ortalamaPuan DESC'
    if (siralama === 'ucret') orderBy = 'k.ucret ASC'

    let where = 'WHERE 1=1'
    if (arama) {
      request.input('arama', sql.NVarChar, `%${arama}%`)
      where += ' AND (k.baslik LIKE @arama OR k.isbn LIKE @arama OR (y.ad + \' \' + y.soyad) LIKE @arama)'
    }
    if (kategoriId) {
      request.input('kategoriId', sql.Int, Number(kategoriId))
      where += ' AND k.kategoriID = @kategoriId'
    }
    if (yazarId) {
      request.input('yazarId', sql.Int, Number(yazarId))
      where += ' AND k.yazarID = @yazarId'
    }
    request.input('limit', sql.Int, Number(limit))

    const result = await request.query(`
      SELECT TOP (@limit)
        k.kitapID, k.baslik, k.isbn, k.sure, k.dil, k.yayinTarihi, k.ucret,
        y.yazarID, y.ad AS yazarAd, y.soyad AS yazarSoyad, y.biyografi, y.uyruk,
        kat.kategoriID, kat.kategoriAdi, kat.aciklama,
        ISNULL((SELECT AVG(CAST(d.puan AS DECIMAL(3,2))) FROM Degerlendirme d WHERE d.kitapID = k.kitapID), 0) AS ortalamaPuan,
        ISNULL((SELECT COUNT(*) FROM Degerlendirme d WHERE d.kitapID = k.kitapID), 0) AS degerlendirmeSayisi
      FROM Kitap k
      JOIN Yazar y ON k.yazarID = y.yazarID
      JOIN Kategori kat ON k.kategoriID = kat.kategoriID
      ${where}
      ORDER BY ${orderBy}
    `)

    const rows = result.recordset as Array<Record<string, unknown>>
    res.json({
      data: rows.map(mapKitap),
      nextCursor: null,
      hasMore: false,
      total: rows.length,
    })
  } catch (error) {
    console.error('getBooks hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function getBookById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, Number(req.params['id']))
      .query(`
        SELECT
          k.kitapID, k.baslik, k.isbn, k.sure, k.dil, k.yayinTarihi, k.ucret,
          y.yazarID, y.ad AS yazarAd, y.soyad AS yazarSoyad, y.biyografi, y.uyruk,
          kat.kategoriID, kat.kategoriAdi, kat.aciklama,
          ISNULL((SELECT AVG(CAST(d.puan AS DECIMAL(3,2))) FROM Degerlendirme d WHERE d.kitapID = k.kitapID), 0) AS ortalamaPuan,
          ISNULL((SELECT COUNT(*) FROM Degerlendirme d WHERE d.kitapID = k.kitapID), 0) AS degerlendirmeSayisi
        FROM Kitap k
        JOIN Yazar y ON k.yazarID = y.yazarID
        JOIN Kategori kat ON k.kategoriID = kat.kategoriID
        WHERE k.kitapID = @id
      `)

    if (!result.recordset.length) {
      res.status(404).json({ success: false, message: 'Kitap bulunamadı' })
      return
    }

    res.json({ success: true, data: mapKitap(result.recordset[0] as Record<string, unknown>) })
  } catch (error) {
    console.error('getBookById hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function getHistory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT
          dg.gecmisID, dg.kalinanSaniye, dg.dinlemeTarihi, dg.tamamlandiMi,
          k.kitapID, k.baslik, k.sure, k.ucret,
          y.yazarID, y.ad AS yazarAd, y.soyad AS yazarSoyad, y.biyografi, y.uyruk,
          kat.kategoriID, kat.kategoriAdi, kat.aciklama,
          ISNULL((SELECT AVG(CAST(d.puan AS DECIMAL(3,2))) FROM Degerlendirme d WHERE d.kitapID = k.kitapID), 0) AS ortalamaPuan,
          ISNULL((SELECT COUNT(*) FROM Degerlendirme d WHERE d.kitapID = k.kitapID), 0) AS degerlendirmeSayisi
        FROM DinlemeGecmisi dg
        JOIN Kitap k ON dg.kitapID = k.kitapID
        JOIN Yazar y ON k.yazarID = y.yazarID
        JOIN Kategori kat ON k.kategoriID = kat.kategoriID
        WHERE dg.kullaniciID = @userId
        ORDER BY dg.dinlemeTarihi DESC
      `)

    const rows = result.recordset as Array<Record<string, unknown>>
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: r['gecmisID'],
        kalinanSaniye: r['kalinanSaniye'],
        dinlemeTarihi: r['dinlemeTarihi'],
        tamamlandiMi: r['tamamlandiMi'],
        kitap: mapKitap(r),
      })),
    })
  } catch (error) {
    console.error('getHistory hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function getFavorites(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT
          k.kitapID, k.baslik, k.sure, k.ucret,
          y.yazarID, y.ad AS yazarAd, y.soyad AS yazarSoyad, y.biyografi, y.uyruk,
          kat.kategoriID, kat.kategoriAdi, kat.aciklama,
          ISNULL((SELECT AVG(CAST(d.puan AS DECIMAL(3,2))) FROM Degerlendirme d WHERE d.kitapID = k.kitapID), 0) AS ortalamaPuan,
          ISNULL((SELECT COUNT(*) FROM Degerlendirme d WHERE d.kitapID = k.kitapID), 0) AS degerlendirmeSayisi
        FROM Favori f
        JOIN Kitap k ON f.kitapID = k.kitapID
        JOIN Yazar y ON k.yazarID = y.yazarID
        JOIN Kategori kat ON k.kategoriID = kat.kategoriID
        WHERE f.kullaniciID = @userId
      `)
    res.json({ success: true, data: (result.recordset as Array<Record<string, unknown>>).map(mapKitap) })
  } catch (error) {
    console.error('getFavorites hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function addFavorite(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .input('kitapId', sql.Int, Number(req.params['id']))
      .query('INSERT INTO Favori (kullaniciID, kitapID) VALUES (@userId, @kitapId)')
    res.json({ success: true, data: null })
  } catch (error) {
    console.error('addFavorite hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function removeFavorite(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .input('kitapId', sql.Int, Number(req.params['id']))
      .query('DELETE FROM Favori WHERE kullaniciID = @userId AND kitapID = @kitapId')
    res.json({ success: true, data: null })
  } catch (error) {
    console.error('removeFavorite hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function getReviews(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('kitapId', sql.Int, Number(req.params['id']))
      .query(`
        SELECT d.degerlendirmeID, d.puan, d.yorum, d.tarih,
               k.kullaniciID, k.ad
        FROM Degerlendirme d
        JOIN Kullanici k ON d.kullaniciID = k.kullaniciID
        WHERE d.kitapID = @kitapId
        ORDER BY d.tarih DESC
      `)

    const rows = result.recordset as Array<Record<string, unknown>>
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: r['degerlendirmeID'],
        puan: r['puan'],
        yorum: r['yorum'],
        tarih: r['tarih'],
        kullanici: { id: r['kullaniciID'], ad: r['ad'] },
      })),
    })
  } catch (error) {
    console.error('getReviews hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function addReview(req: AuthRequest, res: Response): Promise<void> {
  const schema = z.object({ puan: z.number().min(1).max(5), yorum: z.string().optional() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Geçersiz istek' })
    return
  }

  try {
    const pool = await getPool()
    await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .input('kitapId', sql.Int, Number(req.params['id']))
      .input('puan', sql.Int, parsed.data.puan)
      .input('yorum', sql.NVarChar, parsed.data.yorum ?? null)
      .query('INSERT INTO Degerlendirme (kullaniciID, kitapID, puan, yorum) VALUES (@userId, @kitapId, @puan, @yorum)')
    res.status(201).json({ success: true, data: null })
  } catch (error) {
    console.error('addReview hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function saveProgress(req: AuthRequest, res: Response): Promise<void> {
  const { kalinanSaniye } = req.body as { kalinanSaniye: number }
  try {
    const pool = await getPool()
    await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .input('kitapId', sql.Int, Number(req.params['id']))
      .input('kalinanSaniye', sql.Int, kalinanSaniye)
      .query(`
        MERGE DinlemeGecmisi AS target
        USING (VALUES (@userId, @kitapId, @kalinanSaniye)) AS src (kullaniciID, kitapID, kalinanSaniye)
        ON target.kullaniciID = src.kullaniciID AND target.kitapID = src.kitapID
        WHEN MATCHED THEN UPDATE SET kalinanSaniye = src.kalinanSaniye, dinlemeTarihi = GETDATE()
        WHEN NOT MATCHED THEN INSERT (kullaniciID, kitapID, kalinanSaniye) VALUES (src.kullaniciID, src.kitapID, src.kalinanSaniye);
      `)
    res.json({ success: true, data: null })
  } catch (error) {
    console.error('saveProgress hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

function mapKitap(r: Record<string, unknown>) {
  return {
    id: r['kitapID'],
    baslik: r['baslik'],
    isbn: r['isbn'],
    sure: r['sure'],
    dil: r['dil'],
    yayinTarihi: r['yayinTarihi'],
    ucret: r['ucret'],
    ortalamaPuan: r['ortalamaPuan'],
    degerlendirmeSayisi: r['degerlendirmeSayisi'],
    yazar: { id: r['yazarID'], ad: r['yazarAd'], soyad: r['yazarSoyad'], biyografi: r['biyografi'], uyruk: r['uyruk'] },
    kategori: { id: r['kategoriID'], kategoriAdi: r['kategoriAdi'], aciklama: r['aciklama'] },
  }
}
