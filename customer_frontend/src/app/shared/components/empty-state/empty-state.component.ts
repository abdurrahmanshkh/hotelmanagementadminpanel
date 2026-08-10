import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <div class="empty-state">
      <div class="icon-circle">
        <app-icon [name]="icon" [size]="32" color="#64748B"></app-icon>
      </div>
      <h3 class="title">{{ title }}</h3>
      <p *ngIf="description" class="description">{{ description }}</p>
      <div *ngIf="actionText" class="action-box">
        <app-button variant="primary" (btnClick)="action.emit()">
          {{ actionText }}
        </app-button>
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
      padding: 3.5rem 1.5rem;

      .icon-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.25rem;
      }

      .title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #0F172A;
        margin-bottom: 0.5rem;
      }

      .description {
        font-size: 0.875rem;
        color: #64748B;
        max-width: 400px;
        line-height: 1.5;
        margin-bottom: 1.5rem;
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
}
