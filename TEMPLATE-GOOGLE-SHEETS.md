# 📊 Template Google Sheets - Database BAPAS

## 🎯 Template untuk Copy-Paste

### 📄 Sheet 1: Database PK

**Nama File:** "Database PK BAPAS"

**Header Row:**
```
Nama	NIP	Telepon	Jabatan
```

**Sample Data:**
```
Nama	NIP	Telepon	Jabatan
Budi Santoso, S.Sos	198501012010011001	081234567890	Pembimbing Kemasyarakatan Ahli Muda
Siti Nurhaliza, S.H.	198702022011012002	081234567891	Pembimbing Kemasyarakatan Ahli Madya
Ahmad Fauzi, S.Psi	198903032012011003	081234567892	Pembimbing Kemasyarakatan Ahli Muda
Dewi Lestari, S.Sos	199004042013012004	081234567893	Pembimbing Kemasyarakatan Ahli Pertama
Rudi Hermawan, S.H.	199105052014011005	081234567894	Pembimbing Kemasyarakatan Ahli Madya
```

---

### 📄 Sheet 2: Database Klien BAPAS

**File dengan Multiple Tabs:**

#### Tab 1: Klien - Budi Santoso

**Header:**
```
Nama	NIK	Telepon	Alamat
```

**Sample Data:**
```
Nama	NIK	Telepon	Alamat
Andi Wijaya	3201010101900001	081111111111	Jl. Merdeka No. 1, Bandung
Budi Setiawan	3201010101900002	081111111112	Jl. Asia Afrika No. 5, Bandung
Citra Dewi	3201010101900003	081111111113	Jl. Braga No. 10, Bandung
```

#### Tab 2: Klien - Siti Nurhaliza

**Header:**
```
Nama	NIK	Telepon	Alamat
```

**Sample Data:**
```
Nama	NIK	Telepon	Alamat
Doni Prasetyo	3201010101900004	081111111114	Jl. Dago No. 15, Bandung
Eka Putri	3201010101900005	081111111115	Jl. Cihampelas No. 20, Bandung
Fajar Ramadan	3201010101900006	081111111116	Jl. Sukajadi No. 25, Bandung
```

#### Tab 3: Klien - Ahmad Fauzi

**Header:**
```
Nama	NIK	Telepon	Alamat
```

**Sample Data:**
```
Nama	NIK	Telepon	Alamat
Gita Savitri	3201010101900007	081111111117	Jl. Setiabudhi No. 30, Bandung
Hendra Gunawan	3201010101900008	081111111118	Jl. Pasteur No. 35, Bandung
Indah Permata	3201010101900009	081111111119	Jl. Dipatiukur No. 40, Bandung
```

#### Tab 4: Klien - Dewi Lestari

**Header:**
```
Nama	NIK	Telepon	Alamat
```

**Sample Data:**
```
Nama	NIK	Telepon	Alamat
Joko Susilo	3201010101900010	081111111120	Jl. Buah Batu No. 45, Bandung
Kartika Sari	3201010101900011	081111111121	Jl. Soekarno Hatta No. 50, Bandung
```

#### Tab 5: Klien - Rudi Hermawan

**Header:**
```
Nama	NIK	Telepon	Alamat
```

**Sample Data:**
```
Nama	NIK	Telepon	Alamat
Lina Marlina	3201010101900012	081111111122	Jl. Cibaduyut No. 55, Bandung
```

---

## 🚀 Quick Setup Guide

### STEP 1: Buat Sheet PK

1. Buka https://sheets.google.com
2. Klik "Blank"
3. Rename: "Database PK BAPAS"
4. Copy-paste header dan data di atas
5. Share → "Anyone with the link" → "Viewer"
6. Copy URL

### STEP 2: Buat Sheet Klien

1. Buka https://sheets.google.com
2. Klik "Blank"
3. Rename: "Database Klien BAPAS"
4. Buat 5 tabs (klik + di bawah):
   - Tab 1: "Klien - Budi Santoso"
   - Tab 2: "Klien - Siti Nurhaliza"
   - Tab 3: "Klien - Ahmad Fauzi"
   - Tab 4: "Klien - Dewi Lestari"
   - Tab 5: "Klien - Rudi Hermawan"
5. Untuk setiap tab, copy-paste header dan data
6. Share → "Anyone with the link" → "Viewer"

### STEP 3: Get URLs

**PK Sheet:**
- Copy URL: `https://docs.google.com/spreadsheets/d/ABC123/edit`

**Klien Sheets (per tab):**
- Klik Tab 1 → Copy URL: `https://docs.google.com/.../edit#gid=0`
- Klik Tab 2 → Copy URL: `https://docs.google.com/.../edit#gid=123456`
- Klik Tab 3 → Copy URL: `https://docs.google.com/.../edit#gid=789012`
- dst...

### STEP 4: Sync

**Sync PK:**
1. Buka `test-google-sheets.html`
2. Paste PK Sheet URL
3. Click "Sync PK from Google Sheets"

**Sync Klien:**
1. Buka `test-google-sheets-clients.html`
2. Untuk setiap PK:
   - Paste Klien Sheet URL (dengan #gid)
   - Click "Sync Klien"

---

## 📋 CSV Format (Alternative)

Jika ingin import via CSV:

### PK.csv
```csv
Nama,NIP,Telepon,Jabatan
"Budi Santoso, S.Sos",198501012010011001,081234567890,Pembimbing Kemasyarakatan Ahli Muda
"Siti Nurhaliza, S.H.",198702022011012002,081234567891,Pembimbing Kemasyarakatan Ahli Madya
"Ahmad Fauzi, S.Psi",198903032012011003,081234567892,Pembimbing Kemasyarakatan Ahli Muda
```

### Klien_Budi_Santoso.csv
```csv
Nama,NIK,Telepon,Alamat
Andi Wijaya,3201010101900001,081111111111,"Jl. Merdeka No. 1, Bandung"
Budi Setiawan,3201010101900002,081111111112,"Jl. Asia Afrika No. 5, Bandung"
Citra Dewi,3201010101900003,081111111113,"Jl. Braga No. 10, Bandung"
```

---

## 🎨 Visual Structure

```
📊 Google Sheets Setup
│
├── 📄 File 1: "Database PK BAPAS"
│   └── Tab: Sheet1
│       ├── Nama | NIP | Telepon | Jabatan
│       ├── Budi Santoso, S.Sos | 1985... | 0812... | PK Ahli Muda
│       ├── Siti Nurhaliza, S.H. | 1987... | 0812... | PK Ahli Madya
│       └── ...
│
└── 📄 File 2: "Database Klien BAPAS"
    ├── Tab 1: "Klien - Budi Santoso" (#gid=0)
    │   ├── Nama | NIK | Telepon | Alamat
    │   ├── Andi Wijaya | 3201... | 0811... | Jl. Merdeka...
    │   └── ...
    │
    ├── Tab 2: "Klien - Siti Nurhaliza" (#gid=123456)
    │   ├── Nama | NIK | Telepon | Alamat
    │   ├── Doni Prasetyo | 3201... | 0811... | Jl. Dago...
    │   └── ...
    │
    └── Tab 3-5: Similar structure
```

---

## ✅ Validation Rules

### PK Data:
- ✅ Nama: Required, max 100 chars
- ✅ NIP: Optional, 18 digits
- ✅ Telepon: Optional, 10-13 digits
- ✅ Jabatan: Optional, max 100 chars

### Klien Data:
- ✅ Nama: Required, max 100 chars
- ✅ NIK: Optional, 16 digits
- ✅ Telepon: Optional, 10-13 digits
- ✅ Alamat: Optional, max 255 chars

---

## 🔗 Quick Links

**Create Google Sheets:**
- https://sheets.google.com

**Test Pages:**
- `test-google-sheets.html` - Test PK sync
- `test-google-sheets-clients.html` - Test Klien sync

**Documentation:**
- `GOOGLE-SHEETS-INTEGRATION.md` - PK integration
- `GOOGLE-SHEETS-CLIENTS.md` - Klien integration

---

**Template siap digunakan!** 📊✨

**Copy-paste data di atas ke Google Sheets dan mulai sync!** 🚀
