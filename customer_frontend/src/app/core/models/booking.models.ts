export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'CANCELLED';

export interface RoomSummary {
  id: number;
  publicId: string;
  roomNumber: string;
  roomTypeName: string;
  primaryImageUrl: string;
}

export interface NightlyPrice {
  date: string;
  price: number;
  ruleApplied?: string;
}

export interface Booking {
  id: number;
  bookingReference: string;
  userId: number;
  room: RoomSummary;
  checkInDate: string;
  checkOutDate: string;
  expectedCheckInAt: string;
  expectedCheckOutAt: string;
  actualCheckInAt?: string;
  actualCheckOutAt?: string;
  adults: number;
  children: number;
  guestCount: number;
  numberOfNights: number;
  status: BookingStatus;
  basePricePerNight: number;
  appliedPricePerNight: number;
  roomAmount: number;
  taxAmount: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  specialRequests?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingQuoteRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
}

export interface BookingQuote {
  quoteId: string;
  roomId: number;
  numberOfNights: number;
  nightlyPrices?: NightlyPrice[];
  basePricePerNight: number;
  appliedPricePerNight: number;
  roomAmount: number;
  taxPercentage: number;
  taxAmount: number;
  serviceFeePercentage: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  validUntil: string;
}

export interface CreateBookingRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  specialRequests?: string;
  quoteId?: string;
}
