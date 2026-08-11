import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoomRepository } from '../../../core/repositories/contracts/room.repository';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Room } from '../../../core/models';
import { formatDateISO } from '../../../core/utilities/date.utils';
import { formatCurrency } from '../../../core/utilities/money.utils';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ButtonComponent],
  template: `
    <div class="booking-page container" *ngIf="room">
      <!-- Step Indicator Header -->
      <div class="step-indicator flex-gap">
        <div class="step-item step--active"><span class="step-num font-mono">1</span> Stay & Guest Details</div>
        <span class="step-arrow">&rarr;</span>
        <div class="step-item"><span class="step-num font-mono">2</span> Review Quote</div>
        <span class="step-arrow">&rarr;</span>
        <div class="step-item"><span class="step-num font-mono">3</span> Payment</div>
      </div>

      <div class="booking-grid">
        <!-- Main Form Column -->
        <div class="form-col">
          <div class="card-box">
            <h2 class="box-title">Step 1: Guest & Stay Details</h2>

            <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="form-content">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Check-In Date</label>
                  <input type="date" formControlName="checkInDate" [min]="todayStr" class="form-control" />
                  <span *ngIf="bookingForm.get('checkInDate')?.touched && bookingForm.get('checkInDate')?.invalid" class="field-error">
                    Check-in date is required.
                  </span>
                </div>
                <div class="form-group">
                  <label class="form-label">Check-Out Date</label>
                  <input type="date" formControlName="checkOutDate" [min]="bookingForm.get('checkInDate')?.value || todayStr" class="form-control" />
                  <span *ngIf="isInvalidDateRange()" class="field-error">
                    Check-out date must be after check-in date.
                  </span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Adults (Age 12+)</label>
                  <select formControlName="adults" class="form-control">
                    <option [ngValue]="1">1 Adult</option>
                    <option [ngValue]="2">2 Adults</option>
                    <option [ngValue]="3" *ngIf="room.maximumAdults >= 3">3 Adults</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Children (Age 0-11)</label>
                  <select formControlName="children" class="form-control">
                    <option [ngValue]="0">0 Children</option>
                    <option [ngValue]="1">1 Child</option>
                    <option [ngValue]="2" *ngIf="room.maximumChildren >= 2">2 Children</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Special Requests (Optional)</label>
                <textarea
                  formControlName="specialRequests"
                  rows="3"
                  class="form-control"
                  placeholder="Quiet room, high floor, early arrival, or dietary notes..."
                ></textarea>
              </div>

              <div class="actions-row">
                <app-button type="submit" variant="primary" size="lg" [disabled]="bookingForm.invalid">
                  Continue to Review & Quote &rarr;
                </app-button>
              </div>
            </form>
          </div>
        </div>

        <!-- Room Summary Column -->
        <div class="summary-col">
          <div class="card-box room-summary-card">
            <img [src]="room.images[0]?.url" [alt]="room.description" class="summary-img" />
            <div class="summary-content">
              <span class="badge badge--info font-mono">Room {{ room.roomNumber }}</span>
              <h3 class="room-name">{{ room.roomType.name }}</h3>
              <p class="room-desc">{{ room.description }}</p>

              <div class="price-row">
                <span class="price-val font-mono">{{ formatMoney(room.currentPrice) }}</span>
                <span class="price-period">/ night</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-page { padding-top: 3rem; padding-bottom: 5rem; }
    .container { max-width: 1140px; margin: 0 auto; padding-left: 1.5rem; padding-right: 1.5rem; }

    .step-indicator {
      display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 2.5rem;
      .step-item {
        display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 700; color: #94A3B8;
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: #E2E8F0; color: #64748B; display: flex; align-items: center; justify-content: center; font-size: 0.8125rem; }
        &.step--active { color: #0F172A; .step-num { background: #D97706; color: #FFFFFF; } }
      }
      .step-arrow { color: #CBD5E1; font-weight: 700; }
    }

    .booking-grid {
      display: grid; grid-template-columns: 1fr 340px; gap: 2rem;
      @media (max-width: 868px) { grid-template-columns: 1fr; }
    }

    .card-box {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
    }

    .box-title { font-size: 1.25rem; font-weight: 800; color: #0F172A; margin-bottom: 1.5rem; }
    .form-content { display: flex; flex-direction: column; gap: 1.25rem; }

    .form-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
      @media (max-width: 540px) { grid-template-columns: 1fr; }
    }

    .form-group {
      display: flex; flex-direction: column; gap: 0.375rem;
      .form-label { font-size: 0.8125rem; font-weight: 700; color: #0F172A; }
      .form-control {
        padding: 0.625rem 0.875rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.875rem; outline: none;
        &:focus { border-color: #D97706; }
      }
      .field-error {
        font-size: 0.75rem;
        color: #BE123C;
        font-weight: 600;
      }
    }

    .actions-row { display: flex; justify-content: flex-end; margin-top: 1rem; }

    .room-summary-card {
      padding: 0; overflow: hidden;
      .summary-img { width: 100%; height: 180px; object-fit: cover; }
      .summary-content { padding: 1.25rem; }
      .room-name { font-size: 1.125rem; font-weight: 700; color: #0F172A; margin: 0.5rem 0 0.25rem; }
      .room-desc { font-size: 0.8125rem; color: #64748B; margin-bottom: 1rem; }
      .price-row { .price-val { font-size: 1.25rem; font-weight: 800; color: #0F172A; } .price-period { font-size: 0.75rem; color: #64748B; } }
    }
  `]
})
export class BookingFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private roomRepo = inject(RoomRepository);
  private authState = inject(AuthStateService);
  private toast = inject(ToastService);

  public room?: Room;
  public todayStr = formatDateISO(new Date());

  public bookingForm = this.fb.group({
    checkInDate: [this.todayStr, [Validators.required]],
    checkOutDate: [formatDateISO(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), [Validators.required]],
    adults: [2, [Validators.required, Validators.min(1)]],
    children: [0, [Validators.min(0)]],
    specialRequests: ['']
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const roomId = Number(params['roomId']);
      this.loadRoom(roomId);
    });

    this.route.queryParams.subscribe(params => {
      if (params['checkInDate']) this.bookingForm.patchValue({ checkInDate: params['checkInDate'] });
      if (params['checkOutDate']) this.bookingForm.patchValue({ checkOutDate: params['checkOutDate'] });
      if (params['adults']) this.bookingForm.patchValue({ adults: Number(params['adults']) });
    });
  }

  loadRoom(roomId: number): void {
    this.roomRepo.getRoomById(roomId).subscribe(res => {
      this.room = res.data;
    });
  }

  formatMoney(amount: number): string {
    return formatCurrency(amount, this.room?.currency || 'INR');
  }

  isInvalidDateRange(): boolean {
    const inDate = this.bookingForm.get('checkInDate')?.value;
    const outDate = this.bookingForm.get('checkOutDate')?.value;
    if (!inDate || !outDate) return false;
    return outDate <= inDate;
  }

  onSubmit(): void {
    const val = this.bookingForm.value;
    const inDate = val.checkInDate;
    const outDate = val.checkOutDate;

    if (inDate && inDate < this.todayStr) {
      this.toast.error('Check-in date cannot be in the past.');
      return;
    }

    if (inDate && outDate && outDate <= inDate) {
      this.toast.error('Check-out date must be after check-in date.');
      return;
    }

    if (this.bookingForm.invalid || !this.room) {
      this.bookingForm.markAllAsTouched();
      this.toast.error('Please select valid stay dates and guest details.');
      return;
    }

    this.router.navigate(['/booking', this.room.id, 'review'], {
      queryParams: {
        checkInDate: val.checkInDate,
        checkOutDate: val.checkOutDate,
        adults: val.adults,
        children: val.children,
        specialRequests: val.specialRequests
      }
    });
  }
}
