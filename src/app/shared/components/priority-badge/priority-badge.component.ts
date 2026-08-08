import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Priority } from '../../../core/enums';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClass">
      {{ priority }}
    </span>
  `,
  styles: [`
    .priority {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.02em;

      &--low { background-color: #F3F4F6; color: #6B7280; }
      &--medium { background-color: #E8F0FE; color: #2563EB; }
      &--high { background-color: #FEF3D6; color: #B76E00; }
      &--urgent { background-color: #FCE8E6; color: #C62828; }
    }
  `]
})
export class PriorityBadgeComponent {
  @Input({ required: true }) priority!: Priority | string;

  get badgeClass(): string {
    const p = String(this.priority).toLowerCase();
    return `priority priority--${p}`;
  }
}
