# Token Sync System

This directory contains all the tools and files needed to sync design tokens between Figma (using Token Studio) and your CSS code.

## 📁 Files Overview

- **`tokens-tokenstudio.json`** - Your Token Studio export from Figma
- **`safe-token-sync.js`** - Main sync script that creates previews and backups
- **`apply-token-sync.js`** - Applies the previewed changes to your CSS file
- **`restore-token-backup.js`** - Restores from backup if something goes wrong

## 🔄 Workflow: Figma → Code

### Step 1: Export from Token Studio
1. Open your Figma file with Token Studio plugin
2. Go to **Token Studio** → **Export** → **JSON**
3. Save the file as `src/styles/token-sync/tokens-tokenstudio.json`

### Step 2: Preview Changes (Safe)
```bash
npm run sync-tokens-preview
```

This will:
- ✅ Create a backup of your current `design-tokens.css`
- ✅ Show you exactly what will change (new, updated, preserved tokens)
- ✅ Save a preview to `design-tokens.preview.css`
- ✅ Preserve your custom tokens (z-index, transitions, etc.)

### Step 3: Review the Preview
- Check the console output to see what will change
- Open `src/styles/design-tokens.preview.css` to review the full file
- Make sure your custom tokens are preserved

### Step 4: Apply Changes (Only if you're happy)
```bash
npm run sync-tokens-apply
```

### Step 5: Undo if Needed
```bash
npm run sync-tokens-restore
```

## 📊 What the Sync Does

### ✅ **Converts Token Studio Format to CSS**
- Transforms Token Studio JSON into CSS custom properties
- Handles color references like `{color.secondary.900}` → `var(--color-secondary-900)`
- Processes complex shadow objects into CSS shadow syntax
- Wraps font families in quotes when needed

### ✅ **Organizes Your CSS with Clear Sections**
```css
/* ===== SPACING SCALE ===== */
/* ===== COLOR PALETTE ===== */
  /* Primary Colors - These will be dynamically updated by the color service */
  /* Text color for text on primary background - Will be dynamically updated by the color service */
  /* Secondary Colors (Gray Scale) */
  /* Success Colors */
  /* Warning Colors */
  /* Error Colors */
  /* Text Colors */
  /* Background Colors */
  /* Border Colors */
/* ===== TYPOGRAPHY ===== */
/* ===== LINE HEIGHTS ===== */
/* ===== BORDER RADIUS ===== */
/* ===== SHADOWS ===== */
/* ===== CUSTOM TOKENS (NOT IN FIGMA) ===== */
```

### ✅ **Preserves Custom Tokens**
Tokens that exist in your CSS but not in Figma are preserved in organized sections:
- **Transitions** - Animation and transition tokens
- **Z-Index Scale** - Layering tokens
- **Other Custom Tokens** - Any other custom tokens

## 🛡️ Safety Features

### Automatic Backups
Every sync creates a backup file (`design-tokens.backup.css`) before making changes.

### Preview Before Apply
You always see exactly what will change before applying:
- 🟢 **NEW TOKENS** - Tokens added from Figma
- 🟡 **UPDATED TOKENS** - Existing tokens with changed values
- 💾 **PRESERVED TOKENS** - Custom tokens not in Figma

### Easy Undo
One command restores your previous state if something goes wrong.

## 📋 Example Console Output

```
🔒 Creating backup...
✅ Backup created: /path/to/design-tokens.backup.css
📊 Found token categories: [ 'spacing', 'color', 'font', 'line', 'radius', 'shadow' ]

📋 PREVIEW OF CHANGES:
==================================================

🟢 NEW TOKENS FROM FIGMA:
  + --color-accent-base: #ff6b35

🟡 UPDATED TOKENS:
  ~ --color-primary-base: #f75f55 → #e74c3c

💾 PRESERVED CUSTOM TOKENS:
  ✓ --z-modal: 1050 (custom z-index)
  ✓ --transition-fast: 150ms ease-in-out (custom transition)

==================================================
📊 SUMMARY:
  • 71 tokens from Token Studio
  • 1 new tokens
  • 1 updated tokens
  • 2 custom tokens preserved
```

## 🚨 Troubleshooting

### "Token Studio file not found"
Make sure you've exported your tokens from Token Studio and saved them as:
`src/styles/token-sync/tokens-tokenstudio.json`

### "No preview file found"
Run `npm run sync-tokens-preview` first before trying to apply changes.

### "No backup file found"
This means no backup was created. The restore command only works if you've run a sync that created a backup.

### Editor Save Conflicts
If you see save conflicts in your editor:
1. **Close** `design-tokens.css` before running sync commands
2. **Or** accept the changes when the conflict dialog appears

## 🔧 Advanced Usage

### Manual Token Editing
After syncing, you can manually edit `design-tokens.css` to:
- Add custom tokens that don't exist in Figma
- Override specific values for development/testing
- Add additional CSS comments or organization

Your manual changes will be preserved in the "Custom Tokens" section on the next sync.

### Token Studio Best Practices
- Use consistent naming conventions in Figma
- Group related tokens (primary colors together, etc.)
- Use token references (`{color.primary.base}`) instead of hard-coded values
- Test your token changes in Figma before exporting

## 📝 File Formats

### Token Studio JSON Structure
```json
{
  "spacing": {
    "xs": { "value": "0.25rem", "type": "spacing" }
  },
  "color": {
    "primary": {
      "base": { "value": "#f75f55", "type": "color" }
    }
  }
}
```

### Generated CSS Structure
```css
@theme {
  --spacing-xs: 0.25rem; /* spacing.xs */
  --color-primary-base: #f75f55; /* color.primary.base */
}
```

## 🎯 Tips for Success

1. **Always preview first** - Never skip the preview step
2. **Keep Token Studio organized** - Good organization in Figma = good organization in CSS
3. **Use descriptive names** - Token names become CSS variable names
4. **Test in small batches** - Don't change everything at once
5. **Keep backups** - The system creates them automatically, but you can manually copy files too

---

**Need help?** Check the console output for detailed error messages and suggestions. 