import { Observable } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  User,
  ApiResponse
} from '../../models';

export abstract class AuthRepository {
  abstract login(request: LoginRequest): Observable<ApiResponse<AuthResponse>>;
  abstract register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>>;
  abstract forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<void>>;
  abstract getMe(): Observable<ApiResponse<User>>;
  abstract updateProfile(updated: Partial<User>): Observable<ApiResponse<User>>;
}
