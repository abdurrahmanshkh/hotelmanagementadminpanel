import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-service-report',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Service Request Metrics" subtitle="Response & resolution time analytics"></app-page-header>
    <div class="card"><p>Service Report Component ready.</p></div>
  `
})
export class ServiceReportComponent {}
