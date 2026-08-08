import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { APP_ROUTES } from '../constants';
import { Role } from '../models';

export interface ComponentCanDeactivate {
  hasUnsavedChanges(): boolean;
}

export const adminAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate([APP_ROUTES.LOGIN], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const allowedRoles = route.data['roles'] as Role[] | undefined;
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (authService.hasRole(allowedRoles)) {
    return true;
  }

  toastService.error('You do not have administrative permission to view this section.', 'Access Restricted');
  router.navigate([APP_ROUTES.DASHBOARD]);
  return false;
};

export const unauthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate([APP_ROUTES.DASHBOARD]);
    return false;
  }
  return true;
};

export const pendingChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (component: ComponentCanDeactivate) => {
  if (component && typeof component.hasUnsavedChanges === 'function' && component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Are you sure you want to leave this page?');
  }
  return true;
};
