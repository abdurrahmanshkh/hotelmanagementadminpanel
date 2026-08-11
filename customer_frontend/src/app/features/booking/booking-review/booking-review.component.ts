import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoomRepository } from '../../../core/repositories/contracts/room.repository';
import { BookingRepository } from '../../../core/repositories/contracts/booking.repository';
import { PricingCalculatorService } from '../../../core/services/pricing-calculator.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { PriceSummaryComponent } from '../../../shared/components/price-summary/price-summary.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Room, BookingQuote } from '../../../core/models';
import { formatDateDisplay } from '../../../core/utilities/date.utils';

@Component({
  selector: 'app-booking-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PriceSummaryComponent, ButtonComponent, IconComponent],
  template: `
    <div class="booking-page container" *ngIf="room && quote">
      <!-- Step Indicator Header -->
      <div class="step-indicator flex-gap">
        <div class="step-item"><span class="step-num font-mono">1</span> Stay & Guest Details</div>
        <span class="step-arrow">&rarr;</span>
        <div class="step-item step--active"><span class="step-num font-mono">2</span> Review Quote</div>
        <span class="step-arrow">&rarr;</span>
        <div class="step-item"><span class="step-num font-mono">3</span> Payment</div>
      </div>

      <div class="booking-grid">
        <!-- Review Column -->
        <div class="review-col">
          <div class="card-box">
            <h2 class="box-title">Step 2: Review Reservation Summary</h2>

            <!-- Guest Profile Info -->
            <div class="info-block" *ngIf="authState.currentUser() as user">
              <h4 class="block-title">Primary Guest Contact</h4>
              <div class="info-grid">
                <div><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</div>
                <div><strong>Email:</strong> {{ user.email }}</div>
                <div><strong>Phone:</strong> {{ user.phone }}</div>
                <div><strong>Govt ID:</strong> {{ user.governmentIdMasked }}</div>
              </div>
            </div>

            <!-- Stay Summary -->
            <div class="info-block">
              <h4 class="block-title">Stay & Room Details</h4>
              <div class="info-grid">
                <div><strong>Room:</strong> {{ room.roomType.name }} &bull; Room {{ room.roomNumber }}</div>
                <div><strong>Check-In:</strong> {{ formatDate(checkInDate) }} (3:00 PM)</div>
                <div><strong>Check-Out:</strong> {{ formatDate(checkOutDate) }} (11:00 AM)</div>
                <div><strong>Guests:</strong> {{ adults }} Adults<span *ngIf="children > 0">, {{ children }} Children</span></div>
                <div *ngIf="specialRequests" class="full-width"><strong>Special Requests:</strong> {{ specialRequests }}</div>
              </div>
            </div>

            <!-- Cancellation Policy -->
            <div class="policy-box">
              <app-icon name="shield" [size]="20" color="#047857"></app-icon>
              <div>
                <strong>Flexible Cancellation Policy:</strong>
                <p>Free cancellation up to 48 hours prior to check-in. Non-refundable within 48 hours.</p>
              </div>
            </div>

            <div class="terms-check">
              <label class="check-label">
                <input type="checkbox" [(ngModel)]="agreedToTerms" />
                <span>I agree to SmartStay Resort rules, guest privacy policy, and booking terms.</span>
              </label>
            </div>

            <div class="actions-row flex-gap">
              <app-button variant="outline" (btnClick)="onBack()">
                &larr; Back to Step 1
              </app-button>
              <app-button
                variant="primary"
                size="lg"
                [loading]="isCreating"
                [disabled]="!agreedToTerms"
                (btnClick)="onProceedToPayment()"
              >
                Proceed to Payment &rarr;
              </app-button>
            </div>
          </div>
        </div>

        <!-- Price Quote Column -->
        <div class="quote-col">
          <app-price-summary [quote]="quote"></app-price-summary>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-page { padding-top: 2rem; padding-bottom: 5rem; }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem; }

    .step-indicator {
      display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 2.5rem;
      .step-item {
        display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 700; color: #94A3B8;
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: #E2E8F0; color: #64748B; display: flex; align-items: center; justify-content: center; font-size: 0.8125rem; }
        &.step--active { color: #0F172A; .step-num { background: #D97706; color: #FFFFFF; } }
      }
      .step-arrow { color: #CBD5E1; font-weight: 700; }
    }

    .booking-grid {
      display: grid; grid-template-columns: 1fr 360px; gap: 2rem;
      @media (max-width: 868px) { grid-template-columns: 1fr; }
    }

    .card-box {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03); display: flex; flex-direction: column; gap: 1.5rem;
    }

    .box-title { font-size: 1.25rem; font-weight: 800; color: #0F172A; }

    .info-block {
      background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.25rem;
      .block-title { font-size: 0.875rem; font-weight: 700; color: #0F172A; text-transform: uppercase; margin-bottom: 0.75rem; }
      .info-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; font-size: 0.875rem; color: #475569;
        .full-width { grid-column: span 2; }
      }
    }

    .policy-box {
      background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 1rem;
      display: flex; gap: 0.75rem; font-size: 0.8125rem; color: #166534; p { margin-top: 0.25rem; color: #15803D; }
    }

    .terms-check {
      font-size: 0.875rem; color: #334155;
      .check-label { display: flex; align-items: center; gap: 0.625rem; cursor: pointer; }
    }

    .actions-row { display: flex; align-items: center; justify-content: space-between; margin-top: 1rem; }
  `]
})
export class BookingReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomRepo = inject(RoomRepository);
  private bookingRepo = inject(BookingRepository);
  private calculator = inject(PricingCalculatorService);
  public authState = inject(AuthStateService);
  private toast = inject(ToastService);

  public room?: Room;
  public quote?: BookingQuote;
  public checkInDate = '';
  public checkOutDate = '';
  public adults = 2;
  public children = 0;
  public specialRequests = '';
  public agreedToTerms = true;
  public isCreating = false;

  ngOnInit(): void {
    const roomId = Number(this.route.snapshot.params['roomId']);
    const q = this.route.snapshot.queryParams;

    this.checkInDate = q['checkInDate'] || '';
    this.checkOutDate = q['checkOutDate'] || '';
    this.adults = Number(q['adults']) || 2;
    this.children = Number(q['children']) || 0;
    this.specialRequests = q['specialRequests'] || '';

    this.roomRepo.getRoomById(roomId).subscribe(res => {
      this.room = res.data;
      this.quote = this.calculator.calculateQuote(this.room, this.checkInDate, this.checkOutDate);
    });
  }

  formatDate(dateStr: string): string {
    return formatDateDisplay(dateStr);
  }

  onBack(): void {
    this.router.navigate(['/booking', this.room?.id], {
      queryParams: {
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        adults: this.adults,
        children: this.children
      }
    });
  }

  onProceedToPayment(): void {
    if (!this.agreedToTerms) {
      this.toast.warning('Please accept the resort rules and booking terms to proceed to payment.');
      return;
    }

    if (!this.room || !this.quote) return;

    this.isCreating = true;
    const currentUser = this.authState.currentUser();

    this.bookingRepo.createBooking({
      roomId: this.room.id,
      adults: this.adults,
      children: this.children,
      guestName: `${currentUser?.firstName || 'Guest'} ${currentUser?.lastName || ''}`,
      guestEmail: currentUser?.email || 'guest@example.com',
      guestPhone: currentUser?.phone || '9876543210',
      guestCount: this.adults + this.children,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      specialRequests: this.specialRequests
    }).subscribe({
      next: res => {
        this.isCreating = false;
        this.router.navigate(['/booking', res.data.id, 'payment']);
      },
      error: () => {
        this.isCreating = false;
      }
    });
  }
}
