import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Booking Details" subtitle="View stay information & billing details"></app-page-header>
    <div class="card"><p>Booking Detail Component ready.</p></div>
  `
})
export class BookingDetailComponent {}
