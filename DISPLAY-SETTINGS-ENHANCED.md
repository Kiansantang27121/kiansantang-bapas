# 📊 Display Settings - Enhanced Features

## ✨ Fitur Baru

### 1. **3 Running Text** 📝
- Running Text 1: Sambutan/Informasi utama
- Running Text 2: Jam pelayanan/Info tambahan
- Running Text 3: Kontak/Informasi lainnya
- Auto-rotate setiap 10 detik
- Indicator dots untuk menunjukkan text aktif

### 2. **Configurable Columns** 📐
- 2 Kolom: Untuk display kecil
- 3 Kolom: Layout medium
- 4 Kolom: Layout penuh (default)
- Responsive di mobile (max 2 kolom)

### 3. **Statistics/Reports** 📈
- Total antrian hari ini
- Jumlah menunggu
- Sedang dilayani
- Selesai
- Dibatalkan (jika ada)
- Rata-rata waktu tunggu
- 3 posisi: Top, Bottom, Sidebar

## 🎯 Cara Menggunakan

### Setting Running Text

**Di Operator App → Menu Display:**

```
Running Text 1:
"Selamat datang di BAPAS Bandung - Melayani dengan sepenuh hati"

Running Text 2:
"Jam Pelayanan: Senin - Jumat, 08:00 - 16:00 WIB"

Running Text 3:
"Hubungi kami: 022-1234567 | Email: info@bapasbandung.go.id"
```

**Hasil di Display:**
- Text berganti setiap 10 detik
- Smooth transition
- Indicator dots di bawah

### Setting Jumlah Kolom

**Di Operator App → Menu Display:**

```
Jumlah Kolom Loket: [Dropdown]
- 2 Kolom  ← Untuk display kecil
- 3 Kolom  ← Medium
- 4 Kolom  ← Full (default)
```

**Layout:**

**2 Kolom:**
```
┌────────┬────────┐
│ Loket1 │ Loket2 │
├────────┼────────┤
│ Loket3 │ Loket4 │
└────────┴────────┘
```

**3 Kolom:**
```
┌──────┬──────┬──────┐
│ L1   │ L2   │ L3   │
└──────┴──────┴──────┘
```

**4 Kolom:**
```
┌────┬────┬────┬────┐
│ L1 │ L2 │ L3 │ L4 │
└────┴────┴────┴────┘
```

### Setting Statistik

**Di Operator App → Menu Display:**

```
Tampilkan Statistik: [Dropdown]
- Ya, Tampilkan  ← Show statistics
- Tidak          ← Hide statistics

Posisi Statistik: [Dropdown]
- Atas (Header)  ← Di atas loket
- Bawah (Footer) ← Di bawah loket (default)
- Sidebar        ← Di samping (desktop only)
```

## 📊 Statistik yang Ditampilkan

### Bottom/Top Position (Horizontal):

```
┌─────────────────────────────────────────────┐
│ 👥 Total: 25 | ⏰ Menunggu: 8 | 📈 Dilayani: 3 │
│ ✅ Selesai: 14 | ⏱️ Rata-rata: 15m           │
└─────────────────────────────────────────────┘
```

### Sidebar Position (Vertical):

```
┌──────────────────┐
│ Statistik        │
├──────────────────┤
│ 👥 Total         │
│    25            │
├──────────────────┤
│ ⏰ Menunggu      │
│    8             │
├──────────────────┤
│ 📈 Dilayani      │
│    3             │
├──────────────────┤
│ ✅ Selesai       │
│    14            │
├──────────────────┤
│ ⏱️ Rata-rata     │
│    15 menit      │
└──────────────────┘
```

## 🎨 Customization

### Running Text Rotation Speed

Edit `display-app/src/components/RunningText.jsx`:

```javascript
// Change rotation interval (default: 10000ms = 10 seconds)
const interval = setInterval(() => {
  setCurrentTextIndex((prev) => (prev + 1) % texts.length)
}, 10000) // Change this value
```

### Statistics Update Frequency

Statistik update otomatis sesuai `display_refresh_interval` (default: 5000ms)

### Colors

Semua warna mengikuti theme settings:
- Border: `theme_border_color`
- Accent: `theme_accent`
- Queue Number: `theme_queue_number`
- Running Text: `theme_running_from` → `theme_running_to`

## 📱 Responsive Behavior

### Desktop (Landscape):
- Full columns (2/3/4)
- Statistics: All positions available
- Running text: Full width

### Mobile (Portrait):
- Max 2 columns (grid auto-adjust)
- Statistics: Bottom only
- Running text: Compact

## 🔧 Technical Details

### New Database Fields:

```sql
running_text_2: TEXT
running_text_3: TEXT
display_columns: TEXT (2/3/4)
show_statistics: TEXT (true/false)
statistics_position: TEXT (top/bottom/sidebar)
```

### New Components:

1. **Statistics.jsx**
   - Props: `queues`, `settings`, `position`
   - Calculates: total, waiting, serving, completed, cancelled, avgWaitTime
   - Layouts: horizontal (top/bottom), vertical (sidebar)

2. **RunningText.jsx**
   - Props: `settings`
   - Features: Auto-rotation, indicator dots
   - Filters empty texts

### API Endpoints:

**Get all queues for statistics:**
```javascript
GET /api/queue
// Returns all queues (no status filter)
```

**Update settings:**
```javascript
PUT /api/settings/:key
Body: { value: "..." }
```

## 💡 Best Practices

### Running Text:

✅ **Good:**
- Text 1: Sambutan/Welcome message
- Text 2: Jam pelayanan/Operating hours
- Text 3: Kontak/Contact info

❌ **Avoid:**
- Terlalu panjang (> 100 karakter)
- Terlalu banyak emoji
- Text yang sama di semua 3 input

### Columns:

✅ **Recommended:**
- 4 kolom: TV/Monitor besar (≥ 40")
- 3 kolom: Monitor medium (27-40")
- 2 kolom: Display kecil atau portrait

❌ **Avoid:**
- 4 kolom di display kecil (text terlalu kecil)
- 2 kolom di display besar (space terbuang)

### Statistics:

✅ **Recommended:**
- Bottom: Paling umum, tidak ganggu view
- Top: Jika ada space di header
- Sidebar: Desktop dengan aspect ratio wide

❌ **Avoid:**
- Sidebar di mobile (no space)
- Top jika header sudah penuh

## 🎯 Use Cases

### Case 1: Kantor Kecil (2-3 Loket)

```
Columns: 2 atau 3
Statistics: Bottom
Running Text: 
  1. Sambutan
  2. Jam pelayanan
  3. Kontak
```

### Case 2: Kantor Besar (4+ Loket)

```
Columns: 4
Statistics: Sidebar atau Bottom
Running Text:
  1. Welcome message
  2. Info layanan
  3. Pengumuman
```

### Case 3: Display Portrait/Mobile

```
Columns: 2 (auto)
Statistics: Bottom
Running Text: Compact, 3 texts rotation
```

## 📊 Statistics Calculation

### Total:
```javascript
Total semua antrian hari ini (semua status)
```

### Waiting:
```javascript
Status = 'waiting'
```

### Serving:
```javascript
Status = 'serving' atau 'called'
```

### Completed:
```javascript
Status = 'completed'
```

### Cancelled:
```javascript
Status = 'cancelled'
(Hanya ditampilkan jika > 0)
```

### Average Wait Time:
```javascript
Rata-rata waktu dari created_at sampai completed_at
Hanya untuk antrian yang sudah selesai
Dalam menit
```

## 🐛 Troubleshooting

### Running text tidak berganti:

**Check:**
- Semua 3 text terisi
- Text tidak kosong/whitespace only
- Browser support (modern browser)

**Solution:**
- Isi minimal 2 running text
- Refresh display (Ctrl+F5)

### Columns tidak berubah:

**Check:**
- Setting tersimpan (check database)
- Display refresh interval
- Cache browser

**Solution:**
- Save settings ulang
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

### Statistics tidak muncul:

**Check:**
- `show_statistics` = 'true'
- Ada antrian hari ini
- Position setting valid

**Solution:**
- Enable di settings
- Create test queue
- Check console errors

### Statistics tidak akurat:

**Check:**
- Timezone server/client
- Queue data integrity
- Refresh interval

**Solution:**
- Sync timezone
- Check database
- Increase refresh interval

## 📝 Configuration Examples

### Example 1: Standard Office

```javascript
running_text: "Selamat datang di BAPAS Bandung"
running_text_2: "Senin-Jumat: 08:00-16:00"
running_text_3: "Telp: 022-1234567"
display_columns: "4"
show_statistics: "true"
statistics_position: "bottom"
```

### Example 2: Small Branch

```javascript
running_text: "Melayani dengan sepenuh hati"
running_text_2: "Jam layanan: 08:00-15:00"
running_text_3: "Info: 022-7654321"
display_columns: "2"
show_statistics: "true"
statistics_position: "bottom"
```

### Example 3: Mobile Display

```javascript
running_text: "Welcome to BAPAS"
running_text_2: "Mon-Fri: 08:00-16:00"
running_text_3: "Call: 022-1234567"
display_columns: "2" // Auto-limited to 2 in mobile
show_statistics: "true"
statistics_position: "bottom" // Only option in mobile
```

---

## ✅ Summary

**New Features:**
- ✅ 3 Running Text dengan auto-rotation
- ✅ Configurable columns (2/3/4)
- ✅ Statistics dengan 3 posisi
- ✅ Responsive mobile support
- ✅ Real-time updates

**Components Created:**
- ✅ Statistics.jsx
- ✅ RunningText.jsx

**Database Updated:**
- ✅ 5 new settings fields

**Apps Updated:**
- ✅ Operator App (DisplaySettings)
- ✅ Display App (AppKPP)
- ✅ Display App (AppMobile)

---

**Fitur enhanced display settings siap digunakan!** 📊✨

**Customize sesuai kebutuhan kantor Anda!** 🎯
