import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav *ngIf="breadcrumbs.length > 0" class="breadcrumb" aria-label="Breadcrumb">
      <ol class="breadcrumb__list">
        <li class="breadcrumb__item">
          <a routerLink="/admin/dashboard" class="breadcrumb__link">Dashboard</a>
        </li>
        <li *ngFor="let item of breadcrumbs; let last = last" class="breadcrumb__item">
          <span class="breadcrumb__separator">/</span>
          <a *ngIf="!last" [routerLink]="item.url" class="breadcrumb__link">{{ item.label }}</a>
          <span *ngIf="last" class="breadcrumb__current">{{ item.label }}</span>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      margin-bottom: 1.25rem;
      font-size: 0.8125rem;

      &__list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        list-style: none;
        gap: 0.375rem;
      }

      &__item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        color: #6B7280;
      }

      &__separator {
        color: #9CA3AF;
      }

      &__link {
        color: #4B5563;
        font-weight: 500;
        &:hover {
          color: #11243E;
          text-decoration: underline;
        }
      }

      &__current {
        color: #11243E;
        font-weight: 600;
      }
    }
  `]
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public breadcrumbs: BreadcrumbItem[] = [];
  private sub?: Subscription;

  ngOnInit(): void {
    this.breadcrumbs = this.buildBreadcrumbs(this.route.root);
    this.sub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumbs(this.route.root);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private buildBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children = route.children;
    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'] || this.getLabelFromPath(routeURL);
      if (label && routeURL !== 'admin' && routeURL !== 'dashboard') {
        breadcrumbs.push({ label, url });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getLabelFromPath(path: string): string {
    if (!path) return '';
    if (path === 'bookings') return 'Bookings';
    if (path === 'guests') return 'Guest Directory';
    if (path === 'service-requests') return 'Service Requests';
    if (path === 'chats') return 'Front-Desk Chat';
    if (path === 'rooms') return 'Rooms Inventory';
    if (path === 'room-types') return 'Room Types';
    if (path === 'amenities') return 'Amenities';
    if (path === 'cleaning') return 'Housekeeping';
    if (path === 'maintenance') return 'Maintenance';
    if (path === 'payments') return 'Payments Ledger';
    if (path === 'pricing') return 'Dynamic Pricing';
    if (path === 'reports') return 'Reports & Analytics';
    if (path === 'settings') return 'Hotel Settings';

    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  }
}
