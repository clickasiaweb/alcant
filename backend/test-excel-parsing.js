const XLSX = require('xlsx');
const fs = require('fs');

async function testExcelParsing() {
  try {
    console.log('🧪 Testing Excel parsing directly...\n');
    
    const filePath = 'template-download-test.xlsx';
    console.log('📁 Reading file:', filePath);
    console.log('📁 File exists:', fs.existsSync(filePath));
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found');
      return;
    }
    
    const fileStats = fs.statSync(filePath);
    console.log('📁 File stats:', fileStats);
    
    // Try reading the file
    console.log('\n🔍 Attempting to read Excel file...');
    const fileBuffer = fs.readFileSync(filePath);
    console.log('📊 Buffer size:', fileBuffer.length);
    
    // Check first few bytes to see file type
    console.log('📊 File signature (first 8 bytes):', fileBuffer.slice(0, 8).toString('hex'));
    
    // Try to parse with XLSX - remove bookSheets option
    try {
      const workbook = XLSX.read(fileBuffer, { 
        type: 'buffer',
        cellStyles: false,
        cellNF: false,
        cellHTML: false,
        bookVBA: false
      });
      
      console.log('✅ Successfully read workbook');
      console.log('📊 Sheet names:', workbook.SheetNames);
      console.log('📊 Workbook keys:', Object.keys(workbook));
      console.log('📊 Workbook.Sheets:', workbook.Sheets);
      
      if (workbook.SheetNames && workbook.SheetNames.length > 0) {
        const sheetName = workbook.SheetNames[0];
        console.log('📊 Using sheet:', sheetName);
        
        const worksheet = workbook.Sheets[sheetName];
        console.log('📊 Worksheet exists:', !!worksheet);
        console.log('📊 Worksheet keys:', worksheet ? Object.keys(worksheet) : 'undefined');
        
        if (worksheet) {
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          console.log('📊 Data rows:', data.length);
          console.log('📊 First row (headers):', data[0]);
          if (data.length > 1) {
            console.log('📊 Second row (sample data):', data[1]);
          }
        }
      }
      
    } catch (error) {
      console.error('❌ XLSX parsing error:', error.message);
      console.error('❌ Stack:', error.stack);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testExcelParsing();
