import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRepository } from '../../../core/repositories/contracts/notification.repository';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { Notification } from '../../../core/models';
import { formatDateDisplay } from '../../../core/utilities/date.utils';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent, EmptyStateComponent],
  template: `
    <div class="notifications-page">
      <div class="header-box flex-gap">
        <div>
          <h2 class="title font-serif">Notifications &amp; Alerts</h2>
          <p class="sub">Stay updates, keycode alerts, and system notifications.</p>
        </div>
        <app-button variant="outline" size="sm" class="ml-auto" (btnClick)="onMarkAllRead()">
          Mark All as Read
        </app-button>
      </div>

      <div class="card-box" *ngIf="notifications.length > 0; else emptyBlock">
        <div *ngFor="let n of notifications" [class]="'notif-item ' + (!n.read ? 'notif--unread' : '')">
          <div class="notif-icon">
            <app-icon [name]="getIcon(n.type)" [size]="20" color="#D97706"></app-icon>
          </div>
          <div class="notif-body">
            <h4 class="notif-title">{{ n.title }}</h4>
            <p class="notif-msg">{{ n.message }}</p>
            <span class="notif-time">{{ formatDate(n.createdAt) }}</span>
          </div>
          <button *ngIf="!n.read" type="button" class="btn-read" (click)="onMarkRead(n.id)">
            Mark Read
          </button>
        </div>
      </div>

      <ng-template #emptyBlock>
        <app-empty-state
          icon="bell"
          title="No Unread Notifications"
          description="You are all caught up with your stay updates."
        ></app-empty-state>
      </ng-template>
    </div>
  `,
  styles: [`
    .notifications-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-box { .title { font-size: 1.5rem; font-weight: 800; color: #0F172A; } .sub { font-size: 0.875rem; color: #64748B; } .ml-auto { margin-left: auto; } }

    .card-box { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .notif-item {
      display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px; background: #F8FAFC; border: 1px solid #E2E8F0;
      &.notif--unread { background: #FFFBEB; border-color: #FDE68A; }
      .notif-icon { width: 40px; height: 40px; border-radius: 50%; background: #FFFFFF; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; }
      .notif-body { flex: 1; .notif-title { font-size: 0.9375rem; font-weight: 700; color: #0F172A; } .notif-msg { font-size: 0.8125rem; color: #475569; margin: 0.125rem 0; } .notif-time { font-size: 0.6875rem; color: #94A3B8; } }
      .btn-read { background: none; border: none; font-size: 0.75rem; font-weight: 700; color: #D97706; cursor: pointer; }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  private notifRepo = inject(NotificationRepository);
  public authState = inject(AuthStateService);
  private toast = inject(ToastService);

  public notifications: Notification[] = [];

  ngOnInit(): void {
    this.notifRepo.getMyNotifications().subscribe(res => {
      this.notifications = res.data;
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'BOOKING_CONFIRMED': return 'calendar';
      case 'PASSCODE_GENERATED': return 'key';
      case 'SERVICE_REQUEST_UPDATE': return 'sparkles';
      default: return 'bell';
    }
  }

  formatDate(dateStr: string): string {
    return formatDateDisplay(dateStr);
  }

  onMarkRead(id: number): void {
    this.notifRepo.markAsRead(id).subscribe(() => {
      const item = this.notifications.find(n => n.id === id);
      if (item) item.read = true;
    });
  }

  onMarkAllRead(): void {
    this.notifRepo.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
      this.toast.success('All notifications marked as read.');
    });
  }
}
