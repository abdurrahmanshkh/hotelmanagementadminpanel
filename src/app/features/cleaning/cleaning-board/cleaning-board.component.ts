import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-cleaning-board',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Housekeeping Kanban Board" subtitle="Visual task progress workflow"></app-page-header>
    <div class="card"><p>Cleaning Board Component ready.</p></div>
  `
})
export class CleaningBoardComponent {}
