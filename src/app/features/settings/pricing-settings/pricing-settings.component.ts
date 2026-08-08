import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-pricing-settings',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Pricing Policy Settings" subtitle="Dynamic pricing defaults & toggle settings"></app-page-header>
    <div class="card"><p>Pricing Settings Component ready.</p></div>
  `
})
export class PricingSettingsComponent {}
