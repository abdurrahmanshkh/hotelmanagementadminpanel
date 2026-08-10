import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingRepository } from '../../../core/repositories/contracts/booking.repository';
import { ServiceRequestRepository } from '../../../core/repositories/contracts/service-request.repository';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { BookingCardComponent } from '../../../shared/components/booking-card/booking-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Booking, ServiceRequest } from '../../../core/models';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, BookingCardComponent, StatusBadgeComponent, ButtonComponent, IconComponent],
  template: `
    <div class="overview-page" *ngIf="authState.currentUser() as user">
      <div class="welcome-card">
        <div class="welcome-text">
          <h2>Welcome Back, {{ user.firstName }}!</h2>
          <p>Manage your luxury stay, digital key passcode, and on-demand room requests.</p>
        </div>
        <div class="welcome-actions flex-gap">
          <a routerLink="/rooms">
            <app-button variant="primary" icon="search">Book Another Room</app-button>
          </a>
        </div>
      </div>

      <!-- Active Stay Banner Card -->
      <div class="active-stay-card" *ngIf="activeBooking">
        <div class="card-header flex-gap">
          <app-icon name="key" [size]="20" color="#D97706"></app-icon>
          <h3>Active Reservation &bull; Room {{ activeBooking.room.roomNumber }}</h3>
          <span class="badge badge--success font-mono ml-auto">CHECKED IN</span>
        </div>
        <div class="card-body">
          <p>Your room door is ready for digital passcode unlock.</p>
          <div class="actions flex-gap mt-3">
            <a [routerLink]="['/account/bookings', activeBooking.id, 'passcode']">
              <app-button variant="primary" icon="key">
                View Digital Door Passcode
              </app-button>
            </a>
            <a [routerLink]="['/account/service-requests']">
              <app-button variant="outline" icon="sparkles">
                Request Room Service
              </app-button>
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Action Grid -->
      <div class="quick-grid">
        <a routerLink="/account/bookings" class="quick-card">
          <app-icon name="calendar" [size]="24" color="#D97706"></app-icon>
          <h4>My Reservations</h4>
          <p>View upcoming &amp; past stays</p>
        </a>
        <a routerLink="/account/service-requests" class="quick-card">
          <app-icon name="sparkles" [size]="24" color="#D97706"></app-icon>
          <h4>Service Requests</h4>
          <p>Towels, housekeeping &amp; dining</p>
        </a>
        <a routerLink="/account/chats" class="quick-card">
          <app-icon name="chat" [size]="24" color="#D97706"></app-icon>
          <h4>Concierge Chat</h4>
          <p>24/7 AI &amp; Front desk assistance</p>
        </a>
        <a routerLink="/account/profile" class="quick-card">
          <app-icon name="users" [size]="24" color="#D97706"></app-icon>
          <h4>Guest Profile</h4>
          <p>Update phone &amp; ID records</p>
        </a>
      </div>

      <!-- Recent Bookings -->
      <div class="section-box">
        <div class="box-header">
          <h3>Recent Reservations</h3>
          <a routerLink="/account/bookings" class="link">View All &rarr;</a>
        </div>
        <div class="bookings-list" *ngIf="recentBookings.length > 0">
          <app-booking-card *ngFor="let b of recentBookings" [booking]="b"></app-booking-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview-page { display: flex; flex-direction: column; gap: 1.5rem; }

    .welcome-card {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: #FFFFFF; border-radius: 16px; padding: 2rem;
      display: flex; align-items: center; justify-content: space-between;
      @media (max-width: 640px) { flex-direction: column; align-items: flex-start; gap: 1rem; }
      h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.25rem; }
      p { font-size: 0.875rem; color: #94A3B8; }
    }

    .active-stay-card {
      background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 16px; padding: 1.5rem;
      .card-header { h3 { font-size: 1.125rem; font-weight: 700; color: #B45309; } .ml-auto { margin-left: auto; } }
      .card-body { font-size: 0.875rem; color: #78350F; margin-top: 0.5rem; }
      .mt-3 { margin-top: 0.75rem; }
    }

    .quick-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;
      .quick-card {
        background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.25rem;
        display: flex; flex-direction: column; gap: 0.5rem; transition: transform 0.15s;
        &:hover { transform: translateY(-2px); border-color: #CBD5E1; }
        h4 { font-size: 0.9375rem; font-weight: 700; color: #0F172A; }
        p { font-size: 0.75rem; color: #64748B; }
      }
    }

    .section-box {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.5rem;
      .box-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; h3 { font-size: 1.125rem; font-weight: 700; color: #0F172A; } .link { font-size: 0.8125rem; font-weight: 700; color: #D97706; } }
      .bookings-list { display: flex; flex-direction: column; gap: 1rem; }
    }
  `]
})
export class AccountOverviewComponent implements OnInit {
  private bookingRepo = inject(BookingRepository);
  private serviceRepo = inject(ServiceRequestRepository);
  public authState = inject(AuthStateService);

  public activeBooking?: Booking;
  public recentBookings: Booking[] = [];
  public recentServiceRequests: ServiceRequest[] = [];

  ngOnInit(): void {
    this.bookingRepo.getMyBookings().subscribe(res => {
      this.recentBookings = res.data.items.slice(0, 3);
      this.activeBooking = res.data.items.find(b => b.status === 'CHECKED_IN' || b.status === 'CONFIRMED');
    });

    this.serviceRepo.getMyServiceRequests().subscribe(sRes => {
      this.recentServiceRequests = sRes.data.items.slice(0, 3);
    });
  }
}
