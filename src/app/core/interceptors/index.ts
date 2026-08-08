import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { LoadingService } from '../services/loading.service';
import { ErrorFormatter } from '../utilities/error-formatter.utility';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.token();

  if (token && req.url.includes(environment.apiBaseUrl)) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  return next(req);
};

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingService);
  loadingService.show();
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};

export const requestIdInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const reqId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const cloned = req.clone({
    headers: req.headers.set('X-Request-ID', reqId)
  });
  return next(cloned);
};

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const friendlyMessage = ErrorFormatter.format(error, 'An unexpected system error occurred.');

      if (error.status === 401) {
        toastService.error('Session expired or invalid credentials.', 'Unauthorized');
        if (!req.url.includes('/auth/login')) {
          authService.clearSessionAndRedirect();
        }
      } else if (error.status === 403) {
        toastService.error('You do not have permission to perform this action.', 'Access Denied');
      } else if (error.status === 404) {
        toastService.error(friendlyMessage, 'Backend Endpoint Not Found');
      } else if (error.status === 409) {
        toastService.warning(friendlyMessage, 'State Conflict');
      } else if (error.status >= 500) {
        toastService.error('Internal server error. Please try again later.', 'Server Error');
      } else if (error.status === 0) {
        toastService.error(friendlyMessage, 'Backend Offline');
      }

      // Attach cleaned friendly message to error object for component subscribers
      const normalizedError = new Error(friendlyMessage);
      (normalizedError as any).status = error.status;

      return throwError(() => normalizedError);
    })
  );
};
