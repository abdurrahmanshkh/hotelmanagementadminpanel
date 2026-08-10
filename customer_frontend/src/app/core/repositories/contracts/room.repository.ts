import { Observable } from 'rxjs';
import {
  Room,
  RoomType,
  RoomSearchFilters,
  AvailabilityRequest,
  RoomAvailabilityResult,
  ApiResponse,
  PageData
} from '../../models';

export abstract class RoomRepository {
  abstract getRooms(filters?: RoomSearchFilters, page?: number, size?: number): Observable<ApiResponse<PageData<Room>>>;
  abstract getRoomById(roomId: number): Observable<ApiResponse<Room>>;
  abstract getFeaturedRooms(): Observable<ApiResponse<Room[]>>;
  abstract getRoomTypes(): Observable<ApiResponse<RoomType[]>>;
  abstract getAvailability(request: AvailabilityRequest): Observable<ApiResponse<RoomAvailabilityResult[]>>;
}
