# 📦 Tutorial Instalasi KIANSANTANG di PC Lain

## 🎯 Tujuan
Panduan lengkap untuk menginstal dan menjalankan sistem KIANSANTANG di komputer baru.

---

## 📋 Persyaratan Sistem

### Hardware Minimum:
- **Processor**: Intel Core i3 atau setara
- **RAM**: 4 GB (8 GB recommended)
- **Storage**: 10 GB free space
- **Network**: LAN/WiFi untuk multi-device
- **Printer**: Thermal printer (optional)

### Software Requirements:
- **OS**: Windows 10/11 (64-bit)
- **Node.js**: v18.x atau lebih baru
- **Browser**: Chrome/Edge (terbaru)

---

## 🚀 Langkah Instalasi

### Step 1: Install Node.js (15 menit)

#### Download Node.js:
```
1. Buka browser
2. Kunjungi: https://nodejs.org
3. Download "LTS" version (Recommended)
4. File: node-v18.x.x-x64.msi
```

#### Install Node.js:
```
1. Double-click file installer
2. Klik "Next"
3. Accept license agreement
4. Pilih lokasi instalasi (default: C:\Program Files\nodejs)
5. Pastikan checklist:
   ✅ Node.js runtime
   ✅ npm package manager
   ✅ Add to PATH
6. Klik "Next" → "Install"
7. Tunggu proses instalasi (5-10 menit)
8. Klik "Finish"
```

#### Verify Instalasi:
```powershell
# Buka Command Prompt (CMD)
# Tekan Win+R → ketik "cmd" → Enter

# Check Node.js version
node --version
# Output: v18.x.x

# Check npm version
npm --version
# Output: 9.x.x

# ✅ Jika muncul version number, instalasi berhasil!
```

---

### Step 2: Copy Project Files (5 menit)

#### Option A: Via USB/External Drive
```
1. Copy folder "bapas-bandung" dari PC lama
2. Paste ke PC baru (contoh: D:\kiansantang\bapas-bandung)
3. ✅ Done!
```

#### Option B: Via Network Share
```
1. PC Lama: Share folder "bapas-bandung"
2. PC Baru: Buka Network → Copy folder
3. Paste ke lokasi yang diinginkan
4. ✅ Done!
```

#### Option C: Via Git (jika ada repository)
```powershell
# Buka Command Prompt
cd D:\kiansantang

# Clone repository
git clone https://github.com/your-repo/bapas-bandung.git

# Masuk ke folder
cd bapas-bandung
```

#### Struktur Folder:
```
D:\kiansantang\bapas-bandung\
├── backend\              # Backend API
├── registration-app\     # Aplikasi Registrasi
├── operator-app\         # Aplikasi Operator
├── display-app\          # Display Antrian
├── petugas-app\          # Aplikasi Petugas
└── README.md
```

---

### Step 3: Install Dependencies (20 menit)

#### Install Backend Dependencies:
```powershell
# Buka Command Prompt
cd D:\kiansantang\bapas-bandung\backend

# Install dependencies
npm install

# Tunggu proses instalasi (5-10 menit)
# ✅ Selesai jika muncul "added XXX packages"
```

#### Install Registration App Dependencies:
```powershell
cd D:\kiansantang\bapas-bandung\registration-app
npm install
```

#### Install Operator App Dependencies:
```powershell
cd D:\kiansantang\bapas-bandung\operator-app
npm install
```

#### Install Display App Dependencies:
```powershell
cd D:\kiansantang\bapas-bandung\display-app
npm install
```

#### Install Petugas App Dependencies:
```powershell
cd D:\kiansantang\bapas-bandung\petugas-app
npm install
```

**Catatan**: Proses install dependencies bisa memakan waktu 15-20 menit tergantung kecepatan internet.

---

### Step 4: Setup Database (2 menit)

#### Check Database File:
```powershell
# Pastikan file database ada
cd D:\kiansantang\bapas-bandung\backend
dir bapas.db

# Jika file ada, ✅ database siap digunakan
# Jika tidak ada, database akan dibuat otomatis saat backend dijalankan
```

#### Copy Database dari PC Lama (Optional):
```
Jika ingin menggunakan data dari PC lama:
1. Copy file "bapas.db" dari PC lama
2. Paste ke folder "backend" di PC baru
3. Replace jika ada konfirmasi
4. ✅ Data lama akan tersedia
```

---

### Step 5: Konfigurasi (5 menit)

#### Check Backend Port:
```javascript
// File: backend/server.js
const PORT = process.env.PORT || 3000;

// Default: http://localhost:3000
```

#### Check Frontend Config:
```javascript
// File: registration-app/src/config.js
export const API_URL = 'http://localhost:3000/api'

// File: operator-app/src/config.js
export const API_URL = 'http://localhost:3000/api'

// File: display-app/src/config.js
export const API_URL = 'http://localhost:3000/api'

// File: petugas-app/src/config.js
export const API_URL = 'http://localhost:3000/api'
```

#### Untuk Network Access (Multi-PC):
```javascript
// Ganti localhost dengan IP address server
export const API_URL = 'http://192.168.1.100:3000/api'

// Cara cek IP address:
// CMD → ipconfig → IPv4 Address
```

---

### Step 6: Jalankan Aplikasi (5 menit)

#### Start Backend:
```powershell
# Terminal 1: Backend
cd D:\kiansantang\bapas-bandung\backend
npm start

# Output:
# 🚀 Server running on http://localhost:3000
# ✅ Database connected
# ✅ Socket.IO initialized
```

#### Start Registration App:
```powershell
# Terminal 2: Registration
cd D:\kiansantang\bapas-bandung\registration-app
npm run dev

# Output:
# ➜  Local:   http://localhost:5173/
# ✅ Ready in XXXms
```

#### Start Operator App:
```powershell
# Terminal 3: Operator
cd D:\kiansantang\bapas-bandung\operator-app
npm run dev

# Output:
# ➜  Local:   http://localhost:5174/
```

#### Start Display App:
```powershell
# Terminal 4: Display
cd D:\kiansantang\bapas-bandung\display-app
npm run dev

# Output:
# ➜  Local:   http://localhost:5175/
```

#### Start Petugas App:
```powershell
# Terminal 5: Petugas
cd D:\kiansantang\bapas-bandung\petugas-app
npm run dev

# Output:
# ➜  Local:   http://localhost:5176/
```

---

### Step 7: Test Aplikasi (5 menit)

#### Test Backend:
```
1. Buka browser
2. Kunjungi: http://localhost:3000/api/health
3. Jika muncul: {"status":"ok"} → ✅ Backend running
```

#### Test Registration App:
```
1. Buka: http://localhost:5173
2. Pilih layanan
3. Isi form
4. Klik "Daftar"
5. ✅ Jika berhasil, antrian terbuat
```

#### Test Operator App:
```
1. Buka: http://localhost:5174
2. Login: operator / operator123
3. ✅ Dashboard muncul
```

#### Test Display App:
```
1. Buka: http://localhost:5175
2. ✅ Display antrian muncul
```

#### Test Petugas App:
```
1. Buka: http://localhost:5176
2. Login: petugas / petugas123
3. ✅ Dashboard muncul
```

---

## 🔧 Setup Printer Thermal (Optional)

### Install Driver Printer:
```
1. Colokkan printer thermal (RPP02N) ke USB
2. Windows akan auto-detect
3. Atau install driver manual dari CD/website
4. Set sebagai default printer
5. ✅ Test print dari Notepad
```

### Setup Auto-Print:
```
1. Buka Chrome
2. Settings → Site Settings → Pop-ups
3. Add: http://localhost:5173
4. Allow pop-ups
5. ✅ Auto-print akan works
```

**Dokumentasi lengkap**: `SETUP-RPP02N-THERMAL-PRINTER.md`

---

## 🌐 Setup Network (Multi-PC)

### Scenario: 1 Server + Multiple Clients

#### PC Server (Backend + Database):
```
1. Install semua aplikasi
2. Jalankan backend
3. Check IP address:
   CMD → ipconfig → IPv4 Address
   Contoh: 192.168.1.100
4. ✅ Server ready
```

#### PC Client (Registration/Operator/Display):
```
1. Install Node.js
2. Copy aplikasi yang dibutuhkan
3. Update config.js:
   export const API_URL = 'http://192.168.1.100:3000/api'
4. npm install
5. npm run dev
6. ✅ Client ready
```

#### Firewall Settings:
```
1. PC Server: Allow port 3000
   Control Panel → Windows Firewall
   → Advanced Settings → Inbound Rules
   → New Rule → Port → TCP 3000 → Allow
2. ✅ Done
```

---

## 🚀 Auto-Start (Optional)

### Buat Batch File untuk Start Semua:

#### File: `start-all.bat`
```batch
@echo off
echo Starting KIANSANTANG System...

REM Start Backend
start "Backend" cmd /k "cd /d D:\kiansantang\bapas-bandung\backend && npm start"
timeout /t 5

REM Start Registration App
start "Registration" cmd /k "cd /d D:\kiansantang\bapas-bandung\registration-app && npm run dev"
timeout /t 3

REM Start Operator App
start "Operator" cmd /k "cd /d D:\kiansantang\bapas-bandung\operator-app && npm run dev"
timeout /t 3

REM Start Display App
start "Display" cmd /k "cd /d D:\kiansantang\bapas-bandung\display-app && npm run dev"
timeout /t 3

REM Start Petugas App
start "Petugas" cmd /k "cd /d D:\kiansantang\bapas-bandung\petugas-app && npm run dev"

echo All applications started!
pause
```

#### Cara Menggunakan:
```
1. Save file sebagai "start-all.bat"
2. Double-click untuk menjalankan
3. ✅ Semua aplikasi akan start otomatis
```

---

## 🔍 Troubleshooting

### Issue 1: Node.js tidak dikenali

**Gejala**:
```
'node' is not recognized as an internal or external command
```

**Solusi**:
```
1. Restart Command Prompt
2. Atau restart komputer
3. Check PATH:
   - System Properties → Environment Variables
   - PATH harus include: C:\Program Files\nodejs
4. Reinstall Node.js jika perlu
```

---

### Issue 2: npm install gagal

**Gejala**:
```
npm ERR! network timeout
npm ERR! network This is a problem related to network connectivity
```

**Solusi**:
```
1. Check koneksi internet
2. Coba lagi: npm install
3. Atau gunakan npm cache clean --force
4. Lalu npm install lagi
```

---

### Issue 3: Port sudah digunakan

**Gejala**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solusi**:
```
1. Check aplikasi yang menggunakan port:
   netstat -ano | findstr :3000

2. Kill process:
   taskkill /PID [PID_NUMBER] /F

3. Atau ganti port di server.js:
   const PORT = 3001
```

---

### Issue 4: Database error

**Gejala**:
```
Error: SQLITE_CANTOPEN: unable to open database file
```

**Solusi**:
```
1. Check file bapas.db ada di folder backend
2. Check permission folder (read/write)
3. Atau delete bapas.db dan restart backend
   (database baru akan dibuat otomatis)
```

---

### Issue 5: Frontend tidak bisa connect ke backend

**Gejala**:
```
Network Error
Failed to fetch
```

**Solusi**:
```
1. Pastikan backend running:
   http://localhost:3000/api/health

2. Check config.js:
   API_URL harus benar

3. Check CORS di backend:
   server.js → app.use(cors())

4. Restart backend dan frontend
```

---

## ✅ Checklist Instalasi

### Pre-Installation:
- [ ] Node.js v18+ terinstall
- [ ] Project files sudah di-copy
- [ ] Koneksi internet tersedia

### Installation:
- [ ] Backend dependencies installed
- [ ] Registration app dependencies installed
- [ ] Operator app dependencies installed
- [ ] Display app dependencies installed
- [ ] Petugas app dependencies installed

### Configuration:
- [ ] Database file tersedia
- [ ] Config.js sudah disesuaikan
- [ ] Firewall configured (jika network)

### Testing:
- [ ] Backend running (port 3000)
- [ ] Registration app running (port 5173)
- [ ] Operator app running (port 5174)
- [ ] Display app running (port 5175)
- [ ] Petugas app running (port 5176)
- [ ] Semua aplikasi bisa diakses
- [ ] Login berhasil
- [ ] Buat antrian berhasil

### Production:
- [ ] Auto-start script dibuat (optional)
- [ ] Printer configured (optional)
- [ ] Network setup (jika multi-PC)
- [ ] User training done
- [ ] **READY FOR PRODUCTION!** ✅

---

## 📞 Support

### Dokumentasi Tambahan:
- `README.md` - Overview sistem
- `SETUP-RPP02N-THERMAL-PRINTER.md` - Setup printer
- `AUTO-PRINT-SETUP.md` - Setup auto-print
- `FITUR-THERMAL-PRINTER.md` - Dokumentasi thermal printer

### Default Login:
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

## 🎉 Selesai!

Jika semua checklist ✅, sistem KIANSANTANG siap digunakan!

**Total waktu instalasi**: 45-60 menit

**Sistem sudah running di**:
- Backend: http://localhost:3000
- Registration: http://localhost:5173
- Operator: http://localhost:5174
- Display: http://localhost:5175
- Petugas: http://localhost:5176

**Selamat menggunakan KIANSANTANG!** 🚀
