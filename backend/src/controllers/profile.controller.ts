import type { Response } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getPool, sql } from '../db/connection.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'

export async function getStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT
          ISNULL(SUM(dg.kalinanSaniye), 0) AS toplamSaniye,
          COUNT(CASE WHEN dg.tamamlandiMi = 1 THEN 1 END) AS tamamlananKitap,
          (
            SELECT TOP 1 kat.kategoriAdi
            FROM DinlemeGecmisi dg2
            JOIN Kitap k ON dg2.kitapID = k.kitapID
            JOIN Kategori kat ON k.kategoriID = kat.kategoriID
            WHERE dg2.kullaniciID = @userId
            GROUP BY kat.kategoriAdi
            ORDER BY COUNT(*) DESC
          ) AS enCokDinlenenKategori
        FROM DinlemeGecmisi dg
        WHERE dg.kullaniciID = @userId
      `)

    const r = result.recordset[0] as Record<string, unknown> | undefined
    res.json({
      success: true,
      data: {
        toplamSure: r?.['toplamSaniye'] ?? 0,
        tamamlananKitap: r?.['tamamlananKitap'] ?? 0,
        enCokDinlenenKategori: r?.['enCokDinlenenKategori'] ?? '-',
      },
    })
  } catch (error) {
    console.error('getStats hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const schema = z.object({ ad: z.string().min(2).optional(), soyad: z.string().min(2).optional() })
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
      .input('ad', sql.NVarChar, parsed.data.ad ?? null)
      .input('soyad', sql.NVarChar, parsed.data.soyad ?? null)
      .query(`
        UPDATE Kullanici SET
          ad = ISNULL(@ad, ad),
          soyad = ISNULL(@soyad, soyad)
        WHERE kullaniciID = @userId
      `)
    res.json({ success: true, data: null })
  } catch (error) {
    console.error('updateProfile hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function changePassword(req: AuthRequest, res: Response): Promise<void> {
  const schema = z.object({ mevcutSifre: z.string(), yeniSifre: z.string().min(8) })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Geçersiz istek' })
    return
  }

  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .query('SELECT sifre FROM Kullanici WHERE kullaniciID = @userId')

    const user = result.recordset[0] as { sifre: string } | undefined
    if (!user || !(await bcrypt.compare(parsed.data.mevcutSifre, user.sifre))) {
      res.status(401).json({ success: false, message: 'Mevcut şifre hatalı' })
      return
    }

    const yeniHash = await bcrypt.hash(parsed.data.yeniSifre, 12)
    await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .input('hash', sql.NVarChar, yeniHash)
      .query('UPDATE Kullanici SET sifre = @hash WHERE kullaniciID = @userId')

    res.json({ success: true, data: null })
  } catch (error) {
    console.error('changePassword hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}
