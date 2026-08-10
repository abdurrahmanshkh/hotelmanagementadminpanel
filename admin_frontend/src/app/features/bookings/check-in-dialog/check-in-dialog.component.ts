import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookingSummary } from '../../../core/models';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-check-in-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, ButtonComponent],
  template: `
    <div class="modal-overlay" *ngIf="isOpen && booking">
      <div class="modal-backdrop" (click)="close.emit()"></div>
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">Guest Check-In Workflow</h3>
          <button class="modal-close" (click)="close.emit()">✕</button>
        </div>

        <form [formGroup]="checkInForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="summary-card">
            <div class="summary-row">
              <span>Booking Reference:</span>
              <strong>{{ booking.bookingReference }}</strong>
            </div>
            <div class="summary-row">
              <span>Guest Name:</span>
              <strong>{{ booking.guestName }}</strong>
            </div>
            <div class="summary-row">
              <span>Assigned Room:</span>
              <strong>{{ booking.roomNumber }} ({{ booking.roomTypeName }})</strong>
            </div>
            <div class="summary-row">
              <span>Payment Status:</span>
              <span class="badge" [class.badge--success]="booking.paymentStatus === 'SUCCESS'">{{ booking.paymentStatus }}</span>
            </div>
          </div>

          <app-form-field label="Expected Arrival Time">
            <input type="time" formControlName="expectedArrivalTime" class="form-control" />
          </app-form-field>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="identityVerified" />
              <span>Government Identity Document Verified (Passport / Aadhaar)</span>
            </label>

            <label class="checkbox-label">
              <input type="checkbox" formControlName="roomReadyConfirmed" />
              <span>Room Inspected & Ready for Occupancy</span>
            </label>
          </div>

          <app-form-field label="Administrative Notes">
            <textarea formControlName="notes" rows="2" placeholder="Optional check-in notes..." class="form-control"></textarea>
          </app-form-field>

          <div class="modal-footer">
            <app-button type="button" variant="outline" (btnClick)="close.emit()">Cancel</app-button>
            <app-button
              type="submit"
              variant="accent"
              [loading]="loading"
              [disabled]="checkInForm.invalid"
            >
              Complete Check-In & Generate Passcode
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; z-index: 1050; display: flex; align-items: center; justify-content: center; padding: 1rem;
    }
    .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
    .modal-box { position: relative; background: #FFF; border-radius: 8px; width: 100%; max-width: 500px; z-index: 10; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid #E5E7EB; }
    .modal-title { font-size: 1.125rem; font-weight: 700; color: #11243E; }
    .modal-close { background: none; border: none; font-size: 1.125rem; color: #6B7280; cursor: pointer; }
    .modal-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
    .summary-card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 0.875rem; display: flex; flex-direction: column; gap: 0.375rem; font-size: 0.875rem; }
    .summary-row { display: flex; justify-content: space-between; color: #4B5563; }
    .checkbox-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: #374151; cursor: pointer; }
    .form-control { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; }
  `]
})
export class CheckInDialogComponent {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() booking: BookingSummary | null = null;
  @Input() loading = false;

  @Output() close = new EventEmitter<void>();
  @Output() submitCheckIn = new EventEmitter<any>();

  public checkInForm = this.fb.group({
    expectedArrivalTime: ['14:00'],
    identityVerified: [true, [Validators.requiredTrue]],
    roomReadyConfirmed: [true, [Validators.requiredTrue]],
    notes: ['']
  });

  onSubmit(): void {
    if (this.checkInForm.valid) {
      this.submitCheckIn.emit(this.checkInForm.value);
    }
  }
}
