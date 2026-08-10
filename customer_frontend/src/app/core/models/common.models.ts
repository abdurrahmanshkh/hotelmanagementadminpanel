export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageData<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  path?: string;
  timestamp: string;
  traceId?: string;
}
