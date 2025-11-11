# 👥 Template Data Klien untuk Google Sheets

## 🎯 Copy Template Ini ke Google Sheets

### Format Header (Baris 1):
```
Nama | NIK | Telepon | Alamat
```

---

## 📊 Template Data (Copy & Paste ke Google Sheets)

Anda bisa copy data di bawah ini dan paste langsung ke Google Sheets:

```
Nama	NIK	Telepon	Alamat
Andi Wijaya	3201010101900001	081234560001	Jl. Merdeka No. 10, Bandung
Budi Setiawan	3201010101900002	081234560002	Jl. Asia Afrika No. 20, Bandung
Citra Dewi	3201010101900003	081234560003	Jl. Braga No. 30, Bandung
Dedi Kurniawan	3201010101900004	081234560004	Jl. Dago No. 40, Bandung
Eka Putri	3201010101900005	081234560005	Jl. Cihampelas No. 50, Bandung
Fajar Ramadhan	3201010101900006	081234560006	Jl. Pasteur No. 60, Bandung
Gita Sari	3201010101900007	081234560007	Jl. Sukajadi No. 70, Bandung
Hendra Gunawan	3201010101900008	081234560008	Jl. Setiabudi No. 80, Bandung
Indah Permata	3201010101900009	081234560009	Jl. Buah Batu No. 90, Bandung
Joko Santoso	3201010101900010	081234560010	Jl. Soekarno Hatta No. 100, Bandung
```

**Cara Paste:**
1. Copy semua teks di atas (termasuk header)
2. Buka Google Sheets
3. Klik cell A1
4. Paste (Ctrl+V)
5. Data akan otomatis masuk ke kolom yang benar

---

## 📝 Template Kosong (Untuk Isi Manual)

Jika ingin isi manual, gunakan format ini:

| Nama | NIK | Telepon | Alamat |
|------|-----|---------|--------|
| [Nama lengkap] | [16 digit] | [08xxxxxxxxxx] | [Alamat lengkap] |
| | | | |
| | | | |

**Contoh pengisian:**

| Nama | NIK | Telepon | Alamat |
|------|-----|---------|--------|
| Andi Wijaya | 3201010101900001 | 081234560001 | Jl. Merdeka No. 10, Bandung |

---

## 🗂️ Struktur Multi-Tab (Klien per PK)

Jika Anda ingin membuat sheet dengan tab per PK:

### Tab 1: Klien - Budi Santoso
```
Nama	NIK	Telepon	Alamat
Andi Wijaya	3201010101900001	081234560001	Jl. Merdeka No. 10, Bandung
Budi Setiawan	3201010101900002	081234560002	Jl. Asia Afrika No. 20, Bandung
Citra Dewi	3201010101900003	081234560003	Jl. Braga No. 30, Bandung
```

### Tab 2: Klien - Siti Nurhaliza
```
Nama	NIK	Telepon	Alamat
Dedi Kurniawan	3201010101900004	081234560004	Jl. Dago No. 40, Bandung
Eka Putri	3201010101900005	081234560005	Jl. Cihampelas No. 50, Bandung
Fajar Ramadhan	3201010101900006	081234560006	Jl. Pasteur No. 60, Bandung
```

### Tab 3: Klien - Ahmad Fauzi
```
Nama	NIK	Telepon	Alamat
Gita Sari	3201010101900007	081234560007	Jl. Sukajadi No. 70, Bandung
Hendra Gunawan	3201010101900008	081234560008	Jl. Setiabudi No. 80, Bandung
Indah Permata	3201010101900009	081234560009	Jl. Buah Batu No. 90, Bandung
```

**Cara membuat tab:**
1. Klik tombol "+" di pojok kiri bawah
2. Rename tab: Klik kanan → "Rename"
3. Nama: "Klien - [Nama PK]"
4. Ulangi untuk setiap PK

---

## 📋 Validasi Data

Sebelum sync, pastikan:

✅ **Nama**: Nama lengkap klien  
✅ **NIK**: 16 digit angka  
✅ **Telepon**: Format 08xxxxxxxxxx (10-13 digit)  
✅ **Alamat**: Alamat lengkap dengan nomor rumah  

---

## 🎯 Format NIK yang Benar

NIK Indonesia terdiri dari 16 digit:

```
3201 01 01 0190 0001
│    │  │  │    │
│    │  │  │    └─ Nomor urut (4 digit)
│    │  │  └────── Tanggal lahir (4 digit: DDYY)
│    │  └───────── Bulan lahir (2 digit)
│    └──────────── Kecamatan (2 digit)
└───────────────── Kota/Kabupaten (4 digit)
```

**Contoh:**
- `3201010101900001` - Bandung, Kec. Bandung Wetan, 01 Jan 1990
- `3273051512850002` - Bandung, Kec. Cicendo, 15 Des 1985 (perempuan)

**Catatan:**
- Tanggal lahir perempuan: +40 (contoh: 15 → 55)
- Pastikan 16 digit, tidak kurang tidak lebih

---

## 📊 Contoh Sheet yang Sudah Jadi

Berikut preview sheet yang sudah terisi:

```
┌─────────────────────┬──────────────────┬──────────────┬──────────────────────────────────┐
│ Nama                │ NIK              │ Telepon      │ Alamat                           │
├─────────────────────┼──────────────────┼──────────────┼──────────────────────────────────┤
│ Andi Wijaya         │ 3201010101900001 │ 081234560001 │ Jl. Merdeka No. 10, Bandung      │
│ Budi Setiawan       │ 3201010101900002 │ 081234560002 │ Jl. Asia Afrika No. 20, Bandung  │
│ Citra Dewi          │ 3201010101900003 │ 081234560003 │ Jl. Braga No. 30, Bandung        │
│ Dedi Kurniawan      │ 3201010101900004 │ 081234560004 │ Jl. Dago No. 40, Bandung         │
│ Eka Putri           │ 3201010101900005 │ 081234560005 │ Jl. Cihampelas No. 50, Bandung   │
└─────────────────────┴──────────────────┴──────────────┴──────────────────────────────────┘
```

---

## 🎨 Tips Formatting

### 1. Freeze Header Row
```
View → Freeze → 1 row
```

### 2. Bold Header
```
Blok A1:D1 → Ctrl+B
```

### 3. Background Color Header
```
Blok A1:D1 → Fill color → Hijau muda
```

### 4. Format NIK sebagai Text
```
Blok kolom B → Format → Number → Plain text
```

### 5. Wrap Text untuk Alamat
```
Blok kolom D → Format → Text wrapping → Wrap
```

### 6. Auto-resize Columns
```
Blok semua kolom → Double-click di border kolom
```

### 7. Alternate Row Colors
```
Format → Alternating colors → Pilih style
```

---

## 🔗 Cara Sync ke Sistem

### Untuk Sync Klien per PK:

1. **Dapatkan PK ID**
   - Buka: http://localhost:3000/api/pk
   - Cari PK yang ingin di-sync
   - Catat ID-nya (contoh: id = 1)

2. **Copy Link Tab**
   - Buka tab klien untuk PK tersebut
   - Copy URL dari address bar
   - URL harus include `gid=` (contoh: `...#gid=123456`)

3. **Sync via API**
   ```bash
   POST http://localhost:3000/api/google-sheets/sync-clients
   {
     "sheetUrl": "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=123456",
     "pkId": 1
   }
   ```

4. **Atau gunakan test page** (jika sudah ada UI untuk sync klien)

---

## 📱 Template untuk Berbagai Kasus

### Template 1: Klien Dewasa Litmas
```
Nama	NIK	Telepon	Alamat
[Nama]	[16 digit]	[08xxx]	[Alamat lengkap]
```

### Template 2: Klien Anak (Tanpa NIK)
```
Nama	NIK	Telepon	Alamat
[Nama]	-	[08xxx]	[Alamat lengkap]
```

### Template 3: Klien dengan Keterangan Tambahan
Tambahkan kolom "Keterangan":
```
Nama	NIK	Telepon	Alamat	Keterangan
[Nama]	[16 digit]	[08xxx]	[Alamat]	[Status/Catatan]
```

---

## ✅ Setelah Selesai

1. **Set Permission**: "Anyone with the link" + "Viewer"
2. **Copy Link per Tab**: Pastikan include `gid=`
3. **Sync ke Sistem**: Via API atau test page
4. **Verifikasi**: Cek data klien muncul untuk PK yang benar

---

## 🚨 Troubleshooting

### Problem: NIK hilang angka 0 di depan
**Solusi:**
- Format kolom NIK sebagai "Plain text"
- Atau tambahkan tanda petik: `'3201010101900001`

### Problem: Alamat terpotong
**Solusi:**
- Wrap text: Format → Text wrapping → Wrap
- Atau perlebar kolom

### Problem: Data tidak sync
**Solusi:**
- Pastikan header benar: Nama, NIK, Telepon, Alamat
- Pastikan minimal kolom "Nama" terisi
- Cek permission sheet: "Anyone with the link"

---

## 📊 Statistik Template

**Template ini berisi:**
- ✅ 10 data klien contoh
- ✅ Format NIK yang valid
- ✅ Nomor telepon Indonesia
- ✅ Alamat di Bandung
- ✅ Siap untuk copy-paste

**Keuntungan:**
- 🚀 Setup cepat (< 5 menit)
- 📊 Format terstandar
- 🔄 Mudah di-update
- 👥 Bisa kolaborasi tim

---

**Template siap digunakan!** 👥✨

**Next Steps:**
1. Copy template ke Google Sheets
2. Edit sesuai data klien Anda
3. Set permission
4. Sync ke sistem
5. Verifikasi data muncul

Selamat mencoba! 🚀
