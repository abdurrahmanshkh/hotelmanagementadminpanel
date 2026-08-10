import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { AuthRepository } from '../contracts/auth.repository';
import { MockDatabaseService } from '../../services/mock-database.service';
import { AuthStateService } from '../../services/auth-state.service';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  User,
  ApiResponse,
  MockUserRecord
} from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MockAuthRepository implements AuthRepository {
  private dbService = inject(MockDatabaseService);
  private authState = inject(AuthStateService);

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const db = this.dbService.getSnapshot();
        const user = db.users.find(u => u.email.toLowerCase() === request.email.toLowerCase().trim());

        if (!user || user.mockPassword !== request.password) {
          return throwError(() => ({
            success: false,
            code: 'AUTH_INVALID_CREDENTIALS',
            message: 'Invalid email address or password.',
            timestamp: new Date().toISOString()
          }));
        }

        if (!user.active) {
          return throwError(() => ({
            success: false,
            code: 'USER_ACCOUNT_DISABLED',
            message: 'Your account is disabled. Please contact customer support.',
            timestamp: new Date().toISOString()
          }));
        }

        const sanitizedUser: User = { ...user };

        const authData: AuthResponse = {
          accessToken: `mock_jwt_token_${user.id}_${Date.now()}`,
          tokenType: 'Bearer',
          expiresIn: 86400,
          user: sanitizedUser
        };

        this.authState.setAuth(sanitizedUser, authData.accessToken);

        return of({
          success: true,
          message: 'Login successful.',
          data: authData,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const db = this.dbService.getSnapshot();
        const existing = db.users.find(u => u.email.toLowerCase() === request.email.toLowerCase().trim());

        if (existing) {
          return throwError(() => ({
            success: false,
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'An account with this email address already exists.',
            timestamp: new Date().toISOString()
          }));
        }

        const newId = this.dbService.nextId(db.users);
        const newUser: MockUserRecord = {
          id: newId,
          publicId: `USR-${String(newId).padStart(4, '0')}`,
          firstName: request.firstName.trim(),
          lastName: request.lastName.trim(),
          email: request.email.toLowerCase().trim(),
          phone: request.phone.trim(),
          mockPassword: request.password,
          role: 'CUSTOMER',
          dateOfBirth: request.dateOfBirth,
          governmentIdType: request.governmentIdType || 'AADHAAR',
          governmentIdMasked: request.governmentIdNumber ? `XXXX${request.governmentIdNumber.slice(-4)}` : undefined,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        db.users.push(newUser);
        this.dbService.saveDatabase(db);

        const sanitizedUser: User = { ...newUser };
        const authData: AuthResponse = {
          accessToken: `mock_jwt_token_${newUser.id}_${Date.now()}`,
          tokenType: 'Bearer',
          expiresIn: 86400,
          user: sanitizedUser
        };

        this.authState.setAuth(sanitizedUser, authData.accessToken);

        return of({
          success: true,
          message: 'Account created successfully.',
          data: authData,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<void>> {
    return of({
      success: true,
      message: 'Password reset link sent to your email address.',
      data: undefined as void,
      timestamp: new Date().toISOString()
    }).pipe(delay(environment.mockDelayMs));
  }

  getMe(): Observable<ApiResponse<User>> {
    const user = this.authState.currentUser();
    if (!user) {
      return throwError(() => ({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'You are not authenticated.',
        timestamp: new Date().toISOString()
      }));
    }
    return of({
      success: true,
      message: 'User profile retrieved.',
      data: user,
      timestamp: new Date().toISOString()
    }).pipe(delay(environment.mockDelayMs));
  }

  updateProfile(updated: Partial<User>): Observable<ApiResponse<User>> {
    return this.dbService.initialize().pipe(
      delay(environment.mockDelayMs),
      switchMap(() => {
        const currentUser = this.authState.currentUser();
        if (!currentUser) {
          return throwError(() => ({
            success: false,
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to update your profile.',
            timestamp: new Date().toISOString()
          }));
        }

        const db = this.dbService.getSnapshot();
        const userIndex = db.users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
          db.users[userIndex] = { ...db.users[userIndex], ...updated, updatedAt: new Date().toISOString() };
          this.dbService.saveDatabase(db);
          this.authState.updateProfile(updated);
        }

        return of({
          success: true,
          message: 'Profile updated successfully.',
          data: this.authState.currentUser()!,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
