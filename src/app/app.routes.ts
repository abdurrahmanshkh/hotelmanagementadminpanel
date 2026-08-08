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
      // Guests
      {
        path: 'guests',
        loadComponent: () => import('./features/guests/guest-list/guest-list.component').then(m => m.GuestListComponent)
      },
      {
        path: 'guests/:guestId',
        loadComponent: () => import('./features/guests/guest-detail/guest-detail.component').then(m => m.GuestDetailComponent)
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
      {
        path: 'amenities',
        loadComponent: () => import('./features/room-types/amenity-manager/amenity-manager.component').then(m => m.AmenityManagerComponent)
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
      // Finance
      {
        path: 'payments',
        loadComponent: () => import('./features/payments/payment-list/payment-list.component').then(m => m.PaymentListComponent)
      },
      {
        path: 'payments/:paymentId',
        loadComponent: () => import('./features/payments/payment-detail/payment-detail.component').then(m => m.PaymentDetailComponent)
      },
      {
        path: 'pricing',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/pricing/pricing-rules/pricing-rules.component').then(m => m.PricingRulesComponent)
      },
      {
        path: 'pricing/rules',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/pricing/pricing-rules/pricing-rules.component').then(m => m.PricingRulesComponent)
      },
      {
        path: 'pricing/rules/new',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/pricing/pricing-rule-form/pricing-rule-form.component').then(m => m.PricingRuleFormComponent)
      },
      {
        path: 'pricing/rules/:ruleId/edit',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/pricing/pricing-rule-form/pricing-rule-form.component').then(m => m.PricingRuleFormComponent)
      },
      {
        path: 'pricing/preview',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/pricing/pricing-preview/pricing-preview.component').then(m => m.PricingPreviewComponent)
      },
      // Reports
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/reports/revenue-report/revenue-report.component').then(m => m.RevenueReportComponent)
      },
      {
        path: 'reports/revenue',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/reports/revenue-report/revenue-report.component').then(m => m.RevenueReportComponent)
      },
      {
        path: 'reports/bookings',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/reports/booking-report/booking-report.component').then(m => m.BookingReportComponent)
      },
      {
        path: 'reports/occupancy',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/reports/occupancy-report/occupancy-report.component').then(m => m.OccupancyReportComponent)
      },
      {
        path: 'reports/services',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.MANAGER] },
        loadComponent: () => import('./features/reports/service-report/service-report.component').then(m => m.ServiceReportComponent)
      },
      // Administration Settings
      {
        path: 'settings',
        canActivate: [roleGuard],
        data: { roles: [Role.MANAGER] },
        loadComponent: () => import('./features/settings/hotel-settings/hotel-settings.component').then(m => m.HotelSettingsComponent)
      },
      {
        path: 'settings/hotel',
        canActivate: [roleGuard],
        data: { roles: [Role.MANAGER] },
        loadComponent: () => import('./features/settings/hotel-settings/hotel-settings.component').then(m => m.HotelSettingsComponent)
      },
      {
        path: 'settings/operations',
        canActivate: [roleGuard],
        data: { roles: [Role.MANAGER] },
        loadComponent: () => import('./features/settings/operations-settings/operations-settings.component').then(m => m.OperationsSettingsComponent)
      },
      {
        path: 'settings/pricing',
        canActivate: [roleGuard],
        data: { roles: [Role.MANAGER] },
        loadComponent: () => import('./features/settings/pricing-settings/pricing-settings.component').then(m => m.PricingSettingsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
];
