# 📊 Google Sheets Integration - PK Database

## ✨ Fitur Baru

### 1. **Database PK dengan Jabatan**
- Kolom baru: `jabatan` di tabel PK
- Tampil di dropdown dan info PK

### 2. **Google Sheets Sync**
- Sync data PK dari Google Sheets
- Format CSV auto-parse
- Update existing atau insert new

### 3. **Search/Filter Feature**
- Search PK: nama, NIP, jabatan
- Search Klien: nama, NIK
- Real-time filtering

---

## 🎯 Setup Google Sheets

### Format Google Sheets yang Diperlukan:

**Header Row (Baris 1):**
```
Nama | NIP | Telepon | Jabatan
```

**Contoh Data:**
```
Nama                      | NIP                | Telepon       | Jabatan
Budi Santoso, S.Sos       | 198501012010011001 | 081234567890  | Pembimbing Kemasyarakatan Ahli Muda
Siti Nurhaliza, S.H.      | 198702022011012002 | 081234567891  | Pembimbing Kemasyarakatan Ahli Madya
Ahmad Fauzi, S.Psi        | 198903032012011003 | 081234567892  | Pembimbing Kemasyarakatan Ahli Muda
```

### Langkah Setup:

**1. Buat Google Sheet Baru**
- Buka https://sheets.google.com
- Klik "Blank" untuk sheet baru
- Isi header: Nama, NIP, Telepon, Jabatan
- Isi data PK

**2. Set Permission**
- Klik "Share" (pojok kanan atas)
- Change to "Anyone with the link"
- Set to "Viewer"
- Copy link

**3. Sync ke Sistem**
- Login ke Operator Dashboard
- Menu "Settings" → "Google Sheets"
- Paste Google Sheets URL
- Klik "Sync Now"

---

## 🔧 Backend Changes

### 1. Migration - Add Jabatan Column

**File:** `backend/migrations/add_jabatan_to_pk.js`

```javascript
ALTER TABLE pk ADD COLUMN jabatan TEXT
```

**Run:**
```powershell
cd backend
node migrations/add_jabatan_to_pk.js
```

### 2. Google Sheets API

**File:** `backend/routes/googleSheets.js`

**Endpoints:**

**POST /api/google-sheets/sync-pk**
- Body: `{ "sheetUrl": "https://docs.google.com/..." }`
- Sync PK from Google Sheets
- Response:
  ```json
  {
    "success": true,
    "synced": 3,
    "updated": 2,
    "errors": 0
  }
  ```

**GET /api/google-sheets/pk-sheet-url**
- Get saved Google Sheets URL
- Response:
  ```json
  {
    "url": "https://docs.google.com/..."
  }
  ```

### 3. Updated PK Routes

**File:** `backend/routes/pk.js`

**Changes:**
- POST /api/pk - Added `jabatan` field
- PUT /api/pk/:id - Added `jabatan` field
- GET /api/pk - Returns `jabatan` in response

---

## 🎨 Frontend Changes

### 1. Search Feature - Registration Form

**File:** `registration-app/src/components/RegistrationForm.jsx`

**PK Search:**
```jsx
// Search input
<input 
  placeholder="Cari nama, NIP, atau jabatan..."
  value={pkSearch}
  onChange={(e) => setPkSearch(e.target.value)}
/>

// Filtered dropdown
<select>
  {filteredPkList.map(pk => (
    <option>{pk.name} - {pk.jabatan}</option>
  ))}
</select>
```

**Client Search:**
```jsx
// Search input
<input 
  placeholder="Cari nama atau NIK klien..."
  value={clientSearch}
  onChange={(e) => setClientSearch(e.target.value)}
/>

// Filtered dropdown
<select>
  {filteredClientList.map(client => (
    <option>{client.name} ({client.nik})</option>
  ))}
</select>
```

**Filter Logic:**
```javascript
// PK Filter
useEffect(() => {
  const filtered = pkList.filter(pk => 
    pk.name.toLowerCase().includes(pkSearch.toLowerCase()) ||
    (pk.nip && pk.nip.includes(pkSearch)) ||
    (pk.jabatan && pk.jabatan.toLowerCase().includes(pkSearch.toLowerCase()))
  )
  setFilteredPkList(filtered)
}, [pkSearch, pkList])

// Client Filter
useEffect(() => {
  const filtered = clientList.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.nik && client.nik.includes(clientSearch))
  )
  setFilteredClientList(filtered)
}, [clientSearch, clientList])
```

---

## 📊 UI Design

### PK Selection with Search

```
┌─────────────────────────────────────┐
│ 🔍 Pilih PK *                        │
│                                      │
│ [🔍 Search Icon] [Input]             │
│ Cari nama, NIP, atau jabatan...      │
│                                      │
│ [👨‍💼 PK Icon] [Dropdown ▼]           │
│ -- Pilih PK --                       │
│ Budi Santoso - PK Ahli Muda          │
│ Siti Nurhaliza - PK Ahli Madya       │
│                                      │
│ ℹ️ Info Box:                         │
│ NIP: 198501012010011001              │
│ Telepon: 081234567890                │
│ Jabatan: PK Ahli Muda                │
└─────────────────────────────────────┘
```

### Client Selection with Search

```
┌─────────────────────────────────────┐
│ 👤 Pilih Klien *                     │
│                                      │
│ [🔍 Search Icon] [Input]             │
│ Cari nama atau NIK klien...          │
│                                      │
│ [🗄️ Database Icon] [Dropdown ▼]      │
│ -- Pilih Klien --                    │
│ Andi Wijaya (3201010101900001)       │
│ Budi Setiawan (3201010101900002)     │
└─────────────────────────────────────┘
```

---

## 🚀 Installation Steps

### STEP 1: Install Dependencies

```powershell
cd backend
npm install axios
```

### STEP 2: Run Migration

```powershell
cd backend
node migrations/add_jabatan_to_pk.js
```

**Expected Output:**
```
Adding jabatan column to pk table...
✅ jabatan column added
Updating existing PK with jabatan...
✅ Jabatan updated for existing PK
Migration completed successfully!
```

### STEP 3: Restart Backend

```powershell
cd backend
npm run dev
```

### STEP 4: Restart Registration App

```powershell
cd registration-app
npm run dev
```

---

## 🎯 Usage Flow

### Scenario 1: Sync from Google Sheets

**1. Prepare Google Sheet:**
```
Header: Nama | NIP | Telepon | Jabatan
Data: Fill with PK information
Share: Anyone with link can view
```

**2. Sync via API:**
```bash
POST http://localhost:3000/api/google-sheets/sync-pk
{
  "sheetUrl": "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
}
```

**3. Response:**
```json
{
  "success": true,
  "message": "Sync completed: 3 new PK added, 2 PK updated, 0 errors",
  "synced": 3,
  "updated": 2,
  "errors": 0
}
```

### Scenario 2: Search PK

**1. User opens registration form**
**2. Clicks "Bimbingan Wajib Lapor"**
**3. Types in search: "Ahli Muda"**
**4. Dropdown filters to show only PK with "Ahli Muda" jabatan**
**5. Select PK → Info shows with jabatan**

### Scenario 3: Search Client

**1. After selecting PK**
**2. Types in client search: "Andi"**
**3. Dropdown filters to show only clients with "Andi" in name**
**4. Select client → Auto-fill data**

---

## 📊 Data Flow

### Google Sheets → Database

```
1. User provides Google Sheets URL
   ↓
2. Backend extracts Sheet ID
   ↓
3. Convert to CSV export URL
   ↓
4. Fetch CSV data via axios
   ↓
5. Parse CSV (split by newline & comma)
   ↓
6. Extract columns: Nama, NIP, Telepon, Jabatan
   ↓
7. For each row:
   - Check if PK exists (by NIP or name)
   - If exists: UPDATE
   - If not: INSERT
   ↓
8. Save Google Sheets URL to settings
   ↓
9. Return sync results
```

### Search/Filter Flow

```
1. User types in search input
   ↓
2. onChange triggers setPkSearch/setClientSearch
   ↓
3. useEffect detects search change
   ↓
4. Filter list based on search term
   ↓
5. Update filteredPkList/filteredClientList
   ↓
6. Dropdown re-renders with filtered results
   ↓
7. Show "No results" if filtered list empty
```

---

## 🎨 Visual Elements

### Search Input (PK)
```css
Icon: Purple-pink gradient (Search icon)
Input: 
- border-2 border-gray-300
- focus:ring-4 focus:ring-purple-500/20
- rounded-xl
- placeholder: "Cari nama, NIP, atau jabatan..."
```

### Search Input (Client)
```css
Icon: Orange-red gradient (Search icon)
Input:
- border-2 border-gray-300
- focus:ring-4 focus:ring-orange-500/20
- rounded-xl
- placeholder: "Cari nama atau NIK klien..."
```

### Info Box (with Jabatan)
```css
bg-blue-50
border border-blue-200
rounded-lg
text-blue-800

Content:
- NIP: xxx
- Telepon: xxx
- Jabatan: xxx (NEW!)
```

---

## 🐛 Troubleshooting

### Problem 1: Google Sheets Access Denied

**Error:**
```
403 Forbidden
Access denied
```

**Solution:**
1. Open Google Sheet
2. Click "Share"
3. Change to "Anyone with the link"
4. Set to "Viewer"
5. Try sync again

### Problem 2: Column Not Found

**Error:**
```
Column "Nama" not found in Google Sheets
```

**Solution:**
1. Check header row (row 1)
2. Must have: Nama, NIP, Telepon, Jabatan
3. Case-insensitive but must include these words
4. Fix headers and try again

### Problem 3: Search Not Working

**Issue:** Typing in search doesn't filter

**Solution:**
1. Check browser console for errors
2. Refresh page (Ctrl+R)
3. Clear search input and try again
4. Check if pkList/clientList has data

### Problem 4: Jabatan Not Showing

**Issue:** Jabatan column empty

**Solution:**
1. Run migration first:
   ```
   node migrations/add_jabatan_to_pk.js
   ```
2. Sync from Google Sheets
3. Or manually update via API:
   ```
   PUT /api/pk/:id
   { "jabatan": "PK Ahli Muda" }
   ```

---

## ✅ Testing Checklist

### Backend:
- [ ] Migration adds jabatan column
- [ ] POST /api/pk accepts jabatan
- [ ] PUT /api/pk updates jabatan
- [ ] GET /api/pk returns jabatan
- [ ] Google Sheets sync works
- [ ] CSV parsing correct
- [ ] Duplicate handling (update vs insert)

### Frontend - PK Search:
- [ ] Search input appears
- [ ] Typing filters dropdown
- [ ] Search by name works
- [ ] Search by NIP works
- [ ] Search by jabatan works
- [ ] "No results" message shows
- [ ] Clear search shows all

### Frontend - Client Search:
- [ ] Search input appears (after PK selected)
- [ ] Typing filters dropdown
- [ ] Search by name works
- [ ] Search by NIK works
- [ ] "No results" message shows
- [ ] Clear search shows all

### Integration:
- [ ] Google Sheets URL saved
- [ ] Sync adds new PK
- [ ] Sync updates existing PK
- [ ] Jabatan shows in dropdown
- [ ] Jabatan shows in info box
- [ ] Search works with synced data

---

## 📊 Summary

**New Features:**
- ✅ Jabatan column in PK table
- ✅ Google Sheets integration
- ✅ CSV auto-parse
- ✅ Sync endpoint
- ✅ Search PK (nama, NIP, jabatan)
- ✅ Search Client (nama, NIK)
- ✅ Real-time filtering
- ✅ "No results" feedback

**Files Created:**
- `migrations/add_jabatan_to_pk.js`
- `routes/googleSheets.js`

**Files Modified:**
- `routes/pk.js` - Added jabatan field
- `server.js` - Added Google Sheets route
- `package.json` - Added axios dependency
- `RegistrationForm.jsx` - Added search feature

**Benefits:**
- Easy PK management via Google Sheets
- Fast search/filter for large lists
- Better UX with jabatan info
- Sync keeps data up-to-date

---

**Google Sheets Integration & Search Feature siap digunakan!** 📊🔍✨
