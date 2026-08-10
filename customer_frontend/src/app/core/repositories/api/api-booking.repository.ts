import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRepository } from '../contracts/booking.repository';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
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
export class ApiBookingRepository implements BookingRepository {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getQuote(request: BookingQuoteRequest): Observable<ApiResponse<BookingQuote>> {
    return this.http.post<ApiResponse<BookingQuote>>(`${this.baseUrl}${API_ENDPOINTS.BOOKINGS.QUOTE}`, request);
  }

  createBooking(request: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(`${this.baseUrl}${API_ENDPOINTS.BOOKINGS.CREATE}`, request);
  }

  getMyBookings(status?: string, page = 1, size = 10): Observable<ApiResponse<PageData<Booking>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status && status !== 'ALL') {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<PageData<Booking>>>(`${this.baseUrl}${API_ENDPOINTS.BOOKINGS.LIST}`, { params });
  }

  getBookingById(bookingId: number): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.baseUrl}${API_ENDPOINTS.BOOKINGS.DETAILS(bookingId)}`);
  }

  cancelBooking(bookingId: number, reason?: string): Observable<ApiResponse<Booking>> {
    return this.http.put<ApiResponse<Booking>>(`${this.baseUrl}${API_ENDPOINTS.BOOKINGS.CANCEL(bookingId)}`, { reason });
  }
}
