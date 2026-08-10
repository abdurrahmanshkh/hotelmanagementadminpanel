export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN' | 'MANAGER';

export interface User {
  id: number;
  publicId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  dateOfBirth?: string;
  governmentIdType?: string;
  governmentIdMasked?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockUserRecord extends User {
  mockPassword: string;
}
