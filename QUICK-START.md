# Quick Start Guide

## Instalasi Cepat

### 1. Install Dependencies (Jalankan sekali saja)

```bash
# Backend
cd backend
npm install

# Registration App
cd ../registration-app
npm install

# Operator App
cd ../operator-app
npm install

# Display App
cd ../display-app
npm install
```

### 2. Setup Environment

Buat file `.env` di folder `backend`:

```
PORT=3000
JWT_SECRET=bapas-bandung-secret-key-2024
NODE_ENV=development
```

### 3. Jalankan Aplikasi

**Cara 1: Otomatis (Windows)**
Double-click file `START-ALL.bat`

**Cara 2: Manual (4 Terminal)**

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd registration-app
npm run dev
```

Terminal 3:
```bash
cd operator-app
npm run dev
```

Terminal 4:
```bash
cd display-app
npm run dev
```

## Akses Aplikasi

- **Pendaftaran**: http://localhost:5173
- **Operator**: http://localhost:5174 (Login: admin/admin123)
- **Display**: http://localhost:5175
- **API**: http://localhost:3000

## Testing Flow

1. Buka **Aplikasi Pendaftaran** → Daftar layanan
2. Buka **Aplikasi Display** → Lihat antrian menunggu
3. Login ke **Aplikasi Operator** → Panggil antrian
4. **Display** akan menampilkan nomor yang dipanggil
5. Di **Operator** → Mulai layanan → Selesaikan

## Fitur Admin

Login sebagai admin untuk:
- Kelola layanan
- Kelola pengguna
- Ubah pengaturan sistem

## Troubleshooting

**Port sudah digunakan?**
- Ubah port di `package.json` (script dev)
- Atau matikan aplikasi yang menggunakan port tersebut

**Database error?**
- Hapus file `backend/bapas.db`
- Restart backend (database akan dibuat ulang)

**Frontend tidak connect?**
- Pastikan backend sudah running
- Check console browser untuk error

## Struktur Folder

```
bapas-bandung/
├── backend/           # API Server
├── registration-app/  # Aplikasi Pendaftaran
├── operator-app/      # Aplikasi Operator
├── display-app/       # Aplikasi Display
├── README.md          # Dokumentasi lengkap
├── SETUP.md          # Panduan setup
└── START-ALL.bat     # Script auto-start
```

Selamat menggunakan! 🎉
