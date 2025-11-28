
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './utils/db.js'
import authRoutes from './routes/auth.js'

// If you have other routes, keep these imports too:
// import postRoutes from './routes/posts.js'
// import commentRoutes from './routes/comments.js'
// import uploadRoutes from './routes/upload.js'
// import adminRoutes from './routes/admin.js'

const app = express()

// CORS: allow Vercel app + localhost dev (comma separated in ORIGIN)
const allow = (process.env.ORIGIN?.split(',') || []).map(s => s.trim()).filter(Boolean)
app.use(cors({
  origin: allow.length ? allow : ['http://localhost:5173'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization']
}))

app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))

app.get('/', (req,res)=> res.json({ ok:true, service:'BlogX API +' }))

// API routes
app.use('/api/auth', authRoutes)
// app.use('/api/posts', postRoutes)
// app.use('/api/comments', commentRoutes)
// app.use('/api/upload', uploadRoutes)
// app.use('/api/admin', adminRoutes)

const PORT = process.env.PORT || 4000
const HOST = '0.0.0.0' // important for Render

connectDB().then(()=>{
  app.listen(PORT, HOST, ()=> console.log(`✅ Server running on ${HOST}:${PORT}`))
})
