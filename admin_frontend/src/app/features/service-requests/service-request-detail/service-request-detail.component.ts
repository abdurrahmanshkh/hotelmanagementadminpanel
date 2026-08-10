import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceRequestRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../../shared/components/priority-badge/priority-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ServiceRequest, ServiceRequestStatus } from '../../../core/models';

@Component({
  selector: 'app-service-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    PriorityBadgeComponent,
    ButtonComponent,
    SkeletonLoaderComponent
  ],
  template: `
    <div class="service-detail-page">
      <app-page-header
        [title]="request ? 'Service Request - ' + request.referenceNumber : 'Loading Request...'"
        subtitle="Guest request fulfillment, staff assignment & timestamp logs"
      >
        <div actions class="header-actions" *ngIf="request">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Back to List</app-button>
        </div>
      </app-page-header>

      <app-skeleton-loader *ngIf="loading" height="350px"></app-skeleton-loader>

      <div *ngIf="request && !loading" class="detail-grid">
        <!-- Main Request Info -->
        <div class="card detail-card">
          <div class="card-header flex-between">
            <div class="header-title-box">
              <span class="category-badge">{{ request.category }}</span>
              <h2 class="request-title">{{ request.title }}</h2>
            </div>
            <div class="badges-row">
              <app-priority-badge [priority]="request.priority"></app-priority-badge>
              <app-status-badge [status]="request.status"></app-status-badge>
            </div>
          </div>

          <div class="request-body">
            <h4 class="section-subtitle">Guest Request Description:</h4>
            <p class="description-text">{{ request.description }}</p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">Guest Name:</span>
              <strong>{{ request.guestName }}</strong>
            </div>
            <div class="info-item">
              <span class="label">Room Number:</span>
              <strong>Room {{ request.roomNumber }}</strong>
            </div>
            <div class="info-item">
              <span class="label">Requested At:</span>
              <span>{{ formatDate(request.requestedAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Assigned Staff:</span>
              <strong>{{ request.assignedStaffName || 'Unassigned' }}</strong>
            </div>
          </div>

          <div class="action-bar">
            <button
              *ngIf="request.status === StatusEnum.PENDING"
              class="btn btn--primary"
              (click)="updateStatus(StatusEnum.ACCEPTED)"
            >
              Accept Request
            </button>
            <button
              *ngIf="request.status === StatusEnum.ACCEPTED"
              class="btn btn--accent"
              (click)="updateStatus(StatusEnum.IN_PROGRESS)"
            >
              Start Fulfillment
            </button>
            <button
              *ngIf="request.status === StatusEnum.IN_PROGRESS || request.status === StatusEnum.ACCEPTED"
              class="btn btn--success"
              (click)="updateStatus(StatusEnum.COMPLETED)"
            >
              Mark Completed
            </button>
          </div>
        </div>

        <!-- Staff Assignment Panel -->
        <div class="card assign-card">
          <h3 class="card-title">Staff Assignment & Escalation</h3>

          <div class="assign-form">
            <label class="label">Assign Staff Technician / Housekeeper:</label>
            <select [(ngModel)]="selectedStaffId" class="form-control">
              <option [value]="0">-- Select Staff Member --</option>
              <option [value]="101">Marcus Vance (Housekeeping Lead)</option>
              <option [value]="102">Elena Rostova (Front-Desk Staff)</option>
              <option [value]="103">David Miller (Maintenance Specialist)</option>
            </select>
            <app-button variant="primary" size="md" (btnClick)="assignStaff()">
              Assign Staff Member
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .service-detail-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .detail-grid { display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; @media (max-width: 1023px) { grid-template-columns: 1fr; } }
    .detail-card, .assign-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .card-header { padding-bottom: 0.875rem; border-bottom: 1px solid #E5E7EB; }
    .category-badge { font-size: 0.7rem; font-weight: 700; color: #C99B4A; text-transform: uppercase; }
    .request-title { font-size: 1.25rem; font-weight: 700; color: #11243E; }
    .badges-row { display: flex; align-items: center; gap: 0.5rem; }
    .section-subtitle { font-size: 0.8125rem; font-weight: 600; color: #6B7280; margin-bottom: 0.375rem; }
    .description-text { font-size: 0.9375rem; color: #1F2937; line-height: 1.5; background: #F9FAFB; padding: 0.875rem; border-radius: 6px; border: 1px solid #E5E7EB; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .label { font-size: 0.75rem; color: #6B7280; text-transform: uppercase; font-weight: 600; }
    .action-bar { display: flex; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; }
    .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; &--primary { background: #11243E; color: #FFF; } &--accent { background: #C99B4A; color: #FFF; } &--success { background: #16803C; color: #FFF; } }
    .card-title { font-size: 1.125rem; font-weight: 700; color: #11243E; }
    .assign-form { display: flex; flex-direction: column; gap: 0.75rem; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
  `]
})
export class ServiceRequestDetailComponent implements OnInit {
  private serviceRepo = inject(ServiceRequestRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = ServiceRequestStatus;

  public request: ServiceRequest | null = null;
  public loading = true;
  public selectedStaffId = 0;

  ngOnInit(): void {
    const requestId = Number(this.route.snapshot.paramMap.get('requestId'));
    if (requestId) {
      this.serviceRepo.getRequestById(requestId).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success && res.data) {
            this.request = res.data;
            this.selectedStaffId = this.request.assignedStaffId || 0;
          }
        },
        error: (err: Error) => {
          this.loading = false;
          this.toastService.error(err.message || 'Failed to load service request');
        }
      });
    }
  }

  updateStatus(status: ServiceRequestStatus): void {
    if (!this.request) return;
    this.serviceRepo.updateStatus(this.request.id, { status }).subscribe({
      next: (res) => {
        if (this.request && res.data) this.request.status = res.data.status;
        this.toastService.success(`Request status updated to ${status}`, 'Updated');
      },
      error: (err: Error) => {
        this.toastService.error(err.message || 'Status update failed');
      }
    });
  }

  assignStaff(): void {
    if (!this.request || !this.selectedStaffId) return;
    const staffNames: Record<number, string> = {
      101: 'Marcus Vance',
      102: 'Elena Rostova',
      103: 'David Miller'
    };
    const staffName = staffNames[this.selectedStaffId] || 'Assigned Staff';
    this.serviceRepo.assignStaff(this.request.id, { staffId: this.selectedStaffId, staffName }).subscribe({
      next: () => {
        if (this.request) this.request.assignedStaffName = staffName;
        this.toastService.success(`Assigned to ${staffName}`, 'Staff Assigned');
      },
      error: (err: Error) => {
        this.toastService.error(err.message || 'Assignment failed');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/service-requests']);
  }

  formatDate(dateStr: string): string {
    return DateFormatter.formatDate(dateStr);
  }
}
