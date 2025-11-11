# 🎬 Panduan Step-by-Step: Video Muncul di Display

## ✅ CHECKLIST PERSIAPAN

Sebelum mulai, pastikan:
- [ ] Backend running (port 3000)
- [ ] Operator app running (port 5174)
- [ ] Display app running (port 5175)
- [ ] Punya file video (format apapun)

---

## 📋 LANGKAH 1: Pastikan Semua Aplikasi Running

### Cek Status:

**Buka 3 Terminal/Command Prompt:**

#### Terminal 1 - Backend:
```powershell
cd d:\kiansantang\bapas-bandung\backend
npm run dev
```

**Tunggu sampai muncul:**
```
Database initialized successfully
Server running on port 3000
API: http://localhost:3000/api
```

#### Terminal 2 - Operator App:
```powershell
cd d:\kiansantang\bapas-bandung\operator-app
npm run dev
```

**Tunggu sampai muncul:**
```
Local: http://localhost:5174/
```

#### Terminal 3 - Display App:
```powershell
cd d:\kiansantang\bapas-bandung\display-app
npm run dev
```

**Tunggu sampai muncul:**
```
Local: http://localhost:5175/
```

✅ **Semua running? Lanjut ke langkah 2!**

---

## 📋 LANGKAH 2: Login ke Operator App

### Buka Browser:
```
http://localhost:5174
```

### Login:
```
Username: admin
Password: admin123
```

### Klik "Login"

✅ **Berhasil login? Lanjut ke langkah 3!**

---

## 📋 LANGKAH 3: Buka Menu Display

### Di Operator App:

1. Lihat sidebar kiri
2. Cari menu **"Display"** (icon Monitor 🖥️)
3. Klik menu **"Display"**

✅ **Halaman Display Settings terbuka? Lanjut ke langkah 4!**

---

## 📋 LANGKAH 4: Prepare Video

### Pilih Video Anda:

**Option A: Gunakan Video Test (Recommended untuk test pertama)**
```
1. Buka browser baru
2. Copy link ini:
   http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
3. Paste di address bar → Enter
4. Video akan download (8.8 MB)
5. Simpan di folder Downloads
```

**Option B: Gunakan Video Anda Sendiri**
```
Pastikan:
- Format: MP4, AVI, MOV, MKV, atau format lain (akan auto-convert)
- Size: < 50MB (ideal < 20MB)
- Duration: < 5 menit
- Test play di VLC dulu
```

✅ **Video siap? Lanjut ke langkah 5!**

---

## 📋 LANGKAH 5: Upload Video

### Di Halaman Display Settings:

1. **Scroll ke section "Video Display"**
2. **Klik "Choose File"**
3. **Pilih video Anda** (dari Downloads atau folder lain)
4. **Klik "Open"**
5. **Lihat nama file muncul**
6. **Klik tombol "Upload Video"** (hijau)

### Tunggu Proses Upload:

**Anda akan lihat:**
```
- Button berubah: "Uploading..."
- Tunggu 5-30 detik (tergantung ukuran file)
```

**Jika video perlu convert (AVI, MOV, dll):**
```
- Tunggu lebih lama: 10-60 detik
- Backend sedang convert ke MP4
- Check terminal backend untuk progress
```

### Success Message:

**Jika MP4:**
```
"Video berhasil diupload!"
```

**Jika converted:**
```
"Video berhasil diupload dan diconvert!

Format asli: AVI
Format hasil: MP4 (H.264)

Video siap digunakan!"
```

✅ **Success message muncul? Lanjut ke langkah 6!**

---

## 📋 LANGKAH 6: Verify Upload

### Di Halaman Display Settings:

**Setelah upload berhasil, Anda akan lihat:**

1. **Preview video muncul** (kotak dengan video player)
2. **Video bisa di-play** (klik play button)
3. **Tombol "Hapus Video"** muncul (merah)

### Test Preview:
```
1. Klik play di preview
2. Video harus play
3. Jika play → Upload berhasil!
4. Jika tidak → Ada masalah, ulangi upload
```

✅ **Preview video play? Lanjut ke langkah 7!**

---

## 📋 LANGKAH 7: Buka Display App

### Buka Tab Browser Baru:
```
http://localhost:5175
```

### Anda akan lihat:
```
- Display dengan layout KPP
- Header dengan logo dan jam
- Panel loket di kiri
- Area video di kanan (LIHAT DI SINI!)
- 4 loket preview di bawah
- Running text di paling bawah
```

### Check Area Video:

**Jika video loading:**
```
- Lihat spinner loading
- Tunggu max 30 detik
- Jika masih loading → Ada masalah
```

**Jika video play:**
```
✅ SUCCESS! Video muncul!
✅ Video auto-play
✅ Video loop terus menerus
```

**Jika error:**
```
- Lihat error message
- Baca solusi di error screen
- Follow troubleshooting di bawah
```

✅ **Video play di display? SELESAI! 🎉**

---

## 🐛 TROUBLESHOOTING

### Problem 1: Video Loading Terus-Menerus

**Solusi:**

1. **Buka Console (F12)**
   ```
   - Tekan F12 di display app
   - Tab Console
   - Lihat error messages
   ```

2. **Check Video URL**
   ```
   - Lihat "Video URL:" di console
   - URL harus: http://localhost:3000/uploads/video_xxxxx.mp4
   - Copy URL → Paste di tab baru
   - Jika 404 → File tidak ada
   ```

3. **Re-upload Video**
   ```
   - Kembali ke operator app
   - Hapus video (tombol merah)
   - Upload ulang
   - Tunggu success message
   - Refresh display (Ctrl+F5)
   ```

### Problem 2: Video Error / Failed to Load

**Solusi:**

1. **Check Format**
   ```
   - Video harus MP4 (H.264)
   - Atau format lain yang akan di-convert
   - Test video di VLC dulu
   ```

2. **Convert Manual**
   ```
   - Buka: https://cloudconvert.com
   - Upload video
   - Convert to: MP4
   - Download hasil
   - Upload ke sistem
   ```

3. **Use Test Video**
   ```
   - Download: BigBuckBunny.mp4 (link di atas)
   - Upload test video
   - Jika berhasil → Video Anda yang bermasalah
   ```

### Problem 3: Backend Tidak Running

**Solusi:**

1. **Check Terminal Backend**
   ```
   - Lihat terminal backend
   - Harus ada: "Server running on port 3000"
   - Jika tidak → Restart backend
   ```

2. **Restart Backend**
   ```powershell
   # Stop (Ctrl+C)
   # Start
   cd backend
   npm run dev
   ```

### Problem 4: Upload Gagal

**Solusi:**

1. **Check File Size**
   ```
   - Max 50MB
   - Jika lebih → Compress dulu
   ```

2. **Check Format**
   ```
   - Supported: MP4, AVI, MOV, MKV, dll
   - Jika tidak → Convert dulu
   ```

3. **Check Login**
   ```
   - Harus login sebagai admin
   - Re-login jika perlu
   ```

---

## 📊 QUICK CHECKLIST

Jika video tidak muncul, check:

- [ ] Backend running? (port 3000)
- [ ] Display app running? (port 5175)
- [ ] Video uploaded? (success message)
- [ ] Preview play di operator app?
- [ ] Video URL correct? (check console)
- [ ] File exists? (backend/uploads/)
- [ ] Format correct? (MP4 or converted)
- [ ] Browser console no errors?
- [ ] Tried refresh? (Ctrl+F5)
- [ ] Tried re-upload?

---

## 🎯 TIPS SUKSES

### 1. Gunakan Video Test Pertama
```
- Download BigBuckBunny.mp4
- Upload ke sistem
- Jika berhasil → Sistem OK
- Lalu coba video Anda
```

### 2. Keep File Small
```
- < 20MB ideal
- Faster upload
- Faster conversion
- Better performance
```

### 3. Check Console
```
- F12 adalah teman Anda
- Lihat error messages
- Lihat video URL
- Debug lebih mudah
```

### 4. Test di VLC Dulu
```
- Play video di VLC
- Pastikan tidak corrupt
- Pastikan play smooth
- Baru upload
```

### 5. Be Patient
```
- Upload: 5-30 detik
- Conversion: 10-60 detik
- Loading: 5-10 detik
- Total: 20-100 detik
```

---

## 🎉 SUCCESS!

Jika video sudah play di display:

✅ **Video muncul**
✅ **Auto-play**
✅ **Loop terus menerus**
✅ **No errors**

**SELAMAT! Anda berhasil!** 🎊

---

## 📞 BUTUH BANTUAN?

Jika masih ada masalah:

1. **Screenshot error message**
2. **Copy console logs** (F12 → Console)
3. **Note langkah yang sudah dicoba**
4. **Check dokumentasi:**
   - VIDEO-QUICK-FIX.md
   - VIDEO-TROUBLESHOOTING.md
   - MULTI-FORMAT-VIDEO.md

---

**Ikuti panduan ini step-by-step untuk sukses!** 🎬
