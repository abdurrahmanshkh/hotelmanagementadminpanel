import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { CustomerLayoutComponent } from './layout/customer-layout/customer-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'rooms',
        loadComponent: () => import('./features/rooms/room-list/room-list.component').then(m => m.RoomListComponent)
      },
      {
        path: 'rooms/:roomId',
        loadComponent: () => import('./features/rooms/room-details/room-details.component').then(m => m.RoomDetailsComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/authentication/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/authentication/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/authentication/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'booking/:roomId',
        canActivate: [authGuard],
        loadComponent: () => import('./features/booking/booking-form/booking-form.component').then(m => m.BookingFormComponent)
      },
      {
        path: 'booking/:roomId/review',
        canActivate: [authGuard],
        loadComponent: () => import('./features/booking/booking-review/booking-review.component').then(m => m.BookingReviewComponent)
      },
      {
        path: 'booking/:bookingId/payment',
        canActivate: [authGuard],
        loadComponent: () => import('./features/booking/payment/payment.component').then(m => m.PaymentComponent)
      },
      {
        path: 'booking/:bookingId/confirmation',
        canActivate: [authGuard],
        loadComponent: () => import('./features/booking/booking-confirmation/booking-confirmation.component').then(m => m.BookingConfirmationComponent)
      }
    ]
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./features/errors/forbidden/forbidden.component').then(m => m.ForbiddenComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
