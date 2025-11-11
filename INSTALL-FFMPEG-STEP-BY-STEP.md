# 🎬 Install FFmpeg - Step by Step (5 Menit)

## ✅ CARA TERMUDAH - IKUTI INI!

### 📥 STEP 1: Download FFmpeg

**Saya sudah buka halaman download untuk Anda!**

Atau klik link ini:
```
https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
```

**Klik tombol download** dan tunggu selesai (~100 MB, 1-3 menit)

---

### 📂 STEP 2: Extract File

1. **Buka folder Downloads**
2. **Cari file:** `ffmpeg-release-essentials.zip`
3. **Klik kanan** → **"Extract All..."**
4. **Ubah lokasi extract ke:** `C:\`
   - Hapus path yang ada
   - Ketik: `C:\`
   - Klik "Extract"

**Hasil:** Folder `C:\ffmpeg-7.1-essentials_build` (atau similar)

---

### ✏️ STEP 3: Rename Folder

1. **Buka:** `C:\` di File Explorer
2. **Cari folder:** `ffmpeg-7.1-essentials_build` (atau nama similar)
3. **Klik kanan** → **"Rename"**
4. **Ubah nama jadi:** `ffmpeg` (lowercase, simple)
5. **Tekan Enter**

**Hasil:** Folder `C:\ffmpeg`

**Verify struktur:**
```
C:\ffmpeg\
  └── bin\
      ├── ffmpeg.exe   ← HARUS ADA!
      ├── ffplay.exe
      └── ffprobe.exe
```

---

### ⚙️ STEP 4: Add to PATH

**Double-click file ini:**
```
add-ffmpeg-to-path.bat
```

**Jika muncul "Need Administrator":**
1. Klik kanan `add-ffmpeg-to-path.bat`
2. Pilih **"Run as administrator"**
3. Klik "Yes" pada UAC prompt

**Tunggu sampai muncul "SUCCESS!"**

---

### ✅ STEP 5: Verify Installation

**Buka PowerShell BARU:**
```powershell
ffmpeg -version
```

**Harus muncul:**
```
ffmpeg version N-xxxxx-gxxxxxxx
built with gcc ...
configuration: --enable-gpl ...
```

**Jika "command not found":**
- Close SEMUA terminal
- Close VSCode
- Buka PowerShell BARU
- Test lagi

---

### 🔄 STEP 6: Restart Backend

**Di terminal backend:**
```powershell
# Stop backend (Ctrl+C)

# Start ulang
cd d:\kiansantang\bapas-bandung\backend
npm run dev
```

**Check console - HARUS muncul:**
```
✅ FFmpeg is available for video conversion
```

**Jika masih "FFmpeg not found":**
- Close terminal
- Buka terminal BARU
- Start backend lagi

---

### 🎬 STEP 7: Upload Video

**Di Operator App:**
```
1. Menu Display
2. Hapus video lama (tombol merah)
3. Upload video baru (format apapun)
4. Tunggu conversion (10-60 detik)
```

**Backend console akan show:**
```
Video uploaded to temp: temp_xxxxx.avi
Converting avi to MP4...
Processing: 25.50%
Processing: 50.75%
Processing: 75.25%
Processing: 100.00%
Conversion completed successfully
```

**Success message:**
```
✅ Video berhasil diupload dan diconvert!

Format asli: AVI
Format hasil: MP4 (H.264)

Video siap digunakan!
```

---

### 🎉 STEP 8: Test Display

**Buka display:**
```
http://localhost:5175
```

**Video harus:**
- ✅ Load dalam 5-10 detik
- ✅ Play otomatis
- ✅ Loop terus menerus
- ✅ No errors!

---

## 📋 Quick Checklist

- [ ] Download ffmpeg-release-essentials.zip (100 MB)
- [ ] Extract ke C:\
- [ ] Rename folder jadi "ffmpeg"
- [ ] Verify: C:\ffmpeg\bin\ffmpeg.exe exists
- [ ] Run: add-ffmpeg-to-path.bat (as admin)
- [ ] Close all terminals
- [ ] Test: ffmpeg -version (works!)
- [ ] Restart backend
- [ ] Console: "✅ FFmpeg is available"
- [ ] Upload video
- [ ] See conversion progress
- [ ] Video plays in display

---

## 🐛 Troubleshooting

### ❌ "ffmpeg is not recognized"

**Solusi:**
```
1. Close ALL terminals dan VSCode
2. Buka PowerShell BARU
3. Test: ffmpeg -version
4. Jika masih error:
   - Check: C:\ffmpeg\bin\ffmpeg.exe exists
   - Run: add-ffmpeg-to-path.bat as admin
   - Restart computer (last resort)
```

### ❌ "Need Administrator rights"

**Solusi:**
```
1. Klik kanan add-ffmpeg-to-path.bat
2. "Run as administrator"
3. Klik "Yes"
```

### ❌ Backend masih "FFmpeg not found"

**Solusi:**
```
1. Test di terminal: ffmpeg -version
2. Jika works di terminal tapi backend tidak:
   - Close terminal backend
   - Close VSCode
   - Buka VSCode BARU
   - Open terminal
   - Start backend
```

### ❌ File ffmpeg.exe tidak ada

**Solusi:**
```
1. Check folder: C:\ffmpeg\bin\
2. Jika kosong atau tidak ada:
   - Delete folder C:\ffmpeg
   - Download ulang zip file
   - Extract ulang ke C:\
   - Rename folder
```

---

## 🎯 Files Saya Buat Untuk Anda

1. **install-ffmpeg-simple.bat** - Buka halaman download
2. **add-ffmpeg-to-path.bat** - Add FFmpeg to PATH
3. **INSTALL-FFMPEG-STEP-BY-STEP.md** - Panduan ini

---

## 🚀 QUICK START

```
1. Download: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
2. Extract ke: C:\
3. Rename: ffmpeg
4. Run: add-ffmpeg-to-path.bat (as admin)
5. Test: ffmpeg -version
6. Restart backend
7. Upload video
8. Done! ✅
```

**Total waktu: 5-10 menit**

---

## 📞 Stuck?

**Check ini:**
1. File exists: `C:\ffmpeg\bin\ffmpeg.exe` ✅
2. PATH contains: `C:\ffmpeg\bin` ✅
3. Terminal restarted ✅
4. Backend restarted ✅
5. Test works: `ffmpeg -version` ✅

**Jika semua ✅ tapi masih error:**
- Restart computer
- Try lagi dari STEP 5

---

**Ikuti panduan ini step-by-step!** 🎬

**Setelah install, video akan auto-convert dan play sempurna!** ✨
