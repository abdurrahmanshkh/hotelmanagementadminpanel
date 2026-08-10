import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookingRepository } from '../../../core/repositories/contracts/booking.repository';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PriceSummaryComponent } from '../../../shared/components/price-summary/price-summary.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Booking } from '../../../core/models';
import { formatCurrency } from '../../../core/utilities/money.utils';
import { formatDateDisplay } from '../../../core/utilities/date.utils';

@Component({
  selector: 'app-booking-details-customer',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, ButtonComponent, IconComponent],
  template: `
    <div class="details-page" *ngIf="booking">
      <div class="header-box flex-gap">
        <div>
          <span class="ref-code font-mono">{{ booking.bookingReference }}</span>
          <h2 class="title font-serif">{{ booking.room.roomTypeName }} &bull; Room {{ booking.room.roomNumber }}</h2>
        </div>
        <app-status-badge [status]="booking.status" class="ml-auto"></app-status-badge>
      </div>

      <!-- Keycode Quick Action Banner -->
      <div class="key-banner" *ngIf="booking.status === 'CHECKED_IN' || booking.status === 'CONFIRMED'">
        <app-icon name="key" [size]="24" color="#D97706"></app-icon>
        <div>
          <h4>Digital Door Keycode Available</h4>
          <p>Tap below to view your encrypted 6-digit door passcode.</p>
        </div>
        <a [routerLink]="['/account/bookings', booking.id, 'passcode']" class="ml-auto">
          <app-button variant="primary" icon="key">Open Keycode</app-button>
        </a>
      </div>

      <div class="details-grid">
        <div class="main-info card-box">
          <h3>Reservation Information</h3>

          <div class="info-table">
            <div class="info-row"><span>Guest Name:</span> <strong>{{ booking.guestName || 'Guest' }}</strong></div>
            <div class="info-row"><span>Check-In:</span> <strong>{{ formatDate(booking.checkInDate) }} (3:00 PM)</strong></div>
            <div class="info-row"><span>Check-Out:</span> <strong>{{ formatDate(booking.checkOutDate) }} (11:00 AM)</strong></div>
            <div class="info-row"><span>Guests:</span> <strong>{{ booking.guestCount }} Guests &bull; {{ booking.numberOfNights }} Nights</strong></div>
            <div class="info-row" *ngIf="booking.specialRequests"><span>Special Requests:</span> <strong>{{ booking.specialRequests }}</strong></div>
          </div>

          <div class="cancel-action" *ngIf="booking.status === 'CONFIRMED' || booking.status === 'PENDING_PAYMENT'">
            <app-button variant="danger" icon="x" (btnClick)="onCancelBooking()">
              Cancel Reservation
            </app-button>
          </div>
        </div>

        <div class="side-info">
          <div class="card-box">
            <h3>Payment Summary</h3>
            <div class="price-val font-mono">{{ formatMoney(booking.totalAmount) }}</div>
            <span class="tax-tag">Includes GST &amp; Resort Fees</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .details-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-box { .ref-code { font-size: 0.8125rem; font-weight: 700; color: #D97706; } .title { font-size: 1.5rem; font-weight: 800; color: #0F172A; } .ml-auto { margin-left: auto; } }

    .key-banner {
      background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 16px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1rem;
      h4 { font-size: 1rem; font-weight: 700; color: #B45309; } p { font-size: 0.8125rem; color: #78350F; } .ml-auto { margin-left: auto; }
      @media (max-width: 640px) { flex-direction: column; align-items: flex-start; .ml-auto { margin-left: 0; } }
    }

    .details-grid { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; @media (max-width: 868px) { grid-template-columns: 1fr; } }
    .card-box { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.5rem; h3 { font-size: 1.125rem; font-weight: 700; color: #0F172A; margin-bottom: 1rem; } }
    .info-table { display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem; .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid #F1F5F9; padding-bottom: 0.5rem; span { color: #64748B; } strong { color: #0F172A; } } }
    .cancel-action { margin-top: 1.5rem; display: flex; justify-content: flex-end; }
    .price-val { font-size: 1.75rem; font-weight: 800; color: #0F172A; margin-bottom: 0.25rem; }
    .tax-tag { font-size: 0.75rem; color: #64748B; }
  `]
})
export class BookingDetailsCustomerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingRepo = inject(BookingRepository);
  private toast = inject(ToastService);
  private confirmService = inject(ConfirmationService);

  public booking?: Booking;

  ngOnInit(): void {
    const bookingId = Number(this.route.snapshot.params['bookingId']);
    this.bookingRepo.getBookingById(bookingId).subscribe(res => {
      this.booking = res.data;
    });
  }

  formatMoney(amount: number): string {
    return formatCurrency(amount, this.booking?.currency || 'INR');
  }

  formatDate(dateStr: string): string {
    return formatDateDisplay(dateStr);
  }

  onCancelBooking(): void {
    if (!this.booking) return;

    this.confirmService.confirm({
      title: 'Cancel Reservation?',
      message: 'Are you sure you want to cancel this booking? Free cancellation is applied per policy.',
      confirmText: 'Yes, Cancel Stay',
      type: 'danger',
      onConfirm: () => {
        this.bookingRepo.cancelBooking(this.booking!.id, 'Guest requested cancellation via portal').subscribe(res => {
          this.booking = res.data;
          this.toast.success('Booking cancelled successfully.');
        });
      }
    });
  }
}
