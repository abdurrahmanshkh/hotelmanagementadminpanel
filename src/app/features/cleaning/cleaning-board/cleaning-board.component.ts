import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CleaningRepository } from '../../../core/repositories/contracts';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CleaningTask, CleaningTaskStatus } from '../../../core/models';

@Component({
  selector: 'app-cleaning-board',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    ButtonComponent
  ],
  template: `
    <div class="cleaning-board-page">
      <app-page-header title="Housekeeping Kanban Board" subtitle="Visual room turnover progress workflow">
        <div actions class="header-actions">
          <app-button variant="outline" size="md" (btnClick)="navigate('/admin/cleaning')">
            📄 Switch to Table View
          </app-button>
        </div>
      </app-page-header>

      <div class="board-grid">
        <div class="board-column">
          <div class="column-header">
            <h3>Pending Cleaning</h3>
            <span class="count">{{ pendingTasks.length }}</span>
          </div>
          <div class="task-list">
            <div *ngFor="let item of pendingTasks" class="task-card">
              <strong class="room-title">Room {{ item.roomNumber }}</strong>
              <p class="notes">{{ item.notes || 'Post-checkout turnover' }}</p>
              <button class="btn-action" (click)="assignStaff(item.id)">Assign Housekeeper</button>
            </div>
          </div>
        </div>

        <div class="board-column">
          <div class="column-header">
            <h3>In Progress</h3>
            <span class="count">{{ inProgressTasks.length }}</span>
          </div>
          <div class="task-list">
            <div *ngFor="let item of inProgressTasks" class="task-card">
              <strong class="room-title">Room {{ item.roomNumber }}</strong>
              <span class="staff-tag">👤 {{ item.assignedStaffName || 'Housekeeper' }}</span>
              <button class="btn-action btn-action--success" (click)="completeTask(item.id)">Complete</button>
            </div>
          </div>
        </div>

        <div class="board-column">
          <div class="column-header">
            <h3>Cleaned & Available</h3>
            <span class="count">{{ completedTasks.length }}</span>
          </div>
          <div class="task-list">
            <div *ngFor="let item of completedTasks" class="task-card task-card--done">
              <strong class="room-title">Room {{ item.roomNumber }}</strong>
              <span class="done-label">✅ Ready for Guest</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cleaning-board-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-actions { display: flex; gap: 0.75rem; }
    .board-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; @media (max-width: 768px) { grid-template-columns: 1fr; } }
    .board-column { background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; min-height: 450px; }
    .column-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 2px solid #D1D5DB; h3 { font-size: 0.9375rem; font-weight: 700; color: #11243E; } }
    .count { background: #11243E; color: #FFF; font-size: 0.75rem; font-weight: 700; padding: 0.125rem 0.5rem; border-radius: 9999px; }
    .task-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .task-card { background: #FFF; border: 1px solid #E5E7EB; border-radius: 6px; padding: 0.875rem; display: flex; flex-direction: column; gap: 0.5rem; &--done { background: #E6F4EA; border-color: #A7F3D0; } }
    .room-title { font-size: 1rem; color: #11243E; }
    .notes { font-size: 0.8125rem; color: #6B7280; }
    .staff-tag { font-size: 0.75rem; font-weight: 600; color: #374151; }
    .done-label { font-size: 0.8125rem; font-weight: 700; color: #16803C; }
    .btn-action { padding: 0.375rem 0.75rem; background: #11243E; color: #FFF; border: none; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; &--success { background: #16803C; } }
  `]
})
export class CleaningBoardComponent implements OnInit {
  private cleaningRepo = inject(CleaningRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public pendingTasks: CleaningTask[] = [];
  public inProgressTasks: CleaningTask[] = [];
  public completedTasks: CleaningTask[] = [];

  ngOnInit(): void {
    this.loadAllTasks();
  }

  loadAllTasks(): void {
    this.cleaningRepo.getCleaningTasks({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const items = res.data.items;
          this.pendingTasks = items.filter(t => t.status === CleaningTaskStatus.PENDING || t.status === CleaningTaskStatus.ASSIGNED);
          this.inProgressTasks = items.filter(t => t.status === CleaningTaskStatus.IN_PROGRESS);
          this.completedTasks = items.filter(t => t.status === CleaningTaskStatus.COMPLETED);
        }
      }
    });
  }

  assignStaff(id: number): void {
    this.cleaningRepo.assignStaff(id, 101, 'Marcus Vance').subscribe({
      next: () => {
        this.toastService.success('Assigned housekeeper Marcus Vance.', 'Assigned');
        this.loadAllTasks();
      }
    });
  }

  completeTask(id: number): void {
    this.cleaningRepo.completeTask(id, { roomInspected: true, roomReady: true, maintenanceIssueFound: false, notes: 'Turnover completed' }).subscribe({
      next: () => {
        this.toastService.success('Cleaning completed. Room is now AVAILABLE.', 'Completed');
        this.loadAllTasks();
      }
    });
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }
}
