import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthRepository } from '../../../core/repositories/contracts/auth.repository';
import { ToastService } from '../../../core/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PasswordStrengthComponent } from '../../../shared/components/password-strength/password-strength.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent,
    PasswordStrengthComponent,
    IconComponent
  ],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="brand-logo flex-gap">
            <app-icon name="building" [size]="28" color="#D97706"></app-icon>
            <span class="title">SmartStay</span>
          </div>
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-sub">Register to unlock instant room reservations and digital key access.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" formControlName="firstName" class="form-control" placeholder="John" />
              <span *ngIf="registerForm.get('firstName')?.touched && registerForm.get('firstName')?.invalid" class="field-error">
                First name is required.
              </span>
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" formControlName="lastName" class="form-control" placeholder="Doe" />
              <span *ngIf="registerForm.get('lastName')?.touched && registerForm.get('lastName')?.invalid" class="field-error">
                Last name is required.
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" formControlName="email" class="form-control" placeholder="john.doe@example.com" />
            <span *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="field-error">
              Please enter a valid email address.
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" formControlName="phone" class="form-control" placeholder="9876543210" />
              <span *ngIf="registerForm.get('phone')?.touched && registerForm.get('phone')?.invalid" class="field-error">
                Please enter a valid 10-digit mobile number.
              </span>
            </div>
            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="date" formControlName="dateOfBirth" class="form-control" />
              <span *ngIf="registerForm.get('dateOfBirth')?.touched && registerForm.get('dateOfBirth')?.invalid" class="field-error">
                Please enter a valid date of birth.
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Government ID Type</label>
              <select formControlName="governmentIdType" class="form-control">
                <option value="AADHAAR">Aadhaar Card</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVING_LICENSE">Driving License</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">ID Number</label>
              <input type="text" formControlName="governmentIdNumber" class="form-control" placeholder="12-digit / Passport #" />
              <span *ngIf="registerForm.get('governmentIdNumber')?.touched && registerForm.get('governmentIdNumber')?.invalid" class="field-error">
                Government ID number is required.
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" formControlName="password" class="form-control" placeholder="At least 8 characters" />
            <app-password-strength [password]="registerForm.get('password')?.value || ''"></app-password-strength>
            <span *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid" class="field-error">
              Password must be at least 8 characters.
            </span>
          </div>

          <div class="terms-row">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="terms" />
              <span>I agree to SmartStay <a routerLink="/about" class="link">Terms of Service</a> & Privacy Policy</span>
            </label>
            <span *ngIf="registerForm.get('terms')?.touched && registerForm.get('terms')?.invalid" class="field-error">
              You must accept terms to create an account.
            </span>
          </div>

          <app-button
            type="submit"
            variant="primary"
            size="lg"
            [fullWidth]="true"
            [loading]="isLoading"
            [disabled]="registerForm.invalid"
          >
            Create My Account
          </app-button>
        </form>

        <div class="auth-footer">
          <span>Already have a SmartStay account?</span>
          <a routerLink="/login" class="login-link">Sign In</a>
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
      max-width: 540px;
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

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;

      @media (max-width: 540px) { grid-template-columns: 1fr; }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      .form-label { font-size: 0.8125rem; font-weight: 700; color: #0F172A; }

      .form-control {
        width: 100%;
        padding: 0.625rem 0.875rem;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        font-size: 0.875rem;
        outline: none;
        &:focus { border-color: #D97706; }
      }

      .field-error {
        font-size: 0.75rem;
        color: #BE123C;
        font-weight: 600;
      }
    }

    .terms-row {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8125rem;
      color: #475569;
      .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
      .link { color: #D97706; font-weight: 600; }
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.75rem;
      font-size: 0.875rem;
      color: #64748B;
      .login-link { color: #D97706; font-weight: 700; margin-left: 0.375rem; }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authRepo = inject(AuthRepository);
  private toast = inject(ToastService);
  private router = inject(Router);

  public isLoading = false;

  public registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    dateOfBirth: ['1998-05-12', [Validators.required]],
    governmentIdType: ['AADHAAR'],
    governmentIdNumber: ['987654321012', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [true, [Validators.requiredTrue]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.error('Please complete all required fields correctly before registering.');
      return;
    }

    this.isLoading = true;
    const formVal = this.registerForm.value;

    this.authRepo.register({
      firstName: formVal.firstName!,
      lastName: formVal.lastName!,
      email: formVal.email!,
      phone: formVal.phone!,
      dateOfBirth: formVal.dateOfBirth!,
      governmentIdType: formVal.governmentIdType!,
      governmentIdNumber: formVal.governmentIdNumber!,
      password: formVal.password!
    }).subscribe({
      next: res => {
        this.isLoading = false;
        this.toast.success(`Account created successfully! Welcome to SmartStay, ${res.data.user.firstName}.`);
        this.router.navigate(['/account']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
