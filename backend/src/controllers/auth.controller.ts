import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { getPool, sql } from '../db/connection.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret'

function signTokens(userId: number) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken }
}

const loginSchema = z.object({
  eposta: z.string().email(),
  sifre: z.string().min(6),
})

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Geçersiz istek' })
    return
  }

  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('eposta', sql.NVarChar, parsed.data.eposta)
      .query('SELECT kullaniciID, ad, soyad, eposta, sifre FROM Kullanici WHERE eposta = @eposta')

    const user = result.recordset[0] as { kullaniciID: number; sifre: string; ad: string; soyad: string; eposta: string } | undefined
    if (!user || !(await bcrypt.compare(parsed.data.sifre, user.sifre))) {
      res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı' })
      return
    }

    const tokens = signTokens(user.kullaniciID)
    res.json({
      success: true,
      data: {
        ...tokens,
        user: { id: user.kullaniciID, ad: user.ad, soyad: user.soyad, eposta: user.eposta },
      },
    })
  } catch (error) {
    console.error('Login hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

const registerSchema = z.object({
  ad: z.string().min(2),
  soyad: z.string().min(2),
  eposta: z.string().email(),
  sifre: z.string().min(8),
})

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Geçersiz istek' })
    return
  }

  try {
    const pool = await getPool()
    const existing = await pool
      .request()
      .input('eposta', sql.NVarChar, parsed.data.eposta)
      .query('SELECT kullaniciID FROM Kullanici WHERE eposta = @eposta')

    if (existing.recordset.length > 0) {
      res.status(409).json({ success: false, message: 'Bu e-posta zaten kayıtlı' })
      return
    }

    const sifreHash = await bcrypt.hash(parsed.data.sifre, 12)
    const result = await pool
      .request()
      .input('ad', sql.NVarChar, parsed.data.ad)
      .input('soyad', sql.NVarChar, parsed.data.soyad)
      .input('eposta', sql.NVarChar, parsed.data.eposta)
      .input('sifreHash', sql.NVarChar, sifreHash)
      .query(
        'INSERT INTO Kullanici (ad, soyad, eposta, sifre, durum) OUTPUT INSERTED.kullaniciID VALUES (@ad, @soyad, @eposta, @sifreHash, N\'Aktif\')',
      )

    const userId = result.recordset[0].kullaniciID as number
    const tokens = signTokens(userId)
    res.status(201).json({
      success: true,
      data: {
        ...tokens,
        user: { id: userId, ad: parsed.data.ad, soyad: parsed.data.soyad, eposta: parsed.data.eposta },
      },
    })
  } catch (error) {
    console.error('Register hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { refreshToken: token } = req.body as { refreshToken: string }
  if (!token) {
    res.status(400).json({ success: false, message: 'Refresh token gerekli' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: number }
    const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' })
    res.json({ success: true, data: { accessToken } })
  } catch {
    res.status(401).json({ success: false, message: 'Geçersiz refresh token' })
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, req.userId)
      .query('SELECT kullaniciID, ad, soyad, eposta, kayitTarihi FROM Kullanici WHERE kullaniciID = @id')

    const user = result.recordset[0] as { kullaniciID: number; ad: string; soyad: string; eposta: string; kayitTarihi: string } | undefined
    if (!user) {
      res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' })
      return
    }

    res.json({ success: true, data: { id: user.kullaniciID, ad: user.ad, soyad: user.soyad, eposta: user.eposta, kayitTarihi: user.kayitTarihi } })
  } catch (error) {
    console.error('Me hatası:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}
