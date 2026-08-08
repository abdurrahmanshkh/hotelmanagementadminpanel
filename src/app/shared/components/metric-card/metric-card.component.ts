import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="metric-card" [class]="'metric-card--' + variant">
      <div class="metric-card__header flex-between">
        <span class="metric-card__title">{{ title }}</span>
        <div class="metric-card__icon-box" *ngIf="icon">
          <app-icon [name]="icon" [size]="18" [color]="iconColor"></app-icon>
        </div>
      </div>

      <div class="metric-card__value font-mono">{{ value }}</div>

      <div *ngIf="subtext || trend" class="metric-card__footer flex-between">
        <span *ngIf="subtext" class="metric-card__subtext">{{ subtext }}</span>
        <span *ngIf="trend" class="trend-badge" [class.trend-badge--up]="trendUp" [class.trend-badge--down]="!trendUp">
          <app-icon [name]="trendUp ? 'trending-up' : 'trending-up'" [size]="12"></app-icon>
          <span>{{ trend }}</span>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transition: all 0.15s ease-in-out;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #CBD5E1;
        box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.08);
      }

      &__header {
        align-items: center;
      }

      &__title {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748B;
      }

      &__icon-box {
        width: 34px;
        height: 34px;
        border-radius: 8px;
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #0F172A;
        line-height: 1.2;
        letter-spacing: -0.02em;
      }

      &__footer {
        margin-top: 0.25rem;
        padding-top: 0.5rem;
        border-top: 1px dashed #F1F5F9;
        font-size: 0.75rem;
      }

      &__subtext {
        color: #64748B;
      }

      .trend-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-weight: 600;
        font-size: 0.7rem;

        &--up {
          color: #047857;
        }
        &--down {
          color: #BE123C;
        }
      }

      &--accent {
        border-top: 3px solid #D97706;
      }
      &--success {
        border-top: 3px solid #047857;
      }
      &--warning {
        border-top: 3px solid #B45309;
      }
      &--danger {
        border-top: 3px solid #BE123C;
      }
      &--info {
        border-top: 3px solid #0369A1;
      }
    }
  `]
})
export class MetricCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input() icon?: string;
  @Input() subtext?: string;
  @Input() trend?: string;
  @Input() trendUp: boolean = true;
  @Input() variant: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'default';

  get iconColor(): string {
    switch (this.variant) {
      case 'accent': return '#D97706';
      case 'success': return '#047857';
      case 'warning': return '#B45309';
      case 'danger': return '#BE123C';
      case 'info': return '#0369A1';
      default: return '#475569';
    }
  }
}
