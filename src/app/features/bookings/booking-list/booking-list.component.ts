import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatter } from '../../../core/utilities/currency-formatter.utility';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { ErrorFormatter } from '../../../core/utilities/error-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckInDialogComponent } from '../check-in-dialog/check-in-dialog.component';
import { CheckOutDialogComponent } from '../check-out-dialog/check-out-dialog.component';
import { CancellationDialogComponent } from '../cancellation-dialog/cancellation-dialog.component';
import { BookingSummary, BookingStatus, PaymentStatus } from '../../../core/models';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PageHeaderComponent,
    SearchInputComponent,
    FilterDrawerComponent,
    DataTableComponent,
    PaginationComponent,
    StatusBadgeComponent,
    ButtonComponent,
    CheckInDialogComponent,
    CheckOutDialogComponent,
    CancellationDialogComponent
  ],
  template: `
    <div class="booking-list-page">
      <app-page-header title="Booking Management" subtitle="Search, filter, check in/out, and manage guest reservations">
        <div actions class="header-actions">
          <app-button variant="outline" size="md" (btnClick)="isFilterDrawerOpen = true">
            🌪️ Filters {{ activeFilterCount > 0 ? '(' + activeFilterCount + ')' : '' }}
          </app-button>
        </div>
      </app-page-header>

      <!-- Search & Quick Filters Bar -->
      <div class="toolbar card">
        <app-search-input
          [value]="searchQuery"
          placeholder="Search by reference or guest name..."
          (search)="onSearch($event)"
        ></app-search-input>

        <div class="status-pills">
          <button
            class="pill"
            [class.pill--active]="selectedStatus === 'ALL'"
            (click)="selectStatusFilter('ALL')"
          >
            All Bookings
          </button>
          <button
            class="pill"
            [class.pill--active]="selectedStatus === 'CONFIRMED'"
            (click)="selectStatusFilter('CONFIRMED')"
          >
            Confirmed
          </button>
          <button
            class="pill"
            [class.pill--active]="selectedStatus === 'CHECKED_IN'"
            (click)="selectStatusFilter('CHECKED_IN')"
          >
            Checked In
          </button>
          <button
            class="pill"
            [class.pill--active]="selectedStatus === 'COMPLETED'"
            (click)="selectStatusFilter('COMPLETED')"
          >
            Completed
          </button>
          <button
            class="pill"
            [class.pill--active]="selectedStatus === 'CANCELLED'"
            (click)="selectStatusFilter('CANCELLED')"
          >
            Cancelled
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <app-data-table
        [isEmpty]="bookings.length === 0"
        [loading]="loading"
        [colspan]="9"
        emptyMessage="No reservations match the specified filter criteria."
      >
        <ng-container headers>
          <th>Booking Ref</th>
          <th>Guest Name</th>
          <th>Room</th>
          <th>Check-In</th>
          <th>Check-Out</th>
          <th>Guests</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </ng-container>

        <ng-container rows>
          <tr *ngFor="let item of bookings">
            <td>
              <strong class="ref-link" (click)="viewDetails(item.id)">{{ item.bookingReference }}</strong>
            </td>
            <td>
              <div class="guest-cell">
                <span class="guest-name">{{ item.guestName }}</span>
              </div>
            </td>
            <td>
              <strong>{{ item.roomNumber }}</strong>
              <div class="sub-text">{{ item.roomTypeName }}</div>
            </td>
            <td>{{ formatDate(item.checkInDate) }}</td>
            <td>{{ formatDate(item.checkOutDate) }}</td>
            <td>{{ item.guestCount }}</td>
            <td><strong>{{ formatCurrency(item.totalAmount) }}</strong></td>
            <td>
              <app-status-badge [status]="item.status"></app-status-badge>
            </td>
            <td>
              <div class="action-buttons">
                <button
                  *ngIf="item.status === 'CONFIRMED'"
                  class="btn-action btn-action--checkin"
                  (click)="openCheckIn(item)"
                >
                  Check In
                </button>
                <button
                  *ngIf="item.status === 'CHECKED_IN'"
                  class="btn-action btn-action--checkout"
                  (click)="openCheckOut(item)"
                >
                  Check Out
                </button>
                <button
                  *ngIf="item.status === 'CONFIRMED' || item.status === 'PENDING_PAYMENT'"
                  class="btn-action btn-action--danger"
                  (click)="openCancel(item)"
                >
                  Cancel
                </button>
                <button class="btn-action btn-action--details" (click)="viewDetails(item.id)">
                  Details
                </button>
              </div>
            </td>
          </tr>
        </ng-container>
      </app-data-table>

      <!-- Pagination -->
      <app-pagination
        [currentPage]="page"
        [totalPages]="totalPages"
        [totalItems]="totalElements"
        [pageSize]="pageSize"
        (pageChange)="onPageChange($event)"
      ></app-pagination>

      <!-- Filter Drawer -->
      <app-filter-drawer
        [(isOpen)]="isFilterDrawerOpen"
        title="Filter Reservations"
        (apply)="applyDrawerFilters()"
        (reset)="resetDrawerFilters()"
      >
        <div class="filter-form">
          <div class="form-group">
            <label>Payment Status</label>
            <select [(ngModel)]="filterPaymentStatus" class="form-control">
              <option value="ALL">All Payment Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PENDING">PENDING</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>

          <div class="form-group">
            <label>Room Number</label>
            <input type="text" [(ngModel)]="filterRoomNumber" placeholder="e.g. 101" class="form-control" />
          </div>
        </div>
      </app-filter-drawer>

      <!-- Dialog Components -->
      <app-check-in-dialog
        [isOpen]="isCheckInOpen"
        [booking]="selectedBooking"
        [loading]="actionLoading"
        (close)="isCheckInOpen = false"
        (submitCheckIn)="handleCheckIn($event)"
      ></app-check-in-dialog>

      <app-check-out-dialog
        [isOpen]="isCheckOutOpen"
        [booking]="selectedBooking"
        [loading]="actionLoading"
        (close)="isCheckOutOpen = false"
        (submitCheckOut)="handleCheckOut($event)"
      ></app-check-out-dialog>

      <app-cancellation-dialog
        [isOpen]="isCancelOpen"
        [booking]="selectedBooking"
        [loading]="actionLoading"
        (close)="isCancelOpen = false"
        (submitCancel)="handleCancel($event)"
      ></app-cancellation-dialog>
    </div>
  `,
  styles: [`
    .booking-list-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; }
    .status-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .pill {
      padding: 0.375rem 0.75rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 9999px;
      font-size: 0.8125rem; font-weight: 500; color: #4B5563; cursor: pointer;
      &--active { background: #11243E; color: #FFF; border-color: #11243E; font-weight: 600; }
    }
    .ref-link { color: #2563EB; cursor: pointer; &:hover { text-decoration: underline; } }
    .guest-name { font-weight: 600; color: #11243E; }
    .sub-text { font-size: 0.75rem; color: #6B7280; }
    .action-buttons { display: flex; gap: 0.375rem; flex-wrap: wrap; }
    .btn-action {
      padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid transparent;
      &--checkin { background: #E6F4EA; color: #16803C; border-color: #A7F3D0; }
      &--checkout { background: #FEF3D6; color: #B76E00; border-color: #FDE68A; }
      &--danger { background: #FCE8E6; color: #C62828; border-color: #FECACA; }
      &--details { background: #F3F4F6; color: #374151; border-color: #D1D5DB; }
    }
    .filter-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; label { font-size: 0.8125rem; font-weight: 600; color: #374151; } }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
  `]
})
export class BookingListComponent implements OnInit {
  private bookingRepo = inject(BookingRepository);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  public bookings: BookingSummary[] = [];
  public loading = false;
  public page = 1;
  public pageSize = 10;
  public totalPages = 1;
  public totalElements = 0;

  public searchQuery = '';
  public selectedStatus = 'ALL';
  public filterPaymentStatus = 'ALL';
  public filterRoomNumber = '';

  public isFilterDrawerOpen = false;
  public activeFilterCount = 0;

  public isCheckInOpen = false;
  public isCheckOutOpen = false;
  public isCancelOpen = false;
  public selectedBooking: BookingSummary | null = null;
  public actionLoading = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['status']) this.selectedStatus = params['status'];
      if (params['q']) this.searchQuery = params['q'];
      if (params['page']) this.page = +params['page'];
      this.loadBookings(params['action'], params['bookingId']);
    });
  }

  loadBookings(action?: string, targetBookingId?: string): void {
    this.loading = true;
    const filterParams: any = {
      page: this.page - 1,
      size: this.pageSize
    };

    if (this.selectedStatus !== 'ALL') filterParams.status = this.selectedStatus as BookingStatus;
    if (this.filterPaymentStatus !== 'ALL') filterParams.paymentStatus = this.filterPaymentStatus as PaymentStatus;
    if (this.searchQuery) filterParams.guestQuery = this.searchQuery;
    if (this.filterRoomNumber) filterParams.roomNumber = this.filterRoomNumber;

    this.bookingRepo.getBookings(filterParams).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.bookings = res.data.items;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalItems;

          if (action && targetBookingId) {
            const bId = Number(targetBookingId);
            const found = this.bookings.find(b => b.id === bId);
            if (found) {
              if (action === 'checkin') this.openCheckIn(found);
              else if (action === 'checkout') this.openCheckOut(found);
            }
          }
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(ErrorFormatter.format(err, 'Failed to load bookings'));
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.page = 1;
    this.updateQueryParams();
  }

  selectStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.page = 1;
    this.updateQueryParams();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updateQueryParams();
  }

  applyDrawerFilters(): void {
    this.activeFilterCount = (this.filterPaymentStatus !== 'ALL' ? 1 : 0) + (this.filterRoomNumber ? 1 : 0);
    this.page = 1;
    this.loadBookings();
  }

  resetDrawerFilters(): void {
    this.filterPaymentStatus = 'ALL';
    this.filterRoomNumber = '';
    this.activeFilterCount = 0;
    this.page = 1;
    this.loadBookings();
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: this.selectedStatus !== 'ALL' ? this.selectedStatus : null,
        q: this.searchQuery || null,
        page: this.page > 1 ? this.page : null
      },
      queryParamsHandling: 'merge'
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/bookings', id]);
  }

  openCheckIn(booking: BookingSummary): void {
    this.selectedBooking = booking;
    this.isCheckInOpen = true;
  }

  openCheckOut(booking: BookingSummary): void {
    this.selectedBooking = booking;
    this.isCheckOutOpen = true;
  }

  openCancel(booking: BookingSummary): void {
    this.selectedBooking = booking;
    this.isCancelOpen = true;
  }

  handleCheckIn(formData: any): void {
    if (!this.selectedBooking) return;
    this.actionLoading = true;
    this.bookingRepo.checkIn(this.selectedBooking.id, formData).subscribe({
      next: (res) => {
        this.actionLoading = false;
        this.isCheckInOpen = false;
        this.toastService.success(`Passcode generated: ${res.data?.passcode || '849201'}`, 'Check-In Complete');
        this.loadBookings();
      },
      error: (err: Error) => {
        this.actionLoading = false;
        this.toastService.error(ErrorFormatter.format(err, 'Check-in failed'));
      }
    });
  }

  handleCheckOut(formData: any): void {
    if (!this.selectedBooking) return;
    this.actionLoading = true;
    this.bookingRepo.checkOut(this.selectedBooking.id, formData).subscribe({
      next: () => {
        this.actionLoading = false;
        this.isCheckOutOpen = false;
        this.toastService.success('Guest checked out. Housekeeping task dispatched.', 'Checkout Complete');
        this.loadBookings();
      },
      error: (err: Error) => {
        this.actionLoading = false;
        this.toastService.error(ErrorFormatter.format(err, 'Checkout failed'));
      }
    });
  }

  handleCancel(formData: any): void {
    if (!this.selectedBooking) return;
    this.actionLoading = true;
    this.bookingRepo.cancel(this.selectedBooking.id, formData.reason).subscribe({
      next: () => {
        this.actionLoading = false;
        this.isCancelOpen = false;
        this.toastService.success('Reservation cancelled and room unblocked.', 'Cancelled');
        this.loadBookings();
      },
      error: (err: Error) => {
        this.actionLoading = false;
        this.toastService.error(ErrorFormatter.format(err, 'Cancellation failed'));
      }
    });
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }

  formatCurrency(amt: number): string {
    return CurrencyFormatter.format(amt);
  }
}
