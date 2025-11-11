# Video Loading Terus-Menerus - Solusi

## 🔍 Diagnosis

Video yang terus loading biasanya disebabkan oleh:

### 1. **Format Video Salah**
- Video bukan MP4 (H.264)
- Codec tidak didukung browser
- Container format salah

### 2. **File Terlalu Besar**
- File > 50MB
- Browser kehabisan memory
- Network timeout

### 3. **Video Corrupt**
- File rusak saat upload
- Encoding error
- Incomplete download

### 4. **Network Issue**
- Backend tidak running
- File tidak ada di server
- CORS atau permission issue

## ✅ Solusi Cepat

### Solusi 1: Convert Video ke MP4 (H.264)

#### Online Converter (Paling Mudah)
```
1. Buka: https://cloudconvert.com
2. Upload video Anda
3. Convert to: MP4
4. Video Codec: H.264
5. Audio Codec: AAC
6. Quality: Medium
7. Download hasil
8. Re-upload ke sistem
```

#### FFmpeg (Command Line)
```bash
# Basic conversion
ffmpeg -i input.avi -c:v libx264 -c:a aac output.mp4

# With optimization
ffmpeg -i input.avi \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output.mp4
```

#### HandBrake (GUI Application)
```
1. Download: https://handbrake.fr
2. Open video file
3. Preset: "Web" → "Gmail Large 3 Minutes 720p30"
4. Start Encode
5. Upload hasil
```

### Solusi 2: Compress Video

#### Jika File > 50MB
```bash
# Reduce bitrate
ffmpeg -i input.mp4 -b:v 2M output.mp4

# Reduce resolution
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4

# Reduce both
ffmpeg -i input.mp4 \
  -vf scale=1280:720 \
  -b:v 2M \
  -c:a aac \
  -b:a 128k \
  output.mp4
```

#### Online Compression
```
1. https://www.youcompress.com
2. Upload video
3. Wait for compression
4. Download compressed video
5. Re-upload
```

### Solusi 3: Check Video Info

#### Using VLC Media Player
```
1. Open video di VLC
2. Tools → Media Information (Ctrl+I)
3. Tab "Codec"
4. Check:
   - Video Codec: harus H264 atau AVC
   - Audio Codec: harus AAC atau MP3
   - Container: harus MPEG-4
```

#### Using MediaInfo
```
1. Download: https://mediaarea.net/en/MediaInfo
2. Open video
3. Check:
   - Format: MPEG-4
   - Video: AVC (H.264)
   - Audio: AAC
```

### Solusi 4: Test Video Locally

#### Before Upload
```
1. Play video di VLC
2. Check tidak ada error
3. Check duration benar
4. Check quality OK
5. Check file size < 50MB
```

#### Test URL After Upload
```
1. Upload video
2. Copy URL dari error message atau console
3. Paste URL di browser tab baru
4. Tekan Enter
```

**Expected:**
- Video download atau play
- No 404 error

**If 404:**
- File tidak ada di server
- Re-upload needed

### Solusi 5: Complete Re-upload

#### Step by Step
```
1. Operator app → Menu Display
2. Klik "Hapus Video" (jika ada)
3. Prepare video:
   - Format: MP4 (H.264)
   - Size: < 20MB (ideal)
   - Resolution: 720p
   - Test play locally
4. Upload video baru
5. Wait for "Video berhasil diupload!"
6. Check preview di operator app
7. Refresh display (Ctrl+F5)
8. Wait max 30 seconds
```

## 🎬 Recommended Video Settings

### Optimal Configuration
```
Format: MP4
Video Codec: H.264 (AVC)
Audio Codec: AAC
Resolution: 1280x720 (720p)
Frame Rate: 30 fps
Video Bitrate: 2-3 Mbps
Audio Bitrate: 128 kbps
Duration: 30 seconds - 3 minutes
File Size: 5-20 MB
```

### FFmpeg Command (Optimal)
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 22 \
  -vf scale=1280:720 \
  -r 30 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -t 180 \
  output.mp4
```

**Explanation:**
- `-c:v libx264`: H.264 codec
- `-preset slow`: Better compression
- `-crf 22`: Quality (18-28, lower=better)
- `-vf scale=1280:720`: 720p resolution
- `-r 30`: 30 fps
- `-c:a aac`: AAC audio
- `-b:a 128k`: Audio bitrate
- `-movflags +faststart`: Web optimization
- `-t 180`: Limit to 3 minutes

## 🔧 Advanced Troubleshooting

### Check Video Codec Details
```bash
# Using ffprobe
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=codec_name,profile,level \
  -of default=noprint_wrappers=1 \
  input.mp4

# Expected output:
codec_name=h264
profile=High
level=31
```

### Re-encode with Specific Profile
```bash
# Browser-compatible profile
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -profile:v baseline \
  -level 3.0 \
  -c:a aac \
  output.mp4
```

### Check File Integrity
```bash
# Verify video file
ffmpeg -v error -i input.mp4 -f null -

# No output = file OK
# Errors = file corrupt
```

## 📊 Comparison: Format Support

| Format | Browser Support | Recommended |
|--------|----------------|-------------|
| **MP4 (H.264)** | 99%+ | ✅ YES |
| WebM (VP8/VP9) | 90%+ | ⚠️ Alternative |
| OGG (Theora) | 70%+ | ❌ NO |
| AVI | 0% | ❌ NO |
| MKV | 0% | ❌ NO |
| MOV | Limited | ❌ NO |
| FLV | 0% | ❌ NO |

## 🎯 Checklist

Before uploading:
- [ ] Format: MP4 (H.264)
- [ ] Size: < 50MB (ideal < 20MB)
- [ ] Resolution: 720p or 1080p
- [ ] Duration: < 5 minutes
- [ ] Tested in VLC
- [ ] No errors when playing
- [ ] Audio works (optional)

After uploading:
- [ ] Success message received
- [ ] Preview shows in operator app
- [ ] URL is complete (http://localhost:3000/...)
- [ ] File exists in backend/uploads
- [ ] Display shows video (not loading forever)
- [ ] Video plays and loops
- [ ] No console errors

## 🆘 Still Loading Forever?

### Emergency Fix: Use Test Video

1. **Download test video:**
   ```
   http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
   ```

2. **Upload test video:**
   - Right-click → Save as
   - Upload via operator app
   - Should work immediately

3. **If test video works:**
   - ✅ System OK
   - ❌ Your video has issues
   - → Convert your video

4. **If test video also loading:**
   - ❌ System issue
   - → Check backend running
   - → Check browser (use Chrome/Edge)
   - → Clear cache
   - → Try incognito mode

### Contact Support

Provide:
1. Video file details (format, size, codec)
2. Screenshot of error
3. Console logs (F12)
4. Steps you've tried
5. Test video result

## 💡 Prevention Tips

1. **Always use MP4 (H.264)**
2. **Keep files small** (< 20MB ideal)
3. **Test locally first** (VLC)
4. **Use HandBrake** for conversion
5. **Check codec** before upload
6. **Compress if needed**
7. **Test after upload**

---

**Ikuti panduan ini untuk fix video loading issue** 🎬

Prioritas: Convert ke MP4 (H.264) dan compress < 20MB
