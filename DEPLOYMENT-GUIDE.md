# 🚀 KIANSANTANG Deployment Guide

## 📋 Overview

Deploy KIANSANTANG system menggunakan:
- **Railway.app** untuk Backend (Gratis $5/bulan)
- **Vercel** untuk Frontend Apps (Gratis unlimited)

**Total Biaya: Rp 0 / GRATIS!** 🎉

---

## 🎯 Quick Start

### Prerequisites
- ✅ GitHub account
- ✅ Repository sudah di-push ke GitHub
- ✅ Railway account (sign up gratis)
- ✅ Vercel account (sign up gratis)

---

## 📦 PART 1: Deploy Backend di Railway

### Step 1: Create Railway Account
1. Buka: https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway
4. ✅ Dapat $5 credit gratis otomatis!

### Step 2: Deploy Backend
1. Railway Dashboard → "New Project"
2. "Deploy from GitHub repo"
3. Pilih: `kiansantang-bapas`
4. Railway akan auto-detect dan deploy!

### Step 3: Configure Environment Variables
Di Railway Project → Variables, tambahkan:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=kiansantang-bapas-secret-2024-change-this-to-random-string
```

⚠️ **Penting**: Ganti `JWT_SECRET` dengan string random yang aman!

### Step 4: Generate Domain
1. Railway Project → Settings → Networking
2. Click "Generate Domain"
3. Copy URL (contoh: `kiansantang-backend.up.railway.app`)
4. ✅ Backend online!

**Test Backend:**
```
https://[your-railway-domain].up.railway.app/api/health
```
Harus return: `{"status":"ok"}`

---

## 🌐 PART 2: Deploy Frontend Apps di Vercel

### Step 1: Create Vercel Account
1. Buka: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel
4. ✅ Akun siap!

### Step 2: Deploy Registration App
1. Vercel Dashboard → "Add New..." → "Project"
2. Import repository: `kiansantang-bapas`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `registration-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Environment Variables:
   ```
   VITE_API_URL=https://[railway-domain].up.railway.app/api
   ```
   ⚠️ Ganti `[railway-domain]` dengan domain Railway Anda!
5. Click "Deploy"
6. ✅ Copy URL Vercel

### Step 3: Deploy Operator App
Ulangi langkah yang sama dengan:
- **Root Directory**: `operator-app`
- **Environment Variables**: `VITE_API_URL=https://[railway-domain].up.railway.app/api`

### Step 4: Deploy Display App
- **Root Directory**: `display-app`
- **Environment Variables**: `VITE_API_URL=https://[railway-domain].up.railway.app/api`

### Step 5: Deploy Petugas App
- **Root Directory**: `petugas-app`
- **Environment Variables**: `VITE_API_URL=https://[railway-domain].up.railway.app/api`

---

## ⚙️ PART 3: Finalisasi

### Update CORS di Backend

Edit file `backend/server.js` di GitHub (sekitar baris 42):

```javascript
app.use(cors({
  origin: [
    'https://[registration-app].vercel.app',
    'https://[operator-app].vercel.app',
    'https://[display-app].vercel.app',
    'https://[petugas-app].vercel.app'
  ],
  credentials: true
}));
```

⚠️ Ganti `[app-name]` dengan nama Vercel apps Anda!

Setelah commit & push, Railway akan auto-deploy ulang!

---

## ✅ Testing

### Test Semua URL:
- [ ] Backend API: `https://[railway].up.railway.app/api/health`
- [ ] Registration: `https://[app].vercel.app`
- [ ] Operator: `https://[app].vercel.app`
- [ ] Display: `https://[app].vercel.app`
- [ ] Petugas: `https://[app].vercel.app`

### Test Fitur:
- [ ] Login admin/petugas
- [ ] Buat antrian baru
- [ ] Panggil antrian
- [ ] Display real-time update
- [ ] Socket.IO connection

---

## 📊 Deployment URLs

Setelah deploy, simpan semua URL di sini:

```
Backend (Railway):
https://_____________________________.up.railway.app

Registration App (Vercel):
https://_____________________________.vercel.app

Operator App (Vercel):
https://_____________________________.vercel.app

Display App (Vercel):
https://_____________________________.vercel.app

Petugas App (Vercel):
https://_____________________________.vercel.app
```

---

## 🔧 Maintenance

### Auto Deploy
✅ Push ke GitHub → Auto deploy ke Railway & Vercel
✅ Tidak perlu SSH ke server
✅ Tidak perlu manual restart

### Monitoring
✅ Railway Dashboard: Logs + Metrics
✅ Vercel Analytics: Traffic stats
✅ Gratis!

### Backup
✅ GitHub: Source code backup
✅ Railway: Database backup otomatis
✅ Download database manual (jika perlu)

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Railway | $5 credit/month | **FREE** |
| Vercel | Hobby (unlimited) | **FREE** |
| SSL | Auto (Let's Encrypt) | **FREE** |
| Domain | .up.railway.app & .vercel.app | **FREE** |
| **TOTAL** | | **Rp 0 / FREE!** 🎉 |

---

## 🆘 Troubleshooting

### Backend tidak bisa diakses
- Check Railway logs
- Pastikan PORT=3000 di environment variables
- Pastikan domain sudah di-generate

### Frontend tidak connect ke backend
- Check VITE_API_URL di Vercel environment variables
- Pastikan CORS sudah di-update di backend
- Check browser console untuk error

### Socket.IO tidak connect
- Pastikan backend domain benar
- Check CORS configuration
- Pastikan Railway tidak sleep (dengan $5 credit tidak akan sleep)

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [DEPLOY-RAILWAY-VERCEL.html](./DEPLOY-RAILWAY-VERCEL.html) - Panduan visual lengkap

---

## 🎉 Success!

Setelah semua langkah selesai:
- ✅ Backend online 24/7
- ✅ Frontend accessible dari mana saja
- ✅ Auto-deploy dari GitHub
- ✅ SSL otomatis
- ✅ Monitoring gratis
- ✅ **100% GRATIS!**

**KIANSANTANG sudah LIVE!** 🚀
