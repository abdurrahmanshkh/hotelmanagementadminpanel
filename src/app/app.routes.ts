import { Routes } from '@angular/router';
import { adminAuthGuard, unauthenticatedGuard, roleGuard } from './core/guards';
import { Role } from './core/enums';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin/login',
    canActivate: [unauthenticatedGuard],
    loadComponent: () => import('./features/authentication/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      // Bookings
      {
        path: 'bookings',
        loadComponent: () => import('./features/bookings/booking-list/booking-list.component').then(m => m.BookingListComponent)
      },
      {
        path: 'bookings/:bookingId',
        loadComponent: () => import('./features/bookings/booking-detail/booking-detail.component').then(m => m.BookingDetailComponent)
      },
      // Service Requests
      {
        path: 'service-requests',
        loadComponent: () => import('./features/service-requests/service-request-list/service-request-list.component').then(m => m.ServiceRequestListComponent)
      },
      {
        path: 'service-requests/board',
        loadComponent: () => import('./features/service-requests/service-request-board/service-request-board.component').then(m => m.ServiceRequestBoardComponent)
      },
      {
        path: 'service-requests/:requestId',
        loadComponent: () => import('./features/service-requests/service-request-detail/service-request-detail.component').then(m => m.ServiceRequestDetailComponent)
      },
      // Chats
      {
        path: 'chats',
        loadComponent: () => import('./features/chats/chat-inbox/chat-inbox.component').then(m => m.ChatInboxComponent)
      },
      {
        path: 'chats/:threadId',
        loadComponent: () => import('./features/chats/chat-thread/chat-thread.component').then(m => m.ChatThreadComponent)
      },
      // Rooms & Room Types
      {
        path: 'rooms',
        loadComponent: () => import('./features/rooms/room-list/room-list.component').then(m => m.RoomListComponent)
      },
      {
        path: 'rooms/new',
        loadComponent: () => import('./features/rooms/room-form/room-form.component').then(m => m.RoomFormComponent)
      },
      {
        path: 'rooms/:roomId',
        loadComponent: () => import('./features/rooms/room-detail/room-detail.component').then(m => m.RoomDetailComponent)
      },
      {
        path: 'rooms/:roomId/edit',
        loadComponent: () => import('./features/rooms/room-form/room-form.component').then(m => m.RoomFormComponent)
      },
      {
        path: 'room-types',
        loadComponent: () => import('./features/room-types/room-type-list/room-type-list.component').then(m => m.RoomTypeListComponent)
      },
      {
        path: 'room-types/new',
        loadComponent: () => import('./features/room-types/room-type-form/room-type-form.component').then(m => m.RoomTypeFormComponent)
      },
      {
        path: 'room-types/:roomTypeId/edit',
        loadComponent: () => import('./features/room-types/room-type-form/room-type-form.component').then(m => m.RoomTypeFormComponent)
      },
      // Operations (Cleaning & Maintenance)
      {
        path: 'cleaning',
        loadComponent: () => import('./features/cleaning/cleaning-list/cleaning-list.component').then(m => m.CleaningListComponent)
      },
      {
        path: 'cleaning/board',
        loadComponent: () => import('./features/cleaning/cleaning-board/cleaning-board.component').then(m => m.CleaningBoardComponent)
      },
      {
        path: 'cleaning/:taskId',
        loadComponent: () => import('./features/cleaning/cleaning-detail/cleaning-detail.component').then(m => m.CleaningDetailComponent)
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./features/maintenance/maintenance-list/maintenance-list.component').then(m => m.MaintenanceListComponent)
      },
      {
        path: 'maintenance/new',
        loadComponent: () => import('./features/maintenance/maintenance-form/maintenance-form.component').then(m => m.MaintenanceFormComponent)
      },
      {
        path: 'maintenance/:maintenanceId',
        loadComponent: () => import('./features/maintenance/maintenance-detail/maintenance-detail.component').then(m => m.MaintenanceDetailComponent)
      },
      // Reports
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
      },
      // Administration Settings
      {
        path: 'settings',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
