# 🔐 Panduan Login Lengkap

## 📱 Aplikasi yang Tersedia

### 1. Operator App (Port 5174)
**URL**: http://localhost:5174

**Untuk:**
- Admin
- Operator
- PK (sementara)
- Petugas (sementara)

### 2. Registration App (Port 5173)
**URL**: http://localhost:5173

**Untuk:**
- Pendaftaran klien (tidak perlu login)

### 3. Display App (Port 5175)
**URL**: http://localhost:5175

**Untuk:**
- Tampilan antrian (tidak perlu login)

## 👤 Akun yang Tersedia

### 🔵 Admin
```
Username: admin
Password: admin123
```
**Akses**: Full access semua fitur

### 🟢 Operator
```
Username: operator
Password: operator123
```
**Akses**: Kelola antrian, layanan, klien

### 🟡 PK (63 Akun)
**Password semua PK**: `pk123456` (huruf kecil!)

**Contoh:**
```
Username: budiana
Password: pk123456
```

**Daftar Username PK:**
- budiana
- ryanrizkia
- muhamadanggiansah
- rakhahafiyan
- kaniarafinda
- dinaanggunwahyuni
- iyusyusuf
- adhaniwardianti
- hariterbitmatahari
- mahyudi
- ... (53 lainnya)

### 🟣 Petugas (5 Akun)
**Password semua petugas**: `petugas123`

| Role | Username | Password |
|------|----------|----------|
| Petugas Layanan | petugas_layanan | petugas123 |
| Petugas PK | petugas_pk | petugas123 |
| Petugas Penghadapan | petugas_penghadapan | petugas123 |
| Petugas Kunjungan | petugas_kunjungan | petugas123 |
| Petugas Pengaduan | petugas_pengaduan | petugas123 |

## 📝 Cara Login Step-by-Step

### Step 1: Buka Browser
Klik tombol browser preview atau buka manual:
```
http://localhost:5174
```

### Step 2: Pilih Akun
Pilih salah satu akun di atas sesuai kebutuhan.

### Step 3: Masukkan Username
Ketik username dengan benar (huruf kecil, tanpa spasi).

### Step 4: Masukkan Password
**PENTING**: 
- Admin: admin123
- Operator: operator123
- PK: **pk123456** (huruf kecil!)
- Petugas: petugas123

### Step 5: Klik Login
Tunggu proses, akan redirect ke dashboard.

## ⚠️ Kesalahan yang Sering Terjadi

### ❌ Error: 401 Unauthorized

**Penyebab:**
- Password salah (case sensitive!)
- Username salah

**Solusi:**
1. Pastikan password huruf kecil semua
2. Tidak ada spasi di awal/akhir
3. Copy-paste dari panduan ini

### ❌ Password PK Salah

**SALAH:**
- PK123456 (huruf besar) ❌
- Pk123456 (mixed case) ❌

**BENAR:**
- pk123456 (huruf kecil semua) ✅

## 🎯 Rekomendasi Login

### Untuk Testing Umum:
```
Username: admin
Password: admin123
```

### Untuk Test Fitur PK:
```
Username: budiana
Password: pk123456
```

### Untuk Test Fitur Pengaduan:
```
Username: petugas_pengaduan
Password: petugas123
```

### Untuk Test Fitur Kunjungan:
```
Username: petugas_kunjungan
Password: petugas123
```

## 💡 Tips Login

### 1. Copy-Paste Credentials
Untuk menghindari typo, copy-paste dari sini:

**Admin:**
```
admin
admin123
```

**PK:**
```
budiana
pk123456
```

**Petugas:**
```
petugas_pengaduan
petugas123
```

### 2. Clear Browser Cache
Jika login gagal terus:
1. Tekan Ctrl + Shift + Delete
2. Clear cache
3. Refresh halaman
4. Coba login lagi

### 3. Check Console
Jika error:
1. Tekan F12
2. Buka tab Console
3. Lihat error message
4. Screenshot untuk debugging

## 🔄 Setelah Login Berhasil

### Dashboard Admin
- Statistik lengkap
- Kelola users
- Kelola layanan
- Pengaturan sistem

### Dashboard Operator
- Kelola antrian
- Panggil klien
- Assign ke PK
- Monitor layanan

### Dashboard PK
- Lihat antrian saya
- Terima antrian
- Panggil klien
- Selesaikan layanan

### Dashboard Petugas
- Lihat tasks saya
- Terima tugas
- Proses tugas
- Complete dengan notes

## 🔐 Ganti Password

### Setelah Login Pertama:
1. Klik menu Profile/Settings
2. Pilih "Change Password"
3. Masukkan password lama
4. Masukkan password baru
5. Konfirmasi password baru
6. Simpan

### Password Baru Harus:
- Minimal 8 karakter
- Kombinasi huruf dan angka
- Berbeda dari default

## 📊 Summary Akun

| Kategori | Jumlah | Password Default |
|----------|--------|------------------|
| Admin | 1 | admin123 |
| Operator | 1 | operator123 |
| PK | 63 | pk123456 |
| Petugas | 5 | petugas123 |
| **Total** | **70** | - |

## 🚀 Quick Access

### Login Cepat Admin:
1. Buka: http://localhost:5174
2. Username: admin
3. Password: admin123
4. Enter

### Login Cepat PK:
1. Buka: http://localhost:5174
2. Username: budiana
3. Password: pk123456 (huruf kecil!)
4. Enter

### Login Cepat Petugas:
1. Buka: http://localhost:5174
2. Username: petugas_pengaduan
3. Password: petugas123
4. Enter

## 📞 Bantuan

### Jika Masih Gagal Login:
1. Screenshot error
2. Cek backend logs (terminal)
3. Pastikan backend running (port 3000)
4. Restart aplikasi jika perlu

### Check Backend Status:
```bash
# Cek apakah backend running
curl http://localhost:3000/api/health
```

**Response yang benar:**
```json
{
  "status": "ok",
  "message": "BAPAS Bandung API is running"
}
```

---

**Browser preview sudah dibuka!** ✅

**Silakan login dengan salah satu akun di atas!** 🔐

**Rekomendasi: admin / admin123 untuk full access** 👑

**Atau: budiana / pk123456 untuk test fitur PK** 👤

**Ingat: Password huruf kecil semua!** ⚠️
