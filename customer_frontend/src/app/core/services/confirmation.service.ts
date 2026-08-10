import { Injectable, signal } from '@angular/core';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  public activeDialog = signal<ConfirmationOptions | null>(null);

  confirm(options: ConfirmationOptions): void {
    this.activeDialog.set(options);
  }

  handleConfirm(): void {
    const dialog = this.activeDialog();
    if (dialog) {
      dialog.onConfirm();
      this.activeDialog.set(null);
    }
  }

  handleCancel(): void {
    const dialog = this.activeDialog();
    if (dialog?.onCancel) {
      dialog.onCancel();
    }
    this.activeDialog.set(null);
  }
}
