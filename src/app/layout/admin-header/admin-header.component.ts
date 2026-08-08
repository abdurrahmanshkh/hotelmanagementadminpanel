import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
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

        <!-- Brand Logo (Mobile View & Top Desktop Title) -->
        <div class="header-brand flex-gap">
          <app-icon name="building" [size]="22" color="#D97706"></app-icon>
          <div class="brand-text">
            <span class="brand-name">SmartStay</span>
            <span class="brand-tag">HMS Admin</span>
          </div>
        </div>

        <!-- Universal Search Trigger Bar -->
        <div class="search-trigger-box" (click)="openSearch()">
          <app-icon name="search" [size]="16" color="#94A3B8"></app-icon>
          <span class="search-placeholder">Search reservation ID, guest name, or room...</span>
          <kbd class="kbd-badge">Cmd + K</kbd>
        </div>
      </div>

      <div class="admin-header__right">
        <!-- Live Operational Pill (design.md Section 5.1) -->
        <div class="live-status-pill">
          <div class="pill-item">
            <span class="pulse-dot"></span>
            <span class="pill-label">Occupancy:</span>
            <strong class="pill-val">81%</strong>
          </div>
          <span class="pill-divider">•</span>
          <div class="pill-item">
            <span class="pill-label">Arrivals:</span>
            <span class="badge badge--info font-mono">4 Today</span>
          </div>
        </div>

        <!-- Notification Bell Trigger -->
        <button type="button" class="icon-trigger-btn" title="System Notifications">
          <app-icon name="bell" [size]="18" color="#475569"></app-icon>
          <span class="notif-badge"></span>
        </button>

        <!-- User Profile Pill -->
        <div class="user-pill" *ngIf="authService.currentUser() as user">
          <img
            [src]="user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'"
            [alt]="user.fullName"
            class="user-pill__avatar"
          />
          <div class="user-pill__info">
            <span class="user-pill__name">{{ user.fullName }}</span>
            <span class="user-pill__role">{{ user.role }} ({{ user.staffCode }})</span>
          </div>
        </div>

        <button
          type="button"
          class="logout-action-btn"
          (click)="onLogout()"
          title="Sign Out"
        >
          <app-icon name="log-out" [size]="16" color="#BE123C"></app-icon>
          <span class="logout-text">Logout</span>
        </button>
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
        max-width: 650px;
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
      display: none;
      align-items: center;

      @media (max-width: 1023px) {
        display: flex;
      }

      .brand-name {
        font-size: 1rem;
        font-weight: 700;
        color: #0F172A;
      }

      .brand-tag {
        font-size: 0.6875rem;
        color: #D97706;
        font-weight: 600;
        margin-left: 0.375rem;
      }
    }

    .search-trigger-box {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      background-color: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 0.5rem 0.875rem;
      cursor: pointer;
      flex: 1;
      max-width: 420px;
      transition: all 0.15s ease-in-out;

      &:hover {
        border-color: #94A3B8;
        background-color: #FFFFFF;
      }

      .search-placeholder {
        font-size: 0.8125rem;
        color: #64748B;
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .kbd-badge {
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-size: 0.6875rem;
        font-weight: 600;
        color: #475569;
        background: #E2E8F0;
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        padding: 0.125rem 0.375rem;

        @media (max-width: 640px) {
          display: none;
        }
      }

      @media (max-width: 640px) {
        display: none;
      }
    }

    .live-status-pill {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 9999px;
      padding: 0.375rem 0.875rem;
      font-size: 0.75rem;

      @media (max-width: 768px) {
        display: none;
      }

      .pill-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }

      .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #047857;
        box-shadow: 0 0 0 2px rgba(4, 120, 87, 0.2);
        animation: pulse-green 2s infinite;
      }

      .pill-label {
        color: #64748B;
        font-weight: 500;
      }

      .pill-val {
        color: #0F172A;
        font-weight: 700;
      }

      .pill-divider {
        color: #CBD5E1;
      }
    }

    @keyframes pulse-green {
      0% { box-shadow: 0 0 0 0 rgba(4, 120, 87, 0.4); }
      70% { box-shadow: 0 0 0 6px rgba(4, 120, 87, 0); }
      100% { box-shadow: 0 0 0 0 rgba(4, 120, 87, 0); }
    }

    .icon-trigger-btn {
      position: relative;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;

      &:hover {
        background: #F1F5F9;
      }

      .notif-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #BE123C;
        border: 2px solid #FFFFFF;
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
        border: 2px solid #D97706;
      }

      &__info {
        display: flex;
        flex-direction: column;

        @media (max-width: 640px) {
          display: none;
        }
      }

      &__name {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #0F172A;
        line-height: 1.1;
      }

      &__role {
        font-size: 0.6875rem;
        font-weight: 600;
        color: #64748B;
      }
    }

    .logout-action-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      background-color: #FFF1F2;
      color: #BE123C;
      border: 1px solid #FECDD3;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;

      &:hover {
        background-color: #FFE4E6;
      }

      @media (max-width: 640px) {
        .logout-text {
          display: none;
        }
      }
    }
  `]
})
export class AdminHeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  @Output() toggleMobileMenu = new EventEmitter<void>();

  openSearch(): void {
    this.router.navigate(['/admin/bookings']);
  }

  onLogout(): void {
    if (confirm('Are you sure you want to log out of SmartStay Admin Panel?')) {
      this.authService.logout();
    }
  }
}
