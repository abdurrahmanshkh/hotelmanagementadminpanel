import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

export interface NavGroup {
  name: string;
  items: Array<{
    label: string;
    route: string;
    icon: string;
    roles?: string[];
  }>;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <aside class="admin-sidebar" [class.admin-sidebar--collapsed]="isCollapsed">
      <!-- Brand & Property Header -->
      <div class="sidebar-brand">
        <div class="brand-content" *ngIf="!isCollapsed">
          <div class="brand-title">
            <app-icon name="building" [size]="22" color="#D97706"></app-icon>
            <span class="title-text">SmartStay</span>
          </div>
          <span class="property-subtitle">Grand Hotel & Resort</span>
        </div>
        <div class="brand-content-mini" *ngIf="isCollapsed">
          <app-icon name="building" [size]="24" color="#D97706"></app-icon>
        </div>
        <button
          type="button"
          class="collapse-toggle"
          (click)="isCollapsed = !isCollapsed"
          [title]="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        >
          <app-icon [name]="isCollapsed ? 'chevron-right' : 'chevron-left'" [size]="16" color="#94A3B8"></app-icon>
        </button>
      </div>

      <!-- Navigation Links Container -->
      <div class="nav-container">
        <div *ngFor="let group of navGroups" class="nav-group">
          <h4 class="nav-group__name" *ngIf="!isCollapsed">{{ group.name }}</h4>
          <ul class="nav-group__list">
            <li *ngFor="let item of group.items">
              <a
                *ngIf="canViewItem(item.roles)"
                [routerLink]="item.route"
                routerLinkActive="nav-item--active"
                class="nav-item"
                [title]="isCollapsed ? item.label : ''"
              >
                <app-icon [name]="item.icon" [size]="18" className="nav-item__icon"></app-icon>
                <span class="nav-item__label" *ngIf="!isCollapsed">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- User Profile Footer -->
      <div class="sidebar-footer" *ngIf="authService.currentUser() as user">
        <div class="user-profile" *ngIf="!isCollapsed">
          <img
            [src]="user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'"
            [alt]="user.fullName"
            class="user-avatar"
          />
          <div class="user-details">
            <span class="user-name">{{ user.fullName }}</span>
            <span class="user-role-badge">{{ user.role }}</span>
          </div>
        </div>
        <button
          type="button"
          class="logout-btn"
          (click)="onLogout()"
          [title]="'Sign Out ' + user.fullName"
        >
          <app-icon name="log-out" [size]="18" color="#EF4444"></app-icon>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .admin-sidebar {
      width: 260px;
      background-color: #0F172A;
      color: #F8FAFC;
      min-height: calc(100vh - 64px);
      height: 100%;
      align-self: stretch;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #1E293B;
      transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;

      &--collapsed {
        width: 72px;

        .nav-container {
          padding: 1rem 0.5rem;
        }

        .nav-group__list {
          align-items: center;
        }

        .nav-item {
          justify-content: center;
          padding: 0.75rem;
        }
      }

      @media (max-width: 1023px) {
        display: none;
      }
    }

    .sidebar-brand {
      height: 64px;
      padding: 0 1rem;
      border-bottom: 1px solid #1E293B;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .brand-content {
        display: flex;
        flex-direction: column;
      }

      .brand-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.125rem;
        font-weight: 700;
        color: #FFFFFF;
        letter-spacing: -0.02em;
      }

      .property-subtitle {
        font-size: 0.7rem;
        font-weight: 500;
        color: #D97706;
        margin-left: 1.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .brand-content-mini {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .collapse-toggle {
        background: #1E293B;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 0.25rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s;

        &:hover {
          background: #334155;
        }
      }
    }

    .nav-container {
      padding: 1.25rem 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      overflow-y: auto;
      flex: 1;

      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background: #334155;
        border-radius: 9999px;
      }
    }

    .nav-group {
      &__name {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #64748B;
        padding: 0 0.75rem 0.5rem;
      }

      &__list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #94A3B8;
      text-decoration: none;
      transition: all 0.15s ease-in-out;

      &:hover {
        background-color: rgba(255, 255, 255, 0.06);
        color: #FFFFFF;
      }

      &--active {
        background-color: #1E293B !important;
        color: #FFFFFF !important;
        font-weight: 600;
        border: 1px solid #334155;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

        .nav-item__icon {
          color: #D97706;
        }
      }
    }

    .sidebar-footer {
      padding: 0.875rem 1rem;
      border-top: 1px solid #1E293B;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #090D16;

      .user-profile {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        overflow: hidden;
      }

      .user-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #D97706;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .user-name {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #FFFFFF;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .user-role-badge {
        font-size: 0.6875rem;
        color: #D97706;
        font-weight: 600;
        text-transform: uppercase;
      }

      .logout-btn {
        background: #1E293B;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 0.375rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s;

        &:hover {
          background: #7F1D1D;
          border-color: #991B1B;
        }
      }
    }
  `]
})
export class AdminSidebarComponent {
  public authService = inject(AuthService);
  public isCollapsed = false;

  public navGroups: NavGroup[] = [
    {
      name: 'Overview',
      items: [
        { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' }
      ]
    },
    {
      name: 'Front Desk',
      items: [
        { label: 'Bookings', route: '/admin/bookings', icon: 'calendar' },
        { label: 'Guest Directory', route: '/admin/guests', icon: 'users' },
        { label: 'Service Requests', route: '/admin/service-requests', icon: 'sparkles' },
        { label: 'Front-Desk Chat', route: '/admin/chats', icon: 'chat' }
      ]
    },
    {
      name: 'Property',
      items: [
        { label: 'Rooms Inventory', route: '/admin/rooms', icon: 'door' },
        { label: 'Room Types', route: '/admin/room-types', icon: 'bed' },
        { label: 'Amenities', route: '/admin/amenities', icon: 'sparkles' }
      ]
    },
    {
      name: 'Operations',
      items: [
        { label: 'Housekeeping', route: '/admin/cleaning', icon: 'sparkles' },
        { label: 'Maintenance', route: '/admin/maintenance', icon: 'wrench' }
      ]
    },
    {
      name: 'Finance',
      items: [
        { label: 'Payments & Refunds', route: '/admin/payments', icon: 'receipt' },
        { label: 'Dynamic Pricing', route: '/admin/pricing', icon: 'trending-up', roles: ['ADMIN', 'MANAGER'] }
      ]
    },
    {
      name: 'Insights',
      items: [
        { label: 'Reports & Analytics', route: '/admin/reports', icon: 'trending-up', roles: ['ADMIN', 'MANAGER'] }
      ]
    },
    {
      name: 'Administration',
      items: [
        { label: 'Hotel Settings', route: '/admin/settings', icon: 'settings', roles: ['ADMIN', 'MANAGER'] }
      ]
    }
  ];

  canViewItem(roles?: string[]): boolean {
    if (!roles || roles.length === 0) return true;
    const currentRole = this.authService.userRole();
    return currentRole ? roles.includes(currentRole) : false;
  }

  onLogout(): void {
    if (confirm('Are you sure you want to log out of SmartStay Admin Panel?')) {
      this.authService.logout();
    }
  }
}
