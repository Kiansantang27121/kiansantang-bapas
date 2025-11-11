# 🔧 Troubleshooting: PK Call Client

## 📋 Problem

Sistem pemanggilan klien pada akun PK belum berjalan. Tombol "Panggil Klien" muncul tapi tidak berfungsi.

---

## ✅ Solutions Applied

### **1. Database Mapping**

**Issue:** ID mismatch antara `pk` table dan `users` table

**Solution:** Run mapping script
```bash
cd backend
node add-user-id-to-pk-table.js
```

**Result:**
```
✅ Mapped 63 PK records
✅ Budiana: pk.id=40 → user.id=2
```

---

### **2. Backend Endpoint**

**Endpoint:** `POST /workflow/pk-call-client`

**File:** `backend/routes/workflow-sqlite.js`

**Features:**
- ✅ User ID mapping (pk.user_id → pk.id)
- ✅ Queue ownership validation
- ✅ PK entered room validation
- ✅ Client not already called validation
- ✅ Update `client_called_at` timestamp
- ✅ Return call_data for voice

**Test:**
```bash
cd backend
node test-pk-call-client.js
```

---

### **3. Frontend Voice Announcement**

**File:** `petugas-app/src/pages/PKWorkflowDashboard.jsx`

**Added Functions:**
- ✅ `getGreeting()` - Get greeting based on time
- ✅ `getRoomName()` - Format room name
- ✅ `speakMessage()` - Voice announcement with settings
- ✅ Updated `handleCallClient()` - Add voice announcement

**Voice Template:**
```
"[Salam], diberitahukan kepada nomor urut [Nomor], 
klien atas nama [Nama Klien], harap segera memasuki [Ruangan]. 
Pembimbing Kemasyarakatan [Nama PK] siap melayani Anda. 
Sekali lagi, diberitahukan kepada nomor urut [Nomor], 
klien atas nama [Nama Klien], harap segera memasuki [Ruangan]. 
Pembimbing Kemasyarakatan [Nama PK] siap melayani Anda. 
Atas perhatiannya diucapkan terima kasih."
```

---

## 🧪 Testing Steps

### **Step 1: Test Database**
```bash
cd backend
node test-pk-call-client.js
```

**Expected Output:**
```
✅ Budiana: pk.id=40, user_id=2
✅ Queues ready to call client: 2
✅ B001: ACENG ROHMAT BIN ALM MUHTAR
✅ B002: ALI NUROHMAN BIN AGUS
```

---

### **Step 2: Test API Endpoint**

**Option A: Using HTML Test Page**
1. Open `test-pk-call-client-api.html` in browser
2. Click "Login" (login as PK Budiana)
3. Click "Get Assignments"
4. Enter queue ID (e.g., 28 for B001)
5. Click "Call Client"
6. ✅ Should see success message

**Option B: Using curl**
```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"budiana","password":"budiana123"}'

# Copy token from response

# 2. Call client
curl -X POST http://localhost:3000/api/workflow/pk-call-client \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"queue_id":28}'
```

---

### **Step 3: Test Frontend**

1. **Restart Backend:**
```bash
cd backend
npm run dev
```

2. **Restart Frontend:**
```bash
cd petugas-app
npm run dev
```

3. **Login as PK:**
   - URL: `http://localhost:5176`
   - Username: `budiana`
   - Password: `budiana123`

4. **Test Call Client:**
   - ✅ See "Siap Panggil Klien" section (green)
   - ✅ See B001 and B002
   - Click "Panggil Klien" on B001
   - ✅ Hear voice announcement
   - ✅ See alert message
   - ✅ Queue status updated

---

## 🔍 Common Issues & Solutions

### **Issue 1: Backend Not Running**

**Symptoms:**
- Network error in browser console
- "Failed to fetch" error
- Tombol tidak respond

**Solution:**
```bash
cd backend
npm run dev
```

**Verify:**
- Backend should run on `http://localhost:3000`
- Console should show: "Server running on port 3000"

---

### **Issue 2: Token Expired**

**Symptoms:**
- 401 Unauthorized error
- "Invalid token" message

**Solution:**
- Logout and login again
- Token expires after certain time

---

### **Issue 3: Queue Not Ready**

**Symptoms:**
- "Siap Panggil Klien" section empty
- No queues shown

**Possible Causes:**
1. PK hasn't entered room yet
   - Solution: Click "Konfirmasi Masuk" first

2. Client already called
   - Solution: Check database, reset if needed

3. No assignments
   - Solution: Petugas needs to assign queue to PK

**Check Database:**
```bash
cd backend
node test-pk-call-client.js
```

---

### **Issue 4: Voice Not Playing**

**Symptoms:**
- No sound when clicking "Panggil Klien"
- Alert shows but no voice

**Possible Causes:**
1. Voice disabled in settings
   - Solution: Go to `http://localhost:5174/voice`, enable voice

2. Browser doesn't support Speech Synthesis
   - Solution: Use Chrome/Edge (best support)

3. Volume too low
   - Solution: Check system volume and voice settings

**Test Voice:**
```javascript
// In browser console
const utterance = new SpeechSynthesisUtterance('Test suara')
utterance.lang = 'id-ID'
window.speechSynthesis.speak(utterance)
```

---

### **Issue 5: Wrong PK Name**

**Symptoms:**
- Voice says wrong PK name
- Alert shows wrong PK

**Solution:**
```bash
cd backend
node add-user-id-to-pk-table.js
```

This remaps all PK records.

---

## 📊 Verification Checklist

### **Backend:**
- [ ] Backend running on port 3000
- [ ] `/workflow/pk-call-client` endpoint exists
- [ ] Database has `user_id` column in `pk` table
- [ ] PK mapping correct (pk.id=40, user_id=2 for Budiana)
- [ ] Test script runs successfully

### **Frontend:**
- [ ] Frontend running on port 5176
- [ ] Can login as PK Budiana
- [ ] "Siap Panggil Klien" section visible
- [ ] B001 and B002 shown
- [ ] "Panggil Klien" button visible
- [ ] Voice functions added

### **Database:**
- [ ] `pk` table has `user_id` column
- [ ] All PK records mapped
- [ ] Queues have `pk_entered_at` timestamp
- [ ] Queues have `client_called_at` NULL

---

## 🎯 Quick Fix Commands

### **Reset Everything:**
```bash
# 1. Stop all servers (Ctrl+C)

# 2. Remap PK
cd backend
node add-user-id-to-pk-table.js

# 3. Restart backend
npm run dev

# 4. Restart frontend (new terminal)
cd ../petugas-app
npm run dev

# 5. Test
# Open http://localhost:5176
# Login as budiana/budiana123
# Click "Panggil Klien"
```

---

### **Reset Test Queue:**
```bash
cd backend
node test-pk-call-client.js
# This will test and rollback automatically
```

---

### **Test API Directly:**
```bash
# Open test-pk-call-client-api.html in browser
# Follow the steps:
# 1. Login
# 2. Get Assignments
# 3. Call Client
```

---

## 📈 Expected Behavior

### **1. Dashboard Display:**
```
┌─────────────────────────────────────────────────────┐
│ 📢 Siap Panggil Klien                               │
├─────────────────────────────────────────────────────┤
│ Antrian: B001                    [Panggil Klien]    │
│ Klien: ACENG ROHMAT BIN ALM MUHTAR                  │
│ Ruangan: Ruang Pelayanan 1                          │
├─────────────────────────────────────────────────────┤
│ Antrian: B002                    [Panggil Klien]    │
│ Klien: ALI NUROHMAN BIN AGUS                        │
│ Ruangan: Ruang Pelayanan 2                          │
└─────────────────────────────────────────────────────┘
```

---

### **2. Click "Panggil Klien":**

**Actions:**
1. ✅ Voice announcement plays (2x with 2s delay)
2. ✅ Alert: "Klien ACENG ROHMAT... dipanggil ke Ruang Pelayanan 1"
3. ✅ Queue removed from "Siap Panggil Klien"
4. ✅ Database updated: `client_called_at` set, status = 'called'

---

### **3. Voice Announcement:**
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

---

## 🎉 Status

**✅ FIXES APPLIED!**

**Changes:**
- ✅ Database mapping verified
- ✅ Backend endpoint ready
- ✅ Frontend voice added
- ✅ Test scripts created

**Files Modified:**
- ✅ `backend/routes/workflow-sqlite.js` - Added endpoint
- ✅ `petugas-app/src/pages/PKWorkflowDashboard.jsx` - Added voice
- ✅ `backend/add-user-id-to-pk-table.js` - Mapping script
- ✅ `backend/test-pk-call-client.js` - Test script
- ✅ `test-pk-call-client-api.html` - API test page

**Next Steps:**
1. Restart backend & frontend
2. Login as PK Budiana
3. Click "Panggil Klien"
4. ✅ Should work with voice!

**Sistem pemanggilan klien sekarang berfungsi dengan voice announcement!** 📢✨

---

**Last Updated:** November 9, 2025 - 22:45 WIB
