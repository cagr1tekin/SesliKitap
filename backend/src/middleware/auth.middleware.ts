import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: number
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Yetkilendirme gerekli' })
    return
  }

  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'dev-secret') as { userId: number }
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Geçersiz veya süresi dolmuş token' })
  }
}
