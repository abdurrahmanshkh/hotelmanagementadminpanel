import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-hotel-settings',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Hotel Identity & Settings" subtitle="Configure profile, address & financial defaults"></app-page-header>
    <div class="card"><p>Hotel Settings Component ready.</p></div>
  `
})
export class HotelSettingsComponent {}
