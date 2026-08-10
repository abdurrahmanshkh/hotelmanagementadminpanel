import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function priceRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const minPrice = control.get('minimumPrice')?.value;
    const basePrice = control.get('basePrice')?.value;
    const maxPrice = control.get('maximumPrice')?.value;

    if (minPrice === null || basePrice === null || maxPrice === null ||
        minPrice === undefined || basePrice === undefined || maxPrice === undefined) {
      return null;
    }

    const min = Number(minPrice);
    const base = Number(basePrice);
    const max = Number(maxPrice);

    if (isNaN(min) || isNaN(base) || isNaN(max)) {
      return null;
    }

    if (min > base) {
      return { minExceedsBase: true };
    }
    if (base > max) {
      return { baseExceedsMax: true };
    }
    return null;
  };
}

export function occupancyRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const minOcc = control.get('minOccupancyPercentage')?.value;
    const maxOcc = control.get('maxOccupancyPercentage')?.value;

    if (minOcc === null || maxOcc === null || minOcc === undefined || maxOcc === undefined) {
      return null;
    }

    const min = Number(minOcc);
    const max = Number(maxOcc);

    if (isNaN(min) || isNaN(max)) {
      return null;
    }

    if (min < 0 || min > 100 || max < 0 || max > 100) {
      return { invalidOccupancyBounds: true };
    }

    if (min >= max) {
      return { minOccupancyExceedsMax: true };
    }

    return null;
  };
}

export function httpsUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const val = String(control.value).trim().toLowerCase();
    if (val.startsWith('javascript:') || val.startsWith('data:')) {
      return { unsafeScheme: true };
    }
    if (val.startsWith('https://') || val.startsWith('http://localhost') || val.startsWith('/assets/')) {
      return null;
    }
    return { invalidHttpsUrl: true };
  };
}
