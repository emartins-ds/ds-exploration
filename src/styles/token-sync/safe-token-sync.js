#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Safe Token Studio to CSS sync with backup and preview functionality
 */

function convertTokenStudioToCSS(tokenStudioJson) {
      // First, read the existing CSS file to preserve custom tokens
    const existingCssPath = path.join(__dirname, '../design-tokens.css');
  let existingTokens = {};
  
  if (fs.existsSync(existingCssPath)) {
    const existingCss = fs.readFileSync(existingCssPath, 'utf8');
    existingTokens = parseExistingTokens(existingCss);
  }

  let css = `/* Design System Tokens for Tailwind CSS v4 */
/* Auto-generated from Token Studio - ${new Date().toISOString()} */

@theme {
`;

  // Function to recursively process nested tokens with organization
  function processTokens(obj, prefix = '', sectionName = '') {
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value.value && value.type) {
        // This is a token with value and type
        const tokenName = prefix ? `${prefix}.${key}` : key;
        const cssVarName = `--${tokenName.replace(/\./g, '-')}`;
        
        // Handle different token types
        let cssValue = value.value;
        
        // Convert Token Studio format to CSS format
        if (value.type === 'color') {
          // Handle color references like "{color.secondary.900}"
          if (typeof cssValue === 'string' && cssValue.startsWith('{') && cssValue.endsWith('}')) {
            // Convert reference to CSS variable
            const refName = cssValue.slice(1, -1).replace(/\./g, '-');
            cssValue = `var(--${refName})`;
          }
        } else if (value.type === 'boxShadow') {
          // Handle complex shadow objects
          if (typeof cssValue === 'object') {
            if (Array.isArray(cssValue)) {
              // Multiple shadows
              cssValue = cssValue.map(shadow => {
                if (typeof shadow === 'object' && shadow.x !== undefined) {
                  return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
                }
                return shadow;
              }).join(', ');
            } else if (cssValue.x !== undefined) {
              // Single shadow
              cssValue = `${cssValue.x}px ${cssValue.y}px ${cssValue.blur}px ${cssValue.spread}px ${cssValue.color}`;
            }
          }
        } else if (value.type === 'fontFamilies') {
          // Font families - wrap in quotes if needed
          if (typeof cssValue === 'string' && !cssValue.includes("'") && !cssValue.includes('"')) {
            cssValue = `'${cssValue}'`;
          }
        }
        
        // Add comment with original token name
        css += `  ${cssVarName}: ${cssValue}; /* ${tokenName} */\n`;
      } else if (value && typeof value === 'object' && !value.value) {
        // This is a nested object, recurse
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        processTokens(value, newPrefix, key);
      }
    });
  }

  // Process tokens by category with section headers
  let tokenCount = 0;
  function countTokens(obj) {
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value.value && value.type) {
        tokenCount++;
      } else if (value && typeof value === 'object' && !value.value) {
        countTokens(value);
      }
    });
  }
  
  // Process spacing tokens
  if (tokenStudioJson.spacing) {
    css += `\n  /* ===== SPACING SCALE ===== */\n`;
    processTokens(tokenStudioJson.spacing, 'spacing', 'spacing');
  }
  
  // Process color tokens
  if (tokenStudioJson.color) {
    css += `\n  /* ===== COLOR PALETTE ===== */\n`;
    
    // Primary colors
    if (tokenStudioJson.color.primary) {
      css += `  /* Primary Colors - These will be dynamically updated by the color service */\n`;
      processTokens(tokenStudioJson.color.primary, 'color.primary', 'primary');
    }
    
    // Text on primary (should be with primary colors)
    if (tokenStudioJson.color.text && tokenStudioJson.color.text['on-primary']) {
      css += `  /* Text color for text on primary background - Will be dynamically updated by the color service */\n`;
      css += `  --color-text-on-primary: ${tokenStudioJson.color.text['on-primary'].value}; /* color.text.on-primary */\n`;
    }
    
    // Secondary colors
    if (tokenStudioJson.color.secondary) {
      css += `  /* Secondary Colors (Gray Scale) */\n`;
      processTokens(tokenStudioJson.color.secondary, 'color.secondary', 'secondary');
    }
    
    // Semantic colors
    if (tokenStudioJson.color.success) {
      css += `  /* Success Colors */\n`;
      processTokens(tokenStudioJson.color.success, 'color.success', 'success');
    }
    
    if (tokenStudioJson.color.warning) {
      css += `  /* Warning Colors */\n`;
      processTokens(tokenStudioJson.color.warning, 'color.warning', 'warning');
    }
    
    if (tokenStudioJson.color.error) {
      css += `  /* Error Colors */\n`;
      processTokens(tokenStudioJson.color.error, 'color.error', 'error');
    }
    
    // Text colors (excluding on-primary which is handled above)
    if (tokenStudioJson.color.text) {
      css += `  /* Text Colors */\n`;
      // Process all text colors except on-primary
      Object.entries(tokenStudioJson.color.text).forEach(([key, value]) => {
        if (key !== 'on-primary' && value && typeof value === 'object' && value.value && value.type) {
          const cssVarName = `--color-text-${key}`;
          let cssValue = value.value;
          
          // Handle color references
          if (typeof cssValue === 'string' && cssValue.startsWith('{') && cssValue.endsWith('}')) {
            const refName = cssValue.slice(1, -1).replace(/\./g, '-');
            cssValue = `var(--${refName})`;
          }
          
          css += `  ${cssVarName}: ${cssValue}; /* color.text.${key} */\n`;
        }
      });
    }
    
    // Background colors
    if (tokenStudioJson.color.bg) {
      css += `  /* Background Colors */\n`;
      processTokens(tokenStudioJson.color.bg, 'color.bg', 'bg');
    }
    
    // Border colors
    if (tokenStudioJson.color.border) {
      css += `  /* Border Colors */\n`;
      processTokens(tokenStudioJson.color.border, 'color.border', 'border');
    }
  }
  
  // Process typography tokens
  if (tokenStudioJson.font) {
    css += `\n  /* ===== TYPOGRAPHY ===== */\n`;
    
    if (tokenStudioJson.font.family) {
      css += `  /* Font Families */\n`;
      processTokens(tokenStudioJson.font.family, 'font.family', 'family');
    }
    
    if (tokenStudioJson.font.size) {
      css += `  /* Font Sizes */\n`;
      processTokens(tokenStudioJson.font.size, 'font.size', 'size');
    }
    
    if (tokenStudioJson.font.weight) {
      css += `  /* Font Weights */\n`;
      processTokens(tokenStudioJson.font.weight, 'font.weight', 'weight');
    }
  }
  
  // Process line height tokens
  if (tokenStudioJson.line) {
    css += `\n  /* ===== LINE HEIGHTS ===== */\n`;
    processTokens(tokenStudioJson.line, 'line', 'line');
  }
  
  // Process border radius tokens
  if (tokenStudioJson.radius) {
    css += `\n  /* ===== BORDER RADIUS ===== */\n`;
    processTokens(tokenStudioJson.radius, 'radius', 'radius');
  }
  
  // Process shadow tokens
  if (tokenStudioJson.shadow) {
    css += `\n  /* ===== SHADOWS ===== */\n`;
    processTokens(tokenStudioJson.shadow, 'shadow', 'shadow');
  }
  
  countTokens(tokenStudioJson);

  // Add preserved custom tokens that aren't in Token Studio
  let preservedCount = 0;
  const preservedTokens = [];
  
  // Group preserved tokens by type
  const preservedByType = {
    transitions: [],
    zIndex: [],
    other: []
  };
  
  Object.entries(existingTokens).forEach(([tokenName, tokenData]) => {
    // Check if this token is not in Token Studio
    const tokenStudioName = tokenName.replace(/--/g, '').replace(/-/g, '.');
    const isInTokenStudio = isTokenInTokenStudio(tokenStudioJson, tokenStudioName);
    
    if (!isInTokenStudio) {
      // Skip color-text-on-primary since we handle it separately in primary colors section
      if (tokenName === '--color-text-on-primary') {
        return;
      }
      
      if (tokenName.includes('transition')) {
        preservedByType.transitions.push({ name: tokenName, data: tokenData });
      } else if (tokenName.includes('z-')) {
        preservedByType.zIndex.push({ name: tokenName, data: tokenData });
      } else {
        preservedByType.other.push({ name: tokenName, data: tokenData });
      }
      preservedTokens.push(tokenName);
      preservedCount++;
    }
  });
  
  // Add preserved tokens with organization
  if (preservedCount > 0) {
    css += `\n  /* ===== CUSTOM TOKENS (NOT IN FIGMA) ===== */\n`;
    
    if (preservedByType.transitions.length > 0) {
      css += `  /* Transitions */\n`;
      preservedByType.transitions.forEach(({ name, data }) => {
        css += `  ${name}: ${data.value}; /* ${data.comment || 'custom transition'} */\n`;
      });
    }
    
    if (preservedByType.zIndex.length > 0) {
      css += `  /* Z-Index Scale */\n`;
      preservedByType.zIndex.forEach(({ name, data }) => {
        css += `  ${name}: ${data.value}; /* ${data.comment || 'custom z-index'} */\n`;
      });
    }
    
    if (preservedByType.other.length > 0) {
      css += `  /* Other Custom Tokens */\n`;
      preservedByType.other.forEach(({ name, data }) => {
        css += `  ${name}: ${data.value}; /* ${data.comment || 'custom token'} */\n`;
      });
    }
  }

  css += `}`;
  return { css, tokenCount, preservedCount, preservedTokens };
}

function parseExistingTokens(cssContent) {
  const tokens = {};
  const themeMatch = cssContent.match(/@theme\s*{([\s\S]*?)}/);
  
  if (!themeMatch) return tokens;
  
  const themeContent = themeMatch[1];
  const lines = themeContent.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') && trimmed.includes(':')) {
      const [name, value] = trimmed.split(':').map(s => s.trim());
      const cleanName = name;
      
      // Remove comments and clean the value
      let cleanValue = value.replace(';', '').trim();
      const commentMatch = cleanValue.match(/\/\*([^*]*)\*\/$/);
      let comment = '';
      
      if (commentMatch) {
        comment = commentMatch[1].trim();
        cleanValue = cleanValue.replace(/\/\*[^*]*\*\/$/, '').trim();
      }
      
      tokens[cleanName] = {
        value: cleanValue,
        comment: comment
      };
    }
  }
  
  return tokens;
}

function isTokenInTokenStudio(tokenStudioJson, tokenName) {
  // Check if a token exists in Token Studio by converting the name format
  const parts = tokenName.split('.');
  
  let current = tokenStudioJson;
  for (const part of parts) {
    if (current && typeof current === 'object' && current[part]) {
      current = current[part];
    } else {
      return false;
    }
  }
  
  return current && typeof current === 'object' && current.value && current.type;
}

function createBackup() {
  const cssPath = path.join(__dirname, '../design-tokens.css');
  const backupPath = path.join(__dirname, '../design-tokens.backup.css');
  
  if (fs.existsSync(cssPath)) {
    fs.copyFileSync(cssPath, backupPath);
    return backupPath;
  }
  return null;
}

function showPreview(changes) {
  console.log('\n📋 PREVIEW OF CHANGES:');
  console.log('='.repeat(50));
  
  if (changes.added.length > 0) {
    console.log('\n🟢 NEW TOKENS FROM FIGMA:');
    changes.added.forEach(token => {
      console.log(`  + ${token.name}: ${token.value}`);
    });
  }
  
  if (changes.updated.length > 0) {
    console.log('\n🟡 UPDATED TOKENS:');
    changes.updated.forEach(token => {
      console.log(`  ~ ${token.name}: ${token.oldValue} → ${token.newValue}`);
    });
  }
  
  if (changes.preserved.length > 0) {
    console.log('\n💾 PRESERVED CUSTOM TOKENS:');
    changes.preserved.forEach(token => {
      console.log(`  ✓ ${token.name}: ${token.value} (${token.comment})`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
}

function main() {
  try {
    // Check if token studio file exists
    const tokenStudioPath = path.join(__dirname, 'tokens-tokenstudio.json');
    
    if (!fs.existsSync(tokenStudioPath)) {
      console.log('❌ Token Studio file not found at:', tokenStudioPath);
      console.log('\n📋 To use this script:');
      console.log('1. Export your tokens from Token Studio as JSON');
      console.log('2. Save the file as "src/styles/token-sync/tokens-tokenstudio.json"');
      console.log('3. Run this script again');
      return;
    }

    // Create backup
    console.log('🔒 Creating backup...');
    const backupPath = createBackup();
    if (backupPath) {
      console.log(`✅ Backup created: ${backupPath}`);
    }

    // Read Token Studio JSON
    const tokenStudioJson = JSON.parse(fs.readFileSync(tokenStudioPath, 'utf8'));
    console.log('📊 Found token categories:', Object.keys(tokenStudioJson));
    
    // Convert to CSS
    const { css, tokenCount, preservedCount, preservedTokens } = convertTokenStudioToCSS(tokenStudioJson);
    
    // Analyze changes
    const existingCssPath = path.join(__dirname, '../design-tokens.css');
    let existingTokens = {};
    
    if (fs.existsSync(existingCssPath)) {
      const existingCss = fs.readFileSync(existingCssPath, 'utf8');
      existingTokens = parseExistingTokens(existingCss);
    }
    
    const changes = {
      added: [],
      updated: [],
      preserved: []
    };
    
    // Analyze what changed
    Object.entries(tokenStudioJson).forEach(([category, categoryTokens]) => {
      Object.entries(categoryTokens).forEach(([name, token]) => {
        if (typeof token === 'object' && token.value && token.type) {
          const tokenName = `${category}.${name}`;
          const cssVarName = `--${tokenName.replace(/\./g, '-')}`;
          
          if (existingTokens[cssVarName]) {
            if (existingTokens[cssVarName].value !== token.value) {
              changes.updated.push({
                name: cssVarName,
                oldValue: existingTokens[cssVarName].value,
                newValue: token.value
              });
            }
          } else {
            changes.added.push({
              name: cssVarName,
              value: token.value
            });
          }
        }
      });
    });
    
    // Add preserved tokens to changes
    preservedTokens.forEach(tokenName => {
      changes.preserved.push({
        name: tokenName,
        value: existingTokens[tokenName].value,
        comment: existingTokens[tokenName].comment || 'custom token'
      });
    });
    
    // Show preview
    showPreview(changes);
    
    console.log(`📊 SUMMARY:`);
    console.log(`  • ${tokenCount} tokens from Token Studio`);
    console.log(`  • ${changes.added.length} new tokens`);
    console.log(`  • ${changes.updated.length} updated tokens`);
    console.log(`  • ${preservedCount} custom tokens preserved`);
    
    // Ask for confirmation
    console.log('\n🤔 Do you want to apply these changes? (y/N)');
    
    // For now, we'll just show the preview
    // In a real implementation, you'd use readline or a similar library
    console.log('\n💡 To apply changes, run: npm run sync-tokens-apply');
    console.log('💡 To restore backup, run: npm run sync-tokens-restore');
    
    // Write preview to a file
    const previewPath = path.join(__dirname, '../design-tokens.preview.css');
    fs.writeFileSync(previewPath, css, 'utf8');
    console.log(`\n📄 Preview saved to: ${previewPath}`);
    
  } catch (error) {
    console.error('❌ Error during safe sync:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  convertTokenStudioToCSS,
  createBackup,
  showPreview
}; 