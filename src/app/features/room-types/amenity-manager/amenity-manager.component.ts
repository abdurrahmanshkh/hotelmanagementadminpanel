import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RoomRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Amenity } from '../../../core/models';

@Component({
  selector: 'app-amenity-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="amenity-manager-page">
      <app-page-header title="Amenities Manager" subtitle="Manage hotel & room category amenities">
        <div actions class="header-actions">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">
            <app-icon name="arrow-left" [size]="14"></app-icon> Back to Room Types
          </app-button>
        </div>
      </app-page-header>

      <div class="amenity-grid">
        <!-- Create Form -->
        <div class="card create-card">
          <h3>Add New Amenity</h3>
          <div class="form-group">
            <label>Amenity Name</label>
            <input type="text" [(ngModel)]="newAmenityName" placeholder="e.g. Jacuzzi Bath" class="form-control" />
          </div>
          <div class="form-group">
            <label>Icon Key</label>
            <input type="text" [(ngModel)]="newAmenityIcon" placeholder="e.g. bath" class="form-control" />
          </div>
          <app-button variant="accent" size="md" [disabled]="!newAmenityName.trim()" (btnClick)="createAmenity()">
            <app-icon name="plus" [size]="16"></app-icon> Create Amenity
          </app-button>
        </div>

        <!-- Amenities List -->
        <div class="card list-card">
          <h3>Configured Amenities ({{ amenities.length }})</h3>

          <div class="tags-container">
            <div *ngFor="let item of amenities" class="amenity-chip">
              <app-icon [name]="item.iconName || item.name" [size]="16" color="#0F172A"></app-icon>
              <span class="chip-name">{{ item.name }}</span>
              <button class="chip-delete" (click)="deleteAmenity(item.id)">
                <app-icon name="x" [size]="14"></app-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .amenity-manager-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .amenity-grid { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; @media (max-width: 768px) { grid-template-columns: 1fr; } }
    .create-card, .list-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; h3 { font-size: 1.125rem; font-weight: 700; color: #11243E; } }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; label { font-size: 0.8125rem; font-weight: 600; color: #374151; } }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .tags-container { display: flex; flex-wrap: wrap; gap: 0.625rem; }
    .amenity-chip { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.75rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; color: #1F2937; }
    .chip-delete { background: none; border: none; font-size: 0.75rem; color: #9CA3AF; cursor: pointer; &:hover { color: #C62828; } }
  `]
})
export class AmenityManagerComponent implements OnInit {
  private roomRepo = inject(RoomRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public amenities: Amenity[] = [];
  public newAmenityName = '';
  public newAmenityIcon = '✨';

  ngOnInit(): void {
    this.loadAmenities();
  }

  loadAmenities(): void {
    this.roomRepo.getAmenities().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.amenities = res.data;
        }
      }
    });
  }

  createAmenity(): void {
    if (!this.newAmenityName.trim()) return;
    const name = this.newAmenityName.trim();
    const icon = this.newAmenityIcon.trim() || '✨';
    this.roomRepo.createAmenity(name, icon).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.amenities.push(res.data);
          this.newAmenityName = '';
          this.toastService.success('Amenity added successfully.', 'Created');
        }
      }
    });
  }

  deleteAmenity(id: number): void {
    this.amenities = this.amenities.filter(a => a.id !== id);
    this.toastService.info('Amenity removed.', 'Deleted');
  }

  getAmenityEmoji(iconName?: string, name?: string): string {
    const str = ((iconName || '') + ' ' + (name || '')).toLowerCase();
    if (str.includes('wifi')) return '📶';
    if (str.includes('tv')) return '📺';
    if (str.includes('coffee') || str.includes('mini bar') || str.includes('bar')) return '☕';
    if (str.includes('wind') || str.includes('ac') || str.includes('air')) return '❄️';
    if (str.includes('bath') || str.includes('jacuzzi') || str.includes('tub')) return '🛁';
    if (str.includes('pool')) return '🏊';
    if (str.includes('view') || str.includes('city')) return '🏙️';
    if (str.includes('balcony')) return '🏞️';
    if (str.includes('safe') || str.includes('lock')) return '🔒';
    return (iconName && iconName.length <= 2) ? iconName : '✨';
  }

  goBack(): void {
    this.router.navigate(['/admin/room-types']);
  }
}
