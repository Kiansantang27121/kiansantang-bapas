# Multi-Format Video Support - BAPAS Bandung

## 🎬 Fitur Baru: Auto-Convert Video

Sistem sekarang mendukung upload video dalam berbagai format dengan **auto-conversion** ke MP4 (H.264).

## ✅ Format Video yang Didukung

### Supported Formats (14 formats):
```
✅ MP4   - MPEG-4 Part 14
✅ AVI   - Audio Video Interleave
✅ MOV   - QuickTime Movie
✅ WMV   - Windows Media Video
✅ FLV   - Flash Video
✅ MKV   - Matroska Video
✅ WebM  - Web Media
✅ MPEG  - Moving Picture Experts Group
✅ MPG   - MPEG Video
✅ 3GP   - 3GPP Multimedia
✅ M4V   - iTunes Video
✅ OGV   - Ogg Video
✅ VOB   - DVD Video Object
✅ TS    - MPEG Transport Stream
```

## 🔄 Cara Kerja Auto-Conversion

### Workflow:
```
1. User upload video (format apapun)
   ↓
2. Backend terima file
   ↓
3. Check format:
   - Jika MP4 → Langsung simpan
   - Jika bukan MP4 → Convert ke MP4
   ↓
4. Conversion process (FFmpeg):
   - Video Codec: H.264
   - Audio Codec: AAC
   - Resolution: 720p (max)
   - Frame Rate: 30 fps
   - Bitrate: Optimized
   ↓
5. Simpan hasil ke uploads/
   ↓
6. Return URL ke frontend
   ↓
7. Display play video
```

### Conversion Settings:
```javascript
Video Codec: libx264 (H.264)
Audio Codec: AAC
Preset: fast
CRF: 23 (quality)
Resolution: 1280x720 (maintain aspect ratio)
Frame Rate: 30 fps
Audio Bitrate: 128 kbps
Optimization: faststart (web streaming)
```

## 📋 Cara Menggunakan

### 1. Upload Video (Format Apapun)

**Via Operator App:**
```
1. Login sebagai admin
2. Menu "Display"
3. Section "Video Display"
4. Click "Choose File"
5. Pilih video (format apapun dari list)
6. Click "Upload Video"
7. Tunggu proses:
   - Upload: 5-30 detik
   - Conversion (jika perlu): 10-60 detik
8. Success message akan muncul:
   - Jika converted: "Video berhasil diupload dan diconvert!"
   - Jika tidak perlu: "Video berhasil diupload!"
```

### 2. Check Hasil

**Success Message akan show:**
- Format asli (AVI, MOV, dll)
- Format hasil (MP4)
- Status conversion
- Video siap digunakan

**Di Display:**
- Video langsung play
- Auto-loop
- Optimized untuk streaming

## ⚙️ Requirements

### Backend Requirements:

**FFmpeg Installation (Required untuk conversion):**

#### Windows:
```powershell
# Download FFmpeg
1. Buka: https://ffmpeg.org/download.html#build-windows
2. Download: ffmpeg-release-essentials.zip
3. Extract ke: C:\ffmpeg
4. Add to PATH:
   - Control Panel → System → Advanced → Environment Variables
   - Edit "Path"
   - Add: C:\ffmpeg\bin
5. Restart terminal
6. Test: ffmpeg -version
```

#### Linux:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# CentOS/RHEL
sudo yum install ffmpeg

# Test
ffmpeg -version
```

#### macOS:
```bash
# Using Homebrew
brew install ffmpeg

# Test
ffmpeg -version
```

### Without FFmpeg:

Jika FFmpeg tidak terinstall:
- ⚠️ Auto-conversion **DISABLED**
- ✅ MP4 dan WebM tetap bisa diupload
- ❌ Format lain akan **REJECTED**
- 💡 Install FFmpeg untuk full support

## 🎯 Best Practices

### 1. File Size
```
Recommended: < 20MB
Maximum: 50MB
Reason: Faster upload & conversion
```

### 2. Duration
```
Recommended: 30 seconds - 3 minutes
Maximum: 5 minutes
Reason: Better user experience
```

### 3. Resolution
```
Recommended: 1280x720 (720p)
Alternative: 1920x1080 (1080p)
Reason: Balance quality & size
```

### 4. Format Choice
```
Best: MP4 (no conversion needed)
Good: AVI, MOV, MKV (common formats)
OK: WMV, FLV, 3GP (will be converted)
```

## 📊 Conversion Time Estimates

| File Size | Duration | Conversion Time |
|-----------|----------|-----------------|
| 5 MB | 30 sec | ~10 seconds |
| 10 MB | 1 min | ~20 seconds |
| 20 MB | 2 min | ~40 seconds |
| 50 MB | 5 min | ~2 minutes |

*Times vary based on CPU performance*

## 🔍 Troubleshooting

### Issue 1: Conversion Failed

**Symptoms:**
```
Error: "Conversion failed, using original format"
```

**Solutions:**
1. Check FFmpeg installed:
   ```bash
   ffmpeg -version
   ```
2. Check file not corrupt:
   - Play in VLC
   - Try different file
3. Check file size < 50MB
4. Check backend console for errors

### Issue 2: FFmpeg Not Found

**Symptoms:**
```
⚠️ FFmpeg not found. Video conversion will be disabled.
```

**Solutions:**
1. Install FFmpeg (see Requirements)
2. Add FFmpeg to PATH
3. Restart backend
4. Check console: "✅ FFmpeg is available"

### Issue 3: Upload Timeout

**Symptoms:**
- Upload stuck
- No response

**Solutions:**
1. Check file size (< 50MB)
2. Check network connection
3. Increase timeout in backend
4. Try smaller file first

### Issue 4: Conversion Too Slow

**Symptoms:**
- Conversion takes > 5 minutes
- CPU usage high

**Solutions:**
1. Use smaller file
2. Pre-compress video
3. Use faster preset (edit videoConverter.js)
4. Upgrade server CPU

## 🛠️ Advanced Configuration

### Custom Conversion Settings

Edit `backend/utils/videoConverter.js`:

```javascript
// Faster conversion (lower quality)
.outputOptions([
  '-preset ultrafast',  // Change from 'fast'
  '-crf 28',           // Change from 23 (higher = smaller)
])

// Better quality (slower)
.outputOptions([
  '-preset slow',      // Change from 'fast'
  '-crf 18',          // Change from 23 (lower = better)
])

// Higher resolution
.outputOptions([
  '-vf scale=1920:1080:force_original_aspect_ratio=decrease',
])

// Lower resolution (smaller file)
.outputOptions([
  '-vf scale=854:480:force_original_aspect_ratio=decrease',
])
```

### Presets Comparison:

| Preset | Speed | Quality | File Size |
|--------|-------|---------|-----------|
| ultrafast | ⚡⚡⚡⚡⚡ | ⭐⭐ | Large |
| fast | ⚡⚡⚡⚡ | ⭐⭐⭐ | Medium |
| medium | ⚡⚡⚡ | ⭐⭐⭐⭐ | Medium |
| slow | ⚡⚡ | ⭐⭐⭐⭐⭐ | Small |

## 📈 Performance Monitoring

### Backend Console Logs:

```
✅ FFmpeg is available for video conversion
Video uploaded to temp: temp_1699425789012.avi
Converting avi to MP4...
FFmpeg command: ffmpeg -i temp_1699425789012.avi ...
Processing: 25.50%
Processing: 50.75%
Processing: 75.25%
Processing: 100.00%
Conversion completed successfully
Conversion successful: video_1699425789012.mp4
```

### Check Conversion Status:

**In Backend Console:**
- Watch for "Processing: X%"
- Check for errors
- Verify "Conversion completed successfully"

**In Operator App:**
- Wait for success message
- Check conversion info
- Verify preview

## 🎉 Benefits

### For Users:
✅ Upload video format apapun
✅ Tidak perlu convert manual
✅ Automatic optimization
✅ Faster workflow

### For System:
✅ Consistent format (MP4)
✅ Browser compatible
✅ Optimized streaming
✅ Better performance

### For Admin:
✅ Less support needed
✅ Fewer user errors
✅ Standardized output
✅ Quality control

## 📝 Checklist

### Before Upload:
- [ ] Video file ready
- [ ] File size < 50MB (ideal < 20MB)
- [ ] Duration < 5 minutes
- [ ] Test play locally

### After Upload:
- [ ] Success message received
- [ ] Check if converted (message will show)
- [ ] Preview in operator app
- [ ] Test in display app
- [ ] Verify loop works

### System Check:
- [ ] FFmpeg installed
- [ ] Backend running
- [ ] Uploads folder writable
- [ ] Temp folder exists
- [ ] Console shows no errors

## 🆘 Support

### Check System Status:

```bash
# Check FFmpeg
ffmpeg -version

# Check backend running
netstat -ano | findstr :3000

# Check folders
cd backend
dir uploads
dir temp
```

### Common Commands:

```bash
# Restart backend
cd backend
npm run dev

# Clear temp files
cd backend/temp
del *.*

# Check video info
ffprobe video.mp4
```

---

**Multi-format video support dengan auto-conversion siap digunakan!** 🎬

**Upload video format apapun, sistem akan handle conversion otomatis!**
