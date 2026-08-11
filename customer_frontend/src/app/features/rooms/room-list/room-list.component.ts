import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoomRepository } from '../../../core/repositories/contracts/room.repository';
import { RoomCardComponent } from '../../../shared/components/room-card/room-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Room, RoomType, RoomSearchFilters, PageData } from '../../../core/models';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RoomCardComponent,
    PaginationComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    ErrorStateComponent
  ],
  template: `
    <div class="rooms-page container">
      <!-- Search Summary Bar -->
      <div class="search-bar-card">
        <div class="search-inputs flex-gap">
          <div class="input-item">
            <span class="label">Check-In</span>
            <input type="date" [(ngModel)]="filters.checkInDate" (change)="applyFilters()" class="date-input" />
          </div>
          <div class="input-item">
            <span class="label">Check-Out</span>
            <input type="date" [(ngModel)]="filters.checkOutDate" (change)="applyFilters()" class="date-input" />
          </div>
          <div class="input-item">
            <span class="label">Guests</span>
            <select [(ngModel)]="filters.adults" (change)="applyFilters()" class="select-input">
              <option [ngValue]="1">1 Adult</option>
              <option [ngValue]="2">2 Adults</option>
              <option [ngValue]="3">3 Adults</option>
            </select>
          </div>
        </div>

        <div class="sort-box flex-gap">
          <span class="label">Sort By:</span>
          <select [(ngModel)]="filters.sortBy" (change)="applyFilters()" class="select-input">
            <option value="RECOMMENDED">Recommended</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="RATING">Guest Rating</option>
            <option value="CAPACITY">Guest Capacity</option>
          </select>
        </div>
      </div>

      <div class="page-layout">
        <!-- Sidebar Filters -->
        <aside class="filter-sidebar">
          <div class="sidebar-header">
            <h3 class="title">Filter Rooms</h3>
            <button type="button" class="btn-clear" (click)="clearFilters()">Clear All</button>
          </div>

          <div class="filter-group">
            <h4 class="group-title">Room Category</h4>
            <label class="radio-label">
              <input type="radio" name="roomType" [value]="undefined" [(ngModel)]="filters.roomTypeId" (change)="applyFilters()" />
              <span>All Categories</span>
            </label>
            <label *ngFor="let type of roomTypes" class="radio-label">
              <input type="radio" name="roomType" [value]="type.id" [(ngModel)]="filters.roomTypeId" (change)="applyFilters()" />
              <span>{{ type.name }}</span>
            </label>
          </div>

          <div class="filter-group">
            <h4 class="group-title">Nightly Price Range</h4>
            <div class="price-inputs flex-gap">
              <input type="number" placeholder="Min ₹" [(ngModel)]="filters.minPrice" (change)="applyFilters()" class="price-input" />
              <span>-</span>
              <input type="number" placeholder="Max ₹" [(ngModel)]="filters.maxPrice" (change)="applyFilters()" class="price-input" />
            </div>
          </div>

          <div class="filter-group">
            <h4 class="group-title">Bed Type</h4>
            <select [(ngModel)]="filters.bedType" (change)="applyFilters()" class="select-input full">
              <option [value]="undefined">All Bed Types</option>
              <option value="King">King Bed</option>
              <option value="Queen">Queen Bed</option>
            </select>
          </div>
        </aside>

        <!-- Main Room Grid -->
        <main class="rooms-content">
          <!-- Loading Skeletons -->
          <div *ngIf="isLoading" class="rooms-grid">
            <div *ngFor="let i of [1, 2, 3, 4]" class="skeleton-card">
              <app-skeleton-loader height="180px" borderRadius="12px"></app-skeleton-loader>
              <app-skeleton-loader height="24px" width="60%" borderRadius="4px"></app-skeleton-loader>
              <app-skeleton-loader height="16px" width="80%" borderRadius="4px"></app-skeleton-loader>
            </div>
          </div>

          <!-- Error State -->
          <app-error-state *ngIf="hasError && !isLoading" (retry)="loadRooms()"></app-error-state>

          <!-- Empty State -->
          <app-empty-state
            *ngIf="!isLoading && !hasError && paginatedData?.items?.length === 0"
            icon="search"
            title="No Matching Rooms Found"
            description="Try adjusting your date range, price filters, or guest capacity."
            actionText="Reset Filters"
            (action)="clearFilters()"
          ></app-empty-state>

          <!-- Rooms Grid -->
          <div *ngIf="!isLoading && !hasError && paginatedData?.items && paginatedData!.items.length > 0" class="rooms-grid">
            <app-room-card
              *ngFor="let room of paginatedData!.items"
              [room]="room"
              (bookNow)="onBookRoom($event)"
            ></app-room-card>
          </div>

          <!-- Pagination -->
          <div *ngIf="paginatedData && paginatedData.totalPages > 1" class="pagination-row">
            <app-pagination
              [page]="currentPage"
              [totalPages]="paginatedData.totalPages"
              (pageChange)="onPageChange($event)"
            ></app-pagination>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .rooms-page { padding-top: 2rem; padding-bottom: 4rem; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }

    .search-bar-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03);

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .input-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        .label { font-size: 0.6875rem; font-weight: 700; color: #64748B; text-transform: uppercase; }
        .date-input, .select-input {
          padding: 0.375rem 0.625rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
        }
      }

      .sort-box {
        .label { font-size: 0.8125rem; font-weight: 700; color: #0F172A; }
      }
    }

    .page-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 2rem;

      @media (max-width: 868px) {
        grid-template-columns: 1fr;
      }
    }

    .filter-sidebar {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 1.25rem;
      height: fit-content;

      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #F1F5F9;
        margin-bottom: 1rem;

        .title { font-size: 0.9375rem; font-weight: 700; color: #0F172A; }
        .btn-clear { background: none; border: none; font-size: 0.75rem; font-weight: 700; color: #D97706; cursor: pointer; }
      }

      .filter-group {
        margin-bottom: 1.25rem;
        .group-title { font-size: 0.8125rem; font-weight: 700; color: #0F172A; margin-bottom: 0.625rem; }
        .radio-label {
          display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: #475569; margin-bottom: 0.375rem; cursor: pointer;
        }
        .price-input {
          width: 50%; padding: 0.375rem 0.5rem; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 0.8125rem;
        }
        .full { width: 100%; padding: 0.375rem 0.5rem; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 0.8125rem; }
      }
    }

    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .skeleton-card {
      display: flex; flex-direction: column; gap: 0.75rem; background: #FFFFFF; padding: 1rem; border-radius: 16px; border: 1px solid #E2E8F0;
    }

    .pagination-row {
      margin-top: 2.5rem;
      display: flex;
      justify-content: center;
    }
  `]
})
export class RoomListComponent implements OnInit {
  private roomRepo = inject(RoomRepository);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public roomTypes: RoomType[] = [];
  public paginatedData?: PageData<Room>;
  public isLoading = true;
  public hasError = false;
  public currentPage = 1;

  public filters: RoomSearchFilters = {
    sortBy: 'RECOMMENDED'
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['checkInDate']) this.filters.checkInDate = params['checkInDate'];
      if (params['checkOutDate']) this.filters.checkOutDate = params['checkOutDate'];
      if (params['adults']) this.filters.adults = Number(params['adults']);
      this.loadRoomTypes();
      this.loadRooms();
    });
  }

  loadRoomTypes(): void {
    this.roomRepo.getRoomTypes().subscribe(res => {
      this.roomTypes = res.data;
    });
  }

  loadRooms(): void {
    this.isLoading = true;
    this.hasError = false;

    this.roomRepo.getRooms(this.filters, this.currentPage, 9).subscribe({
      next: res => {
        this.isLoading = false;
        if (res?.data) {
          if (Array.isArray(res.data)) {
            const list = res.data as Room[];
            this.paginatedData = {
              items: list,
              page: 1,
              size: list.length,
              totalItems: list.length,
              totalPages: 1
            };
          } else {
            this.paginatedData = res.data;
          }
        } else {
          this.paginatedData = { items: [], page: 1, size: 9, totalItems: 0, totalPages: 1 };
        }
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadRooms();
  }

  clearFilters(): void {
    this.filters = { sortBy: 'RECOMMENDED' };
    this.currentPage = 1;
    this.loadRooms();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadRooms();
  }

  onBookRoom(room: Room): void {
    this.router.navigate(['/booking', room.id], {
      queryParams: {
        checkInDate: this.filters.checkInDate,
        checkOutDate: this.filters.checkOutDate,
        adults: this.filters.adults
      }
    });
  }
}
