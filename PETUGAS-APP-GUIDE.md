# 👥 KIANSANTANG - Aplikasi Petugas

## 📖 Overview

**Aplikasi Petugas** adalah aplikasi dengan 3 dashboard berbeda untuk 3 role petugas:
1. **Petugas Layanan** - Mengelola antrian dan layanan umum
2. **PK (Pembimbing Kemasyarakatan)** - Mengelola klien wajib lapor
3. **Struktural** - Monitoring dan evaluasi kinerja

## 🎯 Konsep Multi-Dashboard

### Smart Routing
Aplikasi akan otomatis mengarahkan user ke dashboard yang sesuai dengan role mereka:
- `petugas_layanan` → Dashboard Petugas Layanan
- `pk` → Dashboard PK
- `struktural` → Dashboard Struktural
- `admin` → Dashboard Struktural (full access)

### Role-Based Access
- ✅ Login check untuk 3 role
- ✅ Auto routing ke dashboard yang tepat
- ✅ Access denied untuk role lain
- ✅ Secure authentication

## 🎨 Design System

### Color Scheme per Role

**Petugas Layanan:**
- Primary: Emerald (#10b981)
- Gradient: Emerald → Teal
- Theme: Green/Fresh

**PK:**
- Primary: Teal (#14b8a6)
- Gradient: Teal → Cyan
- Theme: Teal/Professional

**Struktural:**
- Primary: Cyan (#06b6d4)
- Gradient: Cyan → Blue
- Theme: Blue/Executive

## 📱 1. Dashboard Petugas Layanan

### Features:
- ✅ Quick Stats (4 cards)
  - Total Antrian Hari Ini
  - Menunggu
  - Sedang Dilayani
  - Selesai

- ✅ Antrian Menunggu
  - List antrian real-time
  - Tombol panggil
  - Status indicator

- ✅ Aktivitas Terbaru
  - Real-time feed
  - Color-coded icons
  - Timestamp

- ✅ Quick Actions
  - Lihat Semua Antrian
  - Daftar Klien Baru
  - Jadwal Hari Ini
  - Laporan Harian

### Login:
```
Username: petugas_layanan
Password: petugas123
URL: http://localhost:5176
```

### Use Cases:
- Kelola antrian umum
- Panggil klien
- Monitor layanan
- Assign ke petugas lain

## 📱 2. Dashboard PK

### Features:
- ✅ Quick Stats (4 cards)
  - Klien Saya
  - Antrian Hari Ini
  - Selesai Hari Ini
  - Rating Rata-rata

- ✅ Antrian Saya Hari Ini
  - List antrian assigned
  - Tombol panggil & selesai
  - Status tracking

- ✅ Klien Wajib Lapor Saya
  - List klien terdaftar
  - Contact info
  - Address info

- ✅ Quick Actions
  - Lihat Semua Klien
  - Jadwal Penghadapan
  - Riwayat Bimbingan
  - Laporan Bulanan

### Login:
```
Username: budiana (atau PK lainnya)
Password: pk123456
URL: http://localhost:5176
```

### Use Cases:
- Lihat antrian saya
- Kelola klien wajib lapor
- Jadwal penghadapan
- Buat laporan bimbingan

## 📱 3. Dashboard Struktural

### Features:
- ✅ Quick Stats (4 cards)
  - Total Antrian Bulan Ini
  - Total PK Aktif (63)
  - Tingkat Kehadiran
  - Rata-rata Layanan

- ✅ Performance Metrics
  - Total Layanan
  - Kepuasan Klien
  - Efisiensi Waktu
  - Kepatuhan SOP

- ✅ Grafik Kinerja 7 Hari
  - Bar chart visualization
  - Interactive hover
  - Performance tracking

- ✅ Top Performers
  - Ranking PK & Petugas
  - Score display
  - Client count

- ✅ Laporan & Analisis
  - Lihat Laporan Lengkap
  - Download Laporan
  - Analisis Kinerja
  - Evaluasi Bulanan

### Login:
```
Username: struktural (belum ada, gunakan admin)
Password: admin123
URL: http://localhost:5176
```

### Use Cases:
- Monitor kinerja sistem
- Evaluasi PK & Petugas
- Generate laporan
- Analisis statistik

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd petugas-app
npm install
```

### 2. Start Application
```bash
npm run dev
```

### 3. Access URL
```
http://localhost:5176
```

### 4. Login
Pilih salah satu:
- Petugas Layanan: petugas_layanan / petugas123
- PK: budiana / pk123456
- Struktural: admin / admin123

## 🔐 Authentication & Security

### Login Flow:
1. User masukkan credentials
2. System check role
3. Allowed roles: petugas_layanan, pk, struktural, admin
4. Auto redirect ke dashboard sesuai role
5. Access denied jika role tidak sesuai

### Protected Routes:
- All routes require authentication
- Role-based dashboard routing
- Secure JWT tokens
- Session management

## 📊 Dashboard Components

### Common Components:
- **Header Section** - Welcome message, role badge
- **Quick Stats** - 4 metric cards dengan gradient
- **Main Content** - 2 column grid layout
- **Quick Actions** - 4 action buttons

### Unique Features per Role:

**Petugas Layanan:**
- Antrian Menunggu list
- Aktivitas Terbaru feed

**PK:**
- Antrian Saya (assigned)
- Klien Wajib Lapor list

**Struktural:**
- Performance Metrics grid
- Grafik Kinerja chart
- Top Performers ranking

## 🎨 UI/UX Design

### Design Principles:
- **Modern** - Latest design trends
- **Clean** - Minimal clutter
- **Intuitive** - Easy to use
- **Responsive** - All devices
- **Role-specific** - Unique colors per role

### Components:
- Gradient backgrounds
- Glass morphism effects
- Smooth animations
- Hover effects
- Shadow depth
- Rounded corners

### Typography:
- Headings: Bold, large
- Body: Regular, readable
- Numbers: Bold, prominent

## 🛠️ Technical Stack

### Frontend:
- React 18
- Vite
- TailwindCSS
- Lucide Icons
- React Router v6

### State Management:
- React Context (Auth)
- Local state
- Real-time updates

### API Integration:
- Axios
- JWT authentication
- RESTful endpoints

## 📝 File Structure

```
petugas-app/
├── src/
│   ├── components/
│   │   └── Layout.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── PetugasLayananDashboard.jsx
│   │   ├── PKDashboard.jsx
│   │   └── StrukturalDashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── config.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## 🔧 Configuration

### API URL:
```javascript
// src/config.js
export const API_URL = 'http://localhost:3000/api'
export const SOCKET_URL = 'http://localhost:3000'
```

### Port:
```json
// package.json
"dev": "vite --port 5176"
```

## 📚 API Endpoints Used

### Authentication:
- `POST /api/auth/login`
- `GET /api/auth/verify`

### Dashboard Stats:
- `GET /api/dashboard/stats`

### PK Specific:
- `GET /api/pk-queue/my-queue`
- `GET /api/clients/my-clients`
- `GET /api/pk-queue/my-stats`

## 🎯 Use Cases

### Petugas Layanan:
1. Login ke aplikasi
2. Lihat dashboard dengan stats
3. Check antrian menunggu
4. Panggil klien
5. Monitor aktivitas

### PK:
1. Login ke aplikasi
2. Lihat dashboard dengan stats
3. Check antrian saya
4. Lihat klien wajib lapor
5. Panggil & layani klien

### Struktural:
1. Login ke aplikasi
2. Lihat dashboard dengan metrics
3. Monitor grafik kinerja
4. Check top performers
5. Generate laporan

## 🔍 Troubleshooting

### Cannot Login
**Problem:** Login gagal

**Solution:**
1. Check credentials
2. Ensure role is allowed
3. Check backend running
4. Clear browser cache

### Wrong Dashboard
**Problem:** Dashboard tidak sesuai role

**Solution:**
1. Check user role in database
2. Logout and login again
3. Clear localStorage
4. Check routing logic

### Dashboard Not Loading
**Problem:** Dashboard blank

**Solution:**
1. Check backend API running
2. Check network connection
3. Open browser console
4. Check API responses

## 📈 Future Enhancements

### Planned Features:
- 📋 Real-time notifications
- 📋 Advanced filtering
- 📋 Export to Excel/PDF
- 📋 Mobile responsive
- 📋 Dark mode
- 📋 Multi-language

### Additional Dashboards:
- 📋 Petugas Penghadapan
- 📋 Petugas Kunjungan
- 📋 Petugas Pengaduan

## 📞 Support

### Contact:
- **Email:** bapas.bandung@kemenkumham.go.id
- **Phone:** (022) 4204501

### Documentation:
- `README.md` - System overview
- `KIANSANTANG-GUIDE.md` - Complete guide
- `PANDUAN-LOGIN-LENGKAP.md` - Login guide

---

**KIANSANTANG - Aplikasi Petugas**

**BAPAS Kelas I Bandung**

*3 Dashboard, 3 Role, 1 Aplikasi* 👥✨
