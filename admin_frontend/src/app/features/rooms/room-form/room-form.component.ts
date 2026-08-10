import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RoomRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RoomType, RoomStatus } from '../../../core/models';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PageHeaderComponent,
    FormFieldComponent,
    ButtonComponent
  ],
  template: `
    <div class="room-form-page">
      <app-page-header
        [title]="isEditMode ? 'Edit Room ' + roomNumber : 'Create New Room'"
        subtitle="Configure physical room number, floor assignment & category"
      >
        <div actions class="header-actions">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Cancel</app-button>
        </div>
      </app-page-header>

      <div class="card form-card">
        <form [formGroup]="roomForm" (ngSubmit)="onSubmit()" class="room-form">
          <div class="form-grid">
            <app-form-field label="Room Number" [required]="true">
              <input type="text" formControlName="roomNumber" placeholder="e.g. 101" class="form-control" />
            </app-form-field>

            <app-form-field label="Floor Number" [required]="true">
              <input type="number" formControlName="floor" placeholder="e.g. 1" class="form-control" />
            </app-form-field>

            <app-form-field label="Room Type Category" [required]="true">
              <select formControlName="roomTypeId" class="form-control">
                <option [value]="0">-- Select Room Type --</option>
                <option *ngFor="let type of roomTypes" [value]="type.id">{{ type.name }} (₹{{ type.basePrice }}/night)</option>
              </select>
            </app-form-field>

            <app-form-field label="Initial Operational Status" [required]="true">
              <select formControlName="status" class="form-control">
                <option [value]="StatusEnum.AVAILABLE">AVAILABLE</option>
                <option [value]="StatusEnum.UNDER_CLEANING">UNDER_CLEANING</option>
                <option [value]="StatusEnum.MAINTENANCE">MAINTENANCE</option>
              </select>
            </app-form-field>
          </div>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="isActive" />
              <span>Room is active and visible for booking allocations</span>
            </label>
          </div>

          <div class="form-actions">
            <app-button type="button" variant="outline" (btnClick)="goBack()">Cancel</app-button>
            <app-button type="submit" variant="accent" [loading]="submitting" [disabled]="roomForm.invalid">
              {{ isEditMode ? 'Save Room Changes' : 'Create Room' }}
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .room-form-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .form-card { padding: 1.5rem; max-width: 700px; }
    .room-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; @media (max-width: 640px) { grid-template-columns: 1fr; } }
    .form-control { width: 100%; padding: 0.625rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .checkbox-group { display: flex; align-items: center; gap: 0.5rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #374151; cursor: pointer; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; }
  `]
})
export class RoomFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roomRepo = inject(RoomRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = RoomStatus;
  public isEditMode = false;
  public roomId: number | null = null;
  public roomNumber = '';
  public roomTypes: RoomType[] = [];
  public submitting = false;

  public roomForm = this.fb.group({
    roomNumber: ['', [Validators.required]],
    floor: [1, [Validators.required, Validators.min(1)]],
    roomTypeId: [0, [Validators.required, Validators.min(1)]],
    status: [RoomStatus.AVAILABLE, [Validators.required]],
    isActive: [true]
  });

  ngOnInit(): void {
    this.loadRoomTypes();
    const id = this.route.snapshot.paramMap.get('roomId');
    if (id) {
      this.isEditMode = true;
      this.roomId = Number(id);
      this.loadRoomDetails(this.roomId);
    }
  }

  loadRoomTypes(): void {
    this.roomRepo.getRoomTypes().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.roomTypes = res.data;
        }
      }
    });
  }

  loadRoomDetails(id: number): void {
    this.roomRepo.getRoomById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const r = res.data;
          this.roomNumber = r.roomNumber;
          this.roomForm.patchValue({
            roomNumber: r.roomNumber,
            floor: r.floor,
            roomTypeId: r.roomTypeId,
            status: r.status,
            isActive: r.isActive
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.roomForm.invalid) return;
    this.submitting = true;
    const val = this.roomForm.value;

    const payload: any = {
      roomNumber: val.roomNumber,
      floor: val.floor,
      roomTypeId: val.roomTypeId,
      status: val.status,
      isActive: val.isActive
    };

    if (this.isEditMode && this.roomId) {
      this.roomRepo.updateRoom(this.roomId, payload).subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Room updated successfully.', 'Saved');
          this.goBack();
        },
        error: (err: Error) => {
          this.submitting = false;
          this.toastService.error(err.message || 'Update failed');
        }
      });
    } else {
      this.roomRepo.createRoom(payload).subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('New room created successfully.', 'Created');
          this.goBack();
        },
        error: (err: Error) => {
          this.submitting = false;
          this.toastService.error(err.message || 'Creation failed');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/rooms']);
  }
}
