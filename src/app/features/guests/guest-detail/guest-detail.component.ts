import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-guest-detail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Guest Profile Details" subtitle="View guest information & past stays"></app-page-header>
    <div class="card"><p>Guest Detail Component ready.</p></div>
  `
})
export class GuestDetailComponent {}
