import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MaintenanceRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../../shared/components/priority-badge/priority-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { MaintenanceRecord, MaintenanceStatus } from '../../../core/models';

@Component({
  selector: 'app-maintenance-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    PriorityBadgeComponent,
    ButtonComponent,
    SkeletonLoaderComponent
  ],
  template: `
    <div class="maintenance-detail-page">
      <app-page-header
        [title]="record ? 'Maintenance Record - Room ' + record.roomNumber : 'Loading Record...'"
        subtitle="Facility ticket details, technician assignment & resolution logs"
      >
        <div actions class="header-actions">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Back to Tickets</app-button>
        </div>
      </app-page-header>

      <app-skeleton-loader *ngIf="loading" height="350px"></app-skeleton-loader>

      <div *ngIf="record && !loading" class="detail-card card">
        <div class="card-header flex-between">
          <div>
            <h2 class="record-title">{{ record.title }}</h2>
            <span class="room-tag">Room {{ record.roomNumber }}</span>
          </div>
          <div class="badges-row">
            <app-priority-badge [priority]="record.priority"></app-priority-badge>
            <app-status-badge [status]="record.status"></app-status-badge>
          </div>
        </div>

        <div class="description-box">
          <span class="label">Issue Description:</span>
          <p>{{ record.description || 'Facility maintenance issue reported by staff.' }}</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Assigned Technician:</span>
            <strong>{{ record.assignedTechnicianName || 'David Miller (Maintenance Specialist)' }}</strong>
          </div>
          <div class="info-item">
            <span class="label">Reported Date:</span>
            <span>{{ formatDate(record.createdAt) }}</span>
          </div>
          <div class="info-item" *ngIf="record.completedAt">
            <span class="label">Resolved Date:</span>
            <span>{{ formatDate(record.completedAt) }}</span>
          </div>
        </div>

        <div class="action-bar" *ngIf="record.status !== StatusEnum.COMPLETED">
          <app-button variant="accent" size="md" (btnClick)="completeRepair()">
            ✅ Complete Repair & Unblock Room
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .maintenance-detail-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .detail-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; max-width: 700px; }
    .card-header { padding-bottom: 1rem; border-bottom: 1px solid #E5E7EB; }
    .record-title { font-size: 1.25rem; font-weight: 700; color: #11243E; }
    .room-tag { font-size: 0.8125rem; color: #C99B4A; font-weight: 600; }
    .badges-row { display: flex; align-items: center; gap: 0.5rem; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .label { font-size: 0.75rem; color: #6B7280; text-transform: uppercase; font-weight: 600; }
    .description-box { background: #F9FAFB; padding: 0.875rem; border-radius: 6px; border: 1px solid #E5E7EB; p { margin-top: 0.25rem; font-size: 0.875rem; color: #1F2937; } }
    .action-bar { padding-top: 1rem; border-top: 1px solid #E5E7EB; }
  `]
})
export class MaintenanceDetailComponent implements OnInit {
  private maintenanceRepo = inject(MaintenanceRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = MaintenanceStatus;
  public record: MaintenanceRecord | null = null;
  public loading = true;

  ngOnInit(): void {
    const maintenanceId = Number(this.route.snapshot.paramMap.get('maintenanceId'));
    if (maintenanceId) {
      this.maintenanceRepo.getMaintenanceById(maintenanceId).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success && res.data) {
            this.record = res.data;
          }
        },
        error: (err: Error) => {
          this.loading = false;
          this.toastService.error(err.message || 'Failed to load maintenance record');
        }
      });
    }
  }

  completeRepair(): void {
    if (!this.record) return;
    this.maintenanceRepo.completeRecord(this.record.id, { resolutionNotes: 'Repairs completed', cleaningRequired: false, roomReady: true }).subscribe({
      next: () => {
        if (this.record) this.record.status = MaintenanceStatus.COMPLETED;
        this.toastService.success('Repair completed and room maintenance unblocked.', 'Completed');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/maintenance']);
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }
}
