import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="admin-header">
      <div class="admin-header__left">
        <button
          type="button"
          class="admin-header__menu-btn"
          (click)="toggleMobileMenu.emit()"
          aria-label="Toggle Navigation Menu"
        >
          ☰
        </button>
        <div class="admin-header__brand">
          <span class="admin-header__logo">🏨</span>
          <span class="admin-header__title">SmartStay Admin</span>
        </div>
      </div>

      <div class="admin-header__right">
        <div class="user-pill" *ngIf="authService.currentUser() as user">
          <img
            [src]="user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'"
            [alt]="user.fullName"
            class="user-pill__avatar"
          />
          <div class="user-pill__info">
            <span class="user-pill__name">{{ user.fullName }}</span>
            <span class="user-pill__role-badge">{{ user.role }} ({{ user.staffCode }})</span>
          </div>
        </div>

        <button
          type="button"
          class="admin-header__logout-btn"
          (click)="onLogout()"
          title="Sign Out"
        >
          Logout 🚪
        </button>
      </div>
    </header>
  `,
  styles: [`
    .admin-header {
      height: 64px;
      background-color: #FFFFFF;
      border-bottom: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      &__left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      &__menu-btn {
        display: none;
        background: none;
        border: none;
        font-size: 1.25rem;
        color: #374151;
        cursor: pointer;

        @media (max-width: 1023px) {
          display: block;
        }
      }

      &__brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      &__logo {
        font-size: 1.5rem;
      }

      &__title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #11243E;
      }

      &__right {
        display: flex;
        align-items: center;
        gap: 1.25rem;
      }

      &__logout-btn {
        padding: 0.375rem 0.75rem;
        background-color: #FCE8E6;
        color: #C62828;
        border: 1px solid #F87171;
        border-radius: 6px;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.15s ease;

        &:hover {
          background-color: #FEE2E2;
        }
      }
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.625rem;

      &__avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #C99B4A;
      }

      &__info {
        display: flex;
        flex-direction: column;

        @media (max-width: 640px) {
          display: none;
        }
      }

      &__name {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1F2937;
        line-height: 1.1;
      }

      &__role-badge {
        font-size: 0.7rem;
        font-weight: 600;
        color: #6B7280;
      }
    }
  `]
})
export class AdminHeaderComponent {
  public authService = inject(AuthService);

  @Output() toggleMobileMenu = new EventEmitter<void>();

  onLogout(): void {
    if (confirm('Are you sure you want to log out of SmartStay Admin Panel?')) {
      this.authService.logout();
    }
  }
}
