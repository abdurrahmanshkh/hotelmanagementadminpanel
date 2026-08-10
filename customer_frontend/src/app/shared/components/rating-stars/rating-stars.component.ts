import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="rating-stars flex-gap">
      <div class="stars">
        <app-icon
          *ngFor="let star of [1, 2, 3, 4, 5]"
          name="star"
          [size]="size"
          [color]="star <= rating ? '#D97706' : '#CBD5E1'"
        ></app-icon>
      </div>
      <span *ngIf="showScore" class="score-text font-mono font-semibold">
        {{ rating.toFixed(1) }}
      </span>
    </div>
  `,
  styles: [`
    .rating-stars {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;

      .stars {
        display: flex;
        align-items: center;
        gap: 0.125rem;
      }

      .score-text {
        font-size: 0.8125rem;
        color: #0F172A;
      }
    }
  `]
})
export class RatingStarsComponent {
  @Input() rating = 5;
  @Input() size = 16;
  @Input() showScore = true;
}
