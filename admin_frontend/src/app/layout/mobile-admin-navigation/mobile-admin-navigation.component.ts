import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavGroup } from '../admin-sidebar/admin-sidebar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-mobile-admin-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="mobile-nav" [class.mobile-nav--open]="isOpen">
      <div class="mobile-nav__backdrop" (click)="close.emit()"></div>
      <div class="mobile-nav__drawer">
        <div class="mobile-nav__header">
          <div class="mobile-nav__brand">
            <app-icon name="building" [size]="20" color="#D97706"></app-icon>
            <strong>SmartStay Admin</strong>
          </div>
          <button class="mobile-nav__close" (click)="close.emit()">
            <app-icon name="x" [size]="20" color="#94A3B8"></app-icon>
          </button>
        </div>

        <div class="mobile-nav__body">
          <div *ngFor="let group of navGroups" class="mobile-group">
            <div class="mobile-group__title">{{ group.name }}</div>
            <ul class="mobile-group__list">
              <li *ngFor="let item of group.items">
                <a
                  *ngIf="canViewItem(item.roles)"
                  [routerLink]="item.route"
                  routerLinkActive="mobile-item--active"
                  (click)="close.emit()"
                  class="mobile-item"
                >
                  <app-icon [name]="item.icon" [size]="18" className="mobile-item__icon"></app-icon>
                  <span>{{ item.label }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-nav {
      position: fixed;
      inset: 0;
      z-index: 1100;
      display: none;

      &--open {
        display: block;
      }

      &__backdrop {
        position: absolute;
        inset: 0;
        background-color: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(4px);
      }

      &__drawer {
        position: absolute;
        top: 0;
        left: 0;
        width: 280px;
        height: 100%;
        background-color: #0F172A;
        color: #FFFFFF;
        box-shadow: 4px 0 25px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
      }

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.25rem;
        border-bottom: 1px solid #1E293B;
      }

      &__brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.125rem;
      }

      &__close {
        background: none;
        border: none;
        color: #FFFFFF;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__body {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
      }
    }

    .mobile-group {
      margin-bottom: 1.25rem;

      &__title {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #64748B;
        margin-bottom: 0.5rem;
      }

      &__list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
    }

    .mobile-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #94A3B8;
      text-decoration: none;

      &--active {
        background-color: #1E293B;
        color: #FFFFFF;
        font-weight: 600;
        border: 1px solid #334155;

        .mobile-item__icon {
          color: #D97706;
        }
      }
    }
  `]
})
export class MobileAdminNavigationComponent {
  private authService = inject(AuthService);

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  @Input({ required: true }) navGroups!: NavGroup[];

  canViewItem(roles?: string[]): boolean {
    if (!roles || roles.length === 0) return true;
    const currentRole = this.authService.userRole();
    return currentRole ? roles.includes(currentRole) : false;
  }
}
