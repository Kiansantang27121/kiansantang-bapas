# 🔐 DAFTAR USER & PASSWORD - KIANSANTANG BAPAS BANDUNG

## 📋 Total Users: 8

---

## 👑 ADMIN

### 1. Administrator
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin
- **Akses**: Semua fitur (kelola user, layanan, pengaturan, dll)

---

## 👥 OPERATOR

### 2. Operator Registrasi
- **Username**: `operator`
- **Password**: `operator123`
- **Role**: Operator
- **Akses**: Kelola antrian, panggil klien, layanan

---

## 🏢 PETUGAS LAYANAN

### 3. Petugas Layanan
- **Username**: `petugas`
- **Password**: `petugas123`
- **Role**: Petugas Layanan
- **Akses**: Melayani antrian di loket

---

## 👨‍💼 PEMBIMBING KEMASYARAKATAN (PK)

### 4. APK (Ahli Pembimbing Kemasyarakatan)
- **Username**: `apk`
- **Password**: `pk123`
- **Role**: PK
- **Akses**: Dashboard PK, kelola klien binaan, approve antrian

### 5. PK Madya
- **Username**: `pk_madya`
- **Password**: `pk123`
- **Role**: PK
- **Akses**: Dashboard PK, kelola klien binaan, approve antrian

### 6. PK Muda
- **Username**: `pk_muda`
- **Password**: `pk123`
- **Role**: PK
- **Akses**: Dashboard PK, kelola klien binaan, approve antrian

### 7. PK Pertama
- **Username**: `pk_pertama`
- **Password**: `pk123`
- **Role**: PK
- **Akses**: Dashboard PK, kelola klien binaan, approve antrian

---

## 🎖️ STRUKTURAL

### 8. Struktural/Kepala
- **Username**: `struktural`
- **Password**: `struktural123`
- **Role**: Struktural
- **Akses**: Monitoring, laporan, dashboard

---

## 📱 CARA LOGIN

### Aplikasi Panel Admin (Port 5174)
```
URL: http://localhost:5174
Login dengan salah satu user di atas
```

### Aplikasi Petugas (Port 5176)
```
URL: http://localhost:5176
Login dengan:
- Petugas Layanan
- PK (apk, pk_madya, pk_muda, pk_pertama)
- Struktural
```

---

## 🔑 PASSWORD DEFAULT

Jika lupa password, gunakan password default berikut:

| Role | Password Default |
|------|-----------------|
| Admin | `admin123` |
| Operator | `operator123` |
| Petugas Layanan | `petugas123` |
| PK (Semua) | `pk123` |
| Struktural | `struktural123` |

---

## 🛡️ KEAMANAN

⚠️ **PENTING**:
- Password di atas adalah password DEFAULT
- Segera ubah password setelah login pertama kali
- Jangan share password ke orang yang tidak berwenang
- Password di database sudah di-hash untuk keamanan

---

## 📊 RINGKASAN AKSES PER ROLE

### 👑 Admin
- ✅ Kelola User
- ✅ Kelola Layanan
- ✅ Kelola Pengaturan
- ✅ Kelola Antrian
- ✅ Lihat Laporan
- ✅ Kelola PK & Klien

### 👥 Operator
- ✅ Kelola Antrian
- ✅ Panggil Klien
- ✅ Layanan Loket
- ❌ Kelola User
- ❌ Kelola Pengaturan

### 🏢 Petugas Layanan
- ✅ Melayani Antrian
- ✅ Panggil Klien
- ✅ Update Status Layanan
- ❌ Kelola User
- ❌ Kelola Pengaturan

### 👨‍💼 PK (Pembimbing Kemasyarakatan)
- ✅ Dashboard PK
- ✅ Kelola Klien Binaan
- ✅ Approve/Reject Antrian
- ✅ Panggil Klien
- ✅ Lihat Riwayat Klien
- ❌ Kelola User
- ❌ Kelola Pengaturan

### 🎖️ Struktural
- ✅ Dashboard Monitoring
- ✅ Lihat Laporan
- ✅ Lihat Statistik
- ❌ Kelola User
- ❌ Kelola Antrian

---

## 🆘 TROUBLESHOOTING

### Login Gagal?
1. Pastikan username dan password benar (case-sensitive)
2. Coba gunakan password default
3. Pastikan backend sudah running
4. Clear browser cache dan cookies

### Lupa Password?
1. Hubungi Administrator
2. Administrator bisa reset password via Panel Admin
3. Atau gunakan password default di atas

---

**Dibuat**: 9 November 2025  
**Sistem**: KIANSANTANG - Kios Antrian Santun dan Tanggap  
**Instansi**: BAPAS Kelas I Bandung
