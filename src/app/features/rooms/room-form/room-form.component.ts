import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Room Editor" subtitle="Create or modify room details"></app-page-header>
    <div class="card"><p>Room Form Component ready.</p></div>
  `
})
export class RoomFormComponent {}
