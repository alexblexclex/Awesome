const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

async function extractZip() {
  try {
    // Check if repo.zip exists
    if (fs.existsSync('./repo.zip')) {
      console.log('Extracting repo.zip...');
      const zip = new AdmZip('./repo.zip');
      zip.extractAllTo('./', true);
      console.log('Extraction complete!');
    } else if (fs.existsSync('./sb1-c5yyxrdp.zip')) {
      console.log('Extracting sb1-c5yyxrdp.zip...');
      const zip = new AdmZip('./sb1-c5yyxrdp.zip');
      zip.extractAllTo('./', true);
      console.log('Extraction complete!');
    } else {
      console.log('No zip files found to extract.');
    }
    
    // List files after extraction
    console.log('\nFiles after extraction:');
    const files = fs.readdirSync('./');
    console.log(files);
  } catch (error) {
    console.error('Error during extraction:', error.message);
  }
}

extractZip();
