# 👨‍💼 Dashboard Petugas Layanan - Workflow Management

## 🎯 Overview

Dashboard Petugas Layanan telah diupdate dengan fitur workflow management lengkap untuk mengelola antrian Bimbingan Wajib Lapor dengan sistem assignment PK dan panggilan otomatis.

---

## ✨ Fitur Baru

### **1. Antrian Perlu Assignment PK**

**Informasi yang Ditampilkan:**
- ✅ **Nomor Antrian** (contoh: A001, B002)
- ✅ **Nama Klien** (nama lengkap pengguna layanan)
- ✅ **Nama Layanan** (Bimbingan Wajib Lapor)
- ✅ **Estimasi Waktu** (~30 menit)
- ✅ **Nama PK** (jika sudah pernah di-assign)

**Tombol Aksi:**
- 🔵 **Teruskan ke PK** - Assign antrian ke PK tertentu

**Workflow:**
1. Petugas melihat antrian baru masuk
2. Klik tombol "Teruskan ke PK"
3. Pilih PK dari dropdown
4. Tambahkan catatan (opsional)
5. Klik "✓ Teruskan ke PK"
6. Notifikasi dikirim ke PK yang dipilih

---

### **2. Antrian Siap Dipanggil**

**Informasi yang Ditampilkan:**
- ✅ **Nomor Antrian**
- ✅ **Nama Klien**
- ✅ **Nama Layanan**
- ✅ **Nama PK yang Menyetujui**

**Tombol Aksi:**
- 🟢 **Panggil** (dengan animasi pulse) - Panggil antrian dengan suara

**Workflow:**
1. Antrian muncul setelah PK menyetujui
2. Petugas klik tombol "Panggil"
3. Input nomor loket
4. Sistem trigger panggilan suara otomatis
5. Status antrian berubah menjadi "called"

---

## 🔄 Alur Lengkap

### **Skenario 1: Assignment ke PK**

```
1. Klien mendaftar → Antrian dibuat
   ↓
2. Muncul di "Antrian Perlu Assignment PK"
   ↓
3. Petugas klik "Teruskan ke PK"
   ↓
4. Pilih PK (contoh: Budi Santoso)
   ↓
5. Tambah catatan: "Klien baru, perlu perhatian khusus"
   ↓
6. Klik "✓ Teruskan ke PK"
   ↓
7. Notifikasi dikirim ke PK Budi Santoso
   ↓
8. Antrian hilang dari dashboard petugas
   ↓
9. Muncul di dashboard PK Budi Santoso
```

### **Skenario 2: Panggilan Antrian**

```
1. PK menyetujui antrian
   ↓
2. Muncul di "Antrian Siap Dipanggil"
   ↓
3. Petugas klik "Panggil"
   ↓
4. Input nomor loket: "1"
   ↓
5. Sistem berbicara: "Nomor antrian A001, silakan menuju loket 1"
   ↓
6. Status antrian: "called"
   ↓
7. Klien datang ke loket 1
```

---

## 📊 Tampilan Dashboard

### **Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Selamat Datang, [Nama Petugas]! 👋                     │
│  Dashboard Petugas Layanan                              │
└─────────────────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┐
│ Total    │ Menunggu │ Dilayani │ Selesai  │
│ Antrian  │          │          │          │
│   0      │    0     │    0     │    0     │
└──────────┴──────────┴──────────┴──────────┘

┌─────────────────────────────────────────────────────────┐
│ 👥 Antrian Perlu Assignment PK                    [5]   │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [A001]  👤 Abdul Rahman                             │ │
│ │         Layanan: Bimbingan Wajib Lapor              │ │
│ │         Estimasi: ~30 menit                         │ │
│ │                           [→ Teruskan ke PK]        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [A002]  👤 Siti Nurhaliza                           │ │
│ │         Layanan: Bimbingan Wajib Lapor              │ │
│ │         Estimasi: ~30 menit                         │ │
│ │                           [→ Teruskan ke PK]        │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📞 Antrian Siap Dipanggil                         [3]   │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [A003]  👤 Budi Santoso                             │ │
│ │         Layanan: Bimbingan Wajib Lapor              │ │
│ │         ✓ Disetujui oleh: PK Ahmad                  │ │
│ │                                  [📞 Panggil]       │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Design

### **Antrian Perlu Assignment PK:**
- 🟠 **Warna:** Orange (border, background, badge)
- 📋 **Badge:** Jumlah antrian di pojok kanan atas
- 🔵 **Tombol:** Orange "Teruskan ke PK"
- 📝 **Modal:** Dropdown PK + Textarea catatan

### **Antrian Siap Dipanggil:**
- 🟢 **Warna:** Green (border, background, badge)
- 📋 **Badge:** Jumlah antrian di pojok kanan atas
- 🔵 **Tombol:** Green "Panggil" dengan animasi pulse
- ✅ **Info:** Nama PK yang menyetujui

### **Empty State:**
- 📋 **Icon:** ClipboardList besar (gray)
- 📝 **Text:** "Tidak Ada Antrian"
- 💬 **Subtitle:** "Semua antrian sudah diproses"

---

## 🔧 Technical Details

### **API Endpoints:**

```javascript
// Get pending queues (need PK assignment)
GET /api/workflow/pending-queues
Headers: { Authorization: 'Bearer [token]' }
Response: { queues: [...] }

// Assign to PK
POST /api/workflow/assign-to-pk
Headers: { Authorization: 'Bearer [token]' }
Body: {
  queue_id: number,
  pk_id: number,
  notes: string
}

// Get ready to call queues
GET /api/workflow/ready-to-call
Headers: { Authorization: 'Bearer [token]' }
Response: { queues: [...] }

// Call queue
POST /api/workflow/call-queue
Headers: { Authorization: 'Bearer [token]' }
Body: {
  workflow_id: number,
  counter_number: string
}

// Get PK list
GET /api/pk
Headers: { Authorization: 'Bearer [token]' }
Response: { pks: [...] }
```

### **Auto-Refresh:**
```javascript
// Refresh every 5 seconds
const interval = setInterval(fetchAllData, 5000)
```

### **Voice Announcement:**
```javascript
const speakQueueNumber = (queueNumber, counterNumber) => {
  if ('speechSynthesis' in window) {
    const text = `Nomor antrian ${queueNumber}, silakan menuju loket ${counterNumber}`
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'id-ID'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }
}
```

---

## 🎯 Use Cases

### **Use Case 1: Assign Antrian Baru**

**Actor:** Petugas Layanan

**Steps:**
1. Login ke dashboard petugas
2. Lihat "Antrian Perlu Assignment PK"
3. Klik "Teruskan ke PK" pada antrian A001
4. Pilih PK: "Ahmad Fauzi"
5. Tambah catatan: "Klien pertama kali"
6. Klik "✓ Teruskan ke PK"
7. Konfirmasi: "Berhasil assign ke PK"

**Result:**
- Antrian A001 dikirim ke PK Ahmad Fauzi
- Notifikasi muncul di dashboard PK Ahmad
- Antrian hilang dari dashboard petugas

---

### **Use Case 2: Panggil Antrian yang Disetujui**

**Actor:** Petugas Layanan

**Steps:**
1. Login ke dashboard petugas
2. Lihat "Antrian Siap Dipanggil"
3. Klik "Panggil" pada antrian A003
4. Input nomor loket: "2"
5. Klik OK
6. Dengar suara: "Nomor antrian A003, silakan menuju loket 2"

**Result:**
- Antrian A003 dipanggil
- Status berubah: "called"
- Klien menuju loket 2

---

## 📱 Responsive Design

### **Desktop (>1024px):**
- Full width cards
- Side-by-side layout untuk modal

### **Tablet (768px - 1024px):**
- Full width cards
- Stacked layout

### **Mobile (<768px):**
- Full width cards
- Compact buttons
- Vertical stack

---

## 🔔 Notifikasi

### **Ke PK:**
```
Judul: "Antrian Baru Ditugaskan"
Pesan: "Anda ditugaskan untuk menangani [Nama Klien] - 
       Bimbingan Wajib Lapor. Nomor antrian: [A001]"
```

### **Ke Petugas (setelah PK approve):**
```
Judul: "Antrian Disetujui PK"
Pesan: "[Nama Klien] ([A001]) telah disetujui oleh PK. 
       Siap dipanggil."
```

---

## ✅ Checklist Fitur

- [x] Tampilkan nomor antrian
- [x] Tampilkan nama klien
- [x] Tampilkan nama PK
- [x] Tombol "Teruskan ke PK"
- [x] Dropdown pilih PK
- [x] Textarea catatan
- [x] Tombol "Panggil"
- [x] Input nomor loket
- [x] Panggilan suara otomatis
- [x] Auto-refresh 5 detik
- [x] Notifikasi ke PK
- [x] Empty state
- [x] Responsive design

---

## 🎉 Summary

Dashboard Petugas Layanan sekarang memiliki:

1. ✅ **Informasi Lengkap** - Nomor antrian, nama klien, PK
2. ✅ **Tombol Teruskan ke PK** - Assign ke PK tertentu
3. ✅ **Tombol Panggil** - Panggil dengan suara otomatis
4. ✅ **Real-time Updates** - Auto-refresh setiap 5 detik
5. ✅ **Notifikasi** - Hanya ke PK yang dituju
6. ✅ **Voice Announcement** - Text-to-speech Indonesia
7. ✅ **Modern UI** - Clean, responsive, user-friendly

**Status:** ✅ **READY TO USE!** 🚀✨
