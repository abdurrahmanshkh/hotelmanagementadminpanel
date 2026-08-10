import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GuestRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { GuestSummary } from '../../../core/models';

@Component({
  selector: 'app-guest-list',
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
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="guest-list-page">
      <app-page-header title="Guest Directory" subtitle="Search guest accounts, view stay history & manage status">
        <div actions class="header-actions">
          <app-button variant="outline" size="md" (btnClick)="isFilterDrawerOpen = true">
            <app-icon name="filter" [size]="16"></app-icon> Filters
          </app-button>
        </div>
      </app-page-header>

      <!-- Toolbar -->
      <div class="toolbar card">
        <app-search-input
          [value]="searchQuery"
          placeholder="Search guest by name, email, or phone..."
          (search)="onSearch($event)"
        ></app-search-input>
      </div>

      <!-- Data Table -->
      <app-data-table
        [isEmpty]="guests.length === 0"
        [loading]="loading"
        [colspan]="7"
        emptyMessage="No guest profiles found."
      >
        <ng-container headers>
          <th>Guest Profile</th>
          <th>Contact Info</th>
          <th>Total Stays</th>
          <th>Last Stay Date</th>
          <th>Account Status</th>
          <th>Registered</th>
          <th>Actions</th>
        </ng-container>

        <ng-container rows>
          <tr *ngFor="let item of guests">
            <td>
              <div class="guest-cell">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" class="avatar" />
                <div class="guest-info">
                  <strong class="guest-name" (click)="viewDetails(item.id)">{{ item.fullName }}</strong>
                  <span class="sub-text">ID #{{ item.id }}</span>
                </div>
              </div>
            </td>
            <td>
              <div>{{ item.email }}</div>
              <div class="sub-text">{{ item.phone || 'N/A' }}</div>
            </td>
            <td><strong>{{ item.totalBookings || 0 }} Stays</strong></td>
            <td>{{ item.lastStayDate ? formatDate(item.lastStayDate) : 'Never' }}</td>
            <td>
              <span class="badge" [class.badge--success]="item.accountStatus === 'ACTIVE'" [class.badge--danger]="item.accountStatus !== 'ACTIVE'">
                {{ item.accountStatus }}
              </span>
            </td>
            <td>{{ formatDate(item.createdAt) }}</td>
            <td>
              <button class="btn-action" (click)="viewDetails(item.id)">View Profile →</button>
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
        title="Filter Guest Directory"
        (apply)="applyFilters()"
        (reset)="resetFilters()"
      >
        <div class="filter-form">
          <div class="form-group">
            <label>Account Status</label>
            <select [(ngModel)]="filterActiveStatus" class="form-control">
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Guests</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </app-filter-drawer>
    </div>
  `,
  styles: [`
    .guest-list-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; padding: 1rem; }
    .guest-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid #D1D5DB; }
    .guest-info { display: flex; flex-direction: column; }
    .guest-name { color: #11243E; cursor: pointer; &:hover { text-decoration: underline; color: #2563EB; } }
    .sub-text { font-size: 0.75rem; color: #6B7280; }
    .btn-action { padding: 0.25rem 0.625rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; &:hover { background: #11243E; color: #FFF; } }
    .filter-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; label { font-size: 0.8125rem; font-weight: 600; color: #374151; } }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
  `]
})
export class GuestListComponent implements OnInit {
  private guestRepo = inject(GuestRepository);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  public guests: GuestSummary[] = [];
  public loading = false;
  public page = 1;
  public pageSize = 10;
  public totalPages = 1;
  public totalElements = 0;

  public searchQuery = '';
  public filterActiveStatus = 'ALL';
  public isFilterDrawerOpen = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.searchQuery = params['q'];
      if (params['page']) this.page = +params['page'];
      this.loadGuests();
    });
  }

  loadGuests(): void {
    this.loading = true;
    const filterParams: any = {
      page: this.page - 1,
      size: this.pageSize
    };

    if (this.searchQuery) filterParams.query = this.searchQuery;
    if (this.filterActiveStatus !== 'ALL') filterParams.accountStatus = this.filterActiveStatus;

    this.guestRepo.getGuests(filterParams).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.guests = res.data.items;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalItems;
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load guest directory');
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.page = 1;
    this.loadGuests();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadGuests();
  }

  applyFilters(): void {
    this.page = 1;
    this.loadGuests();
  }

  resetFilters(): void {
    this.filterActiveStatus = 'ALL';
    this.page = 1;
    this.loadGuests();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/guests', id]);
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }
}
