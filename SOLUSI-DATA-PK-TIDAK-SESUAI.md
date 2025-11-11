# Solusi: Data PK Tidak Sesuai dengan Google Sheets

## Masalah yang Ditemukan

Data di Management PK tidak sesuai dengan Google Sheets karena urutan kolom salah saat sync.

Contoh data salah:
- NIP berisi gelar: "S.Sos", "A.Md.IP"
- Telepon berisi NIP: "198501012010011001"  
- Jabatan berisi telepon: "81234567890"

Root Cause: Google Sheets yang di-sync memiliki urutan kolom yang salah atau ada kolom tambahan.

## Solusi: Sync Ulang dengan Format yang Benar

### Step 1: Bersihkan Data Lama

Jalankan di PowerShell:
```powershell
cd d:\kiansantang\bapas-bandung\backend
node clean-and-fix-pk.js
```

Atau hapus manual via Management PK.

### Step 2: Siapkan Google Sheets yang Benar

Format yang BENAR:
```
Baris 1: Nama | NIP | Telepon | Jabatan
Baris 2: Budi Santoso, S.Sos | 198501012010011001 | 081234567890 | Pembimbing Kemasyarakatan Ahli Muda
```

PENTING:
- Kolom 1: Nama (boleh dengan gelar)
- Kolom 2: NIP (18 digit)
- Kolom 3: Telepon (08xxxxxxxxxx)
- Kolom 4: Jabatan (jabatan lengkap)

JANGAN:
- Jangan pisahkan nama dan gelar ke kolom berbeda
- Jangan tambah kolom di tengah
- Jangan ubah urutan kolom

### Step 3: Sync dari Google Sheets

1. Buka Management PK: http://localhost:5174/pk
2. Lihat contoh format di bagian "Sync dari Google Sheets"
3. Paste URL Google Sheets yang sudah benar
4. Klik "Sync Now"
5. Data akan muncul dengan format yang benar

## Template Google Sheets

Copy-paste template ini ke Google Sheets:

```
Nama	NIP	Telepon	Jabatan
Budi Santoso, S.Sos	198501012010011001	081234567890	Pembimbing Kemasyarakatan Ahli Muda
Siti Nurhaliza, S.H.	198702022011012002	081234567891	Pembimbing Kemasyarakatan Ahli Madya
Ahmad Fauzi, S.Psi	198903032012011003	081234567892	Pembimbing Kemasyarakatan Ahli Muda
```

## Checklist Sebelum Sync

- Baris 1 adalah header: Nama | NIP | Telepon | Jabatan
- Urutan kolom benar: Tidak ada kolom tambahan
- NIP 18 digit: Semua NIP adalah angka 18 digit
- Telepon format Indonesia: 08xxxxxxxxxx
- Jabatan lengkap: Bukan hanya gelar
- Sheet di-share: "Anyone with the link" -> "Viewer"

## Referensi

Lihat dokumentasi lengkap:
- FORMAT-GOOGLE-SHEETS-BENAR.md
- format-google-sheets-visual.html
