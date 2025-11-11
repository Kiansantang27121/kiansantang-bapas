# 🎯 UPDATE: Auto-Assign PK Tanpa Pilihan Manual

## 📋 Perubahan

### ❌ Dihapus:
- Dropdown pilihan PK manual
- Opsi untuk memilih PK secara manual oleh petugas

### ✅ Ditambahkan:
- **Info box** menampilkan PK yang akan dipanggil (otomatis dari data klien)
- **Badge jabatan** menampilkan jabatan PK (APK, PK Madya, PK Muda, PK Pertama)
- **Pesan auto-assign** jika PK belum tersedia

---

## 🎨 Tampilan Baru

### Jika Klien Sudah Punya PK:

```
┌─────────────────────────────────────────────────┐
│ 👤 PK yang akan dipanggil:                     │
│                                                 │
│ Budiana - Pembimbing Kemasyarakatan Ahli Madya │
│                                    [PK Madya]   │
│                                                 │
│ ✓ Otomatis berdasarkan PK klien yang dipilih   │
│   saat mendaftar                                │
└─────────────────────────────────────────────────┘
```

### Jika Klien Belum Punya PK:

```
┌─────────────────────────────────────────────────┐
│ 👤 PK akan di-assign otomatis                   │
│                                                 │
│ Sistem akan mencari PK yang sesuai berdasarkan  │
│ jabatan PK klien                                │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Alur Kerja Baru

### 1. Klien Mendaftar (Registration App)
```
Klien memilih:
├─ Layanan: Bimbingan Wajib Lapor
├─ PK: Budiana (PK Madya)
└─ Data Klien: Nama, NIK, dll
```

### 2. Antrian Masuk ke Petugas
```
Petugas melihat:
├─ Nomor Antrian: B007
├─ Nama Klien: ACENG ROHMAT
├─ PK: Budiana (PK Madya) ← Otomatis dari pendaftaran
└─ Layanan: Penghadapan
```

### 3. Petugas Meneruskan ke PK
```
Petugas:
├─ Klik "Teruskan ke PK"
├─ Lihat info PK yang akan dipanggil (otomatis)
├─ Pilih Ruangan
└─ Klik "Meneruskan & Panggil PK"
```

### 4. Sistem Auto-Assign & Call
```
Sistem:
├─ Gunakan PK dari data klien (Budiana)
├─ Jika tidak ada, cari PK dengan jabatan yang sama
├─ Assign ke ruangan yang dipilih
├─ Panggil PK dengan voice announcement
└─ Update status antrian
```

---

## 💡 Keunggulan

### ✅ Lebih Sederhana
- Tidak perlu pilih PK manual
- Langsung gunakan PK dari data klien
- Mengurangi langkah yang diperlukan

### ✅ Lebih Akurat
- PK sudah ditentukan saat klien mendaftar
- Tidak ada kesalahan pilih PK
- Konsisten dengan data klien

### ✅ Lebih Cepat
- Proses lebih cepat tanpa pilih manual
- Langsung ke pilih ruangan
- Satu klik untuk meneruskan dan panggil

### ✅ Lebih Jelas
- Info PK ditampilkan dengan jelas
- Badge jabatan memudahkan identifikasi
- Pesan konfirmasi yang informatif

---

## 🔧 Perubahan Teknis

### Backend (`workflow-sqlite.js`)

**Query Update**:
```sql
SELECT 
  q.*,
  s.name as service_name,
  s.estimated_time,
  p.name as pk_name,
  p.jabatan as pk_jabatan,  -- Tambahan
  c.name as client_full_name
FROM queue q
JOIN services s ON q.service_id = s.id
LEFT JOIN pk p ON q.pk_id = p.id
LEFT JOIN clients c ON q.client_id = c.id
WHERE q.status = 'waiting'
```

### Frontend (`PetugasLayananDashboard.jsx`)

**UI Changes**:
1. Hapus dropdown "Pilih PK (Opsional)"
2. Tambah info box PK dengan badge jabatan
3. Tambah pesan auto-assign untuk klien tanpa PK
4. Fokus ke pilihan ruangan saja

---

## 📱 Cara Penggunaan

### Login Petugas
```
URL: http://localhost:5176
Username: petugas
Password: petugas123
```

### Proses Meneruskan ke PK

1. **Lihat Antrian**
   - Section: "Antrian Perlu Assignment PK"
   - Lihat daftar antrian waiting

2. **Klik "Teruskan ke PK"**
   - Akan muncul form dengan info PK
   - PK sudah otomatis dari data klien

3. **Lihat Info PK**
   - Jika ada: Nama PK + Badge Jabatan
   - Jika tidak ada: Pesan auto-assign

4. **Pilih Ruangan**
   - Pilih dari dropdown ruangan tersedia
   - Contoh: Ruang 1, Ruang 2, dll

5. **Tambah Catatan (Opsional)**
   - Isi catatan jika diperlukan

6. **Klik "Meneruskan & Panggil PK"**
   - PK akan dipanggil ke ruangan
   - Voice announcement berbunyi
   - Status antrian terupdate

---

## 🎯 Kategori Jabatan PK

| Kode | Jabatan | Keterangan |
|------|---------|------------|
| **APK** | Ahli Pembimbing Kemasyarakatan | Jabatan tertinggi |
| **PK Madya** | Pembimbing Kemasyarakatan Madya | Jabatan menengah atas |
| **PK Muda** | Pembimbing Kemasyarakatan Muda | Jabatan menengah |
| **PK Pertama** | Pembimbing Kemasyarakatan Pertama | Jabatan awal |

---

## 🔊 Voice Announcement

**Format Tetap Sama**:
```
"[Greeting], diberitahukan kepada Pembimbing Kemasyarakatan [Nama PK], 
ditunggu kehadirannya di [Nama Ruangan] karena ada klien wajib lapor 
atas nama [Nama Klien]..."
```

**Contoh**:
```
"Selamat siang, diberitahukan kepada Pembimbing Kemasyarakatan 
Budiana - Pembimbing Kemasyarakatan Ahli Madya, ditunggu kehadirannya 
di Ruang 1 karena ada klien wajib lapor atas nama ACENG ROHMAT BIN ALM MUHTAR..."
```

---

## ✅ Checklist Implementasi

- [x] Hapus dropdown pilihan PK manual
- [x] Tambah info box PK otomatis
- [x] Tambah badge jabatan PK
- [x] Update query backend untuk include jabatan
- [x] Tambah pesan auto-assign
- [x] Test dengan data real
- [x] Dokumentasi lengkap

---

## 🆘 Troubleshooting

### PK tidak muncul di info box?
- Pastikan klien sudah pilih PK saat mendaftar
- Cek data PK di tabel `pk`
- Cek relasi `clients.pk_id`

### Jabatan tidak muncul?
- Pastikan field `jabatan` terisi di tabel `pk`
- Cek query backend sudah include `p.jabatan`

### Auto-assign tidak bekerja?
- Pastikan ada PK dengan jabatan yang sama
- Cek endpoint `/workflow/forward-to-pk`
- Lihat log backend untuk error

---

**Update**: 9 November 2025 23:45  
**Versi**: 2.0 - Auto PK Assignment  
**Sistem**: KIANSANTANG - BAPAS Kelas I Bandung
