import { Observable } from 'rxjs';
import { Notification, ApiResponse } from '../../models';

export abstract class NotificationRepository {
  abstract getMyNotifications(): Observable<ApiResponse<Notification[]>>;
  abstract markAsRead(id: number): Observable<ApiResponse<Notification>>;
  abstract markAllAsRead(): Observable<ApiResponse<void>>;
}
