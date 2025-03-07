const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to download a file from a URL
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

// Function to extract a zip file
async function extractZip(zipPath, outputDir) {
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outputDir, true);
}

// Main function to download a GitHub repository
async function downloadRepo() {
  if (process.argv.length < 3) {
    console.log('Usage: node download-repo.js <owner/repo> [branch]');
    process.exit(1);
  }
  
  const repoPath = process.argv[2];
  const branch = process.argv[3] || 'main';
  
  if (!repoPath.includes('/')) {
    console.log('Invalid repository format. Use owner/repo format.');
    process.exit(1);
  }
  
  const [owner, repo] = repoPath.split('/');
  const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;
  const zipPath = path.join(__dirname, `${repo}.zip`);
  
  console.log(`Downloading ${owner}/${repo} (${branch} branch)...`);
  
  try {
    // Install adm-zip for zip extraction
    console.log('Installing dependencies...');
    execSync('npm install adm-zip', { stdio: 'inherit' });
    
    // Download the zip file
    console.log(`Downloading from ${zipUrl}...`);
    await downloadFile(zipUrl, zipPath);
    
    // Extract the zip file
    console.log('Extracting files...');
    await extractZip(zipPath, __dirname);
    
    // Cleanup
    fs.unlinkSync(zipPath);
    
    console.log(`Repository downloaded to ${repo}-${branch}/`);
    console.log('You may want to move the files to your project root:');
    console.log(`mv ${repo}-${branch}/* ${repo}-${branch}/.* . 2>/dev/null || true`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

downloadRepo();
