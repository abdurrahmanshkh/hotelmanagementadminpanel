import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="not-found-page">
      <div class="card not-found-card">
        <span class="icon font-404">404</span>
        <h2>Page Not Found</h2>
        <p>The requested admin panel URL or resource does not exist or has been moved.</p>
        <app-button variant="primary" size="md" (btnClick)="goHome()">
          🏠 Back to Dashboard
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page { display: flex; align-items: center; justify-content: center; min-height: 70vh; padding: 2rem; }
    .not-found-card { max-width: 480px; text-align: center; padding: 2.5rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .font-404 { font-size: 5rem; font-weight: 800; color: #C99B4A; line-height: 1; }
    h2 { font-size: 1.5rem; color: #11243E; font-weight: 700; }
    p { font-size: 0.9375rem; color: #6B7280; line-height: 1.5; }
  `]
})
export class NotFoundComponent {
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
