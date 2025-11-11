# 🏢 SISTEM RUANG PELAYANAN MULTI-PK

## 📋 Overview

Sistem telah diubah dari **Loket** menjadi **Ruang Pelayanan Multi-PK** dengan 2 jenis pemanggilan suara:
1. **Panggilan PK** - Memanggil PK untuk masuk ke ruang pelayanan
2. **Panggilan Klien** - Memanggil klien untuk masuk ke ruang pelayanan (setelah PK masuk)

---

## 🔄 Perubahan Sistem

### **Sebelum (Sistem Loket):**
```
❌ Loket tetap (Loket 1, 2, 3, dst)
❌ 1 loket = 1 PK
❌ Klien langsung dipanggil ke loket
❌ Tidak ada konfirmasi PK masuk
```

### **Setelah (Sistem Ruang Pelayanan):**
```
✅ Ruang pelayanan multi-PK (Ruang 1, 2, 3, 4, 5)
✅ 1 ruang dapat digunakan oleh semua PK
✅ 2 tahap pemanggilan (PK dulu, baru klien)
✅ PK konfirmasi masuk ruangan
✅ Ruang otomatis available setelah selesai
```

---

## 🗄️ Database Changes

### **1. Tabel `queue` - Kolom Baru:**
```sql
room_number INTEGER          -- Nomor ruang pelayanan (1-5)
pk_called_at DATETIME        -- Waktu PK dipanggil masuk ruangan
pk_entered_at DATETIME       -- Waktu PK konfirmasi masuk ruangan
client_called_at DATETIME    -- Waktu klien dipanggil masuk ruangan
```

### **2. Tabel `rooms` - Baru:**
```sql
CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_number INTEGER UNIQUE NOT NULL,
  room_name TEXT NOT NULL,
  is_available BOOLEAN DEFAULT 1,
  current_pk_id INTEGER,
  current_queue_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (current_pk_id) REFERENCES users(id),
  FOREIGN KEY (current_queue_id) REFERENCES queue(id)
);
```

**Default Rooms:**
- Ruang Pelayanan 1
- Ruang Pelayanan 2
- Ruang Pelayanan 3
- Ruang Pelayanan 4
- Ruang Pelayanan 5

---

## 🔄 Workflow Lengkap

### **Step 1: Klien Mendaftar**
```
Registration App → Queue created
Status: waiting
pk_id: NULL
room_number: NULL
```

### **Step 2: Petugas Assign ke PK**
```
Petugas Dashboard → "Teruskan ke PK" → Select PK
↓
Queue updated:
  pk_id: [selected_pk_id]
  status: waiting
```

### **Step 3: PK Approve**
```
PK Dashboard → View assignment → "Terima"
↓
Queue updated:
  status: waiting (ready for call)
  accepted_at: CURRENT_TIMESTAMP
```

### **Step 4: Petugas Panggil PK Masuk Ruangan** ⭐ NEW
```
Petugas Dashboard → "Panggil PK" → Select Room
↓
Voice: "[Nama PK], silakan menuju Ruang Pelayanan [X], untuk antrian nomor [XXX]"
↓
Queue updated:
  room_number: [selected_room]
  pk_called_at: CURRENT_TIMESTAMP
↓
Room updated:
  is_available: 0
  current_pk_id: [pk_id]
  current_queue_id: [queue_id]
```

### **Step 5: PK Konfirmasi Masuk Ruangan** ⭐ NEW
```
PK Dashboard → Notifikasi "Anda Dipanggil Masuk Ruangan!"
↓
PK clicks "Konfirmasi Masuk"
↓
Queue updated:
  pk_entered_at: CURRENT_TIMESTAMP
```

### **Step 6: Petugas Panggil Klien Masuk Ruangan** ⭐ NEW
```
Petugas Dashboard → "Panggil Klien"
↓
Voice: "Nomor antrian [XXX], [Nama Klien], silakan menuju Ruang Pelayanan [X]"
↓
Queue updated:
  client_called_at: CURRENT_TIMESTAMP
  status: called
```

### **Step 7: Selesai**
```
Queue updated:
  status: completed
  completed_at: CURRENT_TIMESTAMP
↓
Room updated:
  is_available: 1
  current_pk_id: NULL
  current_queue_id: NULL
```

---

## 🎯 API Endpoints Baru

### **1. Get Available Rooms**
```http
GET /api/workflow/available-rooms
Authorization: Bearer [token]
Role: petugas_layanan, admin

Response:
{
  "success": true,
  "rooms": [
    {
      "id": 1,
      "room_number": 1,
      "room_name": "Ruang Pelayanan 1",
      "is_available": 1,
      "current_pk_id": null,
      "current_queue_id": null
    }
  ]
}
```

### **2. Call PK to Room (Panggilan 1)**
```http
POST /api/workflow/call-pk
Authorization: Bearer [token]
Role: petugas_layanan, admin

Body:
{
  "queue_id": 1,
  "room_number": 1
}

Response:
{
  "success": true,
  "message": "PK called to room successfully",
  "call_data": {
    "type": "pk",
    "pk_name": "Budiana",
    "room_number": 1,
    "queue_number": "A001"
  }
}
```

### **3. PK Confirm Entry**
```http
POST /api/workflow/pk-enter-room
Authorization: Bearer [token]
Role: pk

Body:
{
  "queue_id": 1
}

Response:
{
  "success": true,
  "message": "PK entered room successfully",
  "room_number": 1
}
```

### **4. Call Client to Room (Panggilan 2)**
```http
POST /api/workflow/call-client
Authorization: Bearer [token]
Role: petugas_layanan, admin

Body:
{
  "queue_id": 1
}

Response:
{
  "success": true,
  "message": "Client called to room successfully",
  "call_data": {
    "type": "client",
    "queue_number": "A001",
    "client_name": "Abdul Rahman",
    "room_number": 1,
    "pk_name": "Budiana"
  }
}
```

---

## 📱 Frontend Changes

### **Petugas Layanan Dashboard:**

#### **Stats:**
- ✅ Perlu Assignment (orange)
- ✅ Panggil PK (blue)
- ✅ Panggil Klien (green)
- ✅ Ruang Tersedia (purple)

#### **Section 1: Antrian Perlu Assignment PK**
- Sama seperti sebelumnya
- Assign ke PK

#### **Section 2: Panggilan 1 - PK Masuk Ruangan** ⭐ NEW
- List antrian yang sudah approved PK
- Tombol "Panggil PK" (blue, animate-pulse)
- Dropdown pilih ruangan
- Voice: "[Nama PK], silakan menuju Ruang Pelayanan [X]..."

#### **Section 3: Panggilan 2 - Klien Masuk Ruangan** ⭐ NEW
- List antrian yang PK sudah masuk ruangan
- Tombol "Panggil Klien" (green, animate-pulse)
- Voice: "Nomor antrian [XXX], [Nama Klien], silakan menuju Ruang Pelayanan [X]"

---

### **PK Dashboard:**

#### **Stats:**
- ✅ Total Assignment
- ✅ Menunggu Aksi
- ✅ Dipanggil Masuk (blue) ⭐ NEW
- ✅ Disetujui

#### **Notifikasi Panggilan Ruangan** ⭐ NEW
- Muncul saat PK dipanggil masuk ruangan
- Background blue gradient, animate-pulse
- Menampilkan:
  - Nomor antrian
  - Nama klien
  - Nomor ruangan
- Tombol "Konfirmasi Masuk" (white button)

#### **Antrian Saya:**
- Sama seperti sebelumnya
- Terima/Tolak/Alihkan

---

## 🔊 Voice Announcements

### **Panggilan 1 (PK):**
```
Format: "[Nama PK], silakan menuju [Nama Ruangan], untuk antrian nomor [Nomor Antrian]"

Contoh:
"Budiana, silakan menuju Ruang Pelayanan 1, untuk antrian nomor A001"
```

### **Panggilan 2 (Klien):**
```
Format: "Nomor antrian [Nomor Antrian], [Nama Klien], silakan menuju [Nama Ruangan]"

Contoh:
"Nomor antrian A001, Abdul Rahman, silakan menuju Ruang Pelayanan 1"
```

**Voice Settings:**
- Language: `id-ID` (Indonesian)
- Rate: `0.9` (slightly slower for clarity)
- Pitch: `1` (normal)

---

## 📊 Status Tracking

### **Queue Status Flow:**
```
waiting (no PK)
  ↓ assign to PK
waiting (with PK, not approved)
  ↓ PK approve
waiting (approved, ready to call PK)
  ↓ call PK (pk_called_at set)
waiting (PK called, waiting entry)
  ↓ PK enter room (pk_entered_at set)
waiting (PK entered, ready to call client)
  ↓ call client (client_called_at set)
called (client called)
  ↓ service
serving
  ↓ complete
completed
```

### **Room Status Flow:**
```
is_available = 1 (available)
  ↓ PK called
is_available = 0 (occupied)
current_pk_id = [pk_id]
current_queue_id = [queue_id]
  ↓ service completed
is_available = 1 (available)
current_pk_id = NULL
current_queue_id = NULL
```

---

## 🎨 UI/UX Improvements

### **Color Coding:**
- 🟠 **Orange** - Perlu assignment
- 🔵 **Blue** - Panggil PK
- 🟢 **Green** - Panggil klien
- 🟣 **Purple** - Ruang tersedia
- 🔴 **Red** - Tolak/reject
- ⚪ **White** - Konfirmasi

### **Animations:**
- ✅ `animate-pulse` pada tombol panggil
- ✅ `animate-pulse` pada notifikasi PK
- ✅ Smooth transitions pada hover
- ✅ Loading spinner saat fetch data

### **Icons:**
- 📋 ClipboardList - Assignment
- 📞 Phone - Panggil PK
- 👤 User - Panggil klien
- 🏠 Home - Ruang pelayanan
- 🔔 Bell - Notifikasi
- 🚪 DoorOpen - Masuk ruangan

---

## 📝 Files Modified/Created

### **Backend:**
1. ✅ `backend/update-room-system.js` - Database migration script
2. ✅ `backend/routes/workflow-sqlite.js` - Added 4 new endpoints
3. ✅ `backend/database.js` - Auto-updated by migration

### **Frontend:**
1. ✅ `petugas-app/src/pages/PetugasLayananDashboard.jsx` - Complete rewrite
2. ✅ `petugas-app/src/pages/PKWorkflowDashboard.jsx` - Added notification & confirm

### **Documentation:**
1. ✅ `SISTEM-RUANG-PELAYANAN.md` - This file

---

## 🧪 Testing Checklist

### **Test 1: Database Migration**
```bash
cd backend
node update-room-system.js
```
Expected:
- ✅ Queue table updated with new columns
- ✅ Rooms table created with 5 rooms
- ✅ All existing queues preserved

### **Test 2: Petugas Workflow**
```
1. Login as petugas
2. Assign antrian ke PK
3. Wait for PK approval
4. Click "Panggil PK" → Select room
5. Hear voice: "[PK Name], silakan menuju..."
6. Wait for PK to enter
7. Click "Panggil Klien"
8. Hear voice: "Nomor antrian [XXX]..."
```

### **Test 3: PK Workflow**
```
1. Login as PK
2. Approve antrian
3. Wait for petugas to call
4. See notification "Anda Dipanggil Masuk Ruangan!"
5. Click "Konfirmasi Masuk"
6. Notification disappears
7. Petugas can now call client
```

### **Test 4: Room Management**
```
1. Check available rooms (should be 5)
2. Call PK to room 1
3. Room 1 becomes unavailable
4. Complete service
5. Room 1 becomes available again
```

---

## 🎯 Benefits

### **Flexibility:**
- ✅ Semua PK dapat menggunakan ruangan manapun
- ✅ Tidak ada pembatasan PK per ruangan
- ✅ Ruangan digunakan secara dinamis

### **Efficiency:**
- ✅ Ruangan tidak idle saat PK tertentu tidak ada
- ✅ Load balancing otomatis
- ✅ Maksimalkan penggunaan ruangan

### **Control:**
- ✅ 2 tahap pemanggilan untuk kontrol lebih baik
- ✅ PK konfirmasi masuk sebelum klien dipanggil
- ✅ Tracking lengkap waktu setiap tahap

### **User Experience:**
- ✅ Voice announcement jelas untuk PK dan klien
- ✅ Notifikasi real-time untuk PK
- ✅ UI intuitif dengan color coding
- ✅ Auto-refresh untuk data terbaru

---

## 🚀 Migration Steps

### **1. Backup Database**
```bash
cd backend
copy database.db database.backup.db
```

### **2. Run Migration**
```bash
node update-room-system.js
```

### **3. Restart Backend**
```bash
npm run dev
```

### **4. Refresh Frontend**
```
Ctrl + F5 di browser
```

### **5. Test Workflow**
- Login as petugas
- Test 2-step calling
- Login as PK
- Test room entry confirmation

---

## 📞 Support

### **Common Issues:**

#### **Issue: Rooms tidak muncul**
```bash
# Check rooms table
cd backend
node -e "import('./database.js').then(({default: db}) => {
  const rooms = db.prepare('SELECT * FROM rooms').all();
  console.log(rooms);
})"
```

#### **Issue: Voice tidak keluar**
- Check browser permissions (allow audio)
- Check volume settings
- Try different browser (Chrome recommended)

#### **Issue: PK tidak bisa konfirmasi masuk**
- Check pk_called_at is set
- Check queue assigned to correct PK
- Check token valid

---

## 🎉 Summary

### **Sistem Lama (Loket):**
- ❌ 1 loket = 1 PK
- ❌ 1 panggilan (klien langsung)
- ❌ Tidak fleksibel

### **Sistem Baru (Ruang Pelayanan):**
- ✅ Multi-PK per ruangan
- ✅ 2 panggilan (PK dulu, klien kemudian)
- ✅ Sangat fleksibel
- ✅ Tracking lengkap
- ✅ Voice announcement untuk kedua tahap
- ✅ Real-time notifications

**Status:** ✅ **SISTEM RUANG PELAYANAN READY!** 🏢✨

---

**Last Updated:** November 9, 2025 - 20:10 WIB
