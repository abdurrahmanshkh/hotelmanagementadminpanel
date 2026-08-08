import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-room-type-form',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Room Type Editor" subtitle="Create or update room category"></app-page-header>
    <div class="card"><p>Room Type Form Component ready.</p></div>
  `
})
export class RoomTypeFormComponent {}
