import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RoomRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatter } from '../../../core/utilities/currency-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RoomType } from '../../../core/models';

@Component({
  selector: 'app-room-type-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    DataTableComponent,
    ButtonComponent
  ],
  template: `
    <div class="room-type-list-page">
      <app-page-header title="Room Types" subtitle="Define room categories, occupancy limits & base rates">
        <div actions class="header-actions">
          <app-button variant="outline" size="md" (btnClick)="navigate('/admin/amenities')">
            ✨ Manage Amenities
          </app-button>
          <app-button variant="accent" size="md" (btnClick)="navigate('/admin/room-types/new')">
            ➕ Add Room Type
          </app-button>
        </div>
      </app-page-header>

      <!-- Data Table -->
      <app-data-table
        [isEmpty]="roomTypes.length === 0"
        [loading]="loading"
        [colspan]="7"
        emptyMessage="No room types configured."
      >
        <ng-container headers>
          <th>Category Name</th>
          <th>Code</th>
          <th>Adult / Child Occupancy</th>
          <th>Base Nightly Rate</th>
          <th>Price Range Bounds</th>
          <th>Active</th>
          <th>Actions</th>
        </ng-container>

        <ng-container rows>
          <tr *ngFor="let item of roomTypes">
            <td><strong>{{ item.name }}</strong></td>
            <td><code>{{ item.code }}</code></td>
            <td>{{ item.adultCapacity || item.maximumAdults || 2 }} Adults / {{ item.childCapacity || item.maximumChildren || 0 }} Children</td>
            <td><strong>{{ formatCurrency(item.basePrice) }}</strong></td>
            <td>{{ formatCurrency(item.minimumPrice) }} - {{ formatCurrency(item.maximumPrice) }}</td>
            <td>
              <span class="badge" [class.badge--success]="item.isActive || item.active">{{ (item.isActive || item.active) ? 'ACTIVE' : 'INACTIVE' }}</span>
            </td>
            <td>
              <button class="btn-action" (click)="editType(item.id)">Edit Category</button>
            </td>
          </tr>
        </ng-container>
      </app-data-table>
    </div>
  `,
  styles: [`
    .room-type-list-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .btn-action { padding: 0.25rem 0.625rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; &:hover { background: #11243E; color: #FFF; } }
  `]
})
export class RoomTypeListComponent implements OnInit {
  private roomRepo = inject(RoomRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public roomTypes: RoomType[] = [];
  public loading = false;

  ngOnInit(): void {
    this.loadRoomTypes();
  }

  loadRoomTypes(): void {
    this.loading = true;
    this.roomRepo.getRoomTypes().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.roomTypes = res.data;
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load room types');
      }
    });
  }

  editType(id: number): void {
    this.router.navigate(['/admin/room-types', id, 'edit']);
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }

  formatCurrency(amt: number): string {
    return CurrencyFormatter.format(amt);
  }
}
