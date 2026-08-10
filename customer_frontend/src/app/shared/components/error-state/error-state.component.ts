import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <div class="error-state">
      <div class="icon-circle">
        <app-icon name="shield" [size]="32" color="#BE123C"></app-icon>
      </div>
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ message }}</p>
      <app-button variant="outline" icon="refresh" (btnClick)="retry.emit()">
        {{ retryText }}
      </app-button>
    </div>
  `,
  styles: [`
    .error-state {
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
        background-color: #FFF1F2;
        border: 1px solid #FECDD3;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.25rem;
      }

      .title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #BE123C;
        margin-bottom: 0.5rem;
      }

      .description {
        font-size: 0.875rem;
        color: #475569;
        max-width: 420px;
        line-height: 1.5;
        margin-bottom: 1.5rem;
      }
    }
  `]
})
export class ErrorStateComponent {
  @Input() title = 'Unable to load information';
  @Input() message = 'A connection or server error occurred. Please check your internet connection and try again.';
  @Input() retryText = 'Retry Request';

  @Output() retry = new EventEmitter<void>();
}
