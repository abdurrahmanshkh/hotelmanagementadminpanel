import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CleaningRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { CleaningTask, CleaningTaskStatus } from '../../../core/models';

@Component({
  selector: 'app-cleaning-detail',
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
    <div class="cleaning-detail-page">
      <app-page-header
        [title]="task ? 'Cleaning Task - Room ' + task.roomNumber : 'Loading Task...'"
        subtitle="Housekeeping assignment, notes & status transition"
      >
        <div actions class="header-actions">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Back to Queue</app-button>
        </div>
      </app-page-header>

      <app-skeleton-loader *ngIf="loading" height="300px"></app-skeleton-loader>

      <div *ngIf="task && !loading" class="detail-card card">
        <div class="card-header flex-between">
          <h2 class="card-title">Turnover Cleaning - Room {{ task.roomNumber }}</h2>
          <app-status-badge [status]="task.status"></app-status-badge>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Assigned Housekeeper:</span>
            <strong>{{ task.assignedStaffName || 'Unassigned' }}</strong>
          </div>
          <div class="info-item">
            <span class="label">Created At:</span>
            <span>{{ formatDate(task.createdAt) }}</span>
          </div>
          <div class="info-item" *ngIf="task.completedAt">
            <span class="label">Completed At:</span>
            <span>{{ formatDate(task.completedAt) }}</span>
          </div>
        </div>

        <div class="notes-box">
          <span class="label">Cleaning Instructions / Notes:</span>
          <p>{{ task.notes || 'Standard post-checkout turnover deep cleaning & linen change.' }}</p>
        </div>

        <div class="action-bar" *ngIf="task.status !== StatusEnum.COMPLETED">
          <app-button variant="accent" size="md" (btnClick)="completeTask()">
            ✅ Mark Cleaning Completed
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cleaning-detail-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .detail-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; max-width: 650px; }
    .card-header { padding-bottom: 1rem; border-bottom: 1px solid #E5E7EB; }
    .card-title { font-size: 1.25rem; font-weight: 700; color: #11243E; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .label { font-size: 0.75rem; color: #6B7280; text-transform: uppercase; font-weight: 600; }
    .notes-box { background: #F9FAFB; padding: 0.875rem; border-radius: 6px; border: 1px solid #E5E7EB; p { margin-top: 0.25rem; font-size: 0.875rem; color: #1F2937; } }
    .action-bar { padding-top: 1rem; border-top: 1px solid #E5E7EB; }
  `]
})
export class CleaningDetailComponent implements OnInit {
  private cleaningRepo = inject(CleaningRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = CleaningTaskStatus;
  public task: CleaningTask | null = null;
  public loading = true;

  ngOnInit(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('taskId'));
    if (taskId) {
      this.cleaningRepo.getCleaningTaskById(taskId).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success && res.data) {
            this.task = res.data;
          }
        },
        error: (err: Error) => {
          this.loading = false;
          this.toastService.error(err.message || 'Failed to load task details');
        }
      });
    }
  }

  completeTask(): void {
    if (!this.task) return;
    this.cleaningRepo.completeTask(this.task.id, { roomInspected: true, roomReady: true, maintenanceIssueFound: false, notes: 'Turnover completed' }).subscribe({
      next: () => {
        if (this.task) this.task.status = CleaningTaskStatus.COMPLETED;
        this.toastService.success('Cleaning completed and room marked AVAILABLE.', 'Completed');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/cleaning']);
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }
}
