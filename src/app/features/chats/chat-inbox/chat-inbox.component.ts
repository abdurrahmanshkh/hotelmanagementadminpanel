import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-chat-inbox',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Front-Desk Chat Inbox" subtitle="Manage escalated guest messaging threads"></app-page-header>
    <div class="card"><p>Chat Inbox Component ready.</p></div>
  `
})
export class ChatInboxComponent {}
