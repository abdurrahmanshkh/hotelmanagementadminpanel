import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.xmlns]="'http://www.w3.org/2000/svg'"
      [attr.width]="size"
      [attr.height]="size"
      [attr.viewBox]="'0 0 24 24'"
      [attr.fill]="'none'"
      [attr.stroke]="color"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="className"
      style="display: inline-block; vertical-align: middle; flex-shrink: 0;"
    >
      <ng-container [ngSwitch]="iconKey">
        <!-- Dashboard / LayoutDashboard -->
        <g *ngSwitchCase="'dashboard'">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </g>

        <!-- Bed / BedDouble -->
        <g *ngSwitchCase="'bed'">
          <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
          <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
          <path d="M12 4v6" />
          <path d="M2 18h20" />
        </g>

        <!-- DoorOpen -->
        <g *ngSwitchCase="'door'">
          <path d="M13 4h3a2 2 0 0 1 2 2v14" />
          <path d="M2 20h20" />
          <path d="M13 20V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" />
          <circle cx="9" cy="12" r="1" />
        </g>

        <!-- Calendar / CalendarDays -->
        <g *ngSwitchCase="'calendar'">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
        </g>

        <!-- Users / UserCheck -->
        <g *ngSwitchCase="'users'">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </g>

        <!-- Sparkles / Housekeeping -->
        <g *ngSwitchCase="'sparkles'">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
        </g>

        <!-- Receipt / Billing -->
        <g *ngSwitchCase="'receipt'">
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
          <path d="M8 7h8M8 11h8M8 15h5" />
        </g>

        <!-- CreditCard -->
        <g *ngSwitchCase="'card'">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </g>

        <!-- TrendingUp / BarChart -->
        <g *ngSwitchCase="'trending-up'">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </g>

        <!-- Settings -->
        <g *ngSwitchCase="'settings'">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </g>

        <!-- LogIn / CheckIn -->
        <g *ngSwitchCase="'log-in'">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </g>

        <!-- LogOut / CheckOut -->
        <g *ngSwitchCase="'log-out'">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </g>

        <!-- Search -->
        <g *ngSwitchCase="'search'">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </g>

        <!-- Bell -->
        <g *ngSwitchCase="'bell'">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </g>

        <!-- Plus -->
        <g *ngSwitchCase="'plus'">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </g>

        <!-- Refresh / RefreshCw -->
        <g *ngSwitchCase="'refresh'">
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </g>

        <!-- Check -->
        <g *ngSwitchCase="'check'">
          <polyline points="20 6 9 17 4 12" />
        </g>

        <!-- X -->
        <g *ngSwitchCase="'x'">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </g>

        <!-- Filter -->
        <g *ngSwitchCase="'filter'">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </g>

        <!-- Clock -->
        <g *ngSwitchCase="'clock'">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </g>

        <!-- Wrench / Maintenance -->
        <g *ngSwitchCase="'wrench'">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </g>

        <!-- Shield / Priority / Security -->
        <g *ngSwitchCase="'shield'">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </g>

        <!-- MessageSquare / Chat -->
        <g *ngSwitchCase="'chat'">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </g>

        <!-- ChevronDown -->
        <g *ngSwitchCase="'chevron-down'">
          <polyline points="6 9 12 15 18 9" />
        </g>

        <!-- ChevronRight -->
        <g *ngSwitchCase="'chevron-right'">
          <polyline points="9 18 15 12 9 6" />
        </g>

        <!-- ChevronLeft -->
        <g *ngSwitchCase="'chevron-left'">
          <polyline points="15 18 9 12 15 6" />
        </g>

        <!-- Wifi -->
        <g *ngSwitchCase="'wifi'">
          <path d="M5 12.55a11 11 0 0 1 14 0" />
          <path d="M8.5 16.5a6 6 0 0 1 7 0" />
          <path d="M2 8.82a15 15 0 0 1 20 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </g>

        <!-- TV -->
        <g *ngSwitchCase="'tv'">
          <rect x="2" y="7" width="20" height="13" rx="2" />
          <polyline points="17 2 12 7 7 2" />
        </g>

        <!-- Coffee -->
        <g *ngSwitchCase="'coffee'">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </g>

        <!-- Wind / AC -->
        <g *ngSwitchCase="'wind'">
          <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
          <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
          <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
        </g>

        <!-- Bath / Jacuzzi -->
        <g *ngSwitchCase="'bath'">
          <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.1 2.1L6 7.5" />
          <path d="M2 12h20v2a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-2Z" />
          <path d="M4 12V7a2 2 0 0 1 2-2h3" />
        </g>

        <!-- Pool -->
        <g *ngSwitchCase="'pool'">
          <path d="M2 20c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1" />
          <path d="M2 16c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1" />
          <path d="M10 4v8" />
          <path d="M14 4v8" />
          <path d="M6 8h12" />
        </g>

        <!-- View / City -->
        <g *ngSwitchCase="'view'">
          <path d="M2 20h20" />
          <path d="M6 20V8l6-4 6 4v12" />
          <path d="M10 12h4" />
          <path d="M10 16h4" />
        </g>

        <!-- Balcony / Mountain / Scenic -->
        <g *ngSwitchCase="'balcony'">
          <path d="m8 3 4 8 5-5 5 11H2L8 3z" />
        </g>

        <!-- Lock -->
        <g *ngSwitchCase="'lock'">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </g>

        <!-- MoreVertical -->
        <g *ngSwitchCase="'more-vertical'">
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </g>

        <!-- Edit -->
        <g *ngSwitchCase="'edit'">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </g>

        <!-- Trash -->
        <g *ngSwitchCase="'trash'">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </g>

        <!-- Eye / Details -->
        <g *ngSwitchCase="'eye'">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </g>

        <!-- ArrowRight -->
        <g *ngSwitchCase="'arrow-right'">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </g>

        <!-- ArrowLeft -->
        <g *ngSwitchCase="'arrow-left'">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </g>

        <!-- Download -->
        <g *ngSwitchCase="'download'">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </g>

        <!-- Building / Hotel -->
        <g *ngSwitchCase="'building'">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
        </g>

        <!-- Default / Dot -->
        <g *ngSwitchDefault>
          <circle cx="12" cy="12" r="4" />
        </g>
      </ng-container>
    </svg>
  `
})
export class IconComponent {
  @Input() name: string = 'dashboard';
  @Input() size: number = 18;
  @Input() strokeWidth: number = 2;
  @Input() color: string = 'currentColor';
  @Input() className: string = '';

  get iconKey(): string {
    const n = (this.name || '').toLowerCase().trim();
    if (n.includes('dash') || n.includes('overview')) return 'dashboard';
    if (n.includes('room-type') || n.includes('bed')) return 'bed';
    if (n.includes('room') || n.includes('door') || n.includes('key')) return 'door';
    if (n.includes('book') || n.includes('reser') || n.includes('calen')) return 'calendar';
    if (n.includes('guest') || n.includes('user')) return 'users';
    if (n.includes('clean') || n.includes('housekeep') || n.includes('sparkl')) return 'sparkles';
    if (n.includes('pay') || n.includes('bill') || n.includes('receipt')) return 'receipt';
    if (n.includes('card')) return 'card';
    if (n.includes('report') || n.includes('trend') || n.includes('pric') || n.includes('analyt')) return 'trending-up';
    if (n.includes('sett') || n.includes('admin')) return 'settings';
    if (n.includes('checkin') || n.includes('check-in') || n.includes('login') || n.includes('log-in')) return 'log-in';
    if (n.includes('checkout') || n.includes('check-out') || n.includes('logout') || n.includes('log-out')) return 'log-out';
    if (n.includes('search') || n.includes('find')) return 'search';
    if (n.includes('bell') || n.includes('notif')) return 'bell';
    if (n.includes('plus') || n.includes('add') || n.includes('new')) return 'plus';
    if (n.includes('refresh') || n.includes('sync')) return 'refresh';
    if (n.includes('check') || n.includes('done')) return 'check';
    if (n.includes('x') || n.includes('close')) return 'x';
    if (n.includes('filt')) return 'filter';
    if (n.includes('clock') || n.includes('time')) return 'clock';
    if (n.includes('maint') || n.includes('repair') || n.includes('wrench')) return 'wrench';
    if (n.includes('shiel') || n.includes('secur')) return 'shield';
    if (n.includes('chat') || n.includes('messag')) return 'chat';
    if (n.includes('down')) return 'chevron-down';
    if (n.includes('right')) return 'chevron-right';
    if (n.includes('left')) return 'chevron-left';
    if (n.includes('wifi')) return 'wifi';
    if (n.includes('tv')) return 'tv';
    if (n.includes('coffee') || n.includes('bar')) return 'coffee';
    if (n.includes('wind') || n.includes('ac')) return 'wind';
    if (n.includes('bath') || n.includes('jacuzz')) return 'bath';
    if (n.includes('pool')) return 'pool';
    if (n.includes('view') || n.includes('city')) return 'view';
    if (n.includes('balcony')) return 'balcony';
    if (n.includes('lock')) return 'lock';
    if (n.includes('edit')) return 'edit';
    if (n.includes('trash') || n.includes('delete')) return 'trash';
    if (n.includes('eye') || n.includes('detail')) return 'eye';
    if (n.includes('arrow-right')) return 'arrow-right';
    if (n.includes('arrow-left')) return 'arrow-left';
    if (n.includes('download') || n.includes('export')) return 'download';
    if (n.includes('hotel') || n.includes('building')) return 'building';
    return n;
  }
}
