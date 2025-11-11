# 🆓 Deploy KIANSANTANG GRATIS

## 🎯 Tujuan
Deploy sistem KIANSANTANG secara **GRATIS** menggunakan platform free tier.

---

## 🌟 Platform Gratis Terbaik

### Option 1: Railway.app (RECOMMENDED) ⭐
```
✅ Gratis $5 credit/bulan (cukup untuk 1 project)
✅ Deploy otomatis dari GitHub
✅ Database included
✅ Custom domain gratis
✅ SSL otomatis
✅ Unlimited bandwidth

Cocok untuk: Production-ready
```

### Option 2: Render.com
```
✅ Gratis untuk static sites
✅ Backend gratis (750 jam/bulan)
✅ Auto sleep setelah 15 menit idle
✅ SSL otomatis
✅ Custom domain

Cocok untuk: Testing & Demo
```

### Option 3: Vercel + Railway
```
✅ Vercel: Frontend gratis unlimited
✅ Railway: Backend $5 credit/bulan
✅ SSL otomatis
✅ Deploy cepat

Cocok untuk: Best performance
```

### Option 4: Netlify + Heroku
```
✅ Netlify: Frontend gratis
✅ Heroku: Backend gratis (sleep after idle)
✅ SSL otomatis

Cocok untuk: Simple deployment
```

---

## 🚀 TUTORIAL: Deploy di Railway.app (RECOMMENDED)

### Kenapa Railway?
- ✅ **Gratis $5/bulan** (cukup untuk 1 project kecil)
- ✅ **Tidak sleep** (always online)
- ✅ **Database included** (PostgreSQL/MySQL gratis)
- ✅ **Custom domain** gratis
- ✅ **Deploy otomatis** dari GitHub
- ✅ **SSL otomatis**

---

## PART 1: Setup GitHub (10 menit)

### Step 1: Create GitHub Account
```
1. Kunjungi: https://github.com
2. Sign up (gratis)
3. Verify email
```

### Step 2: Create Repository
```
1. Klik "New repository"
2. Repository name: kiansantang-bapas
3. Description: Sistem Antrian BAPAS Bandung
4. Public (gratis unlimited)
5. Create repository
```

### Step 3: Upload Project
```powershell
# Di PC lokal
cd D:\kiansantang\bapas-bandung

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/kiansantang-bapas.git

# Push
git branch -M main
git push -u origin main
```

---

## PART 2: Deploy Backend di Railway (15 menit)

### Step 1: Create Railway Account
```
1. Kunjungi: https://railway.app
2. Sign up with GitHub (gratis)
3. Authorize Railway
4. ✅ $5 credit otomatis!
```

### Step 2: Create New Project
```
1. Dashboard → "New Project"
2. "Deploy from GitHub repo"
3. Pilih: kiansantang-bapas
4. Select: backend folder
```

### Step 3: Configure Backend
```
1. Settings → Environment Variables:
   
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your-secret-key-change-this
   
2. Settings → Networking:
   - Generate Domain
   - Copy domain: kiansantang-backend.up.railway.app
   
3. Settings → Deploy:
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start
```

### Step 4: Deploy!
```
1. Klik "Deploy"
2. Tunggu build selesai (3-5 menit)
3. ✅ Backend online!

Test:
https://kiansantang-backend.up.railway.app/api/health
```

---

## PART 3: Deploy Frontend di Vercel (20 menit)

### Step 1: Create Vercel Account
```
1. Kunjungi: https://vercel.com
2. Sign up with GitHub (gratis)
3. Authorize Vercel
```

### Step 2: Deploy Registration App
```
1. Dashboard → "Add New" → "Project"
2. Import: kiansantang-bapas
3. Configure:
   - Framework Preset: Vite
   - Root Directory: registration-app
   - Build Command: npm run build
   - Output Directory: dist
   
4. Environment Variables:
   VITE_API_URL=https://kiansantang-backend.up.railway.app/api
   
5. Deploy!
6. Copy URL: kiansantang-registration.vercel.app
```

### Step 3: Deploy Operator App
```
1. New Project
2. Import: kiansantang-bapas
3. Root Directory: operator-app
4. Environment Variables:
   VITE_API_URL=https://kiansantang-backend.up.railway.app/api
5. Deploy!
6. URL: kiansantang-operator.vercel.app
```

### Step 4: Deploy Display App
```
1. New Project
2. Root Directory: display-app
3. Environment Variables:
   VITE_API_URL=https://kiansantang-backend.up.railway.app/api
4. Deploy!
5. URL: kiansantang-display.vercel.app
```

### Step 5: Deploy Petugas App
```
1. New Project
2. Root Directory: petugas-app
3. Environment Variables:
   VITE_API_URL=https://kiansantang-backend.up.railway.app/api
4. Deploy!
5. URL: kiansantang-petugas.vercel.app
```

---

## PART 4: Setup Custom Domain (Optional - 10 menit)

### Railway (Backend):
```
1. Railway Dashboard → Settings → Networking
2. Custom Domain → Add Domain
3. Domain: api.kiansantang.bapas-bandung.go.id
4. Add CNAME record di DNS:
   CNAME api → kiansantang-backend.up.railway.app
5. ✅ SSL otomatis!
```

### Vercel (Frontend):
```
1. Vercel Dashboard → Settings → Domains
2. Add Domain: registrasi.kiansantang.bapas-bandung.go.id
3. Add CNAME record:
   CNAME registrasi → cname.vercel-dns.com
4. ✅ SSL otomatis!
```

---

## PART 5: Update CORS di Backend (5 menit)

### Edit server.js di GitHub:
```javascript
// Update CORS
app.use(cors({
  origin: [
    'https://kiansantang-registration.vercel.app',
    'https://kiansantang-operator.vercel.app',
    'https://kiansantang-display.vercel.app',
    'https://kiansantang-petugas.vercel.app',
    // Jika pakai custom domain:
    'https://registrasi.kiansantang.bapas-bandung.go.id',
    'https://operator.kiansantang.bapas-bandung.go.id',
    'https://display.kiansantang.bapas-bandung.go.id',
    'https://petugas.kiansantang.bapas-bandung.go.id'
  ],
  credentials: true
}));
```

Commit & Push → Railway auto-deploy!

---

## 📊 Perbandingan Platform Gratis

| Platform | Backend | Frontend | Database | Custom Domain | SSL | Sleep |
|----------|---------|----------|----------|---------------|-----|-------|
| **Railway** | ✅ $5/bulan | ❌ | ✅ Gratis | ✅ | ✅ | ❌ |
| **Vercel** | ❌ | ✅ Unlimited | ❌ | ✅ | ✅ | ❌ |
| **Render** | ✅ 750h/bulan | ✅ | ✅ 90 hari | ✅ | ✅ | ✅ 15min |
| **Netlify** | ❌ | ✅ 100GB | ❌ | ✅ | ✅ | ❌ |
| **Heroku** | ✅ 1000h/bulan | ❌ | ✅ 10k rows | ✅ | ✅ | ✅ 30min |

**Kombinasi Terbaik**: Railway (Backend) + Vercel (Frontend)

---

## 🎯 Alternatif: Deploy di Render.com (ALL-IN-ONE)

### Kelebihan:
- ✅ Backend + Frontend dalam 1 platform
- ✅ Database gratis (PostgreSQL)
- ✅ Setup lebih simple

### Kekurangan:
- ⚠️ Auto sleep setelah 15 menit idle
- ⚠️ Cold start ~30 detik

### Tutorial Singkat:

#### 1. Create Render Account
```
https://render.com → Sign up with GitHub
```

#### 2. Deploy Backend
```
1. New → Web Service
2. Connect: kiansantang-bapas
3. Root Directory: backend
4. Build: npm install
5. Start: npm start
6. Plan: Free
7. Deploy!
```

#### 3. Deploy Frontend (4x)
```
1. New → Static Site
2. Root Directory: registration-app
3. Build: npm run build
4. Publish: dist
5. Deploy!

Ulangi untuk operator, display, petugas
```

---

## 🆓 Alternatif: Deploy di Heroku (Classic)

### Setup:
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
cd D:\kiansantang\bapas-bandung\backend
heroku create kiansantang-backend

# Deploy
git push heroku main

# Open
heroku open
```

### Frontend di Netlify:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd registration-app
npm run build
netlify deploy --prod --dir=dist
```

---

## 💡 Tips Hemat Biaya

### 1. Gunakan Free Tier Maksimal:
```
✅ Railway: $5 credit/bulan (backend)
✅ Vercel: Unlimited (frontend)
✅ Cloudflare: DNS + CDN gratis
✅ Let's Encrypt: SSL gratis
```

### 2. Optimize Resource:
```javascript
// Gunakan SQLite (tidak perlu database server)
// Compress assets
// Enable caching
// Minimize API calls
```

### 3. Auto Sleep untuk Dev:
```
Gunakan Render free tier untuk development
Production pakai Railway ($5/bulan)
```

---

## 🔧 Maintenance Gratis

### Auto Deploy:
```
✅ Push ke GitHub → Auto deploy
✅ Tidak perlu SSH ke server
✅ Tidak perlu manual restart
```

### Monitoring:
```
✅ Railway Dashboard: Logs + Metrics
✅ Vercel Analytics: Traffic stats
✅ Gratis!
```

### Backup:
```
✅ GitHub: Source code backup
✅ Railway: Database backup otomatis
✅ Download database manual (jika perlu)
```

---

## ✅ Checklist Deploy Gratis

### Setup:
- [ ] GitHub account created
- [ ] Repository created & pushed
- [ ] Railway account created ($5 credit)
- [ ] Vercel account created

### Backend:
- [ ] Railway project created
- [ ] Backend deployed
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] CORS updated

### Frontend:
- [ ] Registration app deployed
- [ ] Operator app deployed
- [ ] Display app deployed
- [ ] Petugas app deployed
- [ ] All apps connected to backend

### Testing:
- [ ] Backend API accessible
- [ ] All frontend apps accessible
- [ ] Login working
- [ ] Create queue working
- [ ] Socket.IO working

### Production:
- [ ] Custom domain setup (optional)
- [ ] SSL working
- [ ] Auto deploy enabled
- [ ] **LIVE GRATIS!** 🎉

---

## 🎉 Hasil Akhir

**URL Gratis**:
```
Backend:      https://kiansantang-backend.up.railway.app
Registration: https://kiansantang-registration.vercel.app
Operator:     https://kiansantang-operator.vercel.app
Display:      https://kiansantang-display.vercel.app
Petugas:      https://kiansantang-petugas.vercel.app
```

**Atau dengan Custom Domain**:
```
Backend:      https://api.kiansantang.bapas-bandung.go.id
Registration: https://registrasi.kiansantang.bapas-bandung.go.id
Operator:     https://operator.kiansantang.bapas-bandung.go.id
Display:      https://display.kiansantang.bapas-bandung.go.id
Petugas:      https://petugas.kiansantang.bapas-bandung.go.id
```

**Biaya**:
- Railway: $5 credit/bulan (GRATIS)
- Vercel: $0 (GRATIS)
- Domain: $0 (jika .go.id)
- SSL: $0 (otomatis)
- **Total: GRATIS!** 🎉

**Waktu Deploy**: 45-60 menit
**Maintenance**: Auto deploy dari GitHub
**Monitoring**: Dashboard gratis

**Sistem KIANSANTANG online 100% GRATIS!** 🚀🆓
