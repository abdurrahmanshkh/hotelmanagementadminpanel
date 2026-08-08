import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Maintenance Operations" subtitle="Facility repairs & technician assignments"></app-page-header>
    <div class="card"><p>Maintenance List Component ready.</p></div>
  `
})
export class MaintenanceListComponent {}
