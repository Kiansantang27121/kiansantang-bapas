# Fitur Display Modern - BAPAS Bandung

## 🎨 Tampilan Display Baru

Tampilan display telah diupgrade dengan desain modern dan canggih yang mencakup:

### ✨ Fitur Utama

#### 1. **4 Loket Antrian**
- Tampilan grid 2x2 untuk 4 loket
- Setiap loket menampilkan:
  - Nomor loket
  - Status (Aktif/Nonaktif)
  - Nomor antrian yang sedang dipanggil
  - Nama layanan
  - Nama klien
  - Nama operator (jika ada)
- Animasi pulse untuk antrian yang dipanggil
- Color coding untuk status

#### 2. **Logo Instansi**
- Upload logo di dashboard operator
- Ditampilkan di header display
- Format: PNG, JPG, SVG
- Ukuran otomatis disesuaikan

#### 3. **Video Display**
- Upload video promosi/informasi
- Auto-play dan loop
- Format: MP4, WebM, OGG
- Ditampilkan di bawah loket

#### 4. **Running Text**
- Teks berjalan di bawah header
- Animasi marquee smooth
- Warna gradient menarik (kuning-orange)
- Dapat diubah dari dashboard

#### 5. **Statistik Real-time**
- Total antrian hari ini
- Jumlah menunggu
- Jumlah sedang dilayani
- Jumlah selesai
- Update otomatis

#### 6. **Daftar Petugas Bertugas**
- Menampilkan operator yang aktif
- Diambil dari loket yang sedang beroperasi
- Avatar dengan inisial nama
- Username operator

#### 7. **Antrian Menunggu**
- Top 6 antrian menunggu
- Nomor urut
- Nomor antrian
- Nama layanan
- Waktu pendaftaran

## 🎯 Design System

### Color Palette
- **Background**: Gradient slate-900 → blue-900 → slate-900
- **Primary**: Blue-600 to Indigo-700
- **Accent**: Yellow-400 to Orange-500
- **Cards**: Slate-800 to Slate-900
- **Borders**: Blue-500

### Typography
- **Header**: 3xl, Bold
- **Loket Number**: 5xl, Bold
- **Queue Number**: 4xl, Bold
- **Stats**: 2xl, Bold

### Effects
- Glass morphism
- Gradient backgrounds
- Pulse animation
- Hover transitions
- Shadow-2xl

## ⚙️ Pengaturan Display (Dashboard Operator)

### Menu: Display Settings

#### Informasi Umum
- Nama Kantor
- Alamat Kantor
- Nomor Telepon
- Jam Operasional
- Running Text
- Interval Refresh (ms)

#### Upload Media
- **Logo Instansi**
  - Upload gambar
  - Preview
  - Hapus logo
  
- **Video Display**
  - Upload video
  - Preview dengan controls
  - Hapus video
  - Max size: 50MB

#### Preview
- Link langsung ke display
- Buka di tab baru

## 🔧 Backend API

### New Endpoints

#### Upload File
```
POST /api/upload/file
Authorization: Bearer <token> (Admin only)

Body:
{
  "filename": "logo.png",
  "data": "base64_encoded_data",
  "type": "logo" | "video"
}

Response:
{
  "url": "/uploads/logo_1234567890.png",
  "filename": "logo_1234567890.png"
}
```

#### Delete File
```
DELETE /api/upload/file/:filename
Authorization: Bearer <token> (Admin only)
```

### New Settings
- `logo_url` - URL logo instansi
- `video_url` - URL video display
- `running_text` - Teks berjalan
- `display_layout` - Layout display (modern/classic)

## 📱 Responsive Design

Display dioptimalkan untuk:
- **Large Screen**: 1920x1080 (Full HD)
- **Ultra Wide**: 2560x1080
- **4K**: 3840x2160

Recommended: Fullscreen mode (F11) untuk pengalaman terbaik

## 🚀 Cara Menggunakan

### 1. Setup Display

1. Login ke **Operator App** sebagai admin
2. Buka menu **Display**
3. Isi informasi umum:
   - Nama kantor
   - Alamat
   - Telepon
   - Jam operasional
   - Running text
4. Upload logo (opsional)
5. Upload video (opsional)
6. Klik **Simpan Pengaturan**

### 2. Jalankan Display

1. Buka browser di komputer/TV display
2. Akses: `http://localhost:5175`
3. Tekan F11 untuk fullscreen
4. Display akan auto-refresh sesuai interval

### 3. Operasional

- Operator memanggil antrian dari **Operator App**
- Display otomatis update via WebSocket
- Loket menampilkan antrian yang dipanggil
- Statistik update real-time
- Running text berjalan terus menerus

## 🎨 Customization

### Mengubah Warna
Edit `display-app/src/AppModern.jsx`:
```jsx
// Background gradient
className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"

// Header gradient
className="bg-gradient-to-r from-blue-600 to-indigo-700"

// Running text gradient
className="bg-gradient-to-r from-yellow-500 to-orange-500"
```

### Mengubah Animasi
Edit `display-app/src/index.css`:
```css
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 20s linear infinite; /* Ubah durasi */
}
```

### Mengubah Jumlah Loket
Edit `display-app/src/AppModern.jsx`:
```jsx
// Ubah slice(0, 4) menjadi jumlah yang diinginkan
countersRes.data.slice(0, 4)

// Ubah grid layout
className="grid grid-cols-2 gap-4" // 2x2 = 4 loket
// Untuk 6 loket: grid-cols-3 (3x2)
// Untuk 8 loket: grid-cols-4 (4x2)
```

## 📊 Performance

### Optimizations
- WebSocket untuk real-time updates
- Lazy loading untuk media
- Optimized re-renders
- Efficient data fetching
- CSS animations (GPU accelerated)

### Recommendations
- Gunakan SSD untuk video storage
- Compress video sebelum upload
- Optimize logo size (max 500KB)
- Stable internet connection
- Modern browser (Chrome/Edge recommended)

## 🐛 Troubleshooting

### Display tidak update
- Check WebSocket connection
- Refresh browser (Ctrl+F5)
- Check backend running
- Check network connection

### Logo/Video tidak muncul
- Check file format
- Check file size (max 50MB)
- Check uploads folder permission
- Check URL di settings

### Running text tidak berjalan
- Check browser support
- Clear cache
- Check CSS loaded
- Inspect console for errors

### Loket tidak menampilkan antrian
- Check operator sudah panggil antrian
- Check counter_number match
- Check queue status = 'called'
- Check WebSocket events

## 🔐 Security

- File upload hanya untuk admin
- File validation di backend
- Base64 encoding untuk transfer
- Sanitize filename
- Check file extension
- Max file size limit

## 📝 Notes

- Display app tidak memerlukan login
- Semua data public (kecuali admin features)
- Auto-refresh untuk data consistency
- Fullscreen recommended untuk production
- Test dengan data dummy sebelum go-live

## 🎉 Fitur Tambahan (Future)

- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Custom color schemes
- [ ] Multiple video playlist
- [ ] Weather widget
- [ ] News ticker
- [ ] QR code untuk feedback
- [ ] Voice announcement
- [ ] Custom fonts
- [ ] Layout templates

---

**Tampilan display modern siap digunakan!** 🚀
