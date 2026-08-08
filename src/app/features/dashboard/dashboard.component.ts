import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Operational Dashboard" subtitle="Real-time hotel metrics & activity overview"></app-page-header>
    <div class="card"><p>Dashboard component ready.</p></div>
  `
})
export class DashboardComponent {}
