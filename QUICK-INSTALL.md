# ⚡ Quick Install - KIANSANTANG

## 🚀 Instalasi Cepat (30 Menit)

### 1️⃣ Install Node.js (10 menit)
```
Download: https://nodejs.org
→ Install "LTS" version
→ Next → Next → Install
→ ✅ Done!

Test:
CMD → node --version
```

### 2️⃣ Copy Project (5 menit)
```
Copy folder "bapas-bandung" ke:
D:\kiansantang\bapas-bandung\
```

### 3️⃣ Install Dependencies (15 menit)
```powershell
# Backend
cd D:\kiansantang\bapas-bandung\backend
npm install

# Registration
cd ..\registration-app
npm install

# Operator
cd ..\operator-app
npm install

# Display
cd ..\display-app
npm install

# Petugas
cd ..\petugas-app
npm install
```

### 4️⃣ Start Aplikasi (5 menit)
```powershell
# Terminal 1 - Backend
cd D:\kiansantang\bapas-bandung\backend
npm start

# Terminal 2 - Registration
cd D:\kiansantang\bapas-bandung\registration-app
npm run dev

# Terminal 3 - Operator
cd D:\kiansantang\bapas-bandung\operator-app
npm run dev

# Terminal 4 - Display
cd D:\kiansantang\bapas-bandung\display-app
npm run dev

# Terminal 5 - Petugas
cd D:\kiansantang\bapas-bandung\petugas-app
npm run dev
```

### 5️⃣ Test!
```
Registration: http://localhost:5173
Operator:     http://localhost:5174
Display:      http://localhost:5175
Petugas:      http://localhost:5176

Login:
- operator / operator123
- petugas / petugas123
```

---

## 🔧 Auto-Start Script

### File: `start-all.bat`
```batch
@echo off
start "Backend" cmd /k "cd /d D:\kiansantang\bapas-bandung\backend && npm start"
timeout /t 5
start "Registration" cmd /k "cd /d D:\kiansantang\bapas-bandung\registration-app && npm run dev"
timeout /t 3
start "Operator" cmd /k "cd /d D:\kiansantang\bapas-bandung\operator-app && npm run dev"
timeout /t 3
start "Display" cmd /k "cd /d D:\kiansantang\bapas-bandung\display-app && npm run dev"
timeout /t 3
start "Petugas" cmd /k "cd /d D:\kiansantang\bapas-bandung\petugas-app && npm run dev"
```

**Cara pakai**: Double-click `start-all.bat`

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Project copied
- [ ] Dependencies installed
- [ ] All apps running
- [ ] Login berhasil
- [ ] **READY!** 🎉

---

## 🔍 Troubleshooting

### Node tidak dikenali?
```
Restart CMD atau restart PC
```

### Port sudah digunakan?
```
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### npm install gagal?
```
Check internet
npm cache clean --force
npm install lagi
```

---

## 📖 Dokumentasi Lengkap

Baca: `TUTORIAL-INSTALASI.md`

**Instalasi selesai dalam 30 menit!** ⚡
