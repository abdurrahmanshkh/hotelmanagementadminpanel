import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="page-header__main">
        <h1 class="page-header__title">{{ title }}</h1>
        <p *ngIf="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
      </div>
      <div class="page-header__actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;

      &__title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-navy, #11243E);
        line-height: 1.2;
      }

      &__subtitle {
        font-size: 0.875rem;
        color: var(--text-muted, #6B7280);
        margin-top: 0.25rem;
      }

      &__actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}
