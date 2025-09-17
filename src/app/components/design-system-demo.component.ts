import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { ColorService, ColorVariations } from '../services/color.service';
import { SimpleColorService as ColorService, ColorVariations } from '../services/simple-color.service';
import { HlmButtonDirective } from '../../../libs/ui/ui-button-helm/src/lib/hlm-button.directive';

@Component({
  selector: 'app-design-system-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmButtonDirective],
  template: `
    <div class="min-h-screen bg-bg-secondary flex items-center justify-end p-lg">
      <div class="max-w-6xl w-full mr-0 ml-auto px-md">
        
        <!-- Color Picker and Variants Section -->
        <div class="bg-bg-primary rounded-xl shadow-md p-lg mb-xl">
          <h2 class="text-2xl font-semibold text-text-primary mb-md">
            Color Customization
          </h2>
          
          <div class="flex items-start gap-2xl">
            <!-- Color Picker Controls -->
            <div class="flex flex-col gap-md">
              <!-- Color Picker -->
              <div class="flex flex-col gap-md">
                <h5 class="text-text-primary font-medium">Select a color:</h5>
                <input 
                  type="color" 
                  [value]="currentColors.primary"
                  (input)="onColorChange($event)"
                  class="w-20 h-16 rounded-lg border-2 border-border-primary cursor-pointer"
                >
              </div>
              
              <!-- Custom Color Input -->
              <div class="flex flex-col gap-sm">
                <label class="text-text-primary font-medium">Custom Hex:</label>
                <input 
                  type="text" 
                  [value]="currentColors.primary"
                  (input)="onCustomColorChange($event)"
                  placeholder="#3b82f6"
                  class="px-md py-sm border border-border-primary rounded-lg focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-primary-base/20"
                >
              </div>
            </div>
            
            <!-- Color Variants -->
            <div class="flex-1">
              <div class="grid grid-cols-3 mt-2xl">
                <!-- Primary -->
                <div class="text-center">
                  <div 
                    class="w-20 h-16 rounded-lg mb-sm mx-auto"
                    [style.background-color]="currentColors.primary"
                  ></div>
                  <p class="text-text-primary font-medium mb-xs">Primary</p>
                  <p class="text-text-secondary text-sm">{{ currentColors.primary }}</p>
                  <p class="text-text-secondary text-xs">Luminance: {{ luminanceValues.primary.toFixed(3) }}</p>
                </div>
                
                <!-- Light -->
                <div class="text-center">
                  <div 
                    class="w-20 h-16 rounded-lg mb-sm mx-auto"
                    [style.background-color]="currentColors.light"
                  ></div>
                  <p class="text-text-primary font-medium mb-xs">Light</p>
                  <p class="text-text-secondary text-sm">{{ currentColors.light }}</p>
                  <p class="text-text-secondary text-xs">Luminance: {{ luminanceValues.light.toFixed(3) }}</p>
                </div>
                
                <!-- Dark -->
                <div class="text-center">
                  <div 
                    class="w-20 h-16 rounded-lg mb-sm mx-auto"
                    [style.background-color]="currentColors.dark"
                  ></div>
                  <p class="text-text-primary font-medium mb-xs">Dark</p>
                  <p class="text-text-secondary text-sm">{{ currentColors.dark }}</p>
                  <p class="text-text-secondary text-xs">Luminance: {{ luminanceValues.dark.toFixed(3) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Button Examples -->
        <div class="bg-bg-primary rounded-xl shadow-md p-lg">
          <h2 class="text-2xl font-semibold text-text-primary mb-md">
            Button Component
          </h2>
          
          <div class="space-y-xl">

            <!-- Spartan UI Buttons -->
            <div>
              <h5 class=" font-medium text-text-primary mb-sm">Buttons Types</h5>
              <div class="flex gap-md flex-wrap">
                <button hlmBtn variant="default">Default Button</button>
                <button hlmBtn variant="outline">Outline Button</button>
                <button hlmBtn variant="secondary">Secondary Button</button>
                <button hlmBtn variant="ghost">Ghost Button</button>
                <button hlmBtn variant="link">Link Button</button>
                <button hlmBtn variant="destructive">Destructive Button</button>
              </div>
            </div>



            <!-- Button Sizes -->
            <div>
              <h5 class=" font-medium text-text-primary mb-sm">Button Sizes</h5>
              <div class="flex gap-md items-center">
                <button hlmBtn size="sm">Small</button>
                <button hlmBtn size="default">Default</button>
                <button hlmBtn size="lg">Large</button>
                <button hlmBtn size="icon">🔍</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DesignSystemDemoComponent implements OnInit {
  currentColors: ColorVariations = {
    primary: '',
    light: '',
    dark: ''
  };

  luminanceValues = {
    primary: 0,
    light: 0,
    dark: 0
  };

  constructor(public colorService: ColorService) {}

  ngOnInit(): void {
    this.currentColors = this.colorService.getCurrentColors();
    this.updateLuminanceValues();
  }

  onColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.colorService.setPrimaryColor(target.value);
    this.currentColors = this.colorService.getCurrentColors();
    this.updateLuminanceValues();
  }

  onCustomColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const color = target.value;
    
    this.colorService.setPrimaryColor(color);
    this.currentColors = this.colorService.getCurrentColors();
    this.updateLuminanceValues();
  }

  private updateLuminanceValues(): void {
    this.luminanceValues = this.colorService.getLuminanceValues(this.currentColors);
  }

  onHover(event: Event): void {
    const button = event.target as HTMLButtonElement;
    const currentBg = button.style.backgroundColor;
    const currentColor = button.style.color;
    
    if (currentBg && currentBg !== 'transparent') {
      // This is the primary button
      button.style.backgroundColor = this.currentColors.dark;
    } else {
      // This is the secondary button
      button.style.backgroundColor = this.currentColors.primary;
      button.style.color = 'white';
    }
  }

  onLeave(event: Event): void {
    const button = event.target as HTMLButtonElement;
    const originalBg = button.style.backgroundColor;
    
    if (originalBg === this.currentColors.dark) {
      // Restore primary button
      button.style.backgroundColor = this.currentColors.primary;
    } else {
      // Restore secondary button
      button.style.backgroundColor = 'transparent';
      button.style.color = this.currentColors.primary;
    }
  }
} 