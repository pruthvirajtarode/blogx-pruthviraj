
# BlogX+ — Fix Patch (OTP enabled)

This patch contains **only the files that need replacing** plus a README.
Use it if your repo already has the full project.

## What this patch fixes
- ✅ Correct API base URL usage in frontend
- ✅ Removes double `/api` (frontend uses `/auth/...`)
- ✅ Production CORS for Vercel + localhost
- ✅ OTP email flow kept (requires SMTP env)
- ✅ Adds `otpCode` & `otpExp` to `User` model
- ✅ Rate limiting on auth routes
- ✅ Ensures server binds to `0.0.0.0` for Render

## Replace these files in your project

```
backend/src/server.js
backend/src/routes/auth.js
backend/src/controllers/auth.js
backend/src/middleware/auth.js
backend/src/utils/mailer.js
backend/src/models/User.js

frontend/.env
frontend/src/lib/axios.js
frontend/src/context/AuthContext.jsx
```

## Delete (if it exists)
```
frontend/public/vercel.json
```
(Any `vercel.json` inside `public` breaks SPA routing and causes 404s.)

## Required environment variables

### Render (backend)

Set **Environment → Variables**:

```
MONGO_URI=YOUR_MONGODB_URL
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d

# Allowed origins (comma separated)
ORIGIN=https://blogx-pruthviraj.vercel.app,http://localhost:5173

# SMTP for OTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youraddress@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="BlogX+ OTP" <youraddress@gmail.com>
```

### Vercel (frontend)
```
VITE_API_URL=https://blogx-pruthviraj.onrender.com/api
```

## Commands

```powershell
# From repo root
git pull
# replace the files with the ones from this patch
# (copy each file into its matching path)
git add .
git commit -m "Fix: API routing, CORS, OTP model + mailer, SPA 404"
git push

# Render: Manual Deploy → Deploy latest commit
# Vercel: Deploy with 'Clear Build Cache' checked
```

## Quick test
- Open: https://blogx-pruthviraj.onrender.com/ → should show `{ ok: true, service: 'BlogX API +' }`
- Open DevTools → Network on the Vercel app
- Register → you should see `POST https://blogx-pruthviraj.onrender.com/api/auth/register` returning **201** (or 400 if email exists)
