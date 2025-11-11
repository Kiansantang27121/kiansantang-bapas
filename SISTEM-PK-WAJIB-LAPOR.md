# 🎯 Sistem Backend PK untuk Klien Wajib Lapor

## 📋 Overview

Sistem backend untuk Pembimbing Kemasyarakatan (PK) sebagai petugas penerima klien wajib lapor. Setiap PK memiliki akun sendiri untuk menerima, memanggil, dan melayani klien yang ditugaskan kepada mereka.

## 🔄 Flow Lengkap Sistem

### 1. **Klien Mendaftar Bimbingan Wajib Lapor**
- Klien datang ke kantor
- Mendaftar melalui aplikasi pendaftaran (port 5173)
- Memilih layanan "Bimbingan Wajib Lapor"
- Mendapat nomor antrian

### 2. **Operator Memanggil & Assign ke PK**
- Operator melihat antrian di Operator App (port 5174)
- Operator memanggil klien
- Operator memilih PK yang akan menangani
- Sistem assign antrian ke PK tersebut

### 3. **PK Menerima Notifikasi**
- PK login ke PK App dengan akun masing-masing
- PK melihat antrian yang di-assign ke mereka
- PK menerima (accept) antrian

### 4. **Panggilan Otomatis**
- Setelah PK accept, sistem otomatis memanggil klien
- Panggilan suara otomatis: "Nomor antrian [XXX], silakan menuju ruang [Nama PK]"
- Klien menuju ruang PK

### 5. **PK Melayani Klien**
- PK mulai melayani (start serving)
- PK melakukan bimbingan wajib lapor
- PK menyelesaikan layanan (complete)

### 6. **Klien Memberikan Penilaian**
- Setelah selesai, klien diminta memberikan rating (1-5 bintang)
- Klien bisa memberikan komentar/feedback
- Penilaian tersimpan untuk evaluasi

## 👥 Akun PK yang Sudah Dibuat

### Total: 63 Akun PK

Semua PK aktif sudah dibuatkan akun dengan:
- **Username**: Nama PK (lowercase, tanpa spasi, tanpa karakter khusus)
- **Password Default**: `pk123456`
- **Role**: operator (dengan pk_id yang link ke data PK)

### Contoh Akun:

| Nama PK | Username | Password | PK ID |
|---------|----------|----------|-------|
| Budiana | budiana | pk123456 | 1 |
| Ryan Rizkia | ryanrizkia | pk123456 | 2 |
| Muhamad Anggiansah | muhamadanggiansah | pk123456 | 3 |
| Rakha Hafiyan | rakhahafiyan | pk123456 | 4 |
| ... | ... | pk123456 | ... |

**Total**: 63 akun PK sudah dibuat dan siap digunakan!

## 🔐 Cara Login PK

### URL Login
```
http://localhost:5174/login
```

### Credentials
- **Username**: [nama PK lowercase tanpa spasi]
- **Password**: `pk123456`

### Contoh:
```
Username: budiana
Password: pk123456
```

## 🛠️ API Endpoints untuk PK

### Base URL
```
http://localhost:3000/api
```

### Authentication
Semua endpoint PK memerlukan JWT token dengan `pk_id` di dalamnya.

### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "budiana",
  "password": "pk123456"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 10,
    "username": "budiana",
    "name": "Budiana",
    "role": "operator",
    "pk_id": 1
  }
}
```

### 2. Get My Queues (Antrian Saya)
```http
GET /api/pk-queue/my-queues
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "queue_number": "B202501090001",
    "service_name": "Bimbingan Wajib Lapor",
    "client_name": "Andi Wijaya",
    "client_phone": "081234567890",
    "status": "waiting",
    "created_at": "2025-01-09 10:00:00",
    "pk_name": "Budiana"
  }
]
```

### 3. Accept Queue (Terima Antrian)
```http
POST /api/pk-queue/{queueId}/accept
Authorization: Bearer {token}

Response:
{
  "message": "Queue accepted and client called",
  "queue": {
    "id": 1,
    "queue_number": "B202501090001",
    "status": "called",
    "accepted_at": "2025-01-09 10:05:00",
    "called_at": "2025-01-09 10:05:00"
  }
}
```

### 4. Start Serving (Mulai Melayani)
```http
POST /api/pk-queue/{queueId}/start-serving
Authorization: Bearer {token}

Response:
{
  "message": "Started serving client",
  "queue": {
    "id": 1,
    "status": "serving",
    "serving_at": "2025-01-09 10:10:00"
  }
}
```

### 5. Complete Service (Selesai Melayani)
```http
POST /api/pk-queue/{queueId}/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Bimbingan berjalan lancar, klien kooperatif"
}

Response:
{
  "message": "Service completed",
  "queue": {
    "id": 1,
    "status": "completed",
    "completed_at": "2025-01-09 10:30:00"
  }
}
```

### 6. Get Statistics (Statistik PK)
```http
GET /api/pk-queue/statistics
Authorization: Bearer {token}

Response:
{
  "today": {
    "waiting": 2,
    "serving": 1,
    "completed": 5,
    "total": 8
  },
  "avgRating": 4.5,
  "totalServed": 150
}
```

### 7. Get Profile (Profil PK)
```http
GET /api/pk-queue/profile
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "name": "Budiana",
  "nip": "198501012010011001",
  "phone": "081234567890",
  "jabatan": "Pembimbing Kemasyarakatan Ahli Muda"
}
```

### 8. Get History (Riwayat Layanan)
```http
GET /api/pk-queue/history?limit=50&offset=0
Authorization: Bearer {token}

Response:
{
  "history": [
    {
      "id": 1,
      "queue_number": "B202501090001",
      "client_name": "Andi Wijaya",
      "service_name": "Bimbingan Wajib Lapor",
      "rating": 5,
      "rating_comment": "Pelayanan sangat baik",
      "completed_at": "2025-01-09 10:30:00"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

## ⭐ API Rating/Penilaian Layanan

### 1. Submit Rating (Klien Memberikan Penilaian)
```http
POST /api/rating/submit
Content-Type: application/json

{
  "queue_number": "B202501090001",
  "rating": 5,
  "comment": "Pelayanan sangat baik dan ramah"
}

Response:
{
  "message": "Thank you for your rating!",
  "rating": {
    "queue_number": "B202501090001",
    "rating": 5,
    "comment": "Pelayanan sangat baik dan ramah"
  }
}
```

### 2. Check Rating Status
```http
GET /api/rating/check/B202501090001

Response:
{
  "canRate": true,
  "queue": {
    "queue_number": "B202501090001",
    "status": "completed",
    "hasRating": false,
    "service_name": "Bimbingan Wajib Lapor",
    "pk_name": "Budiana",
    "completed_at": "2025-01-09 10:30:00"
  }
}
```

### 3. Get Rating Statistics
```http
GET /api/rating/statistics?pk_id=1&date_from=2025-01-01&date_to=2025-01-31

Response:
{
  "statistics": {
    "total_ratings": 50,
    "average_rating": 4.5,
    "rating_5": 30,
    "rating_4": 15,
    "rating_3": 3,
    "rating_2": 1,
    "rating_1": 1
  },
  "recentComments": [
    {
      "rating": 5,
      "rating_comment": "Sangat membantu",
      "completed_at": "2025-01-09 10:30:00",
      "service_name": "Bimbingan Wajib Lapor",
      "pk_name": "Budiana"
    }
  ]
}
```

### 4. Get Ratings by PK
```http
GET /api/rating/by-pk?date_from=2025-01-01&date_to=2025-01-31

Response:
[
  {
    "id": 1,
    "pk_name": "Budiana",
    "total_services": 50,
    "total_ratings": 45,
    "average_rating": 4.5,
    "rating_5": 30,
    "rating_4": 12,
    "rating_3": 2,
    "rating_2": 1,
    "rating_1": 0
  }
]
```

## 📊 Database Schema Updates

### Tabel `users` - Kolom Baru:
- `pk_id` (INTEGER) - Link ke tabel pk

### Tabel `queue` - Kolom Baru:
- `assigned_to_pk_id` (INTEGER) - PK yang ditugaskan
- `accepted_at` (DATETIME) - Waktu PK menerima
- `called_at` (DATETIME) - Waktu panggilan otomatis
- `completed_at` (DATETIME) - Waktu selesai layanan
- `rating` (INTEGER) - Penilaian 1-5
- `rating_comment` (TEXT) - Komentar penilaian

### Tabel `settings` - Setting Baru:
- `pk_auto_call_enabled` - Enable panggilan otomatis
- `pk_call_voice` - Jenis suara (male/female)
- `rating_enabled` - Enable sistem rating
- `rating_required` - Rating wajib atau tidak

## 🔄 Status Flow Antrian

```
1. waiting → Klien mendaftar
2. waiting → Operator assign ke PK
3. called → PK accept & panggilan otomatis
4. serving → PK mulai melayani
5. completed → PK selesai melayani
6. [rating] → Klien memberikan penilaian
```

## 🎨 Fitur Panggilan Otomatis

### Cara Kerja:
1. PK klik "Terima" pada antrian
2. Status berubah ke "called"
3. Sistem trigger panggilan suara otomatis
4. Text-to-Speech: "Nomor antrian [XXX], silakan menuju ruang [Nama PK]"
5. Suara diputar di speaker display

### Pengaturan:
- **Enable/Disable**: Setting `pk_auto_call_enabled`
- **Jenis Suara**: Setting `pk_call_voice` (male/female)

## 📱 Aplikasi yang Terlibat

### 1. Registration App (Port 5173)
- Klien mendaftar antrian
- Pilih layanan
- Dapatkan nomor antrian

### 2. Operator App (Port 5174)
- Operator kelola antrian
- Assign antrian ke PK
- Monitor status

### 3. PK App (Port 5176) - **AKAN DIBUAT**
- PK login dengan akun sendiri
- Lihat antrian yang di-assign
- Terima & panggil klien
- Mulai & selesaikan layanan
- Lihat statistik & riwayat

### 4. Display App (Port 5175)
- Tampilkan nomor antrian
- Putar panggilan suara otomatis
- Running text

## 🔧 Cara Menggunakan

### Untuk Operator:

1. **Login ke Operator App**
   ```
   http://localhost:5174
   Username: admin
   Password: admin123
   ```

2. **Lihat Antrian Baru**
   - Buka menu "Antrian"
   - Lihat daftar antrian waiting

3. **Assign ke PK**
   - Klik antrian
   - Pilih "Assign ke PK"
   - Pilih PK dari dropdown
   - Klik "Assign"

### Untuk PK:

1. **Login ke PK App**
   ```
   http://localhost:5176 (akan dibuat)
   Username: [username PK]
   Password: pk123456
   ```

2. **Lihat Antrian Saya**
   - Dashboard menampilkan antrian yang di-assign
   - Status: waiting, called, serving

3. **Terima Antrian**
   - Klik "Terima" pada antrian
   - Sistem otomatis panggil klien
   - Status berubah ke "called"

4. **Mulai Melayani**
   - Klien datang ke ruang PK
   - Klik "Mulai Melayani"
   - Status berubah ke "serving"

5. **Selesaikan Layanan**
   - Setelah bimbingan selesai
   - Klik "Selesai"
   - Tambahkan catatan (optional)
   - Status berubah ke "completed"

### Untuk Klien:

1. **Setelah Layanan Selesai**
   - Scan QR Code atau buka link rating
   - Masukkan nomor antrian
   - Berikan rating 1-5 bintang
   - Tambahkan komentar (optional)
   - Submit

## 📈 Monitoring & Evaluasi

### Dashboard PK:
- Total layanan hari ini
- Antrian waiting/serving
- Rating rata-rata
- Total layanan completed

### Dashboard Admin:
- Statistik per PK
- Rating tertinggi/terendah
- Komentar terbaru
- Grafik performa

## 🚀 Next Steps

### 1. Buat PK App Frontend
- Login page untuk PK
- Dashboard antrian
- Accept/Start/Complete buttons
- Statistik & riwayat

### 2. Implementasi Panggilan Suara
- Text-to-Speech API
- Audio player di Display App
- Queue audio calls

### 3. Rating Page
- Public page untuk rating
- QR Code generator
- Thank you page

### 4. Testing
- Test flow lengkap
- Test semua akun PK
- Test rating system

## 📝 Catatan Penting

### Keamanan:
- ✅ JWT authentication untuk PK
- ✅ Middleware requirePK untuk validasi
- ✅ PK hanya bisa akses antrian mereka sendiri
- ✅ Rating public tapi one-time only

### Password Default:
- **PENTING**: Semua PK menggunakan password default `pk123456`
- **Rekomendasi**: PK harus ganti password setelah login pertama
- Implementasi fitur "Change Password" di PK App

### Database:
- ✅ 63 akun PK sudah dibuat
- ✅ Kolom baru sudah ditambahkan
- ✅ Foreign key relationships sudah di-set
- ✅ Settings untuk fitur PK sudah ada

## 🎯 Keuntungan Sistem Ini

1. **Efisiensi**: PK langsung tahu antrian mereka
2. **Transparansi**: Flow jelas dari pendaftaran sampai selesai
3. **Akuntabilitas**: Setiap layanan tercatat dengan PK yang menangani
4. **Evaluasi**: Rating membantu evaluasi kinerja PK
5. **Otomatis**: Panggilan otomatis mengurangi manual work

---

**Backend untuk sistem PK sudah siap!** ✅

**63 akun PK sudah dibuat dan siap digunakan!** 👥

**API endpoints lengkap sudah tersedia!** 🚀

**Next: Buat PK App Frontend untuk UI yang user-friendly!** 💻
