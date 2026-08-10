import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthRepository } from '../repositories/contracts';
import { Role, AdminUser, AuthResponse } from '../models';
import { STORAGE_KEYS } from '../constants';

describe('AuthService', () => {
  let service: AuthService;
  let mockAuthRepo: jasmine.SpyObj<AuthRepository>;
  let mockRouter: jasmine.SpyObj<Router>;

  const dummyUser: AdminUser = {
    id: 1,
    email: 'admin@example.com',
    fullName: 'Alexander Vance',
    role: Role.ADMIN,
    staffCode: 'STAFF2026',
    createdAt: '2026-01-01'
  };

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);

    mockAuthRepo = jasmine.createSpyObj('AuthRepository', ['login', 'logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockAuthRepo },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  });

  it('should be created and start unauthenticated if storage is empty', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });

  it('should authenticate user and store token on successful login', (done) => {
    const authRes: AuthResponse = {
      token: 'jwt_mock_token_123',
      user: dummyUser,
      expiresInSeconds: 86400
    };
    mockAuthRepo.login.and.returnValue(of({
      success: true,
      message: 'Success',
      data: authRes,
      timestamp: new Date().toISOString()
    }));

    service.login({ email: 'admin@example.com', password: 'Admin@123', staffCode: 'STAFF2026' }).subscribe(() => {
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.currentUser()?.email).toBe('admin@example.com');
      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe('jwt_mock_token_123');
      done();
    });
  });

  it('should clear session and navigate on logout', () => {
    mockAuthRepo.logout.and.returnValue(of({ success: true, message: 'OK', data: undefined, timestamp: '' }));
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
