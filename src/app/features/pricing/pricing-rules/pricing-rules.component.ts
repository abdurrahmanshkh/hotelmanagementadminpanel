import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-pricing-rules',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Dynamic Pricing Engine" subtitle="Configure demand-based room rate rules"></app-page-header>
    <div class="card"><p>Pricing Rules Component ready.</p></div>
  `
})
export class PricingRulesComponent {}
