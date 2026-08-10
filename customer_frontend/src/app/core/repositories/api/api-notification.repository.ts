import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationRepository } from '../contracts/notification.repository';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { Notification, ApiResponse } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiNotificationRepository implements NotificationRepository {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getMyNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.LIST}`);
  }

  markAsRead(id: number): Observable<ApiResponse<Notification>> {
    return this.http.put<ApiResponse<Notification>>(`${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)}`, {});
  }

  markAllAsRead(): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.LIST}/read-all`, {});
  }
}
