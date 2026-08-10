import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PricingRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatter } from '../../../core/utilities/currency-formatter.utility';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PricingRule } from '../../../core/models';

@Component({
  selector: 'app-pricing-rules',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    DataTableComponent,
    ButtonComponent
  ],
  template: `
    <div class="pricing-rules-page">
      <app-page-header title="Dynamic Pricing Engine" subtitle="Configure automated pricing rules, weekend markups & demand algorithms">
        <div actions class="header-actions">
          <app-button
            [variant]="dynamicPricingEnabled ? 'accent' : 'outline'"
            size="md"
            (btnClick)="toggleEngine()"
          >
            {{ dynamicPricingEnabled ? '⚡ Dynamic Engine ACTIVE' : '⏸ Engine PAUSED' }}
          </app-button>
          <app-button variant="outline" size="md" (btnClick)="recalculatePricing()">
            🔄 Recalculate Now
          </app-button>
          <app-button variant="primary" size="md" (btnClick)="navigate('/admin/pricing/new')">
            ➕ Add Pricing Rule
          </app-button>
        </div>
      </app-page-header>

      <!-- Data Table -->
      <app-data-table
        [isEmpty]="rules.length === 0"
        [loading]="loading"
        [colspan]="7"
        emptyMessage="No pricing rules configured."
      >
        <ng-container headers>
          <th>Rule Name</th>
          <th>Room Type</th>
          <th>Adjustment Type</th>
          <th>Adjustment Value</th>
          <th>Occupancy Trigger Range</th>
          <th>Active</th>
          <th>Actions</th>
        </ng-container>

        <ng-container rows>
          <tr *ngFor="let item of rules">
            <td><strong>{{ item.name }}</strong></td>
            <td>{{ item.roomTypeName || 'All Room Types' }}</td>
            <td><code>{{ item.adjustmentType }}</code></td>
            <td>
              <strong class="val-text">
                {{ item.adjustmentType.includes('PERCENTAGE') ? item.adjustmentValue + '%' : formatCurrency(item.adjustmentValue) }}
              </strong>
            </td>
            <td>{{ item.minOccupancyPercentage }}% - {{ item.maxOccupancyPercentage }}% Occupancy</td>
            <td>
              <span class="badge" [class.badge--success]="item.isActive">{{ item.isActive ? 'ACTIVE' : 'INACTIVE' }}</span>
            </td>
            <td>
              <button class="btn-action" (click)="editRule(item.id)">Edit Rule</button>
            </td>
          </tr>
        </ng-container>
      </app-data-table>
    </div>
  `,
  styles: [`
    .pricing-rules-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .val-text { color: #C99B4A; font-weight: 700; }
    .btn-action { padding: 0.25rem 0.625rem; background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; &:hover { background: #11243E; color: #FFF; } }
  `]
})
export class PricingRulesComponent implements OnInit {
  private pricingRepo = inject(PricingRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public rules: PricingRule[] = [];
  public loading = false;
  public dynamicPricingEnabled = true;

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.loading = true;
    this.pricingRepo.getPricingRules().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.rules = res.data;
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.toastService.error(err.message || 'Failed to load pricing rules');
      }
    });
  }

  toggleEngine(): void {
    this.dynamicPricingEnabled = !this.dynamicPricingEnabled;
    this.pricingRepo.toggleDynamicPricing(this.dynamicPricingEnabled).subscribe({
      next: () => {
        const state = this.dynamicPricingEnabled ? 'ACTIVATED' : 'PAUSED';
        this.toastService.info(`Dynamic Pricing Engine ${state}`, 'Engine Toggle');
      }
    });
  }

  recalculatePricing(): void {
    this.pricingRepo.recalculatePricing().subscribe({
      next: () => {
        this.toastService.success('Nightly room prices updated across inventory.', 'Recalculation Complete');
        this.loadRules();
      }
    });
  }

  editRule(id: number): void {
    this.router.navigate(['/admin/pricing', id, 'edit']);
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }

  formatCurrency(amt: number): string {
    return CurrencyFormatter.format(amt);
  }
}
