import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RoomRepository } from '../contracts/room.repository';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import {
  Room,
  RoomType,
  RoomSearchFilters,
  AvailabilityRequest,
  RoomAvailabilityResult,
  ApiResponse,
  PageData
} from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiRoomRepository implements RoomRepository {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getRooms(filters?: RoomSearchFilters, page = 1, size = 12): Observable<ApiResponse<PageData<Room>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filters) {
      if (filters.roomTypeId) params = params.set('roomTypeId', filters.roomTypeId);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice);
      if (filters.adults) params = params.set('adults', filters.adults);
      if (filters.minRating) params = params.set('minRating', filters.minRating);
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    }
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.ROOMS.LIST}`, { params }).pipe(
      map(res => {
        if (!res.data) return res;
        if (Array.isArray(res.data)) {
          const items: Room[] = res.data;
          const pageData: PageData<Room> = {
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

  getRoomById(roomId: number): Observable<ApiResponse<Room>> {
    return this.http.get<ApiResponse<Room>>(`${this.baseUrl}${API_ENDPOINTS.ROOMS.DETAILS(roomId)}`);
  }

  getFeaturedRooms(): Observable<ApiResponse<Room[]>> {
    return this.http.get<ApiResponse<Room[]>>(`${this.baseUrl}${API_ENDPOINTS.ROOMS.FEATURED}`);
  }

  getRoomTypes(): Observable<ApiResponse<RoomType[]>> {
    return this.http.get<ApiResponse<RoomType[]>>(`${this.baseUrl}${API_ENDPOINTS.ROOMS.TYPES}`);
  }

  getAvailability(request: AvailabilityRequest): Observable<ApiResponse<RoomAvailabilityResult[]>> {
    return this.http.post<ApiResponse<RoomAvailabilityResult[]>>(`${this.baseUrl}${API_ENDPOINTS.ROOMS.AVAILABILITY}`, request);
  }
}
