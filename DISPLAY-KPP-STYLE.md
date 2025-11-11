# Tampilan Display Style KPP - BAPAS Bandung

## 🎨 Design Overview

Tampilan display telah didesain ulang mengikuti style KPP (Kantor Pelayanan Pajak) dengan karakteristik:
- Border cyan tebal di seluruh layar
- Background hitam/dark
- Nomor antrian besar dengan warna kontras
- Layout yang jelas dan mudah dibaca
- Running text di bagian bawah

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Cyan Gradient)                                 │
│  Logo | Nama Kantor              Jam Digital            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────┐  ┌────────────────────────────────────┐  │
│  │ LOKET 2  │  │                                    │  │
│  ├──────────┤  │                                    │  │
│  │  NOMOR   │  │         VIDEO DISPLAY              │  │
│  │ ANTRIAN  │  │                                    │  │
│  ├──────────┤  │                                    │  │
│  │          │  │                                    │  │
│  │  B 002   │  │                                    │  │
│  │          │  │                                    │  │
│  └──────────┘  └────────────────────────────────────┘  │
│                                                           │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                           │
│  │L1  │ │L2  │ │L3  │ │L4  │  (4 Loket Preview)        │
│  │A002│ │B002│ │C002│ │D002│                            │
│  └────┘ └────┘ └────┘ └────┘                           │
├─────────────────────────────────────────────────────────┤
│  RUNNING TEXT (Red-Orange Gradient)                     │
│  ★★★ SELAMAT DATANG - MELAYANI DENGAN HATI ★★★         │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Fitur Utama

### 1. **Header dengan Logo Kemenkumham**
- Logo Kementerian Hukum dan HAM (default)
- Nama kantor dan alamat
- Jam digital real-time
- Background gradient cyan-teal
- Border cyan tebal

### 2. **Panel Loket Aktif (Kiri)**
- Label "LOKET X" dengan background dark
- Label "NOMOR ANTRIAN"
- Nomor antrian super besar:
  - Huruf prefix (cyan) - ukuran 8xl
  - Angka (kuning) - ukuran 9xl dengan pulse animation
- Nama layanan (cyan)
- Nama klien (gray)
- Border cyan 4px

### 3. **Area Video Display (Kanan)**
- Video auto-play dan loop
- Full size dengan object-cover
- Fallback placeholder jika belum ada video
- Border cyan 4px
- Background hitam

### 4. **4 Loket Preview (Bawah)**
- Grid 4 kolom untuk 4 loket
- Setiap loket menampilkan:
  - Label "Loket X"
  - Nomor antrian (huruf + angka)
  - Nama layanan (truncate)
- Border cyan 4px
- Background dark gradient

### 5. **Running Text (Paling Bawah)**
- Background gradient merah-orange
- Animasi marquee smooth (25 detik)
- Teks besar dan bold
- Border cyan di atas
- Duplikat teks untuk seamless loop

## 🎨 Color Scheme

### Primary Colors
- **Cyan/Teal**: `#06b6d4` (border, accent)
- **Yellow**: `#facc15` (nomor antrian)
- **Black**: `#000000` (background)
- **Dark Gray**: `#111827` - `#1f2937` (cards)

### Accent Colors
- **Red-Orange**: Gradient untuk running text
- **Cyan-Teal**: Gradient untuk header
- **Gray**: Text secondary

### Text Colors
- **White**: `#ffffff` (primary text)
- **Cyan**: `#06b6d4` (labels, prefix)
- **Yellow**: `#facc15` (nomor antrian)
- **Gray**: `#9ca3af` (secondary info)

## 📏 Typography

### Font Sizes
- **Header Title**: `text-3xl` (30px)
- **Clock**: `text-4xl` (36px)
- **Loket Label**: `text-4xl` (36px)
- **Queue Prefix**: `text-8xl` (96px)
- **Queue Number**: `text-9xl` (128px)
- **Running Text**: `text-2xl` (24px)
- **Loket Preview**: `text-2xl` - `text-3xl`

### Font Weights
- **Bold**: Semua text utama
- **Semibold**: Text secondary

## 🎭 Animations

### Pulse Animation
```css
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```
Digunakan untuk nomor antrian yang dipanggil.

### Marquee Animation
```css
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 25s linear infinite;
}
```
Digunakan untuk running text.

## 🔧 Konfigurasi

### Upload Logo
1. Login ke operator app sebagai admin
2. Menu **Display**
3. Upload logo di section "Logo Instansi"
4. Logo akan muncul di header display

### Upload Video
1. Login ke operator app sebagai admin
2. Menu **Display**
3. Upload video di section "Video Display"
4. Format: MP4, WebM, OGG
5. Video akan auto-play dan loop

### Edit Running Text
1. Login ke operator app sebagai admin
2. Menu **Display**
3. Edit field "Running Text"
4. Simpan pengaturan

### Edit Informasi Kantor
1. Menu **Display**
2. Edit:
   - Nama Kantor
   - Alamat
   - Telepon
   - Jam Operasional
3. Simpan pengaturan

## 📱 Responsive Behavior

### Recommended Resolution
- **1920x1080** (Full HD) - Optimal
- **1366x768** (HD) - Good
- **2560x1080** (Ultra Wide) - Excellent
- **3840x2160** (4K) - Perfect

### Fullscreen Mode
Tekan **F11** untuk fullscreen mode (recommended untuk production).

## 🎯 Use Cases

### Scenario 1: Panggilan Antrian
1. Operator memanggil antrian dari loket 2
2. Display menampilkan:
   - "LOKET 2" di panel kiri
   - Nomor antrian besar dengan pulse
   - Nama layanan dan klien
   - Update loket preview di bawah

### Scenario 2: Multiple Loket
1. 4 loket aktif bersamaan
2. Panel kiri menampilkan loket yang terakhir dipanggil
3. 4 loket preview menampilkan semua antrian aktif
4. Real-time update via WebSocket

### Scenario 3: Video Promosi
1. Admin upload video di dashboard
2. Video muncul di panel kanan
3. Auto-play dan loop
4. Tidak mengganggu display antrian

## 🔄 Data Flow

```
Operator App (Panggil Antrian)
         ↓
    Backend API
         ↓
   WebSocket Broadcast
         ↓
    Display App
         ↓
  Update UI Real-time
```

## 🎨 Customization

### Mengubah Warna Border
Edit `AppKPP.jsx`:
```jsx
// Cyan border
className="border-8 border-cyan-400"

// Ganti dengan warna lain:
className="border-8 border-blue-500"    // Biru
className="border-8 border-green-500"   // Hijau
className="border-8 border-purple-500"  // Ungu
```

### Mengubah Warna Running Text
```jsx
// Red-Orange gradient
className="bg-gradient-to-r from-red-600 to-orange-600"

// Ganti dengan:
className="bg-gradient-to-r from-blue-600 to-cyan-600"  // Biru
className="bg-gradient-to-r from-green-600 to-teal-600" // Hijau
```

### Mengubah Ukuran Nomor Antrian
```jsx
// Current
<span className="text-8xl">Prefix</span>
<span className="text-9xl">Number</span>

// Lebih besar
<span className="text-9xl">Prefix</span>
<span className="text-[10rem]">Number</span>
```

### Mengubah Kecepatan Running Text
Edit `index.css`:
```css
.animate-marquee {
  animation: marquee 25s linear infinite; /* Ubah 25s */
}

/* Lebih cepat: 15s */
/* Lebih lambat: 35s */
```

## 🐛 Troubleshooting

### Logo tidak muncul
- Check URL logo di settings
- Check format file (PNG, JPG, SVG)
- Check network connection
- Clear browser cache

### Video tidak play
- Check format video (MP4 recommended)
- Check file size (max 50MB)
- Check browser support
- Try different video codec

### Running text tidak smooth
- Check browser performance
- Close other tabs
- Update browser
- Check GPU acceleration

### Nomor antrian tidak update
- Check WebSocket connection
- Check backend running
- Refresh browser (Ctrl+F5)
- Check console for errors

## 📊 Performance Tips

1. **Optimize Video**
   - Compress video before upload
   - Use H.264 codec
   - Resolution: 1280x720 or 1920x1080
   - Bitrate: 2-5 Mbps

2. **Optimize Logo**
   - Use PNG with transparency
   - Max size: 500KB
   - Resolution: 200x200px
   - Compress with tools

3. **Browser Settings**
   - Enable hardware acceleration
   - Disable extensions
   - Use Chrome/Edge
   - Clear cache regularly

4. **Network**
   - Stable connection
   - Low latency
   - Dedicated network for display
   - Avoid WiFi if possible

## 🎉 Features Comparison

| Feature | Old Display | New Display (KPP Style) |
|---------|-------------|-------------------------|
| Layout | Modern cards | KPP style with borders |
| Border | Subtle | Thick cyan border |
| Queue Display | Medium size | Extra large |
| Loket Count | Variable | Fixed 4 loket |
| Video Area | Below | Right side (large) |
| Running Text | Top | Bottom |
| Logo | Optional | Kemenkumham default |
| Color Scheme | Blue gradient | Cyan/Yellow/Black |
| Animation | Smooth | Pulse + Marquee |

## 📝 Notes

- Display tidak memerlukan login
- Auto-refresh setiap 5 detik (configurable)
- WebSocket untuk real-time updates
- Fullscreen recommended untuk production
- Compatible dengan semua modern browsers

---

**Tampilan Display Style KPP siap digunakan!** 🚀

Refresh browser display (http://localhost:5175) untuk melihat tampilan baru.
