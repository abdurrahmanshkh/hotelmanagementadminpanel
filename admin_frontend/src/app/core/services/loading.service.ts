import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequestCount = signal(0);
  public isLoading = computed(() => this.activeRequestCount() > 0);

  public show(): void {
    this.activeRequestCount.update(c => c + 1);
  }

  public hide(): void {
    this.activeRequestCount.update(c => Math.max(0, c - 1));
  }

  public reset(): void {
    this.activeRequestCount.set(0);
  }
}
