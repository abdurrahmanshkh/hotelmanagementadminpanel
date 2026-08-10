import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { ChatRepository } from '../contracts/chat.repository';
import { MockDatabaseService } from '../../services/mock-database.service';
import { AuthStateService } from '../../services/auth-state.service';
import { ChatThread, ChatMessage, SendMessageRequest, ApiResponse } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MockChatRepository implements ChatRepository {
  private dbService = inject(MockDatabaseService);
  private authState = inject(AuthStateService);

  getMyThreads(): Observable<ApiResponse<ChatThread[]>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        const userId = currentUser ? currentUser.id : 1;
        const threads = this.dbService.getSnapshot().chatThreads.filter(t => t.userId === userId);

        if (threads.length === 0) {
          const db = this.dbService.getSnapshot();
          const newThread: ChatThread = {
            id: 1,
            threadReference: `CHAT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0001`,
            userId,
            guestName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User',
            mode: 'BOT',
            status: 'OPEN',
            lastMessageText: 'Welcome to SmartStay Grand Resort! How can I assist with your stay?',
            lastMessageAt: new Date().toISOString(),
            unreadCountCustomer: 0,
            unreadCountAdmin: 0,
            messages: [
              {
                id: 1,
                threadId: 1,
                senderType: 'BOT',
                senderName: 'SmartStay Concierge AI',
                messageText: 'Welcome to SmartStay Grand Resort! How can I assist with your stay today?',
                createdAt: new Date().toISOString(),
                suggestedActions: [
                  { label: 'Breakfast Timings', actionValue: 'What are breakfast timings?' },
                  { label: 'Wi-Fi Password', actionValue: 'What is the Wi-Fi password?' },
                  { label: 'Escalate to Admin', actionValue: 'Connect me with an administrator' }
                ]
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          db.chatThreads.push(newThread);
          this.dbService.saveDatabase(db);
          threads.push(newThread);
        }

        return of({
          success: true,
          message: 'Chat threads retrieved.',
          data: threads,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getThreadById(threadId: number): Observable<ApiResponse<ChatThread>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const thread = this.dbService.getSnapshot().chatThreads.find(t => t.id === threadId);
        if (!thread) {
          return throwError(() => ({
            success: false,
            code: 'CHAT_THREAD_NOT_FOUND',
            message: `Chat thread ID ${threadId} not found.`,
            timestamp: new Date().toISOString()
          }));
        }

        thread.unreadCountCustomer = 0;
        this.dbService.saveDatabase(this.dbService.getSnapshot());

        return of({
          success: true,
          message: 'Chat thread retrieved.',
          data: thread,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  sendMessage(request: SendMessageRequest): Observable<ApiResponse<ChatMessage>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        const db = this.dbService.getSnapshot();
        const thread = db.chatThreads.find(t => t.id === request.threadId);

        if (!thread) {
          return throwError(() => ({
            success: false,
            code: 'CHAT_THREAD_NOT_FOUND',
            message: 'Chat thread not found.',
            timestamp: new Date().toISOString()
          }));
        }

        const msgId = this.dbService.nextId(thread.messages);
        const userMsg: ChatMessage = {
          id: msgId,
          threadId: thread.id,
          senderType: 'CUSTOMER',
          senderName: currentUser ? currentUser.firstName : 'Guest',
          messageText: request.messageText,
          createdAt: new Date().toISOString()
        };

        thread.messages.push(userMsg);
        thread.lastMessageText = request.messageText;
        thread.lastMessageAt = userMsg.createdAt;
        thread.updatedAt = userMsg.createdAt;

        this.dbService.saveDatabase(db);

        return of({
          success: true,
          message: 'Message sent.',
          data: userMsg,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  escalateToAdmin(threadId: number): Observable<ApiResponse<ChatThread>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const db = this.dbService.getSnapshot();
        const thread = db.chatThreads.find(t => t.id === threadId);

        if (!thread) {
          return throwError(() => ({
            success: false,
            code: 'CHAT_THREAD_NOT_FOUND',
            message: 'Thread not found.',
            timestamp: new Date().toISOString()
          }));
        }

        thread.mode = 'ADMIN';
        thread.status = 'WAITING_FOR_ADMIN';
        thread.unreadCountAdmin += 1;
        thread.updatedAt = new Date().toISOString();

        const sysMsg: ChatMessage = {
          id: this.dbService.nextId(thread.messages),
          threadId: thread.id,
          senderType: 'SYSTEM',
          senderName: 'System Notice',
          messageText: 'Your conversation has been escalated to Front Desk Staff. An agent will join shortly.',
          createdAt: new Date().toISOString()
        };
        thread.messages.push(sysMsg);

        this.dbService.saveDatabase(db);

        return of({
          success: true,
          message: 'Escalated to human staff.',
          data: thread,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
