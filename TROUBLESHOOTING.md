# 🔧 KIANSANTANG - Troubleshooting Guide

## 🚨 Masalah Umum & Solusi

### 1. Aplikasi Tidak Bisa Start

#### Gejala:
- Error saat menjalankan `npm run dev`
- Port already in use
- Module not found

#### Solusi:

**A. Stop semua proses Node.js:**
```bash
# Windows
Stop-Process -Name node -Force

# Atau gunakan Task Manager
# Cari "Node.js" dan End Task
```

**B. Install dependencies:**
```bash
# Jalankan check-and-fix.bat
.\check-and-fix.bat

# Atau manual per aplikasi:
cd backend
npm install

cd ../registration-app
npm install

cd ../operator-app
npm install

cd ../display-app
npm install
```

**C. Check port availability:**
```bash
# Check port 3000 (Backend)
netstat -ano | findstr :3000

# Check port 5173 (Registration)
netstat -ano | findstr :5173

# Check port 5174 (Operator)
netstat -ano | findstr :5174

# Check port 5175 (Display)
netstat -ano | findstr :5175
```

**D. Kill process using port:**
```bash
# Ganti PID dengan Process ID dari netstat
taskkill /PID <PID> /F
```

### 2. Backend API Error

#### Gejala:
- "Cannot connect to API"
- "Network Error"
- "500 Internal Server Error"

#### Solusi:

**A. Check backend status:**
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Atau buka di browser:
http://localhost:3000/api/health
```

**B. Check .env file:**
```bash
cd backend

# File .env harus ada dengan isi:
PORT=3000
JWT_SECRET=kiansantang-secret-key-change-in-production
NODE_ENV=development
```

**C. Check database:**
```bash
cd backend

# Jika database corrupt, backup dan hapus:
copy bapas.db bapas.db.backup
del bapas.db

# Database akan dibuat ulang saat backend start
npm run dev
```

**D. Check logs:**
```bash
# Lihat terminal backend untuk error messages
# Common errors:
# - Port already in use → Kill process
# - Module not found → npm install
# - Database locked → Close other connections
```

### 3. Frontend Tidak Connect ke Backend

#### Gejala:
- "Failed to fetch"
- "CORS error"
- Data tidak muncul

#### Solusi:

**A. Check backend running:**
```bash
# Backend harus running di port 3000
curl http://localhost:3000/api/health
```

**B. Check config.js:**
```javascript
// registration-app/src/config.js
// operator-app/src/config.js
// display-app/src/config.js

export const API_URL = 'http://localhost:3000/api';
export const SOCKET_URL = 'http://localhost:3000';
```

**C. Clear browser cache:**
```
1. Tekan Ctrl + Shift + Delete
2. Clear cache and cookies
3. Refresh page (Ctrl + F5)
```

**D. Check CORS:**
```javascript
// backend/server.js
app.use(cors()); // Harus ada
```

### 4. Login Gagal

#### Gejala:
- "Invalid credentials"
- "401 Unauthorized"
- "Access token required"

#### Solusi:

**A. Check credentials:**
```
Admin:
- Username: admin
- Password: admin123

Operator:
- Username: operator
- Password: operator123

PK:
- Username: budiana (atau PK lain)
- Password: pk123456 (huruf kecil!)

Petugas:
- Username: petugas_penghadapan
- Password: petugas123
```

**B. Password case sensitive:**
```
❌ SALAH:
- PK123456 (huruf besar)
- Pk123456 (mixed case)

✅ BENAR:
- pk123456 (huruf kecil semua)
```

**C. Clear localStorage:**
```javascript
// Di browser console (F12):
localStorage.clear();
// Refresh page
```

**D. Check JWT secret:**
```bash
# backend/.env
JWT_SECRET=kiansantang-secret-key-change-in-production
```

### 5. Socket.IO Tidak Connect

#### Gejala:
- Display tidak update real-time
- Antrian tidak muncul otomatis
- "Socket connection failed"

#### Solusi:

**A. Check backend Socket.IO:**
```bash
# Backend harus running
# Check console untuk "Client connected"
```

**B. Check SOCKET_URL:**
```javascript
// config.js
export const SOCKET_URL = 'http://localhost:3000';
```

**C. Check firewall:**
```
Windows Firewall mungkin block Socket.IO
Allow Node.js through firewall
```

**D. Restart aplikasi:**
```bash
# Stop all
Stop-Process -Name node -Force

# Start all
.\start-all.bat
```

### 6. Display App Tidak Menampilkan Antrian

#### Gejala:
- Display kosong
- Nomor antrian tidak muncul
- "No queue to display"

#### Solusi:

**A. Check ada antrian:**
```bash
# Buat antrian dulu di Registration App
http://localhost:5173
```

**B. Check operator sudah panggil:**
```bash
# Login ke Operator App
http://localhost:5174
# Panggil antrian
```

**C. Check Socket.IO connection:**
```javascript
// Display App console (F12)
// Harus ada "Connected to Socket.IO"
```

**D. Refresh display:**
```
Tekan F5 atau Ctrl + F5
```

### 7. Database Error

#### Gejala:
- "Database is locked"
- "SQLITE_BUSY"
- "Cannot open database"

#### Solusi:

**A. Close all connections:**
```bash
# Stop all Node.js processes
Stop-Process -Name node -Force

# Close DB Browser if open
```

**B. Backup and reset:**
```bash
cd backend

# Backup
copy bapas.db bapas.db.backup

# Delete
del bapas.db

# Restart backend (will recreate)
npm run dev
```

**C. Check file permissions:**
```
Right-click bapas.db → Properties → Security
Ensure full control for your user
```

### 8. Module Not Found Error

#### Gejala:
- "Cannot find module"
- "Module not found"
- Import errors

#### Solusi:

**A. Install dependencies:**
```bash
# Per aplikasi
cd <app-folder>
npm install

# Atau gunakan check-and-fix.bat
.\check-and-fix.bat
```

**B. Clear npm cache:**
```bash
npm cache clean --force
npm install
```

**C. Delete node_modules:**
```bash
cd <app-folder>
rmdir /s node_modules
npm install
```

### 9. Port Already in Use

#### Gejala:
- "Port 3000 is already in use"
- "EADDRINUSE"

#### Solusi:

**A. Find and kill process:**
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (ganti PID)
taskkill /PID <PID> /F
```

**B. Change port:**
```bash
# Backend: Edit .env
PORT=3001

# Frontend: Edit package.json
"dev": "vite --port 5176"
```

**C. Stop all Node:**
```bash
Stop-Process -Name node -Force
```

### 10. Vite Build Error

#### Gejala:
- "Build failed"
- "Vite error"
- "Cannot resolve module"

#### Solusi:

**A. Clear Vite cache:**
```bash
cd <app-folder>
rmdir /s node_modules\.vite
npm run dev
```

**B. Update dependencies:**
```bash
npm update
```

**C. Reinstall:**
```bash
rmdir /s node_modules
npm install
```

## 🛠️ Tools & Scripts

### check-and-fix.bat
Otomatis check dan fix semua dependencies:
```bash
.\check-and-fix.bat
```

### start-all.bat
Start semua aplikasi sekaligus:
```bash
.\start-all.bat
```

### Stop All Apps
```bash
Stop-Process -Name node -Force
```

### Check All Ports
```bash
netstat -ano | findstr ":3000 :5173 :5174 :5175"
```

### Test Backend API
```bash
curl http://localhost:3000/api/health
```

### Check Node Version
```bash
node --version
npm --version
```

## 📊 System Requirements

### Minimum:
- Node.js 16.x or higher
- npm 8.x or higher
- 4GB RAM
- 1GB free disk space
- Windows 10/11

### Recommended:
- Node.js 18.x or higher
- npm 9.x or higher
- 8GB RAM
- 5GB free disk space
- SSD storage

## 🔍 Debugging Tips

### 1. Check Console Logs
```
Browser: F12 → Console tab
Backend: Terminal output
```

### 2. Check Network Tab
```
Browser: F12 → Network tab
Filter: XHR/Fetch
Check API calls
```

### 3. Check Application Tab
```
Browser: F12 → Application tab
Check localStorage
Check cookies
```

### 4. Verbose Logging
```bash
# Backend
NODE_ENV=development npm run dev

# Frontend
npm run dev -- --debug
```

### 5. Test API with Postman
```
Import API endpoints
Test authentication
Check responses
```

## 📞 Getting Help

### 1. Check Documentation
- README.md
- KIANSANTANG-GUIDE.md
- PANDUAN-LOGIN-LENGKAP.md
- APLIKASI-PETUGAS-MULTI-ROLE.md

### 2. Check Logs
- Backend terminal
- Browser console (F12)
- Network tab

### 3. Search Error Message
- Google the error
- Stack Overflow
- GitHub Issues

### 4. Contact Support
- Email: bapas.bandung@kemenkumham.go.id
- Phone: (022) 4204501

## ✅ Health Check Checklist

Before reporting issues, check:

- [ ] Node.js installed (v16+)
- [ ] npm installed (v8+)
- [ ] All dependencies installed
- [ ] Backend running (port 3000)
- [ ] .env file exists
- [ ] Database file exists
- [ ] No port conflicts
- [ ] Firewall allows Node.js
- [ ] Browser cache cleared
- [ ] Correct credentials used

## 🚀 Quick Fix Commands

```bash
# Stop everything
Stop-Process -Name node -Force

# Check and fix
.\check-and-fix.bat

# Start everything
.\start-all.bat

# Test backend
curl http://localhost:3000/api/health

# Open home dashboard
start index.html
```

## 📝 Common Error Messages

### "ECONNREFUSED"
→ Backend not running. Start backend first.

### "CORS error"
→ Check backend CORS config. Restart backend.

### "401 Unauthorized"
→ Wrong credentials or token expired. Login again.

### "404 Not Found"
→ Wrong URL or route not registered. Check API endpoints.

### "500 Internal Server Error"
→ Backend error. Check backend logs.

### "Module not found"
→ Dependencies not installed. Run `npm install`.

### "Port already in use"
→ Kill process using port or change port.

### "Database is locked"
→ Close other connections. Restart backend.

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**

**BAPAS Kelas I Bandung**

*Jika masalah masih berlanjut, hubungi tim support* 📞
