# 👥 Aplikasi Petugas Multi-Role

## 📋 Overview

Aplikasi khusus untuk petugas BAPAS Bandung dengan sistem multi-role yang memungkinkan setiap petugas memiliki akses dan fungsi sesuai dengan tugasnya masing-masing.

## 🎯 5 Role Petugas

### 1. **Petugas Layanan**
- **Username**: `petugas_layanan`
- **Password**: `petugas123`
- **Fungsi**: Mengelola layanan umum dan antrian

### 2. **Petugas PK (Pembimbing Kemasyarakatan)**
- **Username**: `petugas_pk`
- **Password**: `petugas123`
- **Fungsi**: Menangani bimbingan klien wajib lapor

### 3. **Petugas Penghadapan**
- **Username**: `petugas_penghadapan`
- **Password**: `petugas123`
- **Fungsi**: Mengelola jadwal penghadapan ke pengadilan

### 4. **Petugas Kunjungan**
- **Username**: `petugas_kunjungan`
- **Password**: `petugas123`
- **Fungsi**: Mengelola kunjungan keluarga/pihak terkait

### 5. **Petugas Pengaduan**
- **Username**: `petugas_pengaduan`
- **Password**: `petugas123`
- **Fungsi**: Menangani pengaduan masyarakat

## 📊 Database Schema

### Tabel Penghadapan
```sql
CREATE TABLE penghadapan (
  id INTEGER PRIMARY KEY,
  queue_number TEXT,
  client_id INTEGER,
  client_name TEXT NOT NULL,
  client_nik TEXT,
  client_phone TEXT,
  court_name TEXT,
  hearing_date DATE,
  hearing_time TIME,
  case_number TEXT,
  status TEXT,
  assigned_to_petugas_id INTEGER,
  accepted_at DATETIME,
  completed_at DATETIME,
  notes TEXT,
  created_at DATETIME
)
```

### Tabel Kunjungan
```sql
CREATE TABLE kunjungan (
  id INTEGER PRIMARY KEY,
  queue_number TEXT,
  visitor_name TEXT NOT NULL,
  visitor_nik TEXT,
  visitor_phone TEXT,
  visitor_relation TEXT,
  client_id INTEGER,
  client_name TEXT NOT NULL,
  visit_purpose TEXT,
  status TEXT,
  assigned_to_petugas_id INTEGER,
  accepted_at DATETIME,
  completed_at DATETIME,
  notes TEXT,
  created_at DATETIME
)
```

### Tabel Pengaduan
```sql
CREATE TABLE pengaduan (
  id INTEGER PRIMARY KEY,
  queue_number TEXT,
  complainant_name TEXT NOT NULL,
  complainant_nik TEXT,
  complainant_phone TEXT,
  complainant_email TEXT,
  complaint_type TEXT,
  complaint_subject TEXT NOT NULL,
  complaint_description TEXT NOT NULL,
  priority TEXT,
  status TEXT,
  assigned_to_petugas_id INTEGER,
  accepted_at DATETIME,
  completed_at DATETIME,
  resolution TEXT,
  notes TEXT,
  created_at DATETIME
)
```

## 🔐 Login & Authentication

### Login URL
```
http://localhost:5176 (Petugas App - akan dibuat)
atau
http://localhost:5174 (Operator App - sementara)
```

### Credentials
Semua petugas menggunakan password yang sama: **petugas123**

| Role | Username | Password |
|------|----------|----------|
| Petugas Layanan | petugas_layanan | petugas123 |
| Petugas PK | petugas_pk | petugas123 |
| Petugas Penghadapan | petugas_penghadapan | petugas123 |
| Petugas Kunjungan | petugas_kunjungan | petugas123 |
| Petugas Pengaduan | petugas_pengaduan | petugas123 |

## 🛠️ API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. Penghadapan API

#### Get All Penghadapan
```http
GET /api/penghadapan?status=waiting&date=2025-01-09
Authorization: Bearer {token}
```

#### Create Penghadapan
```http
POST /api/penghadapan
Authorization: Bearer {token}
Content-Type: application/json

{
  "client_name": "Andi Wijaya",
  "client_nik": "3201010101900001",
  "client_phone": "081234567890",
  "court_name": "Pengadilan Negeri Bandung",
  "hearing_date": "2025-01-15",
  "hearing_time": "10:00",
  "case_number": "123/Pid.B/2025/PN.Bdg"
}
```

#### Assign to Petugas
```http
POST /api/penghadapan/:id/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "petugas_id": 10
}
```

#### Accept Penghadapan
```http
POST /api/penghadapan/:id/accept
Authorization: Bearer {token}
```

#### Complete Penghadapan
```http
POST /api/penghadapan/:id/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Penghadapan selesai, klien hadir tepat waktu"
}
```

#### Get My Tasks
```http
GET /api/penghadapan/my-tasks
Authorization: Bearer {token}
```

### 2. Kunjungan API

#### Get All Kunjungan
```http
GET /api/kunjungan?status=waiting&date=2025-01-09
Authorization: Bearer {token}
```

#### Create Kunjungan
```http
POST /api/kunjungan
Authorization: Bearer {token}
Content-Type: application/json

{
  "visitor_name": "Siti Nurhaliza",
  "visitor_nik": "3201020202900002",
  "visitor_phone": "081234567891",
  "visitor_relation": "Istri",
  "client_name": "Budi Santoso",
  "visit_purpose": "Kunjungan keluarga"
}
```

#### Accept Kunjungan
```http
POST /api/kunjungan/:id/accept
Authorization: Bearer {token}
```

#### Start Serving
```http
POST /api/kunjungan/:id/serve
Authorization: Bearer {token}
```

#### Complete Kunjungan
```http
POST /api/kunjungan/:id/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Kunjungan berjalan lancar, durasi 30 menit"
}
```

#### Reject Kunjungan
```http
POST /api/kunjungan/:id/reject
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Tidak membawa identitas yang valid"
}
```

#### Get My Tasks
```http
GET /api/kunjungan/my-tasks
Authorization: Bearer {token}
```

### 3. Pengaduan API

#### Submit Pengaduan (Public - No Auth)
```http
POST /api/pengaduan/submit
Content-Type: application/json

{
  "complainant_name": "Ahmad Fauzi",
  "complainant_phone": "081234567892",
  "complainant_email": "ahmad@email.com",
  "complaint_type": "pelayanan",
  "complaint_subject": "Pelayanan lambat",
  "complaint_description": "Sudah menunggu 2 jam belum dipanggil",
  "priority": "normal"
}
```

#### Get All Pengaduan
```http
GET /api/pengaduan?status=waiting&priority=high
Authorization: Bearer {token}
```

#### Create Pengaduan (Authenticated)
```http
POST /api/pengaduan
Authorization: Bearer {token}
Content-Type: application/json

{
  "complainant_name": "Ahmad Fauzi",
  "complaint_subject": "Pelayanan lambat",
  "complaint_description": "Detail pengaduan...",
  "priority": "high"
}
```

#### Accept Pengaduan
```http
POST /api/pengaduan/:id/accept
Authorization: Bearer {token}
```

#### Complete Pengaduan
```http
POST /api/pengaduan/:id/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "resolution": "Pengaduan telah ditindaklanjuti, pelayanan dipercepat",
  "notes": "Klien puas dengan penyelesaian"
}
```

#### Escalate Pengaduan
```http
POST /api/pengaduan/:id/escalate
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Pengaduan memerlukan perhatian manajemen"
}
```

#### Check Status (Public)
```http
GET /api/pengaduan/check/PG202501090001
```

#### Get My Tasks
```http
GET /api/pengaduan/my-tasks
Authorization: Bearer {token}
```

## 🔄 Flow Sistem

### Flow Penghadapan
```
1. Klien/Operator → Buat jadwal penghadapan
2. Sistem → Generate nomor: PH202501090001
3. Operator → Assign ke Petugas Penghadapan
4. Petugas → Accept & proses
5. Petugas → Complete dengan catatan
```

### Flow Kunjungan
```
1. Pengunjung → Daftar kunjungan
2. Sistem → Generate nomor: KJ202501090001
3. Operator → Assign ke Petugas Kunjungan
4. Petugas → Verifikasi identitas
5. Petugas → Accept/Reject
6. Jika Accept → Serve → Complete
```

### Flow Pengaduan
```
1. Masyarakat → Submit pengaduan (public)
2. Sistem → Generate nomor: PG202501090001
3. Operator → Assign ke Petugas Pengaduan
4. Petugas → Accept & investigasi
5. Petugas → Complete dengan resolusi
6. Atau Escalate jika perlu
```

## 📱 Fitur Per Role

### Petugas Layanan
- ✅ Kelola antrian umum
- ✅ Panggil klien
- ✅ Assign ke petugas lain
- ✅ Monitor semua layanan

### Petugas PK
- ✅ Lihat antrian bimbingan
- ✅ Terima klien yang di-assign
- ✅ Panggil klien
- ✅ Catat hasil bimbingan
- ✅ Lihat riwayat & statistik

### Petugas Penghadapan
- ✅ Kelola jadwal penghadapan
- ✅ Input data sidang
- ✅ Reminder otomatis
- ✅ Laporan penghadapan

### Petugas Kunjungan
- ✅ Verifikasi pengunjung
- ✅ Approve/reject kunjungan
- ✅ Monitor durasi kunjungan
- ✅ Catat hasil kunjungan

### Petugas Pengaduan
- ✅ Terima pengaduan
- ✅ Investigasi & tindak lanjut
- ✅ Resolusi pengaduan
- ✅ Escalate jika perlu
- ✅ Laporan pengaduan

## 🎨 Status Flow

### Penghadapan Status
- `waiting` → Menunggu diproses
- `called` → Sudah dipanggil
- `serving` → Sedang diproses
- `completed` → Selesai
- `cancelled` → Dibatalkan

### Kunjungan Status
- `waiting` → Menunggu verifikasi
- `called` → Dipanggil untuk verifikasi
- `serving` → Sedang berkunjung
- `completed` → Kunjungan selesai
- `rejected` → Ditolak
- `cancelled` → Dibatalkan

### Pengaduan Status
- `waiting` → Menunggu ditangani
- `serving` → Sedang diproses
- `completed` → Selesai dengan resolusi
- `escalated` → Dieskalasi ke atasan
- `cancelled` → Dibatalkan

### Pengaduan Priority
- `low` → Prioritas rendah
- `normal` → Prioritas normal
- `high` → Prioritas tinggi
- `urgent` → Mendesak

## 🚀 Next Steps

### 1. Buat Petugas App Frontend
- Login page dengan role detection
- Dashboard per role
- Task management
- Real-time notifications

### 2. Implementasi Fitur
- Auto-assign berdasarkan workload
- Reminder otomatis
- Reporting & analytics
- Export data

### 3. Integration
- Email notifications
- SMS alerts
- WhatsApp integration
- Calendar sync

## 📊 Statistics & Reporting

### Per Petugas
- Total tasks hari ini
- Tasks completed
- Average completion time
- Performance rating

### Per Service
- Total penghadapan/kunjungan/pengaduan
- Success rate
- Average processing time
- Trend analysis

## 🔐 Security & Permissions

### Role-Based Access Control
- Setiap role hanya akses fitur mereka
- Data isolation per role
- Audit trail semua aktivitas
- Session management

### Password Policy
- Default: petugas123
- Harus diganti setelah login pertama
- Minimal 8 karakter
- Kombinasi huruf & angka

## 💡 Tips Penggunaan

### Untuk Petugas Penghadapan
1. Input jadwal sidang segera setelah dapat surat
2. Set reminder H-1 dan H-day
3. Konfirmasi kehadiran klien
4. Catat hasil sidang dengan lengkap

### Untuk Petugas Kunjungan
1. Verifikasi identitas pengunjung dengan teliti
2. Cek hubungan dengan klien
3. Monitor durasi kunjungan
4. Catat hal penting selama kunjungan

### Untuk Petugas Pengaduan
1. Respond pengaduan dalam 24 jam
2. Investigasi dengan objektif
3. Dokumentasi lengkap
4. Follow-up sampai selesai
5. Escalate jika di luar kewenangan

## 📞 Support

### Jika Ada Masalah
1. Cek dokumentasi ini
2. Hubungi admin sistem
3. Laporkan bug/error
4. Request fitur baru

---

**Backend untuk 5 role petugas sudah siap!** ✅

**5 akun petugas sudah dibuat!** 👥

**3 tabel baru sudah ditambahkan!** 📊

**API endpoints lengkap tersedia!** 🚀

**Password semua petugas: petugas123** 🔐

**Next: Buat Petugas App Frontend!** 💻
