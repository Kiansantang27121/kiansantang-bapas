# 🎬 Video Tutorial Script - Instalasi KIANSANTANG

## 📹 Video 1: Install Node.js (5 menit)

### Scene 1: Intro (30 detik)
```
[Screen: Desktop Windows]
Narrator: "Halo! Di video ini kita akan install Node.js untuk menjalankan sistem KIANSANTANG"

[Show: Node.js logo]
Narrator: "Node.js adalah platform yang dibutuhkan untuk menjalankan aplikasi"
```

### Scene 2: Download (1 menit)
```
[Screen: Browser]
Narrator: "Pertama, buka browser dan kunjungi nodejs.org"

[Type: nodejs.org di address bar]
[Show: nodejs.org homepage]

Narrator: "Klik tombol hijau 'Download LTS'"
[Click: Download button]
[Show: File downloading]

Narrator: "Tunggu sampai download selesai"
```

### Scene 3: Install (2 menit)
```
[Screen: Downloads folder]
Narrator: "Buka file yang sudah didownload"
[Double-click: node-v18.x.x-x64.msi]

[Show: Installer window]
Narrator: "Klik Next"
[Click: Next button]

Narrator: "Centang 'I accept the terms'"
[Check: License checkbox]
[Click: Next]

Narrator: "Biarkan lokasi default, klik Next"
[Click: Next]

Narrator: "Pastikan semua fitur tercentang"
[Show: Features checklist]
[Click: Next]

Narrator: "Klik Install dan tunggu proses selesai"
[Click: Install]
[Show: Progress bar]

Narrator: "Klik Finish"
[Click: Finish]
```

### Scene 4: Verify (1 menit)
```
[Screen: Desktop]
Narrator: "Sekarang kita verify instalasi"

[Press: Win+R]
[Type: cmd]
[Press: Enter]

[Screen: Command Prompt]
Narrator: "Ketik: node --version"
[Type: node --version]
[Press: Enter]
[Show: v18.x.x]

Narrator: "Jika muncul version number, instalasi berhasil!"

[Type: npm --version]
[Press: Enter]
[Show: 9.x.x]

Narrator: "npm juga sudah terinstall. Perfect!"
```

### Scene 5: Outro (30 detik)
```
[Screen: Checklist]
✅ Node.js installed
✅ npm installed
✅ Ready for next step!

Narrator: "Node.js sudah terinstall. Di video berikutnya kita akan install aplikasi KIANSANTANG"
```

---

## 📹 Video 2: Install KIANSANTANG (10 menit)

### Scene 1: Intro (30 detik)
```
[Screen: Desktop]
Narrator: "Di video ini kita akan install sistem KIANSANTANG"

[Show: Folder structure diagram]
Narrator: "Sistem terdiri dari 5 aplikasi: Backend, Registration, Operator, Display, dan Petugas"
```

### Scene 2: Copy Files (2 menit)
```
[Screen: USB Drive]
Narrator: "Pertama, copy folder bapas-bandung dari USB"

[Show: bapas-bandung folder]
[Right-click: Copy]

[Navigate to: D:\]
[Create folder: kiansantang]
[Paste folder]

[Show: Progress]
Narrator: "Tunggu sampai copy selesai"

[Show: Final location]
D:\kiansantang\bapas-bandung\

Narrator: "Files sudah di-copy"
```

### Scene 3: Install Backend (2 menit)
```
[Screen: Command Prompt]
Narrator: "Sekarang kita install dependencies untuk Backend"

[Type: cd D:\kiansantang\bapas-bandung\backend]
[Press: Enter]

[Type: npm install]
[Press: Enter]

[Show: Installing packages...]
Narrator: "Tunggu proses install, ini akan memakan waktu beberapa menit"

[Show: added XXX packages]
Narrator: "Backend dependencies sudah terinstall"
```

### Scene 4: Install Frontend Apps (3 menit)
```
Narrator: "Sekarang install dependencies untuk aplikasi frontend"

[Type: cd ..\registration-app]
[Type: npm install]
[Wait for completion]

[Type: cd ..\operator-app]
[Type: npm install]
[Wait for completion]

[Type: cd ..\display-app]
[Type: npm install]
[Wait for completion]

[Type: cd ..\petugas-app]
[Type: npm install]
[Wait for completion]

Narrator: "Semua dependencies sudah terinstall"
```

### Scene 5: Start Applications (2 menit)
```
Narrator: "Sekarang kita jalankan semua aplikasi"

[Open: 5 Command Prompt windows]

Terminal 1:
[Type: cd D:\kiansantang\bapas-bandung\backend]
[Type: npm start]
[Show: Server running on port 3000]

Terminal 2:
[Type: cd D:\kiansantang\bapas-bandung\registration-app]
[Type: npm run dev]
[Show: Local: http://localhost:5173]

Terminal 3:
[Type: cd D:\kiansantang\bapas-bandung\operator-app]
[Type: npm run dev]
[Show: Local: http://localhost:5174]

Terminal 4:
[Type: cd D:\kiansantang\bapas-bandung\display-app]
[Type: npm run dev]
[Show: Local: http://localhost:5175]

Terminal 5:
[Type: cd D:\kiansantang\bapas-bandung\petugas-app]
[Type: npm run dev]
[Show: Local: http://localhost:5176]

Narrator: "Semua aplikasi sudah running!"
```

### Scene 6: Test (1 menit)
```
[Open: Browser]
Narrator: "Sekarang kita test aplikasi"

[Navigate to: http://localhost:5173]
[Show: Registration app]
Narrator: "Aplikasi registrasi berjalan"

[Navigate to: http://localhost:5174]
[Show: Login page]
[Type: operator / operator123]
[Click: Login]
[Show: Dashboard]
Narrator: "Operator app berjalan"

[Navigate to: http://localhost:5175]
[Show: Display antrian]
Narrator: "Display app berjalan"

Narrator: "Semua aplikasi berhasil diinstall dan berjalan!"
```

### Scene 7: Outro (30 detik)
```
[Screen: Checklist]
✅ Files copied
✅ Dependencies installed
✅ All apps running
✅ Login successful
✅ READY TO USE!

Narrator: "Instalasi selesai! Sistem KIANSANTANG siap digunakan"
```

---

## 📹 Video 3: Setup Printer Thermal (5 menit)

### Scene 1: Hardware Setup (2 menit)
```
[Show: Printer RPP02N]
Narrator: "Di video ini kita akan setup printer thermal RPP02N"

[Show: Pasang kertas thermal]
Narrator: "Pertama, pasang kertas thermal 58mm"

[Show: Colokkan USB]
Narrator: "Colokkan kabel USB ke printer dan komputer"

[Show: Nyalakan printer]
Narrator: "Nyalakan printer, LED akan menyala"

[Show: Tekan tombol FEED]
Narrator: "Test printer dengan tekan tombol FEED"
[Show: Kertas keluar]
Narrator: "Jika kertas keluar, hardware sudah OK"
```

### Scene 2: Install Driver (1 menit)
```
[Screen: Windows notification]
[Show: "Installing device driver software..."]
Narrator: "Windows akan auto-install driver"

[Show: "Device ready to use"]
Narrator: "Driver sudah terinstall"

[Open: Control Panel → Devices and Printers]
[Show: RPP02N printer]
Narrator: "Printer sudah terdeteksi"
```

### Scene 3: Set Default Printer (1 menit)
```
[Screen: Devices and Printers]
[Right-click: RPP02N]
[Click: Set as default printer]
[Show: Checkmark on printer]

Narrator: "Printer sudah di-set sebagai default"
```

### Scene 4: Test Print (1 menit)
```
[Open: Notepad]
[Type: "TEST PRINT"]
[Click: File → Print]
[Select: RPP02N]
[Click: Print]

[Show: Tiket tercetak]
Narrator: "Test print berhasil! Printer siap digunakan"
```

---

## 📹 Video 4: Setup Auto-Print (3 menit)

### Scene 1: Allow Pop-ups (1 menit)
```
[Screen: Chrome browser]
[Navigate to: http://localhost:5173]

[Click: Lock icon di address bar]
[Click: Site settings]
[Scroll to: Pop-ups and redirects]
[Select: Allow]

Narrator: "Pop-ups sudah diizinkan untuk auto-print"
```

### Scene 2: Test Auto-Print (2 menit)
```
[Screen: Registration app]
Narrator: "Sekarang kita test auto-print"

[Click: Pilih layanan]
[Fill: Form registrasi]
[Click: Daftar]

[Show: Print dialog muncul otomatis]
Narrator: "Print dialog muncul otomatis"

[Click: Print]
[Show: Tiket tercetak]

Narrator: "Tiket berhasil dicetak! Auto-print sudah berfungsi"
```

---

## 📹 Video 5: Setup Network (Multi-PC) (7 menit)

### Scene 1: Check IP Address (1 menit)
```
[Screen: PC Server]
Narrator: "Untuk setup network, pertama kita cari IP address server"

[Open: Command Prompt]
[Type: ipconfig]
[Press: Enter]
[Highlight: IPv4 Address: 192.168.1.100]

Narrator: "IP address server adalah 192.168.1.100"
```

### Scene 2: Update Config (2 menit)
```
[Screen: VS Code atau Notepad]
[Open: registration-app/src/config.js]

[Show: Before]
export const API_URL = 'http://localhost:3000/api'

[Edit: Change to]
export const API_URL = 'http://192.168.1.100:3000/api'

[Save file]

Narrator: "Config sudah diupdate dengan IP server"
```

### Scene 3: Firewall Settings (2 menit)
```
[Screen: Control Panel]
[Navigate to: Windows Firewall]
[Click: Advanced Settings]
[Click: Inbound Rules]
[Click: New Rule]

[Select: Port]
[Next]
[Select: TCP]
[Type: 3000]
[Next]
[Select: Allow the connection]
[Next]
[Check: All profiles]
[Next]
[Name: KIANSANTANG Backend]
[Finish]

Narrator: "Firewall sudah dikonfigurasi"
```

### Scene 4: Test dari PC Client (2 menit)
```
[Screen: PC Client]
[Open: Browser]
[Navigate to: http://192.168.1.100:3000/api/health]
[Show: {"status":"ok"}]

Narrator: "Backend bisa diakses dari PC client"

[Navigate to: http://localhost:5173]
[Show: Registration app]
[Test: Buat antrian]
[Show: Berhasil]

Narrator: "Client berhasil connect ke server!"
```

---

## 🎬 Tips Recording

### Equipment:
- **Screen Recorder**: OBS Studio / Camtasia
- **Microphone**: Clear audio quality
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps

### Recording Settings:
```
- Zoom in untuk detail (Ctrl + Mouse Wheel)
- Slow down untuk step penting
- Highlight cursor untuk visibility
- Pause saat waiting (install, loading)
- Add text overlay untuk emphasis
```

### Editing:
```
- Cut waiting time (install, loading)
- Add background music (soft, non-intrusive)
- Add text annotations
- Add chapter markers
- Add end screen dengan links
```

### Publishing:
```
Platform: YouTube
Title: "Tutorial Instalasi KIANSANTANG - Sistem Antrian BAPAS"
Description: Include links ke dokumentasi
Tags: KIANSANTANG, BAPAS, Tutorial, Instalasi
Thumbnail: Professional design dengan logo
```

---

## 📝 Checklist Video Production

### Pre-Production:
- [ ] Script completed
- [ ] Test run instalasi
- [ ] Prepare clean PC for recording
- [ ] Setup recording software
- [ ] Test audio quality

### Production:
- [ ] Record Video 1: Install Node.js
- [ ] Record Video 2: Install KIANSANTANG
- [ ] Record Video 3: Setup Printer
- [ ] Record Video 4: Setup Auto-Print
- [ ] Record Video 5: Setup Network

### Post-Production:
- [ ] Edit videos (cut, trim, enhance)
- [ ] Add music and sound effects
- [ ] Add text overlays
- [ ] Add intro/outro
- [ ] Create thumbnails
- [ ] Export in HD quality

### Publishing:
- [ ] Upload to YouTube
- [ ] Add descriptions and tags
- [ ] Create playlist
- [ ] Share links
- [ ] Update documentation

---

## 🎉 Hasil Akhir

**5 Video Tutorial**:
1. Install Node.js (5 menit)
2. Install KIANSANTANG (10 menit)
3. Setup Printer Thermal (5 menit)
4. Setup Auto-Print (3 menit)
5. Setup Network Multi-PC (7 menit)

**Total Duration**: ~30 menit
**Target Audience**: IT Staff BAPAS
**Goal**: Self-service installation

**Video tutorial siap diproduksi!** 🎬
