import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MaintenanceRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Priority } from '../../../core/models';

@Component({
  selector: 'app-maintenance-form',
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
    <div class="maintenance-form-page">
      <app-page-header title="Log Maintenance Ticket" subtitle="Report room or facility repair issue and block room status">
        <div actions class="header-actions">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Cancel</app-button>
        </div>
      </app-page-header>

      <div class="card form-card">
        <form [formGroup]="maintenanceForm" (ngSubmit)="onSubmit()" class="ticket-form">
          <div class="form-grid">
            <app-form-field label="Target Room Number" [required]="true">
              <input type="text" formControlName="roomNumber" placeholder="e.g. 101" class="form-control" />
            </app-form-field>

            <app-form-field label="Ticket Priority" [required]="true">
              <select formControlName="priority" class="form-control">
                <option [value]="PriorityEnum.LOW">LOW</option>
                <option [value]="PriorityEnum.MEDIUM">MEDIUM</option>
                <option [value]="PriorityEnum.HIGH">HIGH</option>
                <option [value]="PriorityEnum.URGENT">URGENT</option>
              </select>
            </app-form-field>
          </div>

          <app-form-field label="Issue Title / Summary" [required]="true">
            <input type="text" formControlName="title" placeholder="e.g. AC Cooling Unit Repair" class="form-control" />
          </app-form-field>

          <app-form-field label="Detailed Issue Description">
            <textarea formControlName="description" rows="3" placeholder="Describe repair issue..." class="form-control"></textarea>
          </app-form-field>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="blockRoom" />
              <span class="warning-text">Block room status to MAINTENANCE (prevents new guest check-ins)</span>
            </label>
          </div>

          <div class="form-actions">
            <app-button type="button" variant="outline" (btnClick)="goBack()">Cancel</app-button>
            <app-button type="submit" variant="accent" [loading]="submitting" [disabled]="maintenanceForm.invalid">
              🔧 Create Repair Ticket
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .maintenance-form-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .form-card { padding: 1.5rem; max-width: 700px; }
    .ticket-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; @media (max-width: 640px) { grid-template-columns: 1fr; } }
    .form-control { width: 100%; padding: 0.625rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .checkbox-group { display: flex; align-items: center; gap: 0.5rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #374151; cursor: pointer; }
    .warning-text { color: #C62828; font-weight: 600; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; }
  `]
})
export class MaintenanceFormComponent {
  private fb = inject(FormBuilder);
  private maintenanceRepo = inject(MaintenanceRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public PriorityEnum = Priority;
  public submitting = false;

  public maintenanceForm = this.fb.group({
    roomNumber: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: [''],
    priority: [Priority.HIGH, [Validators.required]],
    blockRoom: [true]
  });

  onSubmit(): void {
    if (this.maintenanceForm.invalid) return;
    this.submitting = true;
    const val = this.maintenanceForm.value;

    this.maintenanceRepo.createRecord(val as any).subscribe({
      next: () => {
        this.submitting = false;
        this.toastService.success('Maintenance ticket logged. Room status updated.', 'Ticket Logged');
        this.goBack();
      },
      error: (err: Error) => {
        this.submitting = false;
        this.toastService.error(err.message || 'Failed to log ticket');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/maintenance']);
  }
}
