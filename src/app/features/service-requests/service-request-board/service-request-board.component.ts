import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-service-request-board',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Service Request Kanban Board" subtitle="Visual workflow tracking"></app-page-header>
    <div class="card"><p>Service Request Board Component ready.</p></div>
  `
})
export class ServiceRequestBoardComponent {}
