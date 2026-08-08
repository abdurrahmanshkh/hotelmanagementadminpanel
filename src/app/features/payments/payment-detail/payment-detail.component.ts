import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Payment Transaction Details" subtitle="View gateway breakdown & refund history"></app-page-header>
    <div class="card"><p>Payment Detail Component ready.</p></div>
  `
})
export class PaymentDetailComponent {}
