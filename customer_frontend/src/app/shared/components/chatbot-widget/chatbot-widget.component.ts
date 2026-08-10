import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotEngineService } from '../../../core/services/chatbot-engine.service';
import { ChatRepository } from '../../../core/repositories/contracts/chat.repository';
import { IconComponent } from '../icon/icon.component';
import { ChatMessage } from '../../../core/models';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="chatbot-widget">
      <!-- Floating Trigger Button -->
      <button
        type="button"
        class="chatbot-trigger"
        (click)="isOpen = !isOpen"
        [title]="isOpen ? 'Close Chat' : 'SmartStay AI Concierge'"
      >
        <app-icon [name]="isOpen ? 'x' : 'bot'" [size]="24" color="#FFFFFF"></app-icon>
        <span *ngIf="!isOpen" class="online-pulse"></span>
      </button>

      <!-- Chat Window Popup -->
      <div class="chatbot-window" *ngIf="isOpen">
        <div class="window-header">
          <div class="header-info flex-gap">
            <app-icon name="bot" [size]="20" color="#D97706"></app-icon>
            <div>
              <h4 class="title">SmartStay AI Concierge</h4>
              <span class="sub">24/7 Digital Guest Assistant</span>
            </div>
          </div>
          <button type="button" class="btn-close" (click)="isOpen = false">
            <app-icon name="x" [size]="16" color="#94A3B8"></app-icon>
          </button>
        </div>

        <div class="messages-body">
          <div
            *ngFor="let msg of messages"
            [class]="'msg-bubble msg--' + msg.senderType.toLowerCase()"
          >
            <div class="sender-name">{{ msg.senderName }}</div>
            <p class="msg-text">{{ msg.messageText }}</p>
            <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>

            <!-- Suggested Actions -->
            <div *ngIf="msg.suggestedActions" class="actions-list">
              <button
                *ngFor="let act of msg.suggestedActions"
                type="button"
                class="action-btn"
                (click)="sendQuickQuery(act.actionValue)"
              >
                {{ act.label }}
              </button>
            </div>
          </div>

          <div *ngIf="isThinking" class="msg-bubble msg--bot thinking">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>

        <div class="window-footer">
          <div class="input-row">
            <input
              type="text"
              class="chat-input"
              placeholder="Ask about Wi-Fi, breakfast, checkout..."
              [(ngModel)]="inputText"
              (keyup.enter)="onSubmit()"
            />
            <button type="button" class="btn-send" (click)="onSubmit()" [disabled]="!inputText.trim()">
              <app-icon name="send" [size]="16" color="#FFFFFF"></app-icon>
            </button>
          </div>
          <button type="button" class="btn-escalate" (click)="escalateToHuman()">
            Connect to Front Desk Staff &rarr;
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-widget {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9990;
    }

    .chatbot-trigger {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border: 2px solid #D97706;
      box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.06);
      }

      .online-pulse {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #047857;
        border: 2px solid #FFFFFF;
      }
    }

    .chatbot-window {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 360px;
      height: 480px;
      background-color: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.2), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
      border: 1px solid #E2E8F0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: popup-slide 0.2s ease-out;

      @media (max-width: 480px) {
        width: calc(100vw - 2rem);
        right: -0.5rem;
      }
    }

    @keyframes popup-slide {
      from { opacity: 0; transform: translateY(12px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .window-header {
      padding: 0.875rem 1rem;
      background-color: #0F172A;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title { font-size: 0.875rem; font-weight: 700; }
      .sub { font-size: 0.6875rem; color: #D97706; font-weight: 600; display: block; }

      .btn-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
      }
    }

    .messages-body {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background-color: #F8FAFC;
    }

    .msg-bubble {
      max-width: 85%;
      padding: 0.625rem 0.875rem;
      border-radius: 12px;
      font-size: 0.8125rem;
      line-height: 1.4;

      .sender-name {
        font-size: 0.6875rem;
        font-weight: 700;
        margin-bottom: 0.125rem;
      }

      .msg-time {
        font-size: 0.625rem;
        color: #94A3B8;
        display: block;
        margin-top: 0.25rem;
        text-align: right;
      }

      &.msg--bot, &.msg--system {
        background-color: #FFFFFF;
        border: 1px solid #E2E8F0;
        color: #0F172A;
        align-self: flex-start;
        .sender-name { color: #D97706; }
      }

      &.msg--customer {
        background-color: #0F172A;
        color: #FFFFFF;
        align-self: flex-end;
        .sender-name { color: #CBD5E1; }
        .msg-time { color: #64748B; }
      }

      &.thinking {
        display: flex;
        gap: 0.25rem;
        padding: 0.75rem;
        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94A3B8;
          animation: pulse 1s infinite alternate;
          &:nth-child(2) { animation-delay: 0.2s; }
          &:nth-child(3) { animation-delay: 0.4s; }
        }
      }
    }

    @keyframes pulse { to { opacity: 0.3; } }

    .actions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: 0.5rem;

      .action-btn {
        background: #F1F5F9;
        border: 1px solid #CBD5E1;
        border-radius: 9999px;
        padding: 0.25rem 0.625rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: #334155;
        cursor: pointer;
        &:hover { background: #E2E8F0; color: #0F172A; }
      }
    }

    .window-footer {
      padding: 0.75rem 1rem;
      background-color: #FFFFFF;
      border-top: 1px solid #E2E8F0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .input-row {
        display: flex;
        gap: 0.5rem;
      }

      .chat-input {
        flex: 1;
        padding: 0.5rem 0.75rem;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        font-size: 0.8125rem;
        outline: none;
        &:focus { border-color: #D97706; }
      }

      .btn-send {
        background-color: #0F172A;
        border: none;
        border-radius: 8px;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &:disabled { opacity: 0.5; }
      }

      .btn-escalate {
        background: none;
        border: none;
        font-size: 0.75rem;
        font-weight: 700;
        color: #D97706;
        cursor: pointer;
        text-align: center;
        &:hover { text-decoration: underline; }
      }
    }
  `]
})
export class ChatbotWidgetComponent implements OnInit {
  private engine = inject(ChatbotEngineService);
  private chatRepo = inject(ChatRepository);

  public isOpen = false;
  public inputText = '';
  public isThinking = false;

  public messages: ChatMessage[] = [
    {
      id: 1,
      threadId: 1,
      senderType: 'BOT',
      senderName: 'SmartStay Assistant',
      messageText: 'Hello! I am your SmartStay Concierge AI. How may I help you with your stay today?',
      createdAt: new Date().toISOString(),
      suggestedActions: [
        { label: 'Breakfast Hours', actionValue: 'What are breakfast timings?' },
        { label: 'Wi-Fi Password', actionValue: 'What is the Wi-Fi password?' },
        { label: 'Talk to Staff', actionValue: 'Connect me with an administrator' }
      ]
    }
  ];

  ngOnInit(): void {
    this.engine.loadKnowledge().subscribe();
  }

  sendQuickQuery(query: string): void {
    this.inputText = query;
    this.onSubmit();
  }

  onSubmit(): void {
    const text = this.inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Math.random(),
      threadId: 1,
      senderType: 'CUSTOMER',
      senderName: 'You',
      messageText: text,
      createdAt: new Date().toISOString()
    };

    this.messages.push(userMsg);
    this.inputText = '';
    this.isThinking = true;

    this.engine.query(text).subscribe(res => {
      this.isThinking = false;
      const botMsg: ChatMessage = {
        id: Math.random(),
        threadId: 1,
        senderType: 'BOT',
        senderName: 'SmartStay Assistant',
        messageText: res.answer,
        createdAt: new Date().toISOString(),
        suggestedActions: res.shouldSuggestEscalation
          ? [{ label: 'Connect to Front Desk Staff', actionValue: 'Connect me with an administrator' }]
          : undefined
      };
      this.messages.push(botMsg);
    });
  }

  escalateToHuman(): void {
    this.messages.push({
      id: Math.random(),
      threadId: 1,
      senderType: 'SYSTEM',
      senderName: 'System',
      messageText: 'Transferring your chat thread to Front Desk Staff...',
      createdAt: new Date().toISOString()
    });

    this.chatRepo.escalateToAdmin(1).subscribe(res => {
      this.messages.push({
        id: Math.random(),
        threadId: 1,
        senderType: 'ADMIN',
        senderName: 'Front Desk Concierge',
        messageText: 'Hello! Front Desk Concierge staff has received your request and is online.',
        createdAt: new Date().toISOString()
      });
    });
  }

  formatTime(isoStr: string): string {
    const d = new Date(isoStr);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
