import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PaymentRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PaymentDetails } from '../../../core/models';

@Component({
  selector: 'app-refund-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    ButtonComponent
  ],
  template: `
    <div *ngIf="isOpen" class="modal-overlay" (click)="close()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header flex-between">
          <h3>Process Payment Refund</h3>
          <button class="close-btn" (click)="close()">✕</button>
        </div>

        <div *ngIf="payment" class="refund-dialog-body">
          <div class="summary-box">
            <div class="summary-item">
              <span class="label">Original Amount:</span>
              <strong>₹{{ payment.amount }}</strong>
            </div>
            <div class="summary-item">
              <span class="label">Refunded So Far:</span>
              <strong>₹{{ payment.refundedAmount || 0 }}</strong>
            </div>
            <div class="summary-item">
              <span class="label">Max Refundable:</span>
              <strong class="highlight">₹{{ maxRefundable }}</strong>
            </div>
          </div>

          <form [formGroup]="refundForm" (ngSubmit)="submitRefund()" class="refund-form">
            <app-form-field label="Refund Amount (₹)" [required]="true">
              <input type="number" formControlName="amount" [max]="maxRefundable" class="form-control" />
            </app-form-field>

            <app-form-field label="Reason for Refund" [required]="true">
              <textarea formControlName="reason" rows="3" placeholder="Provide refund justification..." class="form-control"></textarea>
            </app-form-field>

            <div class="dialog-actions">
              <app-button type="button" variant="outline" (btnClick)="close()">Cancel</app-button>
              <app-button type="submit" variant="accent" [loading]="submitting" [disabled]="refundForm.invalid">
                Process Refund
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal-card { background: #FFF; border-radius: 8px; width: 100%; max-width: 500px; padding: 1.25rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 1rem; }
    .modal-header { padding-bottom: 0.75rem; border-bottom: 1px solid #E5E7EB; h3 { font-size: 1.125rem; font-weight: 700; color: #11243E; } }
    .close-btn { background: none; border: none; font-size: 1rem; color: #9CA3AF; cursor: pointer; &:hover { color: #11243E; } }
    .refund-dialog-body { display: flex; flex-direction: column; gap: 1.25rem; }
    .summary-box { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; background: #F9FAFB; padding: 0.875rem; border-radius: 6px; border: 1px solid #E5E7EB; }
    .summary-item { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8125rem; }
    .label { color: #6B7280; text-transform: uppercase; font-size: 0.7rem; font-weight: 600; }
    .highlight { color: #16803C; font-size: 1rem; }
    .refund-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #E5E7EB; }
  `]
})
export class RefundDialogComponent {
  private fb = inject(FormBuilder);
  private paymentRepo = inject(PaymentRepository);
  private toastService = inject(ToastService);

  @Input() isOpen = false;
  @Input() payment: PaymentDetails | null = null;
  @Output() refundProcessed = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();

  public submitting = false;

  public refundForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    reason: ['', [Validators.required]]
  });

  get maxRefundable(): number {
    if (!this.payment) return 0;
    return this.payment.amount - (this.payment.refundedAmount || 0);
  }

  ngOnChanges(): void {
    if (this.payment) {
      const max = this.maxRefundable;
      this.refundForm.patchValue({
        amount: max,
        reason: 'Guest requested refund'
      });
    }
  }

  submitRefund(): void {
    if (this.refundForm.invalid || !this.payment) return;
    const amount = Number(this.refundForm.value.amount);
    const reason = String(this.refundForm.value.reason);

    if (amount > this.maxRefundable) {
      this.toastService.error(`Refund amount cannot exceed maximum refundable ₹${this.maxRefundable}`);
      return;
    }

    this.submitting = true;
    this.paymentRepo.processRefund(this.payment.id, { amount, reason }).subscribe({
      next: () => {
        this.submitting = false;
        this.toastService.success(`Successfully processed ₹${amount} refund.`, 'Refund Processed');
        this.refundProcessed.emit();
        this.close();
      },
      error: (err: Error) => {
        this.submitting = false;
        this.toastService.error(err.message || 'Refund processing failed');
      }
    });
  }

  close(): void {
    this.closeDialog.emit();
  }
}
