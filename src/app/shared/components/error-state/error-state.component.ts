import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-state">
      <div class="error-state__icon">⚠️</div>
      <h3 class="error-state__title">{{ title }}</h3>
      <p class="error-state__message">{{ message }}</p>
      <div *ngIf="showRetry" class="error-state__action">
        <button class="btn btn--outline" (click)="onRetry()">Try Again</button>
      </div>
    </div>
  `,
  styles: [`
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2.5rem 1.5rem;
      background-color: #FCE8E6;
      border: 1px solid #F87171;
      border-radius: 8px;

      &__icon {
        font-size: 2.5rem;
        margin-bottom: 0.75rem;
      }

      &__title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #C62828;
        margin-bottom: 0.375rem;
      }

      &__message {
        font-size: 0.875rem;
        color: #7F1D1D;
        max-width: 450px;
        line-height: 1.4;
        margin-bottom: 1rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        background-color: #FFFFFF;
        border: 1px solid #DC2626;
        color: #C62828;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        &:hover { background-color: #FEF2F2; }
      }
    }
  `]
})
export class ErrorStateComponent {
  @Input() title = 'An Error Occurred';
  @Input() message = 'Failed to load data. Please check your connection and try again.';
  @Input() showRetry = true;

  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
