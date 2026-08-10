import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BookingRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatter } from '../../../core/utilities/currency-formatter.utility';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { BookingDetails } from '../../../core/models';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    ButtonComponent,
    SkeletonLoaderComponent
  ],
  template: `
    <div class="booking-detail-page">
      <app-page-header
        [title]="booking ? 'Booking Details - ' + booking.bookingReference : 'Loading Reservation...'"
        subtitle="Complete guest stay record, billing details & activity logs"
      >
        <div actions class="header-actions" *ngIf="booking">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Back to List</app-button>
          <app-button variant="primary" size="sm" (btnClick)="exportReceipt()">📄 Download Receipt</app-button>
        </div>
      </app-page-header>

      <app-skeleton-loader *ngIf="loading" height="400px"></app-skeleton-loader>

      <div *ngIf="booking && !loading" class="detail-grid">
        <!-- Main Stay Info -->
        <div class="card detail-card">
          <div class="card-header flex-between">
            <h3 class="card-title">Reservation Summary</h3>
            <app-status-badge [status]="booking.status"></app-status-badge>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">Guest Name:</span>
              <strong class="value">{{ booking.guestName }}</strong>
            </div>
            <div class="info-item">
              <span class="label">Guest Email:</span>
              <span class="value">{{ booking.guestEmail }}</span>
            </div>
            <div class="info-item">
              <span class="label">Check-In Date:</span>
              <strong class="value">{{ formatDate(booking.checkInDate) }}</strong>
            </div>
            <div class="info-item">
              <span class="label">Check-Out Date:</span>
              <strong class="value">{{ formatDate(booking.checkOutDate) }}</strong>
            </div>
            <div class="info-item">
              <span class="label">Assigned Room:</span>
              <strong class="value">Room {{ booking.roomNumber }} ({{ booking.roomTypeName }})</strong>
            </div>
            <div class="info-item">
              <span class="label">Door Passcode:</span>
              <span class="passcode-box">{{ booking.passcode || 'Not Generated' }}</span>
            </div>
          </div>
        </div>

        <!-- Billing & Payment breakdown -->
        <div class="card detail-card">
          <div class="card-header flex-between">
            <h3 class="card-title">Payment & Financial Ledger</h3>
            <span class="badge" [class.badge--success]="booking.paymentStatus === 'SUCCESS'">{{ booking.paymentStatus }}</span>
          </div>

          <div class="billing-summary">
            <div class="billing-row">
              <span>Guests Occupancy:</span>
              <span>{{ booking.guestCount }} Guests</span>
            </div>
            <div class="billing-row">
              <span>Payment Method:</span>
              <span>{{ booking.paymentMethod || 'RAZORPAY_CARD' }}</span>
            </div>
            <div class="billing-row total">
              <strong>Grand Total Amount:</strong>
              <strong class="total-amount">{{ formatCurrency(booking.totalAmount) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-detail-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; @media (max-width: 1023px) { grid-template-columns: 1fr; } }
    .detail-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .card-header { padding-bottom: 0.75rem; border-bottom: 1px solid #E5E7EB; }
    .card-title { font-size: 1.125rem; font-weight: 700; color: #11243E; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .label { font-size: 0.75rem; color: #6B7280; text-transform: uppercase; font-weight: 600; }
    .value { font-size: 0.9375rem; color: #11243E; }
    .passcode-box { font-family: monospace; font-weight: 700; background: #FEF3D6; padding: 0.25rem 0.5rem; border-radius: 4px; color: #B76E00; display: inline-block; }
    .billing-summary { display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem; }
    .billing-row { display: flex; justify-content: space-between; color: #4B5563; }
    .billing-row.total { padding-top: 0.75rem; border-top: 1px solid #E5E7EB; font-size: 1rem; color: #11243E; }
    .total-amount { color: #16803C; }
  `]
})
export class BookingDetailComponent implements OnInit {
  private bookingRepo = inject(BookingRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public booking: BookingDetails | null = null;
  public loading = true;

  ngOnInit(): void {
    const bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    if (bookingId) {
      this.bookingRepo.getBookingById(bookingId).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success && res.data) {
            this.booking = res.data;
          }
        },
        error: (err: Error) => {
          this.loading = false;
          this.toastService.error(err.message || 'Failed to load reservation record');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/bookings']);
  }

  exportReceipt(): void {
    this.toastService.info('Downloading guest stay receipt PDF/CSV...', 'Export Started');
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }

  formatCurrency(amt: number): string {
    return CurrencyFormatter.format(amt);
  }
}
