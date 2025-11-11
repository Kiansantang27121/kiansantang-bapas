import axios from 'axios';

const sheetUrl = 'https://docs.google.com/spreadsheets/d/16BrXSFMf5A9xXemgLL_dS4GBKigjCkyXjC9VUMjLVPM/edit?gid=0#gid=0';

console.log('🔍 Analyzing Google Sheets...\n');

try {
  // Extract sheet ID
  const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!sheetIdMatch) {
    console.error('❌ Invalid Google Sheets URL');
    process.exit(1);
  }

  const sheetId = sheetIdMatch[1];
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  
  console.log('📥 Fetching CSV from:', csvUrl);
  console.log('');

  const response = await axios.get(csvUrl);
  const csvData = response.data;
  
  // Parse CSV with custom parser
  const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };
  
  const lines = csvData.split('\n').filter(line => line.trim());
  const headers = parseCSVLine(lines[0]);
  
  console.log('📋 Headers:', headers);
  console.log('📊 Total Lines:', lines.length);
  console.log('📊 Data Rows:', lines.length - 1);
  console.log('');
  
  // Find column indices
  const nameIndex = headers.findIndex(h => h.toLowerCase().includes('nama'));
  const nipIndex = headers.findIndex(h => h.toLowerCase().includes('nip'));
  const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('telepon') || h.toLowerCase().includes('phone'));
  const jabatanIndex = headers.findIndex(h => h.toLowerCase().includes('jabatan'));
  
  console.log('🔍 Column Indices:');
  console.log(`   Nama: ${nameIndex}`);
  console.log(`   NIP: ${nipIndex}`);
  console.log(`   Telepon: ${phoneIndex}`);
  console.log(`   Jabatan: ${jabatanIndex}`);
  console.log('');
  
  let validRows = 0;
  let emptyRows = 0;
  let noNameRows = 0;
  
  console.log('📝 Analyzing Each Row:');
  console.log('─'.repeat(100));
  
  for (let i = 1; i < Math.min(lines.length, 20); i++) {
    const line = lines[i].trim();
    
    if (!line) {
      console.log(`Row ${i + 1}: [EMPTY LINE]`);
      emptyRows++;
      continue;
    }
    
    const values = parseCSVLine(line);
    const name = values[nameIndex] || '';
    const nip = nipIndex !== -1 ? values[nipIndex] : '';
    const phone = phoneIndex !== -1 ? values[phoneIndex] : '';
    const jabatan = jabatanIndex !== -1 ? values[jabatanIndex] : '';
    
    if (!name) {
      console.log(`Row ${i + 1}: [NO NAME] - Values: ${JSON.stringify(values.slice(0, 4))}`);
      noNameRows++;
    } else {
      console.log(`Row ${i + 1}: ✅ ${name} | NIP: ${nip || '(kosong)'} | Phone: ${phone || '(kosong)'}`);
      validRows++;
    }
  }
  
  if (lines.length > 20) {
    console.log(`... (showing first 20 rows, total ${lines.length - 1} data rows)`);
  }
  
  console.log('');
  console.log('📊 Summary:');
  console.log('─'.repeat(100));
  console.log(`Total Data Rows: ${lines.length - 1}`);
  console.log(`Valid Rows (first 20): ${validRows}`);
  console.log(`Empty Rows (first 20): ${emptyRows}`);
  console.log(`No Name Rows (first 20): ${noNameRows}`);
  
  console.log('');
  console.log('💡 Recommendation:');
  if (noNameRows > 0) {
    console.log('⚠️  Ada baris tanpa nama! Sistem akan skip baris ini.');
    console.log('   Solusi: Pastikan semua baris punya kolom "Nama" terisi.');
  }
  if (emptyRows > 0) {
    console.log('⚠️  Ada baris kosong! Sistem akan skip baris ini.');
    console.log('   Solusi: Hapus baris kosong di Google Sheets.');
  }
  if (validRows === 19 && noNameRows === 0 && emptyRows === 0) {
    console.log('✅ Format terlihat baik! Semua baris valid.');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.response?.status === 403) {
    console.error('⚠️  Access denied! Pastikan Google Sheets di-share "Anyone with the link can view"');
  }
  process.exit(1);
}
