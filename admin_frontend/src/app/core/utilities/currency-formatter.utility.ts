import { environment } from '../../../environments/environment';

export class CurrencyFormatter {
  static format(amount: number, currencyCode?: string): string {
    const code = currencyCode || environment.currency || 'INR';
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: code,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).format(amount);
    } catch {
      return `₹${amount.toFixed(2)}`;
    }
  }

  static formatCompact(amount: number): string {
    if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
    return `₹${amount.toFixed(0)}`;
  }
}
