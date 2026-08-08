import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-input">
      <span class="search-input__icon">🔍</span>
      <input
        type="text"
        [placeholder]="placeholder"
        [ngModel]="value"
        (ngModelChange)="onModelChange($event)"
        class="search-input__field"
      />
      <button
        *ngIf="value"
        type="button"
        class="search-input__clear"
        (click)="clearSearch()"
      >
        ✕
      </button>
    </div>
  `,
  styles: [`
    .search-input {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: 100%;
      max-width: 320px;

      &__icon {
        position: absolute;
        left: 0.75rem;
        font-size: 0.875rem;
        color: #9CA3AF;
        pointer-events: none;
      }

      &__field {
        width: 100%;
        padding: 0.5rem 2rem 0.5rem 2.25rem;
        background-color: #FFFFFF;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        font-size: 0.875rem;
        color: #1F2937;
        outline: none;
        transition: border-color 0.15s ease;

        &:focus {
          border-color: #11243E;
          box-shadow: 0 0 0 3px rgba(17, 36, 62, 0.1);
        }
      }

      &__clear {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        color: #9CA3AF;
        font-size: 0.75rem;
        padding: 0.25rem;
        cursor: pointer;
        &:hover { color: #4B5563; }
      }
    }
  `]
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input() value = '';
  @Input() placeholder = 'Search...';
  @Input() debounceMs = 300;

  @Output() search = new EventEmitter<string>();

  private searchSubject = new Subject<string>();
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.searchSubject.pipe(
      debounceTime(this.debounceMs),
      distinctUntilChanged()
    ).subscribe(val => this.search.emit(val));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onModelChange(val: string): void {
    this.value = val;
    this.searchSubject.next(val);
  }

  clearSearch(): void {
    this.value = '';
    this.searchSubject.next('');
  }
}
