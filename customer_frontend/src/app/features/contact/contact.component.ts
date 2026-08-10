import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  template: `
    <div class="contact-page container">
      <div class="header-banner text-center">
        <span class="badge badge--info font-mono">24/7 FRONT DESK</span>
        <h1 class="title font-serif">Get in Touch with Our Concierge</h1>
        <p class="subtitle">Have a question regarding your upcoming reservation or special requests? We are here to assist 24 hours a day.</p>
      </div>

      <div class="contact-grid">
        <div class="info-card">
          <h3>Direct Channels</h3>
          <div class="item flex-gap">
            <app-icon name="phone" [size]="20" color="#D97706"></app-icon>
            <div><strong>Call Desk:</strong> +91 98765 43210</div>
          </div>
          <div class="item flex-gap">
            <app-icon name="mail" [size]="20" color="#D97706"></app-icon>
            <div><strong>Email Support:</strong> concierge&#64;smartstay.com</div>
          </div>
          <div class="item flex-gap">
            <app-icon name="map-pin" [size]="20" color="#D97706"></app-icon>
            <div><strong>Resort Address:</strong> 100 Ocean Drive, Promenade, Mumbai 400001</div>
          </div>
        </div>

        <form class="form-card" (ngSubmit)="onSubmit()">
          <h3>Send a Direct Inquiry</h3>
          <div class="form-group">
            <label>Your Name</label>
            <input type="text" [(ngModel)]="name" name="name" required class="input" placeholder="Guest Name" />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" required class="input" placeholder="guest@example.com" />
          </div>
          <div class="form-group">
            <label>Message / Inquiry</label>
            <textarea [(ngModel)]="message" name="message" rows="4" required class="input" placeholder="How can we assist your stay?"></textarea>
          </div>
          <app-button type="submit" variant="primary" size="lg" [fullWidth]="true">Send Message</app-button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .contact-page { padding-top: 3rem; padding-bottom: 5rem; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }
    .text-center { text-align: center; }
    .header-banner {
      margin-bottom: 3.5rem;
      .title { font-size: 2.25rem; font-weight: 800; color: #0F172A; margin: 0.75rem 0; }
      .subtitle { font-size: 1rem; color: #64748B; max-width: 600px; margin: 0 auto; }
    }
    .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 2.5rem; @media (max-width: 768px) { grid-template-columns: 1fr; } }
    .info-card, .form-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 2rem; }
    .info-card h3, .form-card h3 { font-size: 1.125rem; font-weight: 700; color: #0F172A; margin-bottom: 1.25rem; }
    .info-card .item { font-size: 0.875rem; color: #334155; margin-bottom: 1.25rem; }
    .form-card {
      display: flex; flex-direction: column; gap: 1rem;
      .form-group { display: flex; flex-direction: column; gap: 0.375rem; label { font-size: 0.8125rem; font-weight: 700; color: #0F172A; } }
      .input { padding: 0.625rem 0.875rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.875rem; outline: none; &:focus { border-color: #D97706; } }
    }
  `]
})
export class ContactComponent {
  private toast = inject(ToastService);
  public name = '';
  public email = '';
  public message = '';

  onSubmit(): void {
    if (!this.name || !this.email || !this.message) return;
    this.toast.success('Inquiry received! Our concierge team will respond shortly.');
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
