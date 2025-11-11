# 🚀 Cara Menjalankan Panel Admin & Display

## ✅ Status: KEDUA PANEL SUDAH BERJALAN!

Panel Admin (Port 5174) dan Display (Port 5175) sudah berhasil dijalankan dan siap digunakan.

---

## 🎯 Cara Akses

### **Panel Admin (Port 5174)**
```
http://localhost:5174
```
- **Login:** admin / admin123
- **Fungsi:** Pengaturan sistem, manajemen user, konfigurasi

### **Panel Display (Port 5175)**
```
http://localhost:5175
```
- **No Login Required** - Langsung tampil
- **Fungsi:** Layar antrian untuk ruang tunggu

---

## 🚀 Cara Menjalankan (3 Metode)

### **Metode 1: PowerShell Script (Recommended)**
```powershell
# Buka PowerShell di folder bapas-bandung
.\start-all.ps1
```

### **Metode 2: Manual per Aplikasi**

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

### **Metode 3: Batch File (Windows)**
```bash
# Buka Command Prompt
start-all-apps-simple.bat
```

---

## 🔍 Cek Status Aplikasi

### **Cek Port yang Sedang Berjalan:**
```powershell
# PowerShell
Get-NetTCPConnection -LocalPort 5174,5175 | Select LocalPort,State

# Command Prompt
netstat -ano | findstr :5174
netstat -ano | findstr :5175
```

### **Cek di Browser:**
- Panel Admin: http://localhost:5174
- Display: http://localhost:5175

---

## 🐛 Troubleshooting

### **Problem 1: Port Already in Use**
```powershell
# Kill process on port 5174
$process = Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
}

# Kill process on port 5175
$process = Get-NetTCPConnection -LocalPort 5175 -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
}
```

### **Problem 2: npm run dev Error**
```bash
# Reinstall dependencies
cd operator-app
npm install

cd ../display-app
npm install
```

### **Problem 3: Vite Not Found**
```bash
# Install Vite globally
npm install -g vite

# Or use npx
npx vite
```

### **Problem 4: Module Not Found**
```bash
# Clear cache and reinstall
cd operator-app
rm -rf node_modules package-lock.json
npm install

cd ../display-app
rm -rf node_modules package-lock.json
npm install
```

---

## 📋 Verifikasi Instalasi

### **Cek Package.json:**
```bash
# Panel Admin
cd operator-app
cat package.json

# Display
cd display-app
cat package.json
```

### **Cek Dependencies:**
```bash
# Panel Admin
cd operator-app
npm list

# Display
cd display-app
npm list
```

---

## 🎨 Tampilan di index.html

Kedua panel sudah aktif dengan indikator visual:

### **Panel Admin:**
- ✅ Badge hijau "✓ Aktif"
- 🟢 Dot indicator berkedip
- 🟩 Border hijau
- ⚙️ Icon: Settings/Cog
- 📝 Deskripsi: "Pengaturan Sistem"

### **Panel Display:**
- ✅ Badge hijau "✓ Aktif"
- 🟢 Dot indicator berkedip
- 🟩 Border hijau
- 📺 Icon: TV
- 📝 Deskripsi: "Layar Antrian"

---

## 🔧 Konfigurasi Port

Jika ingin mengubah port, edit file `vite.config.js`:

### **Panel Admin (operator-app/vite.config.js):**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174  // Ubah port di sini
  }
})
```

### **Display (display-app/vite.config.js):**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175  // Ubah port di sini
  }
})
```

---

## 📱 Akses dari Perangkat Lain

### **Expose ke Network:**
```bash
# Panel Admin
cd operator-app
npm run dev -- --host

# Display
cd display-app
npm run dev -- --host
```

Kemudian akses dari perangkat lain:
```
http://[IP-ADDRESS]:5174  # Panel Admin
http://[IP-ADDRESS]:5175  # Display
```

---

## 🎯 Quick Commands

### **Start Panel Admin:**
```powershell
cd D:\kiansantang\bapas-bandung\operator-app
npm run dev
```

### **Start Display:**
```powershell
cd D:\kiansantang\bapas-bandung\display-app
npm run dev
```

### **Start Both:**
```powershell
# Terminal 1
cd D:\kiansantang\bapas-bandung\operator-app
npm run dev

# Terminal 2 (new window)
cd D:\kiansantang\bapas-bandung\display-app
npm run dev
```

---

## ✅ Checklist

- [x] Panel Admin berjalan di port 5174
- [x] Display berjalan di port 5175
- [x] Kedua panel bisa diakses dari browser
- [x] Visual indicator aktif di index.html
- [x] Script PowerShell dibuat (start-all.ps1)
- [x] Dokumentasi lengkap tersedia

---

## 🎉 Status: BERHASIL!

Kedua panel sudah **AKTIF** dan **BERJALAN** dengan baik!

### **Akses Sekarang:**
- 🔧 Panel Admin: http://localhost:5174
- 📺 Display: http://localhost:5175
- 🏠 Dashboard: index.html

**Happy coding! 🚀✨**
