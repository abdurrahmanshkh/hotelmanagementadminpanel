import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { PasscodeRepository } from '../contracts/passcode.repository';
import { MockDatabaseService } from '../../services/mock-database.service';
import { RoomPasscode, AccessAttemptResult, ApiResponse, PasscodeStatus } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MockPasscodeRepository implements PasscodeRepository {
  private dbService = inject(MockDatabaseService);

  getPasscodeByBookingId(bookingId: number): Observable<ApiResponse<RoomPasscode>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const db = this.dbService.getSnapshot();
        const passcode = db.passcodes.find(p => p.bookingId === bookingId);

        if (!passcode) {
          const booking = db.bookings.find(b => b.id === bookingId);
          if (booking && (booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN')) {
            const newId = this.dbService.nextId(db.passcodes);
            const rawPin = String(Math.floor(100000 + Math.random() * 900000));
            const newPasscode: RoomPasscode = {
              id: newId,
              bookingId: booking.id,
              bookingReference: booking.bookingReference,
              roomId: booking.room.id,
              roomNumber: booking.room.roomNumber,
              userId: booking.userId,
              passcode: rawPin,
              maskedPasscode: `${rawPin.slice(0, 2)}XX${rawPin.slice(4)}`,
              status: 'ACTIVE',
              validFrom: booking.expectedCheckInAt,
              validUntil: booking.expectedCheckOutAt,
              failedAttempts: 0,
              maxAllowedAttempts: 5,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            db.passcodes.push(newPasscode);
            this.dbService.saveDatabase(db);

            return of({
              success: true,
              message: 'Digital passcode generated.',
              data: newPasscode,
              timestamp: new Date().toISOString()
            });
          }

          return throwError(() => ({
            success: false,
            code: 'PASSCODE_NOT_FOUND',
            message: 'No passcode available for this booking status.',
            timestamp: new Date().toISOString()
          }));
        }

        return of({
          success: true,
          message: 'Passcode retrieved.',
          data: passcode,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  generatePasscode(bookingId: number): Observable<ApiResponse<RoomPasscode>> {
    return this.getPasscodeByBookingId(bookingId);
  }

  simulateDoorUnlock(passcodeId: number, pinEntered: string): Observable<ApiResponse<AccessAttemptResult>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs + 200),
      switchMap(() => {
        const db = this.dbService.getSnapshot();
        const passcode = db.passcodes.find(p => p.id === passcodeId);

        if (!passcode) {
          return throwError(() => ({
            success: false,
            code: 'PASSCODE_NOT_FOUND',
            message: 'Digital passcode lock record not found.',
            timestamp: new Date().toISOString()
          }));
        }

        if (passcode.status === 'LOCKED') {
          const resLocked: AccessAttemptResult = {
            granted: false,
            message: 'Door lock disabled. Contact front desk for assistance.',
            status: 'LOCKED' as PasscodeStatus,
            remainingAttempts: 0,
            lockoutSeconds: 300
          };
          return of({
            success: false,
            message: 'Lock is temporarily disabled due to too many failed attempts.',
            data: resLocked,
            timestamp: new Date().toISOString()
          });
        }

        if (pinEntered.trim() === passcode.passcode) {
          passcode.failedAttempts = 0;
          this.dbService.saveDatabase(db);
          const resSuccess: AccessAttemptResult = {
            granted: true,
            message: `Door Unlocked! Green LED active. Welcome to Room ${passcode.roomNumber}.`,
            status: 'ACTIVE' as PasscodeStatus
          };
          return of({
            success: true,
            message: `Room ${passcode.roomNumber} Unlocked! Welcome.`,
            data: resSuccess,
            timestamp: new Date().toISOString()
          });
        }

        passcode.failedAttempts += 1;
        const remaining = Math.max(0, passcode.maxAllowedAttempts - passcode.failedAttempts);

        if (remaining === 0) {
          passcode.status = 'LOCKED';
          passcode.lockoutUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        }

        this.dbService.saveDatabase(db);

        const resFail: AccessAttemptResult = {
          granted: false,
          message: `Access Denied! ${remaining > 0 ? remaining + ' attempts remaining.' : 'Lockout triggered.'}`,
          status: passcode.status,
          remainingAttempts: remaining
        };

        return of({
          success: false,
          message: 'Incorrect passcode entered.',
          data: resFail,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
