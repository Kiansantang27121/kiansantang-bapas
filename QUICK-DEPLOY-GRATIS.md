# ⚡ Quick Deploy GRATIS - Railway + Vercel

## 🎯 Deploy 100% Gratis dalam 1 Jam

### Platform:
- **Railway.app**: Backend (Gratis $5 credit/bulan)
- **Vercel.com**: Frontend (Gratis unlimited)
- **Total Biaya**: $0 🆓

---

## 🚀 Step-by-Step (1 Jam)

### 1️⃣ Setup GitHub (10 menit)

```powershell
# Di PC lokal
cd D:\kiansantang\bapas-bandung

# Init git
git init
git add .
git commit -m "Initial commit"

# Create repo di GitHub.com
# Lalu push:
git remote add origin https://github.com/USERNAME/kiansantang-bapas.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Deploy Backend di Railway (15 menit)

#### A. Create Account:
```
1. https://railway.app
2. Sign up with GitHub
3. ✅ $5 credit otomatis!
```

#### B. Deploy:
```
1. New Project → Deploy from GitHub
2. Select: kiansantang-bapas
3. Settings:
   - Root Directory: backend
   - Start Command: npm start
   
4. Environment Variables:
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=change-this-secret
   
5. Generate Domain
6. ✅ Deploy!
```

#### C. Copy URL:
```
https://kiansantang-backend.up.railway.app
```

---

### 3️⃣ Deploy Frontend di Vercel (30 menit)

#### A. Create Account:
```
1. https://vercel.com
2. Sign up with GitHub
```

#### B. Deploy Registration:
```
1. Add New → Project
2. Import: kiansantang-bapas
3. Settings:
   - Root Directory: registration-app
   - Framework: Vite
   - Build: npm run build
   - Output: dist
   
4. Environment Variables:
   VITE_API_URL=https://kiansantang-backend.up.railway.app/api
   
5. Deploy!
```

#### C. Deploy Operator:
```
Same steps, Root Directory: operator-app
```

#### D. Deploy Display:
```
Same steps, Root Directory: display-app
```

#### E. Deploy Petugas:
```
Same steps, Root Directory: petugas-app
```

---

### 4️⃣ Update CORS (5 menit)

#### Edit di GitHub:
```javascript
// backend/server.js
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

Commit → Push → Railway auto-deploy!

---

### 5️⃣ Test! (5 menit)

```
✅ https://kiansantang-registration.vercel.app
✅ https://kiansantang-operator.vercel.app
✅ https://kiansantang-display.vercel.app
✅ https://kiansantang-petugas.vercel.app

Login:
- operator / operator123
- petugas / petugas123
```

---

## 📝 URLs Anda

```
Backend:      https://YOUR-APP.up.railway.app
Registration: https://YOUR-APP.vercel.app
Operator:     https://YOUR-APP.vercel.app
Display:      https://YOUR-APP.vercel.app
Petugas:      https://YOUR-APP.vercel.app
```

---

## 🔧 Commands

### Update Aplikasi:
```bash
# Edit code
git add .
git commit -m "Update"
git push

# ✅ Auto deploy!
```

### View Logs:
```
Railway: Dashboard → Logs
Vercel: Dashboard → Deployments → View Logs
```

---

## 💰 Biaya

| Item | Biaya |
|------|-------|
| Railway Backend | $0 ($5 credit/bulan) |
| Vercel Frontend | $0 (unlimited) |
| SSL Certificate | $0 (otomatis) |
| Custom Domain | $0 (optional) |
| **TOTAL** | **$0** 🆓 |

---

## ✅ Checklist

- [ ] GitHub repo created
- [ ] Railway account ($5 credit)
- [ ] Vercel account
- [ ] Backend deployed
- [ ] 4 Frontend apps deployed
- [ ] CORS updated
- [ ] All apps tested
- [ ] **LIVE GRATIS!** 🎉

---

## 🎉 Done!

**Deploy selesai dalam 1 jam!**
**Biaya: $0 (100% GRATIS)**
**SSL: Otomatis**
**Auto Deploy: Ya**

**Sistem online tanpa biaya!** 🚀🆓
