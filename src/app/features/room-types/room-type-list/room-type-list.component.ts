import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-room-type-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Room Types" subtitle="Manage room categories & pricing bounds"></app-page-header>
    <div class="card"><p>Room Type List Component ready.</p></div>
  `
})
export class RoomTypeListComponent {}
