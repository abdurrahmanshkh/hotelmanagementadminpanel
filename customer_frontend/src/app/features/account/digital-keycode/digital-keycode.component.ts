import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PasscodeRepository } from '../../../core/repositories/contracts/passcode.repository';
import { BookingRepository } from '../../../core/repositories/contracts/booking.repository';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RoomPasscode, Booking } from '../../../core/models';

@Component({
  selector: 'app-digital-keycode',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, ButtonComponent, IconComponent],
  template: `
    <div class="key-page" *ngIf="passcode">
      <div class="header-box">
        <span class="badge badge--info font-mono">DIGITAL DOOR KEY</span>
        <h2 class="title font-serif">Room {{ passcode.roomNumber }} Keycode</h2>
        <p class="sub">Valid for your stay duration. Touch your door panel or enter the digits below.</p>
      </div>

      <div class="key-card">
        <div class="status-row">
          <app-status-badge [status]="passcode.status"></app-status-badge>
          <span class="expires-text">Valid Until: {{ passcode.validUntil }}</span>
        </div>

        <!-- Large Monospaced Passcode Display -->
        <div class="passcode-box">
          <span class="pin-code font-mono">{{ displayCode }}</span>
          <button type="button" class="btn-copy" (click)="copyPasscode()" title="Copy Keycode">
            <app-icon name="key" [size]="18" color="#D97706"></app-icon>
          </button>
        </div>

        <!-- Interactive Door Unlock Simulator -->
        <div class="unlock-simulator font-mono" [class.unlocked]="isDoorUnlocked">
          <div class="lock-icon">
            <app-icon [name]="isDoorUnlocked ? 'check' : 'lock'" [size]="28" [color]="isDoorUnlocked ? '#047857' : '#D97706'"></app-icon>
          </div>
          <span class="sim-text">{{ isDoorUnlocked ? 'DOOR UNLOCKED &bull; PLEASE ENTER' : 'BLUETOOTH / KEYPAD READY' }}</span>

          <app-button
            variant="primary"
            size="lg"
            [fullWidth]="true"
            [loading]="isSimulating"
            (btnClick)="onSimulateUnlock()"
          >
            {{ isDoorUnlocked ? 'Lock Door' : 'Tap to Unlock Room Door' }}
          </app-button>
        </div>

        <div class="actions-box flex-gap">
          <app-button variant="outline" icon="refresh" (btnClick)="onRegeneratePin()">
            Regenerate Passcode PIN
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .key-page { display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px; margin: 0 auto; }

    .header-box {
      text-align: center;
      .title { font-size: 1.75rem; font-weight: 800; color: #0F172A; margin: 0.5rem 0 0.25rem; }
      .sub { font-size: 0.875rem; color: #64748B; }
    }

    .key-card {
      background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08); display: flex; flex-direction: column; gap: 1.5rem;
    }

    .status-row {
      display: flex; align-items: center; justify-content: space-between;
      .expires-text { font-size: 0.75rem; font-weight: 600; color: #64748B; }
    }

    .passcode-box {
      background: #0F172A; color: #D97706; border-radius: 16px; padding: 1.75rem; text-align: center;
      position: relative; display: flex; align-items: center; justify-content: center;
      .pin-code { font-size: 2.75rem; font-weight: 800; letter-spacing: 0.25em; }
      .btn-copy { position: absolute; right: 1.25rem; background: #1E293B; border: 1px solid #334155; border-radius: 8px; padding: 0.5rem; cursor: pointer; }
    }

    .unlock-simulator {
      background: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 16px; padding: 1.5rem;
      display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center;
      transition: all 0.3s ease;

      &.unlocked {
        background: #ECFDF5; border-color: #A7F3D0; border-style: solid;
        .sim-text { color: #047857; }
      }

      .sim-text { font-size: 0.75rem; font-weight: 700; color: #64748B; letter-spacing: 0.05em; }
    }

    .actions-box { display: flex; justify-content: center; }
  `]
})
export class DigitalKeycodeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private passcodeRepo = inject(PasscodeRepository);
  private bookingRepo = inject(BookingRepository);
  private toast = inject(ToastService);
  private confirmService = inject(ConfirmationService);

  public passcode?: RoomPasscode;
  public booking?: Booking;
  public isDoorUnlocked = false;
  public isSimulating = false;

  get displayCode(): string {
    return this.passcode?.passcode || '123456';
  }

  ngOnInit(): void {
    const bookingId = Number(this.route.snapshot.params['bookingId']);
    this.bookingRepo.getBookingById(bookingId).subscribe(bRes => {
      this.booking = bRes.data;
      this.passcodeRepo.getPasscodeByBookingId(bookingId).subscribe(pRes => {
        this.passcode = pRes.data;
      });
    });
  }

  copyPasscode(): void {
    if (this.passcode) {
      navigator.clipboard.writeText(this.passcode.passcode);
      this.toast.success('Passcode copied to clipboard!');
    }
  }

  onSimulateUnlock(): void {
    if (this.isDoorUnlocked) {
      this.isDoorUnlocked = false;
      this.toast.info('Door locked.');
      return;
    }

    this.isSimulating = true;
    setTimeout(() => {
      this.isSimulating = false;
      this.isDoorUnlocked = true;
      this.toast.success(`Door Unlocked! Room ${this.passcode?.roomNumber} access granted.`);
    }, 1000);
  }

  onRegeneratePin(): void {
    if (!this.passcode || !this.booking) return;

    this.confirmService.confirm({
      title: 'Regenerate Door Keycode PIN?',
      message: 'Your current 6-digit passcode will be revoked and replaced with a new secure PIN.',
      confirmText: 'Generate New PIN',
      type: 'warning',
      onConfirm: () => {
        this.passcodeRepo.generatePasscode(this.booking!.id).subscribe(res => {
          this.passcode = res.data;
          this.toast.success('New door keycode PIN generated successfully!');
        });
      }
    });
  }
}
