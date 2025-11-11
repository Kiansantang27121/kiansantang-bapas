# 🆓 Panduan Cloud Gratis - Railway + Vercel

## 🎯 Deploy KIANSANTANG 100% GRATIS dalam 1 Jam

### Platform:
- **Railway.app**: Backend (Gratis $5 credit/bulan)
- **Vercel.com**: Frontend (Gratis unlimited)
- **Total Biaya**: $0 🆓

---

## ⚡ Quick Start (1 Jam)

### Step 1: Persiapan GitHub (10 menit)

#### 1.1 Create GitHub Account
```
1. Kunjungi: https://github.com
2. Sign up (gratis)
3. Verify email
```

#### 1.2 Create Repository
```
1. Klik "+" → "New repository"
2. Repository name: kiansantang-bapas
3. Description: Sistem Antrian BAPAS Bandung
4. Public (gratis unlimited)
5. ✅ Create repository
```

#### 1.3 Upload Project
```powershell
# Buka PowerShell di folder project
cd D:\kiansantang\bapas-bandung

# Initialize git
git init
git add .
git commit -m "Initial commit - KIANSANTANG System"

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/kiansantang-bapas.git
git branch -M main
git push -u origin main
```

**Catatan**: Ganti `YOUR_USERNAME` dengan username GitHub Anda

---

### Step 2: Deploy Backend di Railway (15 menit)

#### 2.1 Create Railway Account
```
1. Kunjungi: https://railway.app
2. Klik "Login"
3. Pilih "Login with GitHub"
4. Authorize Railway
5. ✅ Otomatis dapat $5 credit!
```

#### 2.2 Create New Project
```
1. Dashboard → Klik "New Project"
2. Pilih "Deploy from GitHub repo"
3. Pilih repository: kiansantang-bapas
4. Railway akan scan project
```

#### 2.3 Configure Backend
```
1. Klik service yang dibuat
2. Settings → Root Directory:
   Ketik: backend
   
3. Settings → Build Command:
   npm install
   
4. Settings → Start Command:
   npm start
```

#### 2.4 Add Environment Variables
```
1. Variables tab
2. Add variables:

NODE_ENV=production
PORT=3000
JWT_SECRET=kiansantang-secret-key-2025-change-this

3. ✅ Save
```

#### 2.5 Generate Domain
```
1. Settings → Networking
2. Klik "Generate Domain"
3. Copy domain: 
   https://kiansantang-backend-production.up.railway.app
   
4. ✅ Backend online!
```

#### 2.6 Test Backend
```
Buka browser:
https://YOUR-BACKEND-URL.up.railway.app/api/health

Jika muncul: {"status":"ok"}
✅ Backend berhasil!
```

---

### Step 3: Deploy Frontend di Vercel (30 menit)

#### 3.1 Create Vercel Account
```
1. Kunjungi: https://vercel.com
2. Klik "Sign Up"
3. Pilih "Continue with GitHub"
4. Authorize Vercel
```

#### 3.2 Deploy Registration App
```
1. Dashboard → "Add New..." → "Project"
2. Import Git Repository
3. Pilih: kiansantang-bapas
4. Configure Project:

   Framework Preset: Vite
   Root Directory: registration-app
   Build Command: npm run build
   Output Directory: dist
   
5. Environment Variables → Add:
   Name: VITE_API_URL
   Value: https://YOUR-BACKEND-URL.up.railway.app/api
   
6. Klik "Deploy"
7. Tunggu build selesai (2-3 menit)
8. ✅ Copy URL: https://kiansantang-registration.vercel.app
```

#### 3.3 Deploy Operator App
```
1. Dashboard → "Add New..." → "Project"
2. Import: kiansantang-bapas
3. Configure:
   Root Directory: operator-app
   Framework: Vite
   Build: npm run build
   Output: dist
   
4. Environment Variables:
   VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app/api
   
5. Deploy!
6. URL: https://kiansantang-operator.vercel.app
```

#### 3.4 Deploy Display App
```
1. New Project
2. Import: kiansantang-bapas
3. Root Directory: display-app
4. Environment Variables:
   VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app/api
5. Deploy!
6. URL: https://kiansantang-display.vercel.app
```

#### 3.5 Deploy Petugas App
```
1. New Project
2. Import: kiansantang-bapas
3. Root Directory: petugas-app
4. Environment Variables:
   VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app/api
5. Deploy!
6. URL: https://kiansantang-petugas.vercel.app
```

---

### Step 4: Update CORS di Backend (5 menit)

#### 4.1 Edit di GitHub
```
1. Buka: https://github.com/YOUR_USERNAME/kiansantang-bapas
2. Navigate: backend/server.js
3. Klik icon pensil (Edit)
4. Cari bagian CORS
```

#### 4.2 Update CORS Configuration
```javascript
// Update CORS origin
app.use(cors({
  origin: [
    'https://kiansantang-registration.vercel.app',
    'https://kiansantang-operator.vercel.app',
    'https://kiansantang-display.vercel.app',
    'https://kiansantang-petugas.vercel.app'
  ],
  credentials: true
}));
```

**Catatan**: Ganti dengan URL Vercel Anda yang sebenarnya

#### 4.3 Commit Changes
```
1. Scroll ke bawah
2. Commit message: "Update CORS for Vercel deployment"
3. Klik "Commit changes"
4. ✅ Railway akan auto-deploy!
```

---

### Step 5: Test Aplikasi (5 menit)

#### 5.1 Test Backend
```
https://YOUR-BACKEND-URL.up.railway.app/api/health
✅ Harus muncul: {"status":"ok"}
```

#### 5.2 Test Registration
```
1. Buka: https://kiansantang-registration.vercel.app
2. Pilih layanan
3. Isi form
4. Klik "Daftar"
5. ✅ Harus berhasil buat antrian
```

#### 5.3 Test Operator
```
1. Buka: https://kiansantang-operator.vercel.app
2. Login: operator / operator123
3. ✅ Dashboard muncul
4. ✅ Antrian terlihat
```

#### 5.4 Test Display
```
1. Buka: https://kiansantang-display.vercel.app
2. ✅ Display antrian muncul
3. ✅ Real-time update works
```

#### 5.5 Test Petugas
```
1. Buka: https://kiansantang-petugas.vercel.app
2. Login: petugas / petugas123
3. ✅ Dashboard muncul
```

---

## 🎉 Selesai! Aplikasi Online!

### URLs Anda:
```
Backend:      https://YOUR-APP.up.railway.app
Registration: https://YOUR-APP-registration.vercel.app
Operator:     https://YOUR-APP-operator.vercel.app
Display:      https://YOUR-APP-display.vercel.app
Petugas:      https://YOUR-APP-petugas.vercel.app
```

### Login Default:
```
Admin:
- Username: admin
- Password: admin123

Operator:
- Username: operator
- Password: operator123

Petugas Layanan:
- Username: petugas
- Password: petugas123

PK Madya:
- Username: pk_madya
- Password: pk123
```

---

## 🔧 Maintenance & Update

### Update Aplikasi:
```bash
# Edit code di PC lokal
# Lalu push ke GitHub:

git add .
git commit -m "Update feature"
git push

# ✅ Railway & Vercel auto-deploy!
```

### View Logs:

**Railway (Backend):**
```
1. Dashboard → Pilih project
2. Tab "Deployments"
3. Klik deployment terbaru
4. View logs
```

**Vercel (Frontend):**
```
1. Dashboard → Pilih project
2. Tab "Deployments"
3. Klik deployment terbaru
4. View Function Logs
```

### Monitoring:

**Railway:**
```
Dashboard → Metrics
- CPU usage
- Memory usage
- Network traffic
```

**Vercel:**
```
Dashboard → Analytics
- Page views
- Visitors
- Performance
```

---

## 💰 Biaya & Limits

### Railway (Backend):
```
✅ $5 credit/bulan (GRATIS)
✅ Cukup untuk:
   - ~500 jam runtime
   - 100GB bandwidth
   - 1GB RAM
   - 1GB storage

Estimasi untuk BAPAS:
- Usage: ~200 jam/bulan
- Bandwidth: ~10GB/bulan
- ✅ Masih dalam limit gratis!
```

### Vercel (Frontend):
```
✅ Unlimited (GRATIS)
✅ 100GB bandwidth/bulan
✅ Unlimited builds
✅ Unlimited deployments

Estimasi untuk BAPAS:
- Bandwidth: ~5GB/bulan
- ✅ Sangat cukup!
```

### Total Biaya:
```
Railway: $0 ($5 credit gratis)
Vercel: $0 (unlimited gratis)
Domain: $0 (subdomain gratis)
SSL: $0 (otomatis)

TOTAL: $0/bulan 🆓
```

---

## 🌐 Custom Domain (Optional)

### Setup Custom Domain di Railway:

#### 1. Add Domain
```
1. Railway Dashboard → Settings → Networking
2. Custom Domains → Add Domain
3. Masukkan: api.kiansantang.bapas-bandung.go.id
```

#### 2. Configure DNS
```
Di DNS Management (Cloudflare/cPanel):

Type: CNAME
Name: api
Value: YOUR-APP.up.railway.app
TTL: Auto

✅ Save
```

#### 3. Wait & Verify
```
Tunggu 5-30 menit untuk DNS propagation
Railway akan auto-generate SSL
✅ Domain ready!
```

### Setup Custom Domain di Vercel:

#### 1. Add Domain
```
1. Vercel Dashboard → Settings → Domains
2. Add Domain
3. Masukkan: registrasi.kiansantang.bapas-bandung.go.id
```

#### 2. Configure DNS
```
Type: CNAME
Name: registrasi
Value: cname.vercel-dns.com
TTL: Auto

✅ Save
```

#### 3. Verify
```
Vercel akan auto-verify dan generate SSL
✅ Domain ready!
```

---

## 🔍 Troubleshooting

### Issue 1: Railway Build Failed

**Gejala**: Build error di Railway

**Solusi**:
```
1. Check logs di Railway Dashboard
2. Pastikan package.json ada di folder backend
3. Pastikan Root Directory = backend
4. Pastikan Start Command = npm start
5. Redeploy
```

### Issue 2: Vercel Build Failed

**Gejala**: Build error di Vercel

**Solusi**:
```
1. Check build logs
2. Pastikan Root Directory benar
3. Pastikan Build Command = npm run build
4. Pastikan Output Directory = dist
5. Check environment variables
6. Redeploy
```

### Issue 3: CORS Error

**Gejala**: Frontend tidak bisa connect ke backend

**Solusi**:
```
1. Check CORS configuration di backend/server.js
2. Pastikan Vercel URLs ada di origin array
3. Commit & push ke GitHub
4. Wait for Railway auto-deploy
5. Test lagi
```

### Issue 4: 404 Not Found

**Gejala**: Page not found di Vercel

**Solusi**:
```
1. Check vercel.json di root project
2. Tambahkan rewrites untuk SPA:

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

3. Commit & push
4. Vercel auto-deploy
```

### Issue 5: Database Error

**Gejala**: Database connection error

**Solusi**:
```
1. Check database file ada di backend folder
2. Railway akan create database otomatis
3. Check environment variables
4. Restart deployment
```

---

## 📊 Monitoring & Analytics

### Railway Metrics:
```
Dashboard → Metrics

Monitor:
- CPU usage (should be < 50%)
- Memory usage (should be < 500MB)
- Network traffic
- Request count
```

### Vercel Analytics:
```
Dashboard → Analytics

Monitor:
- Page views
- Unique visitors
- Top pages
- Performance scores
```

### Set Alerts:
```
Railway:
1. Settings → Notifications
2. Add email for alerts
3. Set thresholds

Vercel:
1. Settings → Notifications
2. Enable deployment notifications
```

---

## 🚀 Optimization Tips

### Backend (Railway):

```javascript
// 1. Enable compression
const compression = require('compression');
app.use(compression());

// 2. Cache static files
app.use(express.static('public', {
  maxAge: '1d'
}));

// 3. Limit request size
app.use(express.json({ limit: '1mb' }));
```

### Frontend (Vercel):

```javascript
// 1. Code splitting
// Vite does this automatically

// 2. Lazy loading
const Component = lazy(() => import('./Component'));

// 3. Image optimization
// Use WebP format
// Compress images before upload
```

---

## ✅ Checklist Deploy

### Pre-Deploy:
- [ ] GitHub account created
- [ ] Repository created
- [ ] Code pushed to GitHub

### Railway (Backend):
- [ ] Account created ($5 credit)
- [ ] Project created
- [ ] Root directory set (backend)
- [ ] Environment variables added
- [ ] Domain generated
- [ ] Deployment successful
- [ ] API health check OK

### Vercel (Frontend):
- [ ] Account created
- [ ] Registration app deployed
- [ ] Operator app deployed
- [ ] Display app deployed
- [ ] Petugas app deployed
- [ ] Environment variables set
- [ ] All deployments successful

### Configuration:
- [ ] CORS updated
- [ ] All URLs working
- [ ] Login working
- [ ] Create queue working
- [ ] Real-time updates working

### Production:
- [ ] Custom domain (optional)
- [ ] SSL working
- [ ] Monitoring setup
- [ ] **LIVE!** 🎉

---

## 🎯 Summary

**Deploy KIANSANTANG ke cloud gratis berhasil!**

✅ **Platform**: Railway + Vercel
✅ **Biaya**: $0 (100% GRATIS)
✅ **Waktu**: 1 jam
✅ **SSL**: Otomatis (HTTPS)
✅ **Auto Deploy**: Ya (dari GitHub)
✅ **Monitoring**: Dashboard gratis
✅ **Scalable**: Ya
✅ **Professional**: Ya

**URLs:**
```
Backend:      https://YOUR-APP.up.railway.app
Registration: https://YOUR-APP.vercel.app
Operator:     https://YOUR-APP.vercel.app
Display:      https://YOUR-APP.vercel.app
Petugas:      https://YOUR-APP.vercel.app
```

**Maintenance:**
```
Update: git push → auto-deploy
Logs: Dashboard Railway & Vercel
Monitor: Real-time metrics
Backup: GitHub (source code)
```

**Sistem KIANSANTANG online 100% GRATIS!** 🚀🆓🎉
