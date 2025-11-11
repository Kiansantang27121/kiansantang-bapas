# 📊 Panduan Lengkap Membuat Google Sheets untuk BAPAS Bandung

## 🎯 Yang Akan Dibuat:

1. **Google Sheets untuk Data PK** (63 PK)
2. **Google Sheets untuk Data Klien** (per PK)

---

## 📋 BAGIAN 1: Google Sheets untuk Data PK

### Step 1: Buat Google Sheets Baru

1. Buka **Google Sheets**: https://sheets.google.com
2. Klik **"+ Blank"** untuk sheet baru
3. Rename sheet: **"Data PK BAPAS Bandung"**

### Step 2: Buat Header (Baris 1)

Ketik di baris pertama (A1-D1):

| A1 | B1 | C1 | D1 |
|----|----|----|-----|
| Nama | NIP | Telepon | Jabatan |

**Format Header:**
- Bold (Ctrl+B)
- Background color: Biru atau warna lain
- Text color: Putih
- Center align

### Step 3: Isi Data PK (Baris 2 dst)

**PENTING:** Urutan kolom HARUS: **Nama | NIP | Telepon | Jabatan**

**Contoh Data (Copy template ini):**

```
Nama	NIP	Telepon	Jabatan
Budi Santoso, S.Sos	198501012010011001	081234567890	Pembimbing Kemasyarakatan Ahli Muda
Siti Nurhaliza, S.H.	198702022011012002	081234567891	Pembimbing Kemasyarakatan Ahli Madya
Ahmad Fauzi, S.Psi	198903032012011003	081234567892	Pembimbing Kemasyarakatan Ahli Muda
Dina Anggun Wahyuni, A.Md.IP	199105052014011005	081234567949	Asisten Pembimbing Kemasyarakatan
Kania Rafinda, S.Psi	199004042013012004	081234567948	Pembimbing Kemasyarakatan Ahli Pertama
```

**Cara Copy:**
1. Select semua teks di atas (termasuk header)
2. Copy (Ctrl+C)
3. Klik cell A1 di Google Sheets
4. Paste (Ctrl+V)
5. Data akan otomatis masuk ke kolom yang benar

### Step 4: Isi 63 PK Anda

Lanjutkan mengisi data PK Anda sampai 63 baris.

**Format yang BENAR:**
- **Kolom A (Nama)**: Nama lengkap dengan gelar, contoh: "Budi Santoso, S.Sos"
- **Kolom B (NIP)**: 18 digit angka, contoh: "198501012010011001"
- **Kolom C (Telepon)**: Nomor HP, contoh: "081234567890"
- **Kolom D (Jabatan)**: Jabatan lengkap, contoh: "Pembimbing Kemasyarakatan Ahli Muda"

**JANGAN:**
- ❌ Pisahkan nama dan gelar ke kolom berbeda
- ❌ Tambah kolom di tengah (Email, Alamat, dll)
- ❌ Biarkan baris kosong di tengah
- ❌ Biarkan kolom "Nama" kosong

### Step 5: Share Google Sheets

1. Klik tombol **"Share"** di kanan atas
2. Klik **"Change to anyone with the link"**
3. Set permission: **"Viewer"**
4. Klik **"Copy link"**
5. Simpan link ini untuk sync ke sistem

**Link akan seperti:**
```
https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit?usp=sharing
```

---

## 📋 BAGIAN 2: Google Sheets untuk Data Klien

### Step 1: Buat Google Sheets Baru untuk Klien

**Option A: Satu Sheet untuk Semua PK (RECOMMENDED)**

1. Buat Google Sheets baru: **"Data Klien BAPAS Bandung"**
2. Buat tab/sheet untuk setiap PK
3. Setiap tab berisi klien untuk 1 PK

**Option B: Sheet Terpisah per PK**

1. Buat Google Sheets terpisah untuk setiap PK
2. Nama: "Data Klien - [Nama PK]"

### Step 2: Buat Header untuk Klien

**Format BARU dengan field lengkap:**

| A1 | B1 | C1 | D1 | E1 | F1 | G1 |
|----|----|----|----|----|----|-----|
| Nama | NIK | WhatsApp | Alamat | Program | Bekerja | Pekerjaan |

**Penjelasan Kolom:**
- **Nama**: Nama lengkap klien (WAJIB)
- **NIK**: 16 digit (opsional)
- **WhatsApp**: Nomor WA (opsional)
- **Alamat**: Alamat lengkap (opsional)
- **Program**: PB/CB/CMB/Asimilasi (WAJIB)
- **Bekerja**: Ya/Tidak (WAJIB)
- **Pekerjaan**: Jenis pekerjaan (WAJIB jika Bekerja=Ya)

### Step 3: Isi Data Klien

**Template Data Klien (Copy ini):**

```
Nama	NIK	WhatsApp	Alamat	Program	Bekerja	Pekerjaan
Andi Wijaya	3201010101900001	081234567890	Jl. Merdeka No. 10, Bandung	PB	Ya	Karyawan Toko
Budi Setiawan	3201010101900002	081234567891	Jl. Sudirman No. 5, Bandung	CB	Tidak	
Citra Dewi	3201010101900003	081234567892	Jl. Asia Afrika No. 15, Bandung	PB	Ya	Buruh Bangunan
Dedi Kurniawan	3201010101900004	081234567893	Jl. Ahmad Yani No. 20, Bandung	CMB	Ya	Wiraswasta
Eka Putri	3201010101900005	081234567894	Jl. Gatot Subroto No. 8, Bandung	Asimilasi	Tidak	
```

**Cara Copy:**
1. Select semua teks di atas
2. Copy (Ctrl+C)
3. Klik cell A1 di Google Sheets
4. Paste (Ctrl+V)

### Step 4: Buat Tab untuk Setiap PK (Jika Satu Sheet)

1. Klik **"+"** di bawah untuk tambah sheet baru
2. Rename sheet: Nama PK (contoh: "Budi Santoso")
3. Copy header ke setiap sheet
4. Isi data klien untuk PK tersebut

**Struktur:**
```
Sheet 1: Budi Santoso, S.Sos (10 klien)
Sheet 2: Siti Nurhaliza, S.H. (8 klien)
Sheet 3: Ahmad Fauzi, S.Psi (12 klien)
... dst untuk 63 PK
```

### Step 5: Share dan Get Link per Tab

**Untuk mendapatkan link dengan gid (tab ID):**

1. Buka tab/sheet yang ingin di-share
2. Klik kanan pada nama tab
3. Copy link to this sheet
4. Link akan include `#gid=123456`

**Contoh link dengan gid:**
```
https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit#gid=123456
```

**PENTING:** Link harus include `gid` untuk sync klien!

---

## ✅ Checklist Sebelum Sync

### Untuk Data PK:
- [ ] Header: Nama | NIP | Telepon | Jabatan
- [ ] Semua 63 baris punya kolom "Nama" terisi
- [ ] NIP 18 digit (atau kosong)
- [ ] Telepon format Indonesia (08xxx)
- [ ] Tidak ada baris kosong
- [ ] Sheet di-share "Anyone with the link" → "Viewer"

### Untuk Data Klien:
- [ ] Header: Nama | NIK | WhatsApp | Alamat | Program | Bekerja | Pekerjaan
- [ ] Kolom "Nama" terisi semua
- [ ] Program: PB/CB/CMB/Asimilasi
- [ ] Bekerja: Ya/Tidak
- [ ] Pekerjaan terisi jika Bekerja=Ya
- [ ] Link include `#gid=xxx` (untuk multi-tab)
- [ ] Sheet di-share "Anyone with the link" → "Viewer"

---

## 🎨 Template Siap Pakai

### Template 1: Data PK (5 Sample)

Copy ke Google Sheets:

```
Nama	NIP	Telepon	Jabatan
Budi Santoso, S.Sos	198501012010011001	081234567890	Pembimbing Kemasyarakatan Ahli Muda
Siti Nurhaliza, S.H.	198702022011012002	081234567891	Pembimbing Kemasyarakatan Ahli Madya
Ahmad Fauzi, S.Psi	198903032012011003	081234567892	Pembimbing Kemasyarakatan Ahli Muda
Dina Anggun Wahyuni, A.Md.IP	199105052014011005	081234567949	Asisten Pembimbing Kemasyarakatan
Kania Rafinda, S.Psi	199004042013012004	081234567948	Pembimbing Kemasyarakatan Ahli Pertama
```

### Template 2: Data Klien (5 Sample)

Copy ke Google Sheets:

```
Nama	NIK	WhatsApp	Alamat	Program	Bekerja	Pekerjaan
Andi Wijaya	3201010101900001	081234567890	Jl. Merdeka No. 10, Bandung	PB	Ya	Karyawan Toko
Budi Setiawan	3201010101900002	081234567891	Jl. Sudirman No. 5, Bandung	CB	Tidak	
Citra Dewi	3201010101900003	081234567892	Jl. Asia Afrika No. 15, Bandung	PB	Ya	Buruh Bangunan
Dedi Kurniawan	3201010101900004	081234567893	Jl. Ahmad Yani No. 20, Bandung	CMB	Ya	Wiraswasta
Eka Putri	3201010101900005	081234567894	Jl. Gatot Subroto No. 8, Bandung	Asimilasi	Tidak	
```

---

## 🚀 Cara Sync ke Sistem

### Sync Data PK:

1. Buka Management PK: `http://localhost:5174/pk`
2. Scroll ke "Sync dari Google Sheets"
3. Paste URL Google Sheets PK
4. Klik "Sync Now"
5. Tunggu sampai selesai
6. Refresh halaman
7. 63 PK harus muncul

### Sync Data Klien:

1. Buka Management Klien: `http://localhost:5174/clients`
2. Scroll ke "Sync dari Google Sheets"
3. **Pilih PK** dari dropdown
4. Paste URL Google Sheets Klien (dengan `#gid=xxx`)
5. Klik "Sync Now"
6. Tunggu sampai selesai
7. Refresh halaman
8. Klien untuk PK tersebut harus muncul

**PENTING:** Sync klien dilakukan **per PK**, bukan sekaligus!

---

## 💡 Tips & Tricks

### 1. Copy Data dari Excel

Jika data ada di Excel:
1. Select data di Excel (termasuk header)
2. Copy (Ctrl+C)
3. Paste di Google Sheets (Ctrl+V)
4. Format akan otomatis terjaga

### 2. Validasi Data

Gunakan Data Validation di Google Sheets:
- **Program**: List → PB, CB, CMB, Asimilasi
- **Bekerja**: List → Ya, Tidak
- **NIP**: Text length = 18
- **NIK**: Text length = 16

### 3. Freeze Header

Agar header tetap terlihat saat scroll:
1. Select baris 1
2. View → Freeze → 1 row

### 4. Filter Data

Untuk mudah cari data:
1. Select header row
2. Data → Create a filter
3. Klik icon filter di header untuk sort/filter

### 5. Conditional Formatting

Highlight data penting:
- Baris tanpa NIP → Warna kuning
- Program PB → Warna hijau
- Tidak bekerja → Warna merah muda

---

## ❌ Kesalahan Umum & Solusi

### Error: "Column Nama not found"
**Penyebab:** Header salah atau tidak ada
**Solusi:** Pastikan baris 1 ada header: Nama | NIP | Telepon | Jabatan

### Error: "Sync berhasil tapi data tidak muncul"
**Penyebab:** Kolom "Nama" kosong di beberapa baris
**Solusi:** Isi semua kolom "Nama", hapus baris kosong

### Error: "Access denied"
**Penyebab:** Sheet tidak di-share
**Solusi:** Share sheet "Anyone with the link" → "Viewer"

### Error: "Hanya 6 dari 63 yang masuk"
**Penyebab:** Banyak baris kosong atau nama kosong
**Solusi:** Hapus baris kosong, isi semua nama

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:
1. Screenshot Google Sheets Anda
2. Screenshot error message
3. Lihat terminal backend untuk detail logs
4. Cek dokumentasi: FORMAT-GOOGLE-SHEETS-BENAR.md

---

**Selamat membuat Google Sheets!** 📊✨

**Jangan lupa share sheet dan copy link untuk sync!** 🔗
