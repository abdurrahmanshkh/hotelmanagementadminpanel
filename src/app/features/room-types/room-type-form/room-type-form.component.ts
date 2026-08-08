import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RoomRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-room-type-form',
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
    <div class="room-type-form-page">
      <app-page-header
        [title]="isEditMode ? 'Edit Category - ' + categoryName : 'Create New Room Type'"
        subtitle="Configure base price, min/max dynamic bounds & occupancy rules"
      >
        <div actions class="header-actions">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Cancel</app-button>
        </div>
      </app-page-header>

      <div class="card form-card">
        <form [formGroup]="typeForm" (ngSubmit)="onSubmit()" class="type-form">
          <div class="form-grid">
            <app-form-field label="Category Name" [required]="true">
              <input type="text" formControlName="name" placeholder="e.g. Deluxe Suite" class="form-control" />
            </app-form-field>

            <app-form-field label="Category Code" [required]="true">
              <input type="text" formControlName="code" placeholder="e.g. DELUXE_SUITE" class="form-control" />
            </app-form-field>

            <app-form-field label="Adult Capacity" [required]="true">
              <input type="number" formControlName="adultCapacity" class="form-control" />
            </app-form-field>

            <app-form-field label="Child Capacity" [required]="true">
              <input type="number" formControlName="childCapacity" class="form-control" />
            </app-form-field>

            <app-form-field label="Base Nightly Price (₹)" [required]="true">
              <input type="number" formControlName="basePrice" class="form-control" />
            </app-form-field>

            <app-form-field label="Minimum Price (₹)" [required]="true">
              <input type="number" formControlName="minimumPrice" class="form-control" />
            </app-form-field>

            <app-form-field label="Maximum Price (₹)" [required]="true">
              <input type="number" formControlName="maximumPrice" class="form-control" />
            </app-form-field>
          </div>

          <app-form-field label="Category Description">
            <textarea formControlName="description" rows="3" placeholder="Description..." class="form-control"></textarea>
          </app-form-field>

          <div class="form-actions">
            <app-button type="button" variant="outline" (btnClick)="goBack()">Cancel</app-button>
            <app-button type="submit" variant="accent" [loading]="submitting" [disabled]="typeForm.invalid">
              {{ isEditMode ? 'Save Category Changes' : 'Create Room Type' }}
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .room-type-form-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .form-card { padding: 1.5rem; max-width: 760px; }
    .type-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; @media (max-width: 640px) { grid-template-columns: 1fr; } }
    .form-control { width: 100%; padding: 0.625rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; }
  `]
})
export class RoomTypeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roomRepo = inject(RoomRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public isEditMode = false;
  public roomTypeId: number | null = null;
  public categoryName = '';
  public submitting = false;

  public typeForm = this.fb.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required]],
    adultCapacity: [2, [Validators.required, Validators.min(1)]],
    childCapacity: [2, [Validators.required, Validators.min(0)]],
    basePrice: [3500, [Validators.required, Validators.min(0)]],
    minimumPrice: [2500, [Validators.required, Validators.min(0)]],
    maximumPrice: [7500, [Validators.required, Validators.min(0)]],
    bedType: ['King Bed'],
    roomSizeSqFt: [350],
    description: [''],
    amenityIds: [[] as number[]],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('roomTypeId');
    if (id) {
      this.isEditMode = true;
      this.roomTypeId = Number(id);
      this.loadTypeDetails(this.roomTypeId);
    }
  }

  loadTypeDetails(id: number): void {
    this.roomRepo.getRoomTypeById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const t = res.data;
          this.categoryName = t.name;
          this.typeForm.patchValue({
            name: t.name,
            code: t.code,
            adultCapacity: t.adultCapacity,
            childCapacity: t.childCapacity,
            basePrice: t.basePrice,
            minimumPrice: t.minimumPrice,
            maximumPrice: t.maximumPrice,
            bedType: t.bedType || 'King Bed',
            roomSizeSqFt: t.roomSizeSqFt || 350,
            description: t.description || '',
            isActive: t.isActive
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.typeForm.invalid) return;
    this.submitting = true;
    const val = this.typeForm.value;

    if (this.isEditMode && this.roomTypeId) {
      this.roomRepo.updateRoomType(this.roomTypeId, val as any).subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Room type updated successfully.', 'Saved');
          this.goBack();
        },
        error: (err: Error) => {
          this.submitting = false;
          this.toastService.error(err.message || 'Update failed');
        }
      });
    } else {
      this.roomRepo.createRoomType(val as any).subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Room type created successfully.', 'Created');
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
    this.router.navigate(['/admin/room-types']);
  }
}
