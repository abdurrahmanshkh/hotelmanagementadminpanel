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
import { BookingSummary, ServiceRequest, ChatThread } from '../../core/models';
import { APP_ROUTES } from '../../core/constants';

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
    ErrorStateComponent
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
            🔄 Refresh
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
        <app-skeleton-loader *ngFor="let i of [1,2,3,4,5,6]" height="110px" borderRadius="8px"></app-skeleton-loader>
      </div>

      <!-- Main Dashboard Content -->
      <ng-container *ngIf="summaryData">
        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <app-metric-card
            title="Occupancy Rate"
            [value]="summaryData.occupancyPercentage + '%'"
            icon="🏩"
            [subtext]="summaryData.roomCounters['OCCUPIED'] + ' / ' + summaryData.roomCounters['TOTAL'] + ' Rooms Occupied'"
            variant="accent"
          ></app-metric-card>

          <app-metric-card
            title="Today's Revenue"
            [value]="formatCurrency(summaryData.todayRevenue)"
            icon="💰"
            subtext="Real-time payments ledger sum"
            variant="success"
          ></app-metric-card>

          <app-metric-card
            title="Available Rooms"
            [value]="summaryData.roomCounters['AVAILABLE'] || 0"
            icon="🔑"
            subtext="Ready for instant check-in"
            variant="info"
          ></app-metric-card>

          <app-metric-card
            title="Under Cleaning"
            [value]="summaryData.roomCounters['UNDER_CLEANING'] || 0"
            icon="🧹"
            subtext="Housekeeping queue"
            variant="warning"
          ></app-metric-card>

          <app-metric-card
            title="Maintenance Flags"
            [value]="summaryData.roomCounters['MAINTENANCE'] || 0"
            icon="🔧"
            subtext="Blocked facility repairs"
            variant="danger"
          ></app-metric-card>

          <app-metric-card
            title="Waiting Chats"
            [value]="summaryData.waitingChats.length || 0"
            icon="💬"
            subtext="Guest escalation inbox"
            [variant]="summaryData.waitingChats.length > 0 ? 'warning' : 'default'"
          ></app-metric-card>
        </div>

        <!-- Quick Actions Toolbar -->
        <div class="quick-actions-bar card">
          <h3 class="quick-actions-bar__title">Quick Actions</h3>
          <div class="quick-actions-bar__buttons">
            <button class="btn-action" (click)="navigate('/admin/bookings')">🔍 Search Bookings</button>
            <button class="btn-action" (click)="navigate('/admin/bookings')">📥 Check-In Guest</button>
            <button class="btn-action" (click)="navigate('/admin/bookings')">📤 Checkout Guest</button>
            <button class="btn-action" (click)="navigate('/admin/service-requests/board')">📋 Service Kanban</button>
            <button class="btn-action" (click)="navigate('/admin/chats')">💬 Chat Inbox</button>
            <button class="btn-action" (click)="navigate('/admin/guests')">👥 Guest Directory</button>
          </div>
        </div>

        <!-- Operational Queues Grid -->
        <div class="queues-grid">
          <!-- Today's Arrivals Queue -->
          <div class="card queue-card">
            <div class="queue-card__header">
              <h3 class="queue-card__title">Today's Arrivals (Check-Ins)</h3>
              <span class="queue-card__count badge badge--info">{{ summaryData.arrivals.length }}</span>
            </div>

            <div *ngIf="summaryData.arrivals.length === 0">
              <app-empty-state icon="🧳" title="No Pending Check-Ins" description="All expected guests for today have checked in or no arrivals scheduled."></app-empty-state>
            </div>

            <div *ngIf="summaryData.arrivals.length > 0" class="queue-list">
              <div *ngFor="let booking of summaryData.arrivals" class="queue-item flex-between">
                <div class="queue-item__info">
                  <span class="queue-item__ref">{{ booking.bookingReference }}</span>
                  <strong class="queue-item__name">{{ booking.guestName }}</strong>
                  <span class="queue-item__meta">{{ booking.roomTypeName }} ({{ booking.roomNumber }})</span>
                </div>
                <div class="queue-item__action">
                  <app-status-badge [status]="booking.status"></app-status-badge>
                  <button class="btn-link" (click)="navigate('/admin/bookings/' + booking.id)">Process Check-In →</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Today's Departures Queue -->
          <div class="card queue-card">
            <div class="queue-card__header">
              <h3 class="queue-card__title">Today's Departures (Checkouts)</h3>
              <span class="queue-card__count badge badge--neutral">{{ summaryData.departures.length }}</span>
            </div>

            <div *ngIf="summaryData.departures.length === 0">
              <app-empty-state icon="🗝️" title="No Pending Checkouts" description="No guests scheduled for checkout today."></app-empty-state>
            </div>

            <div *ngIf="summaryData.departures.length > 0" class="queue-list">
              <div *ngFor="let booking of summaryData.departures" class="queue-item flex-between">
                <div class="queue-item__info">
                  <span class="queue-item__ref">{{ booking.bookingReference }}</span>
                  <strong class="queue-item__name">{{ booking.guestName }}</strong>
                  <span class="queue-item__meta">Room {{ booking.roomNumber }}</span>
                </div>
                <div class="queue-item__action">
                  <app-status-badge [status]="booking.status"></app-status-badge>
                  <button class="btn-link" (click)="navigate('/admin/bookings/' + booking.id)">Process Checkout →</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Urgent Service Requests -->
          <div class="card queue-card">
            <div class="queue-card__header">
              <h3 class="queue-card__title">Urgent Service Requests</h3>
              <span class="queue-card__count badge badge--warning">{{ summaryData.urgentServiceRequests.length }}</span>
            </div>

            <div *ngIf="summaryData.urgentServiceRequests.length === 0">
              <app-empty-state icon="✅" title="All Services Clear" description="No urgent or high priority service requests outstanding."></app-empty-state>
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
                  <button class="btn-link" (click)="navigate('/admin/service-requests/' + req.id)">View Request →</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Waiting Front-Desk Chats -->
          <div class="card queue-card">
            <div class="queue-card__header">
              <h3 class="queue-card__title">Waiting Guest Chats</h3>
              <span class="queue-card__count badge badge--danger">{{ summaryData.waitingChats.length }}</span>
            </div>

            <div *ngIf="summaryData.waitingChats.length === 0">
              <app-empty-state icon="💬" title="No Waiting Chats" description="All customer chat escalations have been answered or assigned."></app-empty-state>
            </div>

            <div *ngIf="summaryData.waitingChats.length > 0" class="queue-list">
              <div *ngFor="let chat of summaryData.waitingChats" class="queue-item flex-between">
                <div class="queue-item__info">
                  <strong class="queue-item__name">{{ chat.guestName }} (Room {{ chat.roomNumber || 'N/A' }})</strong>
                  <p class="queue-item__snippet">"{{ chat.lastMessageText }}"</p>
                </div>
                <div class="queue-item__action">
                  <button class="btn-link" (click)="navigate('/admin/chats/' + chat.id)">Open Chat →</button>
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
        color: #6B7280;
      }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .quick-actions-bar {
      padding: 1.25rem;

      &__title {
        font-size: 0.9375rem;
        font-weight: 700;
        color: #11243E;
        margin-bottom: 0.875rem;
      }

      &__buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .btn-action {
        padding: 0.5rem 1rem;
        background-color: #F3F4F6;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        font-size: 0.8125rem;
        font-weight: 600;
        color: #1F2937;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
          background-color: #11243E;
          color: #FFFFFF;
          border-color: #11243E;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #E5E7EB;
      }

      &__title {
        font-size: 1rem;
        font-weight: 700;
        color: #11243E;
      }
    }

    .queue-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .queue-item {
      padding: 0.875rem;
      background-color: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      gap: 1rem;

      &__info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      &__ref {
        font-size: 0.75rem;
        font-weight: 700;
        color: #C99B4A;
      }

      &__name {
        font-size: 0.875rem;
        color: #11243E;
      }

      &__meta {
        font-size: 0.75rem;
        color: #6B7280;
      }

      &__tags {
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }

      &__category {
        font-size: 0.7rem;
        font-weight: 600;
        color: #4B5563;
      }

      &__snippet {
        font-size: 0.8125rem;
        color: #4B5563;
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
        color: #2563EB;
        cursor: pointer;
        white-space: nowrap;

        &:hover {
          text-decoration: underline;
          color: #11243E;
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
    // 30-second auto refresh stream
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
        this.error = err.message || 'Failed to fetch dashboard operational summary.';
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
        this.error = err.message || 'Failed to refresh dashboard metrics.';
      }
    });
  }

  public formatCurrency(amount: number): string {
    return CurrencyFormatter.format(amount);
  }

  public navigate(path: string): void {
    this.router.navigateByUrl(path);
  }
}
