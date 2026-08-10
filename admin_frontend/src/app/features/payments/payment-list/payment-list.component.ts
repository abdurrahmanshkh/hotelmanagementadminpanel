import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PaymentRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatter } from '../../../core/utilities/currency-formatter.utility';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PaymentSummary, PaymentStatus } from '../../../core/models';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    SearchInputComponent,
    DataTableComponent,
    PaginationComponent,
    StatusBadgeComponent
  ],
  template: `
    <div class="payment-list-page">
      <app-page-header title="Payments & Ledger" subtitle="Monitor transactions, guest payments & refund statuses"></app-page-header>

      <!-- Toolbar -->
      <div class="toolbar card">
        <app-search-input
          [value]="searchQuery"
          placeholder="Search payment reference or guest..."
          (search)="onSearch($event)"
        ></app-search-input>

        <div class="status-pills">
          <button class="pill" [class.pill--active]="selectedStatus === 'ALL'" (click)="selectStatus('ALL')">All Transactions</button>
          <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.SUCCESS" (click)="selectStatus(StatusEnum.SUCCESS)">Success</button>
          <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.PENDING" (click)="selectStatus(StatusEnum.PENDING)">Pending</button>
          <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.REFUNDED" (click)="selectStatus(StatusEnum.REFUNDED)">Refunded</button>
        </div>
      </div>

      <!-- Data Table -->
      <app-data-table
        [isEmpty]="payments.length === 0"
        [loading]="loading"
        [colspan]="7"
        emptyMessage="No payment records found."
      >
        <ng-container headers>
          <th>Transaction Ref</th>
          <th>Guest Name</th>
          <th>Booking Ref</th>
          <th>Amount Paid</th>
          <th>Method</th>
          <th>Status</th>
          <th>Transaction Date</th>
        </ng-container>

        <ng-container rows>
          <tr *ngFor="let item of payments">
            <td><strong class="ref-link" (click)="viewDetails(item.id)">{{ item.paymentReference }}</strong></td>
            <td>{{ item.guestName }}</td>
            <td><code>{{ item.bookingReference }}</code></td>
            <td><strong>{{ formatCurrency(item.amount) }}</strong></td>
            <td><span class="method-tag">{{ item.paymentMethod }}</span></td>
            <td>
              <app-status-badge [status]="item.status"></app-status-badge>
            </td>
            <td>{{ formatDate(item.paidAt) }}</td>
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
    </div>
  `,
  styles: [`
    .payment-list-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; padding: 1rem; }
    .status-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .pill {
      padding: 0.375rem 0.75rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 9999px; font-size: 0.8125rem; font-weight: 500; color: #4B5563; cursor: pointer;
      &--active { background: #11243E; color: #FFF; border-color: #11243E; font-weight: 600; }
    }
    .ref-link { color: #2563EB; cursor: pointer; &:hover { text-decoration: underline; } }
    .method-tag { font-size: 0.75rem; font-weight: 700; background: #E8F0FE; color: #1E40AF; padding: 0.125rem 0.5rem; border-radius: 4px; }
  `]
})
export class PaymentListComponent implements OnInit {
  private paymentRepo = inject(PaymentRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = PaymentStatus;

  public payments: PaymentSummary[] = [];
  public loading = false;
  public page = 1;
  public pageSize = 10;
  public totalPages = 1;
  public totalElements = 0;

  public searchQuery = '';
  public selectedStatus = 'ALL';

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    const filter: any = { page: this.page - 1, size: this.pageSize };
    if (this.selectedStatus !== 'ALL') filter.status = this.selectedStatus as PaymentStatus;
    if (this.searchQuery) filter.query = this.searchQuery;

    this.paymentRepo.getPayments(filter).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.payments = res.data.items;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalItems;
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load payments ledger');
      }
    });
  }

  onSearch(q: string): void {
    this.searchQuery = q;
    this.page = 1;
    this.loadPayments();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.page = 1;
    this.loadPayments();
  }

  onPageChange(p: number): void {
    this.page = p;
    this.loadPayments();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/payments', id]);
  }

  formatCurrency(amt: number): string {
    return CurrencyFormatter.format(amt);
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }
}
