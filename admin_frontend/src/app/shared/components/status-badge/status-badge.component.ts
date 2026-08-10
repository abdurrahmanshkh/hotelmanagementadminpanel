import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLabelMapper } from '../../../core/utilities/status-label-mapper.utility';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClass">
      {{ meta.label }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1;

      &--success { background-color: #E6F4EA; color: #16803C; }
      &--warning { background-color: #FEF3D6; color: #B76E00; }
      &--danger { background-color: #FCE8E6; color: #C62828; }
      &--info { background-color: #E8F0FE; color: #2563EB; }
      &--neutral { background-color: #F3F4F6; color: #4B5563; }
    }
  `]
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;

  get meta(): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
    return StatusLabelMapper.getStatusMeta(this.status);
  }

  get badgeClass(): string {
    return `badge badge--${this.meta.variant}`;
  }
}
