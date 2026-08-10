import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthRepository } from '../../../core/repositories/contracts/auth.repository';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, IconComponent],
  template: `
    <div class="profile-page" *ngIf="authState.currentUser() as user">
      <div class="header-box">
        <h2 class="title font-serif">Guest Profile Settings</h2>
        <p class="sub">Manage your contact information, phone, and government identification records.</p>
      </div>

      <div class="card-box">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="form-content">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" formControlName="firstName" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" formControlName="lastName" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address (Read Only)</label>
            <input type="email" [value]="user.email" disabled class="form-control disabled" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" formControlName="phone" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Government ID Masked</label>
              <input type="text" [value]="user.governmentIdMasked" disabled class="form-control disabled font-mono" />
            </div>
          </div>

          <div class="actions-row">
            <app-button type="submit" variant="primary" [loading]="isSaving" [disabled]="profileForm.invalid">
              Save Profile Changes
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-box { .title { font-size: 1.5rem; font-weight: 800; color: #0F172A; } .sub { font-size: 0.875rem; color: #64748B; } }

    .card-box { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 2rem; }
    .form-content { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; @media (max-width: 540px) { grid-template-columns: 1fr; } }
    .form-group {
      display: flex; flex-direction: column; gap: 0.375rem;
      .form-label { font-size: 0.8125rem; font-weight: 700; color: #0F172A; }
      .form-control { padding: 0.625rem 0.875rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.875rem; outline: none; &:focus { border-color: #D97706; } &.disabled { background: #F8FAFC; color: #64748B; } }
    }
    .actions-row { display: flex; justify-content: flex-end; margin-top: 1rem; }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authRepo = inject(AuthRepository);
  public authState = inject(AuthStateService);
  private toast = inject(ToastService);

  public isSaving = false;

  public profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
  });

  ngOnInit(): void {
    const user = this.authState.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    const val = this.profileForm.value;

    this.authRepo.updateProfile({
      firstName: val.firstName!,
      lastName: val.lastName!,
      phone: val.phone!
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.toast.success('Profile details updated successfully!');
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }
}
