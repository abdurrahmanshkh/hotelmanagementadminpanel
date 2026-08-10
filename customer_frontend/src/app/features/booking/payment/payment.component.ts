import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookingRepository } from '../../../core/repositories/contracts/booking.repository';
import { PaymentRepository } from '../../../core/repositories/contracts/payment.repository';
import { ToastService } from '../../../core/services/toast.service';
import { PriceSummaryComponent } from '../../../shared/components/price-summary/price-summary.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Booking } from '../../../core/models';
import { formatCurrency } from '../../../core/utilities/money.utils';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PriceSummaryComponent, ButtonComponent, IconComponent],
  template: `
    <div class="booking-page container" *ngIf="booking">
      <!-- Step Indicator Header -->
      <div class="step-indicator flex-gap">
        <div class="step-item"><span class="step-num font-mono">1</span> Stay & Guest Details</div>
        <span class="step-arrow">&rarr;</span>
        <div class="step-item"><span class="step-num font-mono">2</span> Review Quote</div>
        <span class="step-arrow">&rarr;</span>
        <div class="step-item step--active"><span class="step-num font-mono">3</span> Payment</div>
      </div>

      <div class="booking-grid">
        <!-- Payment Gateway Column -->
        <div class="payment-col">
          <div class="card-box">
            <h2 class="box-title">Step 3: Payment Gateway</h2>

            <!-- Test Shortcut Demo Bar -->
            <div class="demo-shortcuts font-mono">
              <span class="title">TEST SHORTCUTS:</span>
              <button type="button" class="btn-demo-success" (click)="simulateSuccessToken()">
                &check; Quickfill Valid Card
              </button>
              <button type="button" class="btn-demo-fail" (click)="simulateFailedToken()">
                &cross; Simulate Failed Card
              </button>
            </div>

            <!-- Payment Method Tabs -->
            <div class="method-tabs">
              <button
                type="button"
                [class]="'tab-btn ' + (activeTab === 'CARD' ? 'tab--active' : '')"
                (click)="activeTab = 'CARD'"
              >
                <app-icon name="key" [size]="16"></app-icon> Credit / Debit Card
              </button>
              <button
                type="button"
                [class]="'tab-btn ' + (activeTab === 'UPI' ? 'tab--active' : '')"
                (click)="activeTab = 'UPI'"
              >
                <app-icon name="sparkles" [size]="16"></app-icon> UPI / GPay
              </button>
            </div>

            <!-- Card Payment Form -->
            <form *ngIf="activeTab === 'CARD'" [formGroup]="cardForm" (ngSubmit)="onProcessPayment('CARD')" class="payment-form">
              <div class="form-group">
                <label class="form-label">Cardholder Name</label>
                <input type="text" formControlName="cardholderName" class="form-control" placeholder="John Doe" />
              </div>

              <div class="form-group">
                <label class="form-label">Card Number</label>
                <input type="text" formControlName="cardNumber" class="form-control font-mono" placeholder="4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8892" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Expiration (MM/YY)</label>
                  <input type="text" formControlName="expiryDate" class="form-control font-mono" placeholder="12/28" />
                </div>
                <div class="form-group">
                  <label class="form-label">CVV Code</label>
                  <input type="password" formControlName="cvv" class="form-control font-mono" placeholder="123" />
                </div>
              </div>

              <div class="actions-row">
                <app-button
                  type="submit"
                  variant="primary"
                  size="lg"
                  [fullWidth]="true"
                  [loading]="isProcessing"
                  [disabled]="cardForm.invalid"
                >
                  Pay {{ formatMoney(booking.totalAmount) }} Now
                </app-button>
              </div>
            </form>

            <!-- UPI Payment Option -->
            <div *ngIf="activeTab === 'UPI'" class="upi-box text-center">
              <p>Scan UPI QR Code or Enter Virtual Payment Address (VPA):</p>
              <input type="text" class="form-control font-mono" placeholder="guest@upi" [(ngModel)]="upiId" />
              <div class="actions-row mt-4">
                <app-button
                  variant="primary"
                  size="lg"
                  [fullWidth]="true"
                  [loading]="isProcessing"
                  (btnClick)="onProcessPayment('UPI')"
                >
                  Pay {{ formatMoney(booking.totalAmount) }} via UPI
                </app-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Summary Sidebar -->
        <div class="summary-col">
          <div class="card-box booking-summary">
            <h3 class="summary-title font-mono">Reference: {{ booking.bookingReference }}</h3>
            <div class="summary-line">
              <span>Room</span>
              <strong>{{ booking.room.roomTypeName }} (#{{ booking.room.roomNumber }})</strong>
            </div>
            <div class="summary-line">
              <span>Dates</span>
              <strong>{{ booking.checkInDate }} &rarr; {{ booking.checkOutDate }}</strong>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-total">
              <span>Total Amount</span>
              <span class="amount font-mono">{{ formatMoney(booking.totalAmount) }}</span>
            </div>
          </div>
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
      display: grid; grid-template-columns: 1fr 340px; gap: 2rem;
      @media (max-width: 868px) { grid-template-columns: 1fr; }
    }

    .card-box {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03); display: flex; flex-direction: column; gap: 1.25rem;
    }

    .box-title { font-size: 1.25rem; font-weight: 800; color: #0F172A; }

    .demo-shortcuts {
      background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 0.75rem; font-size: 0.75rem;
      display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
      .title { color: #B45309; font-weight: 800; }
      .btn-demo-success { background: #047857; color: #FFF; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 700; }
      .btn-demo-fail { background: #BE123C; color: #FFF; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-weight: 700; }
    }

    .method-tabs {
      display: flex; gap: 0.5rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.5rem;
      .tab-btn {
        background: none; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600; color: #64748B; cursor: pointer;
        &.tab--active { background: #0F172A; color: #FFFFFF; }
      }
    }

    .payment-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group {
      display: flex; flex-direction: column; gap: 0.375rem;
      .form-label { font-size: 0.8125rem; font-weight: 700; color: #0F172A; }
      .form-control { padding: 0.625rem 0.875rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.875rem; outline: none; &:focus { border-color: #D97706; } }
    }

    .upi-box { padding: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; }
    .mt-4 { margin-top: 1rem; }

    .booking-summary {
      .summary-title { font-size: 0.875rem; font-weight: 700; color: #D97706; margin-bottom: 1rem; }
      .summary-line { display: flex; justify-content: space-between; font-size: 0.8125rem; color: #475569; margin-bottom: 0.5rem; }
      .summary-divider { height: 1px; background: #E2E8F0; margin: 1rem 0; }
      .summary-total { display: flex; justify-content: space-between; font-size: 1rem; font-weight: 800; color: #0F172A; .amount { color: #D97706; } }
    }
  `]
})
export class PaymentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private bookingRepo = inject(BookingRepository);
  private paymentRepo = inject(PaymentRepository);
  private toast = inject(ToastService);

  public booking?: Booking;
  public activeTab: 'CARD' | 'UPI' = 'CARD';
  public isProcessing = false;
  public upiId = 'guest@upi';

  public cardForm = this.fb.group({
    cardholderName: ['John Doe', [Validators.required]],
    cardNumber: ['4532 8812 9901 8892', [Validators.required]],
    expiryDate: ['12/28', [Validators.required]],
    cvv: ['123', [Validators.required, Validators.minLength(3)]],
    paymentToken: ['tok_success']
  });

  ngOnInit(): void {
    const bookingId = Number(this.route.snapshot.params['bookingId']);
    this.bookingRepo.getBookingById(bookingId).subscribe(res => {
      this.booking = res.data;
    });
  }

  simulateSuccessToken(): void {
    this.cardForm.patchValue({
      cardholderName: 'John Doe',
      cardNumber: '4532 8812 9901 8892',
      expiryDate: '12/28',
      cvv: '123',
      paymentToken: 'tok_success'
    });
    this.toast.info('Simulating Valid Card Token (tok_success).');
  }

  simulateFailedToken(): void {
    this.cardForm.patchValue({
      paymentToken: 'tok_failed'
    });
    this.toast.warning('Simulating Failed Card Token (tok_failed).');
  }

  formatMoney(amount: number): string {
    return formatCurrency(amount, this.booking?.currency || 'INR');
  }

  onProcessPayment(method: string): void {
    if (!this.booking) return;

    this.isProcessing = true;
    const token = this.cardForm.value.paymentToken || 'tok_success';

    this.paymentRepo.processPayment({
      bookingId: this.booking.id,
      paymentMethod: method as any,
      paymentToken: token
    }).subscribe({
      next: res => {
        this.isProcessing = false;
        if (res.data.status === 'SUCCESS') {
          this.toast.success('Payment authorized & digital key passcode generated!');
          this.router.navigate(['/booking', this.booking!.id, 'confirmation']);
        } else {
          this.toast.error(`Payment Failed: ${res.data.failureReason || 'Declined'}`);
        }
      },
      error: () => {
        this.isProcessing = false;
      }
    });
  }
}
