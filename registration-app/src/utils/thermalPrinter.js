/**
 * Thermal Printer Utility
 * Menggunakan ESC/POS commands untuk printer thermal
 */

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';

const commands = {
  INIT: ESC + '@',                    // Initialize printer
  ALIGN_CENTER: ESC + 'a' + '1',      // Center align
  ALIGN_LEFT: ESC + 'a' + '0',        // Left align
  ALIGN_RIGHT: ESC + 'a' + '2',       // Right align
  BOLD_ON: ESC + 'E' + '1',           // Bold on
  BOLD_OFF: ESC + 'E' + '0',          // Bold off
  SIZE_NORMAL: GS + '!' + '\x00',     // Normal size
  SIZE_DOUBLE: GS + '!' + '\x11',     // Double size (2x width, 2x height)
  SIZE_LARGE: GS + '!' + '\x22',      // Large size (3x width, 3x height)
  SIZE_HUGE: GS + '!' + '\x33',       // Huge size (4x width, 4x height)
  UNDERLINE_ON: ESC + '-' + '1',      // Underline on
  UNDERLINE_OFF: ESC + '-' + '0',     // Underline off
  LINE_FEED: '\n',                    // Line feed
  CUT_PAPER: GS + 'V' + '\x41' + '\x00', // Cut paper
  BARCODE_HEIGHT: GS + 'h' + '\x50',  // Barcode height (80 dots)
  BARCODE_WIDTH: GS + 'w' + '\x03',   // Barcode width (3)
  BARCODE_PRINT: GS + 'k' + '\x04',   // Print CODE39 barcode
};

/**
 * Format tanggal Indonesia
 */
function formatDate(date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  const d = new Date(date);
  const dayName = days[d.getDay()];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  
  return `${dayName}, ${day} ${month} ${year}`;
}

/**
 * Format waktu
 */
function formatTime(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds} WIB`;
}

/**
 * Buat garis pemisah
 */
function separator(char = '-', length = 32) {
  return char.repeat(length);
}

/**
 * Center text dengan padding
 */
function centerText(text, width = 32) {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * Format text dengan padding kiri-kanan
 */
function formatRow(left, right, width = 32) {
  const spaces = Math.max(1, width - left.length - right.length);
  return left + ' '.repeat(spaces) + right;
}

/**
 * Generate layout tiket thermal
 */
export function generateThermalTicket(queueData, settings = {}) {
  const {
    queue_number,
    service_name,
    client_name,
    pk_name,
    pk_jabatan,
    estimated_time,
    created_at
  } = queueData;

  const organizationName = settings.organization_name || 'BAPAS KELAS I BANDUNG';
  const systemName = settings.system_name || 'KIANSANTANG';
  const address = settings.address || 'Jl. Soekarno Hatta No. 748, Bandung';
  const phone = settings.phone || '(022) 7534015';

  let ticket = '';

  // Initialize printer
  ticket += commands.INIT;
  
  // Header - Logo/Title
  ticket += commands.ALIGN_CENTER;
  ticket += commands.SIZE_DOUBLE;
  ticket += commands.BOLD_ON;
  ticket += organizationName;
  ticket += commands.LINE_FEED;
  ticket += commands.BOLD_OFF;
  ticket += commands.SIZE_NORMAL;
  
  // System name
  ticket += commands.BOLD_ON;
  ticket += systemName;
  ticket += commands.LINE_FEED;
  ticket += commands.BOLD_OFF;
  
  // Address & Phone
  ticket += address;
  ticket += commands.LINE_FEED;
  ticket += phone;
  ticket += commands.LINE_FEED;
  ticket += commands.LINE_FEED;
  
  // Separator
  ticket += separator('=');
  ticket += commands.LINE_FEED;
  
  // Nomor Antrian (BESAR)
  ticket += commands.SIZE_HUGE;
  ticket += commands.BOLD_ON;
  ticket += queue_number;
  ticket += commands.LINE_FEED;
  ticket += commands.BOLD_OFF;
  ticket += commands.SIZE_NORMAL;
  
  // Separator
  ticket += separator('=');
  ticket += commands.LINE_FEED;
  ticket += commands.LINE_FEED;
  
  // Detail Layanan
  ticket += commands.ALIGN_LEFT;
  ticket += commands.BOLD_ON;
  ticket += 'LAYANAN:';
  ticket += commands.LINE_FEED;
  ticket += commands.BOLD_OFF;
  ticket += service_name;
  ticket += commands.LINE_FEED;
  ticket += commands.LINE_FEED;
  
  // Nama Klien
  ticket += commands.BOLD_ON;
  ticket += 'NAMA:';
  ticket += commands.LINE_FEED;
  ticket += commands.BOLD_OFF;
  ticket += client_name;
  ticket += commands.LINE_FEED;
  ticket += commands.LINE_FEED;
  
  // Info PK (jika ada)
  if (pk_name) {
    ticket += commands.BOLD_ON;
    ticket += 'PEMBIMBING KEMASYARAKATAN:';
    ticket += commands.LINE_FEED;
    ticket += commands.BOLD_OFF;
    ticket += pk_name;
    ticket += commands.LINE_FEED;
    if (pk_jabatan) {
      ticket += `(${pk_jabatan})`;
      ticket += commands.LINE_FEED;
    }
    ticket += commands.LINE_FEED;
  }
  
  // Estimasi Waktu
  if (estimated_time) {
    ticket += formatRow('Estimasi:', `~${estimated_time} menit`);
    ticket += commands.LINE_FEED;
    ticket += commands.LINE_FEED;
  }
  
  // Separator
  ticket += separator('-');
  ticket += commands.LINE_FEED;
  
  // Tanggal & Waktu
  ticket += formatRow('Tanggal:', formatDate(created_at));
  ticket += commands.LINE_FEED;
  ticket += formatRow('Waktu:', formatTime(created_at));
  ticket += commands.LINE_FEED;
  
  // Separator
  ticket += separator('-');
  ticket += commands.LINE_FEED;
  ticket += commands.LINE_FEED;
  
  // Footer - Instruksi
  ticket += commands.ALIGN_CENTER;
  ticket += commands.SIZE_NORMAL;
  ticket += 'Mohon menunggu panggilan';
  ticket += commands.LINE_FEED;
  ticket += 'di ruang tunggu';
  ticket += commands.LINE_FEED;
  ticket += commands.LINE_FEED;
  ticket += 'Terima kasih atas';
  ticket += commands.LINE_FEED;
  ticket += 'kunjungan Anda';
  ticket += commands.LINE_FEED;
  ticket += commands.LINE_FEED;
  
  // Separator
  ticket += separator('=');
  ticket += commands.LINE_FEED;
  ticket += commands.LINE_FEED;
  ticket += commands.LINE_FEED;
  
  // Cut paper
  ticket += commands.CUT_PAPER;
  
  return ticket;
}

/**
 * Print ke thermal printer
 * TRUE AUTO-PRINT - Langsung print tanpa dialog
 */
export async function printThermalTicket(queueData, settings = {}) {
  try {
    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Tiket Antrian</title>
        <style>
          @page { 
            margin: 0; 
            size: 80mm auto; 
          }
          @media print {
            body { 
              margin: 0; 
              padding: 5mm; 
              font-family: 'Courier New', monospace;
              font-size: 11px;
              line-height: 1.3;
            }
          }
          body { 
            margin: 0; 
            padding: 10mm; 
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .large { font-size: 20px; }
          .huge { font-size: 42px; }
          .separator { 
            border-top: 1px dashed #000; 
            margin: 5px 0; 
          }
        </style>
        <script>
          // Auto-print when loaded
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // Auto-close after print
              setTimeout(function() {
                window.close();
              }, 100);
            }, 250);
          };
          
          // Handle print completion
          window.onafterprint = function() {
            window.close();
          };
        </script>
      </head>
      <body>
        ${convertToHTML(queueData, settings)}
      </body>
      </html>
    `);
    doc.close();
    
    // Cleanup iframe after print
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 3000);
    
    console.log('✅ Auto-print triggered');
    return { success: true, method: 'auto-print' };
    
  } catch (error) {
    console.error('❌ Print error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Print ke thermal printer - SILENT MODE
 * Menggunakan window.open untuk true silent print
 * Catatan: Perlu allow pop-ups di browser
 */
export async function printThermalTicketSilent(queueData, settings = {}) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Print Tiket</title>
        <style>
          @page { 
            margin: 0; 
            size: 80mm auto; 
          }
          @media print {
            body { 
              margin: 0; 
              padding: 5mm; 
              font-family: 'Courier New', monospace;
              font-size: 11px;
              line-height: 1.3;
            }
          }
          body { 
            margin: 0; 
            padding: 10mm; 
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .large { font-size: 20px; }
          .huge { font-size: 42px; }
          .separator { border-top: 1px dashed #000; margin: 5px 0; }
        </style>
      </head>
      <body>
        ${convertToHTML(queueData, settings)}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;
    
    // Open in new window and auto-print
    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      console.log('✅ Silent print triggered');
      return { success: true, method: 'silent-print' };
    } else {
      throw new Error('Pop-up blocked. Please allow pop-ups for this site.');
    }
    
  } catch (error) {
    console.error('❌ Silent print error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Print ke thermal printer via USB (manual trigger)
 * Untuk digunakan dengan user interaction (button click)
 */
export async function printThermalTicketUSB(queueData, settings = {}) {
  const ticketContent = generateThermalTicket(queueData, settings);
  
  if (!('usb' in navigator)) {
    throw new Error('Web USB API not supported in this browser');
  }
  
  try {
    const device = await navigator.usb.requestDevice({
      filters: [
        { vendorId: 0x0416 }, // SEWOO
        { vendorId: 0x04b8 }, // EPSON
        { vendorId: 0x0519 }, // Star Micronics
        { vendorId: 0x154f }, // Xprinter
        { vendorId: 0x1fc9 }, // Custom
        { vendorId: 0x0fe6 }, // ICS Advent (RPP02N)
        { vendorId: 0x20d1 }, // RPP series
        { vendorId: 0x6868 }, // Generic thermal printer
        { vendorId: 0x0483 }, // STMicroelectronics (some thermal printers)
      ]
    });
    
    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);
    
    const encoder = new TextEncoder();
    const data = encoder.encode(ticketContent);
    
    await device.transferOut(1, data);
    await device.close();
    
    console.log('✅ Printed via USB');
    return { success: true, method: 'usb' };
  } catch (error) {
    console.error('❌ USB Print error:', error);
    throw error;
  }
}

/**
 * Convert queue data to HTML for fallback printing
 */
function convertToHTML(queueData, settings = {}) {
  const {
    queue_number,
    service_name,
    client_name,
    pk_name,
    pk_jabatan,
    estimated_time,
    created_at
  } = queueData;

  const organizationName = settings.organization_name || 'BAPAS KELAS I BANDUNG';
  const systemName = settings.system_name || 'KIANSANTANG';
  const address = settings.address || 'Jl. Soekarno Hatta No. 748, Bandung';
  const phone = settings.phone || '(022) 7534015';

  return `
    <div class="center">
      <div class="bold large">${organizationName}</div>
      <div class="bold">${systemName}</div>
      <div>${address}</div>
      <div>${phone}</div>
    </div>
    
    <div class="separator"></div>
    
    <div class="center">
      <div class="bold huge">${queue_number}</div>
    </div>
    
    <div class="separator"></div>
    
    <div style="margin-top: 10px;">
      <div class="bold">LAYANAN:</div>
      <div>${service_name}</div>
    </div>
    
    <div style="margin-top: 10px;">
      <div class="bold">NAMA:</div>
      <div>${client_name}</div>
    </div>
    
    ${pk_name ? `
      <div style="margin-top: 10px;">
        <div class="bold">PEMBIMBING KEMASYARAKATAN:</div>
        <div>${pk_name}</div>
        ${pk_jabatan ? `<div>(${pk_jabatan})</div>` : ''}
      </div>
    ` : ''}
    
    ${estimated_time ? `
      <div style="margin-top: 10px;">
        <div>Estimasi: ~${estimated_time} menit</div>
      </div>
    ` : ''}
    
    <div class="separator"></div>
    
    <div style="margin-top: 10px;">
      <div>Tanggal: ${formatDate(created_at)}</div>
      <div>Waktu: ${formatTime(created_at)}</div>
    </div>
    
    <div class="separator"></div>
    
    <div class="center" style="margin-top: 10px;">
      <div>Mohon menunggu panggilan</div>
      <div>di ruang tunggu</div>
      <div style="margin-top: 10px;">Terima kasih atas</div>
      <div>kunjungan Anda</div>
    </div>
  `;
}

export default {
  generateThermalTicket,
  printThermalTicket,
  printThermalTicketSilent,
  printThermalTicketUSB
};
