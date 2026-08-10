import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoomRepository } from '../../../core/repositories/contracts/room.repository';
import { FeedbackRepository } from '../../../core/repositories/contracts/feedback.repository';
import { PricingCalculatorService } from '../../../core/services/pricing-calculator.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { PriceSummaryComponent } from '../../../shared/components/price-summary/price-summary.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { Room, BookingQuote, Feedback } from '../../../core/models';
import { formatDateISO } from '../../../core/utilities/date.utils';
import { formatCurrency } from '../../../core/utilities/money.utils';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RatingStarsComponent,
    PriceSummaryComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="room-details-page container" *ngIf="!isLoading && room">
      <!-- Gallery Grid -->
      <div class="gallery-grid">
        <div class="main-image">
          <img [src]="activeImageUrl" [alt]="room.description" />
        </div>
        <div class="thumbs-list">
          <div
            *ngFor="let img of room.images; let i = index"
            [class]="'thumb-item ' + (img.url === activeImageUrl ? 'thumb--active' : '')"
            (click)="activeImageUrl = img.url"
          >
            <img [src]="img.url" [alt]="img.altText" />
          </div>
        </div>
      </div>

      <div class="details-layout">
        <!-- Room Info Column -->
        <div class="info-col">
          <div class="header-box">
            <span class="badge badge--info font-mono">Room {{ room.roomNumber }} &bull; Floor {{ room.floorNumber }}</span>
            <h1 class="room-title font-serif">{{ room.description }}</h1>
            <div class="rating-row flex-gap">
              <app-rating-stars [rating]="room.rating"></app-rating-stars>
              <span class="reviews-count">({{ feedbackList.length }} Guest Reviews)</span>
            </div>
          </div>

          <!-- Specs Bar -->
          <div class="specs-bar">
            <div class="spec-cell">
              <app-icon name="users" [size]="20" color="#D97706"></app-icon>
              <span class="spec-label">Capacity</span>
              <span class="spec-val">Up to {{ room.maximumAdults }} Guests</span>
            </div>
            <div class="spec-cell">
              <app-icon name="bed" [size]="20" color="#D97706"></app-icon>
              <span class="spec-label">Bed Type</span>
              <span class="spec-val">{{ room.roomType.bedType }}</span>
            </div>
            <div class="spec-cell">
              <app-icon name="building" [size]="20" color="#D97706"></app-icon>
              <span class="spec-label">Room Size</span>
              <span class="spec-val">{{ room.roomType.roomSizeSqft }} sq ft</span>
            </div>
          </div>

          <!-- Description -->
          <div class="section-box">
            <h3 class="box-title">About This Room</h3>
            <p class="description-text">{{ room.description }}. Modern luxury interior designed for maximum comfort, featuring climate control, premium bedding, and high-speed fiber Wi-Fi.</p>
          </div>

          <!-- Amenities -->
          <div class="section-box">
            <h3 class="box-title">Included Amenities</h3>
            <div class="amenities-grid">
              <div *ngFor="let item of room.amenities" class="amenity-item flex-gap">
                <app-icon name="check" [size]="16" color="#047857"></app-icon>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- Guest Reviews -->
          <div class="section-box" *ngIf="feedbackList.length > 0">
            <h3 class="box-title">Guest Reviews</h3>
            <div class="reviews-list">
              <div *ngFor="let f of feedbackList" class="review-item">
                <div class="review-top flex-gap">
                  <strong>{{ f.guestName }}</strong>
                  <app-rating-stars [rating]="f.rating" [size]="12" [showScore]="false"></app-rating-stars>
                </div>
                <p class="comment-text">"{{ f.comments }}"</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Sidebar Card -->
        <div class="booking-col">
          <div class="sticky-card">
            <div class="card-price-header">
              <span class="price-val font-mono">{{ formatMoney(room.currentPrice) }}</span>
              <span class="price-sub">/ night</span>
            </div>

            <div class="dates-form">
              <div class="form-group">
                <label class="label">Check-In Date</label>
                <input type="date" [(ngModel)]="checkInDate" (change)="recalculateQuote()" class="input" />
              </div>
              <div class="form-group">
                <label class="label">Check-Out Date</label>
                <input type="date" [(ngModel)]="checkOutDate" (change)="recalculateQuote()" class="input" />
              </div>
              <div class="form-group">
                <label class="label">Guests</label>
                <select [(ngModel)]="adults" (change)="recalculateQuote()" class="input">
                  <option [ngValue]="1">1 Adult</option>
                  <option [ngValue]="2">2 Adults</option>
                </select>
              </div>
            </div>

            <!-- Price Breakdown Quote -->
            <app-price-summary [quote]="calculatedQuote!"></app-price-summary>

            <div class="action-box">
              <app-button variant="primary" size="lg" [fullWidth]="true" (btnClick)="onProceedToBooking()">
                Proceed to Reservation
              </app-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .room-details-page { padding-top: 2rem; padding-bottom: 5rem; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }

    .gallery-grid {
      display: grid;
      grid-template-columns: 1fr 140px;
      gap: 1rem;
      margin-bottom: 2.5rem;

      @media (max-width: 768px) { grid-template-columns: 1fr; }

      .main-image {
        height: 420px; border-radius: 16px; overflow: hidden;
        img { width: 100%; height: 100%; object-fit: cover; }
      }

      .thumbs-list {
        display: flex; flex-direction: column; gap: 0.75rem;
        @media (max-width: 768px) { flex-direction: row; }
      }

      .thumb-item {
        height: 100px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid transparent;
        img { width: 100%; height: 100%; object-fit: cover; }
        &.thumb--active { border-color: #D97706; }
      }
    }

    .details-layout {
      display: grid; grid-template-columns: 1fr 360px; gap: 2.5rem;
      @media (max-width: 960px) { grid-template-columns: 1fr; }
    }

    .header-box {
      margin-bottom: 1.5rem;
      .room-title { font-size: 2rem; font-weight: 800; color: #0F172A; margin: 0.5rem 0; }
      .reviews-count { font-size: 0.8125rem; color: #64748B; }
    }

    .specs-bar {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; background: #FFFFFF; border: 1px solid #E2E8F0;
      border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 2rem;

      .spec-cell {
        display: flex; flex-direction: column; gap: 0.25rem;
        .spec-label { font-size: 0.75rem; color: #64748B; text-transform: uppercase; font-weight: 700; }
        .spec-val { font-size: 0.875rem; font-weight: 700; color: #0F172A; }
      }
    }

    .section-box {
      margin-bottom: 2rem;
      .box-title { font-size: 1.125rem; font-weight: 700; color: #0F172A; margin-bottom: 0.75rem; }
      .description-text { font-size: 0.9375rem; color: #475569; line-height: 1.6; }
    }

    .amenities-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.875rem;
      @media (max-width: 640px) { grid-template-columns: 1fr 1fr; }

      .amenity-item {
        font-size: 0.875rem; font-weight: 600; color: #334155;
      }
    }

    .reviews-list {
      display: flex; flex-direction: column; gap: 1rem;
      .review-item { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1rem; }
      .comment-text { font-size: 0.875rem; color: #475569; margin-top: 0.375rem; }
    }

    .sticky-card {
      position: sticky; top: 90px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08); display: flex; flex-direction: column; gap: 1.25rem;
    }

    .card-price-header {
      .price-val { font-size: 1.5rem; font-weight: 800; color: #0F172A; }
      .price-sub { font-size: 0.875rem; color: #64748B; }
    }

    .dates-form {
      display: flex; flex-direction: column; gap: 0.75rem;
      .form-group {
        display: flex; flex-direction: column; gap: 0.25rem;
        .label { font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; }
        .input { padding: 0.5rem; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 0.875rem; font-weight: 600; }
      }
    }
  `]
})
export class RoomDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomRepo = inject(RoomRepository);
  private feedbackRepo = inject(FeedbackRepository);
  private calculator = inject(PricingCalculatorService);
  private authState = inject(AuthStateService);

  public room?: Room;
  public feedbackList: Feedback[] = [];
  public activeImageUrl = '';
  public isLoading = true;

  public checkInDate = formatDateISO(new Date());
  public checkOutDate = formatDateISO(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
  public adults = 2;
  public calculatedQuote?: BookingQuote;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const roomId = Number(params['roomId']);
      this.loadRoomDetails(roomId);
    });
  }

  loadRoomDetails(roomId: number): void {
    this.isLoading = true;
    this.roomRepo.getRoomById(roomId).subscribe({
      next: res => {
        this.room = res.data;
        this.activeImageUrl = this.room.images[0]?.url || '';
        this.recalculateQuote();
        this.isLoading = false;

        this.feedbackRepo.getFeedbackForRoom(this.room.roomNumber).subscribe(fRes => {
          this.feedbackList = fRes.data;
        });
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/rooms']);
      }
    });
  }

  recalculateQuote(): void {
    if (this.room) {
      this.calculatedQuote = this.calculator.calculateQuote(this.room, this.checkInDate, this.checkOutDate);
    }
  }

  formatMoney(amount: number): string {
    return formatCurrency(amount, this.room?.currency || 'INR');
  }

  onProceedToBooking(): void {
    if (!this.room) return;

    if (!this.authState.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/booking/${this.room.id}?checkInDate=${this.checkInDate}&checkOutDate=${this.checkOutDate}&adults=${this.adults}` }
      });
      return;
    }

    this.router.navigate(['/booking', this.room.id], {
      queryParams: {
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        adults: this.adults
      }
    });
  }
}
