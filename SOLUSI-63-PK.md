# Solusi: Hanya 6 dari 63 PK yang Muncul

## Masalah Ditemukan

Dari analisis:
- Google Sheets berisi: **63 PK**
- Sync report: "63 di-update"
- Database active: **6 PK**
- Database inactive: **33 PK**
- **Total di database: 39 PK**

**Kesimpulan:** 63 - 39 = **24 PK tidak masuk sama sekali!**

## Root Cause

### 1. Data Lama Masih Ada (Inactive)
33 PK dari sync sebelumnya masih ada tapi inactive (is_active = 0).
Ini dari saat kita clear data sebelumnya.

### 2. Nama Tidak Match
Saat sync, sistem cek:
- Apakah PK dengan NIP ini sudah ada?
- Apakah PK dengan nama ini sudah ada?

Jika tidak ada, baru INSERT baru.
Jika nama di Google Sheets berbeda dengan database, maka tidak match dan di-skip.

### 3. Baris Tanpa Nama
Kemungkinan banyak baris di Google Sheets yang kolom "Nama" kosong.
Sistem skip baris tanpa nama.

## Solusi

### Solusi 1: Hapus Semua Data dan Sync Ulang (RECOMMENDED)

```powershell
cd d:\kiansantang\bapas-bandung\backend

# Hapus semua PK (hard delete)
node -e "import('./database.js').then(m => { const db = m.default; db.prepare('DELETE FROM pk').run(); console.log('All PK deleted'); })"
```

Lalu sync ulang dari Google Sheets. Semua 63 PK akan masuk sebagai data baru.

### Solusi 2: Aktifkan Semua PK Inactive

```powershell
cd d:\kiansantang\bapas-bandung\backend

# Aktifkan semua PK inactive
node -e "import('./database.js').then(m => { const db = m.default; const r = db.prepare('UPDATE pk SET is_active = 1').run(); console.log('Activated:', r.changes); })"
```

Tapi ini akan mengaktifkan PK lama yang mungkin formatnya salah (kolom terbalik).

### Solusi 3: Cek Google Sheets Format

Kemungkinan Google Sheets punya masalah:
1. Banyak baris kosong
2. Kolom "Nama" kosong di banyak baris
3. Format tidak konsisten

## Cara Debug Lebih Lanjut

### Step 1: Lihat Logs Backend

Saat sync tadi, backend menampilkan detail. Cek terminal backend dan cari:
- "Skipping row X: No name"
- "Skipping row X: Empty line"

### Step 2: Download Google Sheets sebagai CSV

1. Buka Google Sheets
2. File → Download → CSV
3. Buka CSV di Notepad
4. Cek:
   - Berapa baris yang benar-benar ada data?
   - Apakah ada baris kosong?
   - Apakah kolom "Nama" terisi semua?

### Step 3: Test dengan Subset Data

Buat Google Sheets baru dengan hanya 10 baris pertama dari data asli.
Sync dan lihat apakah 10 PK masuk.
Jika ya, masalahnya di baris selanjutnya.

## Rekomendasi

**BEST SOLUTION:**

1. **Hapus semua data PK:**
   ```powershell
   cd backend
   node -e "import('./database.js').then(m => { const db = m.default; db.prepare('DELETE FROM pk').run(); console.log('Done'); })"
   ```

2. **Pastikan Google Sheets format benar:**
   - Header: Nama | NIP | Telepon | Jabatan
   - Semua baris punya kolom "Nama" terisi
   - Tidak ada baris kosong
   - Format konsisten

3. **Sync ulang:**
   - Buka Management PK
   - Paste URL Google Sheets
   - Klik "Sync Now"
   - Lihat terminal backend untuk logs detail

4. **Verifikasi:**
   - Cek Management PK
   - Harus ada 63 PK
   - Jika kurang, lihat logs untuk tahu baris mana yang di-skip

## Quick Commands

```powershell
# 1. Hapus semua PK
cd d:\kiansantang\bapas-bandung\backend
node -e "import('./database.js').then(m => { const db = m.default; db.prepare('DELETE FROM pk').run(); console.log('All PK deleted'); })"

# 2. Cek jumlah PK
node -e "import('./database.js').then(m => { const db = m.default; const r = db.prepare('SELECT COUNT(*) as c FROM pk').get(); console.log('Total PK:', r.c); })"

# 3. Sync ulang dari Management PK UI
# Lalu cek lagi
node -e "import('./database.js').then(m => { const db = m.default; const r = db.prepare('SELECT COUNT(*) as c FROM pk WHERE is_active = 1').get(); console.log('Active PK:', r.c); })"
```

## Expected Result

Setelah hapus dan sync ulang:
- Total PK: 63
- Active PK: 63
- Semua data muncul di Management PK

Jika masih kurang dari 63, berarti ada masalah di Google Sheets (baris kosong, nama kosong, dll).
