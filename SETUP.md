# Setup Guide - Sistem Layanan BAPAS Bandung

## Langkah-langkah Setup

### 1. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` dengan isi:
```
PORT=3000
JWT_SECRET=bapas-bandung-secret-key-2024
NODE_ENV=development
```

### 2. Setup Aplikasi Pendaftaran

```bash
cd registration-app
npm install
```

### 3. Setup Aplikasi Operator

```bash
cd operator-app
npm install
```

### 4. Setup Aplikasi Display

```bash
cd display-app
npm install
```

## Menjalankan Semua Aplikasi

Buka 4 terminal/command prompt terpisah:

**Terminal 1 - Backend:**
```bash
cd d:/kiansantang/bapas-bandung/backend
npm run dev
```

**Terminal 2 - Aplikasi Pendaftaran:**
```bash
cd d:/kiansantang/bapas-bandung/registration-app
npm run dev
```

**Terminal 3 - Aplikasi Operator:**
```bash
cd d:/kiansantang/bapas-bandung/operator-app
npm run dev
```

**Terminal 4 - Aplikasi Display:**
```bash
cd d:/kiansantang/bapas-bandung/display-app
npm run dev
```

## URL Akses

- Backend API: http://localhost:3000
- Aplikasi Pendaftaran: http://localhost:5173
- Aplikasi Operator: http://localhost:5174
- Aplikasi Display: http://localhost:5175

## Login Operator/Admin

- Username: `admin`
- Password: `admin123`

## Catatan

- Database SQLite akan dibuat otomatis di `backend/bapas.db`
- Data default (admin, layanan, loket) akan dibuat otomatis
- Pastikan semua port tidak digunakan aplikasi lain
