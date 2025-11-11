# 👁️ Display Preview Feature

## ✨ Fitur Baru: Live Preview

Sekarang Anda dapat melihat preview tampilan display **sebelum menyimpan perubahan**!

## 🎯 Cara Menggunakan

### 1. Buka Menu Display Settings

**Operator App → Menu Display**

### 2. Ubah Settings

Ubah settings yang diinginkan:
- Running Text 1, 2, 3
- Jumlah Kolom Loket
- Tampilkan Statistik
- Posisi Statistik
- Warna tema
- dll.

### 3. Klik Tombol Preview

```
┌─────────────────────────────┐
│  👁️ Preview  │  💾 Simpan   │
└─────────────────────────────┘
```

**Tombol Preview (Ungu)** - Lihat preview tanpa menyimpan

### 4. Lihat Preview

Modal preview akan muncul menampilkan:
- ✅ Header dengan logo & info kantor
- ✅ Statistik (jika diaktifkan)
- ✅ Antrian dipanggil (contoh)
- ✅ Loket preview dengan kolom sesuai setting
- ✅ Running text dengan rotasi (3 detik di preview)
- ✅ Semua warna tema

### 5. Tutup atau Simpan

**Jika sudah sesuai:**
- Tutup preview
- Klik "Simpan" untuk apply changes

**Jika belum sesuai:**
- Tutup preview
- Ubah settings lagi
- Preview lagi

---

## 📊 Apa yang Ditampilkan di Preview?

### Header
```
┌─────────────────────────────────────┐
│ 🏛️ BAPAS BANDUNG                   │
│    Jl. Contoh No. 123, Bandung      │
│                    Jam: 08:00-16:00 │
└─────────────────────────────────────┘
```

### Statistik (jika aktif)
```
┌───────────────────────────────────────┐
│ 👥 45 | ⏰ 12 | 📈 3 | ✅ 28        │
└───────────────────────────────────────┘
```

### Antrian Dipanggil
```
┌─────────────────┐
│ ANTRIAN DIPANGGIL│
│                 │
│   A    042      │
│                 │
│   LOKET 2       │
└─────────────────┘
```

### Loket Preview (Sesuai Kolom)

**2 Kolom:**
```
┌────────┬────────┐
│ L1     │ L2     │
│ A001   │ B015   │
└────────┴────────┘
```

**4 Kolom:**
```
┌────┬────┬────┬────┐
│ L1 │ L2 │ L3 │ L4 │
│A001│B015│C008│A022│
└────┴────┴────┴────┘
```

### Running Text
```
★★★ Text 1 ★★★
     ● ○ ○

(Berganti setiap 3 detik)
```

---

## 🎨 Preview Features

### Real-time Settings
- ✅ Semua perubahan langsung terlihat
- ✅ Warna tema sesuai setting
- ✅ Kolom loket dinamis
- ✅ Statistik posisi & visibility

### Mock Data
Preview menggunakan data contoh:
- Total antrian: 45
- Menunggu: 12
- Dilayani: 3
- Selesai: 28
- Cancelled: 2

### Running Text Rotation
- Text berganti setiap 3 detik (lebih cepat dari display asli)
- Indicator dots menunjukkan text aktif
- Filter text kosong otomatis

### Responsive Preview
- Preview dalam container responsive
- Scroll jika konten panjang
- Close button di header

---

## 💡 Keuntungan Preview

### 1. **Cek Sebelum Simpan** ✅
Lihat hasil sebelum apply ke display real

### 2. **Eksperimen Aman** 🧪
Coba berbagai kombinasi tanpa affect display

### 3. **Hemat Waktu** ⚡
Tidak perlu buka display tab untuk cek

### 4. **Visual Feedback** 👁️
Langsung lihat efek perubahan warna/layout

### 5. **Confidence** 💪
Yakin settings sudah benar sebelum simpan

---

## 🔧 Technical Details

### Component: DisplayPreview.jsx

**Props:**
```javascript
{
  settings: Object,  // Current settings state
  onClose: Function  // Close modal callback
}
```

**Features:**
- Full-screen modal overlay
- Responsive container
- Auto text rotation (3s interval)
- Mock queue data
- Mock statistics
- Dynamic grid columns
- Theme color support

### Integration

**DisplaySettings.jsx:**
```javascript
const [showPreview, setShowPreview] = useState(false)

// Preview button
<button onClick={() => setShowPreview(true)}>
  Preview
</button>

// Modal
{showPreview && (
  <DisplayPreview 
    settings={settings} 
    onClose={() => setShowPreview(false)} 
  />
)}
```

---

## 🎯 Use Cases

### Case 1: Testing New Colors

```
1. Ubah warna tema
2. Klik Preview
3. Lihat kombinasi warna
4. Jika bagus → Simpan
5. Jika tidak → Ubah lagi
```

### Case 2: Column Layout

```
1. Ubah jumlah kolom (2/3/4)
2. Preview untuk lihat layout
3. Pilih yang paling sesuai
4. Simpan
```

### Case 3: Statistics Position

```
1. Enable statistik
2. Coba posisi: top/bottom/sidebar
3. Preview setiap posisi
4. Pilih yang terbaik
5. Simpan
```

### Case 4: Running Text

```
1. Isi 3 running text
2. Preview untuk lihat rotasi
3. Check text tidak terlalu panjang
4. Adjust jika perlu
5. Simpan
```

---

## 📱 Preview vs Real Display

### Similarities ✅
- Layout sama
- Warna sama
- Kolom sama
- Statistik sama
- Running text sama

### Differences ⚠️
- **Data:** Preview = mock, Display = real
- **Rotation:** Preview = 3s, Display = 10s
- **Size:** Preview = scaled, Display = full
- **Video:** Preview = no video, Display = with video
- **Updates:** Preview = static, Display = real-time

---

## 🐛 Troubleshooting

### Preview tidak muncul

**Check:**
- Button Preview diklik
- No JavaScript errors
- Browser support modal

**Solution:**
- Refresh page
- Check console
- Try different browser

### Preview layout berbeda

**Check:**
- Settings tersimpan
- Cache browser
- Component updated

**Solution:**
- Clear cache
- Hard refresh
- Check settings state

### Warna tidak sesuai

**Check:**
- Theme settings filled
- Color format valid (#hex)
- Settings passed to preview

**Solution:**
- Check color picker
- Verify hex values
- Re-select colors

### Text tidak berganti

**Check:**
- Multiple texts filled
- Text not empty
- Rotation interval

**Solution:**
- Fill at least 2 texts
- Wait 3 seconds
- Check console errors

---

## ✨ Tips & Best Practices

### 1. **Preview Sering** 👁️
Preview setiap kali ubah settings penting

### 2. **Test Semua Posisi** 📍
Coba semua posisi statistik untuk lihat yang terbaik

### 3. **Check Readability** 📖
Pastikan text terbaca dengan kombinasi warna

### 4. **Mobile Check** 📱
Preview di browser, tapi ingat mobile beda

### 5. **Save After Preview** 💾
Jangan lupa simpan setelah preview OK

---

## 🎨 Customization Examples

### Example 1: Corporate Blue

```javascript
// Settings
theme_border_color: "#0066cc"
theme_header_from: "#0066cc"
theme_header_to: "#0052a3"
theme_accent: "#0066cc"
theme_queue_number: "#ffd700"

// Preview → Lihat kombinasi biru corporate
```

### Example 2: Green Nature

```javascript
// Settings
theme_border_color: "#10b981"
theme_header_from: "#10b981"
theme_header_to: "#059669"
theme_accent: "#10b981"
theme_queue_number: "#fbbf24"

// Preview → Lihat kombinasi hijau natural
```

### Example 3: Red Energy

```javascript
// Settings
theme_border_color: "#dc2626"
theme_header_from: "#dc2626"
theme_header_to: "#b91c1c"
theme_accent: "#dc2626"
theme_queue_number: "#facc15"

// Preview → Lihat kombinasi merah energik
```

---

## 📊 Preview Information Panel

Preview menampilkan info panel di bawah:

```
ℹ️ Informasi Preview:
• Kolom Loket: 4 kolom
• Running Text: 3 teks (berganti setiap 3 detik)
• Statistik: Aktif (bottom)
• Data: Menggunakan data contoh untuk preview
```

Ini membantu Anda understand apa yang sedang di-preview.

---

## ✅ Summary

**Features:**
- ✅ Live preview sebelum simpan
- ✅ Full display simulation
- ✅ Mock data untuk testing
- ✅ Fast text rotation (3s)
- ✅ All theme colors
- ✅ Dynamic columns
- ✅ Statistics preview
- ✅ Easy close/save

**Benefits:**
- ✅ Safe experimentation
- ✅ Visual confidence
- ✅ Time saving
- ✅ Better UX

**Components:**
- ✅ DisplayPreview.jsx (new)
- ✅ DisplaySettings.jsx (updated)

---

## 🚀 Next Steps

1. **Test Preview** - Klik tombol Preview
2. **Experiment** - Coba berbagai kombinasi
3. **Find Best** - Temukan setting terbaik
4. **Save** - Simpan dan apply ke display
5. **Verify** - Check display real

---

**Preview feature siap digunakan!** 👁️✨

**Eksperimen dengan aman sebelum simpan perubahan!** 🎨🚀
