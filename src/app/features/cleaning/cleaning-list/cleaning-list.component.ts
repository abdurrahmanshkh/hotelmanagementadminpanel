import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-cleaning-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Housekeeping Tasks" subtitle="Manage room cleaning queue"></app-page-header>
    <div class="card"><p>Cleaning List Component ready.</p></div>
  `
})
export class CleaningListComponent {}
