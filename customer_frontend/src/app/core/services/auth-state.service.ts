import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.constants';
import { User, UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private storage = inject(StorageService);

  public currentUser = signal<User | null>(this.storage.getItem<User>(STORAGE_KEYS.authenticatedUser));
  public accessToken = signal<string | null>(this.storage.getItem<string>(STORAGE_KEYS.accessToken));

  public isAuthenticated = computed(() => !!this.accessToken() && !!this.currentUser());
  public userRole = computed<UserRole | null>(() => this.currentUser()?.role || null);

  public setAuth(user: User, token: string): void {
    this.currentUser.set(user);
    this.accessToken.set(token);
    this.storage.setItem(STORAGE_KEYS.authenticatedUser, user);
    this.storage.setItem(STORAGE_KEYS.accessToken, token);
  }

  public clearAuth(): void {
    this.currentUser.set(null);
    this.accessToken.set(null);
    this.storage.removeItem(STORAGE_KEYS.authenticatedUser);
    this.storage.removeItem(STORAGE_KEYS.accessToken);
  }

  public updateProfile(updated: Partial<User>): void {
    const current = this.currentUser();
    if (current) {
      const merged = { ...current, ...updated, updatedAt: new Date().toISOString() };
      this.currentUser.set(merged);
      this.storage.setItem(STORAGE_KEYS.authenticatedUser, merged);
    }
  }
}
