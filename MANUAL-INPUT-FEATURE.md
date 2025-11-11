# 📝 Manual Input Feature - Bimbingan Wajib Lapor

## ✨ Fitur Baru: Input Manual untuk Klien Baru

Form Bimbingan Wajib Lapor sekarang support **2 mode input**:
1. **Klien dari Database** - Pilih klien existing
2. **Input Manual** - Isi data klien baru yang belum di database

---

## 🎯 Konsep

### Flow Lengkap:

```
1. Pilih PK
   ↓
2. Toggle Mode:
   
   A. Klien dari Database          B. Input Manual
   ┌──────────────────────┐        ┌──────────────────────┐
   │ [Database Icon]      │        │ [UserPlus Icon]      │
   │ Pilih dari dropdown  │   OR   │ Isi form manual      │
   │ - Andi Wijaya        │        │ - Nama Klien *       │
   │ - Budi Setiawan      │        │ - Telepon            │
   │ - Citra Dewi         │        │ - NIK                │
   │ (Auto-fill data)     │        │                      │
   └──────────────────────┘        └──────────────────────┘
   ↓
3. Submit → Queue Created
```

---

## 🎨 UI Design

### Toggle Buttons

```
┌────────────────────────────────────────────────┐
│  [🗄️ Klien dari Database]  [➕ Input Manual]  │
│   (Active: Green gradient)  (Inactive: Gray)   │
└────────────────────────────────────────────────┘
```

**Active State:**
- Green gradient (Database mode)
- Purple-pink gradient (Manual mode)
- Scale 1.05
- Shadow-lg

**Inactive State:**
- Gray background
- Hover: lighter gray
- Normal scale

### Mode 1: Klien dari Database

```
┌─────────────────────────────────────┐
│ 🗄️ Pilih Nama Klien *               │
│ [Database Icon] [Dropdown ▼]        │
│                                      │
│ Options:                             │
│ - Andi Wijaya                        │
│ - Budi Setiawan                      │
│ - Citra Dewi                         │
│                                      │
│ (Auto-fill: name, phone, NIK)       │
└─────────────────────────────────────┘
```

**If no clients:**
```
⚠️ Tidak ada klien di database untuk PK ini.
   Gunakan Input Manual untuk mendaftar klien baru.
```

### Mode 2: Input Manual

```
┌─────────────────────────────────────┐
│ 👤 Nama Lengkap Klien *              │
│ [User Icon] [Input field]            │
│                                      │
│ 📞 Nomor Telepon Klien (Opsional)   │
│ [Phone Icon] [Input field]           │
│                                      │
│ 💳 NIK Klien (Opsional)              │
│ [Card Icon] [Input field]            │
│                                      │
│ ℹ️ Info: Data klien yang Anda       │
│   masukkan akan tersimpan untuk      │
│   pendaftaran berikutnya.            │
└─────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### State Management

```jsx
const [isManualInput, setIsManualInput] = useState(false)

// Toggle handler
const handleToggleManualInput = () => {
  setIsManualInput(!isManualInput)
  // Reset client data
  setFormData({ 
    ...formData, 
    client_id: '', 
    client_name: '', 
    client_phone: '', 
    client_nik: '' 
  })
}
```

### Form Data Structure

**Mode 1 (Database):**
```javascript
{
  service_id: 1,
  pk_id: 1,
  client_id: 1,              // From database
  client_name: "Andi Wijaya", // Auto-filled
  client_phone: "081...",     // Auto-filled
  client_nik: "3201..."       // Auto-filled
}
```

**Mode 2 (Manual):**
```javascript
{
  service_id: 1,
  pk_id: 1,
  client_id: '',              // Empty (new client)
  client_name: "Nama Baru",   // Manual input
  client_phone: "082...",     // Manual input
  client_nik: "3202..."       // Manual input
}
```

### Conditional Rendering

```jsx
{formData.pk_id && (
  <div>
    {/* Toggle Buttons */}
    <div className="flex gap-4">
      <button onClick={handleToggleManualInput}>
        Database
      </button>
      <button onClick={handleToggleManualInput}>
        Manual
      </button>
    </div>

    {/* Conditional Form */}
    {!isManualInput ? (
      // Dropdown existing clients
      <select>...</select>
    ) : (
      // Manual input fields
      <div>
        <input name="client_name" required />
        <input name="client_phone" />
        <input name="client_nik" />
      </div>
    )}
  </div>
)}
```

---

## 🎯 User Scenarios

### Scenario 1: Klien Sudah Ada di Database

**Step 1:** Pilih PK
```
User selects: "Budi Santoso, S.Sos"
```

**Step 2:** Mode Database (Default)
```
Toggle: [🗄️ Klien dari Database] (Active)
Dropdown shows:
- Andi Wijaya
- Budi Setiawan
- Citra Dewi
```

**Step 3:** Pilih Klien
```
User selects: "Andi Wijaya"
→ Auto-fill:
  - Name: Andi Wijaya
  - Phone: 081111111111
  - NIK: 3201010101900001
```

**Step 4:** Submit
```
Queue created with client_id = 1
```

### Scenario 2: Klien Baru (Belum di Database)

**Step 1:** Pilih PK
```
User selects: "Budi Santoso, S.Sos"
```

**Step 2:** Switch to Manual Mode
```
User clicks: [➕ Input Manual]
Toggle: [Input Manual] (Active - Purple gradient)
```

**Step 3:** Isi Data Manual
```
Nama Lengkap Klien: "Doni Prasetyo"
Nomor Telepon: "082123456789"
NIK: "3201010101900013"
```

**Step 4:** Submit
```
Queue created with:
- client_id: '' (empty)
- client_name: "Doni Prasetyo"
- client_phone: "082123456789"
- client_nik: "3201010101900013"
- pk_id: 1
```

### Scenario 3: PK Belum Punya Klien

**Step 1:** Pilih PK
```
User selects: PK yang belum punya klien
```

**Step 2:** Warning Muncul
```
⚠️ Tidak ada klien di database untuk PK ini.
   Gunakan Input Manual untuk mendaftar klien baru.
```

**Step 3:** Switch to Manual
```
User clicks: [➕ Input Manual]
```

**Step 4:** Isi Data & Submit
```
Manual input → Queue created
```

---

## 💡 Features

### 1. **Toggle Buttons**
- ✅ Visual indicator (gradient vs gray)
- ✅ Scale effect on active
- ✅ Smooth transitions
- ✅ Icons (Database vs UserPlus)

### 2. **Database Mode**
- ✅ Dropdown klien existing
- ✅ Auto-fill data on select
- ✅ Warning if no clients
- ✅ Filtered by PK

### 3. **Manual Mode**
- ✅ 3 input fields (name, phone, NIK)
- ✅ Name required, others optional
- ✅ Gradient icons
- ✅ Info box
- ✅ Validation

### 4. **Smart Behavior**
- ✅ Reset data on toggle
- ✅ Preserve PK selection
- ✅ Conditional validation
- ✅ Smooth animations

---

## 🎨 Styling Details

### Toggle Button Active (Database)
```css
bg-gradient-to-r from-green-500 to-emerald-600
text-white
shadow-lg
scale-105
```

### Toggle Button Active (Manual)
```css
bg-gradient-to-r from-purple-500 to-pink-600
text-white
shadow-lg
scale-105
```

### Toggle Button Inactive
```css
bg-gray-100
text-gray-600
hover:bg-gray-200
```

### Input Fields (Manual Mode)
```css
Icon Container:
- Blue-purple gradient (Name)
- Green-emerald gradient (Phone)
- Orange-red gradient (NIK)

Input:
- border-2 border-gray-300
- focus:ring-4 focus:ring-{color}-500/20
- rounded-xl
- py-4 px-5
```

### Info Box
```css
bg-purple-50
border-2 border-purple-200
rounded-xl
p-4
text-purple-800
```

---

## 📊 Data Flow

### Database Mode Flow:
```
1. User selects PK
   ↓
2. Fetch clients by PK
   GET /api/pk/{pk_id}/clients
   ↓
3. User selects client
   ↓
4. Auto-fill form data
   ↓
5. Submit with client_id
   POST /api/queue
   {
     pk_id: 1,
     client_id: 1,
     client_name: "Andi Wijaya"
   }
```

### Manual Mode Flow:
```
1. User selects PK
   ↓
2. User toggles to Manual
   ↓
3. User fills form manually
   ↓
4. Submit without client_id
   POST /api/queue
   {
     pk_id: 1,
     client_id: '',
     client_name: "Doni Prasetyo",
     client_phone: "082...",
     client_nik: "3201..."
   }
```

---

## 🔄 State Transitions

### Initial State
```
isManualInput: false
formData: {
  pk_id: '',
  client_id: '',
  client_name: '',
  ...
}
```

### After PK Selection
```
isManualInput: false (default)
formData: {
  pk_id: 1,
  client_id: '',
  client_name: '',
  ...
}
clientList: [fetched from API]
```

### Toggle to Manual
```
isManualInput: true
formData: {
  pk_id: 1,        // Preserved
  client_id: '',   // Reset
  client_name: '', // Reset
  ...
}
```

### Toggle Back to Database
```
isManualInput: false
formData: {
  pk_id: 1,        // Preserved
  client_id: '',   // Reset
  client_name: '', // Reset
  ...
}
clientList: [still available]
```

---

## ✅ Validation Rules

### Database Mode:
- ✅ PK required
- ✅ Client selection required
- ✅ Auto-filled data used

### Manual Mode:
- ✅ PK required
- ✅ Client name required
- ✅ Phone optional
- ✅ NIK optional

---

## 🎯 Benefits

### 1. **Flexibility**
- Support klien existing
- Support klien baru
- Easy to switch

### 2. **User-Friendly**
- Clear visual toggle
- Auto-fill untuk efficiency
- Manual untuk flexibility

### 3. **Data Integrity**
- Klien existing: linked via client_id
- Klien baru: stored with pk_id
- Both valid for queue creation

### 4. **Future-Proof**
- Manual data bisa di-import ke database later
- PK relationship maintained
- Easy to add client to database

---

## 🐛 Edge Cases Handled

### 1. **PK Tanpa Klien**
```
Show warning:
"⚠️ Tidak ada klien di database untuk PK ini.
   Gunakan Input Manual untuk mendaftar klien baru."

Solution: User switches to Manual mode
```

### 2. **Toggle Saat Ada Data**
```
When toggling, reset client data:
- client_id cleared
- client_name cleared
- client_phone cleared
- client_nik cleared

PK selection preserved
```

### 3. **Submit Validation**
```
Database mode:
- Require client_id OR client_name
- If client_id exists, use it
- If not, use manual data

Manual mode:
- Require client_name
- client_id will be empty
- Phone & NIK optional
```

---

## 📱 Responsive Design

### Desktop (> 768px)
```
Toggle buttons: flex-1 (equal width)
Form fields: full width
Spacing: generous (py-4)
```

### Mobile (< 768px)
```
Toggle buttons: stack or shrink
Form fields: full width
Spacing: compact (py-3)
Icons: slightly smaller
```

---

## 🎨 Visual Comparison

### Before (Old):
```
┌─────────────────────────────┐
│ Pilih PK *                   │
│ [Dropdown]                   │
│                              │
│ Pilih Klien *                │
│ [Dropdown only]              │
│                              │
│ ❌ No option for new clients │
└─────────────────────────────┘
```

### After (New):
```
┌─────────────────────────────┐
│ Pilih PK *                   │
│ [Dropdown]                   │
│                              │
│ [Database] [Manual]          │
│  (Toggle buttons)            │
│                              │
│ Mode 1: Dropdown existing    │
│ Mode 2: Manual input fields  │
│                              │
│ ✅ Support both scenarios    │
└─────────────────────────────┘
```

---

## 🚀 Usage Instructions

### For Existing Clients:

**1. Pilih PK**
```
Select from dropdown
```

**2. Use Database Mode (Default)**
```
Toggle already on "Klien dari Database"
```

**3. Pilih Klien**
```
Select from dropdown
Data auto-fills
```

**4. Submit**
```
Click "Daftar Sekarang"
```

### For New Clients:

**1. Pilih PK**
```
Select from dropdown
```

**2. Switch to Manual Mode**
```
Click "Input Manual" button
```

**3. Fill Form**
```
- Nama Lengkap Klien (required)
- Nomor Telepon (optional)
- NIK (optional)
```

**4. Submit**
```
Click "Daftar Sekarang"
```

---

## 💾 Backend Handling

### Queue Creation Logic:

```javascript
// Backend automatically handles both cases:

If client_id exists:
  → Use existing client data
  → Link to client record

If client_id empty but client_name exists:
  → Create queue with manual data
  → Store pk_id for relationship
  → Client can be added to database later
```

### Database Records:

**With client_id (Database mode):**
```sql
INSERT INTO queue (
  queue_number, service_id, 
  client_name, pk_id, client_id
) VALUES (
  'B001', 1, 
  'Andi Wijaya', 1, 1
)
```

**Without client_id (Manual mode):**
```sql
INSERT INTO queue (
  queue_number, service_id, 
  client_name, client_phone, client_nik, pk_id
) VALUES (
  'B002', 1, 
  'Doni Prasetyo', '082...', '3201...', 1
)
```

---

## ✅ Testing Checklist

### Database Mode:
- [ ] Toggle button shows green gradient
- [ ] Dropdown loads clients
- [ ] Select client auto-fills data
- [ ] Submit creates queue with client_id
- [ ] Warning shows if no clients

### Manual Mode:
- [ ] Toggle button shows purple gradient
- [ ] Manual input fields appear
- [ ] Name field required
- [ ] Phone & NIK optional
- [ ] Submit creates queue without client_id
- [ ] Info box displays

### Toggle Behavior:
- [ ] Clicking toggle switches mode
- [ ] Data resets on toggle
- [ ] PK selection preserved
- [ ] Smooth animations
- [ ] No errors on rapid toggle

---

## 📊 Summary

**What's New:**
- ✅ Toggle between Database vs Manual
- ✅ Database mode: dropdown existing clients
- ✅ Manual mode: 3 input fields
- ✅ Auto-fill in database mode
- ✅ Warning for empty client list
- ✅ Info box in manual mode
- ✅ Smooth transitions
- ✅ Gradient toggle buttons

**Files Modified:**
- `RegistrationForm.jsx` - Added toggle & manual input

**Benefits:**
- Support existing clients
- Support new clients
- Flexible workflow
- Better UX

---

**Manual Input Feature siap digunakan!** 📝✨

**Test sekarang:**
1. Pilih "Bimbingan Wajib Lapor"
2. Pilih PK
3. Toggle antara Database vs Manual
4. Test both flows!

**Perfect untuk klien baru yang belum di database!** 🎯🚀
