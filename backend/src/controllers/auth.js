
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { sendMail } from '../utils/mailer.js'

export async function register(req,res){
  try{
    const { username, email, password } = req.body
    if(!username || !email || !password) return res.status(400).json({message:'All fields required'})
    const exists = await User.findOne({ email })
    if(exists) return res.status(400).json({message:'Email already registered'})
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, password: hash })
    return res.status(201).json({ id:user._id, username:user.username, email:user.email })
  }catch(err){
    console.error('register error', err)
    return res.status(500).json({message:'Server error'})
  }
}

export async function login(req,res){
  try{
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if(!user) return res.status(401).json({message:'Invalid credentials'})
    const ok = await bcrypt.compare(password, user.password)
    if(!ok) return res.status(401).json({message:'Invalid credentials'})
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
    return res.json({ token, user: { id: user._id.toString(), username: user.username, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio } })
  }catch(err){
    console.error('login error', err)
    return res.status(500).json({message:'Server error'})
  }
}

export async function me(req,res){
  const user = await User.findById(req.user.id).select('username email role avatar bio')
  if(!user) return res.status(404).json({message:'Not found'})
  res.json({ id:user._id, username:user.username, email:user.email, role:user.role, avatar:user.avatar, bio:user.bio })
}

export async function updateProfile(req,res){
  const { username, avatar, bio } = req.body
  const user = await User.findByIdAndUpdate(req.user.id, { username, avatar, bio }, { new: true })
  res.json({ id:user._id, username:user.username, email:user.email, role:user.role, avatar:user.avatar, bio:user.bio })
}

// OTP helpers
function genOTP(){ return Math.floor(100000 + Math.random()*900000).toString() }

export async function sendOTP(req,res){
  const { email } = req.body
  const u = await User.findOne({ email })
  if(!u) return res.status(404).json({message:'No account'})
  const code = genOTP()
  u.otpCode = code
  u.otpExp  = new Date(Date.now()+10*60*1000)
  await u.save()
  try{
    await sendMail({ to: email, subject: 'Your BlogX OTP', html: `<h2>${code}</h2><p>Valid for 10 minutes.</p>` })
  }catch(e){
    console.error('sendMail failed', e)
  }
  res.json({ ok:true, message:'OTP sent if email exists' })
}

export async function verifyOTP(req,res){
  const { email, code } = req.body
  const u = await User.findOne({ email })
  if(!u || !u.otpCode || !u.otpExp) return res.status(400).json({message:'Invalid'})
  if(u.otpCode!==code || u.otpExp < new Date()) return res.status(400).json({message:'Expired/Invalid'})
  u.otpCode=null; u.otpExp=null; await u.save()
  res.json({ ok:true })
}
