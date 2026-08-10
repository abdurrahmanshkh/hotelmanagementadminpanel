import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Booking } from '../../../core/models';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { formatCurrency } from '../../../core/utilities/money.utils';
import { formatDateDisplay } from '../../../core/utilities/date.utils';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, IconComponent, ButtonComponent],
  template: `
    <div class="booking-card" *ngIf="booking">
      <div class="card-header">
        <div class="ref-box">
          <span class="ref-label font-mono">{{ booking.bookingReference }}</span>
          <app-status-badge [status]="booking.status"></app-status-badge>
        </div>
        <span class="created-at">Booked {{ formatDate(booking.createdAt) }}</span>
      </div>

      <div class="card-body">
        <img
          [src]="booking.room.primaryImageUrl || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32'"
          [alt]="booking.room.roomTypeName"
          class="room-thumb"
        />

        <div class="booking-info">
          <h4 class="room-title">
            {{ booking.room.roomTypeName }} &bull; Room {{ booking.room.roomNumber }}
          </h4>

          <div class="info-grid">
            <div class="info-item flex-gap">
              <app-icon name="calendar" [size]="14" color="#64748B"></app-icon>
              <span>{{ formatDate(booking.checkInDate) }} &rarr; {{ formatDate(booking.checkOutDate) }}</span>
            </div>
            <div class="info-item flex-gap">
              <app-icon name="users" [size]="14" color="#64748B"></app-icon>
              <span>{{ booking.guestCount }} {{ booking.guestCount === 1 ? 'Guest' : 'Guests' }} &bull; {{ booking.numberOfNights }} {{ booking.numberOfNights === 1 ? 'Night' : 'Nights' }}</span>
            </div>
          </div>
        </div>

        <div class="price-action">
          <div class="amount font-mono">{{ formatMoney(booking.totalAmount) }}</div>

          <div class="actions flex-gap">
            <a [routerLink]="['/account/bookings', booking.id]" class="btn-view">
              View Details
            </a>
            <a
              *ngIf="booking.status === 'CHECKED_IN' || booking.status === 'CONFIRMED'"
              [routerLink]="['/account/bookings', booking.id, 'passcode']"
              class="btn-key flex-gap"
            >
              <app-icon name="key" [size]="14" color="#D97706"></app-icon> Keycode
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03);
      transition: border-color 0.15s;

      &:hover {
        border-color: #CBD5E1;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #F1F5F9;

      .ref-box {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .ref-label {
        font-size: 0.875rem;
        font-weight: 700;
        color: #0F172A;
      }

      .created-at {
        font-size: 0.75rem;
        color: #64748B;
      }
    }

    .card-body {
      display: flex;
      align-items: center;
      gap: 1.25rem;

      @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    .room-thumb {
      width: 90px;
      height: 70px;
      border-radius: 8px;
      object-fit: cover;
    }

    .booking-info {
      flex: 1;

      .room-title {
        font-size: 1rem;
        font-weight: 700;
        color: #0F172A;
        margin-bottom: 0.375rem;
      }

      .info-grid {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.8125rem;
        color: #475569;
      }
    }

    .price-action {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;

      @media (max-width: 640px) {
        align-items: flex-start;
        width: 100%;
        margin-top: 0.5rem;
        padding-top: 0.75rem;
        border-top: 1px solid #F1F5F9;
      }

      .amount {
        font-size: 1.125rem;
        font-weight: 800;
        color: #0F172A;
      }

      .btn-view {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #0F172A;
        padding: 0.375rem 0.625rem;
        border-radius: 6px;
        background: #F8FAFC;
        border: 1px solid #E2E8F0;

        &:hover {
          background: #F1F5F9;
        }
      }

      .btn-key {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #B45309;
        padding: 0.375rem 0.625rem;
        border-radius: 6px;
        background: #FFFBEB;
        border: 1px solid #FDE68A;

        &:hover {
          background: #FEF3C7;
        }
      }
    }
  `]
})
export class BookingCardComponent {
  @Input({ required: true }) booking!: Booking;

  formatMoney(amount: number): string {
    return formatCurrency(amount, this.booking?.currency || 'INR');
  }

  formatDate(dateStr?: string): string {
    return formatDateDisplay(dateStr);
  }
}
