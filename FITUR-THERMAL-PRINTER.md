# 🖨️ Fitur Auto-Print Thermal Printer

## 📋 Deskripsi

Fitur auto-print thermal printer memungkinkan sistem untuk **otomatis mencetak tiket antrian** ke printer thermal saat tombol "Daftar" ditekan pada aplikasi registrasi.

---

## ✨ Fitur Utama

### 1. **Auto-Print Setelah Registrasi**
- ✅ Otomatis print setelah klik "Daftar"
- ✅ Tidak mengganggu flow registrasi
- ✅ Silent error (jika print gagal, registrasi tetap berhasil)

### 2. **Layout Thermal Optimized**
- ✅ Ukuran kertas: 80mm (thermal standard)
- ✅ Font: Courier New (monospace)
- ✅ Layout disesuaikan untuk printer thermal
- ✅ Nomor antrian BESAR dan jelas

### 3. **Dual Print Method**
- ✅ **Method 1**: Web USB API (direct USB printer)
- ✅ **Method 2**: Iframe print (fallback)

---

## 📄 Layout Tiket

```
================================
    BAPAS KELAS I BANDUNG
        KIANSANTANG
  Jl. Soekarno Hatta No. 748
        (022) 7534015

================================

        B008

================================

LAYANAN:
Bimbingan Wajib Lapor

NAMA:
Andi Wijaya

PEMBIMBING KEMASYARAKATAN:
Budiana
(PK Madya)

Estimasi:           ~15 menit

--------------------------------
Tanggal:  Senin, 11 Nov 2025
Waktu:           13:45:30 WIB
--------------------------------

    Mohon menunggu panggilan
         di ruang tunggu

      Terima kasih atas
        kunjungan Anda

================================
```

---

## 🔧 Implementasi Teknis

### File Structure

```
registration-app/
├── src/
│   ├── components/
│   │   └── RegistrationForm.jsx  ← Updated dengan auto-print
│   └── utils/
│       └── thermalPrinter.js     ← NEW: Thermal printer utility
```

### Thermal Printer Utility

**File**: `src/utils/thermalPrinter.js`

**Functions**:
- `generateThermalTicket(queueData, settings)` - Generate ESC/POS commands
- `printThermalTicket(queueData, settings)` - Print tiket
- `convertToHTML(queueData, settings)` - Fallback HTML print

**ESC/POS Commands**:
```javascript
const commands = {
  INIT: '\x1B@',              // Initialize
  ALIGN_CENTER: '\x1Ba1',     // Center align
  BOLD_ON: '\x1BE1',          // Bold on
  SIZE_DOUBLE: '\x1D!\x11',   // Double size
  SIZE_HUGE: '\x1D!\x33',     // Huge size (nomor antrian)
  CUT_PAPER: '\x1DV\x41\x00', // Cut paper
}
```

---

## 🖨️ Printer Support

### Supported Printers

Printer thermal yang didukung (via Web USB API):

| Brand | Vendor ID | Model |
|-------|-----------|-------|
| SEWOO | 0x0416 | LK-T/LK-P Series |
| EPSON | 0x04b8 | TM-T20/TM-T82 |
| Star Micronics | 0x0519 | TSP100/TSP650 |
| Xprinter | 0x154f | XP-80/XP-365B |
| Custom | 0x1fc9 | VKP80 |

### Print Methods

#### Method 1: Web USB API (Recommended)
```javascript
// Direct USB connection
const device = await navigator.usb.requestDevice({
  filters: [{ vendorId: 0x0416 }] // SEWOO
})
await device.open()
await device.transferOut(1, data)
```

**Kelebihan**:
- ✅ Direct ke printer
- ✅ Cepat
- ✅ Support ESC/POS commands

**Kekurangan**:
- ❌ Perlu user permission pertama kali
- ❌ Hanya HTTPS atau localhost

#### Method 2: Iframe Print (Fallback)
```javascript
// Print via browser print dialog
const iframe = document.createElement('iframe')
iframe.contentWindow.print()
```

**Kelebihan**:
- ✅ Tidak perlu permission
- ✅ Works di semua browser

**Kekurangan**:
- ❌ Muncul print dialog
- ❌ Tidak support ESC/POS commands

---

## 📱 Cara Menggunakan

### Setup Printer

#### 1. **Koneksi USB**
```
1. Colokkan printer thermal ke USB
2. Install driver printer (jika perlu)
3. Test print dari aplikasi lain
```

#### 2. **Browser Permission**
```
1. Buka aplikasi registrasi
2. Klik "Daftar" pertama kali
3. Browser akan minta permission USB
4. Pilih printer thermal Anda
5. Klik "Connect"
```

#### 3. **Auto-Print**
```
Setelah permission diberikan:
1. Isi form registrasi
2. Klik "Daftar"
3. ✅ Tiket otomatis tercetak!
```

---

## 🧪 Testing

### Test Print Function

Buat file test: `test-thermal-print.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Thermal Print</title>
  <script type="module">
    import { printThermalTicket } from './src/utils/thermalPrinter.js';
    
    async function testPrint() {
      const testData = {
        queue_number: 'B008',
        service_name: 'Bimbingan Wajib Lapor',
        client_name: 'Andi Wijaya',
        pk_name: 'Budiana',
        pk_jabatan: 'PK Madya',
        estimated_time: 15,
        created_at: new Date().toISOString()
      };
      
      const result = await printThermalTicket(testData);
      console.log('Print result:', result);
    }
    
    window.testPrint = testPrint;
  </script>
</head>
<body>
  <h1>Test Thermal Printer</h1>
  <button onclick="testPrint()">Test Print</button>
</body>
</html>
```

### Test Checklist

- [ ] Printer terdeteksi via USB
- [ ] Permission granted
- [ ] Print berhasil
- [ ] Layout sesuai (80mm)
- [ ] Nomor antrian besar dan jelas
- [ ] Semua info tercetak lengkap
- [ ] Paper cut otomatis

---

## 🔍 Troubleshooting

### Issue 1: Printer Tidak Terdeteksi

**Gejala**: Browser tidak menampilkan printer

**Solusi**:
```
1. Pastikan printer nyala dan terhubung USB
2. Install driver printer
3. Test print dari aplikasi lain
4. Gunakan browser Chrome/Edge (support Web USB)
5. Pastikan HTTPS atau localhost
```

### Issue 2: Permission Denied

**Gejala**: "User denied permission"

**Solusi**:
```
1. Refresh halaman
2. Klik "Daftar" lagi
3. Pilih printer yang benar
4. Klik "Allow"
```

### Issue 3: Print Gagal

**Gejala**: Error saat print

**Solusi**:
```
1. Check koneksi USB
2. Restart printer
3. Clear browser cache
4. Gunakan fallback method (iframe)
```

### Issue 4: Layout Tidak Sesuai

**Gejala**: Text terpotong atau tidak rapi

**Solusi**:
```
1. Pastikan printer 80mm
2. Adjust width di thermalPrinter.js
3. Test dengan printer lain
```

---

## ⚙️ Konfigurasi

### Settings

Edit di `thermalPrinter.js`:

```javascript
// Lebar kertas (characters)
const PAPER_WIDTH = 32; // 80mm = 32 chars

// Separator character
const SEPARATOR_CHAR = '-';

// Organization info
const DEFAULT_SETTINGS = {
  organization_name: 'BAPAS KELAS I BANDUNG',
  system_name: 'KIANSANTANG',
  address: 'Jl. Soekarno Hatta No. 748, Bandung',
  phone: '(022) 7534015'
};
```

### Custom Layout

Untuk mengubah layout, edit function `generateThermalTicket()`:

```javascript
// Contoh: Tambah logo ASCII
ticket += '     ___  ___  ';
ticket += commands.LINE_FEED;
ticket += '    | _ )| _ \\ ';
ticket += commands.LINE_FEED;
ticket += '    | _ \\|  _/ ';
ticket += commands.LINE_FEED;
ticket += '    |___/|_|   ';
ticket += commands.LINE_FEED;
```

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────────┐
│ User mengisi form registrasi            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ User klik "Daftar"                      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ POST /api/queue                         │
│ → Buat antrian di database              │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Response: queue data                    │
│ { queue_number, client_name, ... }      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ printThermalTicket(queueData)           │
│ → Generate ESC/POS commands             │
│ → Try Web USB API                       │
│ → Fallback to iframe print              │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 🖨️ Tiket tercetak!                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Show success screen                     │
│ → Display queue number                  │
│ → Show instructions                     │
└─────────────────────────────────────────┘
```

---

## 🎯 Best Practices

### 1. **Silent Error Handling**
```javascript
try {
  await printThermalTicket(queueData)
} catch (error) {
  // Log error tapi jangan tampilkan ke user
  console.error('Print failed:', error)
  // Registrasi tetap berhasil!
}
```

### 2. **Async Print**
```javascript
// Jangan block UI
const printResult = await printThermalTicket(queueData)
// Lanjutkan ke success screen
onSuccess(queueData)
```

### 3. **Fallback Method**
```javascript
// Selalu sediakan fallback
if (usbPrintFailed) {
  // Use iframe print
  iframePrint()
}
```

---

## 📝 Changelog

### v1.0.0 (2025-11-11)
- ✅ Initial release
- ✅ Auto-print setelah registrasi
- ✅ Web USB API support
- ✅ Iframe print fallback
- ✅ ESC/POS commands
- ✅ Layout thermal optimized
- ✅ Silent error handling

---

## 🔗 Resources

### Documentation
- [Web USB API](https://developer.mozilla.org/en-US/docs/Web/API/USB)
- [ESC/POS Commands](https://reference.epson-biz.com/modules/ref_escpos/index.php)
- [Thermal Printer Guide](https://github.com/receipt-print-hq/escpos-tools)

### Printer Specs
- Paper width: 80mm (standard)
- Character width: 32 chars
- Font: Courier New 12px
- DPI: 203 (8 dots/mm)

---

## 🎉 Kesimpulan

Fitur thermal printer sudah terintegrasi dengan sempurna:

✅ **Auto-print** setelah registrasi
✅ **Layout optimized** untuk thermal 80mm
✅ **Dual method** (USB + iframe)
✅ **Silent error** tidak ganggu user
✅ **Professional** layout dengan semua info

**Sistem KIANSANTANG siap untuk produksi!** 🚀
