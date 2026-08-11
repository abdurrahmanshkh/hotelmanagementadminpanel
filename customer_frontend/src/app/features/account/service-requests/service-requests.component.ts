import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRequestRepository } from '../../../core/repositories/contracts/service-request.repository';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ServiceRequest } from '../../../core/models';
import { formatDateDisplay } from '../../../core/utilities/date.utils';

@Component({
  selector: 'app-service-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  template: `
    <div class="services-page">
      <div class="header-box flex-gap">
        <div>
          <h2 class="title font-serif">Guest Service Requests</h2>
          <p class="sub">Order towels, housekeeping, luggage assistance, or report room maintenance.</p>
        </div>
        <app-button variant="primary" icon="sparkles" class="ml-auto" (click)="openModal()" (btnClick)="openModal()">
          New Service Request
        </app-button>
      </div>

      <!-- Requests Table / Cards -->
      <div class="card-box" *ngIf="requests.length > 0; else emptyBlock">
        <div class="request-item" *ngFor="let req of requests">
          <div class="req-type-icon">
            <app-icon [name]="getIcon(req.category)" [size]="20" color="#D97706"></app-icon>
          </div>
          <div class="req-details">
            <h4 class="req-type">{{ req.title }} &bull; Room {{ req.roomNumber || 'Guest' }}</h4>
            <p class="req-notes">{{ req.description }}</p>
            <span class="req-time">Requested {{ formatDate(req.createdAt) }}</span>
          </div>
          <div class="req-status ml-auto">
            <app-status-badge [status]="req.status"></app-status-badge>
          </div>
        </div>
      </div>

      <ng-template #emptyBlock>
        <app-empty-state
          icon="sparkles"
          title="No Service Requests Yet"
          description="Need extra towels or room cleaning? Tap New Service Request to inform our staff."
          actionText="Create Service Request"
          (action)="openModal()"
        ></app-empty-state>
      </ng-template>

      <!-- New Request Modal -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Submit Guest Service Request</h3>
            <button type="button" class="btn-close" (click)="closeModal()">
              <app-icon name="x" [size]="16"></app-icon>
            </button>
          </div>

          <form (ngSubmit)="onSubmitRequest()" class="modal-form">
            <div class="form-group">
              <label>Room Number</label>
              <input type="text" [(ngModel)]="newRoomNumber" name="roomNumber" required class="input font-mono" placeholder="302" />
            </div>

            <div class="form-group">
              <label>Request Category</label>
              <select [(ngModel)]="newCategory" name="newCategory" class="input">
                <option value="HOUSEKEEPING">Housekeeping / Room Clean</option>
                <option value="AMENITY_REFILL">Extra Towels &amp; Toiletries</option>
                <option value="MAINTENANCE">Maintenance / Aircon Repair</option>
                <option value="ROOM_SERVICE">In-Room Dining</option>
                <option value="OTHER">Other Guest Assistance</option>
              </select>
            </div>

            <div class="form-group">
              <label>Request Title</label>
              <input type="text" [(ngModel)]="newTitle" name="title" required class="input" placeholder="e.g. Extra Bath Towels" />
            </div>

            <div class="form-group">
              <label>Details / Instructions</label>
              <textarea [(ngModel)]="newNotes" name="notes" rows="3" required class="input" placeholder="e.g. Please bring 2 extra bath towels before 4 PM..."></textarea>
            </div>

            <div class="modal-actions flex-gap">
              <app-button variant="outline" (click)="closeModal()" (btnClick)="closeModal()">Cancel</app-button>
              <app-button type="submit" variant="primary" [loading]="isSubmitting">Submit Request</app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .services-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-box { .title { font-size: 1.5rem; font-weight: 800; color: #0F172A; } .sub { font-size: 0.875rem; color: #64748B; } .ml-auto { margin-left: auto; } }

    .card-box { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .request-item {
      display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px; background: #F8FAFC; border: 1px solid #E2E8F0;
      .req-type-icon { width: 40px; height: 40px; border-radius: 50%; background: #FFFBEB; border: 1px solid #FDE68A; display: flex; align-items: center; justify-content: center; }
      .req-details { flex: 1; .req-type { font-size: 0.9375rem; font-weight: 700; color: #0F172A; } .req-notes { font-size: 0.8125rem; color: #475569; margin: 0.125rem 0; } .req-time { font-size: 0.6875rem; color: #94A3B8; } }
      .ml-auto { margin-left: auto; }
    }

    .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal-box { background: #FFFFFF; border-radius: 16px; padding: 1.5rem; max-width: 460px; width: 100%; box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.2); }
    .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; h3 { font-size: 1.125rem; font-weight: 700; color: #0F172A; } .btn-close { background: none; border: none; cursor: pointer; } }
    .modal-form { display: flex; flex-direction: column; gap: 1rem; .form-group { display: flex; flex-direction: column; gap: 0.375rem; label { font-size: 0.8125rem; font-weight: 700; color: #0F172A; } .input { padding: 0.625rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.875rem; outline: none; } } }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
  `]
})
export class ServiceRequestsComponent implements OnInit {
  private serviceRepo = inject(ServiceRequestRepository);
  private authState = inject(AuthStateService);
  private toast = inject(ToastService);

  public requests: ServiceRequest[] = [];
  public isModalOpen = false;
  public isSubmitting = false;

  public newRoomNumber = '302';
  public newCategory = 'AMENITY_REFILL';
  public newTitle = 'Extra Towels';
  public newNotes = '';

  ngOnInit(): void {
    this.serviceRepo.getMyServiceRequests().subscribe({
      next: res => {
        if (res?.data) {
          this.requests = Array.isArray(res.data) ? res.data : (res.data.items || []);
        } else {
          this.requests = [];
        }
      },
      error: () => {
        this.requests = [];
      }
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  getIcon(category: string): string {
    switch (category) {
      case 'AMENITY_REFILL': return 'sparkles';
      case 'HOUSEKEEPING': return 'building';
      case 'MAINTENANCE': return 'shield';
      default: return 'bell';
    }
  }

  formatDate(dateStr: string): string {
    return formatDateDisplay(dateStr);
  }

  onSubmitRequest(): void {
    if (!this.newNotes || !this.newTitle) return;

    this.isSubmitting = true;
    this.serviceRepo.createServiceRequest({
      category: this.newCategory,
      title: this.newTitle,
      description: this.newNotes,
      priority: 'MEDIUM'
    }).subscribe({
      next: res => {
        this.isSubmitting = false;
        this.isModalOpen = false;
        if (res?.data) {
          this.requests.unshift(res.data);
        }
        this.newNotes = '';
        this.toast.success('Service request submitted to staff!');
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
