import { Component, inject, OnInit, OnDestroy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DashboardRepository } from '../../core/repositories/contracts';
import { ToastService } from '../../core/services/toast.service';
import { CurrencyFormatter } from '../../core/utilities/currency-formatter.utility';
import { DateFormatter } from '../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../shared/components/priority-badge/priority-badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ErrorFormatter } from '../../core/utilities/error-formatter.utility';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    MetricCardComponent,
    StatusBadgeComponent,
    PriorityBadgeComponent,
    ButtonComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    IconComponent
  ],
  template: `
    <div class="dashboard-page">
      <app-page-header
        title="Operational Dashboard"
        subtitle="Real-time hotel room status, revenue metrics & operational queues"
      >
        <div actions class="dashboard-header-actions">
          <span class="last-updated" *ngIf="lastUpdated">
            Updated: {{ lastUpdated }}
          </span>
          <app-button
            variant="outline"
            size="sm"
            [loading]="loading"
            (btnClick)="loadDashboardData(true)"
          >
            <app-icon name="refresh" [size]="14" className="mr-1"></app-icon> Refresh
          </app-button>
        </div>
      </app-page-header>

      <!-- Error State -->
      <app-error-state
        *ngIf="error"
        title="Failed to Load Dashboard"
        [message]="error"
        (retry)="loadDashboardData(true)"
      ></app-error-state>

      <!-- Skeleton Loaders -->
      <div *ngIf="loading && !summaryData" class="metrics-grid">
        <app-skeleton-loader *ngFor="let i of [1,2,3,4,5,6]" height="120px" borderRadius="12px"></app-skeleton-loader>
      </div>

      <!-- Main Dashboard Content -->
      <ng-container *ngIf="summaryData">
        <!-- Key Performance Indicator (KPI) Stat Cards -->
        <div class="metrics-grid">
          <app-metric-card
            title="Occupancy Rate"
            [value]="summaryData.occupancyPercentage + '%'"
            icon="building"
            [subtext]="summaryData.roomCounters['OCCUPIED'] + ' / ' + summaryData.roomCounters['TOTAL'] + ' Rooms Occupied'"
            variant="accent"
          ></app-metric-card>

          <app-metric-card
            title="Today's Revenue"
            [value]="formatCurrency(summaryData.todayRevenue)"
            icon="card"
            subtext="Real-time payments ledger sum"
            variant="success"
          ></app-metric-card>

          <app-metric-card
            title="Available Rooms"
            [value]="summaryData.roomCounters['AVAILABLE'] || 0"
            icon="door"
            subtext="Ready for instant check-in"
            variant="info"
          ></app-metric-card>

          <app-metric-card
            title="Under Cleaning"
            [value]="summaryData.roomCounters['UNDER_CLEANING'] || 0"
            icon="sparkles"
            subtext="Housekeeping queue"
            variant="warning"
          ></app-metric-card>

          <app-metric-card
            title="Maintenance Flags"
            [value]="summaryData.roomCounters['MAINTENANCE'] || 0"
            icon="wrench"
            subtext="Blocked facility repairs"
            variant="danger"
          ></app-metric-card>

          <app-metric-card
            title="Waiting Chats"
            [value]="summaryData.waitingChats.length || 0"
            icon="chat"
            subtext="Guest escalation inbox"
            [variant]="summaryData.waitingChats.length > 0 ? 'warning' : 'default'"
          ></app-metric-card>
        </div>

        <!-- Quick Actions Toolbar -->
        <div class="quick-actions-bar card">
          <h3 class="quick-actions-bar__title flex-gap">
            <app-icon name="sparkles" [size]="16" color="#D97706"></app-icon>
            <span>Quick Operational Actions</span>
          </h3>
          <div class="quick-actions-bar__buttons">
            <button class="btn-action" (click)="navigate('/admin/bookings')">
              <app-icon name="search" [size]="14"></app-icon> Search Bookings
            </button>
            <button class="btn-action" (click)="navigate('/admin/bookings?status=CONFIRMED')">
              <app-icon name="log-in" [size]="14" color="#047857"></app-icon> Check-In Guest
            </button>
            <button class="btn-action" (click)="navigate('/admin/bookings?status=CHECKED_IN')">
              <app-icon name="log-out" [size]="14" color="#B45309"></app-icon> Checkout Guest
            </button>
            <button class="btn-action" (click)="navigate('/admin/service-requests/board')">
              <app-icon name="sparkles" [size]="14" color="#0369A1"></app-icon> Service Kanban
            </button>
            <button class="btn-action" (click)="navigate('/admin/chats')">
              <app-icon name="chat" [size]="14" color="#D97706"></app-icon> Chat Inbox
            </button>
            <button class="btn-action" (click)="navigate('/admin/guests')">
              <app-icon name="users" [size]="14"></app-icon> Guest Directory
            </button>
          </div>
        </div>

        <!-- Operational Queues Grid -->
        <div class="queues-grid">
          <!-- Today's Arrivals Queue -->
          <div class="card queue-card">
            <div class="queue-card__header flex-between">
              <div class="header-left flex-gap">
                <app-icon name="log-in" [size]="18" color="#0369A1"></app-icon>
                <h3 class="queue-card__title">Today's Arrivals (Check-Ins)</h3>
              </div>
              <span class="queue-card__count badge badge--info font-mono">{{ summaryData.arrivals.length }}</span>
            </div>

            <div *ngIf="summaryData.arrivals.length === 0">
              <app-empty-state icon="check" title="No Pending Check-Ins" description="All expected guests for today have checked in or no arrivals scheduled."></app-empty-state>
            </div>

            <div *ngIf="summaryData.arrivals.length > 0" class="queue-list">
              <div *ngFor="let booking of summaryData.arrivals" class="queue-item flex-between">
                <div class="queue-item__info">
                  <span class="queue-item__ref font-mono">{{ booking.bookingReference }}</span>
                  <strong class="queue-item__name">{{ booking.guestName }}</strong>
                  <span class="queue-item__meta">{{ booking.roomTypeName }} (Room {{ booking.roomNumber }})</span>
                </div>
                <div class="queue-item__action">
                  <app-status-badge [status]="booking.status"></app-status-badge>
                  <button class="btn-link" (click)="processCheckIn(booking)">
                    <span>Process Check-In</span>
                    <app-icon name="arrow-right" [size]="12"></app-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Today's Departures Queue -->
          <div class="card queue-card">
            <div class="queue-card__header flex-between">
              <div class="header-left flex-gap">
                <app-icon name="log-out" [size]="18" color="#B45309"></app-icon>
                <h3 class="queue-card__title">Today's Departures (Checkouts)</h3>
              </div>
              <span class="queue-card__count badge badge--neutral font-mono">{{ summaryData.departures.length }}</span>
            </div>

            <div *ngIf="summaryData.departures.length === 0">
              <app-empty-state icon="door" title="No Pending Checkouts" description="No guests scheduled for checkout today."></app-empty-state>
            </div>

            <div *ngIf="summaryData.departures.length > 0" class="queue-list">
              <div *ngFor="let booking of summaryData.departures" class="queue-item flex-between">
                <div class="queue-item__info">
                  <span class="queue-item__ref font-mono">{{ booking.bookingReference }}</span>
                  <strong class="queue-item__name">{{ booking.guestName }}</strong>
                  <span class="queue-item__meta">Room {{ booking.roomNumber }}</span>
                </div>
                <div class="queue-item__action">
                  <app-status-badge [status]="booking.status"></app-status-badge>
                  <button class="btn-link" (click)="processCheckout(booking)">
                    <span>Process Checkout</span>
                    <app-icon name="arrow-right" [size]="12"></app-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Urgent Service Requests -->
          <div class="card queue-card">
            <div class="queue-card__header flex-between">
              <div class="header-left flex-gap">
                <app-icon name="sparkles" [size]="18" color="#B45309"></app-icon>
                <h3 class="queue-card__title">Urgent Service Requests</h3>
              </div>
              <span class="queue-card__count badge badge--warning font-mono">{{ summaryData.urgentServiceRequests.length }}</span>
            </div>

            <div *ngIf="summaryData.urgentServiceRequests.length === 0">
              <app-empty-state icon="check" title="All Services Clear" description="No urgent or high priority service requests outstanding."></app-empty-state>
            </div>

            <div *ngIf="summaryData.urgentServiceRequests.length > 0" class="queue-list">
              <div *ngFor="let req of summaryData.urgentServiceRequests" class="queue-item flex-between">
                <div class="queue-item__info">
                  <div class="queue-item__tags">
                    <app-priority-badge [priority]="req.priority"></app-priority-badge>
                    <span class="queue-item__category">{{ req.category }}</span>
                  </div>
                  <strong class="queue-item__name">{{ req.title }}</strong>
                  <span class="queue-item__meta">Room {{ req.roomNumber }} • {{ req.guestName }}</span>
                </div>
                <div class="queue-item__action">
                  <app-status-badge [status]="req.status"></app-status-badge>
                  <button class="btn-link" (click)="navigate('/admin/service-requests/' + req.id)">
                    <span>View Request</span>
                    <app-icon name="arrow-right" [size]="12"></app-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Waiting Front-Desk Chats -->
          <div class="card queue-card">
            <div class="queue-card__header flex-between">
              <div class="header-left flex-gap">
                <app-icon name="chat" [size]="18" color="#BE123C"></app-icon>
                <h3 class="queue-card__title">Waiting Guest Chats</h3>
              </div>
              <span class="queue-card__count badge badge--danger font-mono">{{ summaryData.waitingChats.length }}</span>
            </div>

            <div *ngIf="summaryData.waitingChats.length === 0">
              <app-empty-state icon="chat" title="No Waiting Chats" description="All customer chat escalations have been answered or assigned."></app-empty-state>
            </div>

            <div *ngIf="summaryData.waitingChats.length > 0" class="queue-list">
              <div *ngFor="let chat of summaryData.waitingChats" class="queue-item flex-between">
                <div class="queue-item__info">
                  <strong class="queue-item__name">{{ chat.guestName }} (Room {{ chat.roomNumber || 'N/A' }})</strong>
                  <p class="queue-item__snippet">"{{ chat.lastMessageText }}"</p>
                </div>
                <div class="queue-item__action">
                  <button class="btn-link" (click)="navigate('/admin/chats/' + chat.id)">
                    <span>Open Chat</span>
                    <app-icon name="arrow-right" [size]="12"></app-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .dashboard-header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .last-updated {
        font-size: 0.75rem;
        color: #64748B;
      }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1.25rem;
    }

    .quick-actions-bar {
      padding: 1.25rem;

      &__title {
        font-size: 0.9375rem;
        font-weight: 700;
        color: #0F172A;
        margin-bottom: 0.875rem;
      }

      &__buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .btn-action {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: #F8FAFC;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        font-size: 0.8125rem;
        font-weight: 600;
        color: #334155;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
          background-color: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }
      }
    }

    .queues-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;

      @media (max-width: 1023px) {
        grid-template-columns: 1fr;
      }
    }

    .queue-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;

      &__header {
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #E2E8F0;
      }

      &__title {
        font-size: 0.9375rem;
        font-weight: 700;
        color: #0F172A;
      }
    }

    .queue-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .queue-item {
      padding: 0.875rem;
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      gap: 1rem;
      transition: all 0.15s ease-in-out;

      &:hover {
        border-color: #CBD5E1;
        background-color: #FFFFFF;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      }

      &__info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      &__ref {
        font-size: 0.75rem;
        font-weight: 700;
        color: #D97706;
      }

      &__name {
        font-size: 0.875rem;
        color: #0F172A;
      }

      &__meta {
        font-size: 0.75rem;
        color: #64748B;
      }

      &__tags {
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }

      &__category {
        font-size: 0.7rem;
        font-weight: 600;
        color: #475569;
      }

      &__snippet {
        font-size: 0.8125rem;
        color: #475569;
        font-style: italic;

        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      &__action {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
      }

      .btn-link {
        background: none;
        border: none;
        font-size: 0.75rem;
        font-weight: 600;
        color: #0369A1;
        cursor: pointer;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;

        &:hover {
          text-decoration: underline;
          color: #0F172A;
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dashboardRepo = inject(DashboardRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  public summaryData: any = null;
  public loading = false;
  public error: string | null = null;
  public lastUpdated: string | null = null;

  private refreshSubscription?: Subscription;

  ngOnInit(): void {
    this.refreshSubscription = timer(0, 30000).pipe(
      switchMap(() => this.dashboardRepo.getSummary()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.summaryData = res.data;
          this.error = null;
          this.lastUpdated = DateFormatter.formatTime(new Date().toISOString());
        }
      },
      error: (err) => {
        this.error = ErrorFormatter.format(err, 'Failed to fetch dashboard operational summary.');
      }
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  public loadDashboardData(showToast = false): void {
    this.loading = true;
    this.dashboardRepo.getSummary().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.summaryData = res.data;
          this.error = null;
          this.lastUpdated = DateFormatter.formatTime(new Date().toISOString());
          if (showToast) {
            this.toastService.info('Dashboard metrics updated.', 'Refreshed');
          }
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = ErrorFormatter.format(err, 'Failed to refresh dashboard metrics.');
      }
    });
  }

  public processCheckIn(booking: any): void {
    this.router.navigate(['/admin/bookings'], {
      queryParams: { status: 'CONFIRMED', action: 'checkin', bookingId: booking.id }
    });
  }

  public processCheckout(booking: any): void {
    this.router.navigate(['/admin/bookings'], {
      queryParams: { status: 'CHECKED_IN', action: 'checkout', bookingId: booking.id }
    });
  }

  public formatCurrency(amount: number): string {
    return CurrencyFormatter.format(amount);
  }

  public navigate(path: string): void {
    this.router.navigateByUrl(path);
  }
}
