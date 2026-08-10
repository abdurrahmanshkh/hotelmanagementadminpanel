import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="strength-meter" *ngIf="password">
      <div class="bars flex-gap">
        <div *ngFor="let idx of [1, 2, 3, 4]" [class]="'bar ' + getBarClass(idx)"></div>
      </div>
      <span class="strength-label" [style.color]="labelColor">{{ label }}</span>
    </div>
  `,
  styles: [`
    .strength-meter {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .bars {
        display: flex;
        gap: 0.25rem;
        flex: 1;
        max-width: 160px;
      }

      .bar {
        height: 4px;
        flex: 1;
        border-radius: 9999px;
        background-color: #E2E8F0;
        transition: background-color 0.2s;

        &.active-weak { background-color: #BE123C; }
        &.active-medium { background-color: #D97706; }
        &.active-strong { background-color: #047857; }
      }

      .strength-label {
        font-size: 0.75rem;
        font-weight: 600;
        margin-left: 0.5rem;
      }
    }
  `]
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() password = '';

  score = 0;
  label = '';
  labelColor = '#64748B';

  ngOnChanges(): void {
    this.calculateStrength();
  }

  private calculateStrength(): void {
    if (!this.password) {
      this.score = 0;
      this.label = '';
      return;
    }

    let s = 0;
    if (this.password.length >= 8) s++;
    if (/[A-Z]/.test(this.password)) s++;
    if (/[0-9]/.test(this.password)) s++;
    if (/[^A-Za-z0-9]/.test(this.password)) s++;

    this.score = s;

    switch (s) {
      case 1:
        this.label = 'Weak';
        this.labelColor = '#BE123C';
        break;
      case 2:
      case 3:
        this.label = 'Medium';
        this.labelColor = '#D97706';
        break;
      case 4:
        this.label = 'Strong';
        this.labelColor = '#047857';
        break;
      default:
        this.label = 'Weak';
        this.labelColor = '#BE123C';
    }
  }

  getBarClass(idx: number): string {
    if (idx > this.score) return '';
    if (this.score === 1) return 'active-weak';
    if (this.score <= 3) return 'active-medium';
    return 'active-strong';
  }
}
