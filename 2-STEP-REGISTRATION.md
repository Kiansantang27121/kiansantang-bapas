# 🎯 2-Step Registration System - Dynamic Forms

## ✨ Fitur Baru: Pendaftaran 2 Langkah dengan Form Dinamis

Sistem pendaftaran sekarang menggunakan **2-step flow** dengan form yang **menyesuaikan jenis layanan**!

---

## 🚀 Konsep

### Flow Baru:

```
┌─────────────────────────────────────┐
│  STEP 1: Pilih Jenis Layanan        │
│  (Service Selection)                 │
│                                      │
│  [Bimbingan Wajib Lapor]            │
│  [Pendaftaran Klien Baru]           │
│  [Konsultasi]                        │
│  [Pelaporan]                         │
│  [Administrasi]                      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  STEP 2: Isi Form Pendaftaran       │
│  (Dynamic Form)                      │
│                                      │
│  Form disesuaikan dengan layanan:   │
│  - Bimbingan Wajib Lapor:           │
│    → Pilih PK                        │
│    → Pilih Klien dari PK tersebut   │
│                                      │
│  - Layanan Lain:                     │
│    → Nama Lengkap                    │
│    → Telepon (optional)              │
│    → NIK (optional)                  │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  STEP 3: Success Screen              │
│  (Queue Number)                      │
│                                      │
│  ✅ Nomor Antrian: B001             │
│  📋 Layanan: Bimbingan Wajib Lapor  │
│  👤 Nama: Andi Wijaya               │
│  👨‍💼 PK: Budi Santoso, S.Sos        │
└─────────────────────────────────────┘
```

---

## 📊 Database Changes

### New Tables:

#### 1. **PK (Pembimbing Kemasyarakatan)**
```sql
CREATE TABLE pk (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  nip TEXT UNIQUE,
  phone TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**Sample Data:**
- Budi Santoso, S.Sos (NIP: 198501012010011001)
- Siti Nurhaliza, S.H. (NIP: 198702022011012002)
- Ahmad Fauzi, S.Psi (NIP: 198903032012011003)
- Dewi Lestari, S.Sos (NIP: 199004042013012004)
- Rudi Hermawan, S.H. (NIP: 199105052014011005)

#### 2. **Clients (Klien Binaan)**
```sql
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  nik TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  pk_id INTEGER,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pk_id) REFERENCES pk(id)
)
```

**Sample Data:**
- 12 klien sample (3 klien per PK untuk 4 PK pertama, 2 klien untuk PK ke-5)
- Setiap klien punya NIK, phone, address, dan assigned ke PK

#### 3. **Queue Table - Updated**
```sql
-- Added columns:
ALTER TABLE queue ADD COLUMN pk_id INTEGER REFERENCES pk(id)
ALTER TABLE queue ADD COLUMN client_id INTEGER REFERENCES clients(id)
```

---

## 🎨 Frontend Components

### 1. **App2Step.jsx** (Main App)
- Manages 3 steps: service, form, success
- State management untuk selected service & result
- Navigation between steps

### 2. **ServiceSelection.jsx** (Step 1)
**Features:**
- Grid layout dengan service cards
- Icon & color untuk setiap layanan
- Hover effects & animations
- Service description & estimated time
- Modern glassmorphism design

**Service Icons:**
```jsx
{
  'Bimbingan Wajib Lapor': Users,
  'Pendaftaran Klien Baru': FileText,
  'Konsultasi': MessageSquare,
  'Pelaporan': FileText,
  'Administrasi': Briefcase
}
```

**Service Colors:**
```jsx
{
  'Bimbingan Wajib Lapor': 'from-blue-500 to-cyan-500',
  'Pendaftaran Klien Baru': 'from-green-500 to-emerald-500',
  'Konsultasi': 'from-purple-500 to-pink-500',
  'Pelaporan': 'from-orange-500 to-red-500',
  'Administrasi': 'from-indigo-500 to-blue-500'
}
```

### 3. **RegistrationForm.jsx** (Step 2)
**Dynamic Form Logic:**

**For "Bimbingan Wajib Lapor":**
```jsx
1. Dropdown: Pilih PK
   - Fetch dari /api/pk
   - Show PK name, NIP, phone

2. Dropdown: Pilih Klien (depends on PK)
   - Fetch dari /api/pk/{id}/clients
   - Auto-fill client_name, phone, NIK
   - Only show clients for selected PK

3. Submit dengan pk_id & client_id
```

**For Other Services:**
```jsx
1. Input: Nama Lengkap (required)
2. Input: Nomor Telepon (optional)
3. Input: NIK (optional)

Submit dengan client_name, phone, NIK
```

### 4. **SuccessScreen.jsx** (Step 3)
**Features:**
- Animated success icon
- Glowing queue number card
- Details grid (name, estimated time)
- PK info (if Bimbingan Wajib Lapor)
- "Daftar Antrian Baru" button

---

## 🔌 Backend API

### New Endpoints:

#### **PK Management**

**GET /api/pk**
- Get all active PK
- Response: Array of PK objects

**GET /api/pk/:id**
- Get specific PK by ID
- Response: PK object

**GET /api/pk/:id/clients**
- Get all clients for specific PK
- Response: Array of client objects

**POST /api/pk**
- Create new PK (admin only)
- Body: { name, nip, phone }

**PUT /api/pk/:id**
- Update PK (admin only)
- Body: { name, nip, phone, is_active }

**DELETE /api/pk/:id**
- Soft delete PK (admin only)

#### **Client Management**

**GET /api/clients**
- Get all active clients
- Query: ?pk_id={id} (optional filter)
- Response: Array of clients with pk_name

**GET /api/clients/:id**
- Get specific client by ID
- Response: Client object with pk_name

**POST /api/clients**
- Create new client
- Body: { name, nik, phone, address, pk_id }

**PUT /api/clients/:id**
- Update client
- Body: { name, nik, phone, address, pk_id, is_active }

**DELETE /api/clients/:id**
- Soft delete client

#### **Queue - Updated**

**POST /api/queue**
- Create new queue
- Body (Bimbingan Wajib Lapor):
  ```json
  {
    "service_id": 1,
    "client_name": "Andi Wijaya",
    "pk_id": 1,
    "client_id": 1
  }
  ```
- Body (Other services):
  ```json
  {
    "service_id": 2,
    "client_name": "John Doe",
    "client_phone": "08123456789",
    "client_nik": "1234567890123456"
  }
  ```

---

## 🎯 User Flow

### Scenario 1: Bimbingan Wajib Lapor

**Step 1: Service Selection**
```
User melihat 5 layanan
→ Klik "Bimbingan Wajib Lapor" (icon Users, warna blue-cyan)
```

**Step 2: Form**
```
1. Dropdown "Pilih PK" muncul
   → User pilih "Budi Santoso, S.Sos"
   → Info PK muncul (NIP, phone)

2. Dropdown "Pilih Klien" muncul
   → Menampilkan 3 klien Budi Santoso:
     - Andi Wijaya
     - Budi Setiawan
     - Citra Dewi
   → User pilih "Andi Wijaya"
   → Data klien auto-fill (name, phone, NIK)

3. Klik "Daftar Sekarang"
```

**Step 3: Success**
```
✅ Berhasil!
📋 Nomor Antrian: B001
👤 Nama: Andi Wijaya
⏱️ Estimasi: ~15 menit
👨‍💼 PK: Budi Santoso, S.Sos

[Daftar Antrian Baru]
```

### Scenario 2: Layanan Lain (Konsultasi)

**Step 1: Service Selection**
```
User melihat 5 layanan
→ Klik "Konsultasi" (icon MessageSquare, warna purple-pink)
```

**Step 2: Form**
```
1. Input "Nama Lengkap" (required)
   → User isi: "John Doe"

2. Input "Nomor Telepon" (optional)
   → User isi: "08123456789"

3. Input "NIK" (optional)
   → User skip

4. Klik "Daftar Sekarang"
```

**Step 3: Success**
```
✅ Berhasil!
📋 Nomor Antrian: K001
👤 Nama: John Doe
⏱️ Estimasi: ~20 menit

[Daftar Antrian Baru]
```

---

## 🎨 Design Highlights

### Service Selection (Step 1)

**Card Design:**
```
┌─────────────────────────────┐
│ 🎨 Gradient Icon (16x16)    │
│                              │
│ Bimbingan Wajib Lapor       │
│ (2xl font-black)             │
│                              │
│ Layanan bimbingan dan...    │
│ (description)                │
│                              │
│ ⏱️ ~15 menit                 │
│                              │
│                    [→ Icon]  │
└─────────────────────────────┘
```

**Hover Effects:**
- Scale 1.05
- Shadow increase
- Arrow icon appears
- Gradient overlay

### Registration Form (Step 2)

**Bimbingan Wajib Lapor:**
```
┌─────────────────────────────┐
│ ← Kembali ke Pilihan Layanan│
│                              │
│ 👥 Bimbingan Wajib Lapor    │
│ Layanan bimbingan...         │
│ Estimasi: ~15 menit          │
│                              │
│ 👨‍💼 Pilih PK *               │
│ [Dropdown with gradient icon]│
│ ℹ️ NIP: xxx, Phone: xxx     │
│                              │
│ 👤 Pilih Klien *             │
│ [Dropdown with gradient icon]│
│                              │
│ [✨ Daftar Sekarang]         │
└─────────────────────────────┘
```

**Standard Form:**
```
┌─────────────────────────────┐
│ ← Kembali ke Pilihan Layanan│
│                              │
│ 📋 Konsultasi               │
│ Layanan konsultasi...        │
│ Estimasi: ~20 menit          │
│                              │
│ 👤 Nama Lengkap *            │
│ [Input with gradient icon]   │
│                              │
│ 📞 Nomor Telepon             │
│ [Input with gradient icon]   │
│                              │
│ 💳 NIK                       │
│ [Input with gradient icon]   │
│                              │
│ [✨ Daftar Sekarang]         │
└─────────────────────────────┘
```

---

## 🔧 Setup & Migration

### 1. Run Migration

```powershell
cd backend
npm run migrate
```

**Output:**
```
Adding pk_id column to queue table...
✅ pk_id column added
Adding client_id column to queue table...
✅ client_id column added
Migration completed successfully!
```

### 2. Restart Backend

```powershell
cd backend
npm run dev
```

**Check:**
- Tables `pk` and `clients` created
- Sample data inserted (5 PK, 12 clients)
- New routes available: /api/pk, /api/clients

### 3. Start Registration App

```powershell
cd registration-app
npm run dev
```

**URL:** http://localhost:5174

---

## 📊 Data Structure

### PK → Clients Relationship

```
PK 1: Budi Santoso, S.Sos
  ├─ Client 1: Andi Wijaya
  ├─ Client 2: Budi Setiawan
  └─ Client 3: Citra Dewi

PK 2: Siti Nurhaliza, S.H.
  ├─ Client 4: Dedi Kurniawan
  ├─ Client 5: Eka Putri
  └─ Client 6: Fajar Ramadhan

PK 3: Ahmad Fauzi, S.Psi
  ├─ Client 7: Gita Sari
  └─ Client 8: Hendra Gunawan

PK 4: Dewi Lestari, S.Sos
  ├─ Client 9: Indah Permata
  └─ Client 10: Joko Susilo

PK 5: Rudi Hermawan, S.H.
  ├─ Client 11: Kartika Sari
  └─ Client 12: Lukman Hakim
```

### Queue Data (Bimbingan Wajib Lapor)

```json
{
  "id": 1,
  "queue_number": "B001",
  "service_id": 1,
  "service_name": "Bimbingan Wajib Lapor",
  "client_name": "Andi Wijaya",
  "client_phone": "081111111111",
  "client_nik": "3201010101900001",
  "pk_id": 1,
  "pk_name": "Budi Santoso, S.Sos",
  "client_id": 1,
  "status": "waiting",
  "estimated_time": 15,
  "created_at": "2025-01-08T13:00:00.000Z"
}
```

---

## 🎯 Benefits

### 1. **Better UX**
- ✅ Clear 2-step process
- ✅ Visual service selection
- ✅ Form sesuai kebutuhan
- ✅ Less confusion

### 2. **Efficient for Bimbingan Wajib Lapor**
- ✅ Pilih PK dulu
- ✅ Klien filtered by PK
- ✅ Auto-fill data klien
- ✅ No manual typing

### 3. **Flexible**
- ✅ Easy to add new service types
- ✅ Easy to customize forms
- ✅ Scalable architecture

### 4. **Data Integrity**
- ✅ Relational data (PK → Clients)
- ✅ Foreign keys
- ✅ Soft deletes

---

## 🎨 Customization

### Add New Service Type

**1. Add service to database:**
```sql
INSERT INTO services (name, description, estimated_time) 
VALUES ('Layanan Baru', 'Deskripsi layanan', 25);
```

**2. Add icon & color:**
```jsx
// ServiceSelection.jsx
const serviceIcons = {
  ...
  'Layanan Baru': IconName
}

const serviceColors = {
  ...
  'Layanan Baru': 'from-color1 to-color2'
}
```

**3. Add custom form (if needed):**
```jsx
// RegistrationForm.jsx
const isLayananBaru = service.name === 'Layanan Baru'

{isLayananBaru && (
  // Custom form fields
)}
```

### Add New PK

**Via API:**
```javascript
POST /api/pk
{
  "name": "Nama PK Baru, S.Sos",
  "nip": "199901012020011006",
  "phone": "081234567895"
}
```

**Via Database:**
```sql
INSERT INTO pk (name, nip, phone) 
VALUES ('Nama PK Baru, S.Sos', '199901012020011006', '081234567895');
```

### Add New Client

**Via API:**
```javascript
POST /api/clients
{
  "name": "Nama Klien Baru",
  "nik": "3201010101900013",
  "phone": "081111111123",
  "address": "Jl. Contoh No. 13",
  "pk_id": 1
}
```

---

## 🐛 Troubleshooting

### Migration Error

**Problem:**
```
Error: table queue has no column named pk_id
```

**Solution:**
```powershell
cd backend
npm run migrate
```

### PK List Empty

**Problem:**
Dropdown PK kosong

**Solution:**
1. Check backend running
2. Check /api/pk endpoint
3. Check database has PK data
4. Check browser console for errors

### Clients Not Loading

**Problem:**
Setelah pilih PK, dropdown klien kosong

**Solution:**
1. Check /api/pk/{id}/clients endpoint
2. Check PK has clients in database
3. Check client.pk_id matches selected PK
4. Check client.is_active = 1

---

## ✅ Testing Checklist

### Step 1: Service Selection
- [ ] All 5 services displayed
- [ ] Icons & colors correct
- [ ] Hover effects work
- [ ] Click navigates to form
- [ ] Animations smooth

### Step 2: Bimbingan Wajib Lapor Form
- [ ] PK dropdown loads
- [ ] PK info shows after select
- [ ] Client dropdown appears
- [ ] Clients filtered by PK
- [ ] Client data auto-fills
- [ ] Submit creates queue
- [ ] Back button works

### Step 3: Standard Form
- [ ] Name input required
- [ ] Phone optional
- [ ] NIK optional
- [ ] Submit creates queue
- [ ] Back button works

### Step 4: Success Screen
- [ ] Queue number displayed
- [ ] Service name correct
- [ ] Client name correct
- [ ] PK name shown (if applicable)
- [ ] "Daftar Baru" resets flow

---

## 📊 Summary

**What's New:**
- ✅ 2-step registration flow
- ✅ Service selection page
- ✅ Dynamic forms per service
- ✅ PK & Clients management
- ✅ Special form for Bimbingan Wajib Lapor
- ✅ Modern UI with animations
- ✅ Database migrations
- ✅ New API endpoints

**Files Created:**
- `App2Step.jsx` - Main app
- `ServiceSelection.jsx` - Step 1
- `RegistrationForm.jsx` - Step 2 (dynamic)
- `SuccessScreen.jsx` - Step 3
- `routes/pk.js` - PK API
- `routes/clients.js` - Clients API
- `migrations/add_pk_client_fields.js` - Migration

**Files Modified:**
- `database.js` - Added PK & Clients tables
- `server.js` - Added new routes
- `routes/queue.js` - Support pk_id & client_id
- `main.jsx` - Use App2Step
- `package.json` - Add migrate script

---

**2-Step Registration dengan Dynamic Forms siap digunakan!** 🎯✨

**Test sekarang:** http://localhost:5174 🚀
