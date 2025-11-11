# ⚠️ SOLUSI: Video Loading Terus-Menerus

## 🔴 Masalah yang Terlihat

Dari console error:
```
Video stalled - network issue or slow connection
Video suspended - browser stopped loading
Video load timeout
```

**Artinya:** Browser tidak bisa load/decode video Anda.

## ✅ SOLUSI PASTI (Pilih Salah Satu)

### SOLUSI 1: Convert Video ke Format yang Benar (RECOMMENDED)

Video Anda kemungkinan bukan format MP4 (H.264) yang didukung browser.

#### Cara Tercepat - Online Converter:

**CloudConvert (Gratis, Mudah):**
```
1. Buka: https://cloudconvert.com/mp4-converter
2. Click "Select File" → Pilih video Anda
3. Convert to: MP4
4. Click "Convert"
5. Download hasil
6. Upload ke sistem BAPAS
```

**Convertio (Alternative):**
```
1. Buka: https://convertio.co/video-converter/
2. Upload video
3. To: MP4
4. Convert
5. Download
6. Upload ke sistem
```

#### Cara Terbaik - HandBrake (Software Gratis):

```
1. Download HandBrake: https://handbrake.fr/downloads.php
2. Install dan buka
3. Click "Open Source" → Pilih video Anda
4. Preset: Pilih "Web" → "Gmail Large 3 Minutes 720p30"
5. Click "Start Encode"
6. Tunggu selesai
7. Upload hasil ke sistem
```

### SOLUSI 2: Compress Video (Jika File Terlalu Besar)

Jika video Anda > 50MB, compress dulu:

**YouCompress (Gratis, Tanpa Install):**
```
1. Buka: https://www.youcompress.com/
2. Click "Select file" → Pilih video
3. Click "Upload File & Compress"
4. Tunggu proses
5. Download hasil
6. Upload ke sistem
```

**Clideo (Alternative):**
```
1. Buka: https://clideo.com/compress-video
2. Choose file
3. Compress
4. Download
5. Upload ke sistem
```

### SOLUSI 3: Gunakan Video Test (Untuk Cek System)

Download video test yang pasti work:

```
1. Buka browser
2. Copy link ini: 
   http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
3. Paste di address bar
4. Enter → Video akan download
5. Upload video test ini ke sistem
6. Jika berhasil → Video Anda yang bermasalah
7. Jika gagal → Ada masalah system
```

## 📋 Spesifikasi Video yang BENAR

Video harus memenuhi kriteria ini:

```
✅ Format: MP4
✅ Video Codec: H.264 (atau AVC)
✅ Audio Codec: AAC
✅ Resolution: 1280x720 (720p) ATAU 1920x1080 (1080p)
✅ File Size: Maksimal 50MB (ideal 10-20MB)
✅ Duration: Maksimal 5 menit (ideal 1-3 menit)
```

## 🔍 Cara Check Video Anda

### Menggunakan VLC Media Player:

```
1. Download VLC (gratis): https://www.videolan.org/vlc/
2. Install VLC
3. Buka video Anda di VLC
4. Menu: Tools → Media Information (atau Ctrl+I)
5. Tab "Codec"
6. Lihat:
   - Codec: Harus "H264" atau "AVC"
   - Type: Harus "Video"
```

**Jika bukan H264/AVC → HARUS CONVERT!**

## ⚡ Langkah-Langkah Lengkap

### Step 1: Prepare Video
```
1. Check video Anda dengan VLC
2. Jika bukan H264 → Convert dengan HandBrake
3. Jika > 50MB → Compress dengan YouCompress
4. Test play hasil convert di VLC
```

### Step 2: Upload ke Sistem
```
1. Login operator app (admin/admin123)
2. Menu "Display"
3. Section "Video Display"
4. Hapus video lama (jika ada)
5. Click "Choose File"
6. Pilih video yang sudah di-convert
7. Click "Upload Video"
8. Tunggu "Video berhasil diupload!"
```

### Step 3: Verify di Display
```
1. Buka display app (localhost:5175)
2. Refresh (Ctrl+F5)
3. Video harus play dalam 5-10 detik
4. Jika masih loading → Ulangi dari Step 1
```

## 🎬 Rekomendasi Setting HandBrake

Jika pakai HandBrake, gunakan setting ini:

```
Summary Tab:
- Format: MP4 File
- Web Optimized: ✅ (CENTANG INI!)

Dimensions Tab:
- Resolution: 1280x720

Video Tab:
- Video Codec: H.264 (x264)
- Framerate: 30
- Constant Quality: 22 (atau 20-24)

Audio Tab:
- Codec: AAC
- Bitrate: 128
```

## 🆘 Troubleshooting

### Q: Sudah convert tapi masih loading?
**A:** 
1. Check file size hasil convert (harus < 50MB)
2. Test play hasil convert di VLC
3. Pastikan Web Optimized di-centang di HandBrake
4. Coba compress lagi dengan YouCompress

### Q: Video test juga gagal?
**A:**
1. Check backend running (port 3000)
2. Restart backend
3. Clear browser cache (Ctrl+Shift+Del)
4. Coba browser lain (Chrome/Edge)

### Q: HandBrake terlalu lama?
**A:**
1. Gunakan online converter (CloudConvert)
2. Atau compress dulu dengan YouCompress
3. Atau gunakan preset "Fast" di HandBrake

### Q: Hasil convert quality jelek?
**A:**
1. Di HandBrake, ubah Constant Quality ke 20 (lebih bagus)
2. Atau gunakan resolution 1920x1080
3. Trade-off: Quality vs File Size

## 📊 Perbandingan Tools

| Tool | Kelebihan | Kekurangan | Rekomendasi |
|------|-----------|------------|-------------|
| **HandBrake** | Quality terbaik, Full control | Perlu install, Agak lambat | ⭐⭐⭐⭐⭐ BEST |
| **CloudConvert** | Mudah, Cepat, Online | Limit file size | ⭐⭐⭐⭐ Good |
| **YouCompress** | Mudah, Cepat | Quality agak turun | ⭐⭐⭐ OK |
| **VLC** | Gratis, Ringan | Perlu install | ⭐⭐⭐⭐ Good |

## ✅ Checklist

Sebelum upload:
- [ ] Video di-convert ke MP4 (H.264)
- [ ] File size < 50MB
- [ ] Test play di VLC - berhasil
- [ ] Duration < 5 menit
- [ ] Resolution 720p atau 1080p

Setelah upload:
- [ ] Success message muncul
- [ ] Preview di operator app
- [ ] Display play dalam 10 detik
- [ ] Video loop dengan baik
- [ ] No error di console

## 🎯 KESIMPULAN

**MASALAH UTAMA:** Video Anda bukan format MP4 (H.264)

**SOLUSI UTAMA:** Convert dengan HandBrake atau CloudConvert

**LANGKAH:**
1. Convert video → MP4 (H.264)
2. Compress jika > 50MB
3. Upload ulang
4. Test di display

**WAKTU:** 5-15 menit (tergantung ukuran video)

---

**Ikuti panduan ini step-by-step untuk fix video issue!** 🎬

**Priority: CONVERT VIDEO KE MP4 (H.264) DULU!**
