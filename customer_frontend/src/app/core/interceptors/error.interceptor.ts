import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthStateService } from '../services/auth-state.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authState = inject(AuthStateService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse | any) => {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error?.error?.message && typeof error.error.message === 'string' && error.error.message.trim().length > 0) {
        errorMessage = error.error.message;
      } else if (typeof error?.error === 'string' && error.error.trim().length > 0) {
        errorMessage = error.error;
      } else if (error?.message && typeof error.message === 'string' && !error.message.includes('Http failure response')) {
        errorMessage = error.message;
      } else if (error?.statusText && error?.status) {
        errorMessage = `Request failed (${error.status}: ${error.statusText})`;
      }

      if (error.status === 401) {
        authState.clearAuth();
        toastService.error(errorMessage.includes('Session expired') || errorMessage.includes('Invalid') ? errorMessage : 'Session expired. Please log in again.');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        toastService.error('Access denied. You do not have permission.');
        router.navigate(['/forbidden']);
      } else {
        toastService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
