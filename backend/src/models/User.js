
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: 'user' },
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '' },

  // OTP for email flows
  otpCode:  { type: String, default: null },
  otpExp:   { type: Date,   default: null },
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
