import { Observable } from 'rxjs';
import { ServiceRequest, CreateServiceRequestInput, ApiResponse, PageData } from '../../models';

export abstract class ServiceRequestRepository {
  abstract getMyServiceRequests(page?: number, size?: number): Observable<ApiResponse<PageData<ServiceRequest>>>;
  abstract createServiceRequest(input: CreateServiceRequestInput): Observable<ApiResponse<ServiceRequest>>;
  abstract cancelServiceRequest(requestId: number): Observable<ApiResponse<ServiceRequest>>;
}
