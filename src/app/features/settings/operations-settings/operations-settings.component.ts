import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-operations-settings',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Operations Settings" subtitle="Check-in, checkout & cancellation cutoff policies"></app-page-header>
    <div class="card"><p>Operations Settings Component ready.</p></div>
  `
})
export class OperationsSettingsComponent {}
