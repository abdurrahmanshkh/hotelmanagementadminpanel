import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { DateFormatter } from '../../../core/utilities/date-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ChatThread } from '../../../core/models';

@Component({
  selector: 'app-chat-thread',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PageHeaderComponent,
    ButtonComponent,
    SkeletonLoaderComponent
  ],
  template: `
    <div class="chat-thread-page">
      <app-page-header
        [title]="thread ? 'Chat - ' + thread.guestName : 'Loading Thread...'"
        subtitle="Direct guest communication thread"
      >
        <div actions class="header-actions">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Back to Inbox</app-button>
        </div>
      </app-page-header>

      <app-skeleton-loader *ngIf="loading" height="500px"></app-skeleton-loader>

      <div *ngIf="thread && !loading" class="thread-box card">
        <div class="messages-stream">
          <div
            *ngFor="let msg of thread.messages || []"
            class="chat-bubble-wrapper"
            [class.chat-bubble-wrapper--guest]="msg.senderType === 'CUSTOMER'"
            [class.chat-bubble-wrapper--admin]="msg.senderType === 'ADMIN'"
          >
            <div class="sender-label">{{ msg.senderName }}</div>
            <div class="chat-bubble">{{ msg.content }}</div>
            <span class="bubble-time">{{ formatTime(msg.sentAt) }}</span>
          </div>
        </div>

        <div class="reply-bar">
          <input
            type="text"
            [(ngModel)]="replyText"
            placeholder="Type your response..."
            (keyup.enter)="sendReply()"
            class="reply-input"
          />
          <button class="btn btn--primary" [disabled]="!replyText.trim()" (click)="sendReply()">
            Send ➔
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-thread-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .thread-box { height: 600px; display: flex; flex-direction: column; padding: 0; overflow: hidden; }
    .messages-stream { flex: 1; padding: 1.25rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; background: #F9FAFB; }
    .chat-bubble-wrapper { display: flex; flex-direction: column; max-width: 70%; &--guest { align-self: flex-start; .chat-bubble { background: #FFF; border: 1px solid #E5E7EB; color: #1F2937; } } &--admin { align-self: flex-end; .chat-bubble { background: #11243E; color: #FFF; } .sender-label, .bubble-time { text-align: right; } } }
    .sender-label { font-size: 0.7rem; font-weight: 600; color: #6B7280; margin-bottom: 0.125rem; }
    .chat-bubble { padding: 0.75rem 1rem; border-radius: 12px; font-size: 0.875rem; line-height: 1.4; }
    .bubble-time { font-size: 0.6875rem; color: #9CA3AF; margin-top: 0.25rem; }
    .reply-bar { padding: 1rem; border-top: 1px solid #E5E7EB; display: flex; gap: 0.75rem; background: #FFF; }
    .reply-input { flex: 1; padding: 0.625rem 0.875rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; &--primary { background: #11243E; color: #FFF; } }
  `]
})
export class ChatThreadComponent implements OnInit {
  private chatRepo = inject(ChatRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public thread: ChatThread | null = null;
  public loading = true;
  public replyText = '';

  ngOnInit(): void {
    const threadId = Number(this.route.snapshot.paramMap.get('threadId'));
    if (threadId) {
      this.chatRepo.getThreadById(threadId).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success && res.data) {
            this.thread = res.data;
          }
        },
        error: (err: Error) => {
          this.loading = false;
          this.toastService.error(err.message || 'Failed to load chat thread');
        }
      });
    }
  }

  sendReply(): void {
    if (!this.thread || !this.replyText.trim()) return;
    const content = this.replyText.trim();
    this.replyText = '';

    this.chatRepo.sendMessage(this.thread.id, { content }).subscribe({
      next: (res) => {
        if (this.thread && res.data) {
          if (!this.thread.messages) this.thread.messages = [];
          this.thread.messages.push(res.data);
        }
      },
      error: (err: Error) => {
        this.toastService.error(err.message || 'Failed to send message');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/chats']);
  }

  formatTime(timeStr: string): string {
    return DateFormatter.formatTime(timeStr);
  }
}
