import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRepository } from '../contracts/payment.repository';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { Payment, ProcessPaymentRequest, ApiResponse } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiPaymentRepository implements PaymentRepository {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  processPayment(request: ProcessPaymentRequest): Observable<ApiResponse<Payment>> {
    return this.http.post<ApiResponse<Payment>>(`${this.baseUrl}${API_ENDPOINTS.PAYMENTS.PROCESS}`, request);
  }

  getPaymentStatus(bookingId: number): Observable<ApiResponse<Payment>> {
    return this.http.get<ApiResponse<Payment>>(`${this.baseUrl}${API_ENDPOINTS.PAYMENTS.STATUS(bookingId)}`);
  }
}
