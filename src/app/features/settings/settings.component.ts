import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SettingsRepository } from '../../core/repositories/contracts';
import { ToastService } from '../../core/services/toast.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HotelSettings } from '../../core/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    FormFieldComponent,
    ButtonComponent
  ],
  template: `
    <div class="settings-page">
      <app-page-header title="Hotel System Settings" subtitle="Configure hotel property details, default operational rules & policies"></app-page-header>

      <div class="card settings-card">
        <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="settings-form">
          <!-- Property Profile Section -->
          <div class="form-section">
            <h3 class="section-title">Hotel Property Profile</h3>
            <div class="form-grid">
              <app-form-field label="Hotel Name" [required]="true">
                <input type="text" formControlName="hotelName" placeholder="e.g. SmartStay Grand Resort & Spa" class="form-control" />
              </app-form-field>

              <app-form-field label="Contact Email" [required]="true">
                <input type="email" formControlName="email" placeholder="contact@smartstay.com" class="form-control" />
              </app-form-field>

              <app-form-field label="Support Phone Number" [required]="true">
                <input type="text" formControlName="phone" placeholder="+91 98765 43210" class="form-control" />
              </app-form-field>

              <app-form-field label="Default Currency">
                <select formControlName="currency" class="form-control">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </app-form-field>
            </div>

            <app-form-field label="Full Physical Address">
              <input type="text" formControlName="address" placeholder="123 Luxury Boulevard, Beach Road..." class="form-control" />
            </app-form-field>
          </div>

          <!-- Operational Timings & Rules -->
          <div class="form-section">
            <h3 class="section-title">Check-In / Check-Out Default Rules</h3>
            <div class="form-grid">
              <app-form-field label="Standard Check-In Time" [required]="true">
                <input type="time" formControlName="checkInTime" class="form-control" />
              </app-form-field>

              <app-form-field label="Standard Check-Out Time" [required]="true">
                <input type="time" formControlName="checkOutTime" class="form-control" />
              </app-form-field>

              <app-form-field label="GST / Tax Percentage (%)" [required]="true">
                <input type="number" formControlName="taxPercentage" class="form-control" />
              </app-form-field>

              <app-form-field label="Service Fee Percentage (%)">
                <input type="number" formControlName="serviceFeePercentage" class="form-control" />
              </app-form-field>
            </div>
          </div>

          <div class="form-actions">
            <app-button type="submit" variant="accent" [loading]="submitting" [disabled]="settingsForm.invalid">
              💾 Save Hotel Settings
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .settings-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .settings-card { padding: 1.5rem; max-width: 800px; }
    .settings-form { display: flex; flex-direction: column; gap: 1.75rem; }
    .form-section { display: flex; flex-direction: column; gap: 1rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 1.25rem; &:last-child { border-bottom: none; } }
    .section-title { font-size: 1.05rem; font-weight: 700; color: #11243E; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; @media (max-width: 640px) { grid-template-columns: 1fr; } }
    .form-control { width: 100%; padding: 0.625rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .form-actions { display: flex; justify-content: flex-end; padding-top: 1rem; }
  `]
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsRepo = inject(SettingsRepository);
  private toastService = inject(ToastService);

  public submitting = false;

  public settingsForm = this.fb.group({
    hotelName: ['SmartStay Hotel & Resort', [Validators.required]],
    email: ['contact@smartstay.com', [Validators.required, Validators.email]],
    phone: ['+91 98765 43210', [Validators.required]],
    address: ['123 Luxury Boulevard, Beachfront Drive, Goa'],
    currency: ['INR', [Validators.required]],
    checkInTime: ['14:00', [Validators.required]],
    checkOutTime: ['11:00', [Validators.required]],
    taxPercentage: [18, [Validators.required, Validators.min(0)]],
    serviceFeePercentage: [5, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingsRepo.getSettings().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const s = res.data;
          this.settingsForm.patchValue({
            hotelName: s.hotelName,
            email: s.email || 'contact@smartstay.com',
            phone: s.phone || '+91 98765 43210',
            address: s.address || '',
            currency: s.currency || 'INR',
            checkInTime: s.checkInTime || '14:00',
            checkOutTime: s.checkOutTime || '11:00',
            taxPercentage: s.taxPercentage || 18,
            serviceFeePercentage: s.serviceFeePercentage || 5
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) return;
    this.submitting = true;
    const val = this.settingsForm.value;

    this.settingsRepo.updateSettings(val as any).subscribe({
      next: () => {
        this.submitting = false;
        this.toastService.success('Hotel settings saved successfully.', 'Settings Updated');
      },
      error: (err: Error) => {
        this.submitting = false;
        this.toastService.error(err.message || 'Failed to save settings');
      }
    });
  }
}
