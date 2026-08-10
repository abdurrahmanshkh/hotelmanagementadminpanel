import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <footer class="public-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Brand Story Column -->
          <div class="footer-brand">
            <div class="brand-title flex-gap">
              <app-icon name="building" [size]="24" color="#D97706"></app-icon>
              <span class="title font-serif">SmartStay Resort</span>
            </div>
            <p class="description">
              Experience digital luxury hospitality with seamless check-in, keyless room access, and 24/7 concierge assistance at SmartStay.
            </p>
          </div>

          <!-- Quick Navigation -->
          <div class="footer-col">
            <h4 class="col-title">Quick Links</h4>
            <ul class="link-list">
              <li><a routerLink="/rooms">Rooms & Suites</a></li>
              <li><a routerLink="/about">About SmartStay</a></li>
              <li><a routerLink="/contact">Contact Concierge</a></li>
              <li><a routerLink="/login">Customer Login</a></li>
            </ul>
          </div>

          <!-- Services -->
          <div class="footer-col">
            <h4 class="col-title">Guest Amenities</h4>
            <ul class="link-list">
              <li><a routerLink="/rooms">Infinity Pool & Spa</a></li>
              <li><a routerLink="/rooms">Fine Dining Restaurant</a></li>
              <li><a routerLink="/rooms">Digital Room Keycode</a></li>
              <li><a routerLink="/rooms">24/7 Room Service</a></li>
            </ul>
          </div>

          <!-- Contact & Location -->
          <div class="footer-col">
            <h4 class="col-title">Contact & Location</h4>
            <div class="contact-item flex-gap">
              <app-icon name="map-pin" [size]="16" color="#D97706"></app-icon>
              <span>100 Ocean Drive, Promenade, Mumbai</span>
            </div>
            <div class="contact-item flex-gap">
              <app-icon name="phone" [size]="16" color="#D97706"></app-icon>
              <span>+91 98765 43210</span>
            </div>
            <div class="contact-item flex-gap">
              <app-icon name="mail" [size]="16" color="#D97706"></app-icon>
              <span>concierge@smartstay.com</span>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 SmartStay Grand Resort & Spa. All rights reserved.</p>
          <div class="legal-links flex-gap">
            <a routerLink="/about">Privacy Policy</a>
            <span>&bull;</span>
            <a routerLink="/about">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .public-footer {
      background-color: #0F172A;
      color: #F8FAFC;
      padding-top: 4rem;
      padding-bottom: 2rem;
      border-top: 1px solid #1E293B;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 3rem;
      margin-bottom: 3rem;

      @media (max-width: 960px) {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .footer-brand {
      .title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #FFFFFF;
      }

      .description {
        font-size: 0.875rem;
        color: #94A3B8;
        line-height: 1.6;
        margin-top: 1rem;
        max-width: 340px;
      }
    }

    .footer-col {
      .col-title {
        font-size: 0.875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #D97706;
        margin-bottom: 1.25rem;
      }

      .link-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;

        a {
          font-size: 0.875rem;
          color: #94A3B8;
          transition: color 0.15s;
          &:hover { color: #FFFFFF; }
        }
      }

      .contact-item {
        font-size: 0.875rem;
        color: #94A3B8;
        margin-bottom: 0.75rem;
      }
    }

    .footer-bottom {
      padding-top: 2rem;
      border-top: 1px solid #1E293B;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8125rem;
      color: #64748B;

      @media (max-width: 640px) {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
      }

      .legal-links a {
        color: #94A3B8;
        &:hover { color: #FFFFFF; }
      }
    }
  `]
})
export class FooterComponent {}
