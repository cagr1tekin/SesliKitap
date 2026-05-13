import type { Response } from 'express'
import { getPool, sql } from '../db/connection.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'

export async function getPlans(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    const result = await pool.request().query('SELECT planID, planAdi, aylikUcret, aylikKitapLimiti, indirilebilirMi FROM AbonelikPlani ORDER BY aylikUcret')
    const rows = result.recordset as Array<Record<string, unknown>>
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: r['planID'],
        planAdi: r['planAdi'],
        aylikUcret: r['aylikUcret'],
        aylikKitapLimiti: r['aylikKitapLimiti'],
        indirilebilirMi: r['indirilebilirMi'],
      })),
    })
  } catch (error) {
    console.error('getPlans hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function getCurrentSubscription(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT a.abonelikID, a.planID, a.baslangicTarihi, a.bitisTarihi, a.durum,
               ap.planAdi, ap.aylikUcret, ap.aylikKitapLimiti, ap.indirilebilirMi
        FROM Abonelik a
        JOIN AbonelikPlani ap ON a.planID = ap.planID
        WHERE a.kullaniciID = @userId AND a.durum = N'Aktif'
      `)

    if (!result.recordset.length) {
      res.json({ success: true, data: null })
      return
    }

    const r = result.recordset[0] as Record<string, unknown>
    res.json({
      success: true,
      data: {
        id: r['abonelikID'],
        planID: r['planID'],
        baslangicTarihi: r['baslangicTarihi'],
        bitisTarihi: r['bitisTarihi'],
        durum: r['durum'],
        plan: {
          id: r['planID'],
          planAdi: r['planAdi'],
          aylikUcret: r['aylikUcret'],
          aylikKitapLimiti: r['aylikKitapLimiti'],
          indirilebilirMi: r['indirilebilirMi'],
        },
      },
    })
  } catch (error) {
    console.error('getCurrentSubscription hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function subscribe(req: AuthRequest, res: Response): Promise<void> {
  const { planId, baslangicTarihi, bitisTarihi } = req.body as { planId: number; baslangicTarihi: string; bitisTarihi: string }
  try {
    const pool = await getPool()
    await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .input('planId', sql.Int, planId)
      .input('baslangic', sql.Date, new Date(baslangicTarihi))
      .input('bitis', sql.Date, new Date(bitisTarihi))
      .query(`
        UPDATE Abonelik SET durum = N'Pasif' WHERE kullaniciID = @userId AND durum = N'Aktif';
        INSERT INTO Abonelik (kullaniciID, planID, baslangicTarihi, bitisTarihi, durum)
        VALUES (@userId, @planId, @baslangic, @bitis, N'Aktif')
      `)
    res.status(201).json({ success: true, data: null })
  } catch (error) {
    console.error('subscribe hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function cancelSubscription(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .query(`UPDATE Abonelik SET durum = N'İptal' WHERE kullaniciID = @userId AND durum = N'Aktif'`)
    res.json({ success: true, data: null })
  } catch (error) {
    console.error('cancelSubscription hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function changePlan(req: AuthRequest, res: Response): Promise<void> {
  const { planId } = req.body as { planId: number }
  try {
    const pool = await getPool()
    await pool
      .request()
      .input('userId', sql.Int, req.userId)
      .input('planId', sql.Int, planId)
      .query(`UPDATE Abonelik SET planID = @planId WHERE kullaniciID = @userId AND durum = N'Aktif'`)
    res.json({ success: true, data: null })
  } catch (error) {
    console.error('changePlan hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}
