# 🔐 Panduan Login Aplikasi Petugas

## 📋 Kredensial Login

### Default Users (Testing):

#### 1. Petugas Layanan
```
Username: petugas_layanan
Password: petugas123
Role: petugas_layanan
Dashboard: Petugas Layanan Dashboard (Emerald)
```

#### 2. PK (Pembimbing Kemasyarakatan)
```
Username: pk
Password: pk123
Role: pk
Dashboard: PK Dashboard (Teal)
```

#### 3. Struktural
```
Username: struktural
Password: struktural123
Role: struktural
Dashboard: Struktural Dashboard (Cyan)
```

---

## 🚀 Cara Login

### Step 1: Buka Aplikasi Petugas
```
URL: http://localhost:5176
```

### Step 2: Pilih Role
Klik salah satu dari 3 role:
- **Petugas Layanan** - Kelola antrian dan layanan
- **PK** - Kelola klien wajib lapor
- **Struktural** - Monitor dan evaluasi

### Step 3: Masukkan Kredensial
```
Username: [username sesuai role]
Password: [password sesuai role]
```

### Step 4: Klik Login
Sistem akan:
1. Validasi kredensial
2. Check role access
3. Redirect ke dashboard sesuai role

---

## 🎯 Dashboard per Role

### Petugas Layanan Dashboard
**Warna:** Emerald Green
**Fitur:**
- Statistik antrian hari ini
- Daftar antrian aktif
- Kelola antrian (panggil, layani, selesai)
- Quick actions
- Grafik layanan

### PK Dashboard
**Warna:** Teal
**Fitur:**
- Statistik klien wajib lapor
- Daftar klien aktif
- Jadwal penghadapan
- Riwayat laporan
- Manajemen klien

### Struktural Dashboard
**Warna:** Cyan
**Fitur:**
- Overview kinerja
- Statistik lengkap
- Grafik performa
- Laporan bulanan
- Evaluasi tim

---

## ❌ Troubleshooting

### Error: "Akses ditolak"

**Penyebab:**
- User tidak memiliki role petugas
- Role tidak sesuai dengan aplikasi

**Solusi:**
1. Pastikan login dengan user yang benar
2. Check role di Panel Admin
3. Pastikan role adalah: petugas_layanan, pk, atau struktural

### Error: "Invalid credentials"

**Penyebab:**
- Username atau password salah
- User belum dibuat

**Solusi:**
1. Check username dan password
2. Gunakan kredensial default di atas
3. Atau buat user baru di Panel Admin

### Error: "Cannot connect to backend"

**Penyebab:**
- Backend tidak running

**Solusi:**
```bash
cd backend
npm run dev
```

---

## 🔧 Membuat User Petugas Baru

### Via Panel Admin:

1. **Login ke Panel Admin**
   ```
   URL: http://localhost:5174
   Username: admin
   Password: admin123
   ```

2. **Buka Menu "Kelola Pengguna"**

3. **Klik "Tambah Pengguna"**

4. **Isi Form:**
   ```
   Username: [username_baru]
   Password: [password_baru]
   Nama: [Nama Lengkap]
   Role: [Pilih dari dropdown]
     - Petugas Layanan
     - PK
     - Struktural
   ```

5. **Klik "Simpan"**

### Via Script (Manual):

```bash
cd backend
node add-petugas-users.js
```

---

## 🔐 Keamanan

### Password Policy:
- Minimal 6 karakter
- Kombinasi huruf dan angka (recommended)
- Ganti password default setelah login pertama

### Session:
- Token JWT valid 24 jam
- Auto logout setelah 24 jam
- Refresh token saat activity

### Access Control:
- Role-based authentication
- Dashboard sesuai role
- Tidak bisa akses dashboard role lain

---

## 📊 Role Permissions

### Admin:
```
✓ Panel Admin (full access)
✓ Kelola pengguna
✓ Kelola layanan
✓ Pengaturan sistem
❌ Aplikasi Petugas
```

### Operator:
```
✓ Panel Admin (limited)
✓ Kelola antrian
❌ Kelola pengguna
❌ Aplikasi Petugas
```

### Petugas Layanan:
```
❌ Panel Admin
✓ Aplikasi Petugas
✓ Dashboard Petugas Layanan
✓ Kelola antrian
✓ Layanan umum
```

### PK:
```
❌ Panel Admin
✓ Aplikasi Petugas
✓ Dashboard PK
✓ Kelola klien
✓ Wajib lapor
```

### Struktural:
```
❌ Panel Admin
✓ Aplikasi Petugas
✓ Dashboard Struktural
✓ Monitor kinerja
✓ Laporan evaluasi
```

---

## 🎨 Visual Identity per Role

### Petugas Layanan:
```
Icon: 👥 Users
Color: Emerald (#10b981)
Theme: Green gradient
```

### PK:
```
Icon: ✓ UserCheck
Color: Teal (#14b8a6)
Theme: Teal gradient
```

### Struktural:
```
Icon: 🛡️ Shield
Color: Cyan (#06b6d4)
Theme: Cyan gradient
```

---

## 💡 Tips

### 1. Gunakan Role yang Sesuai
Pilih role sesuai tugas Anda:
- Layanan umum → Petugas Layanan
- Klien binaan → PK
- Monitoring → Struktural

### 2. Jangan Share Password
Setiap user harus punya akun sendiri

### 3. Logout Setelah Selesai
Klik tombol logout di navbar

### 4. Check Dashboard
Pastikan dashboard sesuai dengan role Anda

---

## 🔄 Flow Lengkap

```
1. Buka http://localhost:5176
   ↓
2. Pilih Role (Petugas Layanan / PK / Struktural)
   ↓
3. Masukkan Username & Password
   ↓
4. Klik Login
   ↓
5. Sistem validasi:
   - Check credentials ✓
   - Check role access ✓
   - Generate JWT token ✓
   ↓
6. Redirect ke Dashboard sesuai role
   ↓
7. Mulai bekerja!
```

---

## 📞 Support

### Jika Lupa Password:
Hubungi admin untuk reset password

### Jika Error Login:
1. Check backend running
2. Check credentials
3. Check role di database
4. Lihat console log untuk error detail

### Jika Dashboard Tidak Muncul:
1. Clear browser cache
2. Refresh page (F5)
3. Check console untuk error
4. Restart aplikasi

---

## ✅ Checklist Login

- [ ] Backend running (Port 3000)
- [ ] Aplikasi Petugas running (Port 5176)
- [ ] User sudah dibuat di database
- [ ] Role sudah di-set dengan benar
- [ ] Username dan password benar
- [ ] Browser tidak block cookies

---

**KIANSANTANG - Aplikasi Petugas**

**BAPAS Kelas I Bandung**

*Login dan mulai bekerja!* 🚀✨
