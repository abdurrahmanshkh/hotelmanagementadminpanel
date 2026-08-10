import { Injectable } from '@angular/core';
import { BookingQuote, Room } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PricingCalculatorService {
  calculateQuote(
    room: Room,
    checkInDateStr: string,
    checkOutDateStr: string,
    taxPercentage = 12,
    serviceFeePercentage = 5
  ): BookingQuote {
    const checkIn = new Date(checkInDateStr);
    const checkOut = new Date(checkOutDateStr);

    const diffTime = Math.max(0, checkOut.getTime() - checkIn.getTime());
    const numberOfNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const basePricePerNight = room.basePrice || room.currentPrice;
    const appliedPricePerNight = room.currentPrice || room.basePrice;
    const roomAmount = appliedPricePerNight * numberOfNights;

    const taxAmount = Math.round((roomAmount * taxPercentage) / 100);
    const serviceFee = Math.round((roomAmount * serviceFeePercentage) / 100);
    const discountAmount = 0;
    const totalAmount = roomAmount + taxAmount + serviceFee - discountAmount;

    const validUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return {
      quoteId: `QT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      roomId: room.id,
      numberOfNights,
      basePricePerNight,
      appliedPricePerNight,
      roomAmount,
      taxPercentage,
      taxAmount,
      serviceFeePercentage,
      serviceFee,
      discountAmount,
      totalAmount,
      currency: room.currency || 'INR',
      validUntil
    };
  }
}
