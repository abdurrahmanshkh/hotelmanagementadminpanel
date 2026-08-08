import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-occupancy-report',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Occupancy Analytics" subtitle="Peak, average & maintenance occupancy impact"></app-page-header>
    <div class="card"><p>Occupancy Report Component ready.</p></div>
  `
})
export class OccupancyReportComponent {}
