import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RoomRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { RoomDetails, RoomStatus } from '../../../core/models';

@Component({
  selector: 'app-room-detail',
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
    <div class="room-detail-page">
      <app-page-header
        [title]="room ? 'Room ' + room.roomNumber : 'Loading Room...'"
        subtitle="Physical room inventory record, operational status & maintenance log"
      >
        <div actions class="header-actions" *ngIf="room">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Back to Inventory</app-button>
          <app-button variant="primary" size="sm" (btnClick)="editRoom()">✏️ Edit Room</app-button>
        </div>
      </app-page-header>

      <app-skeleton-loader *ngIf="loading" height="300px"></app-skeleton-loader>

      <div *ngIf="room && !loading" class="detail-grid card">
        <div class="room-header flex-between">
          <div>
            <h2 class="room-title">Room {{ room.roomNumber }}</h2>
            <span class="room-type-tag">{{ room.roomTypeName }}</span>
          </div>
          <app-status-badge [status]="room.status"></app-status-badge>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Floor Level:</span>
            <strong>Floor {{ room.floor }}</strong>
          </div>
          <div class="info-item">
            <span class="label">Category:</span>
            <strong>{{ room.roomTypeName }}</strong>
          </div>
          <div class="info-item">
            <span class="label">Active Status:</span>
            <span class="badge" [class.badge--success]="room.isActive">{{ room.isActive ? 'ACTIVE' : 'INACTIVE' }}</span>
          </div>
        </div>

        <div class="status-change-bar">
          <h4>Change Operational Status:</h4>
          <div class="status-buttons">
            <button class="btn-status" (click)="changeStatus(StatusEnum.AVAILABLE)">Mark AVAILABLE</button>
            <button class="btn-status" (click)="changeStatus(StatusEnum.UNDER_CLEANING)">Send to CLEANING</button>
            <button class="btn-status" (click)="changeStatus(StatusEnum.MAINTENANCE)">Flag MAINTENANCE</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .room-detail-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .detail-grid { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; max-width: 700px; }
    .room-header { padding-bottom: 1rem; border-bottom: 1px solid #E5E7EB; }
    .room-title { font-size: 1.5rem; font-weight: 700; color: #11243E; }
    .room-type-tag { font-size: 0.8125rem; color: #C99B4A; font-weight: 600; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .label { font-size: 0.75rem; color: #6B7280; text-transform: uppercase; font-weight: 600; }
    .status-change-bar { padding-top: 1rem; border-top: 1px solid #E5E7EB; h4 { font-size: 0.875rem; color: #11243E; margin-bottom: 0.5rem; } }
    .status-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .btn-status { padding: 0.375rem 0.75rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; &:hover { background: #11243E; color: #FFF; } }
  `]
})
export class RoomDetailComponent implements OnInit {
  private roomRepo = inject(RoomRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = RoomStatus;
  public room: RoomDetails | null = null;
  public loading = true;

  ngOnInit(): void {
    const roomId = Number(this.route.snapshot.paramMap.get('roomId'));
    if (roomId) {
      this.roomRepo.getRoomById(roomId).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success && res.data) {
            this.room = res.data;
          }
        },
        error: (err: Error) => {
          this.loading = false;
          this.toastService.error(err.message || 'Failed to load room details');
        }
      });
    }
  }

  changeStatus(status: RoomStatus): void {
    if (!this.room) return;
    this.roomRepo.updateRoomStatus(this.room.id, status).subscribe({
      next: () => {
        if (this.room) this.room.status = status;
        this.toastService.success(`Room status updated to ${status}`, 'Status Saved');
      },
      error: (err: Error) => {
        this.toastService.error(err.message || 'Status update failed');
      }
    });
  }

  editRoom(): void {
    if (this.room) this.router.navigate(['/admin/rooms', this.room.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/admin/rooms']);
  }
}
