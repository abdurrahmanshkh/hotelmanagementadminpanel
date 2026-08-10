import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { FeedbackRepository } from '../contracts/feedback.repository';
import { MockDatabaseService } from '../../services/mock-database.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Feedback, SubmitFeedbackInput, ApiResponse } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MockFeedbackRepository implements FeedbackRepository {
  private dbService = inject(MockDatabaseService);
  private authState = inject(AuthStateService);

  submitFeedback(input: SubmitFeedbackInput): Observable<ApiResponse<Feedback>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        const db = this.dbService.getSnapshot();
        const booking = db.bookings.find(b => b.id === input.bookingId);

        const newId = this.dbService.nextId(db.feedback);
        const newFeedback: Feedback = {
          id: newId,
          bookingId: input.bookingId,
          bookingReference: booking ? booking.bookingReference : 'BK-MOCK-REF',
          userId: currentUser ? currentUser.id : 1,
          guestName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User',
          roomNumber: booking ? booking.room.roomNumber : '101',
          rating: input.rating,
          cleanlinessRating: input.cleanlinessRating,
          serviceRating: input.serviceRating,
          comfortRating: input.comfortRating,
          comments: input.comments,
          createdAt: new Date().toISOString()
        };

        db.feedback.push(newFeedback);
        this.dbService.saveDatabase(db);

        return of({
          success: true,
          message: 'Thank you for your feedback!',
          data: newFeedback,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getFeedbackForRoom(roomNumber: string): Observable<ApiResponse<Feedback[]>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const items = this.dbService.getSnapshot().feedback.filter(f => f.roomNumber === roomNumber);
        return of({
          success: true,
          message: 'Room feedback retrieved.',
          data: items,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
