import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ChatbotWidgetComponent } from '../../shared/components/chatbot-widget/chatbot-widget.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ChatbotWidgetComponent,
    ToastContainerComponent,
    ConfirmationDialogComponent
  ],
  template: `
    <div class="public-shell">
      <div *ngIf="loadingService.isLoading()" class="global-progress-bar"></div>
      <app-header></app-header>

      <main class="public-main">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>

      <!-- Floating Chatbot Widget & Global Utilities -->
      <app-chatbot-widget></app-chatbot-widget>
      <app-toast-container></app-toast-container>
      <app-confirmation-dialog></app-confirmation-dialog>
    </div>
  `,
  styles: [`
    .public-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #F8FAFC;
    }

    .public-main {
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  `]
})
export class PublicLayoutComponent {
  public loadingService = inject(LoadingService);
}
