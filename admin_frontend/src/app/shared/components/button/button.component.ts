import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick($event)"
    >
      <span *ngIf="loading" class="spinner"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 600;
      border-radius: 6px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      white-space: nowrap;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &--sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
      &--md { padding: 0.5rem 1rem; font-size: 0.875rem; }
      &--lg { padding: 0.75rem 1.5rem; font-size: 1rem; }

      &--primary {
        background-color: var(--primary-navy, #11243E);
        color: #FFFFFF;
        &:hover:not(:disabled) { background-color: #1B3A5D; }
      }
      &--secondary {
        background-color: #E5E7EB;
        color: #1F2937;
        &:hover:not(:disabled) { background-color: #D1D5DB; }
      }
      &--outline {
        background-color: transparent;
        border-color: #D1D5DB;
        color: #1F2937;
        &:hover:not(:disabled) { background-color: #F3F4F6; }
      }
      &--accent {
        background-color: var(--accent-gold, #C99B4A);
        color: #FFFFFF;
        &:hover:not(:disabled) { background-color: #B2873B; }
      }
      &--danger {
        background-color: #C62828;
        color: #FFFFFF;
        &:hover:not(:disabled) { background-color: #A71D1D; }
      }
    }

    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'accent' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;

  @Output() btnClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return `btn btn--${this.variant} btn--${this.size}`;
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }
}
