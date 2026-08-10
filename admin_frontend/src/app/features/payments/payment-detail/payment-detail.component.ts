import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PaymentRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatter } from '../../../core/utilities/currency-formatter.utility';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { RefundDialogComponent } from '../refund-dialog/refund-dialog.component';
import { PaymentDetails, RefundRecord } from '../../../core/models';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    ButtonComponent,
    SkeletonLoaderComponent,
    RefundDialogComponent
  ],
  template: `
    <div class="payment-detail-page">
      <app-page-header
        [title]="payment ? 'Transaction - ' + payment.paymentReference : 'Loading Payment...'"
        subtitle="Financial ledger breakdown, gateway response & refund history"
      >
        <div actions class="header-actions" *ngIf="payment">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Back to Ledger</app-button>
          <app-button
            *ngIf="canRefund"
            variant="accent"
            size="sm"
            (btnClick)="showRefundModal = true"
          >
            💸 Process Refund
          </app-button>
        </div>
      </app-page-header>

      <app-skeleton-loader *ngIf="loading" height="350px"></app-skeleton-loader>

      <div *ngIf="payment && !loading" class="detail-grid card">
        <div class="card-header flex-between">
          <div>
            <h2 class="ref-title">{{ payment.paymentReference }}</h2>
            <span class="booking-tag">Booking: {{ payment.bookingReference }}</span>
          </div>
          <app-status-badge [status]="payment.status"></app-status-badge>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Guest Name:</span>
            <strong>{{ payment.guestName }}</strong>
          </div>
          <div class="info-item">
            <span class="label">Payment Amount:</span>
            <strong class="amount-text">{{ formatCurrency(payment.amount) }}</strong>
          </div>
          <div class="info-item">
            <span class="label">Payment Method:</span>
            <span>{{ payment.paymentMethod }}</span>
          </div>
          <div class="info-item">
            <span class="label">Gateway Ref:</span>
            <code>{{ payment.gatewayTransactionId || 'N/A' }}</code>
          </div>
          <div class="info-item">
            <span class="label">Transaction Date:</span>
            <span>{{ formatDate(payment.paidAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Total Refunded:</span>
            <strong class="refund-text">{{ formatCurrency(payment.refundedAmount || 0) }}</strong>
          </div>
        </div>

        <!-- Refund History -->
        <div class="refund-history-section" *ngIf="refunds.length > 0">
          <h3>Refund Audit History ({{ refunds.length }})</h3>
          <div class="refund-table">
            <div *ngFor="let ref of refunds" class="refund-row flex-between">
              <div>
                <strong>Ref: {{ ref.refundReference }}</strong>
                <p class="reason">{{ ref.reason }}</p>
              </div>
              <div class="right-align">
                <span class="refund-amount">-{{ formatCurrency(ref.amount) }}</span>
                <span class="refund-date">{{ formatDate(ref.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Refund Modal -->
      <app-refund-dialog
        [isOpen]="showRefundModal"
        [payment]="payment"
        (refundProcessed)="onRefundSuccess()"
        (closeDialog)="showRefundModal = false"
      ></app-refund-dialog>
    </div>
  `,
  styles: [`
    .payment-detail-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .detail-grid { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; max-width: 750px; }
    .card-header { padding-bottom: 1rem; border-bottom: 1px solid #E5E7EB; }
    .ref-title { font-size: 1.25rem; font-weight: 700; color: #11243E; }
    .booking-tag { font-size: 0.8125rem; color: #C99B4A; font-weight: 600; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
    .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .label { font-size: 0.75rem; color: #6B7280; text-transform: uppercase; font-weight: 600; }
    .amount-text { font-size: 1.125rem; color: #11243E; }
    .refund-text { color: #C62828; }
    .refund-history-section { padding-top: 1rem; border-top: 1px solid #E5E7EB; h3 { font-size: 1rem; font-weight: 700; color: #11243E; margin-bottom: 0.75rem; } }
    .refund-table { display: flex; flex-direction: column; gap: 0.5rem; }
    .refund-row { background: #F9FAFB; padding: 0.75rem; border-radius: 6px; border: 1px solid #E5E7EB; font-size: 0.875rem; .reason { font-size: 0.8125rem; color: #6B7280; margin-top: 0.125rem; } }
    .right-align { display: flex; flex-direction: column; align-items: flex-end; }
    .refund-amount { font-weight: 700; color: #C62828; }
    .refund-date { font-size: 0.75rem; color: #9CA3AF; }
  `]
})
export class PaymentDetailComponent implements OnInit {
  private paymentRepo = inject(PaymentRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public payment: PaymentDetails | null = null;
  public refunds: RefundRecord[] = [];
  public loading = true;
  public showRefundModal = false;

  get canRefund(): boolean {
    if (!this.payment) return false;
    const refunded = this.payment.refundedAmount || 0;
    return this.payment.status !== 'REFUNDED' && refunded < this.payment.amount;
  }

  ngOnInit(): void {
    const paymentId = Number(this.route.snapshot.paramMap.get('paymentId'));
    if (paymentId) {
      this.loadPaymentDetails(paymentId);
    }
  }

  loadPaymentDetails(id: number): void {
    this.paymentRepo.getPaymentById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.payment = res.data;
          this.loadRefundHistory(id);
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load payment details');
      }
    });
  }

  loadRefundHistory(paymentId: number): void {
    this.paymentRepo.getRefundsByPayment(paymentId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.refunds = res.data;
        }
      }
    });
  }

  onRefundSuccess(): void {
    if (this.payment) {
      this.loadPaymentDetails(this.payment.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/payments']);
  }

  formatCurrency(amt: number): string {
    return CurrencyFormatter.format(amt);
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }
}
