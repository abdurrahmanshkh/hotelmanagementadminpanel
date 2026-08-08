import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Guest Directory" subtitle="Manage registered hotel guest profiles & history"></app-page-header>
    <div class="card"><p>Guest List Component ready.</p></div>
  `
})
export class GuestListComponent {}
