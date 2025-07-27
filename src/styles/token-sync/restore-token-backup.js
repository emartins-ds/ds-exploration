#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Restore the design-tokens.css file from backup
 */

function main() {
  try {
    const backupPath = path.join(__dirname, '../design-tokens.backup.css');
    const cssPath = path.join(__dirname, '../design-tokens.css');
    
    if (!fs.existsSync(backupPath)) {
      console.log('❌ No backup file found.');
      return;
    }
    
    // Restore from backup
    fs.copyFileSync(backupPath, cssPath);
    
    console.log('✅ Backup restored successfully!');
    console.log('📁 Restored: src/styles/design-tokens.css');
    
    // Clean up backup file
    fs.unlinkSync(backupPath);
    console.log('🧹 Cleaned up backup file');
    
    console.log('\n🔄 Your design tokens are back to their previous state.');
    
  } catch (error) {
    console.error('❌ Error restoring backup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 