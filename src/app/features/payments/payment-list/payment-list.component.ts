import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Payments & Refunds Ledger" subtitle="Audit transaction history & process refunds"></app-page-header>
    <div class="card"><p>Payment List Component ready.</p></div>
  `
})
export class PaymentListComponent {}
