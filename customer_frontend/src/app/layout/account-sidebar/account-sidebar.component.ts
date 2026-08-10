import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-state.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <aside class="account-sidebar" *ngIf="authState.currentUser() as user">
      <!-- User Card -->
      <div class="user-card">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          [alt]="user.firstName"
          class="avatar"
        />
        <div class="user-info">
          <h4 class="name">{{ user.firstName }} {{ user.lastName }}</h4>
          <span class="email">{{ user.email }}</span>
          <span class="badge badge--info font-mono">{{ user.publicId }}</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="account-nav">
        <a routerLink="/account" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
          <app-icon name="building" [size]="18"></app-icon>
          <span>Dashboard Overview</span>
        </a>
        <a routerLink="/account/bookings" routerLinkActive="active" class="nav-item">
          <app-icon name="calendar" [size]="18"></app-icon>
          <span>My Reservations</span>
        </a>
        <a routerLink="/account/profile" routerLinkActive="active" class="nav-item">
          <app-icon name="users" [size]="18"></app-icon>
          <span>My Profile</span>
        </a>
        <a routerLink="/account/service-requests" routerLinkActive="active" class="nav-item">
          <app-icon name="sparkles" [size]="18"></app-icon>
          <span>Service Requests</span>
        </a>
        <a routerLink="/account/chats" routerLinkActive="active" class="nav-item">
          <app-icon name="chat" [size]="18"></app-icon>
          <span>Concierge Chat</span>
        </a>
        <a routerLink="/account/notifications" routerLinkActive="active" class="nav-item">
          <app-icon name="bell" [size]="18"></app-icon>
          <span>Notifications</span>
        </a>
      </nav>

      <button type="button" class="btn-logout" (click)="onLogout()">
        <app-icon name="log-out" [size]="16" color="#BE123C"></app-icon>
        <span>Sign Out</span>
      </button>
    </aside>
  `,
  styles: [`
    .account-sidebar {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #F1F5F9;

      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #D97706;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .name {
        font-size: 1rem;
        font-weight: 700;
        color: #0F172A;
      }

      .email {
        font-size: 0.75rem;
        color: #64748B;
      }
    }

    .account-nav {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 0.875rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        color: #475569;
        transition: all 0.15s ease;

        &:hover {
          background-color: #F8FAFC;
          color: #0F172A;
        }

        &.active {
          background-color: #0F172A !important;
          color: #FFFFFF !important;
        }
      }
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.875rem;
      border-radius: 8px;
      background-color: #FFF1F2;
      color: #BE123C;
      border: 1px solid #FECDD3;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: auto;
      transition: background 0.15s;

      &:hover {
        background-color: #FFE4E6;
      }
    }
  `]
})
export class AccountSidebarComponent {
  public authState = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    if (confirm('Are you sure you want to sign out of SmartStay?')) {
      this.authState.clearAuth();
      this.router.navigate(['/login']);
    }
  }
}
