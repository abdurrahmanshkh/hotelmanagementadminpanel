import { Observable } from 'rxjs';
import {
  Booking,
  BookingQuote,
  BookingQuoteRequest,
  CreateBookingRequest,
  ApiResponse,
  PageData
} from '../../models';

export abstract class BookingRepository {
  abstract getQuote(request: BookingQuoteRequest): Observable<ApiResponse<BookingQuote>>;
  abstract createBooking(request: CreateBookingRequest): Observable<ApiResponse<Booking>>;
  abstract getMyBookings(status?: string, page?: number, size?: number): Observable<ApiResponse<PageData<Booking>>>;
  abstract getBookingById(bookingId: number): Observable<ApiResponse<Booking>>;
  abstract cancelBooking(bookingId: number, reason?: string): Observable<ApiResponse<Booking>>;
}
