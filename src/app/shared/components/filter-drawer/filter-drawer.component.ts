import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-drawer" [class.filter-drawer--open]="isOpen">
      <div class="filter-drawer__backdrop" (click)="close()"></div>
      <div class="filter-drawer__content">
        <div class="filter-drawer__header">
          <h3 class="filter-drawer__title">{{ title }}</h3>
          <button class="filter-drawer__close-btn" (click)="close()">✕</button>
        </div>
        <div class="filter-drawer__body">
          <ng-content></ng-content>
        </div>
        <div class="filter-drawer__footer">
          <button class="btn btn--outline" (click)="onReset()">Reset</button>
          <button class="btn btn--primary" (click)="onApply()">Apply Filters</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-drawer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1000;
      display: none;

      &--open {
        display: block;
      }

      &__backdrop {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.4);
      }

      &__content {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        max-width: 360px;
        height: 100%;
        background-color: #FFFFFF;
        box-shadow: -4px 0 15px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
      }

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #E5E7EB;
      }

      &__title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #11243E;
      }

      &__close-btn {
        background: none;
        border: none;
        font-size: 1.125rem;
        color: #6B7280;
        cursor: pointer;
      }

      &__body {
        flex: 1;
        padding: 1.25rem;
        overflow-y: auto;
      }

      &__footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        border-top: 1px solid #E5E7EB;
        background-color: #F9FAFB;
      }

      .btn {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        border: 1px solid transparent;

        &--outline { background: #FFF; border-color: #D1D5DB; color: #374151; }
        &--primary { background: #11243E; color: #FFF; }
      }
    }
  `]
})
export class FilterDrawerComponent {
  @Input() isOpen = false;
  @Input() title = 'Filter Records';

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() apply = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  onApply(): void {
    this.apply.emit();
    this.close();
  }

  onReset(): void {
    this.reset.emit();
  }
}
