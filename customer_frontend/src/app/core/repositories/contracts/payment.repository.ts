import { Observable } from 'rxjs';
import { Payment, ProcessPaymentRequest, ApiResponse } from '../../models';

export abstract class PaymentRepository {
  abstract processPayment(request: ProcessPaymentRequest): Observable<ApiResponse<Payment>>;
  abstract getPaymentStatus(bookingId: number): Observable<ApiResponse<Payment>>;
}
