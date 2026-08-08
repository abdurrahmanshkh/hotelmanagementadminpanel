import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { GuestRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { CurrencyFormatter } from '../../../core/utilities/currency-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { GuestDetails, BookingSummary } from '../../../core/models';

@Component({
  selector: 'app-guest-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    ButtonComponent,
    SkeletonLoaderComponent
  ],
  template: `
    <div class="guest-detail-page">
      <app-page-header
        [title]="guest ? 'Guest Profile - ' + guest.fullName : 'Loading Profile...'"
        subtitle="Contact details, masked identity verification & complete stay history"
      >
        <div actions class="header-actions" *ngIf="guest">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Back to Directory</app-button>
          <app-button
            [variant]="guest.accountStatus === 'ACTIVE' ? 'danger' : 'accent'"
            size="sm"
            (btnClick)="toggleAccountStatus()"
          >
            {{ guest.accountStatus === 'ACTIVE' ? '🚫 Suspend Account' : '✅ Activate Account' }}
          </app-button>
        </div>
      </app-page-header>

      <app-skeleton-loader *ngIf="loading" height="350px"></app-skeleton-loader>

      <div *ngIf="guest && !loading" class="detail-grid">
        <!-- Guest Profile Info -->
        <div class="card profile-card">
          <div class="profile-header flex-between">
            <div class="guest-identity">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" class="large-avatar" />
              <div>
                <h2 class="guest-title">{{ guest.fullName }}</h2>
                <span class="badge" [class.badge--success]="guest.accountStatus === 'ACTIVE'" [class.badge--danger]="guest.accountStatus !== 'ACTIVE'">
                  {{ guest.accountStatus }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-list">
            <div class="info-row">
              <span class="label">Email Address:</span>
              <strong>{{ guest.email }}</strong>
            </div>
            <div class="info-row">
              <span class="label">Phone Number:</span>
              <strong>{{ guest.phone || '+91 98765 43210' }}</strong>
            </div>
            <div class="info-row">
              <span class="label">Identity Document (Masked):</span>
              <span class="masked-id">{{ guest.maskedIdType || 'Aadhaar' }}: {{ guest.maskedIdNumber || 'XXXXXX4892' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Total Lifetime Stays:</span>
              <strong>{{ stayHistory.length }} Reservations</strong>
            </div>
            <div class="info-row">
              <span class="label">Account Created:</span>
              <span>{{ formatDate(guest.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Stay History Table -->
        <div class="card history-card">
          <h3 class="card-title">Stay History & Reservations</h3>

          <div *ngIf="stayHistory.length === 0" class="empty-history">
            No past reservations found for this guest profile.
          </div>

          <table *ngIf="stayHistory.length > 0" class="history-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of stayHistory">
                <td>
                  <strong class="ref-link" [routerLink]="['/admin/bookings', item.id]">{{ item.bookingReference }}</strong>
                </td>
                <td>Room {{ item.roomNumber }}</td>
                <td>{{ formatDate(item.checkInDate) }} - {{ formatDate(item.checkOutDate) }}</td>
                <td><strong>{{ formatCurrency(item.totalAmount) }}</strong></td>
                <td>
                  <app-status-badge [status]="item.status"></app-status-badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .guest-detail-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .detail-grid { display: grid; grid-template-columns: 360px 1fr; gap: 1.5rem; @media (max-width: 1023px) { grid-template-columns: 1fr; } }
    .profile-card, .history-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .profile-header { padding-bottom: 1rem; border-bottom: 1px solid #E5E7EB; }
    .guest-identity { display: flex; align-items: center; gap: 1rem; }
    .large-avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #C99B4A; }
    .guest-title { font-size: 1.25rem; font-weight: 700; color: #11243E; margin-bottom: 0.25rem; }
    .info-list { display: flex; flex-direction: column; gap: 0.875rem; font-size: 0.875rem; }
    .info-row { display: flex; justify-content: space-between; color: #4B5563; }
    .label { color: #6B7280; font-weight: 500; }
    .masked-id { font-family: monospace; font-weight: 600; background: #F3F4F6; padding: 0.125rem 0.375rem; border-radius: 4px; color: #374151; }
    .card-title { font-size: 1.125rem; font-weight: 700; color: #11243E; margin-bottom: 0.75rem; }
    .history-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; th { background: #F9FAFB; padding: 0.625rem 0.75rem; text-align: left; border-bottom: 1px solid #E5E7EB; color: #374151; } td { padding: 0.75rem; border-bottom: 1px solid #F3F4F6; } }
    .ref-link { color: #2563EB; cursor: pointer; &:hover { text-decoration: underline; } }
    .empty-history { padding: 2rem; text-align: center; color: #6B7280; font-size: 0.875rem; }
  `]
})
export class GuestDetailComponent implements OnInit {
  private guestRepo = inject(GuestRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public guest: GuestDetails | null = null;
  public stayHistory: BookingSummary[] = [];
  public loading = true;

  ngOnInit(): void {
    const guestId = Number(this.route.snapshot.paramMap.get('guestId'));
    if (guestId) {
      this.guestRepo.getGuestById(guestId).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.guest = res.data;
            this.loadStayHistory(guestId);
          }
        },
        error: (err: Error) => {
          this.loading = false;
          this.toastService.error(err.message || 'Failed to load guest profile');
        }
      });
    }
  }

  loadStayHistory(guestId: number): void {
    this.guestRepo.getGuestBookings(guestId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.stayHistory = res.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleAccountStatus(): void {
    if (!this.guest) return;
    const newStatus: 'ACTIVE' | 'SUSPENDED' = this.guest.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.guest.accountStatus = newStatus;
    this.toastService.success(`Guest account status set to ${newStatus}.`, 'Status Updated');
  }

  goBack(): void {
    this.router.navigate(['/admin/guests']);
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }

  formatCurrency(amt: number): string {
    return CurrencyFormatter.format(amt);
  }
}
