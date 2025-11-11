# 📋 SISTEM WORKFLOW BIMBINGAN WAJIB LAPOR

## 🎯 Overview

Sistem workflow lengkap untuk mengelola antrian Bimbingan Wajib Lapor dengan approval PK dan panggilan otomatis.

---

## 🔄 Alur Workflow

### 1️⃣ **Pengguna Mendaftar**
- Pengguna layanan mendaftar melalui kiosk
- Sistem membuat tiket/nomor antrian
- Status: `waiting`

### 2️⃣ **Notifikasi ke Petugas**
- Antrian baru masuk ke dashboard petugas
- Petugas melihat:
  - Nomor antrian
  - Nama pengguna layanan
  - Layanan yang dipilih
  - Estimasi waktu

### 3️⃣ **Petugas Assign ke PK**
- Petugas memilih PK yang akan menangani
- Sistem mengirim notifikasi ke PK terpilih
- Status workflow: `assigned_to_pk`

### 4️⃣ **PK Menerima Notifikasi**
- PK melihat antrian yang ditugaskan
- Informasi yang ditampilkan:
  - Nomor antrian
  - Nama klien
  - Catatan dari petugas
  - Estimasi waktu

### 5️⃣ **PK Mengambil Keputusan**

#### ✅ **TERIMA**
- PK menyetujui antrian
- Status: `approved`
- Notifikasi kembali ke petugas
- Antrian masuk ke daftar "Siap Dipanggil"

#### ❌ **TOLAK**
- PK menolak dengan alasan
- Status: `rejected`
- Notifikasi kembali ke petugas dengan alasan
- Petugas dapat reassign ke PK lain

#### ↪️ **ALIHKAN**
- PK mengalihkan ke PK lain
- Pilih PK tujuan
- Berikan alasan pengalihan
- Status: `transferred`
- Notifikasi ke PK baru
- PK baru dapat: Terima / Tolak / Alihkan lagi

### 6️⃣ **Panggilan Otomatis**
- Petugas memanggil antrian yang sudah disetujui
- Input nomor loket
- Sistem trigger panggilan suara:
  - "Nomor antrian [NOMOR], silakan menuju loket [LOKET]"
- Status: `called`
- Queue status: `called`

### 7️⃣ **Selesai**
- Klien datang ke loket
- Layanan selesai
- Status: `completed`

---

## 📊 Database Schema

### Table: `queue_workflow`
```sql
- id (PK)
- queue_id (FK to queues)
- status (pending/assigned_to_pk/approved/rejected/transferred/called/completed)
- assigned_pk_id (FK to users)
- assigned_by (FK to users - petugas)
- assigned_at
- approved_at
- rejected_at
- rejection_reason
- called_at
- completed_at
- notes
- created_at
- updated_at
```

### Table: `queue_workflow_history`
```sql
- id (PK)
- workflow_id (FK)
- queue_id (FK)
- action (created/assigned/approved/rejected/transferred/called/completed)
- from_pk_id (FK)
- to_pk_id (FK)
- performed_by (FK)
- reason
- notes
- created_at
```

### Table: `notifications`
```sql
- id (PK)
- user_id (FK)
- type (queue_created/pk_assigned/pk_approved/pk_rejected/pk_transferred/queue_called)
- title
- message
- queue_id (FK)
- workflow_id (FK)
- is_read
- read_at
- created_at
```

---

## 🔌 API Endpoints

### **Petugas Endpoints**

#### 1. Get Pending Queues
```
GET /api/workflow/pending-queues
Auth: Required (admin, petugas)
Response: List of queues waiting for PK assignment
```

#### 2. Assign to PK
```
POST /api/workflow/assign-to-pk
Auth: Required (admin, petugas)
Body: {
  queue_id: number,
  pk_id: number,
  notes: string (optional)
}
```

#### 3. Get Ready to Call
```
GET /api/workflow/ready-to-call
Auth: Required (admin, petugas)
Response: List of approved queues ready to be called
```

#### 4. Call Queue
```
POST /api/workflow/call-queue
Auth: Required (admin, petugas)
Body: {
  workflow_id: number,
  counter_number: string
}
```

### **PK Endpoints**

#### 5. Get My Assignments
```
GET /api/workflow/my-assignments
Auth: Required (pk)
Response: List of queues assigned to logged-in PK
```

#### 6. PK Action (Approve/Reject/Transfer)
```
POST /api/workflow/pk-action
Auth: Required (pk)
Body: {
  workflow_id: number,
  action: 'approve' | 'reject' | 'transfer',
  reason: string (required for reject/transfer),
  transfer_to_pk_id: number (required for transfer)
}
```

### **Notification Endpoints**

#### 7. Get Notifications
```
GET /api/workflow/notifications?unread_only=true
Auth: Required
Response: List of notifications for logged-in user
```

#### 8. Mark as Read
```
PUT /api/workflow/notifications/:id/read
Auth: Required
```

#### 9. Get Workflow History
```
GET /api/workflow/history/:queue_id
Auth: Required
Response: Complete audit trail of queue workflow
```

---

## 🎨 React Components

### 1. **WorkflowNotifications.jsx** (Petugas)
**Location:** `petugas-app/src/components/WorkflowNotifications.jsx`

**Features:**
- Real-time notifications
- Pending queues list
- PK assignment interface
- Ready to call list
- Voice announcement trigger

**Usage:**
```jsx
import WorkflowNotifications from './components/WorkflowNotifications'

function PetugasDashboard() {
  return <WorkflowNotifications />
}
```

### 2. **PKApprovalDashboard.jsx** (PK)
**Location:** `petugas-app/src/components/PKApprovalDashboard.jsx`

**Features:**
- My assignments list
- Approve button
- Reject with reason
- Transfer to another PK
- Real-time updates

**Usage:**
```jsx
import PKApprovalDashboard from './components/PKApprovalDashboard'

function PKDashboard() {
  return <PKApprovalDashboard />
}
```

---

## 🔊 Voice Announcement System

### Text-to-Speech Implementation
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

### Browser Support
- ✅ Chrome
- ✅ Edge
- ✅ Firefox
- ✅ Safari

---

## 🚀 Setup Instructions

### 1. Run Database Migration
```bash
cd backend
mysql -u root -p kiansantang < migrations/009_create_queue_workflow.sql
```

### 2. Restart Backend
```bash
cd backend
npm start
```

### 3. Test Workflow
1. Buat antrian baru dari kiosk
2. Login sebagai petugas
3. Assign antrian ke PK
4. Login sebagai PK
5. Approve/Reject/Transfer
6. Panggil antrian (jika approved)

---

## 📱 User Roles & Permissions

### **Admin**
- ✅ View all queues
- ✅ Assign to PK
- ✅ Call queues
- ✅ View all notifications
- ✅ View workflow history

### **Petugas**
- ✅ View pending queues
- ✅ Assign to PK
- ✅ Call approved queues
- ✅ View notifications
- ✅ View workflow history

### **PK**
- ✅ View my assignments
- ✅ Approve queues
- ✅ Reject queues
- ✅ Transfer to other PK
- ✅ View notifications

### **User (Pengguna Layanan)**
- ✅ Register for queue
- ✅ View queue number
- ✅ Wait for call

---

## 🔔 Notification Types

| Type | Recipient | Trigger |
|------|-----------|---------|
| `queue_created` | Petugas | New queue registered |
| `pk_assigned` | PK | Assigned by petugas |
| `pk_approved` | Petugas | PK approved queue |
| `pk_rejected` | Petugas | PK rejected queue |
| `pk_transferred` | PK (new) | Transferred from another PK |
| `queue_called` | - | Queue called to counter |

---

## 📈 Workflow Status Flow

```
pending
  ↓
assigned_to_pk (Petugas assigns to PK)
  ↓
  ├─→ approved (PK approves) → called → completed
  ├─→ rejected (PK rejects) → [End or Reassign]
  └─→ transferred (PK transfers) → assigned_to_pk (to new PK)
```

---

## 🧪 Testing Scenarios

### Scenario 1: Happy Path
1. User registers → Queue created
2. Petugas assigns to PK A
3. PK A approves
4. Petugas calls queue
5. Service completed

### Scenario 2: Rejection
1. User registers → Queue created
2. Petugas assigns to PK A
3. PK A rejects with reason
4. Petugas reassigns to PK B
5. PK B approves
6. Petugas calls queue

### Scenario 3: Transfer Chain
1. User registers → Queue created
2. Petugas assigns to PK A
3. PK A transfers to PK B
4. PK B transfers to PK C
5. PK C approves
6. Petugas calls queue

---

## 🎯 Key Features

✅ **Real-time Notifications** - Socket.IO integration ready
✅ **Audit Trail** - Complete history tracking
✅ **Voice Announcement** - Browser-based TTS
✅ **Multi-level Approval** - Transfer chain support
✅ **Role-based Access** - Secure permissions
✅ **Auto-refresh** - 5-second polling
✅ **Responsive UI** - Mobile-friendly

---

## 🔧 Configuration

### Polling Interval
```javascript
// In components
const interval = setInterval(fetchData, 5000) // 5 seconds
```

### Voice Settings
```javascript
utterance.lang = 'id-ID'  // Indonesian
utterance.rate = 0.9       // Speed (0.1 - 10)
utterance.pitch = 1        // Pitch (0 - 2)
utterance.volume = 1       // Volume (0 - 1)
```

---

## 📞 Support

For issues or questions:
- Check workflow history: `/api/workflow/history/:queue_id`
- Check notifications: `/api/workflow/notifications`
- Review database logs in `queue_workflow_history`

---

## 🎉 Summary

Sistem workflow ini menyediakan:
1. ✅ Pendaftaran otomatis dengan tiket
2. ✅ Notifikasi real-time ke petugas
3. ✅ Assignment ke PK
4. ✅ Approval/Rejection/Transfer oleh PK
5. ✅ Panggilan otomatis dengan suara
6. ✅ Audit trail lengkap
7. ✅ UI yang user-friendly

**Status:** Ready to use! 🚀
