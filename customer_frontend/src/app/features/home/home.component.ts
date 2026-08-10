import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RoomRepository } from '../../core/repositories/contracts/room.repository';
import { RoomCardComponent } from '../../shared/components/room-card/room-card.component';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Room } from '../../core/models';
import { formatDateISO } from '../../core/utilities/date.utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RoomCardComponent,
    RatingStarsComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
          alt="SmartStay Resort View"
          class="hero-bg"
        />
        <div class="hero-content">
          <span class="badge badge--info hero-badge font-mono">Boutique Digital Hospitality</span>
          <h1 class="hero-title font-serif">A Sanctuary of Modern Luxury & Keyless Comfort</h1>
          <p class="hero-sub">
            Experience world-class resort amenities, instant room reservations, and digital door passcode access.
          </p>

          <!-- Availability Search Bar -->
          <div class="search-card">
            <div class="search-grid">
              <div class="search-field">
                <label class="field-label">Check-In</label>
                <input type="date" [(ngModel)]="checkInDate" [min]="todayStr" class="field-input" />
              </div>
              <div class="search-field">
                <label class="field-label">Check-Out</label>
                <input type="date" [(ngModel)]="checkOutDate" [min]="checkInDate" class="field-input" />
              </div>
              <div class="search-field">
                <label class="field-label">Guests</label>
                <select [(ngModel)]="adults" class="field-input">
                  <option [ngValue]="1">1 Adult</option>
                  <option [ngValue]="2">2 Adults</option>
                  <option [ngValue]="3">3 Adults</option>
                </select>
              </div>
              <div class="search-action">
                <app-button variant="primary" size="lg" icon="search" (btnClick)="onSearch()">
                  Search Available Rooms
                </app-button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Rooms Section -->
      <section class="section container">
        <div class="section-header">
          <div>
            <span class="sub-title">ROOMS & SUITES</span>
            <h2 class="section-title font-serif">Handpicked Luxury Accommodation</h2>
          </div>
          <a routerLink="/rooms" class="view-all-link flex-gap">
            View All Rooms <app-icon name="arrow-right" [size]="16"></app-icon>
          </a>
        </div>

        <div class="rooms-grid">
          <app-room-card
            *ngFor="let room of featuredRooms"
            [room]="room"
            (bookNow)="onBookRoom($event)"
          ></app-room-card>
        </div>
      </section>

      <!-- Highlights & Amenities -->
      <section class="highlights-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="sub-title">RESORT EXPERIENCE</span>
            <h2 class="section-title font-serif">Why Guests Choose SmartStay</h2>
          </div>

          <div class="highlights-grid">
            <div class="highlight-card">
              <div class="icon-box"><app-icon name="key" [size]="28" color="#D97706"></app-icon></div>
              <h3>Keyless Passcode Access</h3>
              <p>No keys or plastic cards to lose. Receive a secure 6-digit passcode for instant room door unlock.</p>
            </div>
            <div class="highlight-card">
              <div class="icon-box"><app-icon name="trending-up" [size]="28" color="#D97706"></app-icon></div>
              <h3>Smart Dynamic Pricing</h3>
              <p>Transparent pricing calculated in real time with guaranteed best available rates online.</p>
            </div>
            <div class="highlight-card">
              <div class="icon-box"><app-icon name="bot" [size]="28" color="#D97706"></app-icon></div>
              <h3>24/7 AI Concierge Chat</h3>
              <p>Instant answers to room service, Wi-Fi, dining, and pool queries with seamless staff escalation.</p>
            </div>
            <div class="highlight-card">
              <div class="icon-box"><app-icon name="sparkles" [size]="28" color="#D97706"></app-icon></div>
              <h3>On-Demand Services</h3>
              <p>Order extra towels, room cleaning, or repair requests directly from your mobile account portal.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Reviews Section -->
      <section class="section container">
        <div class="section-header text-center">
          <span class="sub-title">GUEST FEEDBACK</span>
          <h2 class="section-title font-serif">Unforgettable Experiences</h2>
        </div>

        <div class="reviews-grid">
          <div class="review-card">
            <app-rating-stars [rating]="5"></app-rating-stars>
            <p class="comment">"The digital passcode entry made check-in effortless. The Executive Suite view over the ocean was breathtaking!"</p>
            <div class="author-info">
              <strong>Emily Watson</strong> &bull; Verified Guest
            </div>
          </div>

          <div class="review-card">
            <app-rating-stars [rating]="5"></app-rating-stars>
            <p class="comment">"Impeccable service! We ordered extra towels using the service request portal and they arrived in 5 minutes."</p>
            <div class="author-info">
              <strong>Guest User</strong> &bull; Verified Guest
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page { padding-bottom: 4rem; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }

    .hero-section {
      position: relative;
      height: 620px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      text-align: center;
      padding: 0 1.5rem;

      .hero-bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.75) 100%);
      }

      .hero-content {
        position: relative;
        z-index: 10;
        max-width: 860px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .hero-badge { margin-bottom: 1.25rem; }
        .hero-title { font-size: 3rem; font-weight: 800; line-height: 1.15; margin-bottom: 1rem; }
        .hero-sub { font-size: 1.125rem; color: #E2E8F0; max-width: 640px; margin-bottom: 2.5rem; }
      }
    }

    .search-card {
      background: #FFFFFF;
      color: #0F172A;
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.25);
    }

    .search-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 1rem;
      align-items: end;

      @media (max-width: 868px) {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 540px) {
        grid-template-columns: 1fr;
      }
    }

    .search-field {
      display: flex;
      flex-direction: column;
      text-align: left;
      gap: 0.375rem;

      .field-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748B; }
      .field-input {
        padding: 0.625rem 0.875rem;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        outline: none;
      }
    }

    .section { padding: 5rem 1.5rem 2rem; }

    .section-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 2.5rem;

      &.text-center { text-align: center; justify-content: center; }

      .sub-title { font-size: 0.75rem; font-weight: 700; color: #D97706; letter-spacing: 0.08em; }
      .section-title { font-size: 2rem; font-weight: 800; color: #0F172A; }
      .view-all-link { font-size: 0.875rem; font-weight: 700; color: #D97706; &:hover { text-decoration: underline; } }
    }

    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
    }

    .highlights-section {
      background-color: #F1F5F9;
      padding: 5rem 0;
      margin-top: 3rem;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 2rem;
    }

    .highlight-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;

      .icon-box {
        width: 56px; height: 56px; border-radius: 50%; background: #FFFBEB; border: 1px solid #FDE68A;
        display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;
      }

      h3 { font-size: 1.125rem; font-weight: 700; color: #0F172A; margin-bottom: 0.5rem; }
      p { font-size: 0.875rem; color: #64748B; line-height: 1.5; }
    }

    .reviews-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      @media (max-width: 640px) { grid-template-columns: 1fr; }
    }

    .review-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 2rem;
      .comment { font-size: 1rem; color: #334155; font-style: italic; line-height: 1.6; margin: 1rem 0; }
      .author-info { font-size: 0.8125rem; color: #64748B; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private roomRepo = inject(RoomRepository);
  private router = inject(Router);

  public featuredRooms: Room[] = [];
  public todayStr = formatDateISO(new Date());
  public checkInDate = this.todayStr;
  public checkOutDate = formatDateISO(new Date(Date.now() + 24 * 60 * 60 * 1000));
  public adults = 2;

  ngOnInit(): void {
    this.roomRepo.getFeaturedRooms().subscribe(res => {
      this.featuredRooms = res.data;
    });
  }

  onSearch(): void {
    this.router.navigate(['/rooms'], {
      queryParams: {
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        adults: this.adults
      }
    });
  }

  onBookRoom(room: Room): void {
    this.router.navigate(['/booking', room.id], {
      queryParams: {
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        adults: this.adults
      }
    });
  }
}
