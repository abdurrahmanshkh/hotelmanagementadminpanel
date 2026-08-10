import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="pagination flex-gap" *ngIf="totalPages > 1">
      <button
        type="button"
        class="page-btn nav-btn"
        [disabled]="page === 1"
        (click)="changePage(page - 1)"
      >
        <app-icon name="chevron-left" [size]="16"></app-icon>
      </button>

      <button
        *ngFor="let p of pages"
        type="button"
        [class]="'page-btn font-mono ' + (p === page ? 'page-btn--active' : '')"
        (click)="changePage(p)"
      >
        {{ p }}
      </button>

      <button
        type="button"
        class="page-btn nav-btn"
        [disabled]="page === totalPages"
        (click)="changePage(page + 1)"
      >
        <app-icon name="chevron-right" [size]="16"></app-icon>
      </button>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;

      .page-btn {
        min-width: 36px;
        height: 36px;
        padding: 0 0.5rem;
        border-radius: 8px;
        background-color: #FFFFFF;
        border: 1px solid #CBD5E1;
        color: #334155;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;

        &:hover:not(:disabled) {
          background-color: #F8FAFC;
          border-color: #94A3B8;
        }

        &--active {
          background-color: #0F172A !important;
          color: #FFFFFF !important;
          border-color: #0F172A !important;
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
    }
  `]
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      arr.push(i);
    }
    return arr;
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.page) {
      this.pageChange.emit(newPage);
    }
  }
}
