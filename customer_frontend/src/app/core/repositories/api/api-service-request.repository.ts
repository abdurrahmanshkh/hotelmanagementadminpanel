import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ServiceRequestRepository } from '../contracts/service-request.repository';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { ServiceRequest, CreateServiceRequestInput, ApiResponse, PageData } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiServiceRequestRepository implements ServiceRequestRepository {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getMyServiceRequests(page = 1, size = 10): Observable<ApiResponse<PageData<ServiceRequest>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.SERVICE_REQUESTS.LIST}`, { params }).pipe(
      map(res => {
        if (!res.data) return res;
        if (Array.isArray(res.data)) {
          const items: ServiceRequest[] = res.data;
          const pageData: PageData<ServiceRequest> = {
            items: items,
            page: page,
            size: size,
            totalItems: items.length,
            totalPages: Math.ceil(items.length / size) || 1
          };
          return { ...res, data: pageData };
        }
        return res;
      })
    );
  }

  createServiceRequest(input: CreateServiceRequestInput): Observable<ApiResponse<ServiceRequest>> {
    return this.http.post<ApiResponse<ServiceRequest>>(`${this.baseUrl}${API_ENDPOINTS.SERVICE_REQUESTS.CREATE}`, input);
  }

  cancelServiceRequest(requestId: number): Observable<ApiResponse<ServiceRequest>> {
    return this.http.post<ApiResponse<ServiceRequest>>(`${this.baseUrl}${API_ENDPOINTS.SERVICE_REQUESTS.CANCEL(requestId)}`, {});
  }
}
