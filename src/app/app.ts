import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSystemDemoComponent } from './components/design-system-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DesignSystemDemoComponent],
  template: `
    <app-design-system-demo></app-design-system-demo>
  `,
  styles: []
})
export class AppComponent {
  title = 'ds-exploration';
}
