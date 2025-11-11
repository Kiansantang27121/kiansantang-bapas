# Quick Fix: Video Gagal Load

## ⚡ Langkah Cepat

### 1. Buka Browser Console di Display
```
1. Display app (localhost:5175)
2. Tekan F12
3. Tab Console
4. Lihat messages
```

**Cari:**
```
Settings loaded: {...}
Video URL: http://localhost:3000/uploads/...
Video load started
```

### 2. Check Video URL
**URL harus lengkap:**
```
✅ BENAR: http://localhost:3000/uploads/video_123456.mp4
❌ SALAH: /uploads/video_123456.mp4
❌ SALAH: uploads/video_123456.mp4
❌ SALAH: undefined
❌ SALAH: (kosong)
```

### 3. Test URL Langsung
```
1. Copy Video URL dari console
2. Paste di browser tab baru
3. Enter
```

**Hasil:**
- ✅ Video download/play → URL OK, masalah di player
- ❌ 404 Error → File tidak ada
- ❌ Cannot connect → Backend mati

### 4. Quick Fixes

#### Fix A: Re-upload Video
```
1. Operator app → Menu Display
2. Klik "Hapus Video" (jika ada)
3. Upload video baru (MP4, < 50MB)
4. Tunggu "Video berhasil diupload!"
5. Refresh display (Ctrl+F5)
```

#### Fix B: Restart Backend
```powershell
# Stop
Ctrl+C di terminal backend

# Start
npm run dev
```

#### Fix C: Check File Exists
```powershell
cd backend/uploads
dir

# Harus ada file: video_xxxxx.mp4
```

#### Fix D: Convert Video
Jika format salah, convert dulu:
```
Online: https://cloudconvert.com
Input: Video Anda
Output: MP4 (H.264)
Download → Upload ke sistem
```

## 🎯 Error Messages

### "MEDIA_ERR_SRC_NOT_SUPPORTED"
**Penyebab:** Format video tidak didukung
**Fix:** Convert ke MP4 (H.264)

### "MEDIA_ERR_NETWORK"
**Penyebab:** Gagal download video
**Fix:** 
- Check backend running
- Check file exists
- Check network connection

### "MEDIA_ERR_DECODE"
**Penyebab:** Video corrupt atau codec salah
**Fix:**
- Re-encode video
- Use different video file

### "Failed to load video" (no code)
**Penyebab:** URL salah atau file tidak ada
**Fix:**
- Check URL di console
- Test URL di browser
- Re-upload video

## 📋 Checklist Cepat

- [ ] Backend running? (port 3000)
- [ ] Video format MP4 (H.264)?
- [ ] Video size < 50MB?
- [ ] Upload success?
- [ ] URL lengkap di settings?
- [ ] File ada di uploads folder?
- [ ] Browser console checked?

## 🔄 Complete Reset (Last Resort)

```powershell
# 1. Stop all
Stop-Process -Name node -Force

# 2. Start backend
cd backend
npm run dev
# Wait for "Server running on port 3000"

# 3. Start display
cd display-app
npm run dev
# Wait for "Local: http://localhost:5175"

# 4. Re-upload video
# Operator app → Display → Upload

# 5. Refresh display
# Ctrl+F5
```

## 💡 Tips

1. **Use MP4 H.264** - Paling compatible
2. **Keep size small** - < 20MB ideal
3. **Test locally first** - Play di VLC
4. **Check console** - F12 adalah teman Anda
5. **Re-upload if stuck** - Kadang solve masalah

## 🆘 Masih Gagal?

Coba video test ini (paste di browser):
```
http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

Jika video test bisa play:
- ✅ Player OK
- ❌ Video Anda yang bermasalah
- → Convert/compress video Anda

Jika video test juga gagal:
- ❌ Player bermasalah
- → Check browser (Chrome/Edge recommended)
- → Clear cache
- → Try incognito mode

---

**Ikuti langkah ini untuk fix video issue dengan cepat** ⚡
