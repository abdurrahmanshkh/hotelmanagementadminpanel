import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Booking Management" subtitle="Search, filter, and manage guest reservations"></app-page-header>
    <div class="card"><p>Booking List Component ready.</p></div>
  `
})
export class BookingListComponent {}
