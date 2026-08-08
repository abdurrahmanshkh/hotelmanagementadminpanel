import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <ng-content select="[headers]"></ng-content>
          </tr>
        </thead>
        <tbody>
          <ng-content select="[rows]"></ng-content>
          <tr *ngIf="isEmpty && !loading" class="data-table__empty-row">
            <td [attr.colspan]="colspan || 10">
              <div class="data-table__empty-content">
                <p>{{ emptyMessage }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .data-table-container {
      width: 100%;
      overflow-x: auto;
      background-color: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;

      ::ng-deep th {
        background-color: #F9FAFB;
        color: #374151;
        font-weight: 600;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #E5E7EB;
        white-space: nowrap;
      }

      ::ng-deep td {
        padding: 0.875rem 1rem;
        border-bottom: 1px solid #F3F4F6;
        color: #1F2937;
      }

      ::ng-deep tr:last-child td {
        border-bottom: none;
      }

      ::ng-deep tr:hover td {
        background-color: #F9FAFB;
      }

      &__empty-content {
        padding: 2.5rem 1rem;
        text-align: center;
        color: #6B7280;
      }
    }
  `]
})
export class DataTableComponent {
  @Input() isEmpty = false;
  @Input() loading = false;
  @Input() colspan = 10;
  @Input() emptyMessage = 'No records found matching your query.';
}
