# 🔧 TROUBLESHOOTING: Dashboard PK Tidak Menampilkan Antrian

## 📋 Masalah

Dashboard PK Madya menampilkan "Tidak Ada Assignment" (0 antrian) padahin seharusnya ada antrian yang diteruskan dari petugas.

---

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **Backend: Update Query my-assignments**
File: `backend/routes/workflow-sqlite.js`

**Perubahan**:
- ❌ Sebelumnya: Query berdasarkan `user.pk_id` (NULL untuk user shared)
- ✅ Sekarang: Query berdasarkan **jabatan PK**

**Mapping**:
```javascript
if (user.username === 'apk') jabatan = 'APK';
else if (user.username === 'pk_madya') jabatan = 'PK Madya';
else if (user.username === 'pk_muda') jabatan = 'PK Muda';
else if (user.username === 'pk_pertama') jabatan = 'PK Pertama';
```

**Query**:
```sql
SELECT q.*, s.name as service_name, p.name as pk_name, p.jabatan as pk_jabatan
FROM queue q
JOIN services s ON q.service_id = s.id
LEFT JOIN pk p ON q.pk_id = p.id
WHERE p.jabatan = ?
AND q.status IN ('waiting', 'called')
```

### 2. **Frontend: Tambah Import API_URL**
File: `petugas-app/src/pages/PKWorkflowDashboard.jsx`

**Perubahan**:
```javascript
import { API_URL } from '../config'
```

### 3. **Database: Tambah Kolom Jabatan ke Tabel PK**
- ✅ Kolom `jabatan` ditambahkan
- ✅ Semua PK diberi jabatan (APK, PK Madya, PK Muda, PK Pertama)

### 4. **Database: Tambah Kolom Room ke Tabel Queue**
- ✅ `room_number`
- ✅ `pk_called_at`
- ✅ `pk_entered_at`
- ✅ `client_called_at`
- ✅ `client_entered_at`

---

## 🧪 Test Backend

Jalankan test script:
```bash
cd backend
node test-pk-dashboard.js
```

**Expected Result**:
```
✅ Found 12 assignments

Assignments:
1. B008 - ABELDO... | PK: Budiana (PK Madya)
2. B007 - AR MOCHAMAD... | PK: Budiana (PK Madya)
...
```

---

## 🔍 Debugging Steps

### 1. **Cek Backend Log**
Saat login sebagai `pk_madya`, backend harus menampilkan:
```
📋 Fetching assignments for user: pk_madya (PK Madya (Shared))
🎯 Looking for queues with PK jabatan: PK Madya
✅ Found 12 assignments for PK Madya
```

### 2. **Cek Browser Console**
Buka Developer Tools (F12) → Console

**Expected**:
```
🔄 Fetching PK assignments...
✅ Assignments: 12 items
✅ PK list: 68 items
```

**Jika Error**:
- `API_URL is not defined` → Import API_URL belum ada
- `401 Unauthorized` → Token expired, login ulang
- `500 Internal Server Error` → Cek backend log

### 3. **Cek Network Tab**
Buka Developer Tools (F12) → Network

**Request**:
```
GET /api/workflow/my-assignments
Authorization: Bearer [token]
```

**Response** (harus 200 OK):
```json
{
  "success": true,
  "assignments": [
    {
      "id": 34,
      "queue_number": "B008",
      "client_name": "ABELDO...",
      "pk_name": "Budiana",
      "pk_jabatan": "PK Madya",
      ...
    }
  ]
}
```

---

## 🔄 Langkah-Langkah Manual

### 1. **Restart Backend**
```bash
cd backend
# Kill process
Get-Process node | Stop-Process -Force

# Start again
npm run dev
```

### 2. **Restart Frontend**
```bash
cd petugas-app
# Kill process (Ctrl+C)

# Start again
npm run dev
```

### 3. **Clear Browser Cache**
- Tekan `Ctrl + Shift + Delete`
- Pilih "Cached images and files"
- Clear data

### 4. **Login Ulang**
```
URL: http://localhost:5176
Username: pk_madya
Password: pk123
```

### 5. **Hard Refresh**
- Tekan `Ctrl + F5` atau `Ctrl + Shift + R`

---

## 📊 Data yang Harus Ada

### Tabel `pk`
```sql
SELECT id, name, jabatan FROM pk WHERE jabatan = 'PK Madya';
```

**Expected**: 8 PK
- Budiana
- Ahmad Fauzi, S.Psi
- Dewi Lestari, S.Sos
- dll

### Tabel `queue`
```sql
SELECT q.queue_number, q.client_name, p.name as pk_name, p.jabatan
FROM queue q
LEFT JOIN pk p ON q.pk_id = p.id
WHERE p.jabatan = 'PK Madya' AND q.status = 'waiting';
```

**Expected**: Antrian dengan PK Madya

### Tabel `users`
```sql
SELECT id, username, name, role FROM users WHERE username = 'pk_madya';
```

**Expected**:
```
id: 73
username: pk_madya
name: PK Madya (Shared)
role: pk
```

---

## 🆘 Jika Masih Tidak Muncul

### Cek 1: Apakah ada antrian dengan PK Madya?
```bash
node backend/check-pk-user-mapping.js
```

Jika tidak ada antrian, buat antrian baru:
1. Buka http://localhost:5173
2. Pilih "Bimbingan Wajib Lapor"
3. Pilih PK: Budiana (PK Madya)
4. Submit

### Cek 2: Apakah endpoint berfungsi?
```bash
node backend/test-pk-dashboard.js
```

Jika berhasil di script tapi tidak di browser:
- Masalah di frontend
- Cek import API_URL
- Cek token di localStorage

### Cek 3: Apakah user bisa login?
```bash
node backend/test-login-pk.js
```

Jika gagal login:
- Password salah
- User tidak ada
- Jalankan `node backend/fix-all-users.js`

---

## 📝 Checklist

- [ ] Backend running (port 3000)
- [ ] Frontend running (port 5176)
- [ ] Kolom `jabatan` ada di tabel `pk`
- [ ] Semua PK punya jabatan
- [ ] Kolom room ada di tabel `queue`
- [ ] Tabel `rooms` ada dengan 5 ruangan
- [ ] Import `API_URL` di PKWorkflowDashboard.jsx
- [ ] Token valid (login ulang jika perlu)
- [ ] Ada antrian dengan status 'waiting'
- [ ] Antrian punya `pk_id` yang valid
- [ ] PK punya jabatan yang sesuai

---

## 🎯 Expected Behavior

**Setelah Login sebagai `pk_madya`**:

1. Dashboard menampilkan statistik:
   - Total Assignment: 12
   - Menunggu Aksi: 0
   - Dipanggil Masuk: 0
   - Disetujui: 0

2. Section "Antrian Saya" menampilkan list:
   ```
   B008 - ABELDO IBANA MARNALA SIMANJUNTAK
   PK: Budiana (PK Madya)
   Service: Bimbingan Wajib Lapor
   [Approve] [Reject] [Transfer]
   ```

3. Bisa melakukan aksi:
   - Approve → Setujui antrian
   - Reject → Tolak dengan alasan
   - Transfer → Pindah ke PK lain

---

**Update**: 10 November 2025 00:21  
**Status**: ✅ Backend Fixed, Frontend Updated  
**Next**: Refresh browser dan test
