import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-amenity-manager',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Amenities Manager" subtitle="Manage hotel and room amenities"></app-page-header>
    <div class="card"><p>Amenity Manager Component ready.</p></div>
  `
})
export class AmenityManagerComponent {}
