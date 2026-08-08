import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts = signal<ToastMessage[]>([]);

  public show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', title?: string, durationMs = 4000): void {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const toast: ToastMessage = { id, type, title, message, durationMs };
    this.toasts.update(current => [...current, toast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }
  }

  public success(message: string, title: string = 'Success'): void {
    this.show(message, 'success', title);
  }

  public error(message: string, title: string = 'Error'): void {
    this.show(message, 'error', title, 5000);
  }

  public warning(message: string, title: string = 'Warning'): void {
    this.show(message, 'warning', title);
  }

  public info(message: string, title: string = 'Notice'): void {
    this.show(message, 'info', title);
  }

  public dismiss(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  public clearAll(): void {
    this.toasts.set([]);
  }
}
