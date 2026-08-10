import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent, IconComponent],
  template: `
    <header class="admin-header">
      <div class="admin-header__left">
        <button
          type="button"
          class="admin-header__menu-btn"
          (click)="toggleMobileMenu.emit()"
          aria-label="Toggle Navigation Menu"
        >
          <app-icon name="menu" [size]="20" color="#334155"></app-icon>
        </button>

        <!-- Primary Hotel Brand Logo & Title -->
        <div class="header-brand">
          <app-icon name="building" [size]="24" color="#D97706"></app-icon>
          <div class="brand-details">
            <span class="brand-name">SmartStay Admin</span>
            <span class="property-tag">Grand Resort & Spa</span>
          </div>
        </div>

        <span class="header-divider"></span>

        <!-- Dynamic Route Breadcrumb Track -->
        <div class="header-breadcrumbs">
          <app-breadcrumb></app-breadcrumb>
        </div>
      </div>

      <div class="admin-header__right">
        <!-- Staff User Profile Card & Sign Out Button -->
        <div class="user-profile-header" *ngIf="authService.currentUser() as user">
          <div class="user-pill flex-gap">
            <img
              [src]="user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'"
              [alt]="user.fullName"
              class="user-avatar"
            />
            <div class="user-details">
              <span class="user-name">{{ user.fullName }}</span>
              <span class="user-role">{{ user.role }} &bull; {{ user.staffCode }}</span>
            </div>
          </div>

          <button
            type="button"
            class="logout-action-btn"
            (click)="onLogout()"
            title="Sign Out of SmartStay HMS"
          >
            <app-icon name="log-out" [size]="16" color="#BE123C"></app-icon>
            <span class="logout-label">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .admin-header {
      height: 64px;
      background-color: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05);

      &__left {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        flex: 1;
      }

      &__menu-btn {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.375rem;
        border-radius: 6px;
        &:hover { background: #F1F5F9; }

        @media (max-width: 1023px) {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      &__right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 0.625rem;

      .brand-details {
        display: flex;
        flex-direction: column;
      }

      .brand-name {
        font-size: 1rem;
        font-weight: 700;
        color: #0F172A;
        line-height: 1.1;
        letter-spacing: -0.02em;
      }

      .property-tag {
        font-size: 0.6875rem;
        font-weight: 600;
        color: #D97706;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
    }

    .header-divider {
      width: 1px;
      height: 24px;
      background-color: #CBD5E1;

      @media (max-width: 768px) {
        display: none;
      }
    }

    .header-breadcrumbs {
      display: flex;
      align-items: center;

      @media (max-width: 768px) {
        display: none;
      }

      ::ng-deep .breadcrumb {
        margin-bottom: 0 !important;
      }
    }

    .user-profile-header {
      display: flex;
      align-items: center;
      gap: 1rem;

      .user-pill {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        padding: 0.375rem 0.75rem;
        border-radius: 9999px;
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #D97706;
      }

      .user-details {
        display: flex;
        flex-direction: column;

        @media (max-width: 640px) {
          display: none;
        }
      }

      .user-name {
        font-size: 0.8125rem;
        font-weight: 700;
        color: #0F172A;
        line-height: 1.1;
      }

      .user-role {
        font-size: 0.6875rem;
        font-weight: 600;
        color: #64748B;
      }

      .logout-action-btn {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.4375rem 0.875rem;
        background-color: #FFF1F2;
        color: #BE123C;
        border: 1px solid #FECDD3;
        border-radius: 8px;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
          background-color: #FFE4E6;
          border-color: #FDA4AF;
        }

        @media (max-width: 640px) {
          .logout-label {
            display: none;
          }
        }
      }
    }
  `]
})
export class AdminHeaderComponent {
  public authService = inject(AuthService);

  @Output() toggleMobileMenu = new EventEmitter<void>();

  onLogout(): void {
    if (confirm('Are you sure you want to sign out of SmartStay Admin Panel?')) {
      this.authService.logout();
    }
  }
}
