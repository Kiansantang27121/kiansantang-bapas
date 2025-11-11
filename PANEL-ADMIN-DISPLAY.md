# 🎛️ Panel Admin & Display - KIANSANTANG

## 📋 Overview

Dokumentasi untuk Panel Admin (Pengaturan) dan Panel Display (Layar Antrian) yang sudah **AKTIF** dan siap digunakan.

---

## 🔧 Panel Admin (Port 5174)

### **Akses:**
```
http://localhost:5174
```

### **Fungsi Utama:**
✅ **Pengaturan Sistem**
- Konfigurasi aplikasi
- Manajemen layanan
- Pengaturan jam operasional
- Konfigurasi counter/loket
- Upload logo dan branding
- Pengaturan running text

✅ **Manajemen User**
- Tambah/Edit/Hapus user
- Manajemen role (Admin, Petugas, PK, Struktural)
- Reset password
- Aktivasi/Deaktivasi akun

✅ **Manajemen Layanan**
- Tambah layanan baru
- Edit layanan existing
- Set estimasi waktu
- Aktifkan/Nonaktifkan layanan

✅ **Laporan & Statistik**
- Laporan harian
- Laporan bulanan
- Export data
- Grafik statistik

### **Login:**
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Administrator

### **Fitur Keamanan:**
- ✅ Authentication required
- ✅ Role-based access control
- ✅ Session management
- ✅ Audit log

---

## 📺 Panel Display (Port 5175)

### **Akses:**
```
http://localhost:5175
```

### **Fungsi Utama:**
✅ **Tampilan Antrian Real-time**
- Nomor antrian aktif
- Nomor loket/counter
- Nama layanan
- Auto-refresh setiap 3 detik

✅ **Informasi Tambahan**
- Running text
- Jam real-time
- Logo instansi
- Informasi kontak

✅ **Mode Fullscreen**
- Tekan `F11` untuk fullscreen
- Cocok untuk TV/Monitor besar
- Responsive design

✅ **Notifikasi Visual**
- Animasi saat antrian dipanggil
- Highlight nomor aktif
- Transisi smooth

### **Tidak Perlu Login:**
- Panel display bersifat public
- Langsung tampil saat dibuka
- Auto-start mode

### **Pengaturan Display:**
```javascript
// Interval refresh (ms)
const REFRESH_INTERVAL = 3000

// Durasi highlight (ms)
const HIGHLIGHT_DURATION = 5000

// Max antrian ditampilkan
const MAX_DISPLAY_QUEUES = 10
```

---

## 🚀 Cara Menjalankan

### **Opsi 1: Start All Apps (Recommended)**
```bash
# Jalankan semua aplikasi sekaligus
start-all-apps.bat
```

### **Opsi 2: Manual Start**

**Panel Admin:**
```bash
cd operator-app
npm run dev
```

**Panel Display:**
```bash
cd display-app
npm run dev
```

---

## 🎨 Tampilan UI

### **Panel Admin**
- Modern dashboard dengan sidebar
- Dark/Light mode toggle
- Responsive untuk tablet/desktop
- Material Design inspired

### **Panel Display**
- Minimalist & Clean
- High contrast untuk visibility
- Large fonts untuk jarak jauh
- Optimized untuk TV/Monitor

---

## 🔗 Integrasi

### **Panel Admin → Backend API**
```javascript
// Base URL
const API_URL = 'http://localhost:3000/api'

// Endpoints
GET    /api/settings
PUT    /api/settings
GET    /api/services
POST   /api/services
GET    /api/users
POST   /api/users
```

### **Panel Display → Backend API**
```javascript
// Base URL
const API_URL = 'http://localhost:3000/api'

// Endpoints
GET    /api/queue/current
GET    /api/queue/waiting
GET    /api/settings
```

### **WebSocket (Real-time)**
```javascript
// Socket.IO connection
const socket = io('http://localhost:3000')

// Events
socket.on('queue-called', (data) => {
  // Update display
})

socket.on('queue-updated', (data) => {
  // Refresh list
})
```

---

## 📱 Akses dari Index.html

Kedua panel sudah terintegrasi di halaman utama:

```html
<!-- Panel Admin -->
<div class="support-card active" 
     onclick="window.open('http://localhost:5174', '_blank')">
  <span class="support-status">✓ Aktif</span>
  <i class="fas fa-cog"></i>
  <h3>Admin</h3>
  <p>Pengaturan Sistem</p>
</div>

<!-- Panel Display -->
<div class="support-card active" 
     onclick="window.open('http://localhost:5175', '_blank')">
  <span class="support-status">✓ Aktif</span>
  <i class="fas fa-tv"></i>
  <h3>Display</h3>
  <p>Layar Antrian</p>
</div>
```

---

## 🎯 Use Cases

### **Panel Admin**
1. **Setup Awal Sistem**
   - Konfigurasi jam operasional
   - Upload logo instansi
   - Set running text
   - Tambah layanan

2. **Manajemen Harian**
   - Tambah user baru
   - Edit layanan
   - Lihat laporan
   - Monitor sistem

3. **Maintenance**
   - Backup data
   - Reset antrian
   - Update konfigurasi
   - Troubleshooting

### **Panel Display**
1. **Ruang Tunggu**
   - Tampil di TV/Monitor
   - Fullscreen mode
   - Auto-refresh

2. **Loket/Counter**
   - Monitor antrian
   - Lihat nomor aktif
   - Info layanan

3. **Informasi Publik**
   - Running text
   - Jam operasional
   - Kontak

---

## 🔧 Konfigurasi

### **Panel Admin - Config**
```javascript
// operator-app/src/config.js
export const CONFIG = {
  API_URL: 'http://localhost:3000/api',
  SOCKET_URL: 'http://localhost:3000',
  REFRESH_INTERVAL: 5000,
  SESSION_TIMEOUT: 3600000, // 1 hour
  MAX_FILE_SIZE: 5242880, // 5MB
}
```

### **Panel Display - Config**
```javascript
// display-app/src/config.js
export const CONFIG = {
  API_URL: 'http://localhost:3000/api',
  SOCKET_URL: 'http://localhost:3000',
  REFRESH_INTERVAL: 3000,
  HIGHLIGHT_DURATION: 5000,
  MAX_QUEUES: 10,
  AUTO_SCROLL: true,
}
```

---

## 🎨 Customization

### **Panel Admin - Theme**
```css
/* Primary Color */
--primary-color: #667eea;

/* Sidebar */
--sidebar-bg: #1e293b;
--sidebar-text: #f1f5f9;

/* Content */
--content-bg: #f8fafc;
--card-bg: #ffffff;
```

### **Panel Display - Theme**
```css
/* Background */
--bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Queue Card */
--card-bg: rgba(255, 255, 255, 0.95);
--card-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

/* Active Queue */
--active-bg: #10b981;
--active-text: #ffffff;
```

---

## 🐛 Troubleshooting

### **Panel Admin tidak bisa login**
```bash
# Check backend running
curl http://localhost:3000/api/health

# Check credentials
Username: admin
Password: admin123

# Clear browser cache
Ctrl + Shift + Delete
```

### **Panel Display tidak update**
```bash
# Check WebSocket connection
# Open browser console (F12)
# Look for Socket.IO connection logs

# Manual refresh
Ctrl + F5

# Check API
curl http://localhost:3000/api/queue/current
```

### **Port sudah digunakan**
```bash
# Kill process on port 5174
netstat -ano | findstr :5174
taskkill /PID [PID] /F

# Kill process on port 5175
netstat -ano | findstr :5175
taskkill /PID [PID] /F
```

---

## 📊 Status Indicators

### **Panel Admin**
- 🟢 **Aktif** - Badge hijau, border hijau, hover effect
- ✓ **Aktif** - Status badge di pojok kiri atas
- 🔵 **Dot Badge** - Indicator hijau berkedip

### **Panel Display**
- 🟢 **Aktif** - Badge hijau, border hijau, hover effect
- ✓ **Aktif** - Status badge di pojok kiri atas
- 🔵 **Dot Badge** - Indicator hijau berkedip

---

## 🎯 Best Practices

### **Panel Admin**
1. ✅ Logout setelah selesai
2. ✅ Backup data secara berkala
3. ✅ Gunakan password yang kuat
4. ✅ Monitor audit log
5. ✅ Update konfigurasi saat jam non-operasional

### **Panel Display**
1. ✅ Gunakan mode fullscreen
2. ✅ Set auto-refresh browser
3. ✅ Disable screen saver
4. ✅ Gunakan monitor/TV besar
5. ✅ Posisi strategis di ruang tunggu

---

## 📞 Support

Jika ada masalah:
1. Check `CARA-START-APLIKASI.md`
2. Check backend logs
3. Check browser console (F12)
4. Restart aplikasi
5. Contact IT support

---

## ✅ Checklist Aktivasi

- [x] Panel Admin sudah aktif (Port 5174)
- [x] Panel Display sudah aktif (Port 5175)
- [x] Badge status "✓ Aktif" ditampilkan
- [x] Border hijau pada card
- [x] Dot indicator berkedip
- [x] Hover effect berfungsi
- [x] Link ke aplikasi berfungsi
- [x] Terintegrasi di index.html

---

## 🎉 Status: AKTIF & SIAP DIGUNAKAN!

Kedua panel sudah **FULLY ACTIVE** dan siap digunakan! 🚀✨
