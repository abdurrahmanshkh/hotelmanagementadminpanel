import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, IconComponent],
  template: `
    <div class="error-page container">
      <div class="icon-circle">
        <app-icon name="building" [size]="40" color="#64748B"></app-icon>
      </div>
      <h1 class="code font-mono">404</h1>
      <h2 class="title">Page Not Found</h2>
      <p class="description">The page or room URL you requested does not exist or has been moved.</p>
      <a routerLink="/">
        <app-button variant="primary" icon="arrow-left">Return to Homepage</app-button>
      </a>
    </div>
  `,
  styles: [`
    .error-page {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; min-height: calc(100vh - 200px); padding: 3rem 1.5rem;
      .icon-circle { width: 80px; height: 80px; border-radius: 50%; background: #F8FAFC; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
      .code { font-size: 3rem; font-weight: 800; color: #D97706; }
      .title { font-size: 1.5rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem; }
      .description { font-size: 1rem; color: #64748B; max-width: 440px; margin-bottom: 2rem; }
    }
  `]
})
export class NotFoundComponent {}
