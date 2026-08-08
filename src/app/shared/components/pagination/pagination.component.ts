import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination" *ngIf="totalPages > 0">
      <div class="pagination__info">
        Showing <span>{{ startItem }}</span> to <span>{{ endItem }}</span> of <span>{{ totalItems }}</span> entries
      </div>
      <div class="pagination__controls">
        <button
          class="pagination__btn"
          [disabled]="currentPage === 1"
          (click)="onPageChange(currentPage - 1)"
        >
          Previous
        </button>
        <span class="pagination__page-indicator">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          class="pagination__btn"
          [disabled]="currentPage === totalPages"
          (click)="onPageChange(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background-color: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-top: none;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      font-size: 0.8125rem;
      color: #6B7280;

      &__info span {
        font-weight: 600;
        color: #1F2937;
      }

      &__controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      &__page-indicator {
        font-weight: 500;
        color: #374151;
        padding: 0 0.5rem;
      }

      &__btn {
        padding: 0.375rem 0.75rem;
        background-color: #FFFFFF;
        border: 1px solid #D1D5DB;
        border-radius: 4px;
        font-size: 0.8125rem;
        font-weight: 500;
        color: #374151;
        cursor: pointer;
        transition: background-color 0.15s ease;

        &:hover:not(:disabled) {
          background-color: #F3F4F6;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  `]
})
export class PaginationComponent {
  @Input({ required: true }) currentPage!: number;
  @Input({ required: true }) totalPages!: number;
  @Input({ required: true }) totalItems!: number;
  @Input() pageSize = 10;

  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
