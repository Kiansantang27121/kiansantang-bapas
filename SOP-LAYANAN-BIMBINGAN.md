# 📋 SOP Layanan Bimbingan Wajib Lapor

## 📋 Overview

Sistem proses layanan lengkap di akun PK sesuai SOP bimbingan wajib lapor, mencakup:
- ✅ 5 Template Pertanyaan Wajib
- ✅ Foto Dokumentasi
- ✅ Survey Kepuasan (3 Emoticon)
- ✅ Laporan Harian
- ✅ Database Bukti Wajib Lapor

---

## 🎯 Features

### **1. 5 Template Pertanyaan Wajib (SOP)**

**Pertanyaan 1: Kondisi Saat Ini**
- Kesehatan fisik
- Kesehatan mental
- Kondisi emosional

**Pertanyaan 2: Kegiatan/Pekerjaan**
- Pekerjaan saat ini
- Pendidikan
- Aktivitas sehari-hari

**Pertanyaan 3: Lingkungan Sosial**
- Hubungan keluarga
- Pertemanan
- Lingkungan tetangga
- Interaksi masyarakat

**Pertanyaan 4: Kendala yang Dihadapi**
- Masalah pribadi
- Hambatan pekerjaan
- Kesulitan sosial

**Pertanyaan 5: Rencana Ke Depan**
- Target jangka pendek
- Tujuan jangka panjang
- Harapan untuk masa depan

---

### **2. Dokumentasi Foto**
- ✅ Akses kamera langsung dari browser
- ✅ Multiple photos (unlimited)
- ✅ Timestamp otomatis
- ✅ Preview & delete
- ✅ Catatan tambahan (optional)

---

### **3. Survey Kepuasan**

**3 Emoticon:**
- 😞 **Tidak Puas** (Rating: 1)
- 😐 **Cukup** (Rating: 2)
- 😊 **Sangat Puas** (Rating: 3)

**Feedback:**
- Saran atau masukan (optional)
- Text area untuk detail

---

### **4. Laporan Harian**
- ✅ Otomatis tersimpan per hari
- ✅ Statistics dashboard
- ✅ Export to CSV
- ✅ Detail view per layanan
- ✅ Filter by date

---

### **5. Database Bukti Wajib Lapor**
- ✅ Tersimpan di `service_reports` table
- ✅ Linked ke klien (`clients` table)
- ✅ Linked ke PK (`pk` table)
- ✅ Photos di `service_photos` table
- ✅ Permanent record

---

## 🔄 Workflow

### **Complete Flow:**

```
1. Klien Registrasi
   ↓
2. Petugas Assign ke PK
   ↓
3. PK Approve
   ↓
4. Petugas Panggil PK Masuk
   ↓
5. PK Konfirmasi Masuk
   ↓
6. PK Panggil Klien
   ↓
7. PK Klik "Mulai Layanan (SOP)" ✨
   ↓
8. Step 1: Isi 5 Pertanyaan Wajib
   ↓
9. Step 2: Ambil Foto Dokumentasi
   ↓
10. Step 3: Klien Isi Survey Kepuasan
   ↓
11. Step 4: Review & Selesai
   ↓
12. Data Tersimpan di Database
   ↓
13. Laporan Harian Otomatis
```

---

## 🎨 UI Design

### **Step 1: Pertanyaan Wajib**

```
┌─────────────────────────────────────────────────────┐
│ Proses Layanan Bimbingan                            │
│ B001 - ACENG ROHMAT BIN ALM MUHTAR - Ruang 1       │
├─────────────────────────────────────────────────────┤
│ [1]━━━━[2]━━━━[3]━━━━[4]                           │
│ Pertanyaan Wajib (SOP)                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 👤 1. Bagaimana kondisi Anda saat ini?             │
│ ┌─────────────────────────────────────────────────┐│
│ │ [Textarea]                                      ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ 💼 2. Apa kegiatan/pekerjaan Anda saat ini?        │
│ ┌─────────────────────────────────────────────────┐│
│ │ [Textarea]                                      ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ 👥 3. Bagaimana lingkungan sosial Anda?            │
│ 👥 4. Apa kendala yang Anda hadapi?                │
│ 📍 5. Apa rencana Anda ke depan?                   │
│                                                     │
│ [Simpan Progress] [Selanjutnya →]                  │
└─────────────────────────────────────────────────────┘
```

---

### **Step 2: Dokumentasi Foto**

```
┌─────────────────────────────────────────────────────┐
│ [1]━━━━[2]━━━━[3]━━━━[4]                           │
│ Dokumentasi Foto                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📷 Foto Dokumentasi                                 │
│ ┌─────────────────────────────────────────────────┐│
│ │ [Video Preview]                                 ││
│ │                                                 ││
│ └─────────────────────────────────────────────────┘│
│ [📸 Ambil Foto] [Tutup Kamera]                     │
│                                                     │
│ Foto Tersimpan (2):                                 │
│ ┌──────────┐ ┌──────────┐                         │
│ │ [Foto 1] │ │ [Foto 2] │                         │
│ │   [✕]    │ │   [✕]    │                         │
│ └──────────┘ └──────────┘                         │
│                                                     │
│ Catatan Tambahan (Opsional):                       │
│ ┌─────────────────────────────────────────────────┐│
│ │ [Textarea]                                      ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ [← Sebelumnya] [Simpan] [Selanjutnya →]            │
└─────────────────────────────────────────────────────┘
```

---

### **Step 3: Survey Kepuasan**

```
┌─────────────────────────────────────────────────────┐
│ [1]━━━━[2]━━━━[3]━━━━[4]                           │
│ Survey Kepuasan                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Bagaimana kepuasan Anda terhadap pelayanan         │
│ hari ini?                                           │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │    😞    │  │    😐    │  │    😊    │         │
│  │          │  │          │  │          │         │
│  │ Tidak    │  │  Cukup   │  │  Sangat  │         │
│  │  Puas    │  │          │  │   Puas   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                     │
│ Saran atau Masukan (Opsional):                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ [Textarea]                                      ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ [← Sebelumnya] [Simpan] [Selanjutnya →]            │
└─────────────────────────────────────────────────────┘
```

---

### **Step 4: Ringkasan**

```
┌─────────────────────────────────────────────────────┐
│ [1]━━━━[2]━━━━[3]━━━━[4]                           │
│ Ringkasan & Selesai                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ✅ Ringkasan Layanan                                │
│                                                     │
│ Pertanyaan Wajib:                                   │
│ ├─ Kondisi Saat Ini: [Text...]                     │
│ ├─ Kegiatan/Pekerjaan: [Text...]                   │
│ ├─ Lingkungan Sosial: [Text...]                    │
│ ├─ Kendala: [Text...]                              │
│ └─ Rencana Ke Depan: [Text...]                     │
│                                                     │
│ Dokumentasi: 2 foto tersimpan                       │
│ Kepuasan Klien: 😊 Sangat Puas                     │
│                                                     │
│ ℹ️ Data akan tersimpan di database klien dan PK    │
│ ℹ️ Laporan harian akan otomatis dibuat             │
│                                                     │
│ [← Sebelumnya] [Simpan] [✓ Selesai & Kirim]        │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### **service_reports Table:**

```sql
CREATE TABLE service_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  queue_id INTEGER NOT NULL,
  queue_number TEXT NOT NULL,
  client_nik TEXT,
  client_name TEXT NOT NULL,
  pk_id INTEGER NOT NULL,
  pk_name TEXT NOT NULL,
  service_date DATE NOT NULL,
  room_number INTEGER,
  
  -- 5 Pertanyaan Wajib
  question1 TEXT NOT NULL,
  question2 TEXT NOT NULL,
  question3 TEXT NOT NULL,
  question4 TEXT NOT NULL,
  question5 TEXT NOT NULL,
  
  -- Dokumentasi
  photos_count INTEGER DEFAULT 0,
  notes TEXT,
  
  -- Survey Kepuasan
  satisfaction INTEGER NOT NULL, -- 1, 2, 3
  feedback TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

### **service_photos Table:**

```sql
CREATE TABLE service_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  queue_id INTEGER NOT NULL,
  photo_data TEXT NOT NULL, -- Base64
  photo_order INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

### **queue Table (Updated):**

```sql
ALTER TABLE queue ADD COLUMN service_data TEXT;
ALTER TABLE queue ADD COLUMN service_step INTEGER DEFAULT 1;
```

---

### **clients Table (Updated):**

```sql
ALTER TABLE clients ADD COLUMN last_service_date DATETIME;
```

---

## 🔧 Implementation

### **Frontend Components:**

**1. PKServiceProcess.jsx**
- Main service process component
- 4-step wizard
- Camera integration
- Form validation
- Auto-save progress

**2. PKDailyReport.jsx**
- Daily report dashboard
- Statistics cards
- Export to CSV
- Detail view
- Date filter

**3. PKWorkflowDashboard.jsx (Updated)**
- Added "Mulai Layanan (SOP)" button
- Navigate to service process

---

### **Backend Endpoints:**

**File:** `backend/routes/service-process.js`

**Endpoints:**

```javascript
GET  /service/active-service      // Get active queue for PK
POST /service/save-service-progress // Save progress
POST /service/complete-service    // Complete & save
GET  /service/daily-report        // Get daily report
GET  /service/report/:id          // Get report detail
GET  /service/client-history/:nik // Get client history
```

---

### **Migration:**

**File:** `backend/migrations/add-service-process-tables.js`

**Run:**
```bash
cd backend
node migrations/add-service-process-tables.js
```

**Creates:**
- ✅ `service_reports` table
- ✅ `service_photos` table
- ✅ Updates `queue` table
- ✅ Updates `clients` table
- ✅ Creates indexes

---

## 🧪 Testing

### **Step 1: Run Migration**

```bash
cd backend
node migrations/add-service-process-tables.js
```

**Expected Output:**
```
✅ service_reports table created
✅ service_photos table created
✅ queue table updated
✅ clients table updated
```

---

### **Step 2: Start Servers**

```bash
# Backend
cd backend
npm run dev

# Petugas App
cd petugas-app
npm run dev
```

---

### **Step 3: Test Workflow**

```
1. Login as Petugas Layanan
2. Assign queue to PK
3. Call PK to room

4. Login as PK (Budiana)
5. Approve assignment
6. Confirm entry to room
7. Call client
8. Click "Mulai Layanan (SOP)" ✨

9. Fill 5 questions
10. Take photos (min 1)
11. Client selects satisfaction
12. Review & complete

13. Check daily report
14. Verify database
```

---

## 📈 Laporan Harian

### **Dashboard:**

```
┌─────────────────────────────────────────────────────┐
│ Laporan Harian Pelayanan                            │
│ PK: Budiana                                         │
├─────────────────────────────────────────────────────┤
│ [📅 2025-11-09] [Download CSV]                      │
├─────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │ Total: 5 │ │ 😊: 3    │ │ 😐: 1    │ │ Avg: 2.6 ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
├─────────────────────────────────────────────────────┤
│ Daftar Layanan (5):                                 │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ [B001] ACENG ROHMAT  14:30  😊 Sangat Puas  [▼]││
│ └─────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────┐│
│ │ [B002] ALI NUROHMAN  15:00  😐 Cukup        [▼]││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

---

### **Statistics:**

```javascript
{
  total: 5,           // Total layanan hari ini
  satisfied: 3,       // Sangat puas (😊)
  neutral: 1,         // Cukup (😐)
  unsatisfied: 1,     // Tidak puas (😞)
  avg_satisfaction: 2.6 // Rata-rata
}
```

---

### **Export CSV:**

```csv
No,Nomor Antrian,Nama Klien,Waktu,Kepuasan,Feedback
1,B001,ACENG ROHMAT BIN ALM MUHTAR,14:30:00,Sangat Puas,"Pelayanan bagus"
2,B002,ALI NUROHMAN BIN AGUS,15:00:00,Cukup,"-"
```

---

## 📋 Files Created/Modified

### **Frontend (Petugas App):**
1. ✅ `petugas-app/src/pages/PKServiceProcess.jsx` - Main service process (NEW)
2. ✅ `petugas-app/src/pages/PKDailyReport.jsx` - Daily report (NEW)
3. ✅ `petugas-app/src/pages/PKWorkflowDashboard.jsx` - Added button (MODIFIED)
4. ✅ `petugas-app/src/App.jsx` - Added routes (MODIFIED)

### **Backend:**
1. ✅ `backend/routes/service-process.js` - Service endpoints (NEW)
2. ✅ `backend/migrations/add-service-process-tables.js` - Migration (NEW)
3. ✅ `backend/server.js` - Register route (MODIFIED)

### **Documentation:**
1. ✅ `SOP-LAYANAN-BIMBINGAN.md` - This file (NEW)

---

## 🎯 Benefits

### **For PK:**
- ✅ Structured SOP process
- ✅ Easy documentation
- ✅ Auto-save progress
- ✅ Clear workflow
- ✅ Daily report ready

### **For Klien:**
- ✅ Professional service
- ✅ Voice heard (survey)
- ✅ Documented properly
- ✅ Proof of attendance

### **For Management:**
- ✅ Complete records
- ✅ Performance metrics
- ✅ Client satisfaction data
- ✅ Audit trail
- ✅ Export reports

### **For System:**
- ✅ Database integrity
- ✅ Permanent records
- ✅ Linked data (client, PK, queue)
- ✅ Historical data
- ✅ Analytics ready

---

## 🎉 Status

**✅ SOP LAYANAN BIMBINGAN - COMPLETE!**

**Features:**
- ✅ 5 Template Pertanyaan Wajib
- ✅ Foto Dokumentasi (Camera Integration)
- ✅ Survey Kepuasan (3 Emoticon)
- ✅ Laporan Harian Otomatis
- ✅ Database Bukti Wajib Lapor
- ✅ Export CSV
- ✅ Client History
- ✅ PK Performance Tracking

**Workflow:**
- ✅ 4-Step Wizard
- ✅ Auto-save Progress
- ✅ Form Validation
- ✅ Real-time Preview
- ✅ Complete & Submit

**Database:**
- ✅ service_reports table
- ✅ service_photos table
- ✅ Linked to clients
- ✅ Linked to PK
- ✅ Permanent records

**Reports:**
- ✅ Daily statistics
- ✅ Detail view
- ✅ Export CSV
- ✅ Date filter
- ✅ Performance metrics

**Sistem SOP Layanan Bimbingan Wajib Lapor lengkap dan siap digunakan!** 📋✨

---

**Last Updated:** November 9, 2025 - 23:30 WIB
