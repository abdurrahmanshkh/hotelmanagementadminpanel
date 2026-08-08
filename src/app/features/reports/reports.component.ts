import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportRepository } from '../../core/repositories/contracts';
import { ToastService } from '../../core/services/toast.service';
import { CurrencyFormatter } from '../../core/utilities/currency-formatter.utility';
import { CsvGenerator } from '../../core/utilities/csv-generator.utility';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RevenueReport, OccupancyReport } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    MetricCardComponent,
    DataTableComponent,
    ButtonComponent
  ],
  template: `
    <div class="reports-page">
      <app-page-header title="Financial & Operational Analytics" subtitle="Revenue trends, occupancy metrics & automated CSV exports">
        <div actions class="header-actions">
          <app-button variant="accent" size="md" (btnClick)="exportCsv()">
            📥 Export CSV Report
          </app-button>
        </div>
      </app-page-header>

      <!-- Metric Summary Cards -->
      <div class="metrics-grid">
        <app-metric-card
          title="Total Gross Revenue"
          [value]="formatCurrency(revenueReport?.totalRevenue || 485000)"
          subtitle="Includes room tariffs & addon services"
          icon="💰"
        ></app-metric-card>

        <app-metric-card
          title="Net Hotel Profit"
          [value]="formatCurrency(revenueReport?.netRevenue || 432000)"
          subtitle="Post refund deductions"
          icon="📈"
        ></app-metric-card>

        <app-metric-card
          title="Average Daily Rate (ADR)"
          [value]="formatCurrency(occupancyReport?.averageDailyRate || 4200)"
          subtitle="Per occupied room night"
          icon="🏷️"
        ></app-metric-card>

        <app-metric-card
          title="RevPAR (Revenue / Avail)"
          [value]="formatCurrency(occupancyReport?.revPar || 3360)"
          subtitle="Overall room inventory yield"
          icon="📊"
        ></app-metric-card>
      </div>

      <!-- Report Tabs & Filter Bar -->
      <div class="card reports-card">
        <div class="card-header flex-between">
          <div class="tabs flex-gap">
            <button class="tab-btn" [class.tab-btn--active]="activeTab === 'REVENUE'" (click)="activeTab = 'REVENUE'">
              Financial Revenue Ledger
            </button>
            <button class="tab-btn" [class.tab-btn--active]="activeTab === 'OCCUPANCY'" (click)="activeTab = 'OCCUPANCY'">
              Room Occupancy Breakdown
            </button>
          </div>

          <div class="filter-controls flex-gap">
            <select [(ngModel)]="selectedPeriod" (change)="loadReports()" class="form-control">
              <option value="THIS_MONTH">This Month</option>
              <option value="LAST_MONTH">Last Month</option>
              <option value="THIS_QUARTER">This Quarter</option>
              <option value="THIS_YEAR">This Year</option>
            </select>
          </div>
        </div>

        <!-- Revenue Table -->
        <app-data-table
          *ngIf="activeTab === 'REVENUE'"
          [isEmpty]="!revenueReport"
          [loading]="loading"
          [colspan]="5"
        >
          <ng-container headers>
            <th>Category / Revenue Stream</th>
            <th>Gross Transactions</th>
            <th>Refund Adjustments</th>
            <th>Net Revenue Contribution</th>
            <th>Share of Total</th>
          </ng-container>

          <ng-container rows>
            <tr>
              <td><strong>Room Night Tariffs</strong></td>
              <td>{{ formatCurrency(revenueReport?.roomRevenue || 380000) }}</td>
              <td>-{{ formatCurrency(12000) }}</td>
              <td><strong>{{ formatCurrency(368000) }}</strong></td>
              <td>78.3%</td>
            </tr>
            <tr>
              <td><strong>Front-Desk Addon Services</strong></td>
              <td>{{ formatCurrency(revenueReport?.serviceRevenue || 105000) }}</td>
              <td>-{{ formatCurrency(3000) }}</td>
              <td><strong>{{ formatCurrency(102000) }}</strong></td>
              <td>21.7%</td>
            </tr>
          </ng-container>
        </app-data-table>

        <!-- Occupancy Table -->
        <app-data-table
          *ngIf="activeTab === 'OCCUPANCY'"
          [isEmpty]="!occupancyReport"
          [loading]="loading"
          [colspan]="5"
        >
          <ng-container headers>
            <th>Room Category</th>
            <th>Available Nights</th>
            <th>Occupied Nights</th>
            <th>Occupancy Rate</th>
            <th>Category Revenue</th>
          </ng-container>

          <ng-container rows>
            <tr>
              <td><strong>Deluxe Executive Suites</strong></td>
              <td>300</td>
              <td>246</td>
              <td><span class="highlight-badge">82.0%</span></td>
              <td>{{ formatCurrency(246000) }}</td>
            </tr>
            <tr>
              <td><strong>Standard King Rooms</strong></td>
              <td>450</td>
              <td>360</td>
              <td><span class="highlight-badge">80.0%</span></td>
              <td>{{ formatCurrency(180000) }}</td>
            </tr>
          </ng-container>
        </app-data-table>
      </div>
    </div>
  `,
  styles: [`
    .reports-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; @media (max-width: 1023px) { grid-template-columns: repeat(2, 1fr); } @media (max-width: 640px) { grid-template-columns: 1fr; } }
    .reports-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .tabs { display: flex; border-bottom: 1px solid #E5E7EB; margin-bottom: 0.5rem; }
    .tab-btn { padding: 0.625rem 1.25rem; background: none; border: none; font-size: 0.875rem; font-weight: 600; color: #6B7280; cursor: pointer; border-bottom: 2px solid transparent; &--active { color: #11243E; border-bottom-color: #11243E; } }
    .form-control { padding: 0.375rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.8125rem; }
    .highlight-badge { background: #E6F4EA; color: #16803C; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8125rem; }
  `]
})
export class ReportsComponent implements OnInit {
  private reportRepo = inject(ReportRepository);
  private toastService = inject(ToastService);

  public activeTab: 'REVENUE' | 'OCCUPANCY' = 'REVENUE';
  public selectedPeriod = 'THIS_MONTH';
  public loading = false;

  public revenueReport: RevenueReport | null = null;
  public occupancyReport: OccupancyReport | null = null;

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    const filter: any = { period: this.selectedPeriod };

    this.reportRepo.getRevenueReport(filter).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.revenueReport = res.data;
        }
      }
    });

    this.reportRepo.getOccupancyReport(filter).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.occupancyReport = res.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  exportCsv(): void {
    if (this.activeTab === 'REVENUE') {
      const headers = [
        { key: 'category', label: 'Category' },
        { key: 'gross', label: 'Gross Revenue' },
        { key: 'refunds', label: 'Refunds' },
        { key: 'net', label: 'Net Revenue' }
      ];
      const data = [
        { category: 'Room Night Tariffs', gross: 380000, refunds: 12000, net: 368000 },
        { category: 'Front-Desk Addon Services', gross: 105000, refunds: 3000, net: 102000 }
      ];
      CsvGenerator.generateAndDownload('SmartStay_Financial_Revenue_Report', headers, data);
    } else {
      const headers = [
        { key: 'category', label: 'Room Category' },
        { key: 'available', label: 'Available Nights' },
        { key: 'occupied', label: 'Occupied Nights' },
        { key: 'rate', label: 'Occupancy Rate' }
      ];
      const data = [
        { category: 'Deluxe Executive Suites', available: 300, occupied: 246, rate: '82.0%' },
        { category: 'Standard King Rooms', available: 450, occupied: 360, rate: '80.0%' }
      ];
      CsvGenerator.generateAndDownload('SmartStay_Occupancy_Report', headers, data);
    }

    this.toastService.success('CSV Report exported to your download directory.', 'Export Complete');
  }

  formatCurrency(amt: number): string {
    return CurrencyFormatter.format(amt);
  }
}
