#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Apply the preview changes to the actual design-tokens.css file
 */

function main() {
  try {
    const previewPath = path.join(__dirname, '../design-tokens.preview.css');
    const cssPath = path.join(__dirname, '../design-tokens.css');
    
    if (!fs.existsSync(previewPath)) {
      console.log('❌ No preview file found. Run "npm run sync-tokens-preview" first.');
      return;
    }
    
    // Read the preview
    const previewContent = fs.readFileSync(previewPath, 'utf8');
    
    // Apply the changes
    fs.writeFileSync(cssPath, previewContent, 'utf8');
    
    console.log('✅ Changes applied successfully!');
    console.log('📁 Updated: src/styles/design-tokens.css');
    
    // Clean up preview file
    fs.unlinkSync(previewPath);
    console.log('🧹 Cleaned up preview file');
    
    console.log('\n🔄 Next steps:');
    console.log('1. Your CSS file is now updated with Token Studio tokens');
    console.log('2. Tailwind v4 will automatically pick up the changes');
    console.log('3. Run "npm start" to see the updates');
    
  } catch (error) {
    console.error('❌ Error applying changes:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 