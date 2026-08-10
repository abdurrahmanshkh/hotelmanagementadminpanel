import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { MobileAdminNavigationComponent } from '../mobile-admin-navigation/mobile-admin-navigation.component';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AdminHeaderComponent,
    AdminSidebarComponent,
    MobileAdminNavigationComponent
  ],
  template: `
    <div class="admin-shell">
      <div *ngIf="loadingService.isLoading()" class="global-progress-bar"></div>
      <app-admin-header (toggleMobileMenu)="isMobileMenuOpen = !isMobileMenuOpen"></app-admin-header>

      <div class="admin-shell__body">
        <app-admin-sidebar></app-admin-sidebar>

        <main class="admin-shell__content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <app-mobile-admin-navigation
        [isOpen]="isMobileMenuOpen"
        [navGroups]="sidebarRef.navGroups"
        (close)="isMobileMenuOpen = false"
      ></app-mobile-admin-navigation>
    </div>
  `,
  styles: [`
    .admin-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #F8FAFC;
      position: relative;

      &__body {
        display: flex;
        flex: 1;
      }

      &__content {
        flex: 1;
        padding: 1.5rem;
        overflow-x: hidden;

        @media (max-width: 767px) {
          padding: 1rem;
        }
      }
    }

    .content-wrapper {
      max-width: 1440px;
      margin: 0 auto;
    }

    .global-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #D97706 0%, #0F172A 50%, #D97706 100%);
      background-size: 200% 100%;
      animation: progress-pulse 1.2s ease-in-out infinite;
      z-index: 2000;
    }

    @keyframes progress-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class AdminLayoutComponent {
  public loadingService = inject(LoadingService);
  public sidebarRef = new AdminSidebarComponent();
  public isMobileMenuOpen = false;
}
