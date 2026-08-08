import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Room Details" subtitle="View room information & current status"></app-page-header>
    <div class="card"><p>Room Detail Component ready.</p></div>
  `
})
export class RoomDetailComponent {}
