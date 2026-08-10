import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';

export class DateFormatter {
  static formatDate(dateString?: string, pattern: string = 'dd MMM yyyy'): string {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, pattern) : dateString;
    } catch {
      return dateString;
    }
  }

  static formatDateTime(dateString?: string, pattern: string = 'dd MMM yyyy, hh:mm a'): string {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, pattern) : dateString;
    } catch {
      return dateString;
    }
  }

  static formatTime(dateString?: string, pattern: string = 'hh:mm a'): string {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, pattern) : dateString;
    } catch {
      return dateString;
    }
  }

  static formatRelative(dateString?: string): string {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : dateString;
    } catch {
      return dateString;
    }
  }
}
