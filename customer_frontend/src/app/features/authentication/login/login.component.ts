import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthRepository } from '../../../core/repositories/contracts/auth.repository';
import { ToastService } from '../../../core/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
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
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-sub">Sign in to manage your resort bookings and room passcode access.</p>
        </div>

        <!-- Quick Demo Quickfill Button -->
        <div class="demo-box" (click)="quickFillDemo()">
          <app-icon name="sparkles" [size]="16" color="#D97706"></app-icon>
          <span>Demo Customer: <strong>guest&#64;example.com</strong> (Tap to Quickfill)</span>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-wrapper">
              <app-icon name="mail" [size]="18" color="#94A3B8" className="input-icon"></app-icon>
              <input
                type="email"
                formControlName="email"
                class="form-control"
                placeholder="guest@example.com"
              />
            </div>
            <span *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="field-error">
              Please enter a valid email address.
            </span>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label class="form-label">Password</label>
              <a routerLink="/forgot-password" class="forgot-link">Forgot Password?</a>
            </div>
            <div class="input-wrapper">
              <app-icon name="lock" [size]="18" color="#94A3B8" className="input-icon"></app-icon>
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                class="form-control"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              />
              <button type="button" class="btn-toggle-eye" (click)="showPassword = !showPassword">
                <app-icon [name]="showPassword ? 'x' : 'eye'" [size]="16" color="#94A3B8"></app-icon>
              </button>
            </div>
            <span *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="field-error">
              Password is required.
            </span>
          </div>

          <app-button
            type="submit"
            variant="primary"
            size="lg"
            [fullWidth]="true"
            [loading]="isLoading"
            [disabled]="loginForm.invalid"
          >
            Sign In to SmartStay
          </app-button>
        </form>

        <div class="auth-footer">
          <span>Don't have a SmartStay account?</span>
          <a routerLink="/register" class="register-link">Create Account</a>
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

      .brand-logo {
        justify-content: center;
        margin-bottom: 0.75rem;
        .title { font-size: 1.25rem; font-weight: 800; color: #0F172A; }
      }

      .auth-title { font-size: 1.5rem; font-weight: 800; color: #0F172A; margin-bottom: 0.375rem; }
      .auth-sub { font-size: 0.875rem; color: #64748B; line-height: 1.4; }
    }

    .demo-box {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 8px;
      padding: 0.625rem 0.875rem;
      font-size: 0.78125rem;
      color: #B45309;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      margin-bottom: 1.5rem;

      &:hover { background: #FEF3C7; }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      .label-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .form-label {
        font-size: 0.8125rem;
        font-weight: 700;
        color: #0F172A;
      }

      .forgot-link {
        font-size: 0.75rem;
        font-weight: 600;
        color: #D97706;
        &:hover { text-decoration: underline; }
      }

      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .input-icon {
          position: absolute;
          left: 0.875rem;
          pointer-events: none;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 2.5rem;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;

          &:focus { border-color: #D97706; }
        }

        .btn-toggle-eye {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
        }
      }

      .field-error {
        font-size: 0.75rem;
        color: #BE123C;
        font-weight: 600;
      }
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.75rem;
      font-size: 0.875rem;
      color: #64748B;

      .register-link {
        color: #D97706;
        font-weight: 700;
        margin-left: 0.375rem;
        &:hover { text-decoration: underline; }
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authRepo = inject(AuthRepository);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public showPassword = false;
  public isLoading = false;

  public loginForm = this.fb.group({
    email: ['guest@example.com', [Validators.required, Validators.email]],
    password: ['Guest@123', [Validators.required]]
  });

  quickFillDemo(): void {
    this.loginForm.patchValue({
      email: 'guest@example.com',
      password: 'Guest@123'
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authRepo.login({ email: email!, password: password! }).subscribe({
      next: res => {
        this.isLoading = false;
        this.toast.success(`Welcome back, ${res.data.user.firstName}!`);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
        this.router.navigateByUrl(returnUrl);
      },
      error: err => {
        this.isLoading = false;
        // Interceptor toasts error
      }
    });
  }
}
