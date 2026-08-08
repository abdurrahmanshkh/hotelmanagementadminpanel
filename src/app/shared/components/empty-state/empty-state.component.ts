import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">{{ icon }}</div>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p *ngIf="description" class="empty-state__description">{{ description }}</p>
      <div *ngIf="actionText" class="empty-state__action">
        <button class="btn btn--primary" (click)="onAction()">{{ actionText }}</button>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 1.5rem;

      &__icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #9CA3AF;
      }

      &__title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #11243E;
        margin-bottom: 0.375rem;
      }

      &__description {
        font-size: 0.875rem;
        color: #6B7280;
        max-width: 400px;
        line-height: 1.5;
        margin-bottom: 1.25rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        background-color: #11243E;
        color: #FFF;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
      }
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = '📂';
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() actionText?: string;

  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
