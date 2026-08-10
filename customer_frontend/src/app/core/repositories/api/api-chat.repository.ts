import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRepository } from '../contracts/chat.repository';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { ChatThread, ChatMessage, SendMessageRequest, ApiResponse } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiChatRepository implements ChatRepository {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getMyThreads(): Observable<ApiResponse<ChatThread[]>> {
    return this.http.get<ApiResponse<ChatThread[]>>(`${this.baseUrl}${API_ENDPOINTS.CHAT.THREADS}`);
  }

  getThreadById(threadId: number): Observable<ApiResponse<ChatThread>> {
    return this.http.get<ApiResponse<ChatThread>>(`${this.baseUrl}${API_ENDPOINTS.CHAT.THREAD_DETAILS(threadId)}`);
  }

  sendMessage(request: SendMessageRequest): Observable<ApiResponse<ChatMessage>> {
    return this.http.post<ApiResponse<ChatMessage>>(`${this.baseUrl}${API_ENDPOINTS.CHAT.SEND_MESSAGE(request.threadId)}`, request);
  }

  escalateToAdmin(threadId: number): Observable<ApiResponse<ChatThread>> {
    return this.http.put<ApiResponse<ChatThread>>(`${this.baseUrl}${API_ENDPOINTS.CHAT.ESCALATE(threadId)}`, {});
  }
}
