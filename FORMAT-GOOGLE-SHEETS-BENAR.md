# ✅ Format Google Sheets yang Benar

## 🎯 Masalah yang Sering Terjadi

Kolom di Management PK/Klien tidak sesuai dengan Google Sheets karena:
1. ❌ Urutan kolom salah
2. ❌ Nama header tidak sesuai
3. ❌ Ada kolom tambahan yang tidak perlu
4. ❌ Header tidak di baris 1

---

## 📊 Format yang BENAR untuk Data PK

### Struktur Google Sheets:

**Baris 1 (Header) - WAJIB:**
```
Nama | NIP | Telepon | Jabatan
```

**Baris 2 dst (Data):**
```
Budi Santoso, S.Sos | 198501012010011001 | 081234567890 | Pembimbing Kemasyarakatan Ahli Muda
```

### Contoh Visual:

| Kolom A | Kolom B | Kolom C | Kolom D |
|---------|---------|---------|---------|
| **Nama** | **NIP** | **Telepon** | **Jabatan** |
| Budi Santoso, S.Sos | 198501012010011001 | 081234567890 | Pembimbing Kemasyarakatan Ahli Muda |
| Siti Nurhaliza, S.H. | 198702022011012002 | 081234567891 | Pembimbing Kemasyarakatan Ahli Madya |
| Ahmad Fauzi, S.Psi | 198903032012011003 | 081234567892 | Pembimbing Kemasyarakatan Ahli Muda |

### ⚠️ Yang HARUS Diperhatikan:

1. **Header di Baris 1**
   - Cell A1: `Nama`
   - Cell B1: `NIP`
   - Cell C1: `Telepon`
   - Cell D1: `Jabatan`

2. **Urutan Kolom HARUS SAMA**
   - Kolom 1: Nama (wajib)
   - Kolom 2: NIP (opsional)
   - Kolom 3: Telepon (opsional)
   - Kolom 4: Jabatan (opsional)

3. **Nama Header Case-Insensitive**
   - ✅ `Nama` atau `nama` atau `NAMA` → OK
   - ✅ `NIP` atau `nip` → OK
   - ✅ `Telepon` atau `telepon` atau `Phone` → OK
   - ✅ `Jabatan` atau `jabatan` → OK

4. **Jangan Ada Kolom Tambahan di Tengah**
   - ❌ Nama | Email | NIP | Telepon | Jabatan → SALAH
   - ✅ Nama | NIP | Telepon | Jabatan → BENAR

---

## 📊 Format yang BENAR untuk Data Klien

### Struktur Google Sheets:

**Baris 1 (Header) - WAJIB:**
```
Nama | NIK | Telepon | Alamat
```

**Baris 2 dst (Data):**
```
Andi Wijaya | 3201010101900001 | 081234560001 | Jl. Merdeka No. 10, Bandung
```

### Contoh Visual:

| Kolom A | Kolom B | Kolom C | Kolom D |
|---------|---------|---------|---------|
| **Nama** | **NIK** | **Telepon** | **Alamat** |
| Andi Wijaya | 3201010101900001 | 081234560001 | Jl. Merdeka No. 10, Bandung |
| Budi Setiawan | 3201010101900002 | 081234560002 | Jl. Asia Afrika No. 20, Bandung |
| Citra Dewi | 3201010101900003 | 081234560003 | Jl. Braga No. 30, Bandung |

### ⚠️ Yang HARUS Diperhatikan:

1. **Header di Baris 1**
   - Cell A1: `Nama`
   - Cell B1: `NIK`
   - Cell C1: `Telepon`
   - Cell D1: `Alamat`

2. **Urutan Kolom HARUS SAMA**
   - Kolom 1: Nama (wajib)
   - Kolom 2: NIK (opsional)
   - Kolom 3: Telepon (opsional)
   - Kolom 4: Alamat (opsional)

3. **Nama Header Case-Insensitive**
   - ✅ `NIK` atau `nik` → OK
   - ✅ `Alamat` atau `alamat` atau `Address` → OK

4. **Buat Tab Terpisah per PK**
   - Tab 1: "Klien - Budi Santoso"
   - Tab 2: "Klien - Siti Nurhaliza"
   - Tab 3: "Klien - Ahmad Fauzi"

---

## ❌ Kesalahan yang Sering Terjadi

### 1. Urutan Kolom Salah

**SALAH:**
| NIP | Nama | Jabatan | Telepon |
|-----|------|---------|---------|

**BENAR:**
| Nama | NIP | Telepon | Jabatan |
|------|-----|---------|---------|

### 2. Ada Kolom Tambahan

**SALAH:**
| Nama | Email | NIP | Telepon | Jabatan |
|------|-------|-----|---------|---------|

**BENAR:**
| Nama | NIP | Telepon | Jabatan |
|------|-----|---------|---------|

### 3. Header Tidak di Baris 1

**SALAH:**
```
Baris 1: (kosong)
Baris 2: Nama | NIP | Telepon | Jabatan
Baris 3: Budi Santoso...
```

**BENAR:**
```
Baris 1: Nama | NIP | Telepon | Jabatan
Baris 2: Budi Santoso...
```

### 4. Nama Header Typo

**SALAH:**
| Nama | NIPEG | Telpon | Jabatan |
|------|-------|--------|---------|

**BENAR:**
| Nama | NIP | Telepon | Jabatan |
|------|-----|---------|---------|

---

## 🔧 Cara Memperbaiki Google Sheets

### Step 1: Cek Header
1. Buka Google Sheets Anda
2. Pastikan baris 1 adalah header
3. Pastikan nama kolom sesuai

### Step 2: Cek Urutan Kolom
1. Pastikan urutan: Nama → NIP → Telepon → Jabatan (untuk PK)
2. Atau: Nama → NIK → Telepon → Alamat (untuk Klien)
3. Jika salah, drag & drop kolom untuk pindah urutan

### Step 3: Hapus Kolom Tambahan
1. Jika ada kolom yang tidak perlu (Email, dll)
2. Klik kanan pada header kolom
3. Pilih "Delete column"

### Step 4: Format Data
1. **NIP/NIK**: Format as "Plain text" agar angka 0 tidak hilang
   - Blok kolom → Format → Number → Plain text
2. **Telepon**: Format as "Plain text"
3. **Nama**: Pastikan tidak ada leading/trailing spaces

---

## 📋 Template Copy-Paste

### Template PK (Copy ini ke Google Sheets):

```
Nama	NIP	Telepon	Jabatan
Budi Santoso, S.Sos	198501012010011001	081234567890	Pembimbing Kemasyarakatan Ahli Muda
Siti Nurhaliza, S.H.	198702022011012002	081234567891	Pembimbing Kemasyarakatan Ahli Madya
Ahmad Fauzi, S.Psi	198903032012011003	081234567892	Pembimbing Kemasyarakatan Ahli Muda
```

**Cara paste:**
1. Copy teks di atas (Ctrl+C)
2. Buka Google Sheets
3. Klik cell A1
4. Paste (Ctrl+V)
5. Data akan otomatis masuk ke kolom yang benar

### Template Klien (Copy ini ke Google Sheets):

```
Nama	NIK	Telepon	Alamat
Andi Wijaya	3201010101900001	081234560001	Jl. Merdeka No. 10, Bandung
Budi Setiawan	3201010101900002	081234560002	Jl. Asia Afrika No. 20, Bandung
Citra Dewi	3201010101900003	081234560003	Jl. Braga No. 30, Bandung
```

---

## ✅ Checklist Sebelum Sync

### Untuk Data PK:
- [ ] Header di baris 1: Nama | NIP | Telepon | Jabatan
- [ ] Urutan kolom sudah benar
- [ ] Tidak ada kolom tambahan
- [ ] Minimal kolom "Nama" terisi
- [ ] NIP format "Plain text"
- [ ] Sheet di-share "Anyone with the link" → "Viewer"

### Untuk Data Klien:
- [ ] Header di baris 1: Nama | NIK | Telepon | Alamat
- [ ] Urutan kolom sudah benar
- [ ] Tidak ada kolom tambahan
- [ ] Minimal kolom "Nama" terisi
- [ ] NIK format "Plain text"
- [ ] Tab terpisah per PK
- [ ] URL include `gid=` (tab ID)
- [ ] Sheet di-share "Anyone with the link" → "Viewer"

---

## 🎯 Contoh Sheet yang Benar

### Sheet PK:
```
https://docs.google.com/spreadsheets/d/1ABC123xyz/edit

┌──────────────────────────┬────────────────────┬──────────────┬─────────────────────────────────────────┐
│ Nama                     │ NIP                │ Telepon      │ Jabatan                                 │
├──────────────────────────┼────────────────────┼──────────────┼─────────────────────────────────────────┤
│ Budi Santoso, S.Sos      │ 198501012010011001 │ 081234567890 │ Pembimbing Kemasyarakatan Ahli Muda     │
│ Siti Nurhaliza, S.H.     │ 198702022011012002 │ 081234567891 │ Pembimbing Kemasyarakatan Ahli Madya    │
│ Ahmad Fauzi, S.Psi       │ 198903032012011003 │ 081234567892 │ Pembimbing Kemasyarakatan Ahli Muda     │
└──────────────────────────┴────────────────────┴──────────────┴─────────────────────────────────────────┘
```

### Sheet Klien (Tab: Klien - Budi Santoso):
```
https://docs.google.com/spreadsheets/d/1ABC123xyz/edit#gid=123456

┌─────────────────┬──────────────────┬──────────────┬──────────────────────────────────┐
│ Nama            │ NIK              │ Telepon      │ Alamat                           │
├─────────────────┼──────────────────┼──────────────┼──────────────────────────────────┤
│ Andi Wijaya     │ 3201010101900001 │ 081234560001 │ Jl. Merdeka No. 10, Bandung      │
│ Budi Setiawan   │ 3201010101900002 │ 081234560002 │ Jl. Asia Afrika No. 20, Bandung  │
│ Citra Dewi      │ 3201010101900003 │ 081234560003 │ Jl. Braga No. 30, Bandung        │
└─────────────────┴──────────────────┴──────────────┴──────────────────────────────────┘
```

---

## 🔍 Cara Verifikasi Format

### Di Management PK/Klien:
1. Buka halaman Management PK atau Klien
2. Lihat bagian "Sync dari Google Sheets"
3. Ada tabel contoh format yang benar
4. Bandingkan dengan Google Sheets Anda
5. Pastikan urutan dan nama kolom sama persis

### Di Google Sheets:
1. Cek baris 1 adalah header
2. Cek urutan kolom dari kiri ke kanan
3. Cek tidak ada kolom tambahan
4. Cek data terisi dengan benar

---

## 💡 Tips

1. **Gunakan Template**
   - Copy-paste template yang sudah disediakan
   - Lebih cepat dan tidak ada kesalahan format

2. **Freeze Header Row**
   - View → Freeze → 1 row
   - Agar header tetap terlihat saat scroll

3. **Format Kolom**
   - NIP/NIK: Plain text
   - Telepon: Plain text
   - Agar angka 0 tidak hilang

4. **Test dengan Data Sedikit**
   - Coba sync dengan 1-2 baris data dulu
   - Jika berhasil, baru tambah data lengkap

5. **Backup Data**
   - File → Make a copy
   - Simpan backup sebelum edit

---

## 📞 Troubleshooting

### Sync Gagal: "Column not found"
**Penyebab:** Nama header salah atau typo
**Solusi:** Cek nama header di baris 1, pastikan sesuai

### Data Tidak Muncul Setelah Sync
**Penyebab:** Kolom "Nama" kosong
**Solusi:** Pastikan setiap baris punya nama

### NIP/NIK Berubah Jadi Angka Aneh
**Penyebab:** Format kolom "Number"
**Solusi:** Format kolom sebagai "Plain text"

### Sync Berhasil Tapi Data Salah Kolom
**Penyebab:** Urutan kolom tidak sesuai
**Solusi:** Pindah kolom sesuai urutan yang benar

---

**Format sudah benar? Sekarang Anda bisa sync dengan aman!** ✅🚀

**Lihat contoh visual di Management PK/Klien untuk referensi format yang benar.**
