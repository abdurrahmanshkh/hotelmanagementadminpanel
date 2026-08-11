import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRepository } from '../../../core/repositories/contracts/auth.repository';
import { ToastService } from '../../../core/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ButtonComponent, IconComponent],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="brand-logo flex-gap">
            <app-icon name="building" [size]="28" color="#D97706"></app-icon>
            <span class="title">SmartStay</span>
          </div>
          <h2 class="auth-title">Reset Password</h2>
          <p class="auth-sub">Enter your email address and we will send you instructions to reset your password.</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="auth-form" *ngIf="!submitted">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-wrapper">
              <app-icon name="mail" [size]="18" color="#94A3B8" className="input-icon"></app-icon>
              <input type="email" formControlName="email" class="form-control" placeholder="guest@example.com" />
            </div>
            <span *ngIf="resetForm.get('email')?.touched && resetForm.get('email')?.invalid" class="field-error">
              Please enter a valid email address.
            </span>
          </div>

          <app-button type="submit" variant="primary" size="lg" [fullWidth]="true" [loading]="isLoading" [disabled]="resetForm.invalid">
            Send Reset Link
          </app-button>
        </form>

        <div *ngIf="submitted" class="success-box">
          <app-icon name="check" [size]="32" color="#047857"></app-icon>
          <h3>Check Your Email</h3>
          <p>We've sent password reset instructions to <strong>{{ resetForm.value.email }}</strong>.</p>
          <a routerLink="/login" class="back-link">&larr; Back to Login</a>
        </div>

        <div class="auth-footer" *ngIf="!submitted">
          <a routerLink="/login" class="back-link">&larr; Back to Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 72px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.5rem;
      background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    }

    .auth-card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 1.5rem;
      .brand-logo { justify-content: center; margin-bottom: 0.75rem; .title { font-size: 1.25rem; font-weight: 800; color: #0F172A; } }
      .auth-title { font-size: 1.5rem; font-weight: 800; color: #0F172A; margin-bottom: 0.375rem; }
      .auth-sub { font-size: 0.875rem; color: #64748B; line-height: 1.4; }
    }

    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

    .form-group {
      display: flex; flex-direction: column; gap: 0.375rem;
      .form-label { font-size: 0.8125rem; font-weight: 700; color: #0F172A; }
      .input-wrapper {
        position: relative; display: flex; align-items: center;
        .input-icon { position: absolute; left: 0.875rem; pointer-events: none; }
        .form-control {
          width: 100%; padding: 0.75rem 2.5rem; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 0.875rem; outline: none;
          &:focus { border-color: #D97706; }
        }
      }
      .field-error {
        font-size: 0.75rem;
        color: #BE123C;
        font-weight: 600;
      }
    }

    .success-box {
      text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
      h3 { font-size: 1.125rem; font-weight: 700; color: #0F172A; }
      p { font-size: 0.875rem; color: #475569; }
    }

    .back-link { font-size: 0.875rem; font-weight: 600; color: #D97706; }
    .auth-footer { text-align: center; margin-top: 1.5rem; }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authRepo = inject(AuthRepository);
  private toast = inject(ToastService);

  public isLoading = false;
  public submitted = false;

  public resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      this.toast.error('Please enter a valid email address.');
      return;
    }

    this.isLoading = true;
    this.authRepo.forgotPassword({ email: this.resetForm.value.email! }).subscribe({
      next: () => {
        this.isLoading = false;
        this.submitted = true;
        this.toast.success('Reset link sent to your email.');
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
