import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatRepository } from '../../../core/repositories/contracts/chat.repository';
import { ChatbotEngineService } from '../../../core/services/chatbot-engine.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ChatMessage, ChatThread } from '../../../core/models';

@Component({
  selector: 'app-concierge-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
  template: `
    <div class="chat-page card-box">
      <div class="chat-header">
        <div class="header-title flex-gap">
          <app-icon name="bot" [size]="24" color="#D97706"></app-icon>
          <div>
            <h3>24/7 SmartStay AI &amp; Concierge Staff</h3>
            <span class="sub font-mono">Thread ID: #SS-CONCIERGE-01 &bull; Active Assistance</span>
          </div>
        </div>

        <app-button variant="outline" size="sm" (btnClick)="onEscalate()">
          Escalate to Front Desk Staff &rarr;
        </app-button>
      </div>

      <div class="messages-area">
        <div *ngFor="let m of messages" [class]="'msg-row msg--' + m.senderType.toLowerCase()">
          <div class="msg-bubble">
            <span class="sender font-mono">{{ m.senderName }}</span>
            <p class="text">{{ m.messageText }}</p>
            <span class="time">{{ formatTime(m.createdAt) }}</span>
          </div>
        </div>

        <div *ngIf="isThinking" class="msg-row msg--bot">
          <div class="msg-bubble thinking">
            <span>AI Concierge is typing...</span>
          </div>
        </div>
      </div>

      <div class="chat-footer">
        <div class="input-row">
          <input
            type="text"
            [(ngModel)]="inputText"
            (keyup.enter)="onSendMessage()"
            placeholder="Type your question or request..."
            class="input"
          />
          <app-button variant="primary" icon="send" (btnClick)="onSendMessage()" [disabled]="!inputText.trim()">
            Send
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-page {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; height: 600px; display: flex; flex-direction: column; overflow: hidden;
    }
    .chat-header {
      padding: 1.25rem; background: #0F172A; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between;
      h3 { font-size: 1rem; font-weight: 700; } .sub { font-size: 0.75rem; color: #D97706; }
    }
    .messages-area {
      flex: 1; padding: 1.5rem; background: #F8FAFC; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;
    }
    .msg-row {
      display: flex;
      &.msg--bot, &.msg--system { justify-content: flex-start; .msg-bubble { background: #FFFFFF; border: 1px solid #E2E8F0; color: #0F172A; .sender { color: #D97706; } } }
      &.msg--customer { justify-content: flex-end; .msg-bubble { background: #0F172A; color: #FFFFFF; .sender { color: #CBD5E1; } .time { color: #64748B; } } }
      &.msg--admin { justify-content: flex-start; .msg-bubble { background: #FFFBEB; border: 1px solid #FDE68A; color: #78350F; .sender { color: #B45309; } } }
    }
    .msg-bubble {
      max-width: 75%; padding: 0.75rem 1rem; border-radius: 12px; font-size: 0.875rem; line-height: 1.4;
      .sender { font-size: 0.6875rem; font-weight: 700; display: block; margin-bottom: 0.25rem; }
      .time { font-size: 0.625rem; color: #94A3B8; display: block; margin-top: 0.375rem; text-align: right; }
    }
    .chat-footer {
      padding: 1rem 1.25rem; background: #FFFFFF; border-top: 1px solid #E2E8F0;
      .input-row { display: flex; gap: 0.75rem; .input { flex: 1; padding: 0.625rem 0.875rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.875rem; outline: none; } }
    }
  `]
})
export class ConciergeChatComponent implements OnInit {
  private chatRepo = inject(ChatRepository);
  private engine = inject(ChatbotEngineService);
  public authState = inject(AuthStateService);
  private toast = inject(ToastService);

  public inputText = '';
  public isThinking = false;

  public messages: ChatMessage[] = [
    {
      id: 1,
      threadId: 1,
      senderType: 'BOT',
      senderName: 'SmartStay AI Concierge',
      messageText: 'Welcome to SmartStay Concierge Support. How may I assist your stay today?',
      createdAt: new Date().toISOString()
    }
  ];

  ngOnInit(): void {
    this.engine.loadKnowledge().subscribe();
  }

  onSendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;

    this.messages.push({
      id: Math.random(),
      threadId: 1,
      senderType: 'CUSTOMER',
      senderName: 'You',
      messageText: text,
      createdAt: new Date().toISOString()
    });

    this.inputText = '';
    this.isThinking = true;

    this.engine.query(text).subscribe(res => {
      this.isThinking = false;
      this.messages.push({
        id: Math.random(),
        threadId: 1,
        senderType: 'BOT',
        senderName: 'SmartStay AI Concierge',
        messageText: res.answer,
        createdAt: new Date().toISOString()
      });
    });
  }

  onEscalate(): void {
    this.chatRepo.escalateToAdmin(1).subscribe({
      next: () => {
        this.messages.push({
          id: Math.random(),
          threadId: 1,
          senderType: 'ADMIN',
          senderName: 'Front Desk Concierge',
          messageText: 'Front Desk Admin staff has received your escalation and joined this conversation.',
          createdAt: new Date().toISOString()
        });
        this.toast.info('Chat escalated to Front Desk support staff.');
      },
      error: () => {
        this.toast.error('Unable to escalate chat. Please try again.');
      }
    });
  }

  formatTime(isoStr: string): string {
    const d = new Date(isoStr);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
