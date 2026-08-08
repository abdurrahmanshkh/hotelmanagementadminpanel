import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CleaningRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CleaningTask, CleaningTaskStatus } from '../../../core/models';

@Component({
  selector: 'app-cleaning-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    DataTableComponent,
    PaginationComponent,
    StatusBadgeComponent,
    ButtonComponent
  ],
  template: `
    <div class="cleaning-list-page">
      <app-page-header title="Housekeeping Tasks" subtitle="Manage room cleaning queue, housekeeper assignments & completion">
        <div actions class="header-actions">
          <app-button variant="outline" size="md" (btnClick)="navigate('/admin/cleaning/board')">
            📋 Switch to Cleaning Board
          </app-button>
        </div>
      </app-page-header>

      <!-- Data Table -->
      <app-data-table
        [isEmpty]="tasks.length === 0"
        [loading]="loading"
        [colspan]="6"
        emptyMessage="No cleaning tasks currently queued."
      >
        <ng-container headers>
          <th>Room</th>
          <th>Housekeeper Assigned</th>
          <th>Created At</th>
          <th>Status</th>
          <th>Notes</th>
          <th>Actions</th>
        </ng-container>

        <ng-container rows>
          <tr *ngFor="let item of tasks">
            <td><strong class="ref-link" (click)="viewDetails(item.id)">Room {{ item.roomNumber }}</strong></td>
            <td>{{ item.assignedStaffName || 'Unassigned' }}</td>
            <td>{{ formatDate(item.createdAt) }}</td>
            <td>
              <app-status-badge [status]="item.status"></app-status-badge>
            </td>
            <td>{{ item.notes || 'Standard turnover cleaning' }}</td>
            <td>
              <div class="action-buttons">
                <button
                  *ngIf="item.status !== StatusEnum.COMPLETED"
                  class="btn-action btn-action--success"
                  (click)="completeTask(item.id)"
                >
                  Complete Cleaning
                </button>
                <button class="btn-action" (click)="viewDetails(item.id)">Details</button>
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
    .cleaning-list-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .ref-link { color: #2563EB; cursor: pointer; &:hover { text-decoration: underline; } }
    .action-buttons { display: flex; gap: 0.375rem; }
    .btn-action {
      padding: 0.25rem 0.625rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid #D1D5DB; background: #F3F4F6;
      &--success { background: #E6F4EA; color: #16803C; border-color: #A7F3D0; }
    }
  `]
})
export class CleaningListComponent implements OnInit {
  private cleaningRepo = inject(CleaningRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = CleaningTaskStatus;

  public tasks: CleaningTask[] = [];
  public loading = false;
  public page = 1;
  public pageSize = 10;
  public totalPages = 1;
  public totalElements = 0;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.cleaningRepo.getCleaningTasks({ page: this.page - 1, size: this.pageSize }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.tasks = res.data.items;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalItems;
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load cleaning tasks');
      }
    });
  }

  completeTask(id: number): void {
    this.cleaningRepo.completeTask(id, { roomInspected: true, roomReady: true, maintenanceIssueFound: false, notes: 'Turnover completed' }).subscribe({
      next: () => {
        this.toastService.success('Cleaning completed. Room is now AVAILABLE.', 'Room Ready');
        this.loadTasks();
      }
    });
  }

  onPageChange(p: number): void {
    this.page = p;
    this.loadTasks();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/cleaning', id]);
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }
}
