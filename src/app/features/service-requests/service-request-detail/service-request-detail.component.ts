import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-service-request-detail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Service Request Details" subtitle="View request status & assignment"></app-page-header>
    <div class="card"><p>Service Request Detail Component ready.</p></div>
  `
})
export class ServiceRequestDetailComponent {}
