import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toastService.toasts()"
        [class]="'toast toast--' + toast.type"
      >
        <div class="toast__content">
          <h4 *ngIf="toast.title" class="toast__title">{{ toast.title }}</h4>
          <p class="toast__message">{{ toast.message }}</p>
        </div>
        <button class="toast__close" (click)="dismiss(toast.id)">✕</button>
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
      max-width: 360px;
      width: 100%;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background-color: #FFFFFF;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid #11243E;

      &--success { border-left-color: #16803C; }
      &--error { border-left-color: #C62828; }
      &--warning { border-left-color: #B76E00; }
      &--info { border-left-color: #2563EB; }

      &__title {
        font-size: 0.875rem;
        font-weight: 700;
        color: #11243E;
        margin-bottom: 0.125rem;
      }

      &__message {
        font-size: 0.8125rem;
        color: #374151;
        line-height: 1.4;
      }

      &__close {
        background: none;
        border: none;
        font-size: 0.875rem;
        color: #9CA3AF;
        cursor: pointer;
        &:hover { color: #374151; }
      }
    }
  `]
})
export class ToastContainerComponent {
  public toastService = inject(ToastService);

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
