import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { NotificationRepository } from '../contracts/notification.repository';
import { MockDatabaseService } from '../../services/mock-database.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Notification, ApiResponse } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MockNotificationRepository implements NotificationRepository {
  private dbService = inject(MockDatabaseService);
  private authState = inject(AuthStateService);

  getMyNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        const userId = currentUser ? currentUser.id : 1;
        const notifs = this.dbService.getSnapshot().notifications.filter(n => n.userId === userId);
        notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return of({
          success: true,
          message: 'Notifications retrieved.',
          data: notifs,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  markAsRead(id: number): Observable<ApiResponse<Notification>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const db = this.dbService.getSnapshot();
        const notif = db.notifications.find(n => n.id === id);
        if (notif) {
          notif.read = true;
          this.dbService.saveDatabase(db);
        }

        return of({
          success: true,
          message: 'Notification marked as read.',
          data: notif!,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  markAllAsRead(): Observable<ApiResponse<void>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        const userId = currentUser ? currentUser.id : 1;
        const db = this.dbService.getSnapshot();
        db.notifications.filter(n => n.userId === userId).forEach(n => (n.read = true));
        this.dbService.saveDatabase(db);

        return of({
          success: true,
          message: 'All notifications marked as read.',
          data: undefined as void,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
