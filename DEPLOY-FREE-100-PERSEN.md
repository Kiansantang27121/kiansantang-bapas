# 🆓 Deploy KIANSANTANG 100% GRATIS

## Platform yang Benar-Benar GRATIS (Tanpa Kartu Kredit)

### ✅ Pilihan Terbaik: Render.com + Vercel

---

## 🎯 OPTION 1: Render.com (Backend) + Vercel (Frontend)

### Kelebihan:
- ✅ **100% GRATIS** - Tidak perlu kartu kredit
- ✅ Backend gratis 750 jam/bulan (cukup untuk 1 bulan penuh)
- ✅ Frontend unlimited gratis
- ✅ SSL otomatis
- ✅ Deploy dari GitHub otomatis

### Kekurangan:
- ⚠️ Backend sleep setelah 15 menit tidak ada traffic
- ⚠️ Cold start ~30 detik saat pertama kali diakses

---

## 📦 PART 1: Deploy Backend di Render.com

### Step 1: Buat Akun Render
1. Buka: https://render.com
2. Klik **"Get Started for Free"**
3. Sign up dengan **GitHub** (gratis, tidak perlu kartu kredit)
4. Authorize Render

### Step 2: Deploy Backend
1. Dashboard → Klik **"New +"** → **"Web Service"**
2. Connect repository: **kiansantang-bapas**
3. Configure:
   ```
   Name: kiansantang-backend
   Region: Singapore (terdekat)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Instance Type**: Pilih **"Free"** (0$/month)

5. **Environment Variables** - Klik "Add Environment Variable":
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=kiansantang-secret-2024-ganti-dengan-random-string
   ```

6. Klik **"Create Web Service"**

7. Tunggu deploy selesai (~3-5 menit)

8. Copy URL yang muncul (contoh: `https://kiansantang-backend.onrender.com`)

### Step 3: Test Backend
Buka di browser:
```
https://kiansantang-backend.onrender.com/api/health
```
Harus muncul: `{"status":"ok"}`

---

## 🌐 PART 2: Deploy Frontend di Vercel

### Step 1: Buat Akun Vercel
1. Buka: https://vercel.com/signup
2. Klik **"Continue with GitHub"**
3. Authorize Vercel (100% gratis, tidak perlu kartu kredit)

### Step 2: Deploy Registration App
1. Dashboard → **"Add New..."** → **"Project"**
2. Import repository: **kiansantang-bapas**
3. Configure:
   ```
   Project Name: kiansantang-registration
   Framework Preset: Vite
   Root Directory: registration-app
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Environment Variables**:
   ```
   VITE_API_URL=https://kiansantang-backend.onrender.com/api
   ```
   ⚠️ Ganti dengan URL Render Anda!

5. Klik **"Deploy"**

6. Tunggu deploy selesai (~2 menit)

7. Copy URL (contoh: `https://kiansantang-registration.vercel.app`)

### Step 3: Deploy Operator App
Ulangi langkah yang sama:
```
Project Name: kiansantang-operator
Root Directory: operator-app
Environment Variables:
  VITE_API_URL=https://kiansantang-backend.onrender.com/api
```

### Step 4: Deploy Display App
```
Project Name: kiansantang-display
Root Directory: display-app
Environment Variables:
  VITE_API_URL=https://kiansantang-backend.onrender.com/api
```

### Step 5: Deploy Petugas App
```
Project Name: kiansantang-petugas
Root Directory: petugas-app
Environment Variables:
  VITE_API_URL=https://kiansantang-backend.onrender.com/api
```

---

## ⚙️ PART 3: Update CORS di Backend

### Edit di GitHub
1. Buka repository di GitHub
2. Edit file: `backend/server.js`
3. Update CORS (sekitar line 42):

```javascript
app.use(cors({
  origin: [
    'https://kiansantang-registration.vercel.app',
    'https://kiansantang-operator.vercel.app',
    'https://kiansantang-display.vercel.app',
    'https://kiansantang-petugas.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
  credentials: true
}));
```

4. Commit & Push
5. Render akan auto-deploy ulang!

---

## 🎯 OPTION 2: Vercel untuk Semua (Backend + Frontend)

### ⚠️ Catatan:
Vercel bisa deploy backend Node.js, tapi dengan batasan:
- Serverless functions (max 10 detik execution)
- Tidak cocok untuk Socket.IO real-time
- Database SQLite tidak persistent

### Jika tetap ingin coba:

1. Buat file `vercel.json` di root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    }
  ]
}
```

2. Deploy dari Vercel dashboard
3. Pilih root directory: `/`

**Tidak direkomendasikan untuk production!**

---

## 🎯 OPTION 3: Netlify (Frontend) + Render (Backend)

### Sama seperti Option 1, tapi ganti Vercel dengan Netlify

1. **Netlify** untuk frontend:
   - Buka: https://netlify.com
   - Sign up dengan GitHub (gratis)
   - Deploy sama seperti Vercel

2. **Render** untuk backend (sama seperti Option 1)

---

## 💡 OPTION 4: Glitch.com (All-in-One)

### Kelebihan:
- ✅ 100% gratis
- ✅ Tidak perlu kartu kredit
- ✅ Editor online (bisa edit langsung)

### Kekurangan:
- ⚠️ Sleep setelah 5 menit idle
- ⚠️ Resource terbatas

### Cara Deploy:
1. Buka: https://glitch.com
2. Sign in dengan GitHub
3. Import from GitHub: `kiansantang-bapas`
4. Edit `.env`:
   ```
   PORT=3000
   JWT_SECRET=your-secret
   ```
5. App akan auto-running

---

## 📊 Perbandingan Platform Gratis

| Platform | Backend | Frontend | Database | Sleep | Cold Start | Rekomendasi |
|----------|---------|----------|----------|-------|------------|-------------|
| **Render + Vercel** | ✅ 750h | ✅ Unlimited | ✅ | 15 min | ~30s | ⭐⭐⭐⭐⭐ |
| **Netlify + Render** | ✅ 750h | ✅ 100GB | ✅ | 15 min | ~30s | ⭐⭐⭐⭐ |
| **Glitch** | ✅ | ✅ | ✅ | 5 min | ~10s | ⭐⭐⭐ |
| **Vercel Only** | ⚠️ Serverless | ✅ | ❌ | ❌ | ~5s | ⭐⭐ |

---

## ✅ Rekomendasi Final: Render + Vercel

**Kenapa?**
- ✅ Benar-benar gratis (tidak perlu kartu kredit)
- ✅ Backend 750 jam/bulan (cukup 1 bulan penuh)
- ✅ Frontend unlimited
- ✅ SSL otomatis
- ✅ Custom domain gratis
- ✅ Auto-deploy dari GitHub

**Cara Atasi Sleep:**
- Gunakan cron job gratis (cron-job.org) untuk ping backend setiap 10 menit
- Atau buat simple script di frontend untuk ping backend

---

## 🔧 Tips Keep Backend Awake (Agar Tidak Sleep)

### Option 1: Cron-job.org (Gratis)
1. Buka: https://cron-job.org
2. Sign up gratis
3. Create cronjob:
   ```
   URL: https://kiansantang-backend.onrender.com/api/health
   Interval: Every 10 minutes
   ```

### Option 2: UptimeRobot (Gratis)
1. Buka: https://uptimerobot.com
2. Sign up gratis
3. Add monitor:
   ```
   Monitor Type: HTTP(s)
   URL: https://kiansantang-backend.onrender.com/api/health
   Monitoring Interval: 5 minutes
   ```

### Option 3: Self-Ping dari Frontend
Tambahkan di frontend (App.jsx):
```javascript
useEffect(() => {
  // Ping backend every 10 minutes
  const interval = setInterval(() => {
    fetch('https://kiansantang-backend.onrender.com/api/health')
      .catch(err => console.log('Ping failed'))
  }, 10 * 60 * 1000) // 10 minutes
  
  return () => clearInterval(interval)
}, [])
```

---

## 🎉 Hasil Akhir

**URL Gratis:**
```
Backend (Render):
https://kiansantang-backend.onrender.com

Registration (Vercel):
https://kiansantang-registration.vercel.app

Operator (Vercel):
https://kiansantang-operator.vercel.app

Display (Vercel):
https://kiansantang-display.vercel.app

Petugas (Vercel):
https://kiansantang-petugas.vercel.app
```

**Biaya:**
- Render: **Rp 0 / GRATIS**
- Vercel: **Rp 0 / GRATIS**
- SSL: **Rp 0 / GRATIS**
- Domain: **Rp 0 / GRATIS** (.onrender.com & .vercel.app)
- **TOTAL: Rp 0 / 100% GRATIS!** 🎉

**Maintenance:**
- Auto-deploy dari GitHub
- Monitoring gratis (UptimeRobot)
- Logs gratis di dashboard

**Sistem KIANSANTANG Online 100% GRATIS Selamanya!** 🚀🆓
