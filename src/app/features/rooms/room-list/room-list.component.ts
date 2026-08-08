import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Rooms Inventory" subtitle="Manage physical room inventory and operational statuses"></app-page-header>
    <div class="card"><p>Room List Component ready.</p></div>
  `
})
export class RoomListComponent {}
