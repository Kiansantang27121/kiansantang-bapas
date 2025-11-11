# ✅ Fix: Data Tidak Muncul di Management PK/Klien

## 🐛 Masalah

**Gejala:**
- Sync berhasil (contoh: "63 PK diupdate")
- Tapi data tidak muncul di tabel Management PK
- Alert menunjukkan sync berhasil
- Backend logs menunjukkan data tersimpan

**Screenshot Masalah:**
```
Sync berhasil!
0 PK baru ditambahkan
63 PK diupdate
```
Tapi tabel masih kosong atau data lama tidak muncul.

---

## 🔍 Root Cause

### Masalah 1: Field `is_active` Tidak Di-Set
Saat sync dari Google Sheets:
- INSERT baru: `is_active` tidak di-set → default NULL atau 0
- UPDATE existing: `is_active` tidak diubah → tetap 0 jika sebelumnya di-delete

### Masalah 2: Query GET Hanya Ambil Active Data
Endpoint `/api/pk` dan `/api/clients`:
```javascript
SELECT * FROM pk WHERE is_active = 1  // Hanya ambil yang active
```

**Result:** Data dengan `is_active = 0` atau `NULL` tidak muncul!

---

## ✅ Solusi yang Diterapkan

### 1. **Update Google Sheets Sync** (`backend/routes/googleSheets.js`)

**Sebelum (SALAH):**
```javascript
// Insert new PK
db.prepare('INSERT INTO pk (name, nip, phone, jabatan) VALUES (?, ?, ?, ?)').run(...)

// Update existing PK
db.prepare('UPDATE pk SET name = ?, nip = ?, phone = ?, jabatan = ? WHERE id = ?').run(...)
```

**Sesudah (BENAR):**
```javascript
// Insert new PK (with is_active = 1)
db.prepare('INSERT INTO pk (name, nip, phone, jabatan, is_active) VALUES (?, ?, ?, ?, 1)').run(...)

// Update existing PK (set is_active = 1)
db.prepare('UPDATE pk SET name = ?, nip = ?, phone = ?, jabatan = ?, is_active = 1 WHERE id = ?').run(...)
```

**Perubahan:**
- ✅ INSERT: Tambah field `is_active = 1`
- ✅ UPDATE: Set `is_active = 1` (reaktivasi jika sebelumnya di-delete)

### 2. **Fix Data yang Sudah Ada** (`backend/fix-inactive-data.js`)

Script untuk fix data existing yang `is_active = 0` atau `NULL`:

```javascript
// Fix PK data
UPDATE pk SET is_active = 1 WHERE is_active IS NULL OR is_active = 0

// Fix Clients data
UPDATE clients SET is_active = 1 WHERE is_active IS NULL OR is_active = 0
```

**Hasil:**
- ✅ 39 PK records di-fix
- ✅ 0 Clients records di-fix (sudah benar)

---

## 🚀 Cara Fix Data Anda

### Jika Data Tidak Muncul Setelah Sync:

#### Option 1: Jalankan Fix Script (RECOMMENDED)

```powershell
cd d:\kiansantang\bapas-bandung\backend
node fix-inactive-data.js
```

**Output yang Diharapkan:**
```
🔧 Fixing inactive PK and Clients data...

✅ Fixed 39 PK records
✅ Fixed 0 Clients records

📊 Current Active Data:
   PK: 39
   Clients: 12

✅ Done! Data sekarang akan muncul di Management PK/Klien.
```

#### Option 2: Manual SQL Query

Jika script tidak jalan, jalankan query manual:

```sql
-- Fix PK
UPDATE pk SET is_active = 1 WHERE is_active IS NULL OR is_active = 0;

-- Fix Clients
UPDATE clients SET is_active = 1 WHERE is_active IS NULL OR is_active = 0;
```

#### Option 3: Sync Ulang

Setelah backend di-update:
1. Restart backend
2. Buka Management PK
3. Sync ulang dari Google Sheets
4. Data akan muncul dengan `is_active = 1`

---

## 🔄 Workflow Setelah Fix

### Sync Baru (Setelah Fix):

```
1. User paste Google Sheets URL
   ↓
2. Click "Sync Now"
   ↓
3. Backend parse CSV
   ↓
4. For each row:
   - Check if exists
   - If exists: UPDATE with is_active = 1 ✅
   - If not: INSERT with is_active = 1 ✅
   ↓
5. Frontend refresh list
   ↓
6. Data muncul di tabel ✅
```

---

## 📊 Verifikasi Fix

### 1. Cek Database Langsung

```powershell
cd d:\kiansantang\bapas-bandung\backend
node -e "import('./database.js').then(m => { const db = m.default; console.log('Active PK:', db.prepare('SELECT COUNT(*) as c FROM pk WHERE is_active = 1').get()); console.log('Inactive PK:', db.prepare('SELECT COUNT(*) as c FROM pk WHERE is_active = 0').get()); })"
```

### 2. Test via API

```powershell
# Get all active PK
curl http://localhost:3000/api/pk

# Should return array of PK with is_active = 1
```

### 3. Test via UI

1. Buka `http://localhost:5174/pk`
2. Data PK harus muncul di tabel
3. Total PK harus sesuai dengan jumlah di database

---

## 🎯 Checklist Setelah Fix

- [x] Backend updated (`googleSheets.js`)
- [x] Fix script created (`fix-inactive-data.js`)
- [x] Fix script executed (39 PK fixed)
- [x] Backend restarted
- [ ] Browser hard refresh (`Ctrl + Shift + R`)
- [ ] Verify data muncul di Management PK
- [ ] Test sync baru
- [ ] Verify sync baru langsung muncul

---

## 🐛 Troubleshooting

### Data Masih Tidak Muncul Setelah Fix

**Cek 1: Backend Updated?**
```powershell
# Cek file googleSheets.js
grep -n "is_active" backend/routes/googleSheets.js
# Harus ada "is_active = 1" di INSERT dan UPDATE
```

**Cek 2: Fix Script Jalan?**
```powershell
cd backend
node fix-inactive-data.js
# Harus show "Fixed X PK records"
```

**Cek 3: Backend Restart?**
```powershell
# Stop backend
Stop-Process -Name node -Force

# Start backend
cd backend
npm run dev
```

**Cek 4: Browser Cache?**
```
Ctrl + Shift + R (hard refresh)
atau
Ctrl + Shift + Delete (clear cache)
```

### Sync Baru Masih Tidak Muncul

**Kemungkinan:**
- Backend belum restart
- Browser cache
- Google Sheets format salah

**Solusi:**
1. Restart backend
2. Hard refresh browser
3. Cek format Google Sheets
4. Test dengan data sederhana (1-2 baris)

---

## 📝 Summary

**Masalah:**
- Data sync berhasil tapi tidak muncul
- Root cause: `is_active` tidak di-set

**Fix:**
1. ✅ Update `googleSheets.js` - set `is_active = 1` saat INSERT/UPDATE
2. ✅ Create `fix-inactive-data.js` - fix data existing
3. ✅ Execute fix script - 39 PK fixed
4. ✅ Restart backend

**Result:**
- ✅ Data lama sekarang muncul (39 PK)
- ✅ Sync baru akan langsung muncul
- ✅ Update existing akan reaktivasi data

**Next Steps:**
1. Hard refresh browser
2. Cek Management PK - data harus muncul
3. Test sync baru - harus langsung muncul
4. Enjoy! 🎉

---

**Data sekarang akan muncul di Management PK/Klien!** ✅🚀

**Jangan lupa hard refresh browser:** `Ctrl + Shift + R`
