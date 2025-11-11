# 📺 Display Workflow dengan Voice Announcement

## 📋 Overview

Fitur baru untuk menampilkan semua aktivitas workflow di panel display dan mengeluarkan semua suara pemanggilan dari display (bukan dari petugas/PK app).

---

## ✨ Features

### **1. Display Workflow Activities**
- ✅ Menampilkan semua aktivitas workflow real-time
- ✅ PK dipanggil masuk ruangan
- ✅ PK masuk ruangan
- ✅ Klien dipanggil
- ✅ Layanan selesai

### **2. Voice Announcement dari Display**
- ✅ Semua suara keluar dari display
- ✅ Template profesional dengan salam
- ✅ Pengulangan otomatis
- ✅ Configurable settings

### **3. Statistics Dashboard**
- ✅ Menunggu
- ✅ PK Dipanggil
- ✅ Klien Dipanggil
- ✅ Selesai Hari Ini

### **4. Real-time Updates**
- ✅ Socket.IO untuk live updates
- ✅ Otomatis refresh
- ✅ No manual refresh needed

---

## 🎯 Implementation

### **1. Frontend - Display App**

**File:** `display-app/src/AppWorkflow.jsx` (NEW)

**Features:**
- Real-time workflow activities
- Statistics dashboard
- Current call display
- Voice announcement with settings
- Socket.IO integration

**Key Functions:**
```javascript
// Get greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 8 && hour < 12) return 'Selamat pagi'
  else if (hour >= 12 && hour < 16) return 'Selamat siang'
  else if (hour >= 16 && hour < 18) return 'Selamat sore'
  else return 'Selamat malam'
}

// Voice announcement with settings
const speakMessage = async (message) => {
  // Fetch settings from API
  // Apply rate, pitch, volume
  // Repeat with delay
  // Cancel ongoing speech first
}

// Handle PK called event
const handlePKCalled = (data) => {
  const message = `${greeting}, diberitahukan kepada Pembimbing Kemasyarakatan ${data.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${data.client_name}...`
  speakMessage(message)
}

// Handle client called event
const handleClientCalled = (data) => {
  const message = `${greeting}, diberitahukan kepada nomor urut ${data.queue_number}, klien atas nama ${data.client_name}, harap segera memasuki ${roomName}...`
  speakMessage(message)
}
```

---

### **2. Backend - API Endpoints**

**File:** `backend/routes/workflow-sqlite.js`

**New Endpoints:**

#### **GET /workflow/activities**
Returns workflow activities for display

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "type": "client_called",
      "queue_number": "B001",
      "client_name": "ACENG ROHMAT BIN ALM MUHTAR",
      "pk_name": "Budiana",
      "room_number": 1,
      "timestamp": "2025-11-09 14:30:00",
      "status": "in_progress"
    },
    {
      "type": "pk_entered",
      "queue_number": "B001",
      "client_name": "ACENG ROHMAT BIN ALM MUHTAR",
      "pk_name": "Budiana",
      "room_number": 1,
      "timestamp": "2025-11-09 14:25:00",
      "status": "in_progress"
    }
  ]
}
```

#### **GET /workflow/stats**
Returns statistics for display

**Response:**
```json
{
  "success": true,
  "stats": {
    "waiting": 5,
    "pkCalled": 2,
    "clientCalled": 1,
    "completed": 10
  }
}
```

---

### **3. Socket.IO Events**

**Events Emitted:**

#### **pk:called**
When petugas calls PK to enter room

**Data:**
```javascript
{
  type: 'pk',
  pk_name: 'Budiana',
  client_name: 'ACENG ROHMAT BIN ALM MUHTAR',
  room_number: 1,
  queue_number: 'B001'
}
```

#### **pk:entered**
When PK confirms entry to room

**Data:**
```javascript
{
  queue_number: 'B001',
  room_number: 1
}
```

#### **client:called**
When PK calls client to enter room

**Data:**
```javascript
{
  type: 'client',
  queue_number: 'B001',
  client_name: 'ACENG ROHMAT BIN ALM MUHTAR',
  room_number: 1,
  pk_name: 'Budiana'
}
```

---

## 🎨 UI Design

### **Display Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ BAPAS Bandung                                    🕐 14:30:00    │
│ Sistem Antrian Bimbingan Wajib Lapor            Sabtu, 9 Nov   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│ │Menunggu │ │PK Panggil│ │Klien Call│ │Selesai  │              │
│ │    5    │ │    2    │ │    1    │ │   10    │              │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
├──────────────────────────┬──────────────────────────────────────┤
│ 📢 Panggilan Saat Ini    │ ✅ Aktivitas Workflow               │
│                          │                                      │
│      B001                │ 📞 Klien B001 dipanggil (14:30)     │
│ ACENG ROHMAT BIN ALM...  │ 🚪 PK Budiana masuk R1 (14:25)      │
│                          │ 🔔 PK Budiana dipanggil (14:20)     │
│ 🚪 Silakan Masuk         │ ✅ Layanan B002 selesai (14:15)     │
│ RUANG PELAYANAN 1        │ 📞 Klien B002 dipanggil (14:10)     │
│                          │                                      │
└──────────────────────────┴──────────────────────────────────────┘
│ Selamat Datang di BAPAS Bandung - Sistem Antrian...           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow

### **Complete Flow:**

```
1. Petugas Panggil PK
   ↓
   Backend: POST /workflow/call-pk
   ↓
   Socket emit: 'pk:called'
   ↓
   Display: Show call + Voice announcement
   ↓
2. PK Konfirmasi Masuk
   ↓
   Backend: POST /workflow/pk-enter-room
   ↓
   Socket emit: 'pk:entered'
   ↓
   Display: Update activities
   ↓
3. PK Panggil Klien
   ↓
   Backend: POST /workflow/pk-call-client
   ↓
   Socket emit: 'client:called'
   ↓
   Display: Show call + Voice announcement
```

---

## 📊 Voice Templates

### **Panggilan PK:**
```
"[Salam], diberitahukan kepada Pembimbing Kemasyarakatan [Nama PK], 
ditunggu kehadirannya di [Ruangan] karena ada klien wajib lapor 
atas nama [Nama Klien]. Sekali lagi, diberitahukan kepada Pembimbing 
Kemasyarakatan [Nama PK], ditunggu kehadirannya di [Ruangan] karena 
ada klien wajib lapor atas nama [Nama Klien]. Atas perhatiannya 
diucapkan terima kasih."
```

### **Panggilan Klien:**
```
"[Salam], diberitahukan kepada nomor urut [Nomor], klien atas nama 
[Nama Klien], harap segera memasuki [Ruangan]. Pembimbing Kemasyarakatan 
[Nama PK] siap melayani Anda. Sekali lagi, diberitahukan kepada nomor urut 
[Nomor], klien atas nama [Nama Klien], harap segera memasuki [Ruangan]. 
Pembimbing Kemasyarakatan [Nama PK] siap melayani Anda. Atas perhatiannya 
diucapkan terima kasih."
```

---

## 🧪 Testing

### **Step 1: Start All Servers**

```bash
# Backend
cd backend
npm run dev

# Display App
cd display-app
npm run dev

# Petugas App
cd petugas-app
npm run dev
```

### **Step 2: Open Display**

```
URL: http://localhost:5175
or
URL: http://localhost:5175?mode=workflow

Default mode is now 'workflow' (with voice from display)
```

### **Step 3: Test Workflow**

```
1. Login as Petugas Layanan
2. Call PK to room
   ✅ Display shows call
   ✅ Voice plays from display
   ✅ Activity logged

3. Login as PK
4. Confirm entry
   ✅ Display updates
   ✅ Activity logged

5. Call client
   ✅ Display shows call
   ✅ Voice plays from display
   ✅ Activity logged
```

---

## 🎛️ Display Modes

### **Workflow Mode (NEW - Default):**
```
URL: http://localhost:5175
or
URL: http://localhost:5175?mode=workflow
```
**Features:**
- Workflow activities
- Voice from display
- Real-time stats
- Socket.IO updates

### **Legacy KPP Mode:**
```
URL: http://localhost:5175?mode=kpp
```
**Features:**
- Traditional queue display
- Voice from petugas app
- No workflow activities

### **Legacy Mobile Mode:**
```
URL: http://localhost:5175?mode=mobile
```
**Features:**
- Portrait orientation
- Simple queue display
- Voice from petugas app

---

## 📋 Files Modified/Created

### **Frontend (Display App):**
1. ✅ `display-app/src/AppWorkflow.jsx` - New workflow display (NEW)
2. ✅ `display-app/src/main.jsx` - Added workflow mode

### **Backend:**
1. ✅ `backend/routes/workflow-sqlite.js` - Added endpoints & socket events
   - GET /workflow/activities
   - GET /workflow/stats
   - Socket emit on call-pk
   - Socket emit on pk-enter-room
   - Socket emit on pk-call-client

### **Documentation:**
1. ✅ `DISPLAY-WORKFLOW-VOICE.md` - This file

---

## 🎯 Benefits

### **For Display:**
- ✅ All voice from one source (display)
- ✅ Consistent volume & quality
- ✅ No need multiple speakers
- ✅ Centralized control

### **For Monitoring:**
- ✅ See all workflow activities
- ✅ Real-time statistics
- ✅ Current call display
- ✅ Activity log

### **For System:**
- ✅ Better architecture
- ✅ Centralized voice
- ✅ Real-time updates
- ✅ Professional display

---

## 🔧 Configuration

### **Voice Settings:**
Configure at: `http://localhost:5174/voice`

**Settings:**
- Enable/Disable: ON
- Speed: 0.9x
- Pitch: 1.0
- Volume: 100%
- Repeat: 2x
- Delay: 2s

**Applied to:**
- ✅ Display voice announcements
- ✅ All call types (PK & Client)

---

## 📈 Summary

### **Features:**
- ✅ Display workflow activities
- ✅ Voice from display
- ✅ Real-time statistics
- ✅ Socket.IO integration
- ✅ Professional templates

### **Voice:**
- ✅ All announcements from display
- ✅ Time-based greetings
- ✅ Configurable settings
- ✅ Automatic repetition

### **Display:**
- ✅ Current call (large)
- ✅ Activity log (scrollable)
- ✅ Statistics (4 cards)
- ✅ Running text (bottom)

---

## 🎉 Status

**✅ DISPLAY WORKFLOW WITH VOICE - COMPLETE!**

**Changes:**
- ✅ Created AppWorkflow.jsx
- ✅ Added workflow endpoints
- ✅ Added socket events
- ✅ Voice from display
- ✅ Activity logging

**Features:**
- ✅ Workflow activities display
- ✅ Real-time statistics
- ✅ Voice announcements
- ✅ Professional templates
- ✅ Socket.IO updates

**Result:**
- ✅ All voice from display
- ✅ All activities visible
- ✅ Real-time monitoring
- ✅ Professional system

**Sistem display sekarang lengkap dengan workflow activities dan voice!** 📺🔊✨

---

**Last Updated:** November 9, 2025 - 23:00 WIB
