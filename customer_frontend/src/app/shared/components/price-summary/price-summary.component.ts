import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingQuote } from '../../../core/models';
import { formatCurrency } from '../../../core/utilities/money.utils';

@Component({
  selector: 'app-price-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="price-summary-card" *ngIf="quote">
      <h3 class="card-title">Price Summary</h3>

      <div class="summary-line">
        <span>₹{{ quote.appliedPricePerNight }} &times; {{ quote.numberOfNights }} {{ quote.numberOfNights === 1 ? 'night' : 'nights' }}</span>
        <span class="font-mono font-semibold">{{ format(quote.roomAmount) }}</span>
      </div>

      <div class="summary-line">
        <span>GST & Hotel Tax ({{ quote.taxPercentage }}%)</span>
        <span class="font-mono">{{ format(quote.taxAmount) }}</span>
      </div>

      <div class="summary-line">
        <span>Service Fee ({{ quote.serviceFeePercentage }}%)</span>
        <span class="font-mono">{{ format(quote.serviceFee) }}</span>
      </div>

      <div class="summary-line discount" *ngIf="quote.discountAmount > 0">
        <span>Discount</span>
        <span class="font-mono">- {{ format(quote.discountAmount) }}</span>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-total">
        <span class="total-label">Total Payable</span>
        <span class="total-amount font-mono">{{ format(quote.totalAmount) }}</span>
      </div>
      <p class="tax-note">Includes all applicable taxes and resort charges</p>
    </div>
  `,
  styles: [`
    .price-summary-card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04);
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 1rem;
    }

    .summary-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #475569;
      margin-bottom: 0.625rem;

      &.discount {
        color: #047857;
      }
    }

    .summary-divider {
      height: 1px;
      background-color: #E2E8F0;
      margin: 1rem 0;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .total-label {
        font-size: 1rem;
        font-weight: 700;
        color: #0F172A;
      }

      .total-amount {
        font-size: 1.25rem;
        font-weight: 800;
        color: #D97706;
      }
    }

    .tax-note {
      font-size: 0.75rem;
      color: #64748B;
      margin-top: 0.5rem;
      text-align: right;
    }
  `]
})
export class PriceSummaryComponent {
  @Input({ required: true }) quote!: BookingQuote;

  format(amount: number): string {
    return formatCurrency(amount, this.quote?.currency || 'INR');
  }
}
