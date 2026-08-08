import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metric-card" [class]="'metric-card--' + variant">
      <div class="metric-card__header">
        <span class="metric-card__title">{{ title }}</span>
        <span *ngIf="icon" class="metric-card__icon">{{ icon }}</span>
      </div>
      <div class="metric-card__value">{{ value }}</div>
      <p *ngIf="subtext" class="metric-card__subtext">{{ subtext }}</p>
    </div>
  `,
  styles: [`
    .metric-card {
      background-color: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 1.25rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      &__title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #6B7280;
      }

      &__icon {
        font-size: 1.25rem;
      }

      &__value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #11243E;
        line-height: 1.2;
      }

      &__subtext {
        font-size: 0.75rem;
        color: #6B7280;
        margin-top: 0.375rem;
      }

      &--accent {
        border-top: 3px solid #C99B4A;
      }
      &--success {
        border-top: 3px solid #16803C;
      }
      &--warning {
        border-top: 3px solid #B76E00;
      }
      &--danger {
        border-top: 3px solid #C62828;
      }
      &--info {
        border-top: 3px solid #2563EB;
      }
    }
  `]
})
export class MetricCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input() icon?: string;
  @Input() subtext?: string;
  @Input() variant: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'default';
}
