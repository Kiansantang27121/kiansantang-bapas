# 🗑️ FITUR RESET ANTRIAN (ADMIN)

## 📋 Overview

Fitur baru untuk Admin/Operator untuk mereset (menghapus) antrian dengan 2 opsi:
1. **Reset Hari Ini** - Menghapus semua antrian hari ini saja
2. **Reset Semua** - Menghapus SEMUA antrian (semua hari)

---

## 🎯 Features

### **1. Reset Hari Ini (Reset Today)**
- Menghapus semua antrian yang dibuat hari ini
- Lebih aman karena hanya menghapus data hari ini
- Berguna untuk testing atau reset harian

### **2. Reset Semua (Reset All)**
- Menghapus SEMUA antrian dari semua hari
- Sangat berbahaya - memerlukan 2x konfirmasi
- Berguna untuk reset total sistem

---

## 🔧 Implementation

### **Backend API Endpoints**

#### **1. POST /api/queue/reset/today**

**Description:** Reset antrian hari ini saja

**Authentication:** Required (Admin/Operator only)

**Request:**
```http
POST /api/queue/reset/today
Authorization: Bearer [token]
```

**Response:**
```json
{
  "success": true,
  "message": "Berhasil menghapus 12 antrian hari ini",
  "deleted_count": 12
}
```

**What it does:**
1. Count queues created today
2. Get queue IDs for today
3. Delete workflow records for those queues
4. Delete queues created today
5. Return count of deleted queues

---

#### **2. POST /api/queue/reset**

**Description:** Reset SEMUA antrian (ALL days)

**Authentication:** Required (Admin/Operator only)

**Request:**
```http
POST /api/queue/reset
Authorization: Bearer [token]
```

**Response:**
```json
{
  "success": true,
  "message": "Berhasil menghapus 156 antrian",
  "deleted_count": 156
}
```

**What it does:**
1. Count all queues
2. Delete ALL workflow records
3. Delete ALL queues
4. Return count of deleted queues

---

### **Frontend UI**

**Location:** `operator-app/src/pages/QueueManagement.jsx`

**UI Components:**

#### **Reset Buttons (Top Right)**
```jsx
<div className="flex gap-3">
  {/* Reset Today Button */}
  <button
    onClick={handleResetToday}
    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
  >
    <Trash2 className="w-5 h-5" />
    Reset Hari Ini
  </button>
  
  {/* Reset All Button */}
  <button
    onClick={handleResetAll}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
  >
    <AlertTriangle className="w-5 h-5" />
    Reset Semua
  </button>
</div>
```

**Button Colors:**
- 🟠 **Orange** - Reset Hari Ini (safer)
- 🔴 **Red** - Reset Semua (dangerous)

---

### **Confirmation Dialogs**

#### **Reset Today Confirmation:**
```
⚠️ PERINGATAN!

Anda akan menghapus SEMUA antrian HARI INI.
Tindakan ini TIDAK DAPAT dibatalkan!

Apakah Anda yakin ingin melanjutkan?
```

**Single confirmation** - karena hanya menghapus hari ini

---

#### **Reset All Confirmations:**

**First Confirmation:**
```
🚨 PERINGATAN KERAS!

Anda akan menghapus SEMUA antrian (SEMUA HARI).
Tindakan ini SANGAT BERBAHAYA dan TIDAK DAPAT dibatalkan!

Apakah Anda BENAR-BENAR yakin?
```

**Second Confirmation:**
```
⚠️ KONFIRMASI KEDUA

Ini adalah konfirmasi terakhir.
Semua data antrian akan HILANG PERMANEN!

Ketik OK untuk melanjutkan.
```

**Double confirmation** - karena sangat berbahaya

---

## 📊 Data Flow

### **Reset Today Flow:**
```
1. User clicks "Reset Hari Ini"
   ↓
2. Confirmation dialog
   ↓
3. User confirms
   ↓
4. POST /api/queue/reset/today
   ↓
5. Backend:
   - Count today's queues
   - Get queue IDs
   - Delete workflow records
   - Delete queues
   ↓
6. Response: "Berhasil menghapus X antrian hari ini"
   ↓
7. Refresh queue list
```

### **Reset All Flow:**
```
1. User clicks "Reset Semua"
   ↓
2. First confirmation dialog
   ↓
3. User confirms
   ↓
4. Second confirmation dialog
   ↓
5. User confirms again
   ↓
6. POST /api/queue/reset
   ↓
7. Backend:
   - Count all queues
   - Delete ALL workflow records
   - Delete ALL queues
   ↓
8. Response: "Berhasil menghapus X antrian"
   ↓
9. Refresh queue list
```

---

## 🔒 Security

### **Authentication:**
- ✅ Requires valid JWT token
- ✅ Only Admin/Operator role can access
- ✅ Uses `authenticateToken` middleware
- ✅ Uses `requireOperator` middleware

### **Authorization:**
```javascript
router.post('/reset', authenticateToken, requireOperator, (req, res) => {
  // Only authenticated admin/operator can execute
})
```

### **Confirmation:**
- ✅ Reset Today: 1 confirmation
- ✅ Reset All: 2 confirmations (double safety)

---

## 🗄️ Database Operations

### **Reset Today:**
```sql
-- 1. Count today's queues
SELECT COUNT(*) as count 
FROM queue 
WHERE DATE(created_at) = CURRENT_DATE

-- 2. Get queue IDs
SELECT id 
FROM queue 
WHERE DATE(created_at) = CURRENT_DATE

-- 3. Delete workflow records
DELETE FROM queue_workflow 
WHERE queue_id IN (...)

-- 4. Delete queues
DELETE FROM queue 
WHERE DATE(created_at) = CURRENT_DATE
```

### **Reset All:**
```sql
-- 1. Count all queues
SELECT COUNT(*) as count FROM queue

-- 2. Delete all workflow records
DELETE FROM queue_workflow

-- 3. Delete all queues
DELETE FROM queue
```

---

## 📋 Files Modified/Created

### **Backend:**
1. ✅ `backend/routes/queue.js` - Added 2 new endpoints
   - `POST /reset/today`
   - `POST /reset`

### **Frontend:**
1. ✅ `operator-app/src/pages/QueueManagement.jsx` - Added UI & handlers
   - Import `Trash2` and `AlertTriangle` icons
   - Added `handleResetToday()` function
   - Added `handleResetAll()` function
   - Added reset buttons in header

### **Documentation:**
1. ✅ `FITUR-RESET-ANTRIAN.md` - This file

---

## 🧪 Testing

### **Test 1: Reset Today**
```
1. Login as admin
2. Go to "Manajemen Antrian"
3. Click "Reset Hari Ini" (orange button)
4. Confirm dialog
5. ✅ Should see success message
6. ✅ Today's queues should be deleted
7. ✅ Queue list should refresh
```

### **Test 2: Reset All**
```
1. Login as admin
2. Go to "Manajemen Antrian"
3. Click "Reset Semua" (red button)
4. Confirm first dialog
5. Confirm second dialog
6. ✅ Should see success message
7. ✅ ALL queues should be deleted
8. ✅ Queue list should be empty
```

### **Test 3: Cancel Reset**
```
1. Click reset button
2. Click "Cancel" on confirmation
3. ✅ No queues should be deleted
4. ✅ Queue list unchanged
```

### **Test 4: Non-Admin Access**
```
1. Login as non-admin (e.g., PK)
2. Try to access reset endpoint directly
3. ✅ Should get 403 Forbidden
4. ✅ No data should be deleted
```

---

## ⚠️ Important Notes

### **Data Loss Warning:**
- ⚠️ Reset operations are **PERMANENT**
- ⚠️ **NO UNDO** - data cannot be recovered
- ⚠️ Use with **EXTREME CAUTION**

### **Best Practices:**
1. ✅ Always backup database before reset
2. ✅ Use "Reset Today" instead of "Reset All" when possible
3. ✅ Double-check before confirming
4. ✅ Only use in testing or maintenance

### **When to Use:**

**Reset Today:**
- End of day cleanup
- Testing new features
- Daily maintenance
- Remove test data

**Reset All:**
- Complete system reset
- Before production deployment
- Major testing phase
- Database cleanup

---

## 🎨 UI Design

### **Button Placement:**
```
┌─────────────────────────────────────────────────────┐
│  Manajemen Antrian    [Reset Hari Ini] [Reset Semua]│
└─────────────────────────────────────────────────────┘
```

### **Button Styles:**

**Reset Hari Ini (Orange):**
- Background: `bg-orange-500`
- Hover: `bg-orange-600`
- Icon: `Trash2`
- Shadow: `shadow-lg`

**Reset Semua (Red):**
- Background: `bg-red-600`
- Hover: `bg-red-700`
- Icon: `AlertTriangle`
- Shadow: `shadow-lg`

---

## 📊 Success Messages

### **Reset Today:**
```
✅ Berhasil menghapus 12 antrian hari ini
```

### **Reset All:**
```
✅ Berhasil menghapus 156 antrian
```

### **Error Messages:**
```
❌ Gagal mereset antrian hari ini
❌ Gagal mereset semua antrian
```

---

## 🔄 Auto-Refresh

After successful reset:
1. ✅ Queue list automatically refreshes
2. ✅ Shows updated (empty or reduced) list
3. ✅ No manual refresh needed

---

## 🎯 Use Cases

### **Use Case 1: Daily Reset**
**Scenario:** Admin wants to clear today's test queues at end of day

**Steps:**
1. Click "Reset Hari Ini"
2. Confirm
3. Today's queues deleted
4. Ready for tomorrow

---

### **Use Case 2: System Maintenance**
**Scenario:** Admin needs to clean entire database

**Steps:**
1. Backup database first
2. Click "Reset Semua"
3. Confirm twice
4. All queues deleted
5. Fresh start

---

### **Use Case 3: Testing**
**Scenario:** Developer testing queue system

**Steps:**
1. Create test queues
2. Test features
3. Click "Reset Hari Ini"
4. Clean slate for next test

---

## 📈 Benefits

### **For Admin:**
- ✅ Easy queue management
- ✅ Quick cleanup
- ✅ No SQL knowledge needed
- ✅ Safe with confirmations

### **For System:**
- ✅ Database maintenance
- ✅ Remove old data
- ✅ Performance optimization
- ✅ Clean testing environment

### **For Development:**
- ✅ Easy testing
- ✅ Quick reset
- ✅ No manual database access
- ✅ Consistent state

---

## 🚨 Safety Features

1. ✅ **Authentication Required** - Only logged-in users
2. ✅ **Authorization Check** - Only admin/operator role
3. ✅ **Confirmation Dialogs** - Prevent accidental clicks
4. ✅ **Double Confirmation** - For dangerous operations
5. ✅ **Clear Warnings** - User knows what will happen
6. ✅ **Success Feedback** - Shows how many deleted
7. ✅ **Error Handling** - Graceful failure messages

---

## 📝 Code Examples

### **Backend Endpoint:**
```javascript
router.post('/reset/today', authenticateToken, requireOperator, (req, res) => {
  try {
    const beforeCount = db.prepare('SELECT COUNT(*) as count FROM queue WHERE DATE(created_at) = CURRENT_DATE').get();
    const queueIds = db.prepare('SELECT id FROM queue WHERE DATE(created_at) = CURRENT_DATE').all();
    
    if (queueIds.length > 0) {
      const placeholders = queueIds.map(() => '?').join(',');
      db.prepare(`DELETE FROM queue_workflow WHERE queue_id IN (${placeholders})`).run(...queueIds.map(q => q.id));
    }
    
    db.prepare('DELETE FROM queue WHERE DATE(created_at) = CURRENT_DATE').run();
    
    res.json({ 
      success: true, 
      message: `Berhasil menghapus ${beforeCount.count} antrian hari ini`,
      deleted_count: beforeCount.count
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mereset antrian hari ini' });
  }
});
```

### **Frontend Handler:**
```javascript
const handleResetToday = async () => {
  const confirmed = window.confirm(
    '⚠️ PERINGATAN!\n\n' +
    'Anda akan menghapus SEMUA antrian HARI INI.\n' +
    'Tindakan ini TIDAK DAPAT dibatalkan!\n\n' +
    'Apakah Anda yakin ingin melanjutkan?'
  )
  
  if (!confirmed) return

  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      `${API_URL}/queue/reset/today`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    
    alert(`✅ ${response.data.message}`)
    fetchQueues()
  } catch (error) {
    alert(error.response?.data?.error || 'Gagal mereset antrian hari ini')
  }
}
```

---

## 🎉 Summary

### **Features Added:**
- ✅ Reset Today button (orange)
- ✅ Reset All button (red)
- ✅ 2 new API endpoints
- ✅ Confirmation dialogs
- ✅ Success/error messages
- ✅ Auto-refresh after reset

### **Safety Measures:**
- ✅ Authentication required
- ✅ Admin/Operator only
- ✅ Confirmation dialogs
- ✅ Double confirmation for Reset All
- ✅ Clear warning messages

### **Benefits:**
- ✅ Easy queue management
- ✅ Quick cleanup
- ✅ Safe operations
- ✅ Better testing workflow

---

**Status:** ✅ **FITUR RESET ANTRIAN READY!**

**Tombol reset sudah tersedia di halaman Manajemen Antrian untuk role Admin/Operator!** 🗑️✨

---

**Last Updated:** November 9, 2025 - 20:50 WIB
