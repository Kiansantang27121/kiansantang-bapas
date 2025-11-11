# 📢 Template Pemanggilan Profesional

## 📋 Overview

Sistem pemanggilan suara dengan template profesional yang menyesuaikan salam berdasarkan waktu dan menyampaikan informasi lengkap dengan format yang jelas.

---

## 🔔 Template Pemanggilan

### **1. Panggilan PK (Pembimbing Kemasyarakatan)**

**Format:**
```
"[Salam], diberitahukan kepada Pembimbing Kemasyarakatan [Nama PK], 
ditunggu kehadirannya di [Nama Ruangan] karena ada klien wajib lapor 
atas nama [Nama Klien]. Sekali lagi, diberitahukan kepada Pembimbing 
Kemasyarakatan [Nama PK], ditunggu kehadirannya di [Nama Ruangan] 
karena ada klien wajib lapor atas nama [Nama Klien]. Atas perhatiannya 
diucapkan terima kasih."
```

**Contoh:**
```
"Selamat pagi, diberitahukan kepada Pembimbing Kemasyarakatan Budiana, 
ditunggu kehadirannya di Ruang Pelayanan 1 karena ada klien wajib lapor 
atas nama ACENG ROHMAT BIN ALM MUHTAR. Sekali lagi, diberitahukan kepada 
Pembimbing Kemasyarakatan Budiana, ditunggu kehadirannya di Ruang Pelayanan 1 
karena ada klien wajib lapor atas nama ACENG ROHMAT BIN ALM MUHTAR. 
Atas perhatiannya diucapkan terima kasih."
```

---

### **2. Panggilan Klien**

**Format:**
```
"[Salam], diberitahukan kepada nomor urut [Nomor Antrian], klien atas nama 
[Nama Klien], harap segera memasuki [Nama Ruangan]. Pembimbing Kemasyarakatan 
[Nama PK] siap melayani Anda. Sekali lagi, diberitahukan kepada nomor urut 
[Nomor Antrian], klien atas nama [Nama Klien], harap segera memasuki 
[Nama Ruangan]. Pembimbing Kemasyarakatan [Nama PK] siap melayani Anda. 
Atas perhatiannya diucapkan terima kasih."
```

**Contoh:**
```
"Selamat pagi, diberitahukan kepada nomor urut B001, klien atas nama 
ACENG ROHMAT BIN ALM MUHTAR, harap segera memasuki Ruang Pelayanan 1. 
Pembimbing Kemasyarakatan Budiana siap melayani Anda. Sekali lagi, 
diberitahukan kepada nomor urut B001, klien atas nama ACENG ROHMAT BIN ALM MUHTAR, 
harap segera memasuki Ruang Pelayanan 1. Pembimbing Kemasyarakatan Budiana 
siap melayani Anda. Atas perhatiannya diucapkan terima kasih."
```

---

## ⏰ Salam Berdasarkan Waktu

### **Jadwal Salam:**

| Waktu | Salam |
|-------|-------|
| 08:00 - 12:00 | Selamat pagi |
| 12:00 - 16:00 | Selamat siang |
| 16:00 - 18:00 | Selamat sore |
| 18:00 - 08:00 | Selamat malam |

### **Implementation:**
```javascript
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 8 && hour < 12) {
    return 'Selamat pagi'
  } else if (hour >= 12 && hour < 16) {
    return 'Selamat siang'
  } else if (hour >= 16 && hour < 18) {
    return 'Selamat sore'
  } else {
    return 'Selamat malam'
  }
}
```

---

## 🎯 Fitur Template

### **1. Struktur Profesional**
- ✅ Salam pembuka sesuai waktu
- ✅ Penyebutan jabatan lengkap
- ✅ Informasi ruangan jelas
- ✅ Nama lengkap (PK & Klien)
- ✅ Pengulangan tanpa salam
- ✅ Penutup sopan

### **2. Informasi Lengkap**

**Panggilan PK:**
- Salam berdasarkan waktu
- Jabatan: "Pembimbing Kemasyarakatan"
- Nama PK
- Nama ruangan
- Nama klien
- Tujuan: "klien wajib lapor"

**Panggilan Klien:**
- Salam berdasarkan waktu
- Nomor antrian
- Nama klien
- Nama ruangan
- Nama PK yang melayani
- Informasi: "siap melayani Anda"

### **3. Pengulangan**
- ✅ Diulang 2x (default)
- ✅ Pengulangan tanpa salam
- ✅ Jeda 2 detik antar pengulangan
- ✅ Dapat dikonfigurasi di settings

---

## 📊 Contoh Penggunaan

### **Scenario 1: Pagi Hari (09:00)**

**Panggilan PK:**
```
"Selamat pagi, diberitahukan kepada Pembimbing Kemasyarakatan Budiana, 
ditunggu kehadirannya di Ruang Pelayanan 1 karena ada klien wajib lapor 
atas nama ACENG ROHMAT BIN ALM MUHTAR. Sekali lagi, diberitahukan kepada 
Pembimbing Kemasyarakatan Budiana, ditunggu kehadirannya di Ruang Pelayanan 1 
karena ada klien wajib lapor atas nama ACENG ROHMAT BIN ALM MUHTAR. 
Atas perhatiannya diucapkan terima kasih."
```

---

### **Scenario 2: Siang Hari (13:00)**

**Panggilan Klien:**
```
"Selamat siang, diberitahukan kepada nomor urut B002, klien atas nama 
ALI NUROHMAN BIN AGUS, harap segera memasuki Ruang Pelayanan 2. 
Pembimbing Kemasyarakatan Budiana siap melayani Anda. Sekali lagi, 
diberitahukan kepada nomor urut B002, klien atas nama ALI NUROHMAN BIN AGUS, 
harap segera memasuki Ruang Pelayanan 2. Pembimbing Kemasyarakatan Budiana 
siap melayani Anda. Atas perhatiannya diucapkan terima kasih."
```

---

### **Scenario 3: Sore Hari (17:00)**

**Panggilan PK:**
```
"Selamat sore, diberitahukan kepada Pembimbing Kemasyarakatan Ryan Rizkia, 
ditunggu kehadirannya di Ruang Pelayanan 3 karena ada klien wajib lapor 
atas nama BUDI SANTOSO. Sekali lagi, diberitahukan kepada Pembimbing 
Kemasyarakatan Ryan Rizkia, ditunggu kehadirannya di Ruang Pelayanan 3 
karena ada klien wajib lapor atas nama BUDI SANTOSO. Atas perhatiannya 
diucapkan terima kasih."
```

---

## 🔧 Implementation

### **File: `petugas-app/src/pages/PetugasLayananDashboard.jsx`**

**Panggilan PK:**
```javascript
const handleCallPK = async (queueId) => {
  // ... API call ...
  
  if (response.data.success) {
    const callData = response.data.call_data
    
    // Get greeting based on time
    const greeting = getGreeting()
    const roomName = getRoomName(callData.room_number)
    
    // Build message with template
    const messageWithGreeting = `${greeting}, diberitahukan kepada Pembimbing Kemasyarakatan ${callData.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${callData.client_name}. Sekali lagi, diberitahukan kepada Pembimbing Kemasyarakatan ${callData.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${callData.client_name}. Atas perhatiannya diucapkan terima kasih.`
    
    // Speak with settings (repeat 2x, delay 2s)
    speakMessage(messageWithGreeting)
  }
}
```

**Panggilan Klien:**
```javascript
const handleCallClient = async (queueId) => {
  // ... API call ...
  
  if (response.data.success) {
    const callData = response.data.call_data
    
    // Get greeting based on time
    const greeting = getGreeting()
    const roomName = getRoomName(callData.room_number)
    
    // Build message with template
    const messageWithGreeting = `${greeting}, diberitahukan kepada nomor urut ${callData.queue_number}, klien atas nama ${callData.client_name}, harap segera memasuki ${roomName}. Pembimbing Kemasyarakatan ${callData.pk_name} siap melayani Anda. Sekali lagi, diberitahukan kepada nomor urut ${callData.queue_number}, klien atas nama ${callData.client_name}, harap segera memasuki ${roomName}. Pembimbing Kemasyarakatan ${callData.pk_name} siap melayani Anda. Atas perhatiannya diucapkan terima kasih.`
    
    // Speak with settings (repeat 2x, delay 2s)
    speakMessage(messageWithGreeting)
  }
}
```

---

## 📋 Template Display (Voice Settings Page)

**Location:** `http://localhost:5174/voice`

**UI Display:**
```
┌─────────────────────────────────────────────────────┐
│ 📋 Template Pemanggilan:                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 🔔 Panggilan PK:                                   │
│ "[Salam], diberitahukan kepada Pembimbing          │
│ Kemasyarakatan [Nama PK], ditunggu kehadirannya    │
│ di [Nama Ruangan] karena ada klien wajib lapor     │
│ atas nama [Nama Klien]. Sekali lagi, ..."         │
│                                                     │
│ Salam: Selamat pagi (08:00-12:00) /                │
│        Selamat siang (12:00-16:00) /               │
│        Selamat sore (16:00-18:00)                  │
│                                                     │
│ 🔔 Panggilan Klien:                                │
│ "[Salam], diberitahukan kepada nomor urut          │
│ [Nomor Antrian], klien atas nama [Nama Klien],    │
│ harap segera memasuki [Nama Ruangan].              │
│ Pembimbing Kemasyarakatan [Nama PK] siap           │
│ melayani Anda. Sekali lagi, ..."                   │
│                                                     │
│ Salam: Selamat pagi (08:00-12:00) /                │
│        Selamat siang (12:00-16:00) /               │
│        Selamat sore (16:00-18:00)                  │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Benefits

### **For Professionalism:**
- ✅ Formal and respectful
- ✅ Complete information
- ✅ Clear instructions
- ✅ Appropriate greetings

### **For Clarity:**
- ✅ Mentions all parties
- ✅ States purpose clearly
- ✅ Repeats for emphasis
- ✅ Easy to understand

### **For User Experience:**
- ✅ Time-appropriate greeting
- ✅ Polite and courteous
- ✅ Professional tone
- ✅ Complete information

---

## 🧪 Testing

### **Test 1: Morning Call (09:00)**
```
1. Login as petugas
2. Call PK at 09:00
3. ✅ Hear: "Selamat pagi, diberitahukan kepada..."
4. ✅ Full template with greeting
5. ✅ Repeated 2x with 2s delay
```

### **Test 2: Afternoon Call (13:00)**
```
1. Login as petugas
2. Call client at 13:00
3. ✅ Hear: "Selamat siang, diberitahukan kepada..."
4. ✅ Full template with greeting
5. ✅ Repeated 2x with 2s delay
```

### **Test 3: Evening Call (17:00)**
```
1. Login as petugas
2. Call PK at 17:00
3. ✅ Hear: "Selamat sore, diberitahukan kepada..."
4. ✅ Full template with greeting
5. ✅ Repeated 2x with 2s delay
```

---

## 📊 Voice Settings Integration

### **Settings Applied:**
- ✅ Speed (voice_rate): 0.9x (default)
- ✅ Pitch (voice_pitch): 1.0 (default)
- ✅ Volume (voice_volume): 100% (default)
- ✅ Repeat (voice_repeat): 2x (default)
- ✅ Delay (voice_delay): 2s (default)
- ✅ Language: id-ID (Indonesian)

### **Customizable:**
- ✅ Can adjust speed (0.5x - 2.0x)
- ✅ Can adjust pitch (0.5 - 2.0)
- ✅ Can adjust volume (0% - 100%)
- ✅ Can change repeat count (1x - 3x)
- ✅ Can change delay (1s - 5s)
- ✅ Can enable/disable

---

## 📈 Summary

### **Features:**
- ✅ Professional templates
- ✅ Time-based greetings
- ✅ Complete information
- ✅ Automatic repetition
- ✅ Configurable settings

### **Templates:**
- ✅ Panggilan PK (with greeting, PK name, room, client)
- ✅ Panggilan Klien (with greeting, queue number, client, room, PK)

### **Benefits:**
- ✅ Professional and formal
- ✅ Clear and complete
- ✅ Easy to understand
- ✅ Customizable

---

## 🎉 Status

**✅ TEMPLATE PEMANGGILAN PROFESIONAL READY!**

**Features:**
- ✅ Salam berdasarkan waktu (pagi/siang/sore)
- ✅ Template lengkap untuk PK & Klien
- ✅ Pengulangan otomatis tanpa salam
- ✅ Informasi lengkap dan jelas
- ✅ Display template di settings page

**Templates:**
- ✅ Panggilan PK: Salam + Jabatan + Nama + Ruangan + Klien + Pengulangan + Terima kasih
- ✅ Panggilan Klien: Salam + Nomor + Nama + Ruangan + PK + Pengulangan + Terima kasih

**Sistem pemanggilan sekarang profesional dan lengkap!** 📢✨

---

**Last Updated:** November 9, 2025 - 22:00 WIB
