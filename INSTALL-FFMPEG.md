# 🔧 Install FFmpeg - REQUIRED untuk Video Conversion

## ❌ MASALAH SAAT INI

**FFmpeg TIDAK TERINSTALL** → Video conversion GAGAL → File corrupt (62 bytes)

## ✅ SOLUSI: Install FFmpeg

### Windows Installation:

#### **Option 1: Chocolatey (TERMUDAH)**

```powershell
# 1. Install Chocolatey (jika belum)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Install FFmpeg
choco install ffmpeg -y

# 3. Restart terminal

# 4. Test
ffmpeg -version
```

#### **Option 2: Manual Download (RECOMMENDED)**

**Step 1: Download FFmpeg**
```
1. Buka: https://www.gyan.dev/ffmpeg/builds/
2. Download: ffmpeg-release-essentials.zip
3. Extract ke: C:\ffmpeg
```

**Step 2: Add to PATH**
```
1. Open: Control Panel
2. System → Advanced system settings
3. Environment Variables
4. System variables → Path → Edit
5. New → Add: C:\ffmpeg\bin
6. OK → OK → OK
7. Restart ALL terminals
```

**Step 3: Verify**
```powershell
# Buka terminal BARU
ffmpeg -version

# Harus show:
# ffmpeg version ...
# built with gcc ...
```

#### **Option 3: Winget (Windows 11)**

```powershell
# Install FFmpeg
winget install ffmpeg

# Restart terminal

# Test
ffmpeg -version
```

### Verification:

```powershell
# Test FFmpeg
ffmpeg -version

# Expected output:
ffmpeg version N-xxxxx-gxxxxxxx
built with gcc ...
configuration: --enable-gpl ...

# Test FFprobe
ffprobe -version

# Expected output:
ffprobe version N-xxxxx-gxxxxxxx
```

## 🔄 Setelah Install FFmpeg

### 1. Restart Backend

```powershell
# Stop backend (Ctrl+C)

# Start backend
cd d:\kiansantang\bapas-bandung\backend
npm run dev

# Check console:
# ✅ FFmpeg is available for video conversion
```

### 2. Delete Corrupt Videos

```powershell
cd d:\kiansantang\bapas-bandung\backend\uploads

# Delete corrupt file (62 bytes)
del video_1762578747266.mp4

# Optional: Delete all old videos
# del video_*.mp4
```

### 3. Re-upload Video

```
1. Operator app → Menu Display
2. Hapus video (tombol merah)
3. Upload video baru
4. Tunggu conversion (10-60 detik)
5. Check success message
6. Verify preview plays
```

## 📊 Expected Behavior

### SEBELUM Install FFmpeg:

```
❌ FFmpeg not found
❌ Conversion disabled
❌ Only MP4/WebM accepted
❌ File corrupt jika format lain
```

### SETELAH Install FFmpeg:

```
✅ FFmpeg is available
✅ Auto-conversion enabled
✅ 14 formats supported
✅ Convert to MP4 (H.264)
✅ Video plays perfectly
```

## 🎯 Backend Console Output

### Without FFmpeg:

```
⚠️ FFmpeg not found. Video conversion will be disabled.
Only MP4 and WebM videos will be supported.
```

### With FFmpeg:

```
✅ FFmpeg is available for video conversion
Video uploaded to temp: temp_1762578747266.avi
Converting avi to MP4...
FFmpeg command: ffmpeg -i temp_1762578747266.avi ...
Processing: 25.50%
Processing: 50.75%
Processing: 75.25%
Processing: 100.00%
Conversion completed successfully
Conversion successful: video_1762578747266.mp4
```

## 🐛 Troubleshooting

### Q: FFmpeg command not found setelah install?

**A: PATH belum ter-update**
```
1. Restart ALL terminals
2. Restart VSCode
3. Check PATH:
   echo $env:PATH
4. Harus ada: C:\ffmpeg\bin
5. Jika tidak, add manual (lihat Step 2)
```

### Q: "Access denied" saat add PATH?

**A: Run as Administrator**
```
1. Close terminal
2. Right-click PowerShell
3. "Run as Administrator"
4. Ulangi add PATH
```

### Q: Chocolatey install gagal?

**A: Use manual download**
```
Gunakan Option 2 (Manual Download)
Lebih reliable dan no admin needed
```

### Q: Backend masih show "FFmpeg not found"?

**A: Restart backend**
```
1. Stop backend (Ctrl+C)
2. Close terminal
3. Open terminal BARU
4. cd backend
5. npm run dev
6. Check console
```

## 💡 Alternative: Upload MP4 Langsung

### Jika tidak bisa install FFmpeg:

**Convert video SEBELUM upload:**

1. **Online Converter:**
   ```
   https://cloudconvert.com/mp4-converter
   - Upload video
   - Convert to MP4
   - Video Codec: H.264
   - Download hasil
   - Upload ke sistem
   ```

2. **HandBrake:**
   ```
   https://handbrake.fr/downloads.php
   - Install HandBrake
   - Convert video
   - Preset: "Web"
   - Web Optimized: ✅
   - Upload hasil
   ```

3. **VLC:**
   ```
   - Media → Convert/Save
   - Add video
   - Convert
   - Profile: Video - H.264 + MP3 (MP4)
   - Start
   - Upload hasil
   ```

## 📋 Quick Checklist

- [ ] FFmpeg downloaded
- [ ] Extracted to C:\ffmpeg
- [ ] Added to PATH
- [ ] Restarted terminal
- [ ] Tested: ffmpeg -version
- [ ] Backend restarted
- [ ] Console shows: "✅ FFmpeg is available"
- [ ] Deleted corrupt videos
- [ ] Re-uploaded video
- [ ] Conversion successful
- [ ] Video plays in display

## 🎬 After Installation

### Test Conversion:

```powershell
# Test FFmpeg conversion
cd C:\ffmpeg\bin

# Convert test video
ffmpeg -i input.mp4 -c:v libx264 -c:a aac -preset fast -crf 23 output.mp4

# Should work without errors
```

### Upload Video:

```
1. Operator app
2. Menu Display
3. Upload video (any format)
4. Watch backend console
5. See conversion progress
6. Success message
7. Video plays
```

---

## 🚀 QUICK START

**Fastest way to get video working:**

```powershell
# 1. Download FFmpeg
# https://www.gyan.dev/ffmpeg/builds/
# Extract to C:\ffmpeg

# 2. Add to PATH
# Control Panel → System → Advanced → Environment Variables
# Path → New → C:\ffmpeg\bin

# 3. Restart terminal

# 4. Test
ffmpeg -version

# 5. Restart backend
cd d:\kiansantang\bapas-bandung\backend
npm run dev

# 6. Upload video
# Operator app → Display → Upload

# DONE! ✅
```

---

**Install FFmpeg untuk enable video conversion!** 🎬

**Tanpa FFmpeg, video conversion TIDAK AKAN WORK!** ⚠️
