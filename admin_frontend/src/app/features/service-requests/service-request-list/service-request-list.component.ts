import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceRequestRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../../shared/components/priority-badge/priority-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ServiceRequest, ServiceRequestStatus, Priority } from '../../../core/models';

@Component({
  selector: 'app-service-request-list',
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
    PriorityBadgeComponent,
    ButtonComponent
  ],
  template: `
    <div class="service-requests-page">
      <app-page-header title="Guest Service Requests" subtitle="Track housekeeping, room service, & amenity requests">
        <div actions class="header-actions">
          <app-button variant="outline" size="md" (btnClick)="navigate('/admin/service-requests/board')">
            📋 Switch to Kanban Board
          </app-button>
          <app-button variant="outline" size="md" (btnClick)="isFilterDrawerOpen = true">
            🌪️ Filters
          </app-button>
        </div>
      </app-page-header>

      <!-- Toolbar -->
      <div class="toolbar card">
        <app-search-input
          [value]="searchQuery"
          placeholder="Search by title, room, or guest name..."
          (search)="onSearch($event)"
        ></app-search-input>

        <div class="status-pills">
          <button class="pill" [class.pill--active]="selectedStatus === 'ALL'" (click)="selectStatus('ALL')">All Requests</button>
          <button class="pill" [class.pill--active]="selectedStatus === 'PENDING'" (click)="selectStatus('PENDING')">Pending</button>
          <button class="pill" [class.pill--active]="selectedStatus === 'IN_PROGRESS'" (click)="selectStatus('IN_PROGRESS')">In Progress</button>
          <button class="pill" [class.pill--active]="selectedStatus === 'COMPLETED'" (click)="selectStatus('COMPLETED')">Completed</button>
        </div>
      </div>

      <!-- Data Table -->
      <app-data-table
        [isEmpty]="requests.length === 0"
        [loading]="loading"
        [colspan]="8"
        emptyMessage="No guest service requests found."
      >
        <ng-container headers>
          <th>Reference</th>
          <th>Room</th>
          <th>Category & Title</th>
          <th>Guest</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assigned Staff</th>
          <th>Actions</th>
        </ng-container>

        <ng-container rows>
          <tr *ngFor="let item of requests">
            <td><strong class="ref-link" (click)="viewDetails(item.id)">{{ item.referenceNumber }}</strong></td>
            <td><strong>Room {{ item.roomNumber }}</strong></td>
            <td>
              <div class="title-cell">
                <span class="category-tag">{{ formatCategory(item.category) }}</span>
                <strong class="req-title">{{ item.title }}</strong>
              </div>
            </td>
            <td>{{ item.guestName }}</td>
            <td>
              <app-priority-badge [priority]="item.priority"></app-priority-badge>
            </td>
            <td>
              <app-status-badge [status]="item.status"></app-status-badge>
            </td>
            <td>{{ item.assignedStaffName || 'Unassigned' }}</td>
            <td>
              <button class="btn-action" (click)="viewDetails(item.id)">Manage →</button>
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
        title="Filter Service Requests"
        (apply)="applyFilters()"
        (reset)="resetFilters()"
      >
        <div class="filter-form">
          <div class="form-group">
            <label>Priority</label>
            <select [(ngModel)]="filterPriority" class="form-control">
              <option value="ALL">All Priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>
        </div>
      </app-filter-drawer>
    </div>
  `,
  styles: [`
    .service-requests-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; padding: 1rem; }
    .status-pills { display: flex; gap: 0.5rem; }
    .pill {
      padding: 0.375rem 0.75rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 9999px; font-size: 0.8125rem; font-weight: 500; color: #4B5563; cursor: pointer;
      &--active { background: #11243E; color: #FFF; border-color: #11243E; font-weight: 600; }
    }
    .ref-link { color: #2563EB; cursor: pointer; &:hover { text-decoration: underline; } }
    .title-cell { display: flex; flex-direction: column; gap: 0.125rem; }
    .category-tag { font-size: 0.7rem; font-weight: 700; color: #C99B4A; text-transform: uppercase; }
    .req-title { color: #11243E; }
    .btn-action { padding: 0.25rem 0.625rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; &:hover { background: #11243E; color: #FFF; } }
    .filter-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; label { font-size: 0.8125rem; font-weight: 600; color: #374151; } }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
  `]
})
export class ServiceRequestListComponent implements OnInit {
  private serviceRepo = inject(ServiceRequestRepository);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  public requests: ServiceRequest[] = [];
  public loading = false;
  public page = 1;
  public pageSize = 10;
  public totalPages = 1;
  public totalElements = 0;

  public searchQuery = '';
  public selectedStatus = 'ALL';
  public filterPriority = 'ALL';
  public isFilterDrawerOpen = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['status']) this.selectedStatus = params['status'];
      if (params['q']) this.searchQuery = params['q'];
      if (params['page']) this.page = +params['page'];
      this.loadRequests();
    });
  }

  loadRequests(): void {
    this.loading = true;
    const filterParams: any = {
      page: this.page - 1,
      size: this.pageSize
    };

    if (this.selectedStatus !== 'ALL') filterParams.status = this.selectedStatus as ServiceRequestStatus;
    if (this.filterPriority !== 'ALL') filterParams.priority = this.filterPriority as Priority;
    if (this.searchQuery) filterParams.query = this.searchQuery;

    this.serviceRepo.getRequests(filterParams).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.requests = res.data.items;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalItems;
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load service requests');
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.page = 1;
    this.loadRequests();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.page = 1;
    this.loadRequests();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadRequests();
  }

  applyFilters(): void {
    this.page = 1;
    this.loadRequests();
  }

  resetFilters(): void {
    this.filterPriority = 'ALL';
    this.page = 1;
    this.loadRequests();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/service-requests', id]);
  }

  formatCategory(cat: string): string {
    if (!cat) return '';
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }
}
