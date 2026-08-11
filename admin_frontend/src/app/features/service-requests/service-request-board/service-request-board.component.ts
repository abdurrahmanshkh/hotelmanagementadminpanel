import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ServiceRequestRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PriorityBadgeComponent } from '../../../shared/components/priority-badge/priority-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ServiceRequest, ServiceRequestStatus } from '../../../core/models';

@Component({
  selector: 'app-service-request-board',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    PageHeaderComponent,
    PriorityBadgeComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="kanban-page">
      <app-page-header title="Service Request Board" subtitle="Interactive Kanban visual workflow tracking">
        <div actions class="header-actions">
          <app-button variant="outline" size="md" (btnClick)="navigate('/admin/service-requests')">
            <app-icon name="receipt" [size]="16"></app-icon> Switch to Table View
          </app-button>
        </div>
      </app-page-header>

      <div class="kanban-board">
        <!-- PENDING COLUMN -->
        <div class="kanban-column">
          <div class="column-header">
            <h3>Pending</h3>
            <span class="column-count">{{ pendingList.length }}</span>
          </div>
          <div
            cdkDropList
            #pendingListRef="cdkDropList"
            [cdkDropListData]="pendingList"
            [cdkDropListConnectedTo]="[acceptedListRef, inProgressListRef, completedListRef]"
            (cdkDropListDropped)="onDrop($event, StatusEnum.PENDING)"
            class="kanban-list"
          >
            <div *ngFor="let item of pendingList" cdkDrag class="kanban-card">
              <div class="card-top">
                <span class="card-ref">{{ item.referenceNumber }}</span>
                <app-priority-badge [priority]="item.priority"></app-priority-badge>
              </div>
              <strong class="card-title" (click)="viewDetails(item.id)">{{ item.title }}</strong>
              <div class="card-meta">
                <span>Room {{ item.roomNumber }}</span>
                <span>{{ formatCategory(item.category) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ACCEPTED COLUMN -->
        <div class="kanban-column">
          <div class="column-header">
            <h3>Accepted</h3>
            <span class="column-count">{{ acceptedList.length }}</span>
          </div>
          <div
            cdkDropList
            #acceptedListRef="cdkDropList"
            [cdkDropListData]="acceptedList"
            [cdkDropListConnectedTo]="[pendingListRef, inProgressListRef, completedListRef]"
            (cdkDropListDropped)="onDrop($event, StatusEnum.ACCEPTED)"
            class="kanban-list"
          >
            <div *ngFor="let item of acceptedList" cdkDrag class="kanban-card">
              <div class="card-top">
                <span class="card-ref">{{ item.referenceNumber }}</span>
                <app-priority-badge [priority]="item.priority"></app-priority-badge>
              </div>
              <strong class="card-title" (click)="viewDetails(item.id)">{{ item.title }}</strong>
              <div class="card-meta">
                <span>Room {{ item.roomNumber }}</span>
                <span>{{ item.assignedStaffName || 'Staff Assigned' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- IN_PROGRESS COLUMN -->
        <div class="kanban-column">
          <div class="column-header">
            <h3>In Progress</h3>
            <span class="column-count">{{ inProgressList.length }}</span>
          </div>
          <div
            cdkDropList
            #inProgressListRef="cdkDropList"
            [cdkDropListData]="inProgressList"
            [cdkDropListConnectedTo]="[pendingListRef, acceptedListRef, completedListRef]"
            (cdkDropListDropped)="onDrop($event, StatusEnum.IN_PROGRESS)"
            class="kanban-list"
          >
            <div *ngFor="let item of inProgressList" cdkDrag class="kanban-card">
              <div class="card-top">
                <span class="card-ref">{{ item.referenceNumber }}</span>
                <app-priority-badge [priority]="item.priority"></app-priority-badge>
              </div>
              <strong class="card-title" (click)="viewDetails(item.id)">{{ item.title }}</strong>
              <div class="card-meta">
                <span>Room {{ item.roomNumber }}</span>
                <span>{{ item.assignedStaffName || 'In Fulfillment' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- COMPLETED COLUMN -->
        <div class="kanban-column">
          <div class="column-header">
            <h3>Completed</h3>
            <span class="column-count">{{ completedList.length }}</span>
          </div>
          <div
            cdkDropList
            #completedListRef="cdkDropList"
            [cdkDropListData]="completedList"
            [cdkDropListConnectedTo]="[pendingListRef, acceptedListRef, inProgressListRef]"
            (cdkDropListDropped)="onDrop($event, StatusEnum.COMPLETED)"
            class="kanban-list"
          >
            <div *ngFor="let item of completedList" cdkDrag class="kanban-card">
              <div class="card-top">
                <span class="card-ref">{{ item.referenceNumber }}</span>
                <app-priority-badge [priority]="item.priority"></app-priority-badge>
              </div>
              <strong class="card-title" (click)="viewDetails(item.id)">{{ item.title }}</strong>
              <div class="card-meta">
                <span>Room {{ item.roomNumber }}</span>
                <span class="done-tag">DONE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kanban-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .kanban-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; overflow-x: auto; padding-bottom: 1rem; @media (max-width: 1023px) { grid-template-columns: repeat(2, 1fr); } @media (max-width: 640px) { grid-template-columns: 1fr; } }
    .kanban-column { background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; min-height: 500px; }
    .column-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 2px solid #D1D5DB; h3 { font-size: 0.9375rem; font-weight: 700; color: #11243E; } }
    .column-count { background: #11243E; color: #FFF; font-size: 0.75rem; font-weight: 700; padding: 0.125rem 0.5rem; border-radius: 9999px; }
    .kanban-list { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; min-height: 400px; }
    .kanban-card { background: #FFF; border: 1px solid #E5E7EB; border-radius: 6px; padding: 0.875rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 0.5rem; cursor: grab; &:active { cursor: grabbing; } }
    .card-top { display: flex; align-items: center; justify-content: space-between; }
    .card-ref { font-size: 0.75rem; font-weight: 700; color: #C99B4A; }
    .card-title { font-size: 0.875rem; color: #11243E; cursor: pointer; &:hover { text-decoration: underline; color: #2563EB; } }
    .card-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: #6B7280; }
    .done-tag { color: #16803C; font-weight: 700; }
  `]
})
export class ServiceRequestBoardComponent implements OnInit {
  private serviceRepo = inject(ServiceRequestRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public StatusEnum = ServiceRequestStatus;

  public pendingList: ServiceRequest[] = [];
  public acceptedList: ServiceRequest[] = [];
  public inProgressList: ServiceRequest[] = [];
  public completedList: ServiceRequest[] = [];

  ngOnInit(): void {
    this.loadAllRequests();
  }

  loadAllRequests(): void {
    this.serviceRepo.getRequests({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const items = res.data.items;
          this.pendingList = items.filter(i => i.status === ServiceRequestStatus.PENDING);
          this.acceptedList = items.filter(i => i.status === ServiceRequestStatus.ACCEPTED);
          this.inProgressList = items.filter(i => i.status === ServiceRequestStatus.IN_PROGRESS);
          this.completedList = items.filter(i => i.status === ServiceRequestStatus.COMPLETED);
        }
      }
    });
  }

  onDrop(event: CdkDragDrop<ServiceRequest[]>, targetStatus: ServiceRequestStatus): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedItem = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.serviceRepo.updateStatus(movedItem.id, { status: targetStatus }).subscribe({
        next: () => {
          movedItem.status = targetStatus;
          this.toastService.success(`Request ${movedItem.referenceNumber} status updated to ${targetStatus}`, 'Status Updated');
        },
        error: (err: Error) => {
          this.toastService.error(err.message || 'Status transition failed');
          this.loadAllRequests();
        }
      });
    }
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/service-requests', id]);
  }

  formatCategory(cat: string): string {
    if (!cat) return '';
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }
}
