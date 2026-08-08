import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-chat-thread',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Chat Conversation" subtitle="Live guest thread"></app-page-header>
    <div class="card"><p>Chat Thread Component ready.</p></div>
  `
})
export class ChatThreadComponent {}
