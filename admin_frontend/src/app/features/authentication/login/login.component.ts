import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';
import { APP_ROUTES } from '../../../core/constants';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ErrorFormatter } from '../../../core/utilities/error-formatter.utility';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    ButtonComponent
  ],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-card__header">
          <div class="brand-crest">
            <span class="brand-crest__icon">🏨</span>
          </div>
          <h1 class="login-card__title">SmartStay Admin</h1>
          <p class="login-card__subtitle">Single-Hotel Operational Portal</p>
        </div>

        <div *ngIf="errorMessage" class="error-banner">
          <span class="error-banner__icon">⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <app-form-field
            label="Administrator Email"
            [required]="true"
            [errorMessage]="getFieldError('email')"
          >
            <input
              type="email"
              formControlName="email"
              placeholder="admin@example.com"
              class="form-control"
              [class.form-control--invalid]="isFieldInvalid('email')"
            />
          </app-form-field>

          <app-form-field
            label="Password"
            [required]="true"
            [errorMessage]="getFieldError('password')"
          >
            <div class="password-wrapper">
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••"
                class="form-control"
                [class.form-control--invalid]="isFieldInvalid('password')"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </app-form-field>

          <app-form-field
            label="Staff Authorization Code"
            [required]="true"
            [errorMessage]="getFieldError('staffCode')"
            hint="Format: STAFF2026 / STAFF2027 / STAFF2028"
          >
            <input
              type="text"
              formControlName="staffCode"
              placeholder="STAFF2026"
              class="form-control"
              [class.form-control--invalid]="isFieldInvalid('staffCode')"
            />
          </app-form-field>

          <div class="form-row flex-between">
            <label class="remember-me">
              <input type="checkbox" formControlName="rememberMe" />
              <span>Remember session</span>
            </label>
          </div>

          <div class="form-actions">
            <app-button
              type="submit"
              variant="accent"
              size="lg"
              [loading]="loading"
              [disabled]="loginForm.invalid"
            >
              Sign In to Admin Portal
            </app-button>
          </div>
        </form>

        <div *ngIf="enableMockControls" class="mock-credentials">
          <p class="mock-credentials__title">Quick Demo Login (Mock Mode):</p>
          <div class="mock-credentials__buttons">
            <button type="button" (click)="fillDemo('ADMIN')">Admin (Full)</button>
            <button type="button" (click)="fillDemo('MANAGER')">Manager</button>
            <button type="button" (click)="fillDemo('STAFF')">Staff</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0B1728 0%, #11243E 50%, #1B3A5D 100%);
      padding: 1.5rem;
    }

    .login-card {
      width: 100%;
      max-width: 440px;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      border-radius: 12px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);

      &__header {
        text-align: center;
        margin-bottom: 2rem;
      }

      &__title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #11243E;
        margin-top: 0.75rem;
      }

      &__subtitle {
        font-size: 0.875rem;
        color: #6B7280;
        margin-top: 0.25rem;
      }
    }

    .brand-crest {
      width: 60px;
      height: 60px;
      margin: 0 auto;
      background: linear-gradient(135deg, #11243E 0%, #C99B4A 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 16px rgba(201, 155, 74, 0.3);

      &__icon {
        font-size: 2rem;
      }
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background-color: #FCE8E6;
      border: 1px solid #F87171;
      border-radius: 6px;
      color: #C62828;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .form-control {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.15s ease;

      &:focus {
        border-color: #11243E;
        box-shadow: 0 0 0 3px rgba(17, 36, 62, 0.1);
      }

      &--invalid {
        border-color: #C62828;
      }
    }

    .password-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6B7280;
      cursor: pointer;
      &:hover { color: #11243E; }
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: #4B5563;
      cursor: pointer;
    }

    .form-actions {
      margin-top: 1.5rem;

      ::ng-deep button {
        width: 100%;
      }
    }

    .mock-credentials {
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px dashed #E5E7EB;
      text-align: center;

      &__title {
        font-size: 0.75rem;
        font-weight: 600;
        color: #6B7280;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      &__buttons {
        display: flex;
        gap: 0.5rem;
        justify-content: center;

        button {
          padding: 0.375rem 0.75rem;
          background-color: #F3F4F6;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;

          &:hover {
            background-color: #E5E7EB;
            color: #11243E;
          }
        }
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  public enableMockControls = environment.enableMockControls;
  public showPassword = false;
  public loading = false;
  public errorMessage: string | null = null;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    staffCode: ['', [Validators.required]],
    rememberMe: [true]
  });

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: string): string | undefined {
    const control = this.loginForm.get(fieldName);
    if (!control || !control.errors || !(control.dirty || control.touched)) {
      return undefined;
    }
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Please enter a valid email address.';
    return undefined;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const val = this.loginForm.value;
    const normalizedEmail = (val.email || '').trim().toLowerCase();

    this.authService.login({
      email: normalizedEmail,
      password: val.password || '',
      staffCode: (val.staffCode || '').trim()
    }).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success('Welcome back to SmartStay Admin Panel.', 'Authentication Successful');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || APP_ROUTES.DASHBOARD;
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: Error) => {
        this.loading = false;
        this.errorMessage = ErrorFormatter.format(err, 'Invalid email, password, or staff authorization code.');
      }
    });
  }

  fillDemo(role: 'ADMIN' | 'MANAGER' | 'STAFF'): void {
    if (role === 'ADMIN') {
      this.loginForm.patchValue({ email: 'admin@example.com', password: 'Admin@123', staffCode: 'STAFF2026' });
    } else if (role === 'MANAGER') {
      this.loginForm.patchValue({ email: 'manager@example.com', password: 'Manager@123', staffCode: 'STAFF2027' });
    } else if (role === 'STAFF') {
      this.loginForm.patchValue({ email: 'staff@example.com', password: 'Staff@123', staffCode: 'STAFF2028' });
    }
  }
}
