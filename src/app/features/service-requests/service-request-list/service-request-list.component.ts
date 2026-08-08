import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-service-request-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Service Requests" subtitle="Track guest service requests & staff fulfillment"></app-page-header>
    <div class="card"><p>Service Request List Component ready.</p></div>
  `
})
export class ServiceRequestListComponent {}
