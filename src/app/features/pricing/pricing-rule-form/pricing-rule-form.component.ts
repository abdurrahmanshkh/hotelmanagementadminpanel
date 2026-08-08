import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-pricing-rule-form',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Pricing Rule Editor" subtitle="Create or edit occupancy pricing rule"></app-page-header>
    <div class="card"><p>Pricing Rule Form Component ready.</p></div>
  `
})
export class PricingRuleFormComponent {}
