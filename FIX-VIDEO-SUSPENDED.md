# 🔧 Fix: Video Suspended Issue

## ❌ Masalah

Video terus "suspended - browser stopped loading" dan tidak pernah play.

## 🎯 Root Cause

**Video format TIDAK DIDUKUNG browser!**

Browser modern hanya support:
- ✅ MP4 dengan codec H.264
- ✅ WebM dengan codec VP8/VP9
- ❌ AVI, MOV, MKV, WMV, FLV (TIDAK DIDUKUNG)

## ✅ SOLUSI PASTI

### STEP 1: Test Video URL

**Buka test page:**
```
http://localhost:5175/test-video.html
```

**Atau test manual:**
1. Copy video URL dari console
2. Paste di browser tab baru
3. Tekan Enter

**Hasil:**
- ✅ Video play → Format OK
- ❌ Error/Suspended → Format SALAH

### STEP 2: Convert Video ke MP4 (H.264)

#### Option A: Online Converter (TERMUDAH)

**CloudConvert:**
```
1. Buka: https://cloudconvert.com/mp4-converter
2. Upload video Anda
3. Settings:
   - Format: MP4
   - Video Codec: H.264
   - Audio Codec: AAC
   - Quality: Medium atau High
4. Click "Convert"
5. Download hasil
6. Upload ke sistem
```

**Convertio:**
```
1. Buka: https://convertio.co/video-converter/
2. Upload video
3. To: MP4
4. Convert
5. Download
6. Upload ke sistem
```

#### Option B: HandBrake (TERBAIK)

**Download & Install:**
```
1. Download: https://handbrake.fr/downloads.php
2. Install HandBrake
3. Buka aplikasi
```

**Convert Video:**
```
1. Click "Open Source"
2. Pilih video Anda
3. Preset: "Web" → "Gmail Large 3 Minutes 720p30"
4. Destination: Pilih folder output
5. Click "Start Encode"
6. Tunggu selesai (5-15 menit)
7. Upload hasil ke sistem
```

**HandBrake Settings (Manual):**
```
Summary:
- Format: MP4 File
- Web Optimized: ✅ CENTANG INI!

Video:
- Video Codec: H.264 (x264)
- Framerate: 30
- Quality: Constant Quality 22

Audio:
- Codec: AAC
- Bitrate: 128

Dimensions:
- Resolution: 1280x720 (atau biarkan auto)
```

### STEP 3: Re-upload Video

**Di Operator App:**
```
1. Menu Display
2. Hapus video lama (tombol merah)
3. Upload video hasil convert
4. Tunggu success message
5. Check preview - harus bisa play
```

### STEP 4: Verify di Display

```
1. Refresh display (Ctrl+F5)
2. Video harus play dalam 5-10 detik
3. Jika masih suspended → Ulangi convert
```

## 🔍 Check Video Format

### Menggunakan VLC:

```
1. Open video di VLC
2. Tools → Media Information (Ctrl+I)
3. Tab "Codec"
4. Check:
   - Codec: Harus "H264" atau "AVC"
   - Type: Video
   - Container: MPEG-4
```

**Jika bukan H264 → HARUS CONVERT!**

### Menggunakan MediaInfo:

```
1. Download: https://mediaarea.net/en/MediaInfo
2. Install
3. Open video
4. Check:
   - Format: MPEG-4
   - Video codec: AVC (H.264)
   - Audio codec: AAC
```

## 📊 Spesifikasi Video yang BENAR

```
✅ Format: MP4
✅ Video Codec: H.264 (AVC)
✅ Audio Codec: AAC
✅ Container: MPEG-4
✅ Resolution: 1280x720 atau 1920x1080
✅ Frame Rate: 30 fps
✅ File Size: < 50MB
✅ Duration: < 5 menit
```

## 🎬 Test dengan Video Sample

**Download video test yang PASTI work:**
```
http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

**Cara test:**
```
1. Download video test
2. Upload ke sistem
3. Jika berhasil → Video Anda yang bermasalah
4. Jika gagal → Ada masalah system
```

## 🔧 Troubleshooting

### Q: Sudah convert tapi masih suspended?

**A: Check hasil convert:**
```
1. Play hasil convert di VLC
2. Check codec (harus H264)
3. Check Web Optimized di-centang
4. Try compress lagi dengan setting berbeda
```

### Q: HandBrake terlalu lambat?

**A: Gunakan preset Fast:**
```
Video Tab:
- Encoder Preset: Fast (instead of Medium)
atau
Gunakan online converter (CloudConvert)
```

### Q: File terlalu besar setelah convert?

**A: Adjust quality:**
```
HandBrake:
- Constant Quality: 25 (instead of 22)
- Resolution: 1280x720 (instead of 1920x1080)

atau

Compress dengan YouCompress:
https://www.youcompress.com/
```

### Q: Video test juga suspended?

**A: Browser issue:**
```
1. Try browser lain (Chrome/Edge)
2. Clear browser cache (Ctrl+Shift+Del)
3. Try incognito mode
4. Update browser
```

## 💡 Prevention

### Sebelum Upload:

1. ✅ **Check format** - Harus MP4
2. ✅ **Check codec** - Harus H.264
3. ✅ **Test di VLC** - Harus play
4. ✅ **Check size** - < 50MB
5. ✅ **Web optimized** - Centang di HandBrake

### Tools Recommended:

1. **HandBrake** - Best quality, full control
2. **CloudConvert** - Easy, fast, online
3. **VLC** - Check format & codec
4. **MediaInfo** - Detailed info

## 📋 Checklist

- [ ] Video format MP4?
- [ ] Video codec H.264?
- [ ] Audio codec AAC?
- [ ] Web optimized?
- [ ] File size < 50MB?
- [ ] Tested in VLC?
- [ ] Tested in test page?
- [ ] Uploaded to system?
- [ ] Preview plays in operator app?
- [ ] Display plays video?

## 🎯 Quick Fix Summary

```
1. Video suspended = Format salah
2. Convert ke MP4 (H.264) dengan HandBrake
3. Web Optimized: ✅ CENTANG
4. Re-upload
5. Done!
```

## 🆘 Still Not Working?

**Collect info:**
1. Video format (check VLC)
2. Video codec (check MediaInfo)
3. File size
4. Console errors (F12)
5. Test video result

**Then:**
1. Try test video (BigBuckBunny.mp4)
2. If test works → Your video needs convert
3. If test fails → System/browser issue

---

**SOLUSI UTAMA: CONVERT VIDEO KE MP4 (H.264)!** 🎬

**Tool: HandBrake atau CloudConvert**

**Setting: Web Optimized ✅**
