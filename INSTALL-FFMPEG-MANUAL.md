# 🔧 Install FFmpeg - Manual Steps

## 📥 CARA TERMUDAH (5 Menit)

### Step 1: Download FFmpeg

**Klik link ini:**
```
https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
```

- File size: ~100 MB
- Tunggu download selesai
- Save di folder Downloads

### Step 2: Extract File

1. Buka folder **Downloads**
2. Klik kanan **ffmpeg-release-essentials.zip**
3. Pilih **"Extract All..."**
4. Extract ke: **C:\** (root C drive)
5. Rename folder hasil extract menjadi: **ffmpeg**
   - Dari: `C:\ffmpeg-7.1-essentials_build`
   - Jadi: `C:\ffmpeg`

**Struktur folder harus:**
```
C:\ffmpeg\
  ├── bin\
  │   ├── ffmpeg.exe  ← PENTING!
  │   ├── ffplay.exe
  │   └── ffprobe.exe
  ├── doc\
  └── presets\
```

### Step 3: Add to PATH

**Cara 1: Via Windows Search (TERMUDAH)**
```
1. Tekan tombol Windows
2. Ketik: "environment"
3. Klik: "Edit the system environment variables"
4. Klik tombol: "Environment Variables..."
5. Di "System variables" (bawah), cari "Path"
6. Klik "Path" → Klik "Edit..."
7. Klik "New"
8. Ketik: C:\ffmpeg\bin
9. Klik "OK" → "OK" → "OK"
```

**Cara 2: Via Control Panel**
```
1. Control Panel
2. System and Security
3. System
4. Advanced system settings (kiri)
5. Environment Variables (bawah)
6. System variables → Path → Edit
7. New → C:\ffmpeg\bin
8. OK → OK → OK
```

### Step 4: Verify Installation

**Buka PowerShell BARU:**
```powershell
# Test FFmpeg
ffmpeg -version

# Harus muncul:
# ffmpeg version N-xxxxx-gxxxxxxx
# built with gcc ...
```

**Jika "command not found":**
- Close SEMUA terminal
- Close VSCode
- Buka terminal BARU
- Test lagi

### Step 5: Restart Backend

```powershell
# Stop backend (Ctrl+C di terminal backend)

# Start ulang
cd d:\kiansantang\bapas-bandung\backend
npm run dev

# Check console - HARUS muncul:
# ✅ FFmpeg is available for video conversion
```

## ✅ Verification Checklist

- [ ] FFmpeg downloaded (100 MB)
- [ ] Extracted to C:\ffmpeg
- [ ] Folder structure correct (C:\ffmpeg\bin\ffmpeg.exe exists)
- [ ] Added C:\ffmpeg\bin to PATH
- [ ] Closed all terminals
- [ ] Opened new terminal
- [ ] Tested: ffmpeg -version (works!)
- [ ] Backend restarted
- [ ] Console shows: "✅ FFmpeg is available"

## 🎬 After Installation

### Test Upload:

```
1. Operator app → Menu Display
2. Hapus video lama (jika ada)
3. Upload video baru
4. Backend console akan show:
   ✅ FFmpeg is available for video conversion
   Video uploaded to temp: temp_xxxxx.avi
   Converting avi to MP4...
   Processing: 25%... 50%... 75%... 100%
   Conversion completed successfully
5. Success message muncul
6. Preview plays
7. Display plays
```

## 🐛 Troubleshooting

### Q: "ffmpeg is not recognized"

**A: PATH belum ter-update**
```
1. Close ALL terminals
2. Close VSCode
3. Open new PowerShell
4. Test: ffmpeg -version
5. Jika masih error, check PATH:
   echo $env:PATH
   Harus ada: C:\ffmpeg\bin
```

### Q: Backend masih show "FFmpeg not found"

**A: Restart backend**
```
1. Stop backend (Ctrl+C)
2. Close terminal backend
3. Open terminal BARU
4. cd d:\kiansantang\bapas-bandung\backend
5. npm run dev
6. Check console
```

### Q: File ffmpeg.exe tidak ada

**A: Extract ulang**
```
1. Delete folder C:\ffmpeg
2. Extract ulang zip file
3. Pastikan extract ke C:\
4. Rename folder jadi "ffmpeg"
5. Check: C:\ffmpeg\bin\ffmpeg.exe harus ada
```

### Q: "Access denied" saat add PATH

**A: Run as Administrator**
```
1. Close PowerShell
2. Search "PowerShell"
3. Right-click → "Run as Administrator"
4. Ulangi add PATH
```

## 📊 Expected File Sizes

```
Download:
- ffmpeg-release-essentials.zip: ~100 MB

After Extract:
- C:\ffmpeg\: ~200 MB
- C:\ffmpeg\bin\ffmpeg.exe: ~130 MB
- C:\ffmpeg\bin\ffprobe.exe: ~130 MB
- C:\ffmpeg\bin\ffplay.exe: ~130 MB
```

## 🎯 Quick Commands

```powershell
# Check if FFmpeg installed
ffmpeg -version

# Check PATH
echo $env:PATH

# Find ffmpeg location
where.exe ffmpeg

# Test conversion
cd C:\ffmpeg\bin
.\ffmpeg.exe -version

# Restart backend
cd d:\kiansantang\bapas-bandung\backend
npm run dev
```

## 💡 Alternative: Portable Version

**Jika tidak bisa modify PATH:**

1. Extract FFmpeg ke project folder:
   ```
   d:\kiansantang\bapas-bandung\ffmpeg\
   ```

2. Update backend code untuk use local FFmpeg:
   ```javascript
   // backend/utils/videoConverter.js
   const ffmpegPath = 'D:\\kiansantang\\bapas-bandung\\ffmpeg\\bin\\ffmpeg.exe'
   ```

## 📞 Need Help?

**Check:**
1. File exists: `C:\ffmpeg\bin\ffmpeg.exe`
2. PATH contains: `C:\ffmpeg\bin`
3. Terminal restarted
4. Backend restarted
5. Test command: `ffmpeg -version`

**If still not working:**
- Screenshot error
- Share console output
- Check file locations

---

## 🚀 SUMMARY

```
1. Download: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
2. Extract to: C:\ffmpeg
3. Add to PATH: C:\ffmpeg\bin
4. Restart terminal
5. Test: ffmpeg -version
6. Restart backend
7. Upload video
8. Done! ✅
```

**Total time: 5-10 menit**

**File size: ~100 MB download, ~200 MB installed**

---

**Follow panduan ini step-by-step untuk install FFmpeg!** 🔧
