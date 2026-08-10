import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthRepository } from '../contracts/auth.repository';
import { AuthStateService } from '../../services/auth-state.service';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  User,
  ApiResponse
} from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiAuthRepository implements AuthRepository {
  private http = inject(HttpClient);
  private authState = inject(AuthStateService);
  private baseUrl = environment.apiBaseUrl;

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`, request).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.authState.setAuth(res.data.user, res.data.accessToken);
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`, request).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.authState.setAuth(res.data.user, res.data.accessToken);
        }
      })
    );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, request);
  }

  getMe(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.ME}`);
  }

  updateProfile(updated: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}${API_ENDPOINTS.CUSTOMER.UPDATE_PROFILE}`, updated).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.authState.updateProfile(res.data);
        }
      })
    );
  }
}
