# 🔄 HYBRID PK SYSTEM - IMPLEMENTATION GUIDE

## ✅ STATUS: PARTIALLY IMPLEMENTED

### **Completed:**
1. ✅ Database migration (pk_sessions table, jenjang columns)
2. ✅ 4 shared accounts created
3. ✅ Backend PK Auth endpoints (`/api/pk-auth/*`)
4. ✅ PK Selection page component

### **Remaining:**
1. ⏳ Update App.jsx routing
2. ⏳ Update AuthContext for session management
3. ⏳ Update PKWorkflowDashboard to use session
4. ⏳ Test complete flow

---

## 📋 WHAT'S BEEN DONE

### **1. Database Schema**

**Tables Created:**
```sql
-- pk_sessions: Track who's using which PK
CREATE TABLE pk_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,      -- Shared account ID
  pk_id INTEGER NOT NULL,         -- Selected PK ID
  pk_name TEXT NOT NULL,
  jenjang TEXT,
  login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  logout_time DATETIME,
  is_active INTEGER DEFAULT 1
);

-- users: Added jenjang column
ALTER TABLE users ADD COLUMN jenjang TEXT;

-- pk: Added jenjang column
ALTER TABLE pk ADD COLUMN jenjang TEXT DEFAULT 'pertama';
```

---

### **2. Shared Accounts Created**

| Username | Password | Jenjang | Role |
|----------|----------|---------|------|
| pk_madya | madya2025 | madya | pk |
| pk_muda | muda2025 | muda | pk |
| pk_pertama | pertama2025 | pertama | pk |
| apk | apk2025 | apk | pk |

---

### **3. Backend API Endpoints**

**File:** `backend/routes/pk-auth.js`

**Endpoints:**

```javascript
GET  /api/pk-auth/available-pk      // Get PK list by jenjang
POST /api/pk-auth/select-pk         // Select PK & create session
GET  /api/pk-auth/current-session   // Get active session
POST /api/pk-auth/logout-session    // Logout session
GET  /api/pk-auth/session-history   // Get session history
```

**Example Flow:**

```javascript
// 1. Login with shared account
POST /api/auth/login
{
  username: "pk_madya",
  password: "madya2025"
}
Response: { token, user: { id, username, jenjang: "madya" } }

// 2. Get available PK
GET /api/pk-auth/available-pk
Headers: { Authorization: "Bearer <token>" }
Response: { pk_list: [...] }

// 3. Select PK
POST /api/pk-auth/select-pk
{ pk_id: 40 }
Response: { session: { pk_id, pk_name, ... } }

// 4. Check current session
GET /api/pk-auth/current-session
Response: { has_session: true, session: {...} }
```

---

### **4. Frontend Component**

**File:** `petugas-app/src/pages/PKSelection.jsx`

**Features:**
- ✅ Display PK list by jenjang
- ✅ Select PK button
- ✅ Loading states
- ✅ Session check
- ✅ Logout option

**UI:**
```
┌─────────────────────────────────────────────────────┐
│ Pilih PK yang Bertugas                              │
│ Login sebagai: PK Madya (Shared)                    │
│ Jenjang: MADYA                              [Keluar]│
├─────────────────────────────────────────────────────┤
│ Daftar PK MADYA                            [10 PK]  │
│                                                     │
│ ┌──────────────────┐ ┌──────────────────┐         │
│ │ 👤 Budiana       │ │ 👤 Ryan Rizkia   │         │
│ │ NIP: 123456      │ │ NIP: 234567      │         │
│ │ [MADYA]          │ │ [MADYA]          │         │
│ └──────────────────┘ └──────────────────┘         │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 REMAINING IMPLEMENTATION

### **Step 1: Update App.jsx**

**File:** `petugas-app/src/App.jsx`

**Add Route:**
```javascript
import PKSelection from './pages/PKSelection'

<Route path="/pk-selection" element={<PKSelection />} />
```

**Update PrivateRoute:**
```javascript
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" />
  
  // Check if PK role and needs selection
  if (user.role === 'pk' && needsPKSelection()) {
    return <Navigate to="/pk-selection" />
  }
  
  return children
}
```

---

### **Step 2: Update AuthContext**

**File:** `petugas-app/src/context/AuthContext.jsx`

**Add Session Management:**
```javascript
const [pkSession, setPkSession] = useState(null)

// Check session on mount
useEffect(() => {
  if (user && user.role === 'pk') {
    checkPKSession()
  }
}, [user])

const checkPKSession = async () => {
  try {
    const response = await axios.get(`${API_URL}/pk-auth/current-session`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (response.data.has_session) {
      setPkSession(response.data.session)
    }
  } catch (error) {
    console.error('Error checking session:', error)
  }
}

// Provide session in context
return (
  <AuthContext.Provider value={{ 
    user, 
    pkSession,
    login, 
    logout,
    checkPKSession
  }}>
    {children}
  </AuthContext.Provider>
)
```

---

### **Step 3: Update PKWorkflowDashboard**

**File:** `petugas-app/src/pages/PKWorkflowDashboard.jsx`

**Use Session Instead of User:**
```javascript
const { user, pkSession } = useAuth()

// Display session info
<div className="bg-white rounded-xl p-4">
  <p>Bertugas sebagai: <strong>{pkSession?.pk_name}</strong></p>
  <p className="text-sm text-gray-600">
    Login: {user?.username} | NIP: {pkSession?.pk_nip}
  </p>
</div>

// Use pk_id from session
const fetchData = async () => {
  const pk_id = pkSession?.pk_id
  // ... fetch assignments using pk_id
}
```

---

### **Step 4: Update workflow endpoints**

**File:** `backend/routes/workflow-sqlite.js`

**Update `/my-assignments`:**
```javascript
router.get('/my-assignments', authenticateToken, requireRole(['pk']), (req, res) => {
  const user_id = req.user.id;
  
  // Get active session
  const session = db.prepare(`
    SELECT pk_id FROM pk_sessions 
    WHERE user_id = ? AND is_active = 1
    ORDER BY login_time DESC LIMIT 1
  `).get(user_id);
  
  if (!session) {
    return res.json({ 
      success: false, 
      message: 'No active PK session',
      requires_pk_selection: true
    });
  }
  
  const pk_id = session.pk_id;
  
  // ... rest of query using pk_id
});
```

---

## 🧪 TESTING FLOW

### **Complete User Journey:**

```
1. Open http://localhost:5176

2. Login with shared account:
   Username: pk_madya
   Password: madya2025
   
3. Redirected to /pk-selection

4. See list of PK Madya (Budiana, Ryan, etc.)

5. Click on "Budiana"
   → Session created
   → Redirected to dashboard

6. Dashboard shows:
   "Bertugas sebagai: Budiana"
   "Login: pk_madya"

7. All activities recorded as:
   - logged_in_as: "pk_madya"
   - pk_id: 40 (Budiana)
   - pk_name: "Budiana"

8. Logout → Session deactivated

9. Login again → Can choose different PK
```

---

## 📊 BENEFITS OF HYBRID SYSTEM

### **For Admin:**
- ✅ Only 4 accounts to manage (vs 63)
- ✅ Easy password reset
- ✅ Simple onboarding

### **For PK:**
- ✅ Easy to remember (shared password)
- ✅ Can backup each other
- ✅ Flexible assignment

### **For System:**
- ✅ Full audit trail (who logged in, as whom)
- ✅ Accountability maintained
- ✅ Performance tracking per PK
- ✅ Compliance with SOP

---

## 🔐 SECURITY FEATURES

### **1. Session Tracking:**
```sql
-- Every action tracked
pk_sessions:
  user_id: 1 (pk_madya account)
  pk_id: 40 (Budiana)
  login_time: 2025-11-09 22:00:00
  is_active: 1
```

### **2. Jenjang Validation:**
```javascript
// Can only select PK from same jenjang
if (pk.jenjang !== user.jenjang) {
  return error("Jenjang mismatch")
}
```

### **3. Single Active Session:**
```javascript
// Only one active session per user
// Previous sessions auto-deactivated
```

### **4. Audit Trail:**
```javascript
// All service reports include:
{
  pk_id: 40,
  pk_name: "Budiana",
  logged_in_as: "pk_madya",  // Who actually logged in
  timestamp: "..."
}
```

---

## 📝 MIGRATION CHECKLIST

### **Backend:**
- [x] Run migration script
- [x] Create pk-auth.js routes
- [x] Register routes in server.js
- [ ] Update workflow endpoints
- [ ] Add session validation

### **Frontend:**
- [x] Create PKSelection.jsx
- [ ] Update App.jsx routing
- [ ] Update AuthContext
- [ ] Update PKWorkflowDashboard
- [ ] Test complete flow

### **Testing:**
- [ ] Login with pk_madya
- [ ] Select PK Budiana
- [ ] Check dashboard
- [ ] Create assignment
- [ ] Complete service
- [ ] Check audit trail
- [ ] Logout & login as different PK

---

## 🎯 NEXT STEPS

### **Immediate:**
1. Update `App.jsx` - add PKSelection route
2. Update `AuthContext.jsx` - add session management
3. Update `PKWorkflowDashboard.jsx` - use session
4. Test login → select → dashboard flow

### **Optional Enhancements:**
1. Add PIN verification after PK selection
2. Add session timeout (8 hours)
3. Add "Switch PK" button in dashboard
4. Add session activity log
5. Add admin panel to view all sessions

---

## 📞 SUPPORT

**If Issues:**
1. Check backend logs
2. Check browser console
3. Verify migration ran successfully
4. Check pk_sessions table
5. Verify token includes jenjang

**Common Issues:**
- "No PK available" → Check pk.jenjang column
- "Session not found" → Check pk_sessions table
- "Jenjang mismatch" → Verify user.jenjang

---

## 🎉 SUMMARY

**What We Have:**
- ✅ 4 shared accounts (pk_madya, pk_muda, pk_pertama, apk)
- ✅ Session tracking system
- ✅ PK selection page
- ✅ Backend API ready

**What's Needed:**
- ⏳ Frontend routing integration
- ⏳ Session management in AuthContext
- ⏳ Dashboard updates
- ⏳ Testing

**Estimated Time:** 1-2 hours to complete

**Result:** Hybrid system with easy management + full accountability! 🚀

---

**Last Updated:** November 9, 2025 - 22:30 WIB
