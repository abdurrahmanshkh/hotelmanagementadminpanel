import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ChatThread, ChatThreadStatus, ChatMode } from '../../../core/models';

@Component({
  selector: 'app-chat-inbox',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PageHeaderComponent,
    SearchInputComponent,
    IconComponent
  ],
  template: `
    <div class="chat-inbox-page">
      <app-page-header title="Front-Desk Chat Inbox" subtitle="Manage escalated guest messaging & AI bot handoffs"></app-page-header>

      <div class="chat-layout card">
        <!-- Thread List Sidebar -->
        <div class="threads-sidebar">
          <div class="sidebar-header">
            <app-search-input
              [value]="searchQuery"
              placeholder="Search guest or room..."
              (search)="onSearch($event)"
            ></app-search-input>

            <div class="filter-pills">
              <button class="pill" [class.pill--active]="selectedStatus === 'ALL'" (click)="filterStatus('ALL')">All</button>
              <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.WAITING_FOR_ADMIN" (click)="filterStatus(StatusEnum.WAITING_FOR_ADMIN)">Waiting</button>
              <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.ASSIGNED" (click)="filterStatus(StatusEnum.ASSIGNED)">Active</button>
              <button class="pill" [class.pill--active]="selectedStatus === StatusEnum.RESOLVED" (click)="filterStatus(StatusEnum.RESOLVED)">Resolved</button>
            </div>
          </div>

          <div *ngIf="loading" class="sidebar-loading">Loading threads...</div>

          <div *ngIf="threads.length === 0 && !loading" class="empty-threads">
            No guest chat threads match criteria.
          </div>

          <div *ngIf="threads.length > 0" class="thread-list">
            <div
              *ngFor="let thread of threads"
              class="thread-card"
              [class.thread-card--selected]="activeThread?.id === thread.id"
              [class.thread-card--unread]="thread.unreadCount > 0"
              (click)="selectThread(thread)"
            >
              <div class="thread-card__top flex-between">
                <strong class="guest-name">{{ thread.guestName }}</strong>
                <span class="thread-time">{{ formatTime(thread.lastMessageAt) }}</span>
              </div>
              <div class="thread-card__meta flex-between">
                <span class="room-tag">Room {{ thread.roomNumber || 'N/A' }}</span>
                <span class="mode-tag" [class.mode-tag--escalated]="thread.mode === ModeEnum.ADMIN">
                  {{ thread.mode === ModeEnum.ADMIN ? 'ESCALATED' : 'BOT' }}
                </span>
              </div>
              <p class="thread-snippet">"{{ thread.lastMessageText }}"</p>
            </div>
          </div>
        </div>

        <!-- Thread Conversation View -->
        <div class="conversation-panel">
          <div *ngIf="!activeThread" class="empty-conversation">
            <app-icon name="chat" [size]="40" color="#64748B" className="empty-icon"></app-icon>
            <h3>Select a guest chat thread from the left panel</h3>
            <p>View guest messages, review AI bot responses, or send staff replies.</p>
          </div>

          <div *ngIf="activeThread" class="conversation-content">
            <!-- Header -->
            <div class="conversation-header flex-between">
              <div class="header-info">
                <h2>{{ activeThread.guestName }} (Room {{ activeThread.roomNumber || 'N/A' }})</h2>
                <div class="header-sub">
                  <span>Status: <strong>{{ activeThread.status }}</strong></span> •
                  <span>Mode: <strong>{{ activeThread.mode }}</strong></span>
                </div>
              </div>
              <div class="header-actions">
                <button
                  *ngIf="activeThread.status !== StatusEnum.RESOLVED"
                  class="btn btn--success"
                  (click)="resolveThread()"
                >
                  Mark Resolved
                </button>
              </div>
            </div>

            <!-- Messages Stream -->
            <div class="messages-stream">
              <div
                *ngFor="let msg of activeThread.messages || []"
                class="chat-bubble-wrapper"
                [class.chat-bubble-wrapper--guest]="msg.senderType === 'CUSTOMER'"
                [class.chat-bubble-wrapper--bot]="msg.senderType === 'BOT'"
                [class.chat-bubble-wrapper--admin]="msg.senderType === 'ADMIN'"
              >
                <div class="sender-label">{{ msg.senderName }}</div>
                <div class="chat-bubble">
                  {{ msg.content }}
                </div>
                <span class="bubble-time">{{ formatTime(msg.sentAt) }}</span>
              </div>
            </div>

            <!-- Reply Form -->
            <div class="reply-bar">
              <input
                type="text"
                [(ngModel)]="replyText"
                placeholder="Type your response to guest..."
                (keyup.enter)="sendReply()"
                class="reply-input"
              />
              <button class="btn btn--primary" [disabled]="!replyText.trim()" (click)="sendReply()">
                Send Reply ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-inbox-page { display: flex; flex-direction: column; gap: 1.25rem; height: calc(100vh - 120px); }
    .chat-layout { display: grid; grid-template-columns: 340px 1fr; height: 100%; min-height: 500px; overflow: hidden; padding: 0; @media (max-width: 1023px) { grid-template-columns: 1fr; } }
    .threads-sidebar { border-right: 1px solid #E5E7EB; display: flex; flex-direction: column; background: #F9FAFB; height: 100%; overflow: hidden; }
    .sidebar-header { padding: 1rem; border-bottom: 1px solid #E5E7EB; display: flex; flex-direction: column; gap: 0.75rem; flex-shrink: 0; }
    .filter-pills { display: flex; gap: 0.375rem; flex-wrap: wrap; }
    .pill { padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px; border: 1px solid #D1D5DB; background: #FFF; cursor: pointer; &--active { background: #11243E; color: #FFF; font-weight: 600; } }
    .sidebar-loading, .empty-threads { padding: 1.5rem; text-align: center; font-size: 0.8125rem; color: #6B7280; }
    .thread-list { flex: 1 1 auto; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; }
    .thread-card { padding: 0.875rem 1rem; border-bottom: 1px solid #E5E7EB; cursor: pointer; transition: background 0.15s; &:hover { background: #F3F4F6; } &--selected { background: #E8F0FE !important; border-left: 4px solid #11243E; } &--unread { font-weight: 700; background: #FEF3D6; } }
    .guest-name { font-size: 0.875rem; color: #11243E; }
    .thread-time { font-size: 0.75rem; color: #6B7280; }
    .thread-card__meta { margin-top: 0.25rem; }
    .room-tag { font-size: 0.75rem; color: #4B5563; font-weight: 600; }
    .mode-tag { font-size: 0.6875rem; font-weight: 700; color: #2563EB; &--escalated { color: #C62828; } }
    .thread-snippet { font-size: 0.8125rem; color: #6B7280; margin-top: 0.375rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
    .conversation-panel { display: flex; flex-direction: column; height: 100%; min-height: 0; background: #FFF; overflow: hidden; }
    .empty-conversation { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #6B7280; padding: 2rem; .empty-icon { font-size: 3rem; margin-bottom: 0.75rem; } }
    .conversation-content { display: flex; flex-direction: column; height: 100%; min-height: 0; overflow: hidden; }
    .conversation-header { padding: 1rem 1.25rem; border-bottom: 1px solid #E5E7EB; flex-shrink: 0; h2 { font-size: 1.125rem; color: #11243E; font-weight: 700; } .header-sub { font-size: 0.8125rem; color: #6B7280; } }
    .messages-stream { flex: 1 1 auto; padding: 1.25rem; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; gap: 1rem; background: #F9FAFB; }
    .chat-bubble-wrapper { display: flex; flex-direction: column; max-width: 70%; &--guest { align-self: flex-start; .chat-bubble { background: #FFF; border: 1px solid #E5E7EB; color: #1F2937; } } &--bot { align-self: flex-start; .chat-bubble { background: #E8F0FE; border: 1px solid #BFDBFE; color: #1E40AF; } } &--admin { align-self: flex-end; .chat-bubble { background: #11243E; color: #FFF; } .sender-label, .bubble-time { text-align: right; } } }
    .sender-label { font-size: 0.7rem; font-weight: 600; color: #6B7280; margin-bottom: 0.125rem; }
    .chat-bubble { padding: 0.75rem 1rem; border-radius: 12px; font-size: 0.875rem; line-height: 1.4; }
    .bubble-time { font-size: 0.6875rem; color: #9CA3AF; margin-top: 0.25rem; }
    .reply-bar { flex: 0 0 auto; padding: 1rem; border-top: 1px solid #E5E7EB; display: flex; gap: 0.75rem; background: #FFF; position: relative; z-index: 5; }
    .reply-input { flex: 1; padding: 0.625rem 0.875rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; &--primary { background: #11243E; color: #FFF; } &--success { background: #16803C; color: #FFF; } }
  `]
})
export class ChatInboxComponent implements OnInit {
  private chatRepo = inject(ChatRepository);
  private toastService = inject(ToastService);

  public StatusEnum = ChatThreadStatus;
  public ModeEnum = ChatMode;

  public threads: ChatThread[] = [];
  public activeThread: ChatThread | null = null;
  public loading = false;
  public searchQuery = '';
  public selectedStatus = 'ALL';
  public replyText = '';

  ngOnInit(): void {
    this.loadThreads();
  }

  loadThreads(): void {
    this.loading = true;
    const filter: any = { page: 0, size: 50 };
    if (this.selectedStatus !== 'ALL') filter.status = this.selectedStatus as ChatThreadStatus;
    if (this.searchQuery) filter.query = this.searchQuery;

    this.chatRepo.getThreads(filter).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.threads = res.data.items;
          if (this.threads.length > 0 && !this.activeThread) {
            this.selectThread(this.threads[0]);
          }
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load chat threads');
      }
    });
  }

  selectThread(thread: ChatThread): void {
    this.chatRepo.getThreadById(thread.id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.activeThread = res.data;
          this.chatRepo.markAsRead(thread.id).subscribe();
        }
      }
    });
  }

  onSearch(q: string): void {
    this.searchQuery = q;
    this.loadThreads();
  }

  filterStatus(status: string): void {
    this.selectedStatus = status;
    this.loadThreads();
  }

  sendReply(): void {
    if (!this.activeThread || !this.replyText.trim()) return;
    const content = this.replyText.trim();
    this.replyText = '';

    this.chatRepo.sendMessage(this.activeThread.id, { content }).subscribe({
      next: (res) => {
        if (this.activeThread && res.data) {
          if (!this.activeThread.messages) this.activeThread.messages = [];
          this.activeThread.messages.push(res.data);
          this.activeThread.lastMessageText = content;
        }
      },
      error: (err: Error) => {
        this.toastService.error(err.message || 'Failed to send message');
      }
    });
  }

  resolveThread(): void {
    if (!this.activeThread) return;
    this.chatRepo.resolveThread(this.activeThread.id).subscribe({
      next: () => {
        if (this.activeThread) this.activeThread.status = ChatThreadStatus.RESOLVED;
        this.toastService.success('Chat thread marked as resolved.', 'Thread Resolved');
        this.loadThreads();
      }
    });
  }

  formatTime(timeStr: string): string {
    return DateFormatter.formatTime(timeStr);
  }
}
