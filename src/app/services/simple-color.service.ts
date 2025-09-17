import { Injectable } from '@angular/core';

export interface ColorVariations {
  primary: string;
  light: string;
  dark: string;
}

@Injectable({
  providedIn: 'root'
})
export class SimpleColorService {

  constructor() { }

  /**
   * Parse hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 0, g: 0, b: 0 };
    
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  /**
   * Convert RGB to hex
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * Calculate luminance
   */
  private calculateLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Generate light and dark variations 
   */
  generateColorVariations(primaryColor: string): ColorVariations {
    const rgb = this.hexToRgb(primaryColor);
    const luminance = this.calculateLuminance(rgb.r, rgb.g, rgb.b);
    
    // Simple light variant: move towards white
      // Make it darker for very light primary colors
    const lightFactor = luminance > 0.5 ? 0.65 : luminance > 0.4 ? 0.75 : 0.85;
    const lightRgb = {
      r: Math.round(rgb.r + (255 - rgb.r) * lightFactor),
      g: Math.round(rgb.g + (255 - rgb.g) * lightFactor),
      b: Math.round(rgb.b + (255 - rgb.b) * lightFactor)
    };
    
    
    // Simple dark variant: move towards black
     // Make it darker for very light primary colors
    const darkFactor = luminance > 0.5 ? 0.6 : luminance > 0.4 ? 0.7 : 0.9;
    const darkRgb = {
      r: Math.round(rgb.r * darkFactor),
      g: Math.round(rgb.g * darkFactor),
      b: Math.round(rgb.b * darkFactor)
    };
    
    return {
      primary: primaryColor,
      light: this.rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b),
      dark: this.rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b)
    };
  }

  //Update CSS custom properties

  updatePrimaryColors(variations: ColorVariations): void {
    const root = document.documentElement;
    root.style.setProperty('--color-primary-base', variations.primary);
    root.style.setProperty('--color-primary-light', variations.light);
    root.style.setProperty('--color-primary-dark', variations.dark);
    
    // Set text color for text on primary background
    const primaryTextColor = this.getTextColor(variations.primary);
    root.style.setProperty('--color-text-on-primary', primaryTextColor);
  }

  // Set a new primary color
  setPrimaryColor(color: string): void {
    const variations = this.generateColorVariations(color);
    this.updatePrimaryColors(variations);
  }


  // Get current colors
  getCurrentColors(): ColorVariations {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    return {
      primary: computedStyle.getPropertyValue('--color-primary-base').trim(),
      light: computedStyle.getPropertyValue('--color-primary-light').trim(),
      dark: computedStyle.getPropertyValue('--color-primary-dark').trim()
    };
  }

  /**
   * Validate color
   */
  isValidColor(color: string): boolean {
    if (!color || typeof color !== 'string') return false;
    
    // Hex colors (#fff, #ffffff)
    const hexPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    if (hexPattern.test(color)) return true;
    
    // Named colors (you could expand this list)
    const namedColors = ['red', 'green', 'blue', 'white', 'black', 'transparent'];
    if (namedColors.includes(color.toLowerCase())) return true;
    
    // RGB/RGBA
    const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[0-1]?\.?\d*)?\s*\)$/;
    if (rgbPattern.test(color)) return true;
    
    return false;
  }

  /**
   * Get luminance values for debugging
   */
  getLuminanceValues(variations: ColorVariations): { primary: number; light: number; dark: number } {
    const primaryRgb = this.hexToRgb(variations.primary);
    const lightRgb = this.hexToRgb(variations.light);
    const darkRgb = this.hexToRgb(variations.dark);
    
    return {
      primary: this.calculateLuminance(primaryRgb.r, primaryRgb.g, primaryRgb.b),
      light: this.calculateLuminance(lightRgb.r, lightRgb.g, lightRgb.b),
      dark: this.calculateLuminance(darkRgb.r, darkRgb.g, darkRgb.b)
    };
  }

  /**
   * Get the best text color (black or white) for a given background color
   * Ensures WCAG AA compliance (4.5:1 contrast ratio)
   */
  getTextColor(backgroundColor: string): string {
    const rgb = this.hexToRgb(backgroundColor);
    const bgLuminance = this.calculateLuminance(rgb.r, rgb.g, rgb.b);
    
    // Calculate contrast ratios for both black and white text
    const blackTextLuminance = 0;
    const whiteTextLuminance = 1;
    
    const blackContrast = this.calculateContrastRatio(bgLuminance, blackTextLuminance);
    const whiteContrast = this.calculateContrastRatio(bgLuminance, whiteTextLuminance);
    
    // Prefer white text for colored backgrounds while ensuring good readability
    const AA_THRESHOLD = 4.5;
    const CONTRAST_PREFERENCE_WHEN_COMPLIANT = 3.0;  // How much better black must be to override compliant white
    const CONTRAST_PREFERENCE_WHEN_NEITHER = 1.5;    // How much better black must be when neither is compliant
    
    // If white text meets AA standard, prefer it over black
    if (whiteContrast >= AA_THRESHOLD) {
      return blackContrast > whiteContrast * CONTRAST_PREFERENCE_WHEN_COMPLIANT ? '#000000' : '#ffffff';
    }
    // If only black text meets AA standard, use it
    else if (blackContrast >= AA_THRESHOLD) {
      return '#000000';
    }
    // Neither meets AA - choose better option with slight preference for white
    else {
      return blackContrast > whiteContrast * CONTRAST_PREFERENCE_WHEN_NEITHER ? '#000000' : '#ffffff';
    }
  }

  /**
   * Calculate contrast ratio between two luminances
   */
  private calculateContrastRatio(luminance1: number, luminance2: number): number {
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (lighter + 0.05) / (darker + 0.05);
  }
} 