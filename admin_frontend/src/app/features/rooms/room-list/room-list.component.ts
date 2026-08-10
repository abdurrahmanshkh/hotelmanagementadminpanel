import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RoomSummary, RoomStatus } from '../../../core/models';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PageHeaderComponent,
    SearchInputComponent,
    DataTableComponent,
    PaginationComponent,
    StatusBadgeComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="room-list-page">
      <app-page-header title="Rooms Inventory" subtitle="Manage physical hotel rooms, floor locations & operational status">
        <div actions class="header-actions">
          <app-button variant="accent" size="md" (btnClick)="navigate('/admin/rooms/new')">
            <app-icon name="plus" [size]="16"></app-icon> Add New Room
          </app-button>
        </div>
      </app-page-header>

      <!-- Toolbar -->
      <div class="toolbar card">
        <app-search-input
          [value]="searchQuery"
          placeholder="Search room number or type..."
          (search)="onSearch($event)"
        ></app-search-input>

        <div class="status-pills">
          <button class="pill" [class.pill--active]="selectedStatus === 'ALL'" (click)="selectStatus('ALL')">All Rooms</button>
          <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.AVAILABLE" (click)="selectStatus(StatusEnum.AVAILABLE)">Available</button>
          <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.OCCUPIED" (click)="selectStatus(StatusEnum.OCCUPIED)">Occupied</button>
          <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.UNDER_CLEANING" (click)="selectStatus(StatusEnum.UNDER_CLEANING)">Cleaning</button>
          <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.MAINTENANCE" (click)="selectStatus(StatusEnum.MAINTENANCE)">Maintenance</button>
        </div>
      </div>

      <!-- Data Table -->
      <app-data-table
        [isEmpty]="rooms.length === 0"
        [loading]="loading"
        [colspan]="6"
        emptyMessage="No rooms found matching filter criteria."
      >
        <ng-container headers>
          <th>Room Number</th>
          <th>Floor Number</th>
          <th>Room Type Category</th>
          <th>Operational Status</th>
          <th>Active</th>
          <th>Actions</th>
        </ng-container>

        <ng-container rows>
          <tr *ngFor="let item of rooms">
            <td><strong class="ref-link font-mono" (click)="viewDetails(item.id)">Room {{ item.roomNumber }}</strong></td>
            <td class="font-mono">Floor {{ item.floor }}</td>
            <td><strong>{{ item.roomTypeName }}</strong></td>
            <td>
              <app-status-badge [status]="item.status"></app-status-badge>
            </td>
            <td>
              <span class="badge" [class.badge--success]="item.isActive" [class.badge--neutral]="!item.isActive">
                {{ item.isActive ? 'ACTIVE' : 'INACTIVE' }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-action" (click)="editRoom(item.id)">
                  <app-icon name="edit" [size]="14"></app-icon> Edit
                </button>
                <button class="btn-action btn-action--details" (click)="viewDetails(item.id)">
                  <app-icon name="eye" [size]="14"></app-icon> Details
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
    </div>
  `,
  styles: [`
    .room-list-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; padding: 1rem; }
    .status-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .pill {
      padding: 0.375rem 0.75rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 9999px; font-size: 0.8125rem; font-weight: 500; color: #4B5563; cursor: pointer;
      &--active { background: #11243E; color: #FFF; border-color: #11243E; font-weight: 600; }
    }
    .ref-link { color: #2563EB; cursor: pointer; &:hover { text-decoration: underline; } }
    .action-buttons { display: flex; gap: 0.375rem; }
    .btn-action { padding: 0.25rem 0.625rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; &:hover { background: #11243E; color: #FFF; } }
  `]
})
export class RoomListComponent implements OnInit {
  private roomRepo = inject(RoomRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = RoomStatus;

  public rooms: RoomSummary[] = [];
  public loading = false;
  public page = 1;
  public pageSize = 10;
  public totalPages = 1;
  public totalElements = 0;

  public searchQuery = '';
  public selectedStatus = 'ALL';

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    const filter: any = { page: this.page - 1, size: this.pageSize };
    if (this.selectedStatus !== 'ALL') filter.status = this.selectedStatus as RoomStatus;
    if (this.searchQuery) filter.query = this.searchQuery;

    this.roomRepo.getRooms(filter).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.rooms = res.data.items;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalItems;
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load rooms inventory');
      }
    });
  }

  onSearch(q: string): void {
    this.searchQuery = q;
    this.page = 1;
    this.loadRooms();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.page = 1;
    this.loadRooms();
  }

  onPageChange(p: number): void {
    this.page = p;
    this.loadRooms();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/rooms', id]);
  }

  editRoom(id: number): void {
    this.router.navigate(['/admin/rooms', id, 'edit']);
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }
}
