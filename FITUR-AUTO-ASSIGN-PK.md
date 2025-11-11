# 🎯 FITUR AUTO-ASSIGN PK & PEMANGGILAN OTOMATIS

## 📋 Deskripsi

Fitur baru yang memudahkan petugas layanan untuk meneruskan antrian ke PK dengan:
1. **Auto-assign PK** berdasarkan jabatan PK klien
2. **Pemanggilan otomatis** PK ke ruangan dengan voice announcement

---

## ✨ Fitur Utama

### 1. Auto-Assign PK Berdasarkan Jabatan

Sistem akan otomatis menentukan PK yang sesuai berdasarkan:
- **Jabatan PK klien** (APK, PK Madya, PK Muda, PK Pertama)
- Jika tidak ada PK dengan jabatan yang sama, sistem akan assign ke PK yang tersedia
- Petugas juga bisa memilih PK secara manual jika diperlukan

### 2. Tombol "Meneruskan & Panggil PK"

Satu tombol untuk:
- ✅ Assign antrian ke PK (otomatis berdasarkan jabatan)
- ✅ Memanggil PK ke ruangan yang dipilih
- ✅ Voice announcement otomatis
- ✅ Update status antrian

---

## 🚀 Cara Penggunaan

### Dashboard Petugas Layanan

1. **Login** sebagai Petugas Layanan
   ```
   Username: petugas
   Password: petugas123
   ```

2. **Lihat Antrian** di section "Antrian Perlu Assignment PK"

3. **Klik "Teruskan ke PK"** pada antrian yang ingin diproses

4. **Pilih Opsi**:
   - **Pilih PK**: Kosongkan untuk auto-assign berdasarkan jabatan, atau pilih manual
   - **Pilih Ruangan**: Wajib dipilih (contoh: Ruang 1, Ruang 2, dll)
   - **Catatan**: Opsional

5. **Klik "Meneruskan & Panggil PK"**
   - Sistem akan auto-assign PK jika belum ada
   - PK akan dipanggil ke ruangan yang dipilih
   - Voice announcement akan berbunyi
   - Status antrian akan diupdate

---

## 🔧 Endpoint API Baru

### 1. Auto-Assign PK
```
POST /api/workflow/auto-assign-pk
Body: { queue_id: number }
```

**Logika**:
1. Cek apakah antrian sudah punya PK dari klien
2. Jika tidak, cari PK dengan jabatan yang sama dengan PK klien
3. Jika tidak ada, assign ke PK yang tersedia
4. Update antrian dengan PK yang dipilih

### 2. Forward to PK (Meneruskan & Panggil)
```
POST /api/workflow/forward-to-pk
Body: { 
  queue_id: number, 
  room_number: string 
}
```

**Proses**:
1. Auto-assign PK (jika belum ada)
2. Assign ruangan
3. Update status `pk_called_at`
4. Reserve ruangan untuk PK
5. Emit socket event untuk display
6. Return data untuk voice announcement

---

## 📊 Alur Kerja

```
┌─────────────────────┐
│ Klien Mendaftar     │
│ (Bimbingan WL)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Antrian Masuk       │
│ Status: waiting     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Petugas Klik        │
│ "Teruskan ke PK"    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Pilih Ruangan       │
│ (PK Auto/Manual)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Klik "Meneruskan &  │
│ Panggil PK"         │
└──────────┬──────────┘
           │
           ├─────────────────────┐
           │                     │
           ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐
│ Auto-Assign PK      │  │ Assign Ruangan      │
│ (Berdasarkan        │  │ Reserve untuk PK    │
│  Jabatan)           │  │                     │
└──────────┬──────────┘  └──────────┬──────────┘
           │                        │
           └────────┬───────────────┘
                    │
                    ▼
           ┌─────────────────────┐
           │ Voice Announcement  │
           │ "PK [Nama] harap    │
           │  ke Ruang [X]"      │
           └──────────┬──────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │ PK Masuk Ruangan    │
           │ Klien Dipanggil     │
           └─────────────────────┘
```

---

## 🎯 Kategori PK (Jabatan)

| Jabatan | Keterangan |
|---------|------------|
| **APK** | Ahli Pembimbing Kemasyarakatan |
| **PK Madya** | Pembimbing Kemasyarakatan Madya |
| **PK Muda** | Pembimbing Kemasyarakatan Muda |
| **PK Pertama** | Pembimbing Kemasyarakatan Pertama |

---

## 🔊 Voice Announcement

Format pemanggilan PK:
```
"[Greeting], diberitahukan kepada Pembimbing Kemasyarakatan [Nama PK], 
ditunggu kehadirannya di [Nama Ruangan] karena ada klien wajib lapor 
atas nama [Nama Klien]. Sekali lagi, diberitahukan kepada Pembimbing 
Kemasyarakatan [Nama PK], ditunggu kehadirannya di [Nama Ruangan] 
karena ada klien wajib lapor atas nama [Nama Klien]. 
Atas perhatiannya diucapkan terima kasih."
```

**Greeting** berdasarkan waktu:
- 08:00 - 12:00: "Selamat pagi"
- 12:00 - 16:00: "Selamat siang"
- 16:00 - 18:00: "Selamat sore"
- 18:00 - 08:00: "Selamat malam"

---

## 💡 Keunggulan Fitur

### ✅ Efisiensi
- Tidak perlu manual pilih PK satu per satu
- Sistem otomatis assign berdasarkan jabatan
- Satu klik untuk assign dan panggil

### ✅ Akurasi
- PK yang dipanggil sesuai dengan jabatan klien
- Mengurangi kesalahan assign PK
- Tracking lengkap di database

### ✅ Kecepatan
- Proses lebih cepat dengan auto-assign
- Voice announcement otomatis
- Real-time update ke display

### ✅ Fleksibilitas
- Bisa auto-assign atau manual
- Bisa pilih ruangan yang tersedia
- Bisa tambah catatan jika perlu

---

## 🔒 Keamanan & Validasi

1. **Autentikasi**: Hanya petugas layanan yang bisa akses
2. **Validasi Ruangan**: Cek ketersediaan ruangan sebelum assign
3. **Validasi PK**: Cek keberadaan PK di database
4. **Logging**: Semua aksi tercatat di console log

---

## 📝 Catatan Penting

1. **Jabatan PK** harus sudah diisi di database PK
2. **Ruangan** harus tersedia (is_available = 1)
3. **Voice announcement** memerlukan browser yang support Web Speech API
4. **Socket.IO** harus aktif untuk real-time update ke display

---

## 🆘 Troubleshooting

### PK tidak ter-assign otomatis?
- Pastikan klien sudah punya PK di database
- Pastikan PK punya jabatan yang terisi
- Cek apakah ada PK dengan jabatan yang sama

### Voice announcement tidak berbunyi?
- Cek pengaturan voice di settings
- Pastikan browser support Web Speech API
- Cek volume speaker

### Ruangan tidak muncul?
- Pastikan ada ruangan dengan is_available = 1
- Cek tabel `rooms` di database

---

**Dibuat**: 9 November 2025  
**Sistem**: KIANSANTANG - Kios Antrian Santun dan Tanggap  
**Instansi**: BAPAS Kelas I Bandung
