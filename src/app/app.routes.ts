import { Routes } from '@angular/router';
import { unauthenticatedGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/login',
    pathMatch: 'full'
  },
  {
    path: 'admin/login',
    canActivate: [unauthenticatedGuard],
    loadComponent: () => import('./features/authentication/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '**',
    redirectTo: 'admin/login'
  }
];
