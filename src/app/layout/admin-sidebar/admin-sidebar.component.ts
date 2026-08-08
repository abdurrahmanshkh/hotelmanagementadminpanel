import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="admin-sidebar">
      <div class="nav-container">
        <div *ngFor="let group of navGroups" class="nav-group">
          <h4 class="nav-group__name">{{ group.name }}</h4>
          <ul class="nav-group__list">
            <li *ngFor="let item of group.items">
              <a
                *ngIf="canViewItem(item.roles)"
                [routerLink]="item.route"
                routerLinkActive="nav-item--active"
                class="nav-item"
              >
                <span class="nav-item__icon">{{ item.icon }}</span>
                <span class="nav-item__label">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .admin-sidebar {
      width: 250px;
      background-color: #11243E;
      color: #FFFFFF;
      min-height: calc(100vh - 64px);
      height: 100%;
      align-self: stretch;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255, 255, 255, 0.08);

      @media (max-width: 1023px) {
        display: none;
      }
    }

    .nav-container {
      padding: 1.25rem 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      overflow-y: auto;
    }

    .nav-group {
      &__name {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #9CA3AF;
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
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #D1D5DB;
      text-decoration: none;
      transition: all 0.15s ease-in-out;

      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: #FFFFFF;
      }

      &--active {
        background-color: #C99B4A !important;
        color: #FFFFFF !important;
        font-weight: 600;
        box-shadow: 0 4px 10px rgba(201, 155, 74, 0.3);
      }

      &__icon {
        font-size: 1.125rem;
      }
    }
  `]
})
export class AdminSidebarComponent {
  private authService = inject(AuthService);

  public navGroups: NavGroup[] = [
    {
      name: 'Overview',
      items: [
        { label: 'Dashboard', route: '/admin/dashboard', icon: '📊' }
      ]
    },
    {
      name: 'Front Desk',
      items: [
        { label: 'Bookings', route: '/admin/bookings', icon: '📅' },
        { label: 'Guest Directory', route: '/admin/guests', icon: '👥' },
        { label: 'Service Requests', route: '/admin/service-requests', icon: '🛎️' },
        { label: 'Front-Desk Chat', route: '/admin/chats', icon: '💬' }
      ]
    },
    {
      name: 'Property',
      items: [
        { label: 'Rooms Inventory', route: '/admin/rooms', icon: '🔑' },
        { label: 'Room Types', route: '/admin/room-types', icon: '🛏️' },
        { label: 'Amenities', route: '/admin/amenities', icon: '✨' }
      ]
    },
    {
      name: 'Operations',
      items: [
        { label: 'Housekeeping', route: '/admin/cleaning', icon: '🧹' },
        { label: 'Maintenance', route: '/admin/maintenance', icon: '🔧' }
      ]
    },
    {
      name: 'Finance',
      items: [
        { label: 'Payments & Refunds', route: '/admin/payments', icon: '💳' },
        { label: 'Dynamic Pricing', route: '/admin/pricing', icon: '📈', roles: ['ADMIN', 'MANAGER'] }
      ]
    },
    {
      name: 'Insights',
      items: [
        { label: 'Reports & Analytics', route: '/admin/reports', icon: '📈', roles: ['ADMIN', 'MANAGER'] }
      ]
    },
    {
      name: 'Administration',
      items: [
        { label: 'Hotel Settings', route: '/admin/settings', icon: '⚙️', roles: ['ADMIN', 'MANAGER'] }
      ]
    }
  ];

  canViewItem(roles?: string[]): boolean {
    if (!roles || roles.length === 0) return true;
    const currentRole = this.authService.userRole();
    return currentRole ? roles.includes(currentRole) : false;
  }
}
