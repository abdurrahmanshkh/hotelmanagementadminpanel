import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingRepository } from '../../../core/repositories/contracts/booking.repository';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { BookingCardComponent } from '../../../shared/components/booking-card/booking-card.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { Booking } from '../../../core/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, BookingCardComponent, SkeletonLoaderComponent, EmptyStateComponent],
  template: `
    <div class="my-bookings-page">
      <div class="header-box">
        <h2 class="title font-serif">My Reservations</h2>
        <p class="sub">View and manage your current, upcoming, and past hotel stays.</p>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs flex-gap">
        <button
          *ngFor="let tab of tabs"
          type="button"
          [class]="'tab-btn ' + (activeTab === tab.id ? 'tab--active' : '')"
          (click)="filterTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading Skeletons -->
      <div *ngIf="isLoading" class="bookings-list">
        <app-skeleton-loader *ngFor="let i of [1, 2]" height="120px" borderRadius="12px"></app-skeleton-loader>
      </div>

      <!-- Empty State -->
      <app-empty-state
        *ngIf="!isLoading && filteredBookings.length === 0"
        icon="calendar"
        title="No Reservations Found"
        description="You have no stays matching the selected filter."
      ></app-empty-state>

      <!-- Bookings List -->
      <div *ngIf="!isLoading && filteredBookings.length > 0" class="bookings-list">
        <app-booking-card *ngFor="let b of filteredBookings" [booking]="b"></app-booking-card>
      </div>
    </div>
  `,
  styles: [`
    .my-bookings-page { display: flex; flex-direction: column; gap: 1.5rem; }

    .header-box {
      .title { font-size: 1.5rem; font-weight: 800; color: #0F172A; margin-bottom: 0.25rem; }
      .sub { font-size: 0.875rem; color: #64748B; }
    }

    .filter-tabs {
      display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem;
      .tab-btn {
        background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 9999px; padding: 0.375rem 0.875rem;
        font-size: 0.8125rem; font-weight: 600; color: #475569; cursor: pointer; white-space: nowrap;
        &.tab--active { background: #0F172A; color: #FFFFFF; border-color: #0F172A; }
      }
    }

    .bookings-list { display: flex; flex-direction: column; gap: 1rem; }
  `]
})
export class MyBookingsComponent implements OnInit {
  private bookingRepo = inject(BookingRepository);
  public authState = inject(AuthStateService);

  public allBookings: Booking[] = [];
  public filteredBookings: Booking[] = [];
  public isLoading = true;
  public activeTab = 'ALL';

  public tabs = [
    { id: 'ALL', label: 'All Stays' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'ACTIVE', label: 'Checked In' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' }
  ];

  ngOnInit(): void {
    this.bookingRepo.getMyBookings().subscribe({
      next: res => {
        this.isLoading = false;
        if (res?.data) {
          this.allBookings = Array.isArray(res.data) ? res.data : (res.data.items || []);
        } else {
          this.allBookings = [];
        }
        this.filterTab(this.activeTab);
      },
      error: () => {
        this.isLoading = false;
        this.allBookings = [];
        this.filteredBookings = [];
      }
    });
  }

  filterTab(tabId: string): void {
    this.activeTab = tabId;
    if (tabId === 'ALL') {
      this.filteredBookings = this.allBookings;
    } else if (tabId === 'ACTIVE') {
      this.filteredBookings = this.allBookings.filter(b => b.status === 'CHECKED_IN');
    } else if (tabId === 'UPCOMING') {
      this.filteredBookings = this.allBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING_PAYMENT');
    } else {
      this.filteredBookings = this.allBookings.filter(b => b.status === tabId);
    }
  }
}
