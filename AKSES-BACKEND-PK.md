# 🔐 Cara Akses Backend PK

## 🚀 Quick Access

### URL Login:
```
http://localhost:5174/login
```

### Akun PK yang Bisa Digunakan:

| Nama PK | Username | Password |
|---------|----------|----------|
| Budiana | budiana | pk123456 |
| Ryan Rizkia | ryanrizkia | pk123456 |
| Muhamad Anggiansah | muhamadanggiansah | pk123456 |
| Rakha Hafiyan | rakhahafiyan | pk123456 |
| Kania Rafinda | kaniarafinda | pk123456 |

**Total: 63 akun PK tersedia!**

## 📝 Cara Login:

### Step 1: Buka Browser
Buka URL: `http://localhost:5174/login`

### Step 2: Login dengan Akun PK
```
Username: budiana
Password: pk123456
```

### Step 3: Akses Backend PK
Setelah login, Anda akan masuk ke Operator App dengan akses PK.

## 🔧 API Backend PK

### Base URL:
```
http://localhost:3000/api
```

### Endpoints yang Tersedia:

#### 1. Login PK
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "budiana",
  "password": "pk123456"
}
```

**Response:**
```json
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

#### 2. Lihat Antrian Saya
```bash
GET http://localhost:3000/api/pk-queue/my-queues
Authorization: Bearer {token}
```

#### 3. Terima Antrian
```bash
POST http://localhost:3000/api/pk-queue/1/accept
Authorization: Bearer {token}
```

#### 4. Mulai Melayani
```bash
POST http://localhost:3000/api/pk-queue/1/start-serving
Authorization: Bearer {token}
```

#### 5. Selesai Melayani
```bash
POST http://localhost:3000/api/pk-queue/1/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Bimbingan berjalan lancar"
}
```

#### 6. Statistik PK
```bash
GET http://localhost:3000/api/pk-queue/statistics
Authorization: Bearer {token}
```

#### 7. Profil PK
```bash
GET http://localhost:3000/api/pk-queue/profile
Authorization: Bearer {token}
```

#### 8. Riwayat Layanan
```bash
GET http://localhost:3000/api/pk-queue/history?limit=50&offset=0
Authorization: Bearer {token}
```

## 🧪 Test dengan Postman/Thunder Client

### 1. Import Collection
Buat collection baru dengan endpoints di atas.

### 2. Login Dulu
- Request: POST login
- Simpan token dari response

### 3. Set Authorization
- Type: Bearer Token
- Token: {token dari login}

### 4. Test Endpoints
- GET my-queues
- GET statistics
- GET profile
- GET history

## 🌐 Test dengan cURL

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"budiana","password":"pk123456"}'
```

### Get My Queues:
```bash
curl -X GET http://localhost:3000/api/pk-queue/my-queues \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Accept Queue:
```bash
curl -X POST http://localhost:3000/api/pk-queue/1/accept \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Test Flow Lengkap

### Skenario: PK Melayani Klien

#### 1. Login sebagai PK
```bash
POST /api/auth/login
{
  "username": "budiana",
  "password": "pk123456"
}
```
**Simpan token!**

#### 2. Lihat Antrian yang Di-assign
```bash
GET /api/pk-queue/my-queues
Authorization: Bearer {token}
```

#### 3. Terima Antrian
```bash
POST /api/pk-queue/{queueId}/accept
Authorization: Bearer {token}
```
**Status berubah: waiting → called**

#### 4. Mulai Melayani
```bash
POST /api/pk-queue/{queueId}/start-serving
Authorization: Bearer {token}
```
**Status berubah: called → serving**

#### 5. Selesai Melayani
```bash
POST /api/pk-queue/{queueId}/complete
Authorization: Bearer {token}
{
  "notes": "Bimbingan selesai, klien kooperatif"
}
```
**Status berubah: serving → completed**

#### 6. Lihat Statistik
```bash
GET /api/pk-queue/statistics
Authorization: Bearer {token}
```

## 🎯 Daftar Lengkap 63 Akun PK

| No | Nama | Username | Password |
|----|------|----------|----------|
| 1 | Budiana | budiana | pk123456 |
| 2 | Ryan Rizkia | ryanrizkia | pk123456 |
| 3 | Muhamad Anggiansah | muhamadanggiansah | pk123456 |
| 4 | Rakha Hafiyan | rakhahafiyan | pk123456 |
| 5 | Kania Rafinda | kaniarafinda | pk123456 |
| 6 | Dina Anggun Wahyuni | dinaanggunwahyuni | pk123456 |
| 7 | Iyus Yusuf | iyusyusuf | pk123456 |
| 8 | Adhani Wardianti | adhaniwardianti | pk123456 |
| 9 | Hari Terbit Matahari | hariterbitmatahari | pk123456 |
| 10 | Mahyudi | mahyudi | pk123456 |
| 11 | Achmad Hidayat | achmadhidayat | pk123456 |
| 12 | Ati Ekawati | atiekawati | pk123456 |
| 13 | Uan Kurniawan N | uankurniawann | pk123456 |
| 14 | Adrian | adrian | pk123456 |
| 15 | Rima Khuriatul Rahmatilah | rimakhuriatulrahmati | pk123456 |
| ... | ... | ... | pk123456 |
| 63 | Lukman Mahar Dwikartika | lukmanmahardwikartik | pk123456 |

**Semua menggunakan password: pk123456**

## 🔍 Cara Generate Username dari Nama

Username dibuat dengan aturan:
1. Lowercase semua huruf
2. Hapus spasi
3. Hapus karakter khusus (titik, koma, dll)
4. Maksimal 20 karakter

**Contoh:**
- "Budiana" → "budiana"
- "Ryan Rizkia" → "ryanrizkia"
- "Dina Anggun Wahyuni, A.Md.IP" → "dinaanggunwahyuni"

## 💡 Tips

### 1. Simpan Token
Setelah login, simpan token untuk request berikutnya.

### 2. Test dengan Postman
Lebih mudah untuk test API dengan Postman atau Thunder Client.

### 3. Check pk_id
Pastikan response login ada `pk_id` untuk konfirmasi akun PK.

### 4. Monitor Console
Lihat console backend untuk debug jika ada error.

## 🚨 Troubleshooting

### Error: "PK access required"
**Solusi**: Pastikan login dengan akun PK yang punya `pk_id`.

### Error: "Invalid credentials"
**Solusi**: 
- Cek username (lowercase, no spaces)
- Password: pk123456

### Error: "Queue not found"
**Solusi**: Pastikan queue sudah di-assign ke PK Anda oleh operator.

### Token Expired
**Solusi**: Login ulang untuk dapat token baru.

## 📱 Aplikasi Status

### Backend (Port 3000) ✅
- Running
- API endpoints ready
- 63 akun PK active

### Operator App (Port 5174) ✅
- Running
- Bisa digunakan untuk login PK sementara

### PK App (Port 5176) 🚧
- Belum dibuat
- Akan dibuat untuk UI khusus PK

## 🎯 Next Steps

### Untuk Development:
1. Buat PK App frontend dedicated
2. Implementasi UI untuk accept/serve/complete
3. Tambah notifikasi real-time
4. Implementasi panggilan suara otomatis

### Untuk Testing:
1. Login dengan akun PK
2. Test semua endpoints
3. Verifikasi flow lengkap
4. Test rating system

---

**Backend PK sudah siap digunakan!** ✅

**Login sekarang: http://localhost:5174/login** 🔐

**Username: budiana | Password: pk123456** 👤

**API Documentation lengkap tersedia!** 📚
