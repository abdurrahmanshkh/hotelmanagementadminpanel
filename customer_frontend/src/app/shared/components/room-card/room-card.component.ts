import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Room } from '../../../core/models';
import { IconComponent } from '../icon/icon.component';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';
import { ButtonComponent } from '../button/button.component';
import { formatCurrency } from '../../../core/utilities/money.utils';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, RatingStarsComponent, ButtonComponent],
  template: `
    <div class="room-card" *ngIf="room">
      <div class="card-image-box">
        <img
          [src]="primaryImage"
          [alt]="room.description"
          class="card-img"
          loading="lazy"
        />
        <span class="badge badge--available card-badge font-mono">
          Room {{ room.roomNumber }}
        </span>
        <span *ngIf="room.featured" class="featured-tag flex-gap">
          <app-icon name="sparkles" [size]="12" color="#FFFFFF"></app-icon> Featured
        </span>
      </div>

      <div class="card-content">
        <div class="type-row">
          <span class="type-name">{{ room.roomType.name }}</span>
          <app-rating-stars [rating]="room.rating" [size]="14"></app-rating-stars>
        </div>

        <h4 class="card-title">{{ room.description }}</h4>

        <div class="specs-grid">
          <span class="spec-item flex-gap">
            <app-icon name="users" [size]="14" color="#64748B"></app-icon>
            Up to {{ room.maximumAdults }} Guests
          </span>
          <span class="spec-item flex-gap">
            <app-icon name="bed" [size]="14" color="#64748B"></app-icon>
            {{ room.roomType.bedType }}
          </span>
        </div>

        <div class="amenity-chips">
          <span *ngFor="let item of room.amenities.slice(0, 3)" class="amenity-chip">
            {{ item }}
          </span>
          <span *ngIf="room.amenities.length > 3" class="amenity-chip count">
            +{{ room.amenities.length - 3 }} more
          </span>
        </div>

        <div class="card-footer">
          <div class="price-box">
            <span class="price-val font-mono">{{ format(room.currentPrice) }}</span>
            <span class="price-period">/ night</span>
          </div>

          <div class="card-actions flex-gap">
            <a [routerLink]="['/rooms', room.id]" class="btn-details">
              View Details
            </a>
            <app-button variant="primary" size="sm" (btnClick)="onBookClick()">
              Book Now
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .room-card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04);
      transition: all 0.2s ease-in-out;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 20px -4px rgba(15, 23, 42, 0.08);
        border-color: #CBD5E1;
      }
    }

    .card-image-box {
      position: relative;
      height: 200px;
      width: 100%;
      overflow: hidden;

      .card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      &:hover .card-img {
        transform: scale(1.04);
      }

      .card-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .featured-tag {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #D97706;
        color: #FFFFFF;
        font-size: 0.6875rem;
        font-weight: 700;
        padding: 0.25rem 0.625rem;
        border-radius: 9999px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
    }

    .card-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .type-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.375rem;

      .type-name {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #D97706;
      }
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #0F172A;
      line-height: 1.3;
      margin-bottom: 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .specs-grid {
      display: flex;
      gap: 1rem;
      font-size: 0.8125rem;
      color: #64748B;
      margin-bottom: 0.75rem;
    }

    .amenity-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-bottom: 1.25rem;

      .amenity-chip {
        background-color: #F1F5F9;
        color: #475569;
        font-size: 0.6875rem;
        font-weight: 600;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;

        &.count {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
        }
      }
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 0.875rem;
      border-top: 1px solid #F1F5F9;
    }

    .price-box {
      .price-val {
        font-size: 1.125rem;
        font-weight: 800;
        color: #0F172A;
      }
      .price-period {
        font-size: 0.75rem;
        color: #64748B;
        margin-left: 0.25rem;
      }
    }

    .btn-details {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #0F172A;
      padding: 0.375rem 0.625rem;
      border-radius: 6px;

      &:hover {
        background-color: #F1F5F9;
      }
    }
  `]
})
export class RoomCardComponent {
  @Input({ required: true }) room!: Room;
  @Output() bookNow = new EventEmitter<Room>();

  get primaryImage(): string {
    return this.room.images && this.room.images.length > 0
      ? this.room.images[0].url
      : 'https://images.unsplash.com/photo-1611892440504-42a792e24d32';
  }

  format(amount: number): string {
    return formatCurrency(amount, this.room.currency);
  }

  onBookClick(): void {
    this.bookNow.emit(this.room);
  }
}
