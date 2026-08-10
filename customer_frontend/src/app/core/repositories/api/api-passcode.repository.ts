import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PasscodeRepository } from '../contracts/passcode.repository';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { RoomPasscode, AccessAttemptResult, ApiResponse } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiPasscodeRepository implements PasscodeRepository {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getPasscodeByBookingId(bookingId: number): Observable<ApiResponse<RoomPasscode>> {
    return this.http.get<ApiResponse<RoomPasscode>>(`${this.baseUrl}${API_ENDPOINTS.PASSCODES.GET(bookingId)}`);
  }

  generatePasscode(bookingId: number): Observable<ApiResponse<RoomPasscode>> {
    return this.http.post<ApiResponse<RoomPasscode>>(`${this.baseUrl}${API_ENDPOINTS.PASSCODES.GENERATE(bookingId)}`, {});
  }

  simulateDoorUnlock(passcodeId: number, pinEntered: string): Observable<ApiResponse<AccessAttemptResult>> {
    return this.http.post<ApiResponse<AccessAttemptResult>>(`${this.baseUrl}/passcodes/${passcodeId}/unlock`, { pinEntered });
  }
}
