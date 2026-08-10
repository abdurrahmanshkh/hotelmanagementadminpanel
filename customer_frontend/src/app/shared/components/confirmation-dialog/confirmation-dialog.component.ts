import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  template: `
    <div class="dialog-backdrop" *ngIf="confirmService.activeDialog() as dialog">
      <div class="dialog-box">
        <div class="dialog-header">
          <app-icon
            [name]="dialog.type === 'danger' ? 'shield' : 'bell'"
            [size]="24"
            [color]="dialog.type === 'danger' ? '#BE123C' : '#D97706'"
          ></app-icon>
          <h3 class="dialog-title">{{ dialog.title }}</h3>
        </div>

        <p class="dialog-message">{{ dialog.message }}</p>

        <div class="dialog-actions">
          <app-button variant="outline" (btnClick)="confirmService.handleCancel()">
            {{ dialog.cancelText || 'Cancel' }}
          </app-button>
          <app-button
            [variant]="dialog.type === 'danger' ? 'danger' : 'primary'"
            (btnClick)="confirmService.handleConfirm()"
          >
            {{ dialog.confirmText || 'Confirm' }}
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .dialog-box {
      background-color: #FFFFFF;
      border-radius: 16px;
      padding: 1.5rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.2);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;

      .dialog-title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #0F172A;
      }
    }

    .dialog-message {
      font-size: 0.875rem;
      color: #475569;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .dialog-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `]
})
export class ConfirmationDialogComponent {
  public confirmService = inject(ConfirmationService);
}
