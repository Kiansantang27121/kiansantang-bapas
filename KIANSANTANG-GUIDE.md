# 🎫 KIANSANTANG - Panduan Lengkap

## 📖 Tentang KIANSANTANG

**KIANSANTANG** adalah singkatan dari **Kios Antrian Santun dan Tanggap**, sebuah sistem manajemen antrian terintegrasi yang dikembangkan khusus untuk BAPAS Kelas I Bandung.

### 🎯 Visi
Memberikan pelayanan yang santun, cepat, dan tanggap kepada masyarakat melalui sistem antrian digital yang modern dan efisien.

### 💡 Filosofi Nama
- **KIOS** = Tempat layanan yang mudah diakses
- **ANTRIAN** = Sistem terorganisir untuk melayani masyarakat
- **SANTUN** = Pelayanan yang sopan dan menghormati
- **TANGGAP** = Respon cepat terhadap kebutuhan masyarakat

## 🏗️ Arsitektur Sistem

### 5 Komponen Utama:

```
┌─────────────────────────────────────────────────────────────┐
│                    KIANSANTANG ECOSYSTEM                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Pendaftaran  │  │   Operator   │  │   Display    │      │
│  │  Port 5173   │  │  Port 5174   │  │  Port 5175   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘              │
│                            │                                  │
│                    ┌───────▼────────┐                        │
│                    │   Backend API   │                        │
│                    │   Port 3000     │                        │
│                    │   + Socket.IO   │                        │
│                    └────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Aplikasi & Fungsi

### 1. 🏠 Home Dashboard (index.html)
**Fungsi:**
- Portal utama akses semua aplikasi
- Statistik real-time sistem
- Quick access buttons
- Informasi status aplikasi

**Fitur:**
- ✅ Desain modern & responsif
- ✅ Animated background
- ✅ Real-time stats
- ✅ Quick navigation
- ✅ Status monitoring

**Akses:**
```
file:///d:/kiansantang/bapas-bandung/index.html
atau
Buka file index.html di browser
```

### 2. 📝 Aplikasi Pendaftaran (Port 5173)
**Untuk:** Klien/Masyarakat

**Fungsi:**
- Pendaftaran layanan mandiri
- Pilih jenis layanan
- Input data diri
- Pilih PK (jika ada)
- Dapatkan nomor antrian

**Fitur:**
- ✅ User-friendly interface
- ✅ Form validation
- ✅ Auto queue numbering
- ✅ Print ticket
- ✅ No login required

**Akses:**
```
http://localhost:5173
```

### 3. 💼 Aplikasi Operator & Petugas (Port 5174)
**Untuk:** Admin, Operator, PK, Petugas

**Fungsi:**
- Login multi-role
- Dashboard & statistik
- Kelola antrian
- Kelola layanan
- Kelola pengguna
- Pengaturan sistem

**Role Access:**
- **Admin** - Full access
- **Operator** - Kelola antrian & layanan
- **PK** - Terima & layani klien
- **Petugas** - Sesuai role masing-masing

**Fitur:**
- ✅ Role-based dashboard
- ✅ Real-time updates
- ✅ Task management
- ✅ Statistics & reports
- ✅ User management

**Akses:**
```
http://localhost:5174
```

**Login:**
- Admin: admin / admin123
- Operator: operator / operator123
- PK: budiana / pk123456
- Petugas: petugas_penghadapan / petugas123

### 4. 📺 Aplikasi Display (Port 5175)
**Untuk:** Layar TV/Monitor

**Fungsi:**
- Tampilkan nomor antrian dipanggil
- Daftar antrian menunggu
- Running text informasi
- Video display
- Jam & tanggal

**Fitur:**
- ✅ Full screen mode
- ✅ Real-time updates via Socket.IO
- ✅ Modern/Classic layout
- ✅ Customizable display
- ✅ Auto refresh

**Akses:**
```
http://localhost:5175
Tekan F11 untuk fullscreen
```

### 5. 🔧 Backend API (Port 3000)
**Untuk:** Server & Database

**Fungsi:**
- RESTful API
- Database SQLite
- WebSocket (Socket.IO)
- Authentication (JWT)
- Role-based access

**Fitur:**
- ✅ 25+ API endpoints
- ✅ Real-time events
- ✅ Secure authentication
- ✅ Data validation
- ✅ Error handling

**Akses:**
```
http://localhost:3000/api
Health check: http://localhost:3000/api/health
```

## 👥 Sistem Multi-Role

### 1. Admin (1 akun)
**Username:** admin
**Password:** admin123
**Akses:**
- ✅ Full system access
- ✅ Kelola semua data
- ✅ Kelola pengguna
- ✅ Pengaturan sistem
- ✅ View all statistics

### 2. Operator (1+ akun)
**Username:** operator
**Password:** operator123
**Akses:**
- ✅ Kelola antrian
- ✅ Panggil klien
- ✅ Assign ke PK
- ✅ View statistics
- ❌ Kelola pengguna
- ❌ Pengaturan sistem

### 3. PK - Pembimbing Kemasyarakatan (63 akun)
**Username:** budiana, ryanrizkia, dll
**Password:** pk123456 (semua PK)
**Akses:**
- ✅ Lihat antrian saya
- ✅ Terima antrian
- ✅ Panggil klien
- ✅ Selesaikan layanan
- ✅ View my statistics
- ❌ Kelola antrian umum

### 4. Petugas Layanan
**Username:** petugas_layanan
**Password:** petugas123
**Akses:**
- ✅ Kelola antrian umum
- ✅ Monitor semua layanan
- ✅ Assign ke petugas lain

### 5. Petugas Penghadapan
**Username:** petugas_penghadapan
**Password:** petugas123
**Akses:**
- ✅ Kelola jadwal penghadapan
- ✅ Input data sidang
- ✅ Hubungi klien
- ✅ Complete dengan notes

### 6. Petugas Kunjungan
**Username:** petugas_kunjungan
**Password:** petugas123
**Akses:**
- ✅ Verifikasi pengunjung
- ✅ Approve/reject kunjungan
- ✅ Monitor durasi
- ✅ Catat hasil kunjungan

### 7. Petugas Pengaduan
**Username:** petugas_pengaduan
**Password:** petugas123
**Akses:**
- ✅ Terima pengaduan
- ✅ Investigasi & tindak lanjut
- ✅ Resolusi pengaduan
- ✅ Escalate jika perlu

## 🔄 Flow Sistem

### Flow Antrian Umum:
```
1. Klien → Pendaftaran (5173)
   ↓
2. Pilih layanan & isi data
   ↓
3. Dapat nomor antrian
   ↓
4. Display (5175) tampilkan nomor menunggu
   ↓
5. Operator (5174) panggil antrian
   ↓
6. Display tampilkan nomor dipanggil
   ↓
7. Operator layani klien
   ↓
8. Operator selesaikan layanan
   ↓
9. Selesai
```

### Flow Bimbingan PK:
```
1. Klien daftar bimbingan wajib lapor
   ↓
2. Operator assign ke PK
   ↓
3. PK terima di dashboard
   ↓
4. PK panggil klien (auto voice call)
   ↓
5. PK layani klien
   ↓
6. Klien beri rating
   ↓
7. PK complete dengan notes
   ↓
8. Selesai
```

### Flow Penghadapan:
```
1. Input jadwal sidang
   ↓
2. Assign ke Petugas Penghadapan
   ↓
3. Petugas hubungi klien
   ↓
4. Reminder H-1 & H-day
   ↓
5. Klien hadir di pengadilan
   ↓
6. Petugas complete dengan catatan
   ↓
7. Selesai
```

### Flow Kunjungan:
```
1. Pengunjung daftar kunjungan
   ↓
2. Assign ke Petugas Kunjungan
   ↓
3. Petugas verifikasi identitas
   ↓
4. Approve/Reject
   ↓
5. Jika approve → Kunjungan berlangsung
   ↓
6. Petugas complete dengan notes
   ↓
7. Selesai
```

### Flow Pengaduan:
```
1. Masyarakat submit pengaduan (public)
   ↓
2. Assign ke Petugas Pengaduan
   ↓
3. Petugas accept & investigasi
   ↓
4. Petugas complete dengan resolusi
   ↓
5. Atau escalate jika perlu
   ↓
6. Selesai
```

## 🎨 Desain & UI/UX

### Design Philosophy:
- **Modern** - Menggunakan design trends terkini
- **Clean** - Interface bersih dan tidak berantakan
- **Intuitive** - Mudah dipahami tanpa training
- **Responsive** - Bekerja di semua device
- **Accessible** - Mudah diakses semua orang

### Color Palette:
- **Primary:** #667eea (Purple Blue)
- **Secondary:** #764ba2 (Deep Purple)
- **Success:** #10b981 (Green)
- **Warning:** #f59e0b (Orange)
- **Danger:** #ef4444 (Red)

### Typography:
- **Font:** Segoe UI, system fonts
- **Heading:** Bold, large, clear
- **Body:** Regular, readable
- **Monospace:** For code/numbers

### Components:
- **Cards** - Rounded corners, shadows
- **Buttons** - Gradient backgrounds
- **Icons** - Font Awesome 6
- **Animations** - Smooth transitions

## 📊 Database Schema

### Tables:

1. **users** - User accounts
2. **services** - Service types
3. **queue** - Queue data
4. **counters** - Counter/loket data
5. **settings** - System settings
6. **pk** - PK data
7. **clients** - Client data
8. **penghadapan** - Court appearance data
9. **kunjungan** - Visit data
10. **pengaduan** - Complaint data
11. **rating** - Service ratings

## 🔐 Keamanan

### Authentication:
- JWT tokens
- Bcrypt password hashing
- Session management
- Auto logout on inactivity

### Authorization:
- Role-based access control
- Permission checking
- Route protection
- API endpoint security

### Data Protection:
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

## 📈 Monitoring & Analytics

### Real-time Stats:
- Total antrian hari ini
- Antrian menunggu
- Antrian selesai
- Average waiting time
- Service performance

### Reports:
- Daily reports
- Weekly reports
- Monthly reports
- Custom date range
- Export to Excel/PDF

## 🚀 Quick Start

### 1. Buka Home Dashboard
```
Buka file: index.html
atau
Double-click index.html
```

### 2. Start Backend
```bash
cd backend
npm run dev
```

### 3. Start All Apps
```bash
# Terminal 1 - Registration
cd registration-app
npm run dev

# Terminal 2 - Operator
cd operator-app
npm run dev

# Terminal 3 - Display
cd display-app
npm run dev
```

### 4. Access Applications
- Home: file:///index.html
- Registration: http://localhost:5173
- Operator: http://localhost:5174
- Display: http://localhost:5175
- API: http://localhost:3000/api

## 💡 Tips & Best Practices

### Untuk Admin:
1. Ganti password default setelah instalasi
2. Backup database secara berkala
3. Monitor system logs
4. Update settings sesuai kebutuhan
5. Train staff sebelum go-live

### Untuk Operator:
1. Panggil antrian sesuai urutan
2. Pastikan klien sudah hadir sebelum serve
3. Complete antrian setelah selesai
4. Jangan lupa logout setelah shift

### Untuk PK:
1. Check dashboard secara berkala
2. Accept antrian yang di-assign
3. Hubungi klien sebelum panggil
4. Catat hasil bimbingan dengan lengkap
5. Berikan layanan terbaik

### Untuk Petugas:
1. Check tasks secara rutin
2. Respond cepat terhadap assignment
3. Dokumentasi lengkap
4. Follow-up sampai selesai
5. Escalate jika perlu

## 📞 Support & Dokumentasi

### Dokumentasi Lengkap:
- `README.md` - Overview sistem
- `PANDUAN-LOGIN-LENGKAP.md` - Panduan login
- `APLIKASI-PETUGAS-MULTI-ROLE.md` - Dokumentasi petugas
- `PANDUAN-PENGHADAPAN.md` - Panduan penghadapan
- `SISTEM-PK-WAJIB-LAPOR.md` - Sistem PK

### API Documentation:
- Swagger/OpenAPI (coming soon)
- Postman collection (coming soon)

### Contact:
- Email: bapas.bandung@kemenkumham.go.id
- Phone: (022) 4204501
- Website: bapas-bandung.kemenkumham.go.id

## 🎯 Roadmap

### Phase 1: ✅ Completed
- ✅ Basic queue system
- ✅ Multi-role authentication
- ✅ Real-time updates
- ✅ Display application
- ✅ PK system
- ✅ Petugas multi-role

### Phase 2: 🚧 In Progress
- 🚧 Petugas App frontend
- 🚧 Mobile responsive
- 🚧 Advanced reporting
- 🚧 Email notifications

### Phase 3: 📋 Planned
- 📋 Mobile apps (iOS/Android)
- 📋 WhatsApp integration
- 📋 SMS notifications
- 📋 Biometric check-in
- 📋 AI-powered analytics

## 🏆 Achievements

- ✅ 4 aplikasi terintegrasi
- ✅ 70 user accounts
- ✅ 25+ API endpoints
- ✅ Real-time updates
- ✅ Modern UI/UX
- ✅ Multi-role system
- ✅ Comprehensive documentation

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**

**BAPAS Kelas I Bandung**

*Melayani dengan Santun, Merespon dengan Tanggap* 🎫✨
