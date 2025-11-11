# 📋 Panduan Fitur Penghadapan

## 📖 Apa itu Penghadapan?

Penghadapan adalah layanan untuk mengelola jadwal dan data klien yang harus hadir di pengadilan untuk sidang atau proses hukum lainnya.

## 👤 Petugas yang Menangani

**Petugas Penghadapan**
- Username: `petugas_penghadapan`
- Password: `petugas123`

## 🎯 Fungsi Utama

### 1. Input Jadwal Sidang
- Catat data klien
- Input data pengadilan
- Jadwal sidang (tanggal & waktu)
- Nomor perkara

### 2. Kelola Data Penghadapan
- Lihat semua jadwal
- Filter berdasarkan status/tanggal
- Update informasi
- Assign ke petugas

### 3. Monitoring
- Track status penghadapan
- Reminder otomatis
- Laporan kehadiran
- Statistik penghadapan

## 📊 Status Penghadapan

| Status | Keterangan |
|--------|------------|
| `waiting` | Menunggu diproses |
| `called` | Sudah dipanggil/diinformasikan |
| `serving` | Sedang diproses |
| `completed` | Selesai (klien sudah hadir) |
| `cancelled` | Dibatalkan |

## 🔢 Format Nomor Antrian

```
PH202501090001
```

- **PH** = Penghadapan
- **20250109** = Tanggal (9 Jan 2025)
- **0001** = Nomor urut

## 🛠️ API Endpoints

### Base URL
```
http://localhost:3000/api/penghadapan
```

### 1. Lihat Semua Penghadapan
```http
GET /api/penghadapan?status=waiting&date=2025-01-09
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "queue_number": "PH202501090001",
    "client_name": "Andi Wijaya",
    "client_nik": "3201010101900001",
    "client_phone": "081234567890",
    "court_name": "Pengadilan Negeri Bandung",
    "hearing_date": "2025-01-15",
    "hearing_time": "10:00",
    "case_number": "123/Pid.B/2025/PN.Bdg",
    "status": "waiting",
    "created_at": "2025-01-09 08:00:00"
  }
]
```

### 2. Buat Penghadapan Baru
```http
POST /api/penghadapan
Authorization: Bearer {token}
Content-Type: application/json

{
  "client_name": "Andi Wijaya",
  "client_nik": "3201010101900001",
  "client_phone": "081234567890",
  "client_id": 5,
  "court_name": "Pengadilan Negeri Bandung",
  "hearing_date": "2025-01-15",
  "hearing_time": "10:00",
  "case_number": "123/Pid.B/2025/PN.Bdg"
}
```

**Response:**
```json
{
  "id": 1,
  "queue_number": "PH202501090001",
  "client_name": "Andi Wijaya",
  "court_name": "Pengadilan Negeri Bandung",
  "hearing_date": "2025-01-15",
  "hearing_time": "10:00",
  "status": "waiting",
  "created_at": "2025-01-09 08:00:00"
}
```

### 3. Assign ke Petugas
```http
POST /api/penghadapan/1/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "petugas_id": 10
}
```

### 4. Terima Penghadapan (Petugas)
```http
POST /api/penghadapan/1/accept
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "queue_number": "PH202501090001",
  "status": "called",
  "accepted_at": "2025-01-09 08:30:00"
}
```

### 5. Selesaikan Penghadapan
```http
POST /api/penghadapan/1/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Klien hadir tepat waktu, sidang berjalan lancar"
}
```

**Response:**
```json
{
  "id": 1,
  "queue_number": "PH202501090001",
  "status": "completed",
  "completed_at": "2025-01-15 11:00:00",
  "notes": "Klien hadir tepat waktu, sidang berjalan lancar"
}
```

### 6. Lihat Tugas Saya
```http
GET /api/penghadapan/my-tasks
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "queue_number": "PH202501090001",
    "client_name": "Andi Wijaya",
    "court_name": "Pengadilan Negeri Bandung",
    "hearing_date": "2025-01-15",
    "status": "waiting"
  }
]
```

## 🔄 Flow Penghadapan

### Skenario Lengkap:

```
1. Operator/Admin Input Jadwal Sidang
   ↓
2. Sistem Generate Nomor: PH202501090001
   ↓
3. Operator Assign ke Petugas Penghadapan
   ↓
4. Petugas Accept & Hubungi Klien
   ↓
5. Petugas Ingatkan Klien (H-1, H-day)
   ↓
6. Klien Hadir di Pengadilan
   ↓
7. Petugas Complete dengan Catatan
   ↓
8. Selesai
```

## 📝 Cara Menggunakan

### Untuk Operator/Admin:

#### 1. Login
```
Username: admin
Password: admin123
```

#### 2. Input Jadwal Sidang
- Buka menu "Penghadapan"
- Klik "Tambah Penghadapan"
- Isi form:
  - Nama Klien
  - NIK (opsional)
  - No HP
  - Nama Pengadilan
  - Tanggal Sidang
  - Waktu Sidang
  - Nomor Perkara
- Klik "Simpan"

#### 3. Assign ke Petugas
- Pilih penghadapan dari list
- Klik "Assign"
- Pilih petugas penghadapan
- Klik "Assign"

### Untuk Petugas Penghadapan:

#### 1. Login
```
Username: petugas_penghadapan
Password: petugas123
```

#### 2. Lihat Tugas
- Dashboard menampilkan penghadapan yang di-assign
- Filter berdasarkan tanggal/status

#### 3. Accept Tugas
- Klik "Terima" pada penghadapan
- Status berubah ke "called"

#### 4. Hubungi Klien
- Telepon/SMS/WhatsApp klien
- Informasikan jadwal sidang
- Berikan instruksi

#### 5. Reminder
- H-1: Ingatkan klien
- H-day: Konfirmasi kehadiran

#### 6. Complete
- Setelah sidang selesai
- Klik "Selesai"
- Tambahkan catatan:
  - Klien hadir/tidak
  - Hasil sidang
  - Tindak lanjut
- Simpan

## 🧪 Test dengan cURL

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "petugas_penghadapan",
    "password": "petugas123"
  }'
```

**Simpan token dari response!**

### 2. Buat Penghadapan
```bash
curl -X POST http://localhost:3000/api/penghadapan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "client_name": "Andi Wijaya",
    "client_phone": "081234567890",
    "court_name": "Pengadilan Negeri Bandung",
    "hearing_date": "2025-01-15",
    "hearing_time": "10:00",
    "case_number": "123/Pid.B/2025/PN.Bdg"
  }'
```

### 3. Lihat Tugas Saya
```bash
curl -X GET http://localhost:3000/api/penghadapan/my-tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Accept Penghadapan
```bash
curl -X POST http://localhost:3000/api/penghadapan/1/accept \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Complete Penghadapan
```bash
curl -X POST http://localhost:3000/api/penghadapan/1/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "notes": "Klien hadir tepat waktu, sidang berjalan lancar"
  }'
```

## 📋 Data yang Diperlukan

### Minimal (Wajib):
- ✅ Nama Klien
- ✅ Nama Pengadilan
- ✅ Tanggal Sidang

### Opsional (Direkomendasikan):
- NIK Klien
- No HP Klien
- Waktu Sidang
- Nomor Perkara
- Link ke data klien (client_id)

## 💡 Tips untuk Petugas

### 1. Input Data Segera
- Input jadwal sidang segera setelah menerima surat
- Jangan menunda agar tidak lupa

### 2. Hubungi Klien Cepat
- Segera hubungi klien setelah accept
- Pastikan klien tahu jadwal

### 3. Set Reminder
- H-7: Reminder pertama
- H-3: Reminder kedua
- H-1: Reminder terakhir
- H-day: Konfirmasi pagi hari

### 4. Dokumentasi Lengkap
- Catat semua komunikasi dengan klien
- Simpan bukti konfirmasi
- Tulis hasil sidang dengan detail

### 5. Follow-up
- Jika klien tidak hadir, segera lapor
- Catat alasan ketidakhadiran
- Koordinasi untuk jadwal berikutnya

## 📊 Laporan

### Laporan Harian
- Total penghadapan hari ini
- Klien yang hadir
- Klien yang tidak hadir
- Penghadapan dibatalkan

### Laporan Bulanan
- Total penghadapan per bulan
- Tingkat kehadiran
- Pengadilan yang paling sering
- Trend penghadapan

## 🚨 Troubleshooting

### Klien Tidak Bisa Dihubungi
1. Coba beberapa kali
2. Hubungi PK yang menangani
3. Kunjungi alamat klien
4. Dokumentasikan upaya kontak

### Jadwal Berubah
1. Update data penghadapan
2. Hubungi klien segera
3. Konfirmasi jadwal baru
4. Catat perubahan

### Klien Tidak Hadir
1. Konfirmasi dengan pengadilan
2. Catat alasan (jika tahu)
3. Lapor ke atasan
4. Koordinasi tindak lanjut

## 🔐 Keamanan Data

### Data Sensitif
- Nomor perkara
- Data pribadi klien
- Hasil sidang

### Akses Terbatas
- Hanya petugas penghadapan yang bisa akses
- Log semua aktivitas
- Enkripsi data sensitif

## 📞 Kontak Pengadilan

### Pengadilan Negeri Bandung
- Telepon: (022) 4204501
- Alamat: Jl. LL. RE Martadinata No.42, Bandung

### Pengadilan Tinggi Jawa Barat
- Telepon: (022) 4204502
- Alamat: Jl. LL. RE Martadinata No.46, Bandung

## 📚 Referensi

- Undang-Undang Pemasyarakatan
- Peraturan tentang Penghadapan
- SOP BAPAS Bandung
- Panduan Teknis Penghadapan

---

**Fitur Penghadapan sudah siap digunakan!** ✅

**Login: petugas_penghadapan / petugas123** 🔐

**API Endpoints tersedia!** 🚀

**Dokumentasi lengkap!** 📚

**Silakan test fitur penghadapan!** 🧪
