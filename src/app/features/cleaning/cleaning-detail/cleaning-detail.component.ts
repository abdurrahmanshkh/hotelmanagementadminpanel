import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-cleaning-detail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Cleaning Task Details" subtitle="View task status & assignment"></app-page-header>
    <div class="card"><p>Cleaning Detail Component ready.</p></div>
  `
})
export class CleaningDetailComponent {}
