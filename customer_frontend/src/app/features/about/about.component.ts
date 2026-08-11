import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="about-page">
      <div class="header-banner text-center">
        <span class="badge badge--info font-mono">OUR HERITAGE</span>
        <h1 class="title font-serif">Pioneering Digital Hospitality & Unmatched Luxury</h1>
        <p class="subtitle">SmartStay combines timeless boutique elegance with state-of-the-art keyless room access and AI concierge service.</p>
      </div>

      <div class="values-grid">
        <div class="value-card">
          <app-icon name="key" [size]="32" color="#D97706"></app-icon>
          <h3>Keyless Passcode Access</h3>
          <p>Guests receive an encrypted 6-digit passcode for seamless door unlocking without keycards or front-desk queues.</p>
        </div>
        <div class="value-card">
          <app-icon name="bot" [size]="32" color="#D97706"></app-icon>
          <h3>24/7 AI Concierge</h3>
          <p>Our intelligent AI assistant answers guest queries instantly, from Wi-Fi credentials to dining hours.</p>
        </div>
        <div class="value-card">
          <app-icon name="sparkles" [size]="32" color="#D97706"></app-icon>
          <h3>On-Demand Room Services</h3>
          <p>Housekeeping, towel requests, and maintenance tickets are submitted and tracked in real-time on your dashboard.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; flex: 1 0 auto; }
    .about-page { max-width: 1100px; margin: 0 auto; padding: 4rem 1.5rem 6rem; width: 100%; }
    .text-center { text-align: center; }
    .header-banner {
      margin-bottom: 4rem;
      .title { font-size: 2.5rem; font-weight: 800; color: #0F172A; margin: 0.75rem 0; }
      .subtitle { font-size: 1.125rem; color: #64748B; max-width: 680px; margin: 0 auto; line-height: 1.5; }
    }
    .values-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;
    }
    .value-card {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 2rem; text-align: center;
      h3 { font-size: 1.125rem; font-weight: 700; color: #0F172A; margin: 1rem 0 0.5rem; }
      p { font-size: 0.875rem; color: #64748B; line-height: 1.5; }
    }
  `]
})
export class AboutComponent {}
