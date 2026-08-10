import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-backdrop" (click)="onCancel()"></div>
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" (click)="onCancel()">✕</button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn--outline" (click)="onCancel()">{{ cancelText }}</button>
          <button
            [class]="confirmButtonClass"
            [disabled]="loading"
            (click)="onConfirm()"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-backdrop {
      position: absolute;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .modal-box {
      position: relative;
      background-color: #FFFFFF;
      border-radius: 8px;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 10;
      overflow: hidden;
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #E5E7EB;
    }
    .modal-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #11243E;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 1.125rem;
      color: #6B7280;
      cursor: pointer;
    }
    .modal-body {
      padding: 1.25rem;
      font-size: 0.875rem;
      color: #374151;
      line-height: 1.5;
    }
    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background-color: #F9FAFB;
      border-top: 1px solid #E5E7EB;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      border: 1px solid transparent;
      &--outline { background: #FFF; border-color: #D1D5DB; color: #374151; }
      &--danger { background: #C62828; color: #FFF; }
      &--primary { background: #11243E; color: #FFF; }
    }
  `]
})
export class ConfirmationDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed with this operation?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() isDestructive = false;
  @Input() loading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get confirmButtonClass(): string {
    return this.isDestructive ? 'btn btn--danger' : 'btn btn--primary';
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
