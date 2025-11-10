
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20, // generous but protective
  standardHeaders: true,
  legacyHeaders: false,
})

export function requireAuth(req,res,next){
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if(!token) return res.status(401).json({message:'No token'})
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.id }
    next()
  }catch(e){
    return res.status(401).json({message:'Invalid token'})
  }
}
