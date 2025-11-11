# ⚙️ Pengaturan Nomor Antrian

## 🎯 Fitur Baru: Konfigurasi Format Nomor Antrian

Sistem sekarang mendukung pengaturan format nomor antrian yang fleksibel melalui menu Pengaturan.

## 📋 Pengaturan yang Tersedia

### 1. **Tipe Prefix**
Pilih bagaimana prefix nomor antrian dibuat:

- **Service (Default)**: Menggunakan huruf pertama nama layanan
  - Bimbingan → B
  - Konsultasi → K
  - Pelaporan → P
  
- **Custom**: Menggunakan prefix yang Anda tentukan sendiri
  - Contoh: A, BP, ANT, dll (maksimal 3 karakter)

### 2. **Format Tanggal**
Pilih format tanggal dalam nomor antrian:

- **YYYYMMDD**: 20250109 (Tahun 4 digit + Bulan + Tanggal)
- **YYMMDD**: 250109 (Tahun 2 digit + Bulan + Tanggal)
- **DDMMYY**: 090125 (Tanggal + Bulan + Tahun 2 digit)
- **DDMMYYYY**: 09012025 (Tanggal + Bulan + Tahun 4 digit)
- **Tanpa Tanggal**: Tidak ada komponen tanggal

### 3. **Jumlah Digit Nomor Urut**
Pilih berapa digit untuk nomor urut:

- **1 digit**: 1, 2, 3, ... 9, 10, 11, ...
- **2 digit**: 01, 02, 03, ... 99, 100, ...
- **3 digit**: 001, 002, 003, ... 999, 1000, ... (Default)
- **4 digit**: 0001, 0002, 0003, ... 9999, 10000, ...
- **5 digit**: 00001, 00002, 00003, ... 99999, 100000, ...

### 4. **Separator (Pemisah)**
Pilih karakter pemisah antar komponen:

- **Tanpa Separator**: A202501090001 (Default)
- **Dash (-)**: A-20250109-0001
- **Dot (.)**: A.20250109.0001
- **Slash (/)**: A/20250109/0001
- **Spasi**: A 20250109 0001

### 5. **Reset Harian**
- **Aktif (Default)**: Nomor antrian reset ke awal setiap hari
- **Nonaktif**: Nomor antrian terus bertambah tanpa reset

### 6. **Nomor Awal**
Tentukan dari nomor berapa antrian dimulai:
- Default: 1
- Bisa diubah: 0, 1, 10, 100, dll

## 🎨 Contoh Format Nomor Antrian

### Format Standar (Default)
```
B202501090001
```
- B = Bimbingan (huruf pertama layanan)
- 20250109 = 9 Januari 2025
- 0001 = Nomor urut (3 digit)

### Format Custom dengan Separator
```
BP-250109-0001
```
- BP = Custom prefix
- 250109 = 9 Januari 2025 (YYMMDD)
- 0001 = Nomor urut (4 digit)
- Separator: dash (-)

### Format Sederhana
```
A01
```
- A = Custom prefix
- Tanpa tanggal
- 01 = Nomor urut (2 digit)

### Format dengan Slash
```
B/090125/001
```
- B = Service prefix
- 090125 = 9 Januari 2025 (DDMMYY)
- 001 = Nomor urut (3 digit)
- Separator: slash (/)

## 🚀 Cara Menggunakan

### Step 1: Buka Menu Pengaturan

1. Login ke Operator App: `http://localhost:5174`
2. Klik menu **"Pengaturan"** di sidebar
3. Scroll ke bagian **"Pengaturan Nomor Antrian"**

### Step 2: Atur Format Sesuai Kebutuhan

1. **Pilih Tipe Prefix**
   - Service: Otomatis dari nama layanan
   - Custom: Tentukan sendiri (A, B, BP, dll)

2. **Pilih Format Tanggal**
   - Pilih format yang sesuai atau tanpa tanggal

3. **Pilih Jumlah Digit**
   - Sesuaikan dengan volume antrian harian

4. **Pilih Separator**
   - Untuk kemudahan baca atau sesuai standar

5. **Atur Reset Harian**
   - Centang jika ingin reset setiap hari
   - Uncheck jika ingin nomor terus bertambah

6. **Tentukan Nomor Awal**
   - Default 1, bisa diubah sesuai kebutuhan

### Step 3: Lihat Preview

Preview nomor antrian akan muncul di bagian atas dengan format yang Anda pilih.

### Step 4: Simpan Pengaturan

Klik tombol **"Simpan Pengaturan"** di bawah.

## 📊 Skenario Penggunaan

### Skenario 1: Kantor dengan Banyak Layanan
**Kebutuhan**: Setiap layanan punya prefix berbeda

**Pengaturan:**
- Tipe Prefix: Service
- Format Tanggal: YYYYMMDD
- Digit: 3
- Separator: Tanpa
- Reset Harian: Ya

**Hasil:**
- Bimbingan: B202501090001, B202501090002, ...
- Konsultasi: K202501090001, K202501090002, ...
- Pelaporan: P202501090001, P202501090002, ...

### Skenario 2: Kantor dengan Volume Tinggi
**Kebutuhan**: Nomor antrian sampai ratusan per hari

**Pengaturan:**
- Tipe Prefix: Custom (BP)
- Format Tanggal: YYMMDD
- Digit: 4
- Separator: Dash
- Reset Harian: Ya

**Hasil:**
- BP-250109-0001
- BP-250109-0002
- ...
- BP-250109-0999
- BP-250109-1000

### Skenario 3: Kantor Sederhana
**Kebutuhan**: Format simple, mudah dibaca

**Pengaturan:**
- Tipe Prefix: Custom (A)
- Format Tanggal: Tanpa
- Digit: 2
- Separator: Tanpa
- Reset Harian: Ya

**Hasil:**
- A01, A02, A03, ... A99, A100

### Skenario 4: Standar Pemerintahan
**Kebutuhan**: Format sesuai standar dengan separator

**Pengaturan:**
- Tipe Prefix: Service
- Format Tanggal: DDMMYYYY
- Digit: 4
- Separator: Slash (/)
- Reset Harian: Ya

**Hasil:**
- B/09012025/0001
- B/09012025/0002

## 🔧 Pengaturan Database

Settings disimpan di tabel `settings`:

| Key | Value | Description |
|-----|-------|-------------|
| queue_number_prefix_type | service/custom | Tipe prefix |
| queue_number_custom_prefix | A | Custom prefix jika tipe = custom |
| queue_number_date_format | YYYYMMDD | Format tanggal |
| queue_number_digits | 3 | Jumlah digit nomor urut |
| queue_number_separator | - | Separator antar komponen |
| queue_reset_daily | true | Reset nomor setiap hari |
| queue_start_number | 1 | Nomor awal antrian |

## 💡 Tips & Best Practices

### 1. Pilih Format yang Konsisten
Setelah memilih format, sebaiknya tidak diubah-ubah untuk menghindari kebingungan.

### 2. Sesuaikan Digit dengan Volume
- Volume < 100/hari: 2-3 digit
- Volume 100-999/hari: 3-4 digit
- Volume > 1000/hari: 4-5 digit

### 3. Gunakan Reset Harian
Untuk kantor dengan jam operasional tetap, reset harian memudahkan tracking.

### 4. Separator untuk Kemudahan Baca
Jika nomor antrian panjang, gunakan separator untuk kemudahan baca.

### 5. Test Sebelum Operasional
Test format baru dengan beberapa antrian dummy sebelum digunakan secara resmi.

## 🔄 Migrasi Format

Jika ingin mengubah format nomor antrian:

1. **Backup Data**: Export data antrian yang ada
2. **Ubah Pengaturan**: Set format baru di menu Pengaturan
3. **Test**: Buat antrian dummy untuk test
4. **Verifikasi**: Pastikan format sesuai harapan
5. **Aktifkan**: Mulai gunakan untuk antrian real

**PENTING**: Perubahan format hanya berlaku untuk antrian baru, tidak mengubah nomor antrian yang sudah ada.

## 📱 Tampilan di Aplikasi

### Aplikasi Pendaftaran
Nomor antrian dengan format baru akan muncul di:
- Konfirmasi pendaftaran
- Cetak tiket antrian

### Display Antrian
Nomor antrian ditampilkan dengan format yang sudah diatur.

### Operator App
Operator melihat nomor antrian dengan format yang sama.

## 🎯 Keuntungan Fitur Ini

1. **Fleksibel**: Sesuaikan dengan kebutuhan kantor
2. **Mudah Diatur**: UI yang user-friendly
3. **Preview Real-time**: Lihat hasil sebelum disimpan
4. **Standarisasi**: Konsisten di semua aplikasi
5. **Scalable**: Mendukung volume tinggi

## 📝 Troubleshooting

### Preview Tidak Berubah
**Solusi**: Refresh halaman dan coba lagi

### Nomor Antrian Tidak Sesuai Pengaturan
**Solusi**: 
1. Cek apakah pengaturan sudah disimpan
2. Restart backend
3. Clear cache browser

### Format Terlalu Panjang
**Solusi**: 
- Gunakan format tanggal lebih pendek (YYMMDD)
- Kurangi jumlah digit
- Gunakan custom prefix yang lebih pendek

---

**Fitur pengaturan nomor antrian sudah aktif!** ⚙️✨

**Silakan buka menu Pengaturan untuk mengkonfigurasi format sesuai kebutuhan!** 🎯

**URL**: `http://localhost:5174/settings`
