import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-booking-report',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Booking Volume & Trends" subtitle="Cancellation rates & average stay length"></app-page-header>
    <div class="card"><p>Booking Report Component ready.</p></div>
  `
})
export class BookingReportComponent {}
