import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-field">
      <label *ngIf="label" class="form-field__label">
        {{ label }}
        <span *ngIf="required" class="form-field__required">*</span>
      </label>
      <div class="form-field__control">
        <ng-content></ng-content>
      </div>
      <p *ngIf="errorMessage" class="form-field__error">{{ errorMessage }}</p>
      <p *ngIf="hint && !errorMessage" class="form-field__hint">{{ hint }}</p>
    </div>
  `,
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      margin-bottom: 1rem;

      &__label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
      }

      &__required {
        color: #C62828;
      }

      &__error {
        font-size: 0.75rem;
        color: #C62828;
        margin-top: 0.125rem;
      }

      &__hint {
        font-size: 0.75rem;
        color: #6B7280;
        margin-top: 0.125rem;
      }
    }
  `]
})
export class FormFieldComponent {
  @Input() label?: string;
  @Input() required = false;
  @Input() errorMessage?: string;
  @Input() hint?: string;
}
