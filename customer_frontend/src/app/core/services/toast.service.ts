import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts = signal<ToastMessage[]>([]);

  show(type: ToastType, message: string, title?: string, durationMs = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastMessage = { id, type, title, message, durationMs };

    this.toasts.update(current => [...current, toast]);

    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }

  success(message: string, title?: string): void {
    this.show('success', message, title || 'Success');
  }

  error(message: string, title?: string): void {
    this.show('error', message, title || 'Error');
  }

  warning(message: string, title?: string): void {
    this.show('warning', message, title || 'Warning');
  }

  info(message: string, title?: string): void {
    this.show('info', message, title || 'Notice');
  }

  dismiss(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
