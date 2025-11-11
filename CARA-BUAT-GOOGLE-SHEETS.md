# 📊 Panduan Membuat Google Sheets untuk BAPAS

## 🎯 Yang Akan Dibuat

1. **Google Sheet untuk Data PK** - Database Pembimbing Kemasyarakatan
2. **Google Sheet untuk Data Klien** - Database Klien per PK (opsional)

---

## 📋 STEP 1: Buat Google Sheet untuk Data PK

### 1. Buka Google Sheets
- Kunjungi: https://sheets.google.com
- Login dengan akun Google Anda
- Klik **"+ Blank"** untuk sheet baru

### 2. Beri Nama Sheet
- Klik "Untitled spreadsheet" di pojok kiri atas
- Ganti nama menjadi: **"Database PK BAPAS Bandung"**
- Tekan Enter

### 3. Buat Header (Baris 1)
Ketik header berikut di baris pertama:

| A | B | C | D |
|---|---|---|---|
| **Nama** | **NIP** | **Telepon** | **Jabatan** |

**Cara:**
- Klik cell A1, ketik: `Nama`
- Klik cell B1, ketik: `NIP`
- Klik cell C1, ketik: `Telepon`
- Klik cell D1, ketik: `Jabatan`

### 4. Format Header (Opsional - Agar Lebih Rapi)
- Blok baris 1 (A1:D1)
- Klik **Bold** (Ctrl+B)
- Klik **Background color** → Pilih warna biru muda
- Klik **Text color** → Pilih warna putih atau hitam
- Klik **Align** → Center

### 5. Isi Data PK
Mulai dari baris 2, isi data PK Anda:

**Contoh:**

| Nama | NIP | Telepon | Jabatan |
|------|-----|---------|---------|
| Budi Santoso, S.Sos | 198501012010011001 | 081234567890 | Pembimbing Kemasyarakatan Ahli Muda |
| Siti Nurhaliza, S.H. | 198702022011012002 | 081234567891 | Pembimbing Kemasyarakatan Ahli Madya |
| Ahmad Fauzi, S.Psi | 198903032012011003 | 081234567892 | Pembimbing Kemasyarakatan Ahli Muda |
| Dewi Lestari, S.Sos | 199004042013012004 | 081234567893 | Pembimbing Kemasyarakatan Ahli Pertama |

**Tips:**
- Pastikan NIP 18 digit
- Format telepon: 08xxxxxxxxxx
- Jabatan lengkap dengan tingkat (Ahli Pertama/Muda/Madya/Utama)

### 6. Set Permission (PENTING!)
- Klik tombol **"Share"** di pojok kanan atas
- Di bagian "General access", klik **"Restricted"**
- Pilih **"Anyone with the link"**
- Set ke **"Viewer"** (bukan Editor!)
- Klik **"Done"**

### 7. Copy Link
- Klik tombol **"Share"** lagi
- Klik **"Copy link"**
- Link akan terlihat seperti:
  ```
  https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit?usp=sharing
  ```

### 8. Simpan Link
- Paste link ke Notepad atau file text
- Anda akan butuh link ini untuk sync ke sistem

---

## 📋 STEP 2: Buat Google Sheet untuk Data Klien (Opsional)

### 1. Buat Sheet Baru
- Kunjungi: https://sheets.google.com
- Klik **"+ Blank"**
- Nama: **"Database Klien BAPAS Bandung"**

### 2. Buat Tab per PK
Setiap PK akan punya tab sendiri:

**Cara membuat tab baru:**
- Klik tombol **"+"** di pojok kiri bawah (samping "Sheet1")
- Rename tab dengan klik kanan → "Rename"
- Nama tab: **"Klien - [Nama PK]"**

**Contoh:**
- Tab 1: `Klien - Budi Santoso`
- Tab 2: `Klien - Siti Nurhaliza`
- Tab 3: `Klien - Ahmad Fauzi`

### 3. Format Setiap Tab
Di setiap tab, buat header:

| A | B | C | D |
|---|---|---|---|
| **Nama** | **NIK** | **Telepon** | **Alamat** |

### 4. Isi Data Klien
Contoh untuk tab "Klien - Budi Santoso":

| Nama | NIK | Telepon | Alamat |
|------|-----|---------|--------|
| Andi Wijaya | 3201010101900001 | 081234560001 | Jl. Merdeka No. 10, Bandung |
| Budi Setiawan | 3201010101900002 | 081234560002 | Jl. Asia Afrika No. 20, Bandung |

### 5. Set Permission
- Sama seperti sheet PK
- Klik **"Share"** → **"Anyone with the link"** → **"Viewer"**

### 6. Copy Link per Tab
Untuk setiap tab, copy link dengan gid:
- Buka tab yang ingin di-copy
- Copy URL dari address bar
- Link akan terlihat seperti:
  ```
  https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit#gid=123456
  ```
- **gid=123456** adalah ID tab tersebut

---

## 🔗 STEP 3: Hubungkan ke Sistem

### Cara 1: Via Test Page (Mudah)

1. **Buka test page** yang sudah dibuka sebelumnya
   - Atau buka file: `test-google-sheets.html`

2. **Sync Data PK:**
   - Paste URL Google Sheet PK ke input field
   - Klik **"🔄 Sync PK from Google Sheets"**
   - Tunggu hingga muncul pesan sukses

3. **Verifikasi:**
   - Klik **"👥 View All PK"**
   - Pastikan semua data PK muncul dengan benar

### Cara 2: Via API (Advanced)

**Sync PK:**
```bash
POST http://localhost:3000/api/google-sheets/sync-pk
Content-Type: application/json

{
  "sheetUrl": "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
}
```

**Sync Klien per PK:**
```bash
POST http://localhost:3000/api/google-sheets/sync-clients
Content-Type: application/json

{
  "sheetUrl": "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=123456",
  "pkId": 1
}
```

---

## ✅ Checklist Setup

### Google Sheet PK:
- [ ] Sheet dibuat dengan nama "Database PK BAPAS Bandung"
- [ ] Header: Nama | NIP | Telepon | Jabatan
- [ ] Data PK sudah diisi minimal 1 baris
- [ ] Permission: "Anyone with the link" + "Viewer"
- [ ] Link sudah di-copy

### Google Sheet Klien (Opsional):
- [ ] Sheet dibuat dengan nama "Database Klien BAPAS Bandung"
- [ ] Tab dibuat per PK
- [ ] Header di setiap tab: Nama | NIK | Telepon | Alamat
- [ ] Data klien sudah diisi
- [ ] Permission: "Anyone with the link" + "Viewer"
- [ ] Link per tab sudah di-copy (dengan gid)

### Sync ke Sistem:
- [ ] Backend berjalan di port 3000
- [ ] Test page dibuka
- [ ] Sync PK berhasil
- [ ] Data PK muncul di "View All PK"

---

## 🎨 Tips Membuat Sheet yang Rapi

### 1. Gunakan Freeze Row
- Agar header tetap terlihat saat scroll
- Klik **View** → **Freeze** → **1 row**

### 2. Gunakan Filter
- Blok header row
- Klik **Data** → **Create a filter**
- Akan muncul icon filter di setiap kolom

### 3. Format Kolom
- **Kolom NIP/NIK**: Format as Plain Text
  - Blok kolom → Format → Number → Plain text
  - Agar angka 0 di depan tidak hilang
- **Kolom Telepon**: Format as Plain Text
- **Kolom Nama**: Left align
- **Kolom Jabatan**: Wrap text (agar tidak terpotong)

### 4. Gunakan Data Validation (Opsional)
Untuk kolom Jabatan, buat dropdown:
- Blok kolom Jabatan (D2:D100)
- Klik **Data** → **Data validation**
- Criteria: **List of items**
- Items:
  ```
  Pembimbing Kemasyarakatan Ahli Pertama
  Pembimbing Kemasyarakatan Ahli Muda
  Pembimbing Kemasyarakatan Ahli Madya
  Pembimbing Kemasyarakatan Ahli Utama
  ```
- Klik **Save**

### 5. Conditional Formatting (Opsional)
Highlight baris dengan warna berbeda:
- Blok semua data
- Klik **Format** → **Conditional formatting**
- Format rules: **Custom formula**
- Formula: `=MOD(ROW(),2)=0`
- Formatting style: Background color abu-abu muda
- Klik **Done**

---

## 🔄 Update Data

### Cara Update Data di Google Sheets:

1. **Edit langsung di Google Sheets**
   - Buka sheet Anda
   - Edit data yang perlu diubah
   - Simpan otomatis

2. **Sync ulang ke sistem**
   - Buka test page
   - Klik **"🔄 Sync PK from Google Sheets"**
   - Data akan di-update otomatis

**Catatan:**
- Sistem akan **update** data yang sudah ada (berdasarkan NIP atau Nama)
- Sistem akan **insert** data baru jika belum ada
- Data yang dihapus di sheet **tidak** akan terhapus di sistem (harus hapus manual via API)

---

## 🚨 Troubleshooting

### Problem 1: "Access Denied" saat sync
**Solusi:**
- Pastikan sheet di-share dengan "Anyone with the link"
- Pastikan permission "Viewer" (bukan "Restricted")
- Coba copy link baru dan sync lagi

### Problem 2: "Column not found"
**Solusi:**
- Pastikan header di baris 1
- Pastikan nama kolom: Nama, NIP, Telepon, Jabatan
- Tidak boleh ada spasi ekstra atau typo

### Problem 3: NIP/NIK hilang angka 0 di depan
**Solusi:**
- Format kolom sebagai "Plain text"
- Atau tambahkan tanda petik di depan: `'0812345678`

### Problem 4: Data tidak muncul setelah sync
**Solusi:**
- Cek console browser (F12) untuk error
- Pastikan backend berjalan
- Cek apakah ada baris kosong di sheet
- Pastikan minimal kolom "Nama" terisi

---

## 📞 Contoh Data Lengkap

### Sheet PK:

| Nama | NIP | Telepon | Jabatan |
|------|-----|---------|---------|
| Budi Santoso, S.Sos | 198501012010011001 | 081234567890 | Pembimbing Kemasyarakatan Ahli Muda |
| Siti Nurhaliza, S.H. | 198702022011012002 | 081234567891 | Pembimbing Kemasyarakatan Ahli Madya |
| Ahmad Fauzi, S.Psi | 198903032012011003 | 081234567892 | Pembimbing Kemasyarakatan Ahli Muda |
| Dewi Lestari, S.Sos | 199004042013012004 | 081234567893 | Pembimbing Kemasyarakatan Ahli Pertama |
| Eko Prasetyo, S.H. | 199105052014011005 | 081234567894 | Pembimbing Kemasyarakatan Ahli Muda |

### Sheet Klien (Tab: Klien - Budi Santoso):

| Nama | NIK | Telepon | Alamat |
|------|-----|---------|--------|
| Andi Wijaya | 3201010101900001 | 081234560001 | Jl. Merdeka No. 10, Bandung |
| Budi Setiawan | 3201010101900002 | 081234560002 | Jl. Asia Afrika No. 20, Bandung |
| Citra Dewi | 3201010101900003 | 081234560003 | Jl. Braga No. 30, Bandung |

---

## 🎯 Kesimpulan

Setelah mengikuti panduan ini, Anda akan memiliki:

✅ Google Sheet untuk database PK yang terstruktur  
✅ Google Sheet untuk database Klien per PK (opsional)  
✅ Koneksi antara Google Sheets dan sistem BAPAS  
✅ Kemampuan untuk update data dengan mudah  

**Keuntungan:**
- 📊 Data terorganisir dengan rapi
- 🔄 Update data real-time
- 👥 Kolaborasi tim (multiple editors)
- 📱 Akses dari mana saja
- 💾 Backup otomatis oleh Google

---

**Selamat mencoba! Jika ada kendala, silakan cek bagian Troubleshooting atau hubungi admin sistem.** 🚀
