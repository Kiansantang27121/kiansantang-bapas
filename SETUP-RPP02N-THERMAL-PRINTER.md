# 🖨️ Setup RPP02N Thermal Printer

## 📋 Tentang RPP02N

**RPP02N** adalah printer thermal 58mm yang umum digunakan untuk:
- Cetak struk kasir
- Tiket antrian
- Receipt printer
- Label printer

**Spesifikasi**:
- Lebar kertas: 58mm
- Interface: USB
- Driver: ESC/POS compatible
- Kecepatan: 90mm/s
- Auto-cutter: Ya

---

## 🔌 Koneksi Hardware

### Step 1: Persiapan Fisik

```
1. Pasang roll kertas thermal 58mm
   ├─ Buka cover printer
   ├─ Masukkan roll kertas
   ├─ Tarik ujung kertas keluar
   └─ Tutup cover (akan auto-cut)

2. Hubungkan kabel USB
   ├─ Colokkan ke port USB printer
   ├─ Colokkan ke port USB komputer
   └─ Tunggu LED menyala

3. Nyalakan printer
   ├─ Tekan tombol power
   ├─ LED akan berkedip
   └─ Test print (tekan tombol feed)
```

### Step 2: Install Driver

#### **Windows**:

**Option 1: Auto-Install**
```
1. Windows akan detect printer otomatis
2. Tunggu "Installing device driver software..."
3. Selesai! Printer siap digunakan
```

**Option 2: Manual Install**
```
1. Download driver RPP02N:
   https://www.rppsystem.com/download
   
2. Extract file ZIP
3. Jalankan setup.exe
4. Ikuti wizard instalasi
5. Restart komputer
6. ✅ Done!
```

**Option 3: Generic Driver**
```
1. Buka Control Panel → Devices and Printers
2. Klik "Add a printer"
3. Pilih "The printer that I want isn't listed"
4. Pilih "Add a local printer"
5. Port: USB001 (Virtual printer port for USB)
6. Manufacturer: Generic
7. Printer: Generic / Text Only
8. Nama: RPP02N Thermal Printer
9. ✅ Done!
```

---

## 🔧 Konfigurasi Software

### Method 1: Browser Print (Recommended untuk Auto-Print)

#### Setup:

```
1. Set RPP02N sebagai default printer:
   ├─ Control Panel → Devices and Printers
   ├─ Right-click RPP02N
   └─ Set as default printer ✅

2. Test print dari browser:
   ├─ Buka test-thermal-printer.html
   ├─ Klik "Test Iframe Print"
   ├─ Print dialog muncul
   ├─ Pilih RPP02N
   └─ Klik Print ✅

3. Konfigurasi print settings:
   ├─ Paper size: 58mm (Custom)
   ├─ Orientation: Portrait
   ├─ Margins: None (0mm)
   └─ Scale: 100%
```

#### Test:

```bash
# Buka test file
start test-thermal-printer.html

# Test steps:
1. Klik "Test Iframe Print"
2. Print dialog muncul
3. Pilih "RPP02N Thermal Printer"
4. Klik "Print"
5. ✅ Tiket tercetak!
```

---

### Method 2: USB Direct Print (Advanced)

#### Setup:

```
1. Pastikan browser support Web USB:
   ├─ Chrome ✅
   ├─ Edge ✅
   ├─ Opera ✅
   └─ Firefox ❌ (tidak support)

2. Pastikan HTTPS atau localhost:
   ├─ https://your-domain.com ✅
   ├─ http://localhost ✅
   └─ http://192.168.x.x ❌

3. Buka aplikasi registrasi:
   http://localhost:5173
```

#### Test USB Connection:

```bash
# Buka test file
start test-thermal-printer.html

# Test steps:
1. Klik "Test USB Print"
2. Browser minta permission
3. Pilih "RPP02N" atau "USB Printing Support"
4. Klik "Connect"
5. ✅ Tiket langsung tercetak!
```

#### Troubleshooting USB:

**Jika printer tidak muncul di list**:

```javascript
// Check vendor ID printer Anda
// Buka Chrome DevTools → Console
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log('Vendor ID:', device.vendorId.toString(16))
    console.log('Product ID:', device.productId.toString(16))
    console.log('Product Name:', device.productName)
  })
})
```

**Tambahkan vendor ID ke code**:

```javascript
// Di thermalPrinter.js
const device = await navigator.usb.requestDevice({
  filters: [
    { vendorId: 0x0fe6 }, // ICS Advent (RPP02N)
    { vendorId: 0x20d1 }, // RPP series
    { vendorId: 0xYOUR_VENDOR_ID }, // Tambahkan vendor ID Anda
  ]
});
```

---

## 📄 Konfigurasi Paper Size

### Windows Print Settings:

```
1. Control Panel → Devices and Printers
2. Right-click RPP02N → Printing preferences
3. Tab "Paper/Quality":
   ├─ Paper size: Custom
   ├─ Width: 58mm
   ├─ Height: Auto (continuous)
   └─ Apply

4. Tab "Advanced":
   ├─ Paper/Output → Paper Size: 58mm
   ├─ Document Options → Print Quality: High
   └─ OK
```

### Custom Paper Size (jika tidak ada 58mm):

```
1. Control Panel → Devices and Printers
2. File → Server properties
3. Tab "Forms":
   ├─ Create a new form ✅
   ├─ Form name: "Thermal 58mm"
   ├─ Width: 58mm
   ├─ Height: 297mm (atau sesuai kebutuhan)
   ├─ Save form
   └─ OK

4. Kembali ke Printing preferences
5. Pilih "Thermal 58mm"
6. ✅ Done!
```

---

## 🧪 Testing

### Test 1: Hardware Test

```
1. Tekan tombol FEED di printer
2. Kertas keluar → ✅ Hardware OK
3. Jika tidak keluar → Check power & kertas
```

### Test 2: Driver Test

```
1. Buka Notepad
2. Ketik "TEST PRINT"
3. File → Print
4. Pilih RPP02N
5. Print → ✅ Driver OK
```

### Test 3: Browser Print Test

```
1. Buka test-thermal-printer.html
2. Klik "Test Iframe Print"
3. Pilih RPP02N
4. Print → ✅ Browser print OK
```

### Test 4: USB Direct Test

```
1. Buka test-thermal-printer.html
2. Klik "Test USB Print"
3. Pilih RPP02N di dialog
4. Connect → ✅ USB direct OK
```

### Test 5: Application Test

```
1. Buka aplikasi registrasi
2. Pilih layanan
3. Isi form
4. Klik "Daftar"
5. Print dialog muncul
6. Pilih RPP02N
7. Print → ✅ Application OK
```

---

## 🔍 Troubleshooting

### Issue 1: Printer Tidak Terdeteksi

**Gejala**: Printer tidak muncul di Devices and Printers

**Solusi**:
```
1. Check kabel USB:
   ├─ Cabut dan colokkan lagi
   ├─ Coba port USB lain
   └─ Coba kabel USB lain

2. Check power:
   ├─ LED menyala? ✅
   ├─ Jika tidak → Check adaptor
   └─ Test dengan tekan tombol FEED

3. Restart komputer
4. Install driver manual
```

### Issue 2: Print Tidak Keluar

**Gejala**: Print command sent tapi tidak ada output

**Solusi**:
```
1. Check kertas:
   ├─ Apakah ada kertas? ✅
   ├─ Apakah terpasang benar? ✅
   └─ Tekan FEED untuk test

2. Check print queue:
   ├─ Buka Devices and Printers
   ├─ Double-click RPP02N
   ├─ Lihat queue → Clear jika ada error
   └─ Restart print spooler service

3. Check printer status:
   ├─ Right-click RPP02N
   ├─ Printer properties
   └─ Print test page
```

### Issue 3: Layout Tidak Sesuai

**Gejala**: Text terpotong atau tidak rapi

**Solusi**:
```
1. Check paper size:
   ├─ Printing preferences → Paper size: 58mm ✅
   ├─ Jika tidak ada → Buat custom size
   └─ Apply

2. Check margins:
   ├─ Printing preferences → Margins: 0mm ✅
   └─ Apply

3. Check scale:
   ├─ Print dialog → More settings
   ├─ Scale: 100% ✅
   └─ Print
```

### Issue 4: USB Permission Denied

**Gejala**: "User denied permission" saat USB print

**Solusi**:
```
1. Refresh halaman
2. Klik "Test USB Print" lagi
3. Pilih printer yang BENAR
4. Klik "Allow" / "Connect"
5. ✅ Done!

Catatan: Permission hanya perlu sekali
```

### Issue 5: Print Dialog Tidak Muncul

**Gejala**: Auto-print tidak trigger dialog

**Solusi**:
```
1. Check browser settings:
   ├─ Chrome → Settings → Privacy
   ├─ Site settings → Pop-ups
   └─ Allow pop-ups untuk localhost ✅

2. Check browser console:
   ├─ F12 → Console
   ├─ Lihat error message
   └─ Fix sesuai error

3. Refresh aplikasi
4. Clear browser cache
```

---

## 📊 Comparison: Browser Print vs USB Direct

| Feature | Browser Print | USB Direct |
|---------|--------------|------------|
| **Setup** | ✅ Mudah | ⚠️ Perlu permission |
| **Driver** | ✅ Perlu install | ⚠️ Optional |
| **Print Dialog** | ⚠️ Muncul | ✅ Silent |
| **Speed** | ⚠️ Normal | ✅ Cepat |
| **ESC/POS** | ❌ Tidak | ✅ Ya |
| **Browser** | ✅ Semua | ⚠️ Chrome/Edge |
| **HTTPS** | ✅ Tidak perlu | ⚠️ Perlu |

---

## 🎯 Rekomendasi

### Untuk Kiosk/Self-Service:
```
✅ Gunakan Browser Print (iframe)
✅ Set RPP02N sebagai default printer
✅ Auto-print akan trigger dialog
✅ User tinggal klik "Print"
```

### Untuk Operator Mode:
```
✅ Gunakan USB Direct Print
✅ Setup permission sekali
✅ Selanjutnya silent print
✅ Lebih cepat dan efisien
```

---

## 📝 Checklist Setup

### Pre-Installation:
- [ ] Printer RPP02N tersedia
- [ ] Kertas thermal 58mm tersedia
- [ ] Kabel USB tersedia
- [ ] Komputer Windows/Mac/Linux

### Installation:
- [ ] Pasang kertas thermal
- [ ] Hubungkan USB
- [ ] Nyalakan printer
- [ ] Install driver
- [ ] Test print (tombol FEED)

### Configuration:
- [ ] Set sebagai default printer
- [ ] Konfigurasi paper size (58mm)
- [ ] Set margins (0mm)
- [ ] Test print dari Notepad

### Testing:
- [ ] Test hardware (tombol FEED)
- [ ] Test driver (Notepad)
- [ ] Test browser print (test HTML)
- [ ] Test USB direct (test HTML)
- [ ] Test aplikasi registrasi

### Production:
- [ ] Aplikasi registrasi running
- [ ] Auto-print works
- [ ] Print quality OK
- [ ] User training done
- [ ] ✅ Ready for production!

---

## 🎉 Kesimpulan

**Setup RPP02N berhasil jika**:
- ✅ Printer terdeteksi di Windows
- ✅ Test print dari Notepad berhasil
- ✅ Browser print dialog muncul
- ✅ Tiket tercetak dengan layout benar
- ✅ Auto-print works di aplikasi

**Sistem siap digunakan!** 🚀🖨️

---

## 📞 Support

Jika masih ada masalah:

1. **Check dokumentasi**:
   - FITUR-THERMAL-PRINTER.md
   - FIX-THERMAL-PRINTER-AUTO-PRINT.md

2. **Test dengan file**:
   - test-thermal-printer.html

3. **Check browser console**:
   - F12 → Console → Lihat error

4. **Contact support**:
   - Email: support@kiansantang.com
   - Phone: (022) 7534015
