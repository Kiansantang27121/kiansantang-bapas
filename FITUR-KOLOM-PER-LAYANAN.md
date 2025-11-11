# 📊 FITUR KOLOM PER LAYANAN - DASHBOARD PETUGAS

## 🎯 Konsep Baru

Dashboard petugas layanan sekarang menggunakan **sistem kolom per layanan** dengan workflow yang berbeda untuk setiap jenis layanan.

---

## ✨ Fitur Utama

### 1. **Kolom Berdasarkan Layanan**
- Setiap layanan memiliki kolom sendiri
- Antrian dikelompokkan berdasarkan jenis layanan
- Tampilan grid responsif (1-4 kolom)

### 2. **Workflow Berbeda per Layanan**

#### 🔵 Bimbingan Wajib Lapor
- **Workflow**: Diteruskan ke PK
- **Proses**:
  1. Tampilkan nomor antrian, nama klien, nama PK
  2. Petugas pilih ruangan
  3. Klik "Teruskan ke PK"
  4. PK dipanggil dengan voice announcement
  5. Antrian masuk ke dashboard PK

#### 🟢 Penghadapan
- **Workflow**: Panggil Langsung
- **Proses**:
  1. Tampilkan nomor antrian, nama klien
  2. Klik "Panggil Antrian"
  3. Voice announcement memanggil klien ke loket
  4. Status berubah menjadi "called"

#### 🟣 Kunjungan
- **Workflow**: Panggil Langsung
- **Proses**: Sama dengan Penghadapan

#### 🔴 Pengaduan
- **Workflow**: Panggil Langsung
- **Proses**: Sama dengan Penghadapan

---

## 🎨 Tampilan Dashboard

### Layout Grid

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ BIMBINGAN   │ PENGHADAPAN │ KUNJUNGAN   │ PENGADUAN   │
│ WAJIB LAPOR │             │             │             │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ [3 antrian] │ [2 antrian] │ [1 antrian] │ [0 antrian] │
│             │             │             │             │
│ B001        │ P001        │ K001        │             │
│ Klien A     │ Klien D     │ Klien F     │ Tidak ada   │
│ PK: Budiana │             │             │ antrian     │
│ [Teruskan]  │ [Panggil]   │ [Panggil]   │             │
│             │             │             │             │
│ B002        │ P002        │             │             │
│ Klien B     │ Klien E     │             │             │
│ PK: Siti    │             │             │             │
│ [Teruskan]  │ [Panggil]   │             │             │
│             │             │             │             │
│ B003        │             │             │             │
│ Klien C     │             │             │             │
│ PK: Ahmad   │             │             │             │
│ [Teruskan]  │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Color Coding

| Layanan | Warna | Badge |
|---------|-------|-------|
| Bimbingan Wajib Lapor | 🔵 Biru | Blue |
| Penghadapan | 🟢 Hijau | Green |
| Kunjungan | 🟣 Ungu | Purple |
| Pengaduan | 🔴 Merah | Red |

---

## 🔄 Workflow Detail

### A. Bimbingan Wajib Lapor (→ PK)

```
┌─────────────────────┐
│ Antrian Masuk       │
│ B001 - Klien A      │
│ PK: Budiana (Madya) │
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
│ (Ruang 1, 2, 3...)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Klik "Panggil PK"   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Voice Announcement  │
│ "PK Budiana harap   │
│  ke Ruang 1..."     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ PK Masuk Dashboard  │
│ PK Layani Klien     │
└─────────────────────┘
```

### B. Layanan Lain (→ Direct Call)

```
┌─────────────────────┐
│ Antrian Masuk       │
│ P001 - Klien D      │
│ Layanan: Penghadapan│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Petugas Klik        │
│ "Panggil Antrian"   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Voice Announcement  │
│ "Nomor P001, Klien  │
│  D, ke loket..."    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Status: Called      │
│ Klien ke Loket      │
└─────────────────────┘
```

---

## 💻 Implementasi Teknis

### Frontend Component

**File**: `PetugasLayananDashboardNew2.jsx`

**Fitur**:
1. Fetch services dari API
2. Fetch queues dan group by service_id
3. Render grid kolom per layanan
4. Handle workflow berbeda per layanan
5. Voice announcement

**State Management**:
```javascript
const [services, setServices] = useState([])
const [queuesByService, setQueuesByService] = useState({})
const [rooms, setRooms] = useState([])
const [selectedQueue, setSelectedQueue] = useState(null)
const [selectedRoom, setSelectedRoom] = useState('')
```

**Workflow Detection**:
```javascript
const getServiceWorkflow = (serviceName) => {
  if (serviceName.includes('BIMBINGAN WAJIB LAPOR')) return 'pk'
  return 'direct'
}
```

### Backend Endpoints

**Existing**:
- `GET /api/services` - List semua layanan
- `GET /api/workflow/pending-queues` - Antrian waiting
- `POST /api/workflow/forward-to-pk` - Teruskan ke PK
- `POST /api/queue/:id/call` - Panggil antrian langsung

---

## 🎯 Keunggulan

### ✅ Lebih Terorganisir
- Antrian dikelompokkan per layanan
- Mudah melihat beban kerja per layanan
- Tidak tercampur antara layanan

### ✅ Workflow Jelas
- Setiap layanan punya alur yang jelas
- Bimbingan WL → PK
- Layanan lain → Direct call
- Tidak ada kebingungan

### ✅ Efisien
- Petugas langsung tahu harus apa
- Tombol sesuai dengan workflow
- Proses lebih cepat

### ✅ Visual Menarik
- Color coding per layanan
- Badge jumlah antrian
- Grid responsif

---

## 📱 Cara Penggunaan

### Login Petugas
```
URL: http://localhost:5176
Username: petugas
Password: petugas123
```

### Proses Kerja

#### 1. Lihat Dashboard
- Dashboard menampilkan kolom per layanan
- Setiap kolom menampilkan antrian layanan tersebut
- Badge menunjukkan jumlah antrian

#### 2. Untuk Bimbingan Wajib Lapor
a. Lihat antrian di kolom "Bimbingan Wajib Lapor"
b. Klik "Teruskan ke PK" pada antrian
c. Pilih ruangan dari dropdown
d. Klik "Panggil PK"
e. Voice announcement memanggil PK
f. Antrian masuk ke dashboard PK

#### 3. Untuk Layanan Lain
a. Lihat antrian di kolom layanan (Penghadapan, Kunjungan, dll)
b. Klik "Panggil Antrian"
c. Voice announcement memanggil klien
d. Status berubah menjadi "called"

---

## 🔊 Voice Announcement

### Format Panggil PK (Bimbingan WL)
```
"[Greeting], diberitahukan kepada Pembimbing Kemasyarakatan [Nama PK], 
ditunggu kehadirannya di [Ruangan] karena ada klien wajib lapor 
atas nama [Nama Klien]..."
```

### Format Panggil Klien (Layanan Lain)
```
"[Greeting], nomor antrian [Nomor], layanan [Layanan], 
atas nama [Nama Klien], silakan menuju loket pelayanan..."
```

---

## 🎨 Customization

### Tambah Layanan Baru

1. **Tambah di Database**
   ```sql
   INSERT INTO services (name, description, estimated_time) 
   VALUES ('Layanan Baru', 'Deskripsi', 30)
   ```

2. **Update Color Coding** (opsional)
   ```javascript
   const getServiceColor = (serviceName) => {
     if (serviceName.includes('LAYANAN BARU')) return 'orange'
     // ...
   }
   ```

3. **Update Workflow** (jika perlu)
   ```javascript
   const getServiceWorkflow = (serviceName) => {
     if (serviceName.includes('LAYANAN BARU')) return 'custom'
     // ...
   }
   ```

---

## 📊 Monitoring

### Statistik per Layanan
- Jumlah antrian ditampilkan di badge
- Update real-time setiap 5 detik
- Mudah melihat layanan yang paling sibuk

### Performance
- Grid responsif: 1-4 kolom tergantung ukuran layar
- Scroll per kolom jika antrian banyak
- Max height 600px per kolom

---

## 🆘 Troubleshooting

### Kolom tidak muncul?
- Pastikan ada layanan di database
- Cek endpoint `/api/services`
- Refresh halaman

### Antrian tidak muncul di kolom?
- Pastikan `service_id` di queue sesuai
- Cek endpoint `/api/workflow/pending-queues`
- Pastikan status = 'waiting'

### Voice tidak berbunyi?
- Cek pengaturan voice di settings
- Pastikan browser support Web Speech API
- Cek volume speaker

---

## ✅ Checklist Implementasi

- [x] Buat component dashboard baru
- [x] Group queues by service
- [x] Render grid kolom per layanan
- [x] Implement workflow detection
- [x] Handle forward to PK
- [x] Handle direct call
- [x] Voice announcement
- [x] Color coding
- [x] Responsive design
- [x] Update routing
- [x] Dokumentasi lengkap

---

**Update**: 9 November 2025 23:55  
**Versi**: 3.0 - Service Column Layout  
**Sistem**: KIANSANTANG - BAPAS Kelas I Bandung
