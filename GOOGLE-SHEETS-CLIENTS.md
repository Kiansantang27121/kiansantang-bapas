# 👥 Google Sheets Integration - Klien per PK

## 🎯 Konsep

Setiap PK memiliki **sheet/tab sendiri** dalam satu file Google Sheets untuk manage klien mereka.

### Struktur:
```
📊 Google Sheets: "Database Klien BAPAS"
├── 📄 Tab 1: Klien - Budi Santoso
├── 📄 Tab 2: Klien - Siti Nurhaliza  
├── 📄 Tab 3: Klien - Ahmad Fauzi
└── 📄 Tab 4: Klien - Dewi Lestari
```

**Setiap tab berisi klien untuk PK tersebut.**

---

## 📋 Format Google Sheets

### Header Row (Baris 1):
```
Nama | NIK | Telepon | Alamat
```

### Contoh Data (Tab: Klien - Budi Santoso):
```
Nama              | NIK                | Telepon       | Alamat
Andi Wijaya       | 3201010101900001   | 081111111111  | Jl. Merdeka No. 1, Bandung
Budi Setiawan     | 3201010101900002   | 081111111112  | Jl. Asia Afrika No. 5, Bandung
Citra Dewi        | 3201010101900003   | 081111111113  | Jl. Braga No. 10, Bandung
```

### Contoh Data (Tab: Klien - Siti Nurhaliza):
```
Nama              | NIK                | Telepon       | Alamat
Doni Prasetyo     | 3201010101900004   | 081111111114  | Jl. Dago No. 15, Bandung
Eka Putri         | 3201010101900005   | 081111111115  | Jl. Cihampelas No. 20, Bandung
```

---

## 🔧 Setup Google Sheets

### STEP 1: Buat Google Sheet Baru

1. Buka https://sheets.google.com
2. Klik "Blank" untuk sheet baru
3. Rename file: "Database Klien BAPAS"

### STEP 2: Buat Tab untuk Setiap PK

**Untuk setiap PK, buat tab baru:**

1. Klik "+" di bawah (Add Sheet)
2. Rename tab: "Klien - [Nama PK]"
   - Contoh: "Klien - Budi Santoso"
3. Isi header: Nama, NIK, Telepon, Alamat
4. Isi data klien untuk PK tersebut

**Ulangi untuk semua PK.**

### STEP 3: Set Permission

1. Klik "Share" (pojok kanan atas)
2. Change to "Anyone with the link"
3. Set to "Viewer"
4. Klik "Copy link"

### STEP 4: Get URL dengan GID

**Untuk setiap tab:**

1. Klik tab yang ingin di-sync
2. Copy URL dari browser
3. URL akan berisi `#gid=123456`
4. Save URL ini untuk sync

**Contoh URL:**
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ/edit#gid=0
https://docs.google.com/spreadsheets/d/1ABC123XYZ/edit#gid=123456789
https://docs.google.com/spreadsheets/d/1ABC123XYZ/edit#gid=987654321
```

**GID berbeda untuk setiap tab!**

---

## 🚀 Backend API

### 1. POST /api/google-sheets/sync-clients

Sync klien dari Google Sheets untuk PK tertentu.

**Request:**
```json
{
  "sheetUrl": "https://docs.google.com/spreadsheets/d/ABC/edit#gid=123",
  "pkId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sync completed for Budi Santoso: 3 new clients added, 2 clients updated, 0 errors",
  "pkName": "Budi Santoso, S.Sos",
  "synced": 3,
  "updated": 2,
  "errors": 0
}
```

### 2. GET /api/google-sheets/clients-sheet-url/:pkId

Get saved Google Sheets URL untuk PK tertentu.

**Response:**
```json
{
  "url": "https://docs.google.com/spreadsheets/d/ABC/edit#gid=123"
}
```

### 3. GET /api/google-sheets/all-pk-sheets

Get semua PK dengan Google Sheets URL mereka.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Budi Santoso, S.Sos",
    "nip": "198501012010011001",
    "jabatan": "Pembimbing Kemasyarakatan Ahli Muda",
    "clientsSheetUrl": "https://docs.google.com/.../edit#gid=0"
  },
  {
    "id": 2,
    "name": "Siti Nurhaliza, S.H.",
    "nip": "198702022011012002",
    "jabatan": "Pembimbing Kemasyarakatan Ahli Madya",
    "clientsSheetUrl": "https://docs.google.com/.../edit#gid=123456"
  }
]
```

---

## 💾 Database Storage

### Settings Table:

Setiap PK punya entry sendiri di settings:

```sql
key: google_sheets_clients_pk_1
value: https://docs.google.com/.../edit#gid=0

key: google_sheets_clients_pk_2
value: https://docs.google.com/.../edit#gid=123456

key: google_sheets_clients_pk_3
value: https://docs.google.com/.../edit#gid=789012
```

**Pattern:** `google_sheets_clients_pk_{pkId}`

---

## 🎨 Test Page

### File: `test-google-sheets-clients.html`

**Features:**
- Load semua PK
- Input Google Sheets URL per PK
- Sync button per PK
- View clients per PK
- View all PK sheets summary

**Usage:**
1. Buka `test-google-sheets-clients.html`
2. Auto-load PK list
3. Untuk setiap PK:
   - Paste Google Sheets URL (dengan #gid)
   - Click "Sync Klien"
   - Click "View Klien" untuk lihat hasil

---

## 🔄 Sync Flow

### Complete Flow:

```
1. User buat Google Sheet dengan multiple tabs
   ↓
2. Setiap tab = klien untuk 1 PK
   ↓
3. User klik tab PK tertentu
   ↓
4. Copy URL (dengan #gid)
   ↓
5. Paste di test page untuk PK tersebut
   ↓
6. Click "Sync Klien untuk [PK Name]"
   ↓
7. Backend:
   - Extract sheet ID & gid
   - Fetch CSV dari tab tersebut
   - Parse data
   - Check existing clients (by NIK/name + pk_id)
   - Update atau Insert
   - Save URL ke settings
   ↓
8. Return hasil sync
   ↓
9. User dapat view klien untuk verify
```

---

## 📊 Data Mapping

### Google Sheets → Database

```javascript
// Google Sheets Tab: "Klien - Budi Santoso"
Nama: "Andi Wijaya"
NIK: "3201010101900001"
Telepon: "081111111111"
Alamat: "Jl. Merdeka No. 1"

// Database: clients table
{
  pk_id: 1,  // Budi Santoso
  name: "Andi Wijaya",
  nik: "3201010101900001",
  phone: "081111111111",
  address: "Jl. Merdeka No. 1"
}
```

**Key Point:** `pk_id` menghubungkan klien ke PK tertentu!

---

## 🎯 Use Cases

### Use Case 1: Setup Awal

**Scenario:** Pertama kali setup database klien

**Steps:**
1. Buat Google Sheet "Database Klien BAPAS"
2. Buat 5 tabs untuk 5 PK
3. Isi data klien di setiap tab
4. Sync semua tab satu per satu
5. Verify di registration form

### Use Case 2: Update Data Klien

**Scenario:** Ada klien baru atau data berubah

**Steps:**
1. Buka Google Sheet
2. Pilih tab PK yang relevan
3. Tambah/edit data klien
4. Copy URL tab tersebut
5. Sync ulang untuk PK tersebut
6. Data auto-update di database

### Use Case 3: PK Baru

**Scenario:** Ada PK baru ditambahkan

**Steps:**
1. Tambah PK via API atau dashboard
2. Buat tab baru di Google Sheet
3. Rename: "Klien - [Nama PK Baru]"
4. Isi data klien
5. Sync untuk PK baru
6. Klien langsung tersedia

---

## 🎨 UI Flow - Registration Form

### Saat User Pilih PK:

```
1. User pilih "Bimbingan Wajib Lapor"
   ↓
2. Dropdown PK muncul
   ↓
3. User pilih "Budi Santoso"
   ↓
4. System fetch klien untuk pk_id=1
   ↓
5. Dropdown klien show:
   - Andi Wijaya (3201010101900001)
   - Budi Setiawan (3201010101900002)
   - Citra Dewi (3201010101900003)
   ↓
6. User pilih klien atau input manual
```

**Klien yang muncul HANYA untuk PK yang dipilih!**

---

## 🔍 Advanced Features

### 1. GID Extraction

```javascript
// URL: https://docs.google.com/.../edit#gid=123456
const gidMatch = sheetUrl.match(/[#&]gid=([0-9]+)/);
const gid = gidMatch ? gidMatch[1] : '0';

// CSV URL: https://docs.google.com/.../export?format=csv&gid=123456
```

**Ini memastikan kita fetch tab yang benar!**

### 2. Duplicate Detection

```javascript
// Check by NIK + pk_id
SELECT * FROM clients WHERE nik = ? AND pk_id = ?

// If not found, check by name + pk_id
SELECT * FROM clients WHERE name = ? AND pk_id = ?

// Update if exists, Insert if not
```

**Mencegah duplicate klien untuk PK yang sama.**

### 3. Batch Sync

User bisa sync semua PK sekaligus dengan loop:

```javascript
for (const pk of pkList) {
  await syncClients(pk.id, pk.sheetUrl);
}
```

---

## 📋 Example Google Sheets Structure

### File: "Database Klien BAPAS"

**Tab 1: Klien - Budi Santoso (#gid=0)**
```
Nama              | NIK                | Telepon       | Alamat
Andi Wijaya       | 3201010101900001   | 081111111111  | Jl. Merdeka No. 1
Budi Setiawan     | 3201010101900002   | 081111111112  | Jl. Asia Afrika No. 5
Citra Dewi        | 3201010101900003   | 081111111113  | Jl. Braga No. 10
```

**Tab 2: Klien - Siti Nurhaliza (#gid=123456)**
```
Nama              | NIK                | Telepon       | Alamat
Doni Prasetyo     | 3201010101900004   | 081111111114  | Jl. Dago No. 15
Eka Putri         | 3201010101900005   | 081111111115  | Jl. Cihampelas No. 20
Fajar Ramadan     | 3201010101900006   | 081111111116  | Jl. Sukajadi No. 25
```

**Tab 3: Klien - Ahmad Fauzi (#gid=789012)**
```
Nama              | NIK                | Telepon       | Alamat
Gita Savitri      | 3201010101900007   | 081111111117  | Jl. Setiabudhi No. 30
Hendra Gunawan    | 3201010101900008   | 081111111118  | Jl. Pasteur No. 35
```

---

## 🐛 Troubleshooting

### Problem 1: Wrong Tab Synced

**Issue:** Data dari tab lain masuk ke PK yang salah

**Cause:** URL tidak ada #gid atau gid salah

**Solution:**
1. Pastikan klik tab yang benar
2. Copy URL dari browser (harus ada #gid)
3. Verify gid number berbeda untuk setiap tab

### Problem 2: Duplicate Clients

**Issue:** Klien muncul 2x setelah sync

**Cause:** NIK atau nama berbeda sedikit

**Solution:**
1. Standardize data di Google Sheets
2. Pastikan NIK konsisten
3. Re-sync akan update, bukan duplicate

### Problem 3: Access Denied

**Issue:** 403 error saat sync

**Cause:** Sheet tidak public

**Solution:**
1. Share → "Anyone with the link"
2. Set to "Viewer"
3. Try sync again

### Problem 4: Column Not Found

**Issue:** "Column Nama not found"

**Cause:** Header salah atau typo

**Solution:**
1. Check header row (baris 1)
2. Must have: Nama, NIK, Telepon, Alamat
3. Case-insensitive tapi harus ada kata kunci

---

## ✅ Testing Checklist

### Setup:
- [ ] Google Sheet created
- [ ] Multiple tabs created (1 per PK)
- [ ] Headers correct in all tabs
- [ ] Data filled in all tabs
- [ ] Sheet set to public (Anyone with link)

### Sync:
- [ ] URL dengan #gid copied
- [ ] Sync endpoint works
- [ ] New clients added
- [ ] Existing clients updated
- [ ] No errors
- [ ] URL saved to settings

### Verification:
- [ ] View clients shows correct data
- [ ] Clients linked to correct PK
- [ ] Registration form shows clients
- [ ] Search works
- [ ] Manual input still works

### Integration:
- [ ] All PK sheets endpoint works
- [ ] Each PK has separate sheet URL
- [ ] Sync multiple PK works
- [ ] Data doesn't mix between PK

---

## 📊 Summary

**Konsep:**
- 1 Google Sheet file
- Multiple tabs (1 per PK)
- Each tab = klien untuk PK tersebut
- GID identifies specific tab

**Benefits:**
- Easy management per PK
- Centralized data
- Easy updates
- No mixing of clients
- Scalable

**Files:**
- `backend/routes/googleSheets.js` - Sync endpoints
- `test-google-sheets-clients.html` - Test page
- `GOOGLE-SHEETS-CLIENTS.md` - Documentation

**API Endpoints:**
- POST `/api/google-sheets/sync-clients` - Sync klien
- GET `/api/google-sheets/clients-sheet-url/:pkId` - Get URL
- GET `/api/google-sheets/all-pk-sheets` - Get all

**Next Steps:**
1. Buat Google Sheet dengan tabs
2. Isi data klien per tab
3. Test sync via test page
4. Verify di registration form

---

**Google Sheets Klien Integration siap digunakan!** 👥📊✨
