# 🔐 Panduan Login untuk PK

## ❌ Kesalahan yang Sering Terjadi

### Error: 401 Unauthorized

**Penyebab:**
- Password salah (case sensitive!)
- Username salah

## ✅ Cara Login yang BENAR

### URL Login:
```
http://localhost:5174
```

### Credentials:

**PENTING: Password menggunakan huruf KECIL semua!**

```
Username: budiana
Password: pk123456
```

**BUKAN:**
- ❌ PK123456 (huruf besar)
- ❌ Pk123456 (mixed case)
- ✅ pk123456 (huruf kecil semua)

## 👥 Daftar Akun PK

| No | Nama PK | Username | Password |
|----|---------|----------|----------|
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

**... dan 53 akun PK lainnya**

**Semua menggunakan password: pk123456 (huruf kecil)**

## 🔍 Cara Cek Username Anda

Username dibuat dari nama PK dengan aturan:
1. Semua huruf kecil (lowercase)
2. Hapus spasi
3. Hapus karakter khusus (titik, koma, gelar)
4. Maksimal 20 karakter

**Contoh:**
- "Budiana" → budiana
- "Ryan Rizkia" → ryanrizkia
- "Dina Anggun Wahyuni, A.Md.IP" → dinaanggunwahyuni

## 📝 Step-by-Step Login

### 1. Buka Browser
```
http://localhost:5174
```

### 2. Masukkan Username
- Ketik: **budiana** (huruf kecil)
- Jangan ada spasi
- Tekan Tab

### 3. Masukkan Password
- Ketik: **pk123456** (huruf kecil semua)
- JANGAN ketik PK123456 (huruf besar)
- Tekan Enter

### 4. Klik Login
- Tunggu proses
- Jika berhasil, akan redirect ke dashboard

## ⚠️ Troubleshooting

### Error: "Invalid credentials"
**Solusi:**
1. Pastikan username huruf kecil semua
2. Pastikan password: pk123456 (huruf kecil)
3. Tidak ada spasi di awal/akhir
4. Coba copy-paste dari sini:
   ```
   Username: budiana
   Password: pk123456
   ```

### Error: "401 Unauthorized"
**Solusi:**
1. Password salah - gunakan huruf kecil: pk123456
2. Clear browser cache
3. Refresh halaman
4. Coba lagi

### Lupa Username?
**Solusi:**
1. Lihat tabel di atas
2. Atau gunakan nama Anda (lowercase, no spaces)
3. Contoh: "Budi Santoso" → budisantoso

## 🎯 Akun Admin (untuk testing)

Jika ingin login sebagai admin:
```
Username: admin
Password: admin123
```

## 📱 Setelah Login Berhasil

Anda akan melihat:
- Dashboard operator
- Menu sidebar
- Data antrian
- Statistik

**Catatan:** Saat ini PK login menggunakan Operator App. PK App khusus sedang dalam pengembangan.

## 🔐 Keamanan

### Ganti Password Setelah Login Pertama
1. Login dengan password default
2. Buka menu Profile/Settings
3. Pilih "Change Password"
4. Masukkan password baru
5. Simpan

### Password Baru Harus:
- Minimal 8 karakter
- Kombinasi huruf dan angka
- Berbeda dari default

## 💡 Tips

1. **Copy-Paste Password**
   - Untuk menghindari typo
   - Copy dari dokumentasi ini
   - Paste di form login

2. **Bookmark URL**
   - Simpan http://localhost:5174
   - Untuk akses cepat

3. **Remember Me**
   - Centang jika tersedia
   - Tidak perlu login ulang

4. **Logout Setelah Selesai**
   - Klik menu Logout
   - Untuk keamanan

## 📞 Bantuan

Jika masih gagal login:
1. Screenshot error message
2. Cek console browser (F12)
3. Cek backend logs
4. Hubungi admin sistem

---

**Password yang BENAR: pk123456 (huruf kecil semua!)** ✅

**BUKAN: PK123456 (huruf besar)** ❌

**Selamat mencoba!** 🚀
