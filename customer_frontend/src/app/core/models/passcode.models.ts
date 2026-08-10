export type PasscodeStatus =
  | 'NOT_GENERATED'
  | 'NOT_ACTIVE_YET'
  | 'ACTIVE'
  | 'LOCKED'
  | 'EXPIRED'
  | 'REVOKED';

export interface RoomPasscode {
  id: number;
  bookingId: number;
  bookingReference: string;
  roomId: number;
  roomNumber: string;
  userId: number;
  passcode: string;
  maskedPasscode: string;
  status: PasscodeStatus;
  validFrom: string;
  validUntil: string;
  failedAttempts: number;
  maxAllowedAttempts: number;
  lockoutUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessAttemptResult {
  granted: boolean;
  message: string;
  status: PasscodeStatus;
  remainingAttempts?: number;
  lockoutSeconds?: number;
}
