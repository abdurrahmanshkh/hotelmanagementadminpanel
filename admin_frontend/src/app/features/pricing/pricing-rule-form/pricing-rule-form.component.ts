import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PricingRepository, RoomRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RoomType, PricingAdjustmentType } from '../../../core/models';

@Component({
  selector: 'app-pricing-rule-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PageHeaderComponent,
    FormFieldComponent,
    ButtonComponent
  ],
  template: `
    <div class="pricing-rule-form-page">
      <app-page-header
        [title]="isEditMode ? 'Edit Pricing Rule - ' + ruleName : 'Create Pricing Rule'"
        subtitle="Define seasonal markup, weekend surge rates or promotional discounts"
      >
        <div actions class="header-actions">
          <app-button variant="outline" size="sm" (btnClick)="goBack()">← Cancel</app-button>
        </div>
      </app-page-header>

      <div class="card form-card">
        <form [formGroup]="ruleForm" (ngSubmit)="onSubmit()" class="rule-form">
          <div class="form-grid">
            <app-form-field label="Rule Name" [required]="true">
              <input type="text" formControlName="name" placeholder="e.g. Weekend Surge (+15%)" class="form-control" />
            </app-form-field>

            <app-form-field label="Target Room Type">
              <select formControlName="roomTypeId" class="form-control">
                <option [value]="0">-- All Room Categories --</option>
                <option *ngFor="let type of roomTypes" [value]="type.id">{{ type.name }}</option>
              </select>
            </app-form-field>

            <app-form-field label="Adjustment Mechanism" [required]="true">
              <select formControlName="adjustmentType" class="form-control">
                <option [value]="AdjustmentEnum.PERCENTAGE_MARKUP">PERCENTAGE_MARKUP (%)</option>
                <option [value]="AdjustmentEnum.PERCENTAGE_DISCOUNT">PERCENTAGE_DISCOUNT (%)</option>
                <option [value]="AdjustmentEnum.FIXED_MARKUP">FIXED_MARKUP (₹)</option>
                <option [value]="AdjustmentEnum.FIXED_DISCOUNT">FIXED_DISCOUNT (₹)</option>
              </select>
            </app-form-field>

            <app-form-field label="Adjustment Value" [required]="true">
              <input type="number" formControlName="adjustmentValue" placeholder="e.g. 15" class="form-control" />
            </app-form-field>

            <app-form-field label="Min Occupancy (%)" [required]="true">
              <input type="number" formControlName="minOccupancyPercentage" class="form-control" />
            </app-form-field>

            <app-form-field label="Max Occupancy (%)" [required]="true">
              <input type="number" formControlName="maxOccupancyPercentage" class="form-control" />
            </app-form-field>

            <app-form-field label="Allowed Min Price (₹)">
              <input type="number" formControlName="allowedMinPrice" class="form-control" />
            </app-form-field>

            <app-form-field label="Allowed Max Price (₹)">
              <input type="number" formControlName="allowedMaxPrice" class="form-control" />
            </app-form-field>
          </div>

          <div class="form-actions">
            <app-button type="button" variant="outline" (btnClick)="goBack()">Cancel</app-button>
            <app-button type="submit" variant="accent" [loading]="submitting" [disabled]="ruleForm.invalid">
              {{ isEditMode ? 'Save Rule Changes' : 'Create Pricing Rule' }}
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .pricing-rule-form-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .form-card { padding: 1.5rem; max-width: 760px; }
    .rule-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; @media (max-width: 640px) { grid-template-columns: 1fr; } }
    .form-control { width: 100%; padding: 0.625rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.875rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; }
  `]
})
export class PricingRuleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private pricingRepo = inject(PricingRepository);
  private roomRepo = inject(RoomRepository);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public AdjustmentEnum = PricingAdjustmentType;
  public isEditMode = false;
  public ruleId: number | null = null;
  public ruleName = '';
  public roomTypes: RoomType[] = [];
  public submitting = false;

  public ruleForm = this.fb.group({
    name: ['', [Validators.required]],
    roomTypeId: [0],
    adjustmentType: [PricingAdjustmentType.PERCENTAGE_MARKUP, [Validators.required]],
    adjustmentValue: [15, [Validators.required, Validators.min(0)]],
    minOccupancyPercentage: [50, [Validators.required, Validators.min(0)]],
    maxOccupancyPercentage: [100, [Validators.required, Validators.min(0)]],
    allowedMinPrice: [2000],
    allowedMaxPrice: [10000],
    isActive: [true]
  });

  ngOnInit(): void {
    this.loadRoomTypes();
    const id = this.route.snapshot.paramMap.get('ruleId');
    if (id) {
      this.isEditMode = true;
      this.ruleId = Number(id);
      this.loadRuleDetails(this.ruleId);
    }
  }

  loadRoomTypes(): void {
    this.roomRepo.getRoomTypes().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.roomTypes = res.data;
        }
      }
    });
  }

  loadRuleDetails(id: number): void {
    this.pricingRepo.getPricingRuleById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const r = res.data;
          this.ruleName = r.name;
          this.ruleForm.patchValue({
            name: r.name,
            roomTypeId: r.roomTypeId || 0,
            adjustmentType: r.adjustmentType,
            adjustmentValue: r.adjustmentValue,
            minOccupancyPercentage: r.minOccupancyPercentage,
            maxOccupancyPercentage: r.maxOccupancyPercentage,
            allowedMinPrice: r.allowedMinPrice,
            allowedMaxPrice: r.allowedMaxPrice,
            isActive: r.isActive
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.ruleForm.invalid) return;
    this.submitting = true;
    const val = this.ruleForm.value;

    if (this.isEditMode && this.ruleId) {
      this.pricingRepo.updatePricingRule(this.ruleId, val as any).subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Pricing rule updated successfully.', 'Saved');
          this.goBack();
        },
        error: (err: Error) => {
          this.submitting = false;
          this.toastService.error(err.message || 'Update failed');
        }
      });
    } else {
      this.pricingRepo.createPricingRule(val as any).subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Pricing rule created successfully.', 'Created');
          this.goBack();
        },
        error: (err: Error) => {
          this.submitting = false;
          this.toastService.error(err.message || 'Creation failed');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/pricing']);
  }
}
