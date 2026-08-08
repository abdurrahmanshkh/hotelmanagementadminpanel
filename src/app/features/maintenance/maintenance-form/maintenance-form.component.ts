import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Log Maintenance Issue" subtitle="Create new facility ticket"></app-page-header>
    <div class="card"><p>Maintenance Form Component ready.</p></div>
  `
})
export class MaintenanceFormComponent {}
