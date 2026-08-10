import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { BookingRepository } from '../contracts/booking.repository';
import { MockDatabaseService } from '../../services/mock-database.service';
import { AuthStateService } from '../../services/auth-state.service';
import { PricingCalculatorService } from '../../services/pricing-calculator.service';
import {
  Booking,
  BookingQuote,
  BookingQuoteRequest,
  CreateBookingRequest,
  ApiResponse,
  PageData
} from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MockBookingRepository implements BookingRepository {
  private dbService = inject(MockDatabaseService);
  private authState = inject(AuthStateService);
  private calculator = inject(PricingCalculatorService);

  getQuote(request: BookingQuoteRequest): Observable<ApiResponse<BookingQuote>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const room = this.dbService.getSnapshot().rooms.find(r => r.id === request.roomId);
        if (!room) {
          return throwError(() => ({
            success: false,
            code: 'ROOM_NOT_FOUND',
            message: `Room with ID ${request.roomId} not found.`,
            timestamp: new Date().toISOString()
          }));
        }

        const quote = this.calculator.calculateQuote(room, request.checkInDate, request.checkOutDate);

        return of({
          success: true,
          message: 'Booking quote generated successfully.',
          data: quote,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  createBooking(request: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        if (!currentUser) {
          return throwError(() => ({
            success: false,
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to create a booking.',
            timestamp: new Date().toISOString()
          }));
        }

        const db = this.dbService.getSnapshot();
        const room = db.rooms.find(r => r.id === request.roomId);
        if (!room) {
          return throwError(() => ({
            success: false,
            code: 'ROOM_NOT_FOUND',
            message: 'Target room not found.',
            timestamp: new Date().toISOString()
          }));
        }

        const quote = this.calculator.calculateQuote(room, request.checkInDate, request.checkOutDate);
        const newId = this.dbService.nextId(db.bookings);
        const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const refNumber = `BK-${dateTag}-${String(newId).padStart(4, '0')}`;

        const newBooking: Booking = {
          id: newId,
          bookingReference: refNumber,
          userId: currentUser.id,
          room: {
            id: room.id,
            publicId: room.publicId,
            roomNumber: room.roomNumber,
            roomTypeName: room.roomType.name,
            primaryImageUrl: room.images[0]?.url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32'
          },
          checkInDate: request.checkInDate,
          checkOutDate: request.checkOutDate,
          expectedCheckInAt: `${request.checkInDate}T14:00:00+05:30`,
          expectedCheckOutAt: `${request.checkOutDate}T11:00:00+05:30`,
          adults: request.adults,
          children: request.children,
          guestCount: request.adults + request.children,
          numberOfNights: quote.numberOfNights,
          status: 'PENDING_PAYMENT',
          basePricePerNight: quote.basePricePerNight,
          appliedPricePerNight: quote.appliedPricePerNight,
          roomAmount: quote.roomAmount,
          taxAmount: quote.taxAmount,
          serviceFee: quote.serviceFee,
          discountAmount: quote.discountAmount,
          totalAmount: quote.totalAmount,
          currency: quote.currency,
          specialRequests: request.specialRequests,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        db.bookings.push(newBooking);
        this.dbService.saveDatabase(db);

        return of({
          success: true,
          message: 'Booking created. Proceed to payment.',
          data: newBooking,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getMyBookings(status?: string, page = 1, size = 10): Observable<ApiResponse<PageData<Booking>>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        if (!currentUser) {
          return throwError(() => ({
            success: false,
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view your bookings.',
            timestamp: new Date().toISOString()
          }));
        }

        let bookings = this.dbService.getSnapshot().bookings.filter(b => b.userId === currentUser.id);

        if (status && status !== 'ALL') {
          bookings = bookings.filter(b => b.status === status);
        }

        bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const totalItems = bookings.length;
        const totalPages = Math.ceil(totalItems / size) || 1;
        const startIndex = (page - 1) * size;
        const paginated = bookings.slice(startIndex, startIndex + size);

        return of({
          success: true,
          message: 'Bookings retrieved.',
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

  getBookingById(bookingId: number): Observable<ApiResponse<Booking>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const booking = this.dbService.getSnapshot().bookings.find(b => b.id === bookingId);
        if (!booking) {
          return throwError(() => ({
            success: false,
            code: 'BOOKING_NOT_FOUND',
            message: `Booking ID ${bookingId} not found.`,
            timestamp: new Date().toISOString()
          }));
        }

        return of({
          success: true,
          message: 'Booking details retrieved.',
          data: booking,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  cancelBooking(bookingId: number, reason?: string): Observable<ApiResponse<Booking>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const db = this.dbService.getSnapshot();
        const index = db.bookings.findIndex(b => b.id === bookingId);

        if (index === -1) {
          return throwError(() => ({
            success: false,
            code: 'BOOKING_NOT_FOUND',
            message: 'Booking not found.',
            timestamp: new Date().toISOString()
          }));
        }

        const booking = db.bookings[index];
        if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
          return throwError(() => ({
            success: false,
            code: 'INVALID_BOOKING_STATUS',
            message: `Cannot cancel a booking in status ${booking.status}.`,
            timestamp: new Date().toISOString()
          }));
        }

        booking.status = 'CANCELLED';
        booking.cancellationReason = reason || 'Cancelled by guest.';
        booking.updatedAt = new Date().toISOString();

        db.bookings[index] = booking;
        this.dbService.saveDatabase(db);

        return of({
          success: true,
          message: 'Booking cancelled successfully.',
          data: booking,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
