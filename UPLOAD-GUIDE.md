# Panduan Upload Logo dan Video - BAPAS Bandung

## 📤 Cara Upload File

### 1. Login sebagai Admin
- Buka http://localhost:5174
- Login dengan:
  - Username: `admin`
  - Password: `admin123`

### 2. Buka Menu Display
- Klik menu **"Display"** di sidebar
- Scroll ke section upload

### 3. Upload Logo
1. Klik **"Choose File"** di section "Logo Instansi"
2. Pilih file gambar (PNG, JPG, SVG)
3. Klik tombol **"Upload Logo"** (hijau)
4. Tunggu proses upload
5. Logo akan muncul di preview

### 4. Upload Video
1. Klik **"Choose File"** di section "Video Display"
2. Pilih file video (MP4, WebM, OGG)
3. Klik tombol **"Upload Video"** (hijau)
4. Tunggu proses upload (bisa lebih lama untuk file besar)
5. Video akan muncul di preview dengan controls

## 📋 Spesifikasi File

### Logo
- **Format**: PNG, JPG, JPEG, SVG
- **Ukuran Maksimal**: 5MB (recommended)
- **Resolusi**: 200x200px - 500x500px
- **Background**: Transparent (PNG) recommended
- **Aspect Ratio**: 1:1 (square) recommended

### Video
- **Format**: MP4 (H.264), WebM, OGG
- **Ukuran Maksimal**: 50MB
- **Resolusi**: 1280x720 (HD) atau 1920x1080 (Full HD)
- **Durasi**: 30 detik - 5 menit (recommended)
- **Bitrate**: 2-5 Mbps
- **Codec**: H.264 (MP4) atau VP8/VP9 (WebM)

## ✅ Perbaikan yang Dilakukan

### Backend
1. ✅ Increase body parser limit ke 100MB
   ```javascript
   app.use(express.json({ limit: '100mb' }))
   app.use(express.urlencoded({ extended: true, limit: '100mb' }))
   ```

2. ✅ Upload route dengan authentication
   ```javascript
   router.post('/file', authenticateToken, requireAdmin, ...)
   ```

3. ✅ Static file serving
   ```javascript
   app.use('/uploads', express.static('uploads'))
   ```

4. ✅ Folder uploads otomatis dibuat
   ```javascript
   if (!fs.existsSync(uploadsDir)) {
     fs.mkdirSync(uploadsDir, { recursive: true })
   }
   ```

### Frontend (Operator App)
1. ✅ Validasi file size (max 50MB)
2. ✅ Token authentication di semua request
3. ✅ Error handling yang lebih baik
4. ✅ Loading state saat upload
5. ✅ Full URL untuk file (http://localhost:3000/uploads/...)
6. ✅ FileReader error handling

## 🔧 Troubleshooting

### Error: "File terlalu besar"
**Penyebab**: File melebihi 50MB
**Solusi**:
- Compress video dengan tools (HandBrake, FFmpeg)
- Reduce resolution (720p instead of 1080p)
- Lower bitrate (2-3 Mbps)
- Trim video duration

### Error: "Gagal upload"
**Penyebab**: Token expired atau tidak ada
**Solusi**:
- Logout dan login kembali
- Check browser console untuk error detail
- Pastikan sudah login sebagai admin

### Error: "Failed to upload file"
**Penyebab**: Backend error atau folder permission
**Solusi**:
- Check backend console untuk error
- Pastikan folder `backend/uploads` ada dan writable
- Restart backend server

### Logo/Video tidak muncul di display
**Penyebab**: URL tidak valid atau CORS issue
**Solusi**:
- Check URL di settings (harus full URL)
- Refresh display app (Ctrl+F5)
- Check browser console
- Pastikan backend running

### Upload sangat lambat
**Penyebab**: File terlalu besar atau koneksi lambat
**Solusi**:
- Compress file sebelum upload
- Use wired connection instead of WiFi
- Close other applications
- Upload saat network tidak sibuk

## 🎬 Compress Video dengan FFmpeg

### Install FFmpeg
Download dari: https://ffmpeg.org/download.html

### Compress Video
```bash
# Reduce size dengan maintain quality
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M output.mp4

# Resize to 720p
ffmpeg -i input.mp4 -vf scale=1280:720 -b:v 2M output.mp4

# Trim duration (first 60 seconds)
ffmpeg -i input.mp4 -t 60 -c copy output.mp4

# Optimize for web
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k output.mp4
```

## 🖼️ Optimize Logo dengan Tools

### Online Tools
- **TinyPNG**: https://tinypng.com (PNG compression)
- **Squoosh**: https://squoosh.app (image optimization)
- **SVGOMG**: https://jakearchibald.github.io/svgomg/ (SVG optimization)

### Desktop Tools
- **GIMP**: Free image editor
- **Photoshop**: Professional tool
- **ImageOptim**: Mac optimization tool

## 📊 File Size Guidelines

### Logo
- Small: < 100KB (good)
- Medium: 100KB - 500KB (acceptable)
- Large: > 500KB (compress recommended)

### Video
- Short (< 1 min): 5-10MB
- Medium (1-3 min): 10-30MB
- Long (3-5 min): 30-50MB
- Very Long (> 5 min): Consider splitting or external hosting

## 🔐 Security Notes

1. **Authentication Required**
   - Only admin can upload files
   - Token-based authentication
   - Automatic token validation

2. **File Validation**
   - File size limit (50MB)
   - File type validation (client-side)
   - Filename sanitization (server-side)

3. **Storage**
   - Files stored in `backend/uploads/`
   - Unique filename with timestamp
   - Original filename preserved in metadata

## 📁 File Structure

```
backend/
├── uploads/
│   ├── .gitkeep
│   ├── logo_1699425678901.png
│   ├── video_1699425789012.mp4
│   └── ...
├── routes/
│   └── upload.js
└── server.js
```

## 🎯 Best Practices

### Logo
1. Use transparent PNG for logo
2. Square aspect ratio (1:1)
3. High resolution (at least 200x200px)
4. Simple design for better visibility
5. Optimize file size

### Video
1. Use MP4 with H.264 codec
2. 720p or 1080p resolution
3. 2-5 Mbps bitrate
4. 30-60 seconds duration (optimal)
5. Add audio if needed
6. Test playback before upload

### Upload Process
1. Prepare files beforehand
2. Compress if needed
3. Test with small file first
4. Upload during off-peak hours
5. Verify display after upload
6. Keep backup of original files

## 🆘 Getting Help

### Check Logs
1. **Backend Console**: Check terminal running backend
2. **Browser Console**: F12 → Console tab
3. **Network Tab**: F12 → Network tab → Check upload request

### Common Issues
- Token expired → Re-login
- File too large → Compress
- Wrong format → Convert
- Network error → Check connection
- Permission denied → Check admin role

### Contact Support
If issue persists:
1. Check all logs
2. Note error messages
3. Document steps to reproduce
4. Provide file details (size, format)

---

**Upload feature siap digunakan!** 📤

Pastikan backend running dan Anda sudah login sebagai admin.
