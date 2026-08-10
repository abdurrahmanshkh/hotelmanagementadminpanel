import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { PaymentRepository } from '../contracts/payment.repository';
import { MockDatabaseService } from '../../services/mock-database.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Payment, ProcessPaymentRequest, ApiResponse, RoomPasscode } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MockPaymentRepository implements PaymentRepository {
  private dbService = inject(MockDatabaseService);
  private authState = inject(AuthStateService);

  processPayment(request: ProcessPaymentRequest): Observable<ApiResponse<Payment>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs + 300),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        if (!currentUser) {
          return throwError(() => ({
            success: false,
            code: 'UNAUTHORIZED',
            message: 'Authentication required to process payment.',
            timestamp: new Date().toISOString()
          }));
        }

        const db = this.dbService.getSnapshot();
        const booking = db.bookings.find(b => b.id === request.bookingId);

        if (!booking) {
          return throwError(() => ({
            success: false,
            code: 'BOOKING_NOT_FOUND',
            message: 'Associated booking was not found.',
            timestamp: new Date().toISOString()
          }));
        }

        if (request.dummyPaymentToken === 'tok_failed') {
          return throwError(() => ({
            success: false,
            code: 'PAYMENT_FAILED',
            message: 'Payment declined by bank simulator. Please try another card.',
            timestamp: new Date().toISOString()
          }));
        }

        const newId = this.dbService.nextId(db.payments);
        const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const payRef = `PAY-${dateTag}-${String(newId).padStart(4, '0')}`;

        const newPayment: Payment = {
          id: newId,
          paymentReference: payRef,
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
          userId: currentUser.id,
          amount: booking.totalAmount,
          currency: booking.currency,
          paymentMethod: request.paymentMethod,
          status: 'SUCCESS',
          gatewayTransactionId: `TXN_MOCK_${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        db.payments.push(newPayment);

        booking.status = 'CONFIRMED';
        booking.updatedAt = new Date().toISOString();

        let passcode = db.passcodes.find(p => p.bookingId === booking.id);
        if (!passcode) {
          const passId = this.dbService.nextId(db.passcodes);
          const rawPin = String(Math.floor(100000 + Math.random() * 900000));
          passcode = {
            id: passId,
            bookingId: booking.id,
            bookingReference: booking.bookingReference,
            roomId: booking.room.id,
            roomNumber: booking.room.roomNumber,
            userId: currentUser.id,
            passcode: rawPin,
            maskedPasscode: `${rawPin.slice(0, 2)}XX${rawPin.slice(4)}`,
            status: 'ACTIVE',
            validFrom: booking.expectedCheckInAt,
            validUntil: booking.expectedCheckOutAt,
            failedAttempts: 0,
            maxAllowedAttempts: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          db.passcodes.push(passcode);
        }

        this.dbService.saveDatabase(db);

        return of({
          success: true,
          message: 'Payment completed successfully. Your booking is confirmed!',
          data: newPayment,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getPaymentStatus(bookingId: number): Observable<ApiResponse<Payment>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const payment = this.dbService.getSnapshot().payments.find(p => p.bookingId === bookingId);
        if (!payment) {
          return throwError(() => ({
            success: false,
            code: 'PAYMENT_NOT_FOUND',
            message: 'No payment record found for this booking.',
            timestamp: new Date().toISOString()
          }));
        }

        return of({
          success: true,
          message: 'Payment details retrieved.',
          data: payment,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
