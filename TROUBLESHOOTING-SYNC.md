# 🔧 Troubleshooting Google Sheets Sync

## ✅ Masalah yang Sudah Diperbaiki

### 1. **CSV Parser Error - Data dengan Koma**

**Masalah:**
- Sync gagal ketika data mengandung koma (contoh: "Budi Santoso, S.Sos")
- Data terpotong atau masuk ke kolom yang salah

**Penyebab:**
- CSV parser sederhana tidak bisa handle quoted values
- Google Sheets export CSV dengan quotes untuk data yang mengandung koma

**Solusi yang Diterapkan:**
✅ Update `backend/routes/googleSheets.js` dengan CSV parser yang proper
✅ Parser baru bisa handle:
- Data dengan koma: `"Budi Santoso, S.Sos"`
- Data dengan quotes: `"Jl. Asia Afrika No. 10, Bandung"`
- Data normal: `081234567890`

**Code yang Diperbaiki:**
```javascript
// OLD (SALAH):
const values = line.split(',').map(v => v.trim().replace(/"/g, ''));

// NEW (BENAR):
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
};
```

---

## 🔍 Cara Cek Masalah Sync

### 1. Cek Backend Logs

**Windows PowerShell:**
```powershell
# Lihat proses backend
Get-Process -Name node | Where-Object {$_.Path -like "*backend*"}

# Restart backend
cd backend
npm run dev
```

**Cek Console:**
- Buka terminal backend
- Lihat output saat sync
- Cari error message

### 2. Cek Browser Console

**Chrome/Edge:**
1. Tekan `F12`
2. Tab "Console"
3. Klik "Sync Now"
4. Lihat error yang muncul

**Error yang Umum:**
```
❌ Network Error → Backend tidak jalan
❌ 403 Forbidden → Sheet tidak di-share
❌ 400 Bad Request → Format URL salah
❌ Column not found → Header salah
```

### 3. Cek Google Sheets

**Checklist:**
- [ ] Sheet di-share "Anyone with the link"
- [ ] Permission: "Viewer"
- [ ] Header di baris 1
- [ ] Urutan kolom benar
- [ ] Tidak ada kolom tambahan
- [ ] Data tidak kosong

---

## 🐛 Error Messages & Solusi

### Error: "Google Sheets URL is required"

**Penyebab:** Input URL kosong

**Solusi:**
1. Paste URL Google Sheets
2. Pastikan URL lengkap

---

### Error: "Invalid Google Sheets URL"

**Penyebab:** Format URL salah

**Solusi:**
✅ URL harus seperti ini:
```
https://docs.google.com/spreadsheets/d/1ABC123xyz/edit
```

❌ Bukan seperti ini:
```
https://drive.google.com/...
https://sheets.google.com/...
```

---

### Error: "Access denied" atau 403

**Penyebab:** Sheet tidak di-share dengan benar

**Solusi:**
1. Buka Google Sheets
2. Klik "Share" (pojok kanan atas)
3. Pilih "Anyone with the link"
4. Set permission: "Viewer"
5. Copy URL lagi
6. Coba sync lagi

---

### Error: "Column 'Nama' not found"

**Penyebab:** Header tidak sesuai atau tidak di baris 1

**Solusi:**
1. Cek baris 1 adalah header
2. Pastikan ada kolom "Nama"
3. Case-insensitive: `Nama` atau `nama` atau `NAMA` → OK

**Format yang Benar:**

**PK:**
```
Baris 1: Nama | NIP | Telepon | Jabatan
```

**Klien:**
```
Baris 1: Nama | NIK | Telepon | Alamat
```

---

### Error: "No data synced" atau "0 synced"

**Penyebab:** 
- Kolom "Nama" kosong
- Hanya ada header, tidak ada data
- Format data salah

**Solusi:**
1. Pastikan ada data di baris 2 dst
2. Minimal kolom "Nama" harus terisi
3. Cek tidak ada baris kosong di tengah

---

### Error: Data Terpotong atau Salah Kolom

**Penyebab:** Data mengandung koma tidak di-quote

**Solusi:**
✅ **Sudah diperbaiki!** Backend sekarang bisa handle data dengan koma.

**Jika masih error:**
1. Restart backend
2. Coba sync lagi
3. Cek backend logs

---

### Error: Network Error

**Penyebab:** Backend tidak jalan

**Solusi:**
```powershell
# Stop backend lama
Get-Process -Name node | Stop-Process -Force

# Start backend baru
cd backend
npm run dev
```

**Cek backend jalan:**
- Buka `http://localhost:3000/api/health`
- Harus return status OK

---

## 🔄 Langkah Restart Lengkap

Jika sync masih gagal, coba restart semua:

### 1. Stop Semua Proses
```powershell
Get-Process -Name node | Stop-Process -Force
```

### 2. Start Backend
```powershell
cd d:\kiansantang\bapas-bandung\backend
npm run dev
```

Tunggu sampai muncul:
```
✅ Server running on port 3000
✅ Database connected
```

### 3. Start Operator App
```powershell
cd d:\kiansantang\bapas-bandung\operator-app
npm run dev
```

Tunggu sampai muncul:
```
➜  Local:   http://localhost:5174/
```

### 4. Refresh Browser
1. Tekan `Ctrl + Shift + R` (hard refresh)
2. Login lagi
3. Coba sync lagi

---

## 📊 Test Sync Step-by-Step

### Test PK Sync:

1. **Buat Google Sheet Test:**
   ```
   Nama                    | NIP                | Telepon      | Jabatan
   Test User 1             | 123456789012345678 | 081234567890 | Test Jabatan
   ```

2. **Share Sheet:**
   - Anyone with the link → Viewer

3. **Copy URL:**
   ```
   https://docs.google.com/spreadsheets/d/YOUR_ID/edit
   ```

4. **Sync:**
   - Buka Management PK
   - Paste URL
   - Klik "Sync Now"

5. **Cek Hasil:**
   - Harus muncul: "1 new PK added"
   - Data muncul di tabel

### Test Klien Sync:

1. **Buat Tab di Google Sheet:**
   - Tab name: "Klien - Test PK"
   ```
   Nama        | NIK              | Telepon      | Alamat
   Test Klien  | 1234567890123456 | 081234567890 | Test Alamat
   ```

2. **Copy URL dengan gid:**
   ```
   https://docs.google.com/spreadsheets/d/YOUR_ID/edit#gid=123456
   ```
   ⚠️ Harus ada `#gid=` di URL!

3. **Sync:**
   - Buka Management Klien
   - Pilih PK
   - Paste URL
   - Klik "Sync Now"

4. **Cek Hasil:**
   - Harus muncul: "1 new clients added"
   - Data muncul di tabel

---

## 💡 Tips Debugging

### 1. Test dengan Data Sederhana
- Jangan langsung sync data banyak
- Test dengan 1-2 baris dulu
- Jika berhasil, baru tambah data lengkap

### 2. Cek Backend Logs
- Buka terminal backend
- Lihat output saat sync:
  ```
  Fetching data from Google Sheets: https://...
  Headers: [ 'Nama', 'NIP', 'Telepon', 'Jabatan' ]
  Added new PK: Budi Santoso
  ```

### 3. Cek Browser Console
- F12 → Console
- Lihat request/response
- Cek error message

### 4. Test Manual API
```powershell
# Test sync PK
curl -X POST http://localhost:3000/api/google-sheets/sync-pk `
  -H "Content-Type: application/json" `
  -d '{"sheetUrl":"YOUR_SHEET_URL"}'
```

---

## 📝 Checklist Sebelum Report Bug

Sebelum report masalah, pastikan sudah cek:

- [ ] Backend jalan di port 3000
- [ ] Operator app jalan di port 5174
- [ ] Google Sheet di-share dengan benar
- [ ] Format header sesuai
- [ ] Urutan kolom benar
- [ ] URL lengkap dan benar
- [ ] Sudah restart backend
- [ ] Sudah hard refresh browser
- [ ] Sudah cek browser console
- [ ] Sudah cek backend logs

---

## 🎯 Quick Fix Commands

### Restart Everything:
```powershell
# Stop all
Get-Process -Name node | Stop-Process -Force

# Start backend
cd d:\kiansantang\bapas-bandung\backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# Start operator
cd d:\kiansantang\bapas-bandung\operator-app
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

### Check Ports:
```powershell
# Cek port 3000 (backend)
Test-NetConnection -ComputerName localhost -Port 3000

# Cek port 5174 (operator)
Test-NetConnection -ComputerName localhost -Port 5174
```

---

## 📞 Support

Jika masih ada masalah:

1. **Cek dokumentasi:**
   - `FORMAT-GOOGLE-SHEETS-BENAR.md`
   - `MANAGEMENT-PK-KLIEN.md`
   - `format-google-sheets-visual.html`

2. **Cek logs:**
   - Backend terminal
   - Browser console (F12)

3. **Screenshot:**
   - Error message
   - Google Sheets format
   - Browser console

---

**Sync sekarang sudah diperbaiki dan seharusnya bisa handle data dengan koma!** ✅🚀

**Backend sudah di-restart dengan parser yang baru.**
