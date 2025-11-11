# Debug: Hanya 6 PK yang Masuk Saat Sync

## Masalah

Saat sync dari Google Sheets, hanya 6 PK yang berhasil masuk ke database, padahal Google Sheets berisi lebih banyak data.

## PK yang Berhasil Masuk

1. Ryan Rizkia - NIP: 198501012010011001
2. Muhamad Anggiansah - NIP: 198702022011012002
3. Rakha Hafiyan - NIP: 198903032012011003
4. Kania Rafinda - NIP: 199004042013012004
5. Dina Anggun Wahyuni - NIP: 199105052014011005
6. Budiana - (tanpa NIP)

## Kemungkinan Penyebab

### 1. Baris Kosong di Google Sheets
- Ada banyak baris kosong setelah data
- Parser skip baris kosong

### 2. Format Data Tidak Konsisten
- Beberapa baris memiliki format berbeda
- Ada karakter tersembunyi atau spasi ekstra
- Encoding file bermasalah

### 3. Error Saat Parsing
- CSV parser gagal parse baris tertentu
- Data mengandung karakter khusus
- Quotes tidak balance

### 4. Nama Kosong
- Kolom "Nama" kosong di beberapa baris
- System skip baris tanpa nama

## Cara Debug

### Step 1: Cek Backend Logs

Backend sudah di-update dengan logging detail. Restart backend dan sync ulang:

```powershell
# Stop backend
Stop-Process -Name node -Force

# Start backend
cd d:\kiansantang\bapas-bandung\backend
npm run dev
```

Saat sync, backend akan menampilkan:
- Jumlah baris yang di-parse
- Data setiap baris
- Baris yang di-skip dan alasannya

### Step 2: Cek Google Sheets

Buka Google Sheets Anda dan cek:

1. **Jumlah Baris Berisi Data**
   - Berapa baris yang benar-benar ada datanya?
   - Apakah ada baris kosong di tengah?

2. **Format Setiap Kolom**
   - Kolom A (Nama): Harus terisi
   - Kolom B (NIP): Boleh kosong
   - Kolom C (Telepon): Boleh kosong
   - Kolom D (Jabatan): Boleh kosong

3. **Karakter Khusus**
   - Apakah ada karakter aneh?
   - Apakah ada line break di dalam cell?

### Step 3: Test dengan Data Minimal

Buat Google Sheets baru dengan hanya 3 baris:

```
Nama                    | NIP                | Telepon      | Jabatan
Test PK 1               | 111111111111111111 | 081111111111 | Test Jabatan 1
Test PK 2               | 222222222222222222 | 082222222222 | Test Jabatan 2
```

Sync dan lihat apakah 2 PK masuk. Jika ya, masalahnya di data asli.

## Solusi

### Solusi 1: Bersihkan Google Sheets

1. Copy semua data ke Notepad
2. Buat Google Sheets baru
3. Paste data
4. Pastikan tidak ada baris kosong
5. Sync ulang

### Solusi 2: Sync Bertahap

Jika data banyak, sync bertahap:

1. Sync 10 baris pertama
2. Cek berhasil semua
3. Tambah 10 baris lagi
4. Sync ulang
5. Ulangi sampai semua data masuk

### Solusi 3: Input Manual

Jika sync terus bermasalah:

1. Buka Management PK
2. Klik "Tambah PK"
3. Input data satu per satu
4. Atau gunakan form CSV import

## Cara Melihat Backend Logs

Setelah restart backend dengan logging baru:

1. Buka terminal backend
2. Sync dari Management PK
3. Lihat output di terminal

Contoh output yang akan muncul:

```
Headers: ['Nama', 'NIP', 'Telepon', 'Jabatan']
Row 2: Parsed 4 values
Processing row 2: Ryan Rizkia | NIP: 198501012010011001 | Phone: 081234567890 | Jabatan: PK Ahli Muda
Added new PK: Ryan Rizkia
Row 3: Parsed 4 values
Processing row 3: Budi Santoso | NIP: 198702022011012002 | Phone: 081234567891 | Jabatan: PK Ahli Madya
Added new PK: Budi Santoso
Row 4: Parsed 0 values
Skipping row 4: Empty line
```

Dari logs ini Anda bisa lihat:
- Baris mana yang berhasil
- Baris mana yang di-skip
- Kenapa di-skip

## Quick Fix

Jika ingin cepat:

1. Export Google Sheets ke CSV
2. Buka CSV di Excel/Notepad
3. Hapus baris kosong
4. Pastikan hanya ada data valid
5. Upload kembali ke Google Sheets baru
6. Sync ulang

## Restart Backend dengan Logging

```powershell
# Stop backend
Stop-Process -Name node -Force

# Start backend
cd d:\kiansantang\bapas-bandung\backend
npm run dev
```

Backend sekarang akan menampilkan detail setiap baris yang di-process.

## Next Steps

1. Restart backend
2. Sync ulang dari Google Sheets
3. Lihat logs di terminal backend
4. Identifikasi baris yang di-skip
5. Fix data di Google Sheets
6. Sync ulang

Jika masih bermasalah, screenshot logs backend dan Google Sheets untuk analisis lebih lanjut.
