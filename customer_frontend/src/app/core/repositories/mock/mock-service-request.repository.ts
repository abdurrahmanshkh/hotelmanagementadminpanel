import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { ServiceRequestRepository } from '../contracts/service-request.repository';
import { MockDatabaseService } from '../../services/mock-database.service';
import { AuthStateService } from '../../services/auth-state.service';
import { ServiceRequest, CreateServiceRequestInput, ApiResponse, PageData } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MockServiceRequestRepository implements ServiceRequestRepository {
  private dbService = inject(MockDatabaseService);
  private authState = inject(AuthStateService);

  getMyServiceRequests(page = 1, size = 10): Observable<ApiResponse<PageData<ServiceRequest>>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        if (!currentUser) {
          return throwError(() => ({
            success: false,
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view service requests.',
            timestamp: new Date().toISOString()
          }));
        }

        const requests = this.dbService.getSnapshot().serviceRequests.filter(s => s.userId === currentUser.id);
        requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const totalItems = requests.length;
        const totalPages = Math.ceil(totalItems / size) || 1;
        const startIndex = (page - 1) * size;
        const paginated = requests.slice(startIndex, startIndex + size);

        return of({
          success: true,
          message: 'Service requests retrieved.',
          data: {
            items: paginated,
            page,
            size,
            totalItems,
            totalPages
          },
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  createServiceRequest(input: CreateServiceRequestInput): Observable<ApiResponse<ServiceRequest>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        if (!currentUser) {
          return throwError(() => ({
            success: false,
            code: 'UNAUTHORIZED',
            message: 'Authentication required.',
            timestamp: new Date().toISOString()
          }));
        }

        const db = this.dbService.getSnapshot();
        const booking = db.bookings.find(b => b.id === input.bookingId);
        if (!booking) {
          return throwError(() => ({
            success: false,
            code: 'BOOKING_NOT_FOUND',
            message: 'Associated booking was not found.',
            timestamp: new Date().toISOString()
          }));
        }

        const newId = this.dbService.nextId(db.serviceRequests);
        const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const refNumber = `SR-${dateTag}-${String(newId).padStart(4, '0')}`;

        const newRequest: ServiceRequest = {
          id: newId,
          referenceNumber: refNumber,
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
          roomId: booking.room.id,
          roomNumber: booking.room.roomNumber,
          userId: currentUser.id,
          guestName: `${currentUser.firstName} ${currentUser.lastName}`,
          category: input.category,
          title: input.title,
          description: input.description,
          priority: input.priority || 'MEDIUM',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        db.serviceRequests.push(newRequest);
        this.dbService.saveDatabase(db);

        return of({
          success: true,
          message: 'Service request created successfully.',
          data: newRequest,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  cancelServiceRequest(requestId: number): Observable<ApiResponse<ServiceRequest>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const db = this.dbService.getSnapshot();
        const index = db.serviceRequests.findIndex(s => s.id === requestId);

        if (index === -1) {
          return throwError(() => ({
            success: false,
            code: 'SERVICE_REQUEST_NOT_FOUND',
            message: 'Service request not found.',
            timestamp: new Date().toISOString()
          }));
        }

        const req = db.serviceRequests[index];
        req.status = 'CANCELLED';
        req.updatedAt = new Date().toISOString();

        db.serviceRequests[index] = req;
        this.dbService.saveDatabase(db);

        return of({
          success: true,
          message: 'Service request cancelled.',
          data: req,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
