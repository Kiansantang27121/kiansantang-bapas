# 🚀 Cara Start Aplikasi KIANSANTANG

## 📋 Quick Start

### Metode 1: Start Semua Aplikasi Sekaligus (RECOMMENDED)

```bash
# Double click file ini:
start-all-apps.bat
```

Script ini akan otomatis membuka 5 terminal windows:
1. Backend API (Port 3000)
2. Pengguna Layanan (Port 5173)
3. Panel Admin (Port 5174)
4. Display (Port 5175)
5. Petugas (Port 5176)

### Metode 2: Start Manual Satu Per Satu

#### 1. Start Backend (WAJIB - Harus pertama)
```bash
cd backend
npm run dev
```

#### 2. Start Pengguna Layanan
```bash
cd registration-app
npm run dev
```

#### 3. Start Panel Admin
```bash
cd operator-app
npm run dev
```

#### 4. Start Display
```bash
cd display-app
npm run dev
```

#### 5. Start Petugas
```bash
cd petugas-app
npm run dev
```

---

## 🔍 Troubleshooting

### ❌ Panel Pengaturan Tidak Bisa Diakses

**Masalah:** Tidak bisa buka http://localhost:5174

**Penyebab:**
1. Aplikasi belum dijalankan
2. Backend tidak berjalan
3. Port sudah digunakan aplikasi lain

**Solusi:**

#### Solusi 1: Start Aplikasi
```bash
cd operator-app
npm run dev
```

#### Solusi 2: Check Port
```bash
# Windows PowerShell
netstat -ano | findstr :5174

# Jika ada, kill process:
taskkill /PID [PID_NUMBER] /F
```

#### Solusi 3: Start Backend Dulu
```bash
# Backend HARUS running dulu
cd backend
npm run dev

# Baru start operator-app
cd operator-app
npm run dev
```

---

### ❌ Error "Cannot connect to backend"

**Masalah:** Frontend tidak bisa connect ke backend

**Solusi:**

#### 1. Check Backend Running
```bash
curl http://localhost:3000/api/health
```

Jika error, start backend:
```bash
cd backend
npm run dev
```

#### 2. Check Port 3000
```bash
netstat -ano | findstr :3000
```

#### 3. Restart Backend
```bash
# Tekan Ctrl+C di terminal backend
# Lalu start lagi:
npm run dev
```

---

### ❌ Aplikasi Tidak Muncul

**Masalah:** Terminal terbuka tapi tidak ada output

**Solusi:**

#### 1. Check Dependencies
```bash
cd [app-folder]
npm install
```

#### 2. Clear Cache
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

#### 3. Check Node Version
```bash
node --version
# Harus >= 16.x
```

---

### ❌ Port Already in Use

**Masalah:** Error "Port 5174 is already in use"

**Solusi:**

#### 1. Kill Process di Port
```powershell
# Windows PowerShell
netstat -ano | findstr :5174
taskkill /PID [PID] /F
```

#### 2. Gunakan Port Lain
Edit `package.json`:
```json
"dev": "vite --port 5177"
```

---

## 📊 Check Status Aplikasi

### Check Semua Port
```powershell
# Windows PowerShell
netstat -ano | findstr "3000 5173 5174 5175 5176"
```

### Check Specific App
```bash
# Backend
curl http://localhost:3000/api/health

# Pengguna Layanan
curl http://localhost:5173

# Panel Admin
curl http://localhost:5174

# Display
curl http://localhost:5175

# Petugas
curl http://localhost:5176
```

---

## 🎯 Urutan Start yang Benar

### ⚠️ PENTING: Urutan Matters!

```
1. Backend (Port 3000)      ← HARUS PERTAMA
   ↓
2. Frontend Apps (parallel):
   - Pengguna Layanan (5173)
   - Panel Admin (5174)
   - Display (5175)
   - Petugas (5176)
```

**Kenapa Backend Dulu?**
- Semua frontend butuh backend API
- Tanpa backend, frontend akan error
- Backend menyediakan data dan authentication

---

## 💡 Tips & Best Practices

### 1. Gunakan start-all-apps.bat
✅ Otomatis start semua
✅ Urutan yang benar
✅ Delay antar start
✅ Terminal terpisah per app

### 2. Check Backend Dulu
Sebelum start frontend, pastikan:
```bash
curl http://localhost:3000/api/health
```

Response harus:
```json
{
  "status": "ok",
  "message": "KIANSANTANG API is running"
}
```

### 3. Jangan Close Terminal
- Setiap app butuh terminal sendiri
- Jangan close terminal saat app running
- Untuk stop: Ctrl+C di terminal

### 4. Restart Jika Error
```bash
# Stop: Ctrl+C
# Start lagi: npm run dev
```

---

## 🔧 Development Mode

### Hot Reload
Semua aplikasi menggunakan Vite dengan hot reload:
- Edit code → Save → Auto refresh
- Tidak perlu restart manual

### Debug Mode
```bash
# Backend dengan debug
cd backend
npm run dev

# Frontend dengan verbose
cd operator-app
npm run dev -- --debug
```

---

## 📱 Access URLs

### Production URLs:
```
Backend:          http://localhost:3000
Pengguna Layanan: http://localhost:5173
Panel Admin:      http://localhost:5174
Display:          http://localhost:5175
Petugas:          http://localhost:5176
```

### API Endpoints:
```
Health:    http://localhost:3000/api/health
Auth:      http://localhost:3000/api/auth/login
Queue:     http://localhost:3000/api/queue
Services:  http://localhost:3000/api/services
```

---

## 🛑 Stop Aplikasi

### Stop Satu Aplikasi
```
1. Klik terminal aplikasi
2. Tekan Ctrl+C
3. Confirm dengan Y
```

### Stop Semua Aplikasi
```powershell
# Windows PowerShell
# Kill semua node process
taskkill /F /IM node.exe
```

⚠️ **Warning:** Ini akan stop SEMUA aplikasi Node.js!

---

## 📞 Support

### Jika Masih Error:

1. **Check Logs**
   - Lihat terminal output
   - Cari error message

2. **Restart Semua**
   ```bash
   # Stop semua (Ctrl+C)
   # Start ulang dengan start-all-apps.bat
   ```

3. **Reinstall Dependencies**
   ```bash
   cd [app-folder]
   rm -rf node_modules
   npm install
   ```

4. **Check Documentation**
   - `README.md` - Overview
   - `TROUBLESHOOTING.md` - Detailed fixes
   - `KIANSANTANG-GUIDE.md` - Complete guide

---

## ✅ Checklist Sebelum Start

- [ ] Node.js installed (>= 16.x)
- [ ] npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] Port 3000, 5173-5176 available
- [ ] Backend database exists (`backend/database.sqlite`)

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**

**BAPAS Kelas I Bandung**

*Start aplikasi dengan mudah!* 🚀✨
