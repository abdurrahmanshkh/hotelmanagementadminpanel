import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <header class="public-header">
      <div class="header-container">
        <!-- Logo -->
        <a routerLink="/" class="brand-logo flex-gap">
          <app-icon name="building" [size]="24" color="#D97706"></app-icon>
          <div class="logo-text">
            <span class="logo-title">SmartStay</span>
            <span class="logo-sub">Grand Resort</span>
          </div>
        </a>

        <!-- Main Desktop Navigation Links -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/rooms" routerLinkActive="active">Rooms & Suites</a>
          <a routerLink="/about" routerLinkActive="active">About Us</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </nav>

        <!-- Right Side User Actions -->
        <div class="header-actions flex-gap">
          <ng-container *ngIf="authState.isAuthenticated(); else guestActions">
            <a routerLink="/account/notifications" class="icon-nav-btn" title="Notifications">
              <app-icon name="bell" [size]="18" color="#334155"></app-icon>
            </a>
            <a routerLink="/account" class="user-account-btn flex-gap">
              <img
                [src]="authState.currentUser()?.governmentIdMasked ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'"
                alt="Profile"
                class="user-avatar"
              />
              <span class="user-name">{{ authState.currentUser()?.firstName }}</span>
            </a>
          </ng-container>

          <ng-template #guestActions>
            <a routerLink="/login" class="btn-login">Sign In</a>
            <a routerLink="/register" class="btn-register">Book Stay</a>
          </ng-template>

          <button type="button" class="mobile-toggle" (click)="isMobileNavOpen = !isMobileNavOpen">
            <app-icon [name]="isMobileNavOpen ? 'x' : 'menu'" [size]="22" color="#0F172A"></app-icon>
          </button>
        </div>
      </div>

      <!-- Mobile Drawer -->
      <div class="mobile-drawer" *ngIf="isMobileNavOpen">
        <nav class="mobile-nav">
          <a routerLink="/" (click)="isMobileNavOpen = false">Home</a>
          <a routerLink="/rooms" (click)="isMobileNavOpen = false">Rooms & Suites</a>
          <a routerLink="/about" (click)="isMobileNavOpen = false">About Us</a>
          <a routerLink="/contact" (click)="isMobileNavOpen = false">Contact</a>
          <div class="drawer-divider"></div>
          <ng-container *ngIf="authState.isAuthenticated(); else mobileGuest">
            <a routerLink="/account" (click)="isMobileNavOpen = false">My Account</a>
            <a routerLink="/account/bookings" (click)="isMobileNavOpen = false">My Bookings</a>
          </ng-container>
          <ng-template #mobileGuest>
            <a routerLink="/login" (click)="isMobileNavOpen = false">Sign In</a>
            <a routerLink="/register" (click)="isMobileNavOpen = false">Register Account</a>
          </ng-template>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .public-header {
      height: 72px;
      background-color: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    }

    .header-container {
      max-width: 1280px;
      height: 100%;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.625rem;

      .logo-title {
        font-size: 1.125rem;
        font-weight: 800;
        color: #0F172A;
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .logo-sub {
        font-size: 0.6875rem;
        font-weight: 600;
        color: #D97706;
        text-transform: uppercase;
        display: block;
        letter-spacing: 0.04em;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;

      @media (max-width: 868px) {
        display: none;
      }

      a {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #475569;
        transition: color 0.15s;

        &:hover, &.active {
          color: #D97706;
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;

      .icon-nav-btn {
        padding: 0.5rem;
        border-radius: 50%;
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover { background: #F1F5F9; }
      }

      .user-account-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.75rem;
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 9999px;

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #D97706;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0F172A;
        }
      }

      .btn-login {
        font-size: 0.875rem;
        font-weight: 600;
        color: #0F172A;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        &:hover { background: #F1F5F9; }
      }

      .btn-register {
        font-size: 0.875rem;
        font-weight: 600;
        color: #FFFFFF;
        background-color: #D97706;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: background 0.15s;
        &:hover { background-color: #B45309; }
      }

      .mobile-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.375rem;

        @media (max-width: 868px) {
          display: flex;
        }
      }
    }

    .mobile-drawer {
      position: absolute;
      top: 72px;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.1);
      padding: 1rem 1.5rem;

      .mobile-nav {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        a {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #0F172A;
          padding: 0.5rem 0;
        }

        .drawer-divider {
          height: 1px;
          background: #E2E8F0;
          margin: 0.5rem 0;
        }
      }
    }
  `]
})
export class HeaderComponent {
  public authState = inject(AuthStateService);
  public isMobileNavOpen = false;
}
