import { User } from './user.models';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  governmentIdType?: string;
  governmentIdNumber?: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
