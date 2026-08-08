import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaintenanceRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../../shared/components/priority-badge/priority-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MaintenanceRecord, MaintenanceStatus } from '../../../core/models';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    DataTableComponent,
    PaginationComponent,
    StatusBadgeComponent,
    PriorityBadgeComponent,
    ButtonComponent
  ],
  template: `
    <div class="maintenance-list-page">
      <app-page-header title="Maintenance Operations" subtitle="Manage hotel facility repair tickets & technician assignments">
        <div actions class="header-actions">
          <app-button variant="accent" size="md" (btnClick)="navigate('/admin/maintenance/new')">
            🔧 Log Maintenance Ticket
          </app-button>
        </div>
      </app-page-header>

      <!-- Data Table -->
      <app-data-table
        [isEmpty]="records.length === 0"
        [loading]="loading"
        [colspan]="7"
        emptyMessage="No facility maintenance records found."
      >
        <ng-container headers>
          <th>Room</th>
          <th>Issue Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Technician</th>
          <th>Logged At</th>
          <th>Actions</th>
        </ng-container>

        <ng-container rows>
          <tr *ngFor="let item of records">
            <td><strong class="ref-link" (click)="viewDetails(item.id)">Room {{ item.roomNumber }}</strong></td>
            <td><strong>{{ item.title }}</strong></td>
            <td>
              <app-priority-badge [priority]="item.priority"></app-priority-badge>
            </td>
            <td>
              <app-status-badge [status]="item.status"></app-status-badge>
            </td>
            <td>{{ item.assignedTechnicianName || 'Unassigned' }}</td>
            <td>{{ formatDate(item.createdAt) }}</td>
            <td>
              <div class="action-buttons">
                <button
                  *ngIf="item.status !== StatusEnum.COMPLETED"
                  class="btn-action btn-action--success"
                  (click)="completeRepair(item.id)"
                >
                  Complete Repair
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
    .maintenance-list-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .ref-link { color: #2563EB; cursor: pointer; &:hover { text-decoration: underline; } }
    .action-buttons { display: flex; gap: 0.375rem; }
    .btn-action {
      padding: 0.25rem 0.625rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid #D1D5DB; background: #F3F4F6;
      &--success { background: #E6F4EA; color: #16803C; border-color: #A7F3D0; }
    }
  `]
})
export class MaintenanceListComponent implements OnInit {
  private maintenanceRepo = inject(MaintenanceRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = MaintenanceStatus;

  public records: MaintenanceRecord[] = [];
  public loading = false;
  public page = 1;
  public pageSize = 10;
  public totalPages = 1;
  public totalElements = 0;

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.maintenanceRepo.getMaintenanceRecords({ page: this.page - 1, size: this.pageSize }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.records = res.data.items;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalItems;
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load maintenance tickets');
      }
    });
  }

  completeRepair(id: number): void {
    this.maintenanceRepo.completeRecord(id, { resolutionNotes: 'Repairs completed', cleaningRequired: false, roomReady: true }).subscribe({
      next: () => {
        this.toastService.success('Repair ticket completed. Room maintenance unblocked.', 'Repair Completed');
        this.loadRecords();
      }
    });
  }

  onPageChange(p: number): void {
    this.page = p;
    this.loadRecords();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/maintenance', id]);
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }
}
