import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'badge badge--' + status.toLowerCase()">
      {{ label || status }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;
  @Input() label?: string;
}
