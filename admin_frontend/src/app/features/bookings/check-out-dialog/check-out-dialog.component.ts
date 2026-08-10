import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BookingSummary } from '../../../core/models';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-check-out-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, ButtonComponent],
  template: `
    <div class="modal-overlay" *ngIf="isOpen && booking">
      <div class="modal-backdrop" (click)="close.emit()"></div>
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">Guest Checkout Workflow</h3>
          <button class="modal-close" (click)="close.emit()">✕</button>
        </div>

        <form [formGroup]="checkOutForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="summary-card">
            <div class="summary-row">
              <span>Booking Ref:</span>
              <strong>{{ booking.bookingReference }}</strong>
            </div>
            <div class="summary-row">
              <span>Guest Name:</span>
              <strong>{{ booking.guestName }}</strong>
            </div>
            <div class="summary-row">
              <span>Occupied Room:</span>
              <strong>Room {{ booking.roomNumber }}</strong>
            </div>
          </div>

          <div *ngIf="booking.paymentStatus !== 'SUCCESS'" class="warning-banner">
            ⚠️ Warning: Outstanding payment status is {{ booking.paymentStatus }}. Verify settlement before checkout.
          </div>

          <app-form-field label="Housekeeping Notes">
            <textarea formControlName="cleaningNotes" rows="2" placeholder="Instructions for cleaning crew..." class="form-control"></textarea>
          </app-form-field>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="flagMaintenance" />
              <span>Flag Room Maintenance Issue Required</span>
            </label>
          </div>

          <app-form-field *ngIf="checkOutForm.value.flagMaintenance" label="Maintenance Issue Description">
            <textarea formControlName="maintenanceDescription" rows="2" placeholder="Specify repair issue..." class="form-control"></textarea>
          </app-form-field>

          <div class="modal-footer">
            <app-button type="button" variant="outline" (btnClick)="close.emit()">Cancel</app-button>
            <app-button
              type="submit"
              variant="primary"
              [loading]="loading"
            >
              Process Checkout & Dispatch Cleaning
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; z-index: 1050; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
    .modal-box { position: relative; background: #FFF; border-radius: 8px; width: 100%; max-width: 500px; z-index: 10; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid #E5E7EB; }
    .modal-title { font-size: 1.125rem; font-weight: 700; color: #11243E; }
    .modal-close { background: none; border: none; font-size: 1.125rem; color: #6B7280; cursor: pointer; }
    .modal-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
    .summary-card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 0.875rem; display: flex; flex-direction: column; gap: 0.375rem; font-size: 0.875rem; }
    .summary-row { display: flex; justify-content: space-between; color: #4B5563; }
    .warning-banner { padding: 0.75rem; background: #FEF3D6; border: 1px solid #F59E0B; border-radius: 6px; font-size: 0.8125rem; color: #92400E; }
    .checkbox-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: #374151; cursor: pointer; }
    .form-control { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; }
  `]
})
export class CheckOutDialogComponent {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() booking: BookingSummary | null = null;
  @Input() loading = false;

  @Output() close = new EventEmitter<void>();
  @Output() submitCheckOut = new EventEmitter<any>();

  public checkOutForm = this.fb.group({
    cleaningNotes: ['Standard post-checkout deep cleaning required.'],
    flagMaintenance: [false],
    maintenanceDescription: ['']
  });

  onSubmit(): void {
    this.submitCheckOut.emit(this.checkOutForm.value);
  }
}
