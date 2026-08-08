import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-revenue-report',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Revenue Analytics & Export" subtitle="Gross vs Net revenue breakdowns"></app-page-header>
    <div class="card"><p>Revenue Report Component ready.</p></div>
  `
})
export class RevenueReportComponent {}
