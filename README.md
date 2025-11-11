# 🎫 KIANSANTANG
## Kios Antrian Santun dan Tanggap
### BAPAS Kelas I Bandung

Sistem manajemen antrian terintegrasi yang terdiri dari 4 aplikasi frontend dan 1 backend API yang saling terhubung secara real-time.

## 📋 Deskripsi

Sistem ini terdiri dari:

1. **Aplikasi Pengguna Layanan** (Port 5173) - Untuk klien/masyarakat mendaftar layanan
2. **Aplikasi Panel Admin** (Port 5174) - Untuk administrator mengelola sistem dan pengaturan
3. **Aplikasi Display** (Port 5175) - Untuk menampilkan informasi antrian secara real-time
4. **Aplikasi Petugas** (Port 5176) - Untuk Petugas Layanan, PK, dan Struktural
5. **Backend API** (Port 3000) - Server dengan database SQLite dan WebSocket

## 🏠 Home Dashboard

Buka **index.html** di browser untuk mengakses home dashboard yang menampilkan semua aplikasi dengan desain modern dan canggih.

## 🚀 Fitur Utama

### Aplikasi Pengguna Layanan
- Ambil nomor antrian mandiri
- Pemilihan jenis layanan
- Input data klien (nama, telepon, NIK)
- Cetak nomor antrian otomatis
- Informasi estimasi waktu layanan

### Aplikasi Operator
- **Login & Autentikasi** (Admin/Operator)
- **Dashboard** dengan statistik real-time
- **Manajemen Antrian**:
  - Panggil antrian
  - Mulai layanan
  - Selesaikan layanan
  - Batalkan antrian
  - Filter berdasarkan status
- **Kelola Layanan** (Admin only):
  - CRUD layanan
  - Atur estimasi waktu
  - Aktifkan/nonaktifkan layanan
- **Kelola Pengguna** (Admin only):
  - CRUD user operator/admin
  - Manajemen role
- **Pengaturan** (Admin only):
  - Informasi kantor
  - Jam operasional
  - Konfigurasi display

### Aplikasi Display
- Tampilan antrian dipanggil (real-time)
- Daftar antrian menunggu
- Jam dan tanggal
- Informasi kantor
- Auto-refresh
- Notifikasi suara (opsional)

### Backend API
- RESTful API dengan Express.js
- Database SQLite dengan better-sqlite3
- WebSocket dengan Socket.IO untuk real-time updates
- JWT Authentication
- Role-based access control (Admin/Operator)

## 🛠️ Teknologi

### Backend
- Node.js + Express.js
- SQLite (better-sqlite3)
- Socket.IO
- JWT Authentication
- bcryptjs

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios
- React Router
- Lucide Icons
- Socket.IO Client

## 📦 Instalasi

### 1. Clone Repository

```bash
cd d:/kiansantang/bapas-bandung
```

### 2. Install Backend

```bash
cd backend
npm install
```

Buat file `.env`:
```env
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### 3. Install Aplikasi Pendaftaran

```bash
cd ../registration-app
npm install
```

### 4. Install Aplikasi Operator

```bash
cd ../operator-app
npm install
```

### 5. Install Aplikasi Display

```bash
cd ../display-app
npm install
```

## 🚀 Menjalankan Aplikasi

### 1. Jalankan Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend akan berjalan di: `http://localhost:3000`

### 2. Jalankan Aplikasi Pendaftaran (Terminal 2)

```bash
cd registration-app
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5173`

### 3. Jalankan Aplikasi Operator (Terminal 3)

```bash
cd operator-app
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5174`

### 4. Jalankan Aplikasi Display (Terminal 4)

```bash
cd display-app
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5175`

## 👤 Login Default

**Admin:**
- Username: `admin`
- Password: `admin123`

## 📱 Cara Penggunaan

### Workflow Normal

1. **Klien mendaftar** di Aplikasi Pendaftaran
   - Pilih layanan
   - Isi data diri
   - Dapatkan nomor antrian

2. **Display menampilkan** antrian menunggu secara real-time

3. **Operator memanggil** antrian di Aplikasi Operator
   - Pilih loket
   - Klik "Panggil" pada antrian
   - Display akan menampilkan nomor yang dipanggil

4. **Operator melayani**
   - Klik "Mulai" untuk memulai layanan
   - Klik "Selesai" setelah layanan selesai

5. **Admin mengelola** sistem
   - Tambah/edit layanan
   - Tambah/edit user operator
   - Ubah pengaturan sistem

## 🗂️ Struktur Database

### Tables

- **users** - Data user (admin/operator)
- **services** - Jenis layanan
- **queue** - Data antrian
- **counters** - Data loket
- **settings** - Pengaturan sistem

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/change-password` - Ubah password

### Queue
- `GET /api/queue` - Get all queues
- `POST /api/queue` - Create new queue
- `GET /api/queue/:id` - Get queue by ID
- `POST /api/queue/:id/call` - Call queue
- `POST /api/queue/:id/serve` - Start serving
- `POST /api/queue/:id/complete` - Complete queue
- `POST /api/queue/:id/cancel` - Cancel queue

### Services
- `GET /api/services` - Get active services
- `GET /api/services/all` - Get all services (admin)
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Users
- `GET /api/users` - Get all users (admin)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings/:key` - Update setting (admin)
- `POST /api/settings/bulk` - Bulk update (admin)

### Counters
- `GET /api/counters` - Get all counters
- `POST /api/counters` - Create counter (admin)
- `PUT /api/counters/:id` - Update counter (admin)
- `DELETE /api/counters/:id` - Delete counter (admin)

## 🔄 WebSocket Events

- `queue:new` - Antrian baru dibuat
- `queue:called` - Antrian dipanggil
- `queue:serving` - Antrian sedang dilayani
- `queue:completed` - Antrian selesai
- `queue:cancelled` - Antrian dibatalkan

## 🎨 Kustomisasi

### Mengubah Warna/Theme
Edit file `tailwind.config.js` di masing-masing aplikasi frontend.

### Mengubah Port
- Backend: Edit `.env` file
- Frontend: Edit script di `package.json` atau gunakan `--port` flag

### Menambah Layanan Default
Edit file `backend/database.js` pada bagian insert default services.

## 📝 Catatan Penting

1. **Database** akan dibuat otomatis saat pertama kali menjalankan backend
2. **Admin default** dibuat otomatis dengan username `admin` dan password `admin123`
3. **Ganti JWT_SECRET** di production untuk keamanan
4. **Backup database** secara berkala (file `bapas.db`)
5. Aplikasi menggunakan **SQLite** sehingga tidak perlu install database server

## 🔒 Keamanan

- Password di-hash menggunakan bcryptjs
- JWT untuk autentikasi
- Role-based access control
- Input validation di backend
- CORS enabled (konfigurasi sesuai kebutuhan)

## 🐛 Troubleshooting

### Backend tidak bisa start
- Pastikan port 3000 tidak digunakan aplikasi lain
- Check file `.env` sudah dibuat
- Jalankan `npm install` ulang

### Frontend tidak bisa connect ke backend
- Pastikan backend sudah running
- Check konfigurasi di `src/config.js`
- Pastikan CORS sudah diaktifkan di backend

### Database error
- Hapus file `bapas.db` dan restart backend untuk reset database
- Check permission folder untuk write access

## 📄 License

MIT License - Bebas digunakan untuk keperluan apapun

## 👨‍💻 Developer

Sistem Layanan BAPAS Bandung
Dibuat dengan ❤️ menggunakan React + Express.js

---

**Selamat menggunakan Sistem Layanan BAPAS Bandung!**
