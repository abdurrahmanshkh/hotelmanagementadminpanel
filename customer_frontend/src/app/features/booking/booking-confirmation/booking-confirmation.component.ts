import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookingRepository } from '../../../core/repositories/contracts/booking.repository';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Booking } from '../../../core/models';
import { formatCurrency } from '../../../core/utilities/money.utils';
import { formatDateDisplay } from '../../../core/utilities/date.utils';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, IconComponent],
  template: `
    <div class="confirmation-page container" *ngIf="booking">
      <div class="success-banner text-center">
        <div class="check-circle">
          <app-icon name="check" [size]="48" color="#047857"></app-icon>
        </div>
        <span class="badge badge--success font-mono">RESERVATION CONFIRMED &amp; PAID</span>
        <h1 class="title font-serif">Thank You! Your Stay is Booked</h1>
        <p class="subtitle">A confirmation receipt and digital door passcode have been dispatched to your email.</p>
      </div>

      <div class="confirmation-card">
        <div class="ref-header">
          <div class="ref-item">
            <span class="label">Booking Reference</span>
            <span class="val font-mono">{{ booking.bookingReference }}</span>
          </div>
          <div class="ref-item">
            <span class="label">Payment Transaction</span>
            <span class="val font-mono">{{ booking.paymentTransactionRef || 'PAY-SUCCESS-2026' }}</span>
          </div>
          <div class="ref-item">
            <span class="label">Total Paid</span>
            <span class="val font-mono price">{{ formatMoney(booking.totalAmount) }}</span>
          </div>
        </div>

        <div class="card-body">
          <img [src]="booking.room.primaryImageUrl" [alt]="booking.room.roomTypeName" class="room-thumb" />
          <div class="booking-details">
            <h3 class="room-title">{{ booking.room.roomTypeName }} &bull; Room {{ booking.room.roomNumber }}</h3>

            <div class="details-grid">
              <div><strong>Primary Guest:</strong> {{ booking.guestName }}</div>
              <div><strong>Check-In Date:</strong> {{ formatDate(booking.checkInDate) }} (3:00 PM)</div>
              <div><strong>Check-Out Date:</strong> {{ formatDate(booking.checkOutDate) }} (11:00 AM)</div>
              <div><strong>Guest Count:</strong> {{ booking.guestCount }} Guests &bull; {{ booking.numberOfNights }} Nights</div>
            </div>
          </div>
        </div>

        <div class="card-actions flex-gap">
          <a [routerLink]="['/account/bookings', booking.id, 'passcode']">
            <app-button variant="primary" size="lg" icon="key">
              View Digital Door Keycode &rarr;
            </app-button>
          </a>
          <button type="button" class="btn-print flex-gap" (click)="onPrint()">
            <app-icon name="printer" [size]="16"></app-icon> Print Receipt
          </button>
          <a routerLink="/" class="btn-home">
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-page { padding-top: 3rem; padding-bottom: 5rem; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }
    .text-center { text-align: center; }

    .success-banner {
      margin-bottom: 2.5rem; display: flex; flex-direction: column; align-items: center;
      .check-circle {
        width: 88px; height: 88px; border-radius: 50%; background: #ECFDF5; border: 2px solid #A7F3D0;
        display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;
      }
      .title { font-size: 2.25rem; font-weight: 800; color: #0F172A; margin: 0.75rem 0 0.5rem; }
      .subtitle { font-size: 1rem; color: #64748B; max-width: 580px; }
    }

    .confirmation-card {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08); display: flex; flex-direction: column; gap: 1.5rem;
    }

    .ref-header {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; background: #F8FAFC; border: 1px solid #E2E8F0;
      border-radius: 12px; padding: 1.25rem;
      @media (max-width: 640px) { grid-template-columns: 1fr; }
      .ref-item {
        display: flex; flex-direction: column; gap: 0.25rem;
        .label { font-size: 0.6875rem; font-weight: 700; color: #64748B; text-transform: uppercase; }
        .val { font-size: 0.9375rem; font-weight: 700; color: #0F172A; &.price { color: #D97706; font-size: 1.125rem; } }
      }
    }

    .card-body {
      display: flex; gap: 1.5rem; align-items: center;
      @media (max-width: 640px) { flex-direction: column; align-items: flex-start; }
      .room-thumb { width: 140px; height: 100px; border-radius: 12px; object-fit: cover; }
      .booking-details {
        flex: 1;
        .room-title { font-size: 1.125rem; font-weight: 700; color: #0F172A; margin-bottom: 0.625rem; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem; color: #475569; }
      }
    }

    .card-actions {
      display: flex; align-items: center; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid #F1F5F9;
      @media (max-width: 640px) { flex-direction: column; align-items: stretch; }
      .btn-print { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 0.625rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
      .btn-home { font-size: 0.875rem; font-weight: 600; color: #475569; text-align: center; }
    }
  `]
})
export class BookingConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingRepo = inject(BookingRepository);

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

  onPrint(): void {
    window.print();
  }
}
