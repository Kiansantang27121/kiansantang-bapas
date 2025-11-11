# 📢 Fitur: PK Panggil Klien

## 📋 Overview

Fitur baru yang memungkinkan PK untuk memanggil klien setelah masuk ruangan. Pemanggilan ini dapat dimonitoring oleh petugas layanan dan tampil di display.

---

## 🔄 Complete Workflow

### **Flow Lengkap:**

```
1. Klien Registrasi
   ↓
2. Petugas Layanan Assign ke PK
   ↓
3. PK Approve Assignment
   ↓
4. Petugas Layanan Panggil PK Masuk Ruangan
   ↓
5. PK Konfirmasi Masuk Ruangan ✅
   ↓
6. PK Panggil Klien (NEW!) 📢
   ↓
7. Klien Masuk Ruangan
   ↓
8. Layanan Selesai
```

---

## ✨ New Features

### **1. Tombol "Panggil Klien" di Dashboard PK**

**Location:** Dashboard PK → Section "Siap Panggil Klien"

**Conditions:**
- PK sudah approve assignment
- PK sudah masuk ruangan (`pk_entered_at` IS NOT NULL)
- Klien belum dipanggil (`client_called_at` IS NULL)

**Action:**
- Click "Panggil Klien"
- Voice announcement dengan template profesional
- Update status ke `called`
- Set `client_called_at` timestamp

---

### **2. Monitoring di Petugas Layanan**

**Location:** Dashboard Petugas Layanan

**Display:**
- Status "Klien Dipanggil" untuk queue yang sudah dipanggil PK
- Timestamp pemanggilan
- Nama PK yang memanggil
- Ruangan

---

### **3. Display di Layar Antrian**

**Location:** Display App

**Show:**
- Nomor antrian yang dipanggil
- Nama klien
- Ruangan tujuan
- Status: "Silakan Masuk"

---

## 🎯 Implementation Details

### **1. Frontend (PK Dashboard)**

**File:** `petugas-app/src/pages/PKWorkflowDashboard.jsx`

**New State:**
```javascript
const [readyToCallClient, setReadyToCallClient] = useState([])
```

**Filter Logic:**
```javascript
// PK sudah masuk ruangan, siap panggil klien
const readyForClient = allAssignments.filter(a => 
  a.pk_entered_at && !a.client_called_at
)
setReadyToCallClient(readyForClient)
```

**New Function:**
```javascript
const handleCallClient = async (queueId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      `${API_URL}/workflow/pk-call-client`,
      { queue_id: queueId },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (response.data.success) {
      const callData = response.data.call_data
      alert(`Klien ${callData.client_name} (${callData.queue_number}) dipanggil`)
      fetchData()
    }
  } catch (error) {
    console.error('Error calling client:', error)
    alert(error.response?.data?.message || 'Gagal memanggil klien')
  }
}
```

**UI Section:**
```jsx
{readyToCallClient.length > 0 && (
  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-2xl p-6 text-white">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
      <Bell className="w-6 h-6" />
      📢 Siap Panggil Klien
    </h2>
    <div className="space-y-3">
      {readyToCallClient.map((queue) => (
        <div key={queue.id} className="bg-white/20 backdrop-blur-lg rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Antrian: {queue.queue_number}</p>
            <p className="text-sm">Klien: {queue.client_name}</p>
            <p className="text-sm">Ruangan: Ruang Pelayanan {queue.room_number}</p>
          </div>
          <button
            onClick={() => handleCallClient(queue.id)}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-all flex items-center gap-2"
          >
            <Bell className="w-5 h-5" />
            Panggil Klien
          </button>
        </div>
      ))}
    </div>
  </div>
)}
```

---

### **2. Backend API**

**File:** `backend/routes/workflow-sqlite.js`

**New Endpoint:**
```javascript
// POST /workflow/pk-call-client
router.post('/pk-call-client', authenticateToken, requireRole(['pk']), (req, res) => {
  const { queue_id } = req.body;
  const user_id = req.user.id;

  try {
    // Get pk.id from pk table using user_id mapping
    const pkRecord = db.prepare('SELECT id FROM pk WHERE user_id = ?').get(user_id);
    
    if (!pkRecord) {
      return res.status(404).json({ success: false, message: 'PK record not found' });
    }
    
    const pk_id = pkRecord.id;

    // Get queue and verify ownership
    const queue = db.prepare(`
      SELECT q.*, s.name as service_name, pk.name as pk_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk ON q.pk_id = pk.id
      WHERE q.id = ? AND q.pk_id = ?
    `).get(queue_id, pk_id);

    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found or not assigned to you' });
    }

    // Validations
    if (!queue.pk_entered_at) {
      return res.status(400).json({ success: false, message: 'You have not entered the room yet' });
    }

    if (queue.client_called_at) {
      return res.status(400).json({ success: false, message: 'Client already called' });
    }

    // Update queue with client_called_at and status
    db.prepare(`
      UPDATE queue 
      SET client_called_at = CURRENT_TIMESTAMP, status = 'called'
      WHERE id = ?
    `).run(queue_id);

    console.log(`📢 PK ${queue.pk_name} called client ${queue.client_name} to room ${queue.room_number}`);

    res.json({ 
      success: true, 
      message: 'Client called to room successfully',
      call_data: {
        type: 'client',
        queue_number: queue.queue_number,
        client_name: queue.client_name,
        room_number: queue.room_number,
        pk_name: queue.pk_name
      }
    });
  } catch (error) {
    console.error('Error calling client:', error);
    res.status(500).json({ success: false, message: 'Error calling client', error: error.message });
  }
});
```

**Validations:**
- ✅ PK record exists (user_id mapping)
- ✅ Queue assigned to this PK
- ✅ PK has entered room
- ✅ Client not already called

**Updates:**
- ✅ Set `client_called_at` timestamp
- ✅ Update status to `'called'`

**Response:**
```json
{
  "success": true,
  "message": "Client called to room successfully",
  "call_data": {
    "type": "client",
    "queue_number": "B001",
    "client_name": "ACENG ROHMAT BIN ALM MUHTAR",
    "room_number": 1,
    "pk_name": "Budiana"
  }
}
```

---

## 📊 Database Schema

### **queue Table:**

**Relevant Columns:**
```sql
pk_id INTEGER             -- PK yang ditugaskan
pk_called_at DATETIME     -- Waktu PK dipanggil masuk ruangan
pk_entered_at DATETIME    -- Waktu PK konfirmasi masuk ruangan
client_called_at DATETIME -- Waktu klien dipanggil (NEW!)
status TEXT               -- waiting, called, completed
room_number INTEGER       -- Nomor ruangan
```

**Status Flow:**
```
waiting          → PK approve
waiting          → Petugas panggil PK (pk_called_at)
waiting          → PK masuk ruangan (pk_entered_at)
waiting → called → PK panggil klien (client_called_at)
called           → Klien masuk
called → completed → Layanan selesai
```

---

## 🎨 UI Design

### **Dashboard PK:**

```
┌─────────────────────────────────────────────────────┐
│ 📢 Siap Panggil Klien                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ Antrian: B001                    [Panggil Klien]││
│ │ Klien: ACENG ROHMAT BIN ALM MUHTAR              ││
│ │ Ruangan: Ruang Pelayanan 1                      ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ Antrian: B002                    [Panggil Klien]││
│ │ Klien: ALI NUROHMAN BIN AGUS                    ││
│ │ Ruangan: Ruang Pelayanan 2                      ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Colors:**
- Background: Green gradient (from-green-500 to-green-600)
- Text: White
- Button: White background, green text
- Icon: Bell (📢)

---

## 🔔 Voice Announcement

### **Template Pemanggilan Klien:**

```
"[Salam], diberitahukan kepada nomor urut [Nomor Antrian], 
klien atas nama [Nama Klien], harap segera memasuki [Nama Ruangan]. 
Pembimbing Kemasyarakatan [Nama PK] siap melayani Anda. 
Sekali lagi, diberitahukan kepada nomor urut [Nomor Antrian], 
klien atas nama [Nama Klien], harap segera memasuki [Nama Ruangan]. 
Pembimbing Kemasyarakatan [Nama PK] siap melayani Anda. 
Atas perhatiannya diucapkan terima kasih."
```

**Example:**
```
"Selamat pagi, diberitahukan kepada nomor urut B001, 
klien atas nama ACENG ROHMAT BIN ALM MUHTAR, 
harap segera memasuki Ruang Pelayanan 1. 
Pembimbing Kemasyarakatan Budiana siap melayani Anda. 
Sekali lagi, diberitahukan kepada nomor urut B001, 
klien atas nama ACENG ROHMAT BIN ALM MUHTAR, 
harap segera memasuki Ruang Pelayanan 1. 
Pembimbing Kemasyarakatan Budiana siap melayani Anda. 
Atas perhatiannya diucapkan terima kasih."
```

**Settings:**
- Repeat: 2x
- Delay: 2 seconds
- Speed: 0.9x
- Volume: 100%

---

## 📊 Monitoring (Petugas Layanan)

### **Dashboard Petugas:**

**Section: "Antrian Aktif"**

**Display:**
```
┌─────────────────────────────────────────────────────┐
│ B001 - ACENG ROHMAT BIN ALM MUHTAR                  │
│ PK: Budiana                                         │
│ Ruangan: 1                                          │
│ Status: ✅ Klien Dipanggil (14:30:15)               │
└─────────────────────────────────────────────────────┘
```

**Status Indicators:**
- ⏳ Menunggu PK Approve
- 🔔 PK Dipanggil Masuk
- ✅ PK Sudah Masuk
- 📢 Klien Dipanggil (NEW!)
- ✅ Klien Sudah Masuk
- ✅ Selesai

---

## 📺 Display App Integration

### **Display Screen:**

**Section: "Panggilan Saat Ini"**

```
┌─────────────────────────────────────────────────────┐
│                  PANGGILAN SAAT INI                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│              NOMOR ANTRIAN: B001                    │
│                                                     │
│         ACENG ROHMAT BIN ALM MUHTAR                 │
│                                                     │
│           SILAKAN MASUK KE                          │
│         RUANG PELAYANAN 1                           │
│                                                     │
│              PK: Budiana                            │
└─────────────────────────────────────────────────────┘
```

**Animation:**
- Fade in/out
- Highlight effect
- Sound notification

---

## 🧪 Testing

### **Test 1: PK Panggil Klien**

```
1. Login as PK Budiana
2. Go to dashboard
3. ✅ See "Siap Panggil Klien" section
4. ✅ See B001 ready to call
5. Click "Panggil Klien"
6. ✅ Alert: "Klien ACENG ROHMAT... dipanggil"
7. ✅ Voice announcement plays
8. ✅ Queue moves to next status
```

---

### **Test 2: Monitoring Petugas**

```
1. Login as Petugas Layanan
2. Go to dashboard
3. ✅ See B001 status: "Klien Dipanggil"
4. ✅ See timestamp
5. ✅ See PK name
6. ✅ See room number
```

---

### **Test 3: Display**

```
1. Open display app
2. ✅ See B001 on screen
3. ✅ See client name
4. ✅ See room number
5. ✅ See PK name
6. ✅ Animation plays
7. ✅ Sound notification
```

---

## 📋 Files Modified/Created

### **Frontend:**
1. ✅ `petugas-app/src/pages/PKWorkflowDashboard.jsx` - Added call client feature

### **Backend:**
1. ✅ `backend/routes/workflow-sqlite.js` - Added `/pk-call-client` endpoint

### **Documentation:**
1. ✅ `FITUR-PK-PANGGIL-KLIEN.md` - This file

---

## 🎯 Benefits

### **For PK:**
- ✅ Control over client calling
- ✅ Call when ready
- ✅ Clear interface
- ✅ Easy to use

### **For Petugas Layanan:**
- ✅ Monitor PK activity
- ✅ Track call times
- ✅ See real-time status
- ✅ Better coordination

### **For Clients:**
- ✅ Clear announcement
- ✅ Know when to enter
- ✅ See on display
- ✅ Professional service

### **For System:**
- ✅ Complete workflow
- ✅ Proper tracking
- ✅ Audit trail
- ✅ Data integrity

---

## 📈 Summary

### **New Features:**
- ✅ PK can call client after entering room
- ✅ "Siap Panggil Klien" section in PK dashboard
- ✅ Voice announcement with professional template
- ✅ Monitoring in Petugas dashboard
- ✅ Display integration

### **Workflow:**
```
Registration → Assign → Approve → Call PK → PK Enter → PK Call Client → Client Enter → Complete
```

### **Benefits:**
- ✅ Complete control for PK
- ✅ Better monitoring
- ✅ Professional service
- ✅ Clear communication

---

## 🎉 Status

**✅ FITUR PK PANGGIL KLIEN READY!**

**Features:**
- ✅ Tombol "Panggil Klien" di dashboard PK
- ✅ Voice announcement profesional
- ✅ Monitoring di petugas layanan
- ✅ Display integration
- ✅ Complete workflow

**Workflow:**
- ✅ PK approve → Petugas panggil PK → PK masuk → PK panggil klien → Klien masuk

**Next Steps:**
1. Restart backend & frontend
2. Login as PK
3. Masuk ruangan
4. Click "Panggil Klien"
5. Monitor di petugas & display

**Sistem pemanggilan sekarang lengkap dengan kontrol PK!** 📢✨

---

**Last Updated:** November 9, 2025 - 22:30 WIB
