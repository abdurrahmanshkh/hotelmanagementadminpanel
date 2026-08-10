import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { RoomRepository } from '../contracts/room.repository';
import { MockDatabaseService } from '../../services/mock-database.service';
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
export class MockRoomRepository implements RoomRepository {
  private dbService = inject(MockDatabaseService);

  getRooms(filters?: RoomSearchFilters, page = 1, size = 12): Observable<ApiResponse<PageData<Room>>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        let rooms = [...this.dbService.getSnapshot().rooms];

        if (filters) {
          if (filters.roomTypeId) {
            rooms = rooms.filter(r => r.roomType.id === filters.roomTypeId);
          }
          if (filters.minPrice) {
            rooms = rooms.filter(r => r.currentPrice >= filters.minPrice!);
          }
          if (filters.maxPrice) {
            rooms = rooms.filter(r => r.currentPrice <= filters.maxPrice!);
          }
          if (filters.adults) {
            rooms = rooms.filter(r => r.maximumAdults >= filters.adults!);
          }
          if (filters.minRating) {
            rooms = rooms.filter(r => r.rating >= filters.minRating!);
          }
          if (filters.bedType) {
            rooms = rooms.filter(r => r.roomType.bedType.toLowerCase().includes(filters.bedType!.toLowerCase()));
          }
          if (filters.amenities && filters.amenities.length > 0) {
            rooms = rooms.filter(r =>
              filters.amenities!.every(a => r.amenities.some(item => item.toLowerCase() === a.toLowerCase()))
            );
          }
          if (filters.sortBy) {
            switch (filters.sortBy) {
              case 'PRICE_LOW':
                rooms.sort((a, b) => a.currentPrice - b.currentPrice);
                break;
              case 'PRICE_HIGH':
                rooms.sort((a, b) => b.currentPrice - a.currentPrice);
                break;
              case 'RATING':
                rooms.sort((a, b) => b.rating - a.rating);
                break;
              case 'CAPACITY':
                rooms.sort((a, b) => b.maximumAdults - a.maximumAdults);
                break;
            }
          }
        }

        const totalItems = rooms.length;
        const totalPages = Math.ceil(totalItems / size) || 1;
        const startIndex = (page - 1) * size;
        const paginated = rooms.slice(startIndex, startIndex + size);

        return of({
          success: true,
          message: 'Rooms retrieved successfully.',
          data: {
            items: paginated,
            page,
            size,
            totalItems,
            totalPages
          },
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getRoomById(roomId: number): Observable<ApiResponse<Room>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const room = this.dbService.getSnapshot().rooms.find(r => r.id === roomId);

        if (!room) {
          return throwError(() => ({
            success: false,
            code: 'ROOM_NOT_FOUND',
            message: `Room with ID ${roomId} was not found.`,
            timestamp: new Date().toISOString()
          }));
        }

        return of({
          success: true,
          message: 'Room details retrieved.',
          data: room,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getFeaturedRooms(): Observable<ApiResponse<Room[]>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const featured = this.dbService.getSnapshot().rooms.filter(r => r.featured);
        return of({
          success: true,
          message: 'Featured rooms retrieved.',
          data: featured,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getRoomTypes(): Observable<ApiResponse<RoomType[]>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const types = this.dbService.getSnapshot().roomTypes;
        return of({
          success: true,
          message: 'Room types retrieved.',
          data: types,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getAvailability(request: AvailabilityRequest): Observable<ApiResponse<RoomAvailabilityResult[]>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const db = this.dbService.getSnapshot();
        const availableRooms = db.rooms.filter(r => r.status === 'AVAILABLE' && r.maximumAdults >= request.adults);

        const results: RoomAvailabilityResult[] = availableRooms.map(room => ({
          room,
          available: true,
          nightlyPrice: room.currentPrice,
          totalPriceForStay: room.currentPrice * 2
        }));

        return of({
          success: true,
          message: 'Available rooms found.',
          data: results,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
