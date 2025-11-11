# 📝 Cara Mengatur Running Text

Running text adalah teks berjalan yang ditampilkan di halaman utama KIANSANTANG (index.html). Text ini dapat diatur melalui Panel Pengaturan (Admin).

## 🎯 Lokasi Running Text

Running text ditampilkan di:
- **Halaman Utama** (`index.html`) - Di bawah header, sebelum aplikasi utama

## ⚙️ Cara Mengatur dari Panel Pengaturan

### 1. Akses Panel Admin
- Buka Panel Pengaturan: `http://localhost:5174`
- Login dengan akun Administrator

### 2. Masuk ke Menu Settings/Pengaturan
- Cari menu **Settings** atau **Pengaturan**
- Cari setting dengan key: `running_text`

### 3. Edit Running Text
- Klik tombol **Edit** pada setting `running_text`
- Masukkan text baru yang diinginkan
- Klik **Save** atau **Simpan**

### 4. Lihat Hasilnya
- Buka halaman utama: `http://localhost:5173` atau `file:///D:/kiansantang/bapas-bandung/index.html`
- Running text akan otomatis terupdate dalam 60 detik
- Atau refresh halaman untuk melihat perubahan langsung

## 🔧 Cara Mengatur via API (Manual)

Jika ingin mengatur langsung via API:

```bash
# Update running text
curl -X PUT http://localhost:3000/api/settings/running_text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "value": "Text baru yang ingin ditampilkan",
    "description": "Running text yang ditampilkan di halaman utama"
  }'
```

## 💡 Tips Menulis Running Text

1. **Panjang Text**: Tidak ada batasan, tapi sebaiknya tidak terlalu panjang
2. **Pemisah**: Gunakan `|` untuk memisahkan informasi
3. **Contoh Format**:
   ```
   Selamat datang di KIANSANTANG | BAPAS Kelas I Bandung | Layanan Cepat dan Profesional
   ```

## 🎨 Fitur Running Text

- ✅ **Auto-scroll**: Text berjalan otomatis dari kanan ke kiri
- ✅ **Pause on hover**: Text berhenti saat kursor di atasnya
- ✅ **Auto-update**: Text terupdate otomatis setiap 60 detik
- ✅ **Responsive**: Tampil baik di desktop dan mobile
- ✅ **Glassmorphism**: Design modern dengan efek blur

## 📊 Default Running Text

Running text default:
```
Selamat Datang Di Balai Pemasyarakatan Kelas I Bandung
```

## 🔄 Update Running Text via Database

Jika ingin update langsung via database:

```sql
UPDATE settings 
SET value = 'Text baru Anda' 
WHERE key = 'running_text';
```

Atau jalankan script:

```bash
cd backend
node add-running-text.js
```

## 🎯 Contoh Running Text yang Menarik

```
🎫 Selamat datang di KIANSANTANG - Kios Antrian Santun dan Tanggap | 🏢 BAPAS Kelas I Bandung | ⚡ Layanan Cepat, Santun, dan Profesional | 📱 Sistem Antrian Digital Terintegrasi
```

```
Selamat Datang di BAPAS Kelas I Bandung | Jam Operasional: Senin-Jumat 08:00-16:00 | Hubungi: (022) 1234567 | Email: bapas.bandung@kemenkumham.go.id
```

```
KIANSANTANG - Inovasi Pelayanan Publik BAPAS Kelas I Bandung | Antrian Digital, Cepat & Mudah | Melayani dengan Sepenuh Hati
```

## ❓ Troubleshooting

**Running text tidak muncul?**
- Pastikan backend server berjalan
- Cek koneksi ke API: `http://localhost:3000/api/health`
- Cek browser console untuk error

**Running text tidak update?**
- Refresh halaman atau tunggu 60 detik
- Cek setting di database: `SELECT * FROM settings WHERE key = 'running_text'`

**Running text terlalu cepat/lambat?**
- Edit file `index.html`
- Cari `animation: scroll-left 30s linear infinite;`
- Ubah `30s` ke nilai yang diinginkan (lebih besar = lebih lambat)

---

**Dibuat oleh**: KIANSANTANG Development Team  
**Terakhir diupdate**: November 2025
