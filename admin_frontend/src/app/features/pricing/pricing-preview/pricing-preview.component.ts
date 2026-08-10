import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-pricing-preview',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Pricing Rate Preview" subtitle="Simulate dynamic pricing calculations"></app-page-header>
    <div class="card"><p>Pricing Preview Component ready.</p></div>
  `
})
export class PricingPreviewComponent {}
