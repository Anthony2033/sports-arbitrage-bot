import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secret')
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
} 