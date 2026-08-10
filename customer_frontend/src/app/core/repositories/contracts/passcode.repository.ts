import { Observable } from 'rxjs';
import { RoomPasscode, AccessAttemptResult, ApiResponse } from '../../models';

export abstract class PasscodeRepository {
  abstract getPasscodeByBookingId(bookingId: number): Observable<ApiResponse<RoomPasscode>>;
  abstract generatePasscode(bookingId: number): Observable<ApiResponse<RoomPasscode>>;
  abstract simulateDoorUnlock(passcodeId: number, pinEntered: string): Observable<ApiResponse<AccessAttemptResult>>;
}
