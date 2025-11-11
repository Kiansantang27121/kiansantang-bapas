# ✅ Data Klien Lengkap - Fitur Baru

## 📋 Field Data Klien yang Tersedia

Sistem sekarang mendukung data klien yang lebih lengkap untuk setiap PK:

### 1. **Data Identitas**
- **Nama Lengkap** (wajib)
- **NIK** - Nomor Induk Kependudukan (16 digit)
- **Nomor Telepon** - Nomor telepon utama
- **Nomor WhatsApp** - Nomor WhatsApp untuk komunikasi
- **Alamat Lengkap** - Alamat tempat tinggal

### 2. **Data Program** (WAJIB)
- **PB** - Pembimbingan
- **CB** - Cuti Bersyarat
- **CMB** - Cuti Menjelang Bebas
- **Asimilasi** - Program Asimilasi

### 3. **Data Pekerjaan**
- **Status Bekerja** - Bekerja / Tidak Bekerja
- **Pekerjaan** - Jenis pekerjaan (wajib jika bekerja)
  - Contoh: Karyawan Toko, Buruh Bangunan, Wiraswasta, Pedagang, dll

### 4. **Data PK**
- **PK ID** - Pembimbing Kemasyarakatan yang bertanggung jawab

## 🎯 Cara Menggunakan

### Tambah Klien Baru

1. **Buka Management Klien**: `http://localhost:5174/clients`
2. **Klik "Tambah Klien"**
3. **Isi Form:**
   - Pilih PK (wajib)
   - Nama Lengkap (wajib)
   - NIK (opsional, 16 digit)
   - Nomor Telepon (opsional)
   - Nomor WhatsApp (opsional)
   - Alamat Lengkap (opsional)
   - **Program (wajib)** - Pilih: PB, CB, CMB, atau Asimilasi
   - **Status Pekerjaan** - Pilih: Bekerja atau Tidak Bekerja
   - **Pekerjaan** - Isi jika status "Bekerja"
4. **Klik "Simpan"**

### Edit Klien

1. Klik icon **Edit (✏️)** pada klien yang ingin diedit
2. Update data yang diperlukan
3. Klik "Simpan"

### Filter Klien

- **Search**: Cari berdasarkan nama, NIK, atau alamat
- **Filter PK**: Filter klien berdasarkan PK tertentu

## 📊 Contoh Data Klien

```
Nama: Andi Wijaya
NIK: 3201010101900001
Telepon: 081234567890
WhatsApp: 081234567890
Alamat: Jl. Merdeka No. 10, Bandung
Program: PB (Pembimbingan)
Status Pekerjaan: Bekerja
Pekerjaan: Karyawan Toko
PK: Budi Santoso, S.Sos
```

```
Nama: Siti Nurhaliza
NIK: 3201010202910002
Telepon: 081234567891
WhatsApp: 081234567891
Alamat: Jl. Asia Afrika No. 5, Bandung
Program: CB (Cuti Bersyarat)
Status Pekerjaan: Tidak Bekerja
Pekerjaan: -
PK: Ahmad Fauzi, S.Psi
```

## 🔄 Update Database Schema

Database sudah di-update dengan field baru:

```sql
ALTER TABLE clients ADD COLUMN program TEXT CHECK(program IN ('PB', 'CB', 'CMB', 'Asimilasi'));
ALTER TABLE clients ADD COLUMN whatsapp TEXT;
ALTER TABLE clients ADD COLUMN is_working BOOLEAN DEFAULT 0;
ALTER TABLE clients ADD COLUMN job TEXT;
```

## 📝 Struktur Tabel Clients

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | INTEGER | Auto | Primary Key |
| name | TEXT | ✅ Yes | Nama lengkap klien |
| nik | TEXT | No | NIK 16 digit (unique) |
| phone | TEXT | No | Nomor telepon |
| whatsapp | TEXT | No | Nomor WhatsApp |
| address | TEXT | No | Alamat lengkap |
| pk_id | INTEGER | No | Foreign Key ke tabel PK |
| program | TEXT | ✅ Yes | PB, CB, CMB, atau Asimilasi |
| is_working | BOOLEAN | No | 0=Tidak Bekerja, 1=Bekerja |
| job | TEXT | No | Jenis pekerjaan (wajib jika is_working=1) |
| is_active | BOOLEAN | No | Status aktif (default 1) |
| created_at | DATETIME | Auto | Tanggal dibuat |

## 🎨 UI Form

Form tambah/edit klien sekarang include:

1. **Dropdown PK** - Pilih dari daftar PK aktif
2. **Input Nama** - Text input (required)
3. **Input NIK** - Text input, max 16 karakter
4. **Input Telepon** - Text input
5. **Input WhatsApp** - Text input
6. **Textarea Alamat** - Multi-line text
7. **Dropdown Program** - PB, CB, CMB, Asimilasi (required)
8. **Radio Status Pekerjaan** - Bekerja / Tidak Bekerja
9. **Input Pekerjaan** - Muncul jika status "Bekerja" (required)

## 📱 API Endpoints

### GET /api/clients
Get all active clients
```json
[
  {
    "id": 1,
    "name": "Andi Wijaya",
    "nik": "3201010101900001",
    "phone": "081234567890",
    "whatsapp": "081234567890",
    "address": "Jl. Merdeka No. 10, Bandung",
    "pk_id": 1,
    "pk_name": "Budi Santoso, S.Sos",
    "program": "PB",
    "is_working": 1,
    "job": "Karyawan Toko",
    "is_active": 1,
    "created_at": "2025-01-09 02:30:00"
  }
]
```

### POST /api/clients
Create new client
```json
{
  "name": "Andi Wijaya",
  "nik": "3201010101900001",
  "phone": "081234567890",
  "whatsapp": "081234567890",
  "address": "Jl. Merdeka No. 10, Bandung",
  "pk_id": 1,
  "program": "PB",
  "is_working": true,
  "job": "Karyawan Toko"
}
```

### PUT /api/clients/:id
Update client
```json
{
  "name": "Andi Wijaya",
  "nik": "3201010101900001",
  "phone": "081234567890",
  "whatsapp": "081234567890",
  "address": "Jl. Merdeka No. 10, Bandung",
  "pk_id": 1,
  "program": "CB",
  "is_working": false,
  "job": null
}
```

### DELETE /api/clients/:id
Soft delete client (set is_active = 0)

## 🔍 Validasi

### Frontend Validation:
- Nama: Required
- Program: Required
- Pekerjaan: Required jika is_working = true
- NIK: Max 16 karakter

### Backend Validation:
- Nama: Required
- Program: Required, must be one of: PB, CB, CMB, Asimilasi
- NIK: Unique (jika diisi)

## 💡 Tips Penggunaan

### 1. Program Klien
- **PB (Pembimbingan)**: Klien yang sedang dalam pembimbingan
- **CB (Cuti Bersyarat)**: Klien dengan status cuti bersyarat
- **CMB (Cuti Menjelang Bebas)**: Klien cuti menjelang bebas
- **Asimilasi**: Klien dalam program asimilasi

### 2. Status Pekerjaan
- Pilih "Bekerja" jika klien sudah bekerja
- Isi jenis pekerjaan (contoh: Karyawan Toko, Buruh, Wiraswasta)
- Pilih "Tidak Bekerja" jika klien belum bekerja

### 3. WhatsApp vs Telepon
- **Telepon**: Nomor telepon utama (bisa rumah/HP)
- **WhatsApp**: Nomor WhatsApp untuk komunikasi cepat
- Bisa sama atau berbeda

## 📊 Laporan & Export

Data klien lengkap bisa di-export ke CSV dengan semua field:
- Nama, NIK, Telepon, WhatsApp, Alamat
- Program, Status Pekerjaan, Pekerjaan
- PK yang bertanggung jawab

## 🚀 Status

- ✅ Database schema updated
- ✅ Backend API updated
- ✅ Frontend form updated
- ✅ Validation implemented
- ✅ Backend & Frontend restarted
- ✅ Ready to use!

## 📝 Next Steps

1. Buka Management Klien: `http://localhost:5174/clients`
2. Tambah klien baru dengan data lengkap
3. Test semua field berfungsi dengan baik
4. Export data untuk verifikasi

---

**Data klien sekarang lebih lengkap dan terstruktur!** ✅📊

**Field baru: Program, WhatsApp, Status Pekerjaan, Pekerjaan** 🎯
