
import { Router } from 'express'
import { register, login, me, updateProfile, sendOTP, verifyOTP } from '../controllers/auth.js'
import { requireAuth, authLimiter } from '../middleware/auth.js'

const r = Router()

r.post('/register', authLimiter, register)
r.post('/login', authLimiter, login)
r.post('/send-otp', authLimiter, sendOTP)
r.post('/verify-otp', authLimiter, verifyOTP)

r.get('/me', requireAuth, me)
r.put('/me', requireAuth, updateProfile)

export default r
