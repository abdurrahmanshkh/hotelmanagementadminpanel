import { Observable } from 'rxjs';
import { ChatThread, ChatMessage, SendMessageRequest, ApiResponse } from '../../models';

export abstract class ChatRepository {
  abstract getMyThreads(): Observable<ApiResponse<ChatThread[]>>;
  abstract getThreadById(threadId: number): Observable<ApiResponse<ChatThread>>;
  abstract sendMessage(request: SendMessageRequest): Observable<ApiResponse<ChatMessage>>;
  abstract escalateToAdmin(threadId: number): Observable<ApiResponse<ChatThread>>;
}
