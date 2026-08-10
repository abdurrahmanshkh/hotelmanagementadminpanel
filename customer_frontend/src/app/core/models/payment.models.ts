export type PaymentStatus =
  | 'INITIATED'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod = 'CARD' | 'UPI' | 'CASH';

export interface Payment {
  id: number;
  paymentReference: string;
  bookingId: number;
  bookingReference: string;
  userId: number;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  failureReason?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessPaymentRequest {
  bookingId: number;
  paymentMethod: PaymentMethod;
  paymentToken?: string;
  dummyPaymentToken?: string;
  cardHolderName?: string;
  upiId?: string;
}
