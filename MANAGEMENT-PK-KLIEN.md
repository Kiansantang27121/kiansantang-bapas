# 👥 Management PK & Klien - Admin Dashboard

## 🎯 Fitur Baru

Menambahkan menu **Management PK** dan **Management Klien** pada Operator Dashboard untuk role **Admin**.

### Menu Baru:
1. **Management PK** - Kelola data Pembimbing Kemasyarakatan
2. **Management Klien** - Kelola data Klien per PK

---

## 📋 Fitur Management PK

### ✨ Fitur Utama:

#### 1. **CRUD PK**
- ✅ Tambah PK baru
- ✅ Edit data PK
- ✅ Hapus PK
- ✅ View semua PK

#### 2. **Search & Filter**
- 🔍 Search by: Nama, NIP, Jabatan
- 📊 Real-time filtering
- 💡 Auto-suggest

#### 3. **Google Sheets Sync**
- 🔄 Sync data PK dari Google Sheets
- 📥 Import bulk data
- 🔁 Update existing atau insert new
- 💾 Save Google Sheets URL

#### 4. **Export Data**
- 📤 Export ke CSV
- 📊 Include semua data PK
- 📅 Auto-filename dengan tanggal

#### 5. **Form Validation**
- ✅ Nama wajib diisi
- ✅ NIP 18 digit (opsional)
- ✅ Telepon format Indonesia
- ✅ Jabatan dropdown

---

## 📋 Fitur Management Klien

### ✨ Fitur Utama:

#### 1. **CRUD Klien**
- ✅ Tambah klien baru
- ✅ Edit data klien
- ✅ Hapus klien
- ✅ View semua klien

#### 2. **Search & Filter**
- 🔍 Search by: Nama, NIK, Alamat
- 🎯 Filter by PK
- 📊 Real-time filtering
- 💡 Multi-filter support

#### 3. **Google Sheets Sync**
- 🔄 Sync klien per PK dari Google Sheets
- 📥 Import bulk data per PK
- 🔁 Update existing atau insert new
- 💾 Save Google Sheets URL per PK

#### 4. **Export Data**
- 📤 Export ke CSV
- 📊 Include nama PK
- 🎯 Export filtered data
- 📅 Auto-filename dengan tanggal

#### 5. **Form Validation**
- ✅ Nama wajib diisi
- ✅ PK wajib dipilih
- ✅ NIK 16 digit (opsional)
- ✅ Telepon format Indonesia
- ✅ Alamat lengkap

---

## 🎨 UI/UX Design

### Management PK:

```
┌─────────────────────────────────────────────────────────┐
│ Management PK                    [Export CSV] [+ Tambah] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ 🔄 Sync dari Google Sheets                               │
│ [Google Sheets URL Input]              [🔄 Sync Now]     │
│                                                           │
│ 🔍 Search                                                 │
│ [Cari nama, NIP, atau jabatan...]                        │
│                                                           │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Nama    │ NIP    │ Telepon │ Jabatan  │ Aksi     │   │
│ ├───────────────────────────────────────────────────┤   │
│ │ Budi... │ 198... │ 0812... │ PK Ahli  │ [✏️] [🗑️] │   │
│ │ Siti... │ 198... │ 0812... │ PK Madya │ [✏️] [🗑️] │   │
│ └───────────────────────────────────────────────────┘   │
│                                                           │
│ Total PK: 10        Hasil Pencarian: 10                  │
└─────────────────────────────────────────────────────────┘
```

### Management Klien:

```
┌─────────────────────────────────────────────────────────┐
│ Management Klien                 [Export CSV] [+ Tambah] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ 🔄 Sync Klien dari Google Sheets                         │
│ [Pilih PK ▼] [Google Sheets URL]    [🔄 Sync Now]       │
│                                                           │
│ 🔍 Search & Filter                                        │
│ [Cari nama, NIK...]  [Filter PK ▼]                       │
│                                                           │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Nama  │ NIK  │ Telepon │ Alamat │ PK    │ Aksi   │   │
│ ├───────────────────────────────────────────────────┤   │
│ │ Andi  │ 32.. │ 0812... │ Jl...  │ Budi  │ [✏️][🗑️]│   │
│ │ Budi  │ 32.. │ 0812... │ Jl...  │ Siti  │ [✏️][🗑️]│   │
│ └───────────────────────────────────────────────────┘   │
│                                                           │
│ Total: 50   Filter: 50   Total PK: 10                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 File yang Dibuat/Dimodifikasi

### File Baru:

1. **`operator-app/src/pages/PKManagement.jsx`**
   - Halaman management PK
   - CRUD operations
   - Google Sheets sync
   - Search & export

2. **`operator-app/src/pages/ClientManagement.jsx`**
   - Halaman management klien
   - CRUD operations
   - Google Sheets sync per PK
   - Search, filter & export

### File Dimodifikasi:

3. **`operator-app/src/App.jsx`**
   - Import PKManagement & ClientManagement
   - Route `/pk` untuk PKManagement
   - Route `/clients` untuk ClientManagement

4. **`operator-app/src/components/Layout.jsx`**
   - Import icon UserCheck & UsersRound
   - Menu "Management PK" (admin only)
   - Menu "Management Klien" (admin only)

---

## 🚀 Cara Menggunakan

### 1. Jalankan Aplikasi

```powershell
# Backend (jika belum berjalan)
cd backend
npm run dev

# Operator App
cd operator-app
npm run dev
```

### 2. Login sebagai Admin

- Username: `admin`
- Password: (sesuai database)
- Role: **admin** (penting!)

### 3. Akses Menu

Setelah login, menu baru akan muncul di sidebar:
- 👨‍💼 **Management PK**
- 👥 **Management Klien**

---

## 📊 Management PK - Step by Step

### A. Tambah PK Manual

1. Klik **"+ Tambah PK"**
2. Isi form:
   - Nama Lengkap * (wajib)
   - NIP (18 digit, opsional)
   - Nomor Telepon
   - Jabatan (dropdown)
3. Klik **"Simpan"**

### B. Sync dari Google Sheets

1. Buat Google Sheet dengan format:
   ```
   Nama | NIP | Telepon | Jabatan
   ```
2. Share sheet: "Anyone with the link" → "Viewer"
3. Copy URL Google Sheets
4. Paste di input "Sync dari Google Sheets"
5. Klik **"🔄 Sync Now"**
6. Tunggu proses selesai
7. Data akan muncul di tabel

### C. Search PK

1. Ketik di search box
2. Search by:
   - Nama: "Budi"
   - NIP: "198501"
   - Jabatan: "Ahli Muda"
3. Hasil filter real-time

### D. Edit PK

1. Klik icon **✏️** (Edit) di kolom Aksi
2. Form akan muncul dengan data terisi
3. Edit data yang perlu diubah
4. Klik **"Simpan"**

### E. Hapus PK

1. Klik icon **🗑️** (Hapus) di kolom Aksi
2. Konfirmasi penghapusan
3. Data akan terhapus

### F. Export CSV

1. Klik **"Export CSV"**
2. File akan terdownload otomatis
3. Nama file: `data-pk-YYYY-MM-DD.csv`

---

## 📊 Management Klien - Step by Step

### A. Tambah Klien Manual

1. Klik **"+ Tambah Klien"**
2. Isi form:
   - Pilih PK * (wajib)
   - Nama Lengkap * (wajib)
   - NIK (16 digit, opsional)
   - Nomor Telepon
   - Alamat Lengkap
3. Klik **"Simpan"**

### B. Sync dari Google Sheets

1. Buat Google Sheet dengan tab per PK:
   ```
   Tab 1: Klien - Budi Santoso
   Format: Nama | NIK | Telepon | Alamat
   ```
2. Share sheet: "Anyone with the link" → "Viewer"
3. Pilih **PK** di dropdown
4. Copy URL tab (harus include `gid=`)
5. Paste di input "Sync Klien dari Google Sheets"
6. Klik **"🔄 Sync Now"**
7. Data klien untuk PK tersebut akan ter-sync

### C. Search & Filter Klien

**Search:**
1. Ketik di search box
2. Search by: Nama, NIK, Alamat
3. Hasil filter real-time

**Filter by PK:**
1. Pilih PK di dropdown "Filter PK"
2. Hanya klien dari PK tersebut yang muncul
3. Bisa dikombinasi dengan search

### D. Edit Klien

1. Klik icon **✏️** (Edit)
2. Form muncul dengan data terisi
3. Edit data
4. Klik **"Simpan"**

### E. Hapus Klien

1. Klik icon **🗑️** (Hapus)
2. Konfirmasi
3. Data terhapus

### F. Export CSV

1. Klik **"Export CSV"**
2. Export data yang sedang di-filter
3. Include nama PK di kolom terakhir
4. Nama file: `data-klien-YYYY-MM-DD.csv`

---

## 🎯 Role & Permission

### Admin:
- ✅ Akses Management PK
- ✅ Akses Management Klien
- ✅ CRUD semua data
- ✅ Sync Google Sheets
- ✅ Export data

### Operator:
- ❌ Tidak bisa akses Management PK
- ❌ Tidak bisa akses Management Klien
- ✅ Hanya bisa akses Dashboard & Antrian

---

## 📊 API Endpoints yang Digunakan

### PK Endpoints:

```javascript
GET    /api/pk                          // Get all PK
POST   /api/pk                          // Create PK
PUT    /api/pk/:id                      // Update PK
DELETE /api/pk/:id                      // Delete PK
POST   /api/google-sheets/sync-pk       // Sync from Google Sheets
GET    /api/google-sheets/pk-sheet-url  // Get saved sheet URL
```

### Client Endpoints:

```javascript
GET    /api/clients                           // Get all clients
POST   /api/clients                           // Create client
PUT    /api/clients/:id                       // Update client
DELETE /api/clients/:id                       // Delete client
POST   /api/google-sheets/sync-clients        // Sync from Google Sheets
GET    /api/google-sheets/clients-sheet-url/:pkId  // Get saved sheet URL
```

---

## 🎨 Styling & Icons

### Colors:

**Management PK:**
- Primary: Blue-Purple gradient (`#667eea` → `#764ba2`)
- Accent: Purple (`#667eea`)
- Success: Green (`#28a745`)

**Management Klien:**
- Primary: Orange-Red gradient (`#f97316` → `#ef4444`)
- Accent: Orange (`#f97316`)
- Success: Green (`#28a745`)

### Icons (Lucide React):

- **UserCheck**: Management PK menu
- **UsersRound**: Management Klien menu
- **Plus**: Tambah data
- **Edit2**: Edit data
- **Trash2**: Hapus data
- **Save**: Simpan
- **X**: Close/Cancel
- **Search**: Search input
- **Filter**: Filter dropdown
- **Download**: Export CSV
- **FileText**: Google Sheets sync
- **Phone**: Telepon
- **Briefcase**: Jabatan
- **CreditCard**: NIK
- **MapPin**: Alamat

---

## ✅ Validasi Form

### Form PK:

| Field    | Required | Format              | Validasi                |
|----------|----------|---------------------|-------------------------|
| Nama     | ✅ Ya    | Text                | Min 3 karakter          |
| NIP      | ❌ Tidak | 18 digit            | Numeric, max 18 char    |
| Telepon  | ❌ Tidak | 08xxxxxxxxxx        | Numeric, 10-13 digit    |
| Jabatan  | ❌ Tidak | Dropdown            | Predefined options      |

### Form Klien:

| Field    | Required | Format              | Validasi                |
|----------|----------|---------------------|-------------------------|
| PK       | ✅ Ya    | Dropdown            | Must select valid PK    |
| Nama     | ✅ Ya    | Text                | Min 3 karakter          |
| NIK      | ❌ Tidak | 16 digit            | Numeric, max 16 char    |
| Telepon  | ❌ Tidak | 08xxxxxxxxxx        | Numeric, 10-13 digit    |
| Alamat   | ❌ Tidak | Textarea            | Max 500 karakter        |

---

## 🐛 Troubleshooting

### Problem 1: Menu tidak muncul

**Penyebab:**
- User bukan admin
- Belum login

**Solusi:**
- Login dengan akun admin
- Check role di database: `SELECT * FROM users WHERE role = 'admin'`

### Problem 2: Error saat sync Google Sheets

**Penyebab:**
- Sheet tidak di-share
- URL salah
- Format header salah

**Solusi:**
- Share sheet: "Anyone with the link" → "Viewer"
- Check URL format
- Pastikan header: Nama, NIP, Telepon, Jabatan (untuk PK)

### Problem 3: Data tidak muncul setelah sync

**Penyebab:**
- Backend error
- Format data salah
- Kolom "Nama" kosong

**Solusi:**
- Check console browser (F12)
- Check backend logs
- Pastikan minimal kolom "Nama" terisi

### Problem 4: Export CSV tidak jalan

**Penyebab:**
- Browser block download
- No data to export

**Solusi:**
- Allow download di browser
- Pastikan ada data di tabel

---

## 📈 Statistik & Metrics

### Management PK:
- Total PK
- Hasil Pencarian

### Management Klien:
- Total Klien
- Hasil Filter
- Total PK

---

## 🔄 Update Flow

### Sync PK dari Google Sheets:

```
1. User paste Google Sheets URL
   ↓
2. Click "Sync Now"
   ↓
3. Backend fetch CSV from Google Sheets
   ↓
4. Parse CSV data
   ↓
5. For each row:
   - Check if PK exists (by NIP or name)
   - If exists: UPDATE
   - If not: INSERT
   ↓
6. Save Google Sheets URL to settings
   ↓
7. Return sync results
   ↓
8. Frontend refresh PK list
   ↓
9. Show success message
```

### Sync Klien dari Google Sheets:

```
1. User select PK
   ↓
2. Paste Google Sheets URL (with gid)
   ↓
3. Click "Sync Now"
   ↓
4. Backend fetch CSV from specific tab
   ↓
5. Parse CSV data
   ↓
6. For each row:
   - Check if client exists (by NIK or name for this PK)
   - If exists: UPDATE
   - If not: INSERT with pk_id
   ↓
7. Save Google Sheets URL for this PK
   ↓
8. Return sync results
   ↓
9. Frontend refresh client list
   ↓
10. Show success message
```

---

## 🎯 Best Practices

### 1. Data Entry:
- Gunakan Google Sheets untuk bulk import
- Manual entry untuk data individual
- Pastikan data valid sebelum save

### 2. Search & Filter:
- Gunakan search untuk cari cepat
- Kombinasi search + filter untuk hasil spesifik
- Clear filter untuk lihat semua data

### 3. Export:
- Export regular untuk backup
- Export filtered data untuk report spesifik
- Simpan file dengan naming convention

### 4. Google Sheets:
- Maintain sheet structure
- Regular update di Google Sheets
- Sync berkala ke sistem

---

## 📝 Summary

**Fitur yang Ditambahkan:**
- ✅ Management PK (CRUD, Search, Sync, Export)
- ✅ Management Klien (CRUD, Search, Filter, Sync, Export)
- ✅ Google Sheets Integration
- ✅ Real-time Search & Filter
- ✅ CSV Export
- ✅ Form Validation
- ✅ Role-based Access (Admin only)

**Benefits:**
- 📊 Centralized data management
- 🔄 Easy bulk import via Google Sheets
- 🔍 Fast search & filter
- 📤 Export untuk reporting
- 👥 Better PK & Client tracking
- 🎨 Modern & intuitive UI

---

**Management PK & Klien siap digunakan!** 👥📊✨

**Next Steps:**
1. Jalankan operator-app: `npm run dev`
2. Login sebagai admin
3. Akses menu "Management PK" atau "Management Klien"
4. Mulai kelola data!
