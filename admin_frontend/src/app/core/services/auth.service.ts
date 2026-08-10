import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthRepository } from '../repositories/contracts';
import { STORAGE_KEYS, APP_ROUTES } from '../constants';
import { AdminUser, LoginRequest, Role } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authRepository = inject(AuthRepository);
  private router = inject(Router);

  public currentUser = signal<AdminUser | null>(null);
  public token = signal<string | null>(null);

  public isAuthenticated = computed(() => !!this.token() && !!this.currentUser());
  public userRole = computed<Role | null>(() => this.currentUser()?.role || null);

  constructor() {
    this.restoreSession();
  }

  public login(request: LoginRequest): Observable<any> {
    return this.authRepository.login(request).pipe(
      tap(res => {
        if (res.success && res.data) {
          const user = res.data.user;
          if (user.role === Role.CUSTOMER) {
            throw new Error('Access denied: Customer accounts cannot access the admin panel.');
          }
          this.setSession(res.data.token, user);
        }
      })
    );
  }

  public logout(): void {
    this.authRepository.logout().subscribe({
      next: () => this.clearSessionAndRedirect(),
      error: () => this.clearSessionAndRedirect()
    });
  }

  public hasRole(allowedRoles: Role[]): boolean {
    const role = this.userRole();
    if (!role) return false;
    return allowedRoles.includes(role);
  }

  public clearSessionAndRedirect(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate([APP_ROUTES.LOGIN]);
  }

  private setSession(token: string, user: AdminUser): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    this.token.set(token);
    this.currentUser.set(user);
  }

  private restoreSession(): void {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as AdminUser;
        if (user && user.role !== Role.CUSTOMER) {
          this.token.set(storedToken);
          this.currentUser.set(user);
        } else {
          this.clearSessionAndRedirect();
        }
      } catch (err) {
        console.error('Failed to restore session from localStorage', err);
        this.clearSessionAndRedirect();
      }
    }
  }
}
