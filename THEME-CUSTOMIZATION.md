# Theme Customization - BAPAS Bandung Display

## 🎨 Fitur Theme Display

Sistem sekarang mendukung customization warna display secara penuh melalui dashboard operator.

## ✨ Komponen yang Dapat Dikustomisasi

### 1. **Border Color**
- Warna border utama di seluruh display
- Default: Cyan (#06b6d4)
- Digunakan di: Border luar, border panel, border video

### 2. **Header Gradient**
- Gradient 2 warna untuk header
- Default: Cyan → Teal (#06b6d4 → #14b8a6)
- Digunakan di: Header dengan logo dan jam

### 3. **Panel Gradient**
- Gradient 2 warna untuk panel/card
- Default: Gray-800 → Gray-900 (#1f2937 → #111827)
- Digunakan di: Panel loket, panel nomor antrian, 4 loket preview

### 4. **Running Text Gradient**
- Gradient 2 warna untuk background running text
- Default: Red → Orange (#dc2626 → #ea580c)
- Digunakan di: Background running text di bawah

### 5. **Queue Number Color**
- Warna nomor antrian
- Default: Yellow (#facc15)
- Digunakan di: Nomor antrian besar, label loket

### 6. **Accent Color**
- Warna accent/highlight
- Default: Cyan (#06b6d4)
- Digunakan di: Huruf prefix nomor antrian, label loket

## 🎯 Cara Menggunakan

### Via Dashboard Operator

1. **Login sebagai Admin**
   - Username: `admin`
   - Password: `admin123`

2. **Buka Menu Theme**
   - Klik menu **"Theme"** di sidebar
   - Icon: Palette (🎨)

3. **Pilih Theme Preset (Quick Setup)**
   - **Default**: Cyan/Teal theme (original)
   - **Blue**: Blue theme untuk tampilan profesional
   - **Green**: Green theme untuk nuansa segar
   - **Purple**: Purple theme untuk tampilan modern
   - **Red**: Red theme untuk tampilan bold
   
   Klik salah satu preset untuk apply langsung

4. **Custom Colors (Manual)**
   - Gunakan color picker untuk pilih warna
   - Atau input hex code manual (#RRGGBB)
   - Preview akan update real-time
   - Setiap section memiliki preview sendiri

5. **Simpan Theme**
   - Klik tombol **"Simpan Theme"**
   - Display akan auto-refresh dalam 5 detik
   - Theme langsung diterapkan

6. **Reset ke Default**
   - Klik tombol **"Reset Default"**
   - Konfirmasi reset
   - Theme kembali ke cyan/teal original

## 🎨 Theme Presets

### Default (Cyan/Teal)
```
Border: #06b6d4 (Cyan)
Header: #06b6d4 → #14b8a6 (Cyan → Teal)
Panel: #1f2937 → #111827 (Gray-800 → Gray-900)
Running: #dc2626 → #ea580c (Red → Orange)
Queue Number: #facc15 (Yellow)
Accent: #06b6d4 (Cyan)
```

### Blue
```
Border: #3b82f6 (Blue)
Header: #3b82f6 → #2563eb (Blue → Blue-600)
Panel: #1e3a8a → #1e40af (Blue-900 → Blue-800)
Running: #1d4ed8 → #2563eb (Blue-700 → Blue-600)
Queue Number: #fbbf24 (Amber)
Accent: #60a5fa (Blue-400)
```

### Green
```
Border: #10b981 (Emerald)
Header: #10b981 → #059669 (Emerald → Emerald-600)
Panel: #064e3b → #065f46 (Emerald-900 → Emerald-800)
Running: #047857 → #059669 (Emerald-700 → Emerald-600)
Queue Number: #fbbf24 (Amber)
Accent: #34d399 (Emerald-400)
```

### Purple
```
Border: #a855f7 (Purple)
Header: #a855f7 → #9333ea (Purple → Purple-600)
Panel: #581c87 → #6b21a8 (Purple-900 → Purple-800)
Running: #7c3aed → #9333ea (Purple-600 → Purple-600)
Queue Number: #fbbf24 (Amber)
Accent: #c084fc (Purple-400)
```

### Red
```
Border: #ef4444 (Red)
Header: #ef4444 → #dc2626 (Red → Red-600)
Panel: #7f1d1d → #991b1b (Red-900 → Red-800)
Running: #b91c1c → #dc2626 (Red-700 → Red-600)
Queue Number: #fbbf24 (Amber)
Accent: #f87171 (Red-400)
```

## 🖌️ Tips Memilih Warna

### Kontras
- Pastikan warna text dan background kontras tinggi
- Nomor antrian harus mudah dibaca dari jauh
- Gunakan tools seperti WebAIM Contrast Checker

### Konsistensi
- Gunakan warna dari palette yang sama
- Jangan mix terlalu banyak warna berbeda
- Maksimal 3-4 warna utama

### Brand Identity
- Sesuaikan dengan warna logo instansi
- Pertimbangkan warna resmi organisasi
- Konsisten dengan material branding lainnya

### Psikologi Warna
- **Biru**: Profesional, terpercaya, tenang
- **Hijau**: Segar, natural, positif
- **Merah**: Energik, urgent, bold
- **Ungu**: Modern, kreatif, premium
- **Kuning**: Optimis, friendly, attention-grabbing

### Accessibility
- Hindari kombinasi merah-hijau (color blind)
- Pastikan readable untuk semua orang
- Test di berbagai kondisi pencahayaan

## 🔧 Technical Details

### Database Settings
```javascript
theme_border_color: '#06b6d4'
theme_header_from: '#06b6d4'
theme_header_to: '#14b8a6'
theme_panel_from: '#1f2937'
theme_panel_to: '#111827'
theme_running_from: '#dc2626'
theme_running_to: '#ea580c'
theme_queue_number: '#facc15'
theme_accent: '#06b6d4'
```

### CSS Implementation
```jsx
// Border
style={{ borderColor: settings.theme_border_color }}

// Header gradient
style={{ 
  background: `linear-gradient(to right, ${settings.theme_header_from}, ${settings.theme_header_to})` 
}}

// Panel gradient
style={{ 
  background: `linear-gradient(to bottom right, ${settings.theme_panel_from}, ${settings.theme_panel_to})` 
}}

// Running text gradient
style={{ 
  background: `linear-gradient(to right, ${settings.theme_running_from}, ${settings.theme_running_to})` 
}}

// Queue number color
style={{ color: settings.theme_queue_number }}

// Accent color
style={{ color: settings.theme_accent }}
```

### Auto-Refresh
- Display auto-fetch settings setiap 5 detik
- Perubahan theme langsung terlihat
- Tidak perlu manual refresh

## 🎨 Custom Theme Examples

### Corporate Blue
```
Border: #1e40af
Header: #1e40af → #1e3a8a
Panel: #172554 → #1e3a8a
Running: #3b82f6 → #2563eb
Queue Number: #fbbf24
Accent: #60a5fa
```

### Nature Green
```
Border: #059669
Header: #059669 → #047857
Panel: #064e3b → #065f46
Running: #10b981 → #059669
Queue Number: #fbbf24
Accent: #34d399
```

### Sunset Orange
```
Border: #ea580c
Header: #ea580c → #dc2626
Panel: #7c2d12 → #9a3412
Running: #f97316 → #ea580c
Queue Number: #fbbf24
Accent: #fb923c
```

### Royal Purple
```
Border: #9333ea
Header: #9333ea → #7c3aed
Panel: #581c87 → #6b21a8
Running: #a855f7 → #9333ea
Queue Number: #fbbf24
Accent: #c084fc
```

### Monochrome
```
Border: #6b7280
Header: #6b7280 → #4b5563
Panel: #1f2937 → #111827
Running: #374151 → #1f2937
Queue Number: #f3f4f6
Accent: #9ca3af
```

## 🐛 Troubleshooting

### Warna Tidak Berubah
1. Check apakah sudah klik "Simpan Theme"
2. Tunggu 5 detik untuk auto-refresh
3. Manual refresh display (Ctrl+F5)
4. Check browser console untuk errors

### Preview Tidak Muncul
1. Pastikan hex code valid (#RRGGBB)
2. Check browser support untuk gradients
3. Clear browser cache

### Warna Tidak Sesuai
1. Gunakan color picker untuk akurasi
2. Copy hex code dari tools design
3. Test di display sebelum finalize

### Reset Tidak Bekerja
1. Refresh halaman theme settings
2. Re-login jika perlu
3. Check database settings

## 📊 Best Practices

### Testing
1. Test theme di display sebenarnya
2. Lihat dari berbagai jarak
3. Test di berbagai kondisi cahaya
4. Minta feedback dari user

### Documentation
1. Catat kombinasi warna yang digunakan
2. Screenshot untuk referensi
3. Backup hex codes

### Maintenance
1. Review theme secara berkala
2. Update sesuai feedback
3. Konsisten dengan brand guidelines

## 🎯 Use Cases

### Pagi Hari
- Warna cerah dan energik
- Kontras tinggi
- Easy on the eyes

### Siang Hari
- Warna balanced
- Tidak terlalu terang
- Professional look

### Malam Hari
- Warna lebih gelap
- Reduce eye strain
- Soft gradients

### Event Khusus
- Warna sesuai tema event
- Temporary theme
- Easy to revert

## 📝 Notes

- Theme tersimpan di database
- Berlaku untuk semua display
- Tidak perlu restart aplikasi
- Changes are instant
- Backward compatible

---

**Theme customization siap digunakan!** 🎨

Akses menu Theme di operator app untuk mulai customize warna display Anda.
