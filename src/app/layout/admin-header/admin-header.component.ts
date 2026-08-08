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

        <!-- Dynamic Route Breadcrumbs track embedded directly in top header bar -->
        <div class="header-breadcrumbs">
          <app-breadcrumb></app-breadcrumb>
        </div>
      </div>

      <div class="admin-header__right">
        <!-- Hotel System Status Badge -->
        <div class="property-status-badge flex-gap">
          <span class="live-pulse-dot"></span>
          <span class="property-name font-semibold">SmartStay Grand Resort</span>
          <span class="badge badge--available">Live System</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .admin-header {
      height: 56px;
      background-color: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04);

      &__left {
        display: flex;
        align-items: center;
        gap: 1rem;
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

    .header-breadcrumbs {
      display: flex;
      align-items: center;
      margin-bottom: 0;

      ::ng-deep .breadcrumb {
        margin-bottom: 0 !important;
      }
    }

    .property-status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: #0F172A;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;

      @media (max-width: 640px) {
        display: none;
      }

      .live-pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #047857;
        box-shadow: 0 0 0 2px rgba(4, 120, 87, 0.2);
        animation: pulse-green 2s infinite;
      }

      .property-name {
        font-weight: 600;
        color: #0F172A;
      }
    }

    @keyframes pulse-green {
      0% { box-shadow: 0 0 0 0 rgba(4, 120, 87, 0.4); }
      70% { box-shadow: 0 0 0 6px rgba(4, 120, 87, 0); }
      100% { box-shadow: 0 0 0 0 rgba(4, 120, 87, 0); }
    }
  `]
})
export class AdminHeaderComponent {
  public authService = inject(AuthService);

  @Output() toggleMobileMenu = new EventEmitter<void>();
}
