import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      [type]="type"
      [class]="'btn btn--' + variant + ' btn--' + size + (fullWidth ? ' btn--full' : '')"
      [disabled]="disabled || loading"
      (click)="onClick($event)"
    >
      <span *ngIf="loading" class="spinner"></span>
      <app-icon *ngIf="icon && !loading" [name]="icon" [size]="iconSize" className="btn__icon"></app-icon>
      <span class="btn__label"><ng-content></ng-content></span>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      border: 1px solid transparent;
      outline: none;
      white-space: nowrap;

      &--primary {
        background-color: #D97706;
        color: #FFFFFF;
        &:hover:not(:disabled) { background-color: #B45309; }
      }

      &--secondary {
        background-color: #0F172A;
        color: #FFFFFF;
        &:hover:not(:disabled) { background-color: #1E293B; }
      }

      &--outline {
        background-color: transparent;
        border-color: #CBD5E1;
        color: #334155;
        &:hover:not(:disabled) { background-color: #F8FAFC; border-color: #94A3B8; }
      }

      &--ghost {
        background-color: transparent;
        color: #475569;
        &:hover:not(:disabled) { background-color: #F1F5F9; color: #0F172A; }
      }

      &--danger {
        background-color: #BE123C;
        color: #FFFFFF;
        &:hover:not(:disabled) { background-color: #9F1239; }
      }

      &--sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
      &--md { padding: 0.5625rem 1.125rem; font-size: 0.875rem; }
      &--lg { padding: 0.75rem 1.5rem; font-size: 1rem; }

      &--full { width: 100%; }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  @Output() btnClick = new EventEmitter<MouseEvent>();

  get iconSize(): number {
    return this.size === 'sm' ? 14 : this.size === 'lg' ? 20 : 16;
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }
}
