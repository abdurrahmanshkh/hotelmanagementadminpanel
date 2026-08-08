import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-maintenance-detail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Maintenance Record Details" subtitle="View repair ticket progress"></app-page-header>
    <div class="card"><p>Maintenance Detail Component ready.</p></div>
  `
})
export class MaintenanceDetailComponent {}
