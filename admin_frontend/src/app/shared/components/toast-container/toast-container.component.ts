import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toastService.toasts()"
        [class]="'toast toast--' + toast.type"
      >
        <div class="toast__icon-box">
          <app-icon [name]="getToastIcon(toast.type)" [size]="18" [color]="getIconColor(toast.type)"></app-icon>
        </div>

        <div class="toast__content">
          <h4 *ngIf="toast.title" class="toast__title">{{ toast.title }}</h4>
          <p class="toast__message">{{ toast.message }}</p>
        </div>

        <button class="toast__close" (click)="dismiss(toast.id)">
          <app-icon name="x" [size]="14" color="#94A3B8"></app-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      width: 100%;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background-color: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05);
      border: 1px solid #E2E8F0;
      border-left-width: 4px;
      animation: slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      &--success { border-left-color: #047857; }
      &--error { border-left-color: #BE123C; }
      &--warning { border-left-color: #B45309; }
      &--info { border-left-color: #0369A1; }

      &__icon-box {
        margin-top: 0.125rem;
      }

      &__content {
        flex: 1;
      }

      &__title {
        font-size: 0.875rem;
        font-weight: 700;
        color: #0F172A;
        margin-bottom: 0.125rem;
      }

      &__message {
        font-size: 0.8125rem;
        color: #475569;
        line-height: 1.4;
      }

      &__close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.125rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover { background: #F1F5F9; }
      }
    }

    @keyframes slide-up {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ToastContainerComponent {
  public toastService = inject(ToastService);

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success': return 'check';
      case 'error': return 'x';
      case 'warning': return 'shield';
      default: return 'bell';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'success': return '#047857';
      case 'error': return '#BE123C';
      case 'warning': return '#B45309';
      default: return '#0369A1';
    }
  }
}
