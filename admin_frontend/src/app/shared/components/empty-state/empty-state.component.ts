import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="empty-state">
      <div class="empty-state__icon-box">
        <app-icon [name]="icon" [size]="32" color="#64748B"></app-icon>
      </div>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p *ngIf="description" class="empty-state__description">{{ description }}</p>
      <div *ngIf="actionText" class="empty-state__action">
        <button class="btn-action-primary" (click)="onAction()">{{ actionText }}</button>
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

      &__icon-box {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }

      &__title {
        font-size: 1rem;
        font-weight: 700;
        color: #0F172A;
        margin-bottom: 0.375rem;
      }

      &__description {
        font-size: 0.8125rem;
        color: #64748B;
        max-width: 380px;
        line-height: 1.5;
        margin-bottom: 1.25rem;
      }

      .btn-action-primary {
        padding: 0.5rem 1rem;
        background-color: #0F172A;
        color: #FFFFFF;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.8125rem;
        cursor: pointer;
        transition: background 0.15s;

        &:hover {
          background-color: #1E293B;
        }
      }
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'building';
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() actionText?: string;

  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
