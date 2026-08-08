import { HttpErrorResponse } from '@angular/common/http';

export class ErrorFormatter {
  public static format(error: any, fallback: string = 'An unexpected error occurred'): string {
    if (!error) return fallback;

    // If it's a string, check if it contains raw HTTP failure text
    if (typeof error === 'string') {
      return this.cleanRawHttpMessage(error, fallback);
    }

    // If it's a backend ApiResponse object with error message
    if (error.error && typeof error.error.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    // Handle Angular HttpErrorResponse status codes
    if (error instanceof HttpErrorResponse || typeof error.status === 'number') {
      const status = error.status;
      switch (status) {
        case 0:
          return 'Backend API server is unreachable. Please verify the Spring Boot server is running on port 8080 or switch to Mock Data mode.';
        case 400:
          return (error.error && typeof error.error.message === 'string')
            ? error.error.message
            : 'Invalid request data. Please check your inputs.';
        case 401:
          return 'Invalid credentials or expired session. Please log in again.';
        case 403:
          return 'Access denied. You do not have permissions to perform this action.';
        case 404:
          return 'The requested backend API endpoint was not found (404). Please ensure the backend server is running.';
        case 409:
          return (error.error && typeof error.error.message === 'string')
            ? error.error.message
            : 'Conflict detected. Please refresh the page and try again.';
        case 422:
          return 'Validation failed. Please verify form inputs.';
        case 500:
        case 502:
        case 503:
        case 504:
          return 'Backend server encountered an internal error. Please try again later or contact administrator.';
        default:
          if (error.message) {
            return this.cleanRawHttpMessage(error.message, fallback);
          }
          return fallback;
      }
    }

    // Standard JavaScript Error
    if (error.message && typeof error.message === 'string') {
      return this.cleanRawHttpMessage(error.message, fallback);
    }

    return fallback;
  }

  private static cleanRawHttpMessage(raw: string, fallback: string): string {
    if (raw.includes('Http failure response for')) {
      if (raw.includes('404')) {
        return 'Backend API endpoint not found (404). Please ensure the Spring Boot backend server is running.';
      }
      if (raw.includes('401')) {
        return 'Invalid email, password, or authorization code.';
      }
      if (raw.includes('403')) {
        return 'Access denied. You do not have permission for this feature.';
      }
      if (raw.includes('0 Unknown Error') || raw.includes('0 ') || raw.includes('Unknown Error')) {
        return 'Cannot connect to backend server. Please start the backend service on port 8080.';
      }
      return 'Failed to communicate with backend server. Please try again.';
    }
    return raw;
  }
}
