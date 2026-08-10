import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AccountSidebarComponent } from '../account-sidebar/account-sidebar.component';
import { ChatbotWidgetComponent } from '../../shared/components/chatbot-widget/chatbot-widget.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    AccountSidebarComponent,
    ChatbotWidgetComponent,
    ToastContainerComponent,
    ConfirmationDialogComponent
  ],
  template: `
    <div class="customer-shell">
      <div *ngIf="loadingService.isLoading()" class="global-progress-bar"></div>
      <app-header></app-header>

      <div class="customer-body">
        <div class="customer-container">
          <div class="layout-grid">
            <app-account-sidebar class="sidebar-col"></app-account-sidebar>

            <main class="content-col">
              <router-outlet></router-outlet>
            </main>
          </div>
        </div>
      </div>

      <app-footer></app-footer>

      <app-chatbot-widget></app-chatbot-widget>
      <app-toast-container></app-toast-container>
      <app-confirmation-dialog></app-confirmation-dialog>
    </div>
  `,
  styles: [`
    .customer-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #F8FAFC;
    }

    .customer-body {
      flex: 1;
      padding: 2rem 0;
    }

    .customer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .layout-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1.5rem;

      @media (max-width: 960px) {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomerLayoutComponent {
  public loadingService = inject(LoadingService);
}
